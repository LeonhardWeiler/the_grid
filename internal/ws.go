package internal

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

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
		conn.Close(websocket.StatusNormalClosure, "")
	}()

	// INIT
	snap, version := h.Store.Snapshot()

	init, _ := json.Marshal(map[string]any{
		"type":    "init",
		"pixels":  snap,
		"version": version,
	})

	_ = conn.Write(context.Background(), websocket.MessageText, init)

	for {
		_, data, err := conn.Read(context.Background())
		if err != nil {
			return
		}

		var msg ClientMsg
		if err := json.Unmarshal(data, &msg); err != nil {
			continue
		}

		// 🔁 RECONNECT SYNC
		if msg.Type == "sync" {
			events := h.Store.GetSince(msg.LastVersion)

			// NEVER nil
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

		// 🎨 SET PIXEL
		if msg.Type == "set_pixel" {
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
		}
	}
}
