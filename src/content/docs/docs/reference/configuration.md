---
title: Configuration
description: An overview of the Blentinel hub's configuration file and the probe's files.
---

Only the **hub** has a configuration file. The **probe** has none: its checks and report interval are managed on the hub and sent to it.

Full reference, with every key: [docs/reference/configuration.md](https://github.com/mrjimmybob/blentinel/blob/main/docs/reference/configuration.md).

## Hub: `blentinel_hub.toml`

Generate a fully commented starting point with `hub --init`. An installed hub's config is at `/etc/blentinel/blentinel_hub.toml` on Linux. The hub **reloads the file automatically** when it changes: the new file is validated, and if anything fails the old configuration is kept.

| Section        | What it sets                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `[server]`     | Listen address and port, state directory, database path, the identity key path, `probe_timeout_secs` (default 300) and `behind_proxy`. |
| `[server.tls]` | HTTPS, **on by default**. Certificate and key paths (a self-signed pair is generated if missing) and `https_port` (default 3443).      |
| `[retention]`  | Database size warnings and optional automatic archiving of old data.                                                                   |
| `[backups]`    | Where backups are written. When they run and how many are kept is set on the admin page.                                               |
| `[upgrades]`   | Where hub releases come from for `hub upgrade`.                                                                                        |

**Not in the file:** alert channels, routing rules and the mail server are set on the hub's **Alerts** page. Thresholds are set on the admin, company and probe pages.

## Probe files

The probe writes these in its own folder; nothing is edited by hand.

| File              | What it is                                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `config.json`     | The checks and interval the hub sent last. The probe runs it after a restart and while the hub is unreachable.                     |
| `enrollment.json` | Written by `probe install --code`: the hub's address, its public keys and certificate pin, and the probe's name, company and site. |
