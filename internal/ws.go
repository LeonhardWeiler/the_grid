package internal

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/coder/websocket"
)

type PixelMsg struct {
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

	h.AddClient(conn)

	// init state
	initMsg, _ := json.Marshal(map[string]any{
		"type":   "init",
		"pixels": h.Store.GetAll(),
	})
	conn.Write(context.Background(), websocket.MessageText, initMsg)

	defer func() {
		h.RemoveClient(conn)
		conn.Close(websocket.StatusNormalClosure, "")
	}()

	for {
		_, data, err := conn.Read(context.Background())
		if err != nil {
			return
		}

		var msg PixelMsg
		if err := json.Unmarshal(data, &msg); err != nil {
			continue
		}

		if msg.Type == "set_pixel" {
			key := fmt.Sprintf("%d:%d", msg.X, msg.Y)

			h.Store.Set(key, msg.Color)

			out, _ := json.Marshal(map[string]any{
				"type":  "pixel_update",
				"x":     msg.X,
				"y":     msg.Y,
				"color": msg.Color,
			})

			h.Broadcast(out)
		}
	}
}
