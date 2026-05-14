Gut, dann machen wir das als **konkreten 3-Stunden-Implementierungsplan**, nicht als Theorie. Ziel: am Ende hast du ein stabileres System + den Cooldown/Reconnect-Bug sauber gelöst.

Ich teile es in 3 Blöcke à ~60 Minuten. Wenn du schneller bist, kannst du immer den nächsten Block früher starten.

---

# 🕒 0:00 – 1:00 → 🔥 Critical Fix: Cooldown + Sync State

## 🎯 Ziel

Nach Reload ist der Client sofort korrekt synchron:

* Cooldown stimmt
* UI stimmt
* keine „Fake-States“ mehr

---

## ✅ Backend (Go)

### 1. lastAction in Snapshot aufnehmen

In `internal/store.go` oder wo dein Snapshot ist:

Du gibst aktuell vermutlich nur Pixel + Version zurück.

👉 Ergänze:

```go
type Snapshot struct {
    Pixels      []Pixel
    Version     int64
    LastAction  map[string]int64
}
```

Wenn `LastAction` zu groß/unsicher ist:
👉 Alternative besser:

```go
NextAllowedAt map[string]int64
```

---

### 2. Snapshot wirklich mitgeben

Im Hub / WS handler:

* Stelle sicher, dass beim `hello` oder `init`:

  * Snapshot + cooldown state gesendet wird

---

## ✅ Frontend (TypeScript)

### 3. State erweitern

In `state.ts`:

```ts
export type ServerState = {
  pixels: Pixel[]
  version: number
  nextAllowedAt: Record<string, number>
}
```

---

### 4. Cooldown fix

In `cooldown.ts`:

```ts
export function getRemaining(nextAllowedAt: number) {
  return Math.max(0, nextAllowedAt - Date.now())
}
```

👉 UI darf NICHT lokal zählen.

---

### 5. Fix dein Bug direkt

Das Problem:

> nach reload UI falsch

👉 Fix:

* Beim WS init:

  * immer server state setzen
  * UI resetten

---

## 🧪 Test

* Pixel setzen
* Reload während cooldown
* UI muss korrekt sein

---

# 🕒 1:00 – 2:00 → 🔁 Reconnect System sauber bauen

## 🎯 Ziel

* kein kaputter Zustand nach reconnect
* kein „halb geladenes canvas“

---

## ✅ Frontend

### 1. persist client identity

In `ws.ts`:

```ts
const clientId = localStorage.getItem("clientId") || crypto.randomUUID()
localStorage.setItem("clientId", clientId)
```

---

### 2. reconnect message

```ts
socket.send(JSON.stringify({
  type: "hello",
  clientId,
  lastVersion: state.version
}))
```

---

### 3. reconnect logic

Implement:

* onclose → reconnect loop

```ts
setTimeout(connect, 1000)
```

👉 optional backoff (wenn du schnell bist)

---

## ✅ Backend

### 4. hello handler erweitern

Wenn client reconnectet:

* match clientId
* send full snapshot

---

## 🧪 Test

* WS disconnect (DevTools)
* reload page
* reconnect mid cooldown

---

# 🕒 2:00 – 3:00 → 🧱 Stability + Hardening

## 🎯 Ziel

System wird „nicht mehr random kaputt“

---

## 🔒 1. Mutex Audit (P0 wichtig)

Gehe durch `internal/hub.go`

Check:

### MUST be locked:

* connToID
* lastAction
* clients map

👉 alles was map ist:

```go
h.mu.Lock()
defer h.mu.Unlock()
```

---

## ⚡ 2. Broadcast safety fix

Wenn aktuell:

```go
client.conn.Write(msg)
```

👉 ersetzen durch:

```go
select {
case client.send <- msg:
default:
    // optional disconnect
}
```

Wenn du keine queue hast:
👉 minimal fix: timeout context

---

## 🧪 3. Multi-tab test

Jetzt wirklich testen:

* 3 Tabs
* spam clicks
* reload 1 tab
* disconnect 1 tab

Ziel:
👉 nichts darf crashen oder hängen

---

## 🧹 4. Quick cleanup

* remove stale logs
* check TODO.md update
* mark:

  * cooldown fix DONE
  * reconnect DONE (basic)

---

# 🧭 Ergebnis nach 3 Stunden

Wenn du das durchziehst, hast du:

### ✅ Fixes

* Cooldown state korrekt (server authoritative)
* Reload bug weg
* reconnect funktioniert stabil

### 🧱 Stability

* weniger race conditions
* safer broadcast
* sauberer sync flow

### 🚀 Architektur

* Frontend ist state-driven (kein Chaos mehr)
* Backend ist authoritative

---

# Wenn du schneller bist

Dann als nächster Schritt (Bonus):

👉 Chunked sync vorbereiten (P3 Richtung scaling)

oder

👉 Pixel history design (wird später richtig cool)

---

Wenn du willst, kann ich dir danach noch einen **„Next 2 Days Plan (Production-ready Version)“** machen, damit das Ding wirklich stabil deploybar wird.

