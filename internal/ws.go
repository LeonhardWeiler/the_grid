package internal

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
	"bytes"

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

func HandleWS(h *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	conn.SetReadLimit(MaxMessageSize)

	h.Add(conn)

	defer func() {
		delete(h.connToID, conn)

		h.Remove(conn)

		_ = conn.Close(
			websocket.StatusNormalClosure,
			"",
			)
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

	if err := conn.Write(
		context.Background(),
		websocket.MessageText,
		initMsg,
		); err != nil {
		return
	}

	invalidCount := 0

	for {
		_, data, err := conn.Read(context.Background())
		if err != nil {
			return
		}

		var msg ClientMsg

		decoder := json.NewDecoder(bytes.NewReader(data))
		decoder.DisallowUnknownFields()

		if err := decoder.Decode(&msg); err != nil {
			invalidCount++

			if invalidCount >= 3 {
				return
			}

			continue
		}

		if decoder.More() {
			continue
		}

		invalidCount = 0

		switch msg.Type {

		case "init_client":
			if !ValidClientID(msg.ClientID) {
				return
			}

			if h.connToID[conn] != "" {
				continue
			}

			h.connToID[conn] = msg.ClientID

		case "sync":
			if !ValidVersion(msg.LastVersion) {
				continue
			}

			events := h.Store.GetSince(msg.LastVersion)

			if events == nil {
				events = []Event{}
			}

			out, err := json.Marshal(map[string]any{
				"type":   "sync",
				"events": events,
			})
			if err != nil {
				continue
			}

			_ = conn.Write(
				context.Background(),
				websocket.MessageText,
				out,
				)

		case "set_pixel":
			id := h.connToID[conn]

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

			last := h.lastAction[id]

			if now-last < CooldownMs {
				continue
			}

			h.lastAction[id] = now

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

			_ = conn.Write(
				context.Background(),
				websocket.MessageText,
				cd,
				)

		default:
			continue
		}
	}
}
