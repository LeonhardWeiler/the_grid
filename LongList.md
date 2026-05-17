# The Grid — Next Steps Roadmap

---

# PHASE 1 — Correctness & Stability

## 1. Fix `SendToClientID` mutex leak

### Goal

Prevent hidden deadlocks / stuck hub state.

### Problem

`RLock()` is not released on early return.

### Action

* Refactor `SendToClientID`
* Always unlock before returning
* Remove duplicate map lookup

### Result

Safe concurrent hub access.

---

# 2. Implement proper connection state machine

### Goal

Frontend connection state reflects REAL sync state.

### Current Problem

`connected` is set immediately after websocket open.

But:

* canvas may not be synced yet
* init/sync may still be pending

### Add States

```ts
connecting
handshaking
connected
reconnecting
disconnected
```

### Result

Deterministic reconnect lifecycle.

---

# 3. Only mark connected AFTER init/sync

### Goal

Prevent fake-ready UI state.

### Action

Move:

```ts
connection.status = "connected"
```

from:

```ts
ws.onopen
```

to:

```ts
init/sync message handler
```

### Result

UI only becomes ready after full synchronization.

---

# 4. Improve reconnect handling

### Goal

Prevent reconnect spam storms.

### Current Problem

Infinite fixed reconnect loop:

```ts
setTimeout(connect, 1000)
```

### Action

Add exponential backoff:

* 1s
* 2s
* 5s
* 10s
* max cap

Reset delay after successful reconnect.

### Result

Stable reconnect behavior during outages.

---

# 5. Improve connection overlay UI

### Goal

Make connection state understandable.

### Add UI states

* Connecting socket...
* Syncing canvas...
* Reconnecting...
* Offline

### Result

Cleaner UX and easier debugging.

---

# PHASE 2 — Persistence Finalization

## 6. Add autosave loop

### Goal

Prevent data loss on restart/crash.

### Action

Periodic save:

* every 10–30 seconds

### Save:

* snapshot
* current version

### Result

Canvas survives restart.

---

# 7. Add save-on-shutdown

### Goal

Prevent losing latest changes.

### Action

On SIGINT/SIGTERM:

* save snapshot
* gracefully stop server

### Result

Clean shutdown persistence.

---

# 8. Add atomic snapshot writes

### Goal

Prevent corrupted snapshot files.

### Action

Write to:

```text
snapshot.tmp
```

then rename:

```text
snapshot.json
```

### Result

Crash-safe persistence.

---

# PHASE 3 — Concurrency Hardening

## 9. Full hub concurrency audit

### Goal

Remove future race-condition bugs.

### Audit

* clients
* connToID
* idToClients
* lastAction

### Verify

* all reads locked
* all writes locked
* no iteration without protection

### Result

Production-safe hub concurrency.

---

# 10. Cleanup stale cooldown entries

### Goal

Prevent unbounded map growth.

### Current State

`lastAction` grows forever.

### Action

Periodic cleanup:

* remove inactive IDs after X hours/days

### Result

Stable long-term memory usage.

---

# PHASE 4 — Reliability Improvements

## 11. Add websocket ping/pong handling

### Goal

Detect dead sockets properly.

### Result

More reliable disconnect detection.

---

# 12. Add offline browser detection

### Goal

Improve reconnect UX.

### Action

Use:

```ts
window.navigator.onLine
```

### Result

Cleaner reconnect behavior.

---

# 13. Add reconnect jitter

### Goal

Prevent synchronized reconnect storms.

### Action

Small random reconnect delay.

### Result

Better scalability.

---

# PHASE 5 — Performance & Scaling

## 14. Optimize snapshot generation

### Goal

Reduce expensive full map copies.

### Current State

Full copy on every snapshot.

### Future Options

* SnapshotMeta()
* copy-on-write
* immutable snapshot

### Result

Better scaling for large canvases.

---

# 15. Binary websocket protocol

### Goal

Reduce:

* bandwidth
* allocations
* JSON overhead

### Result

Much higher throughput.

---

# 16. Chunked canvas architecture

### Goal

Scale to larger worlds.

### Action

Split canvas into regions/chunks.

### Result

Selective sync + lower bandwidth.

---

# 17. Per-client write queues

### Goal

Isolate slow clients completely.

### Result

Broadcast loop never affected by slow consumers.

---

# PHASE 6 — Features

## 18. Pixel history

Track:

* who placed
* when placed

---

## 19. Timelapse / replay system

Replay canvas evolution.

---

## 20. Heatmap

Visualize activity intensity.

---

## 21. Mobile gesture support

Touch controls:

* pinch zoom
* drag
* tap paint

---

## 22. Factions / teams

Optional multiplayer grouping system.

---

# Suggested Immediate Order

## NOW

1. Fix `SendToClientID`
2. Connection state machine
3. Connected-after-sync
4. Reconnect backoff
5. Autosave loop

---

## AFTER THAT

6. Concurrency audit
7. Atomic persistence
8. Cleanup jobs

---

## MUCH LATER

9. Binary protocol
10. Chunking
11. Multi-server scaling

