package internal

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"fmt"

	"github.com/coder/websocket"
)

type ClientMsg struct {
	Type  string `json:"type"`
	X     int    `json:"x"`
	Y     int    `json:"y"`
	Color string `json:"color"`
}

func HandleWS(h *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	h.Add(conn)

	// send full snapshot + version
	snapshot, version := h.Store.GetSnapshot()

	init, _ := json.Marshal(map[string]any{
		"type":    "init",
		"pixels":  snapshot,
		"version": version,
	})

	_ = conn.Write(context.Background(), websocket.MessageText, init)

	defer func() {
		h.Remove(conn)
		conn.Close(websocket.StatusNormalClosure, "")
	}()

	for {
		_, data, err := conn.Read(context.Background())
		if err != nil {
			return
		}

		var msg ClientMsg
		if err := json.Unmarshal(data, &msg); err != nil {
			continue
		}

		if msg.Type == "set_pixel" {
			key := fmt.Sprintf("%d:%d", msg.X, msg.Y)

			version := h.Store.Set(key, msg.Color)

			out, _ := json.Marshal(map[string]any{
				"type":    "pixel_update",
				"version": version,
				"x":       msg.X,
				"y":       msg.Y,
				"color":   msg.Color,
			})

			h.Broadcast(out)
		}
	}
}
