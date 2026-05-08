# The Grid (r/place Clone)

A simple real-time pixel canvas built with:

* Elixir / Phoenix
* WebSockets (Phoenix Channels)
* Vanilla Canvas (no frontend framework)
* Nix Flakes (optional, recommended)
* In-memory state (no database)

---

## Getting Started

### With Nix (recommended)

```bash
git clone https://gitlab.com/htl-villach/it/classes/3ahitm-2025/sew/game/sj25_26_3ahitm_game_weilerl
cd the_grid
nix develop
mix deps.get
mix phx.server
```

Open:

```
http://localhost:4000
```

---

### Without Nix

Requirements:

* Elixir 1.16+
* Erlang/OTP 26+

```bash
mix deps.get
mix phx.server
```

---

## Concept

Browser Canvas
→ WebSocket connection
→ Phoenix Channels
→ shared pixel state (server-side)
→ broadcast updates to all clients in real time

---

## Roadmap

* [x] Phoenix project setup
* [x] Nix development environment (flakes)
* [x] Basic HTTP server running
* [ ] Canvas frontend (drawing + rendering grid)
* [ ] WebSocket pixel updates (real-time sync)
* [ ] Shared grid state implementation (ETS)
* [ ] Click-to-paint interaction
* [ ] Basic rate limiting (anti-spam / cooldown per user)
* [ ] Multi-user synchronization tested
* [ ] Deployment setup (optional)
