# CLAUDE.md

The Grid — minimalist real-time pixel canvas inspired by r/place. Go WebSocket backend (server-authoritative) + TypeScript/Vite frontend using HTML5 Canvas. Full details in `README.md`.

## Stack

* **Backend:** Go, `net/http`, WebSocket (`github.com/coder/websocket`)
* **Frontend:** TypeScript, Vite, HTML5 Canvas API, native WebSocket API
* **State:** In-memory pixel store (event log + snapshot persistence)
* **Persistence:** JSON snapshot files (crash recovery via startup restore)
* **Optional tooling:** Nix Flakes, `air` for Go live reload, Bun for frontend tooling

## Commands

Run commands in the respective directories:

```bash
# Backend (project root)
go mod tidy
air                # live reload (dev server)

# Frontend (frontend/)
bun install
bun run dev       # Vite dev server
bun run build     # production build -> public/dist
```

## Development URLs

```text
Frontend: http://localhost:5173
Backend:  http://localhost:4000
```

## Architecture (high level)

* **Server-authoritative canvas**

  * All pixel writes validated and applied on backend only
  * Clients are stateless renderers

* **WebSocket-based sync**

  * Lightweight JSON protocol
  * Delta/event-based updates broadcast via hub
  * Snapshot sync for full state recovery

* **Core backend components**

  * HTTP + WebSocket server
  * Hub-based broadcaster (fan-out to clients)
  * In-memory pixel grid
  * Event log (ring buffer)
  * Snapshot persistence layer (JSON file)

* **Frontend**

  * HTML5 Canvas rendering loop
  * Connection state machine (sync-aware UI)
  * Reconnect with backoff + jitter
  * Stateless client (no authoritative state)

## Conventions

* Server is the **single source of truth**
* Clients only send intents (pixel updates), never state
* All incoming messages are validated and rate-limited (cooldown per user)
* WebSocket messages are JSON-based and minimal
* Focus on simplicity over abstraction
* No heavy frontend framework — direct Canvas + TypeScript only

## Reliability & Sync Model

* Delta updates for real-time performance
* Snapshot fallback for reconnect / recovery
* Client reconnection with exponential backoff + jitter
* Basic offline detection
* Event buffer (ring buffer) prevents unbounded memory growth

## Persistence Model

* In-memory state for speed
* Snapshot saved as JSON for crash recovery
* Startup restore loads latest snapshot
* Event log used for incremental updates (limited buffer)

## Current System Status

### Implemented

* WebSocket server (Go)
* Real-time pixel synchronization
* Server-authoritative canvas state
* Event-based delta sync
* Snapshot recovery on startup
* Rate limiting per client
* Reconnect handling (backoff + jitter)
* Canvas rendering via HTML5 Canvas API

### In Progress / Planned

* Atomic snapshot writes (tmp → rename)
* Graceful shutdown persistence
* Periodic autosave loop
* WebSocket heartbeat (ping/pong)
* Concurrency audit
* Stale session cleanup

### Future Scaling

* Canvas chunking system
* Horizontal scaling (multi-server)
* Optional Redis PubSub layer
* Binary WebSocket protocol (performance optimization)

## Design Principles

* Minimal dependencies
* Low-latency real-time sync
* Server authority over all state
* Easy local development
* Hackable architecture (educational clarity over complexity)
* Predictable event flow over hidden magic

## Project Structure (conceptual)

* `backend/` → Go server (WebSocket hub, HTTP, state, persistence)
* `frontend/` → TypeScript Vite app (Canvas renderer, WS client)
* Snapshot files → persisted JSON canvas state
* Event buffer → short-lived delta history for sync

---

If something changes in the engine (rate limiting, sync format, or snapshot model), update backend + frontend together — they must stay aligned.

