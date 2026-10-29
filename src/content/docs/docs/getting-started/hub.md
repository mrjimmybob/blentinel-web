---
title: Install the hub
description: Install the Blentinel hub on a Linux server with systemd, check on it and back it up.
---

The hub is **one file**. Its web UI is built in, and it installs, checks, backs up and removes itself. Linux (x86_64, ARM64) with systemd is supported. Windows works on a best-effort basis.

The authoritative guide, with every option, is [docs/install/hub.md](https://github.com/mrjimmybob/blentinel/blob/main/docs/install/hub.md).

## Where to run it

The hub must have an address that every probe can reach **outbound**, for example a cloud VPS or a server with a public address. The client networks themselves need no inbound rules: probes connect to the hub, never the other way round.

## Install it today: build from source

Blentinel is pre-alpha and no release is published on GitHub yet, so the current path is to [build from source](/docs/getting-started/build/), copy the output to the server and install it as a service:

```sh
sudo ./hub install            # Linux, from publish/hub-<date>/app/
```

On Windows, in an elevated PowerShell: `.\hub.exe install`.

## Once a release is published: the signed installer

The repository includes an installer script, `hub.sh`, that is attached to each GitHub release. It downloads `SHA256SUMS`, checks its **Ed25519 signature** against the release keys written into the script, downloads the hub for the machine (x86_64 or aarch64) and the signed probe release, checks each against its signed SHA-256, and runs `hub install`. If any check fails, nothing is installed. It needs `curl` or `wget`, `openssl`, `sha256sum` and `tar`.

:::caution[Not available yet]
These commands only work once a release with `hub.sh` has been published on [GitHub Releases](https://github.com/mrjimmybob/blentinel/releases).
:::

Prefer downloading the script, reading it and checking it before running it as root:

```sh
curl -fsSLO https://github.com/mrjimmybob/blentinel/releases/latest/download/hub.sh
curl -fsSLO https://github.com/mrjimmybob/blentinel/releases/latest/download/SHA256SUMS
less hub.sh                   # about 100 lines
grep ' hub.sh$' SHA256SUMS | sha256sum -c -
sudo sh hub.sh
```

Checking against `SHA256SUMS` confirms the script matches the release's list of checksums; the script then checks that list's signature itself before installing anything.

The project's docs also give the one-line form, `curl -fsSL …/hub.sh | sudo sh`, which runs the same checks but gives you no chance to read the script first.

## What it sets up

|                                           | Linux                                          | Windows                                           |
| ----------------------------------------- | ---------------------------------------------- | ------------------------------------------------- |
| Program                                   | `/opt/blentinel/hub/hub`                       | `C:\Program Files\Blentinel\Hub\hub.exe`          |
| Config                                    | `/etc/blentinel/blentinel_hub.toml`            | `C:\ProgramData\Blentinel\Hub\blentinel_hub.toml` |
| Data (database, keys, TLS files, backups) | `/var/lib/blentinel` (`0700`)                  | `C:\ProgramData\Blentinel\Hub`                    |
| Service                                   | systemd unit `blentinel-hub`, user `blentinel` | Windows service `BlentinelHub`                    |

A first install listens on all interfaces: port **3000** (plain HTTP, probe endpoints only) and **3443** (HTTPS: the web UI, and probes). Open both in the firewall. Probes must be able to reach the hub on one of them.

## First login

Open the address the installer printed. The browser warns about the **self-signed certificate** the first time: compare its fingerprint with the one in the hub's log, then accept it. **Set up Blentinel** asks for the setup code and creates the first Owner. Then add users, add a company and a site, and [install a probe](/docs/getting-started/probe/).

To use your own certificate, a reverse proxy, or a certificate from Let's Encrypt, see [docs/install/https.md](https://github.com/mrjimmybob/blentinel/blob/main/docs/install/https.md).

## Looking after it

```sh
hub status      # service, ports, database, probes, certificate expiry, pending setup code
hub doctor      # checks, with what to do about each problem
sudo hub backup
```

The hub backs itself up every day (03:00 UTC, keeping the last 7 by default; change it on the admin page) and before every database upgrade. A backup contains the hub's private key: keep it like the key itself.
