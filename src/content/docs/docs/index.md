---
title: Introduction
description: What Blentinel is, who it is for and how its documentation is organised.
---

Blentinel (the **Bl**ind S**entinel**) is open-source, self-hosted monitoring for managed service providers (MSPs) and anyone who looks after networks they can't reach into. It has two parts:

- A **probe**: one self-contained executable that you install **inside** each network you monitor, where it runs as a system service. It checks the devices and services it can reach there, and **pushes** signed, encrypted reports out to the hub.
- A **hub**: one server binary that accepts reports only from enrolled probes, stores the history, decides what is Up, Warning or Down, sends alerts and serves the web dashboard.

Every connection starts at a probe. The hub never initiates a connection into a client network: it only answers the probe's requests, and new checks and commands travel back in those answers. So a client network needs no inbound firewall rules, VPN or tunnel, and probes work behind NAT, carrier-grade NAT and strict firewalls.

What this means in practice:

- **Something must be installed inside.** Blentinel can't monitor a network from outside. Each monitored network needs at least one probe, on a Linux (systemd) or Windows machine there.
- **A probe needs two kinds of access:** outbound to the hub's address, and network access to the systems it checks. A network split into segments or VLANs may need a probe in each.
- **The hub needs an address the probes can reach**, typically a cloud VPS or a server with a public address.

:::caution[Pre-alpha]
Blentinel is usable, and used in production by its author, but it is not stable yet. Upgrades may require resetting the hub's database. Read the [changelog](https://github.com/mrjimmybob/blentinel/blob/main/CHANGELOG.md) before upgrading. See [Project status](/docs/status/).
:::

## Where to go next

- **[Architecture](/docs/architecture/)**: the probe, the hub, and what happens to a report.
- **[Security model](/docs/security/)**: signatures, sealing, enrollment, replay protection, and the known limitations.
- **[Install the hub](/docs/getting-started/hub/)**, then **[install a probe](/docs/getting-started/probe/)**.
- **[Configuration](/docs/reference/configuration/)** and **[Checks](/docs/reference/checks/)** reference summaries.

These pages are an overview. The authoritative, detailed documentation lives in the repository's [`docs/` folder](https://github.com/mrjimmybob/blentinel/blob/main/README.md#documentation); see [Full documentation](/docs/reference/repository-docs/).

## Design principles

Blentinel's design is bound by a few rules ([PRINCIPLES.md](https://github.com/mrjimmybob/blentinel/blob/main/docs/PRINCIPLES.md)):

1. **Push only:** probes connect out; the hub never connects to a probe.
2. **Zero-dependency probe:** one static binary; everything it needs lives in its own folder.
3. **Zero trust:** every report is signed and encrypted; the hub trusts nothing a probe can't prove.
4. **Resilient:** a probe keeps working and buffering while the hub is unreachable.
5. **Easy to install and run:** embedded database, no external services, managed from the web UI.
