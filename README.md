# The Grid

A minimal real-time pixel canvas inspired by r/place.

Built with:

* Go
* WebSockets
* TypeScript
* HTML5 Canvas API
* Bun (frontend tooling)
* Nix Flakes (optional)
* In-memory state (no database)

---

## Features

* Real-time pixel synchronization
* Lightweight WebSocket server
* Minimal frontend (no framework)
* Single Go backend
* No database required
* Fast development setup

---

## Tech Stack

### Backend

* Go
* `github.com/coder/websocket`
* `net/http`

### Frontend

* TypeScript
* Vite (bundler)
* HTML5 Canvas
* CSS
* Bun (package manager / build tooling)

---

## Getting Started

### With Nix (recommended)

```bash
git clone https://gitlab.com/htl-villach/it/classes/3ahitm-2025/sew/game/sj25_26_3ahitm_game_weilerl
cd the_grid

nix develop

go mod tidy
air
bun run dev
```

Open:

```text
http://localhost:5173 (dev frontend)
http://localhost:4000 (backend)
```

---

### Without Nix

Requirements:

* Go 1.24+
* Bun

Install dependencies:

```bash
go mod tidy
cd frontend
bun install
```

---

## Development

Run backend:

```bash
air
```

Run frontend:

```bash
bun run dev
```

---

## Build

### Frontend build only

Build frontend into static files:

```bash
bun run build
```

Output:

```text
public/dist
```

---

### Full package build

Build everything via Nix:

```bash
bun run package
```

(This runs frontend build first, then `nix build`)

---

## Concept

```text
Browser Canvas
    ↓
WebSocket Connection
    ↓
Go WebSocket Server
    ↓
Shared In-Memory Grid State
    ↓
Broadcast Updates To All Clients
```

---

## Current Status

* [x] Go project setup
* [x] Nix development environment
* [x] Basic HTTP server
* [x] WebSocket server
* [x] Canvas rendering
* [x] Click-to-paint interaction
* [x] Shared pixel state
* [x] Real-time synchronization
* [x] Deployment setup
* [x] Rate limiting / cooldown
* [ ] Auto Deployment via SSH
* [ ] Multi-user testing
* [ ] Binary WebSocket protocol

---

## Goals

The project focuses on:

* simplicity
* performance
* minimalism
* real-time communication
* no frontend framework
* low overhead

---

## Future Ideas

* Pixel history
* Persistent canvas snapshots
* Chunk-based updates
* Binary packet protocol
* Redis PubSub scaling
* Multi-server support
* Custom Maps and Carinthia specific Map
