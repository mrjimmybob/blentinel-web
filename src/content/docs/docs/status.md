---
title: Project status
description: What state Blentinel is in, what is still being built, and known limitations.
---

Blentinel is **pre-alpha**. The workspace version is `0.1.0`. It is usable and used in production by its author, but:

- **Upgrades can be breaking.** The probe protocol and database schema still change between versions. Some upgrades have required deleting the hub's database or reinstalling probes once. Every breaking change is listed in the [changelog](https://github.com/mrjimmybob/blentinel/blob/main/CHANGELOG.md).
- **The hub is supported on Linux** (x86_64 and ARM64, with systemd). It runs on Windows on a best-effort basis.
- **Probes run on Linux with systemd and on Windows.** Signed probe releases can be built for `x86_64` and `aarch64` Linux (musl), `armv7` Linux (Raspberry Pi) and `x86_64` Windows.
- **No release is published yet.** Release automation is on hold, and the GitHub repository has no releases, so the signed installer (`hub.sh`) has nothing to download. Build from source for now (see [Build from source](/docs/getting-started/build/)).

## Known limitations

These come from the project's own security and architecture documentation:

- **No forward secrecy against theft of the hub key.** Each report uses a fresh probe key, but the hub's key is long-lived. Anyone with `hub_identity.key` and recorded past traffic can decrypt those reports. HTTPS adds a transport layer with forward secrecy.
- **Clocks matter.** The hub refuses reports more than 5 minutes in the future or more than 7 days old. Run NTP on probe machines.
- **Buffering is bounded.** A probe holds back at most 7 days or 20,000 reports while the hub is unreachable.
- **Every probe must reach the hub.** Push means the hub needs an address the probes' networks can reach.
- **A probe sees what its network sees.** A device is only checked if a probe that can reach it is asked to check it.

## What's next

The [roadmap](https://github.com/mrjimmybob/blentinel/blob/main/docs/ROADMAP.md) is the single source of truth for planned work. Nothing on the roadmap is described on this site as available.
