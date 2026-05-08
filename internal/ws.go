package internal

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/coder/websocket"
)

type ClientMsg struct {
	Type        string `json:"type"`
	X           int    `json:"x"`
	Y           int    `json:"y"`
	Color       string `json:"color"`
	LastVersion int    `json:"lastVersion"`
}

func HandleWS(h *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	h.Add(conn)

	defer func() {
		h.Remove(conn)
		delete(h.lastAction, conn) // 🧼 cleanup
		conn.Close(websocket.StatusNormalClosure, "")
	}()

	// =========================
	// INIT SNAPSHOT
	// =========================
	snap, version := h.Store.Snapshot()

	init, _ := json.Marshal(map[string]any{
		"type":    "init",
		"pixels":  snap,
		"version": version,
	})

	_ = conn.Write(context.Background(), websocket.MessageText, init)

	// =========================
	// MESSAGE LOOP
	// =========================
	for {
		_, data, err := conn.Read(context.Background())
		if err != nil {
			return
		}

		var msg ClientMsg
		if err := json.Unmarshal(data, &msg); err != nil {
			continue
		}

		// =========================
		// RECONNECT SYNC
		// =========================
		if msg.Type == "sync" {
			events := h.Store.GetSince(msg.LastVersion)

			if events == nil {
				events = []Event{}
			}

			out, _ := json.Marshal(map[string]any{
				"type":   "sync",
				"events": events,
			})

			_ = conn.Write(context.Background(), websocket.MessageText, out)
			continue
		}

		// =========================
		// SET PIXEL + COOLDOWN
		// =========================
		if msg.Type == "set_pixel" {

			now := time.Now().UnixMilli()
			cooldown := int64(5000)

			last := h.lastAction[conn]

			// ⛔ still in cooldown
			if now-last < cooldown {
				end := last + cooldown

				out, _ := json.Marshal(map[string]any{
					"type": "cooldown",
					"end":  end,
				})

				_ = conn.Write(context.Background(), websocket.MessageText, out)
				continue
			}

			// ✅ update last action FIRST
			h.lastAction[conn] = now

			// 🎨 set pixel
			key := fmt.Sprintf("%d:%d", msg.X, msg.Y)

			ev := h.Store.Set(key, msg.X, msg.Y, msg.Color)

			out, _ := json.Marshal(map[string]any{
				"type":    "pixel_update",
				"version": ev.Version,
				"x":       ev.X,
				"y":       ev.Y,
				"color":   ev.Color,
			})

			h.Broadcast(out)

			// ⏱️ IMPORTANT:
			// sofort cooldown senden → UI startet direkt nach successful click
			end := now + cooldown

			cd, _ := json.Marshal(map[string]any{
				"type": "cooldown",
				"end":  end,
			})

			_ = conn.Write(context.Background(), websocket.MessageText, cd)
		}
	}
}
