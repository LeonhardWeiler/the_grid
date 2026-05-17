# Jetzt ist der richtige nächste Schritt

Nicht neue Features.

Nicht Binary Protocol.

Nicht Chunking.

---

# Jetzt kommt:

# ✅ Frontend Connection State Machine

Das ist jetzt der wichtigste Architekturfix.

Warum?

Weil dein Backend mittlerweile korrekt genug ist,
dass die meisten zukünftigen Bugs jetzt vom Frontend-Lifecycle kommen werden.

Aktuell:

```text
WebSocket OPEN
!=
Canvas synchronized
!=
Client ready
```

Aber dein UI behandelt alles als:

```text
connected
```

Das wird später zu:

* ghost clicks
* stale canvas
* reconnect race conditions
* fake online state

führen.

---

# EXAKTE TODO REIHENFOLGE AB JETZT

---

# STEP 1 — State erweitern

## Datei

```text
frontend/src/state.ts
```

---

## Aktuell

```ts
status:
  | "connecting"
  | "connected"
  | "disconnected"
```

---

## Neu

```ts
status:
  | "connecting"
  | "handshaking"
  | "connected"
  | "reconnecting"
  | "disconnected"
```

---

# Bedeutung der States

## connecting

WebSocket wird geöffnet.

---

## handshaking

Socket offen, aber:

* init/sync noch nicht fertig

---

## connected

Canvas vollständig synchronisiert.

---

## reconnecting

Verbindung verloren → reconnect loop aktiv.

---

## disconnected

Optional später:

* hard failure
* manual disconnect
* offline

---

# STEP 2 — `ws.ts` Flow korrigieren

## Aktuell falsch

```ts
ws.onopen = () => {
	connection.status = "connected"
}
```

---

# Neu

## onopen

```ts
connection.status = "handshaking"
```

Denn:

* socket offen
* aber noch nicht synced

---

# STEP 3 — connected erst nach init/sync

In:

```ts
case "init"
```

und:

```ts
case "sync"
```

am Ende:

```ts
connection.status = "connected"
```

---

# Warum das wichtig ist

Erst DANN gilt:

```text
client state == server state
```

Vorher nicht.

---

# STEP 4 — reconnect state korrigieren

## Aktuell

```ts
connection.status = "disconnected"
```

---

## Neu

```ts
connection.status = "reconnecting"
```

weil:

* reconnect läuft bereits

---

# STEP 5 — UI erweitern

## Datei

```text
frontend/src/ui/connection.ts
```

---

# Neue Zustände

## connecting

```text
Connecting socket...
```

---

## handshaking

```text
Syncing canvas...
```

---

## reconnecting

```text
Reconnecting...
```

---

## connected

Overlay verstecken.

---

# STEP 6 — Exponential Backoff

Danach.

Nicht vorher.

---

# Ziel

Aktuell:

```ts
setTimeout(connect, 1000)
```

Später:

```text
1s
2s
5s
10s
```

mit max cap.

---

# STEP 7 — README/TODO Cleanup

Danach.

---

# Was du NACH der State Machine machen solltest

Dann kommt:

# 🔥 Full Hub Concurrency Audit

Dann prüfen wir:

* locks
* iteration safety
* disconnect races
* map ownership
* cancellation paths

---

# Was du NICHT jetzt machen solltest

Noch NICHT:

* binary websocket protocol
* chunk system
* redis
* multi-server
* replay system

Das wäre zu früh.

---

# Dein aktueller Architekturstatus

Ehrlich:

Du bist jetzt an dem Punkt:

```text
"funktioniert"
```

→ vorbei.

Jetzt beginnt:

```text
"deterministic realtime correctness"
```

Und genau da sind:

* connection states
* sync lifecycle
* concurrency correctness

die wichtigen Themen.

