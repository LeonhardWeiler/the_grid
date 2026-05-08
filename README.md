# The Grid

A minimal real-time pixel canvas inspired by r/place.

Built with:

* Go
* WebSockets
* Vanilla HTML/CSS/JS
* HTML Canvas API
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

* Vanilla JavaScript
* HTML5 Canvas
* CSS

---

## Getting Started

### With Nix (recommended)

```bash
git clone https://gitlab.com/htl-villach/it/classes/3ahitm-2025/sew/game/sj25_26_3ahitm_game_weilerl
cd the_grid

nix develop

go mod tidy
air
```

Open:

```text
http://localhost:4000
```

---

### Without Nix

Requirements:

* Go 1.24+

Install dependencies:

```bash
go mod tidy
```

Run the server:

```bash
go run .
```

Or with hot reload:

```bash
air
```

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
* [ ] Auto Deployment via SSH
* [ ] Rate limiting / cooldown
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

* User cooldown system
* Pixel history
* Persistent canvas snapshots
* Chunk-based updates
* Binary packet protocol
* Redis PubSub scaling
* Multi-server support
