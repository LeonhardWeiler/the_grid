package internal

import (
	"context"
	"encoding/json"
	"fmt"
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
	ClientID    string `json:"clientId"`
}

type Client struct {
    conn *websocket.Conn
    send chan []byte
}

func HandleWS(h *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, nil)
	client := h.Add(conn)
	if client == nil {
		return
	}
	conn.SetReadLimit(MaxMessageSize)

	defer func() {
		h.RemoveAll(conn)
		_ = conn.Close(websocket.StatusNormalClosure, "")
	}()

	snap, version := h.Store.Snapshot()

	initMsg, err := json.Marshal(map[string]any{
		"type":    "init",
		"pixels":  snap,
		"version": version,
	})

	if err != nil {
		return
	}

	select {
	case client.send <- initMsg:
	default:
	// drop slow client
	}

	invalidCount := 0

	for {
		_, data, err := conn.Read(context.Background())
		if err != nil {
			return
		}

		var msg ClientMsg

		if err := json.Unmarshal(data, &msg); err != nil {
			invalidCount++
			if invalidCount >= 3 {
				return
			}
			continue
		}

		invalidCount = 0

		switch msg.Type {

		case "init_client":
			if !ValidClientID(msg.ClientID) {
				return
			}

			id := h.GetClientID(conn)
			if id != "" {
				continue
			}

			h.SetClientID(conn, msg.ClientID)

		case "sync":
			if !ValidVersion(msg.LastVersion) {
				continue
			}

			events := h.Store.GetSince(msg.LastVersion)

			out, err := json.Marshal(map[string]any{
				"type":   "sync",
				"events": events,
			})
			if err != nil {
				continue
			}

			select {
			case client.send <- out:
			default:
			// drop slow client
			}


		case "set_pixel":
			id := h.GetClientID(conn)

			if id == "" {
				continue
			}

			if !ValidCoords(msg.X, msg.Y) {
				continue
			}

			if !ValidColor(msg.Color) {
				continue
			}

			now := time.Now().UnixMilli()

			if !h.UpdateCooldown(id, now, CooldownMs) {
				continue
			}

			key := fmt.Sprintf(
				"%d:%d",
				msg.X,
				msg.Y,
				)

			ev := h.Store.Set(
				key,
				msg.X,
				msg.Y,
				msg.Color,
				)

			out, err := json.Marshal(map[string]any{
				"type":    "pixel_update",
				"version": ev.Version,
				"x":       ev.X,
				"y":       ev.Y,
				"color":   ev.Color,
			})
			if err != nil {
				continue
			}

			h.Broadcast(out)

			cd, err := json.Marshal(map[string]any{
				"type": "cooldown",
				"end":  now + CooldownMs,
			})
			if err != nil {
				continue
			}

			select {
			case client.send <- cd:
			default:
			// drop slow client
			}


		default:
			continue
		}
	}
}
