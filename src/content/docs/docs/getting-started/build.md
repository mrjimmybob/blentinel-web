---
title: Build from source
description: Build the Blentinel hub and probe from source with Rust and cargo-leptos.
---

The hub and probe are built from one Rust workspace. These steps summarise [CONTRIBUTING.md](https://github.com/mrjimmybob/blentinel/blob/main/CONTRIBUTING.md#set-up) and [docs/install/hub.md](https://github.com/mrjimmybob/blentinel/blob/main/docs/install/hub.md#1-build), which are authoritative.

## Requirements

- **Rust** (stable, edition 2024), from [rustup.rs](https://rustup.rs), with the WebAssembly target:

  ```sh
  rustup target add wasm32-unknown-unknown
  ```

- **cargo-leptos**, which builds the hub's web UI:

  ```sh
  cargo install cargo-leptos --locked
  ```

## Build a hub with probes

```sh
cargo build -p blentinelmake --release
./target/release/blentinelmake release keygen      # once: the key that signs probe releases
./target/release/blentinelmake hub publish --with-probes x86_64-unknown-linux-musl,x86_64-pc-windows-msvc
```

`release keygen` creates the **release key** on this machine, once. Keep its private half there and back it up: it signs every probe release and never goes to the hub. Hubs and probes built afterwards trust it.

`publish/hub-<date>/app/` then holds the `hub` binary and a `probes/` folder with a signed probe release for each platform listed. Copy both to the server, side by side, and install:

```sh
sudo ./hub install
```

On Windows, in an elevated PowerShell: `.\hub.exe install`.

## Just the probe

```sh
cargo build -p probe --release              # probe: target/release/probe
```

A plain `cargo build` without the release keys makes binaries that accept no signed release, so they can't update themselves. Use `blentinelmake` for anything you deploy.
