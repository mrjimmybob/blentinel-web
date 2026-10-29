---
title: Checks
description: The kinds of check a Blentinel probe can run, and how they reach the probe.
---

Checks are **records on the hub**. The hub sends each probe its checks in its signed answer to a report, and the probe runs a new set at once. Every check is limited to 30 seconds. The probe only measures; the hub decides whether a result is Up, Warning or Down.

Full reference, with every setting and metric: [docs/reference/checks.md](https://github.com/mrjimmybob/blentinel/blob/main/docs/reference/checks.md).

## Network and services

| Kind       | What it checks                                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| `ping`     | ICMP echoes to a host: loss, latency, jitter. Optionally falls back to a TCP port for hosts that drop pings.      |
| `http`     | A URL over HTTP or HTTPS: expected status codes, text that must or mustn't be there, headers, redirects.          |
| `tcp`      | Whether a port accepts a connection.                                                                              |
| `dns`      | Whether a name resolves, optionally to the expected answers, for several record types.                            |
| `tls`      | A server certificate's days until expiry, and whether a client would accept it.                                   |
| `snmp`     | Values from an SNMP agent (v2c or v3), including whole tables, each with its own limits.                          |
| `database` | Whether a PostgreSQL, MySQL/MariaDB, SQL Server or MongoDB server answers in its own protocol. No account needed. |
| `mail`     | Whether an SMTP, IMAP or POP3 server greets correctly, with the encryption asked for.                             |
| `ntp`      | How far the probe's clock is from a time server.                                                                  |
| `nut`      | What a UPS reports through its NUT server: battery, runtime, load.                                                |

## The probe's own machine

| Kind                      | What it checks                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `cpu`, `memory`, `uptime` | Usage and uptime.                                                                      |
| `disk`, `disks`           | One disk, or every fixed disk (reporting the fullest).                                 |
| `smart`                   | Drive health.                                                                          |
| `temperature`             | The hottest sensor against its own critical limit.                                     |
| `file`                    | A file, or the newest file in a folder: present, recent, big enough.                   |
| `service`                 | A Windows service or a systemd unit is running.                                        |
| `process`                 | How many of a program run, and their CPU and memory.                                   |
| `interface`               | A network interface's link and traffic.                                                |
| `eventlog`                | Errors that appear, or events that must appear, in a Windows event log (Windows only). |
| `updates`                 | Pending updates and restarts. Reported, never installed.                               |

## Templates and suggestions

The probe's page offers **templates** (a machine baseline, a website, a backup folder, a domain controller, and SNMP devices such as printers, switch ports, Synology and QNAP NAS and APC UPS) and **suggested checks** based on the disks, gateway and services the probe found on its machine.
