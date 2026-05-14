# The Grid - TODO

## 🔴 P0 - CRITICAL (Stability / Data loss prevention)

### [ ] Persistence System (SAVE/LOAD CANVAS)
- Save PixelStore to disk (JSON or binary snapshot)
- Load snapshot on startup
- Periodic autosave (e.g. every 10-30 seconds)
- Ensure version continuity after restart

---

### [ ] Event Log Limitation (Memory safety)
- Replace unbounded `events []Event`
- Implement:
  - ring buffer OR
  - max event cap (e.g. last 100k events)
- Ensure GetSince still works correctly

---

### [ ] Hub concurrency hardening
- Ensure ALL access to:
  - connToID
  - lastAction
- is properly mutex-protected
- audit for missing locks in all methods

---

## 🟠 P1 - IMPORTANT (scaling + abuse resistance)

### [ ] Improved rate limiting
- Add optional IP-based rate limit fallback
- Prevent reconnect spam abuse
- Add burst protection (short-term spam spikes)

---

### [ ] Broadcast stability improvements
- Ensure no blocked writes can affect system
- Consider per-client write timeout (optional)

---

### [ ] Server-side validation hardening
- Strict color whitelist enforcement (already partial)
- Strict coordinate bounds enforcement (verify full coverage)
- Max message size enforcement (verify full coverage)

---

## 🟡 P2 - UX / CLIENT RELIABILITY

### [ ] Client reconnect handling
- Implement robust reconnect logic
- Store lastVersion client-side
- Auto-resync on reconnect

---

### [ ] Better sync strategy
- Optimize sync for large event history
- Consider chunked sync responses

---

## 🟢 P3 - PERFORMANCE / SCALING (optional now)

### [ ] Remove JSON overhead (future optimization)
- Move to binary protocol
- Reduce allocations in hot path

---

### [ ] Chunked canvas system
- Split world into regions
- Only sync affected chunks

---

### [ ] Write queue per client (advanced)
- Avoid blocking broadcast loops

---

## 🔵 P4 - FEATURES (nice-to-have)

### [X] Minimap UI
### [ ] Pixel history (who painted what)
### [ ] Heatmap of activity
### [ ] Mobile gesture support
### [ ] Timelapse / replay system
### [ ] Factions / teams system
