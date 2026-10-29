---
title: Security model
description: How Blentinel authenticates probes, protects reports in transit, prevents replays and secures updates, and what it does not protect against.
---

Blentinel is designed so a probe can report from any network without opening inbound ports, and so the hub believes nothing a probe can't prove. This page summarises [security.md](https://github.com/mrjimmybob/blentinel/blob/main/docs/security.md), which is authoritative.

| Protection                              | How                                                                                                                                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No inbound access to client networks    | Probes only make outbound requests. The hub never initiates a connection to a probe.                                                                                                                 |
| Only enrolled probes are accepted       | A probe joins with a short-lived enrollment code from the hub's UI. The hub keeps a record per probe and can revoke it.                                                                              |
| The hub decides who a probe reports for | The company and site come from the probe's record, never from the report.                                                                                                                            |
| Probes trust only their hub             | The enrollment code pins the hub's encryption key, signing key and TLS certificate key. There is no trust-on-first-use step.                                                                         |
| Reports can't be forged or altered      | Every report is signed with the probe's Ed25519 key. Unsigned reports are rejected.                                                                                                                  |
| Reports can't be read in transit        | Every report is sealed for the hub (X25519 + ChaCha20-Poly1305), with or without TLS.                                                                                                                |
| Reports can't be replayed               | A timestamp window plus "must be newer than the last stored report".                                                                                                                                 |
| The hub's answers can't be forged       | Each answer is signed by the hub, sealed for that probe and bound to the report it answers.                                                                                                          |
| Transport encryption                    | The web UI and API are HTTPS-only by default. Probes use HTTPS pinned to the hub's certificate key, unless enrolled with an `http://` address; their reports are still signed and sealed end to end. |
| Web UI access                           | Personal accounts with roles, argon2id password hashes, `HttpOnly` + `SameSite=Strict` session cookies, CSRF protection, login rate limiting, and a permission check on every route.                 |

## Cryptography

The probe and hub share one implementation of the wire format and its cryptography (`common/src/crypto.rs`):

| Purpose                                                | Algorithm                                                               |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| Probe identity and report signatures                   | Ed25519                                                                 |
| Hub answer signatures                                  | Ed25519 (key derived from the hub's identity key)                       |
| Sealing reports for the hub, and answers for the probe | X25519 key agreement + ChaCha20-Poly1305                                |
| Hub web UI and probe transport                         | TLS (HTTPS by default for the UI; probes pin the hub's certificate key) |

## Probe identity and sealing

On first run each probe creates an **Ed25519 key pair**; its public key is the probe's ID. The probe signs every report, then seals it for the hub: it creates a **fresh X25519 key pair per report**, derives a shared secret with the hub's long-term X25519 public key, and encrypts with **ChaCha20-Poly1305**. Only the holder of the hub's private key can open it.

## Enrollment

**Add probe** creates a code (`BLT1-…`) that carries the hub's address, its public keys, a pin of its TLS certificate's public key, and a one-time secret. The code decides the probe's **company and site**. Codes expire (24 hours by default, 30 days at most), can be limited to a number of uses and can be revoked. Treat a code like a password until then.

The one-line probe install downloads the binary without trusting the connection. What makes it safe is the **SHA-256 in the command**, copied from the hub's HTTPS page: the file only runs if its hash matches.

## Replay protection

- The signed timestamp must be at most **5 minutes in the future** and at most **7 days old**.
- A report must be **strictly newer** than the probe's latest stored report. The check and the insert are one atomic statement.

## Updates

- **Probe releases are signed with a release key that never reaches the hub.** A probe installs only a release signed with a key compiled into it, so a compromised hub can at worst withhold an update.
- Probes refuse older versions unless a **signed rollback** allows it.
- A new version must pass a self-test and then report within 15 minutes, or the previous binary comes back.
- The hub itself is **never upgraded unattended**. An admin runs `hub upgrade`, which verifies the signed release and rolls back if the new hub doesn't keep running.

## Limitations

:::caution

- **No forward secrecy against theft of the hub key.** Anyone with `hub_identity.key` and recorded past traffic can decrypt those reports. Protect it like a password database. HTTPS adds a transport layer with forward secrecy.
- Deleting a probe's data in the admin UI also removes its latest-report marker, so a report captured in the last 7 days could be replayed once afterwards.
- A check's secrets (such as SNMP communities) are stored in clear in the probe's private folder, because the probe must run its checks while the hub is away. An SNMP v2c community crosses the network in clear; v3 with privacy doesn't.
  :::

The full list of files to protect, and what happens if each is leaked or lost, is in [security.md](https://github.com/mrjimmybob/blentinel/blob/main/docs/security.md#files-to-protect).
