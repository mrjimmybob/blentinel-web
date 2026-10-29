---
title: Install a probe
description: Enroll a Blentinel probe in a client network with the one-line command from the hub, then give it checks.
---

A probe is one self-contained binary that runs inside a client network. It needs **outbound** access to the hub's address and nothing inbound. It runs on **Linux with systemd** (any distribution; the binary is static) and on **Windows**.

## Requirements

- **A machine inside the network you want to monitor.** Blentinel can't monitor a network from outside: the probe runs there and checks what it can reach locally.
- **Linux with systemd, or Windows.** The probe is one self-contained executable, installed as a system service. It needs no runtime, database or other service: its report buffer is an SQLite file in its own folder, with SQLite compiled into the binary.
- **Outbound access to the hub's address**, and **network access to the systems it checks**. No inbound firewall rules are needed: the hub never initiates a connection to the probe.
- **More probes where one can't reach everything**, such as separate segments, VLANs or sites.

The authoritative guide is [docs/install/probe.md](https://github.com/mrjimmybob/blentinel/blob/main/docs/install/probe.md).

## 1. Add probe (on the hub)

In the hub's web UI: **Companies** → the company → **Add probe**. The company needs a site first. Choose the site, optionally a name, how long the code is valid (24 hours by default) and how many probes may use it.

The hub shows the enrollment code **once**, and one line to run for each platform it has a probe binary for.

## 2. Run the line on the machine

Copy the line from the hub. It holds that code and that file's checksum. On Linux run it in a shell (it asks for `sudo`). On Windows run it in PowerShell **as Administrator**. It:

1. **downloads** the probe from the hub;
2. **checks its SHA-256** against the one shown on the hub's HTTPS page, and runs nothing if it doesn't match;
3. runs **`probe install --code …`**, which copies the probe into its folder, **enrolls** it (pinning the hub's certificate and keys from the code), registers the **service** and starts it.

|         | Linux                                                                | Windows                             |
| ------- | -------------------------------------------------------------------- | ----------------------------------- |
| Folder  | `/var/lib/blentinel-probe` (`0700`)                                  | `C:\Program Files\Blentinel\Probe`  |
| Service | systemd `blentinel-probe`, own user, allowed to ping (`CAP_NET_RAW`) | Windows service `BlentinelProbe`    |
| Log     | `journalctl -u blentinel-probe` and `blentinel_probe.log`            | `blentinel_probe.log` in the folder |

If the hub offers no binary for a platform, copy the probe there yourself and run `probe install --code BLT1-…` as root or Administrator.

## 3. Give it checks (on the hub)

What a probe checks, and how often, is set on the hub. A new probe checks nothing until it has checks, and reports every 60 seconds. On the probe's page you can:

- **Add check** of any [kind](/docs/reference/checks/).
- Apply **Templates…**: a machine baseline, a website, a backup folder, a domain controller, or SNMP devices such as printers, switch ports, Synology or QNAP NAS and APC UPS.
- Accept **suggested checks** from what the probe found on its machine.
- **Copy checks from…** another probe, set **Report every (seconds)** (5–3600), and **Run checks now**.

## Checking on it

```sh
sudo /var/lib/blentinel-probe/probe status
sudo /var/lib/blentinel-probe/probe doctor
```

`doctor` checks the service, the folder, the identity, the enrollment, whether the hub answers through its pinned certificate, and the clock against the hub's. The hub refuses reports from a clock more than 5 minutes off.

Probes update themselves from their hub once an admin approves a signed release. See [Updates](https://github.com/mrjimmybob/blentinel/blob/main/docs/install/probe.md#updates).
