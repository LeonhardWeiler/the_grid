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

type PixelUpdateMsg struct {
	Type    string `json:"type"`
	Version int    `json:"version"`
	X       int    `json:"x"`
	Y       int    `json:"y"`
	Color   string `json:"color"`
}

type CooldownMsg struct {
	Type string `json:"type"`
	End  int64  `json:"end"`
}

type ServerResponse struct {
	Type    		string            `json:"type"`
	Pixels 		  map[string]string `json:"pixels,omitempty"`
	Events  		[]Event           `json:"events,omitempty"`
	Version     int               `json:"version"`
	CooldownEnd int64 						`json:"cooldownEnd,omitempty"`
}

const (
	MsgTypeInitClient  = "init_client"
	MsgTypeSync        = "sync"
	MsgTypeSetPixel    = "set_pixel"

	MsgTypeInit        = "init"
	MsgTypePixelUpdate = "pixel_update"
	MsgTypeCooldown    = "cooldown"
)

func HandleWS(h *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		OriginPatterns: []string{
			"http://localhost:5173",
			"http://localhost:4000",
		},
	})
	if err != nil {
		return
	}
	client := h.Add(conn)
	if client == nil {
		return
	}

	defer func() {
		h.RemoveClient(conn)
		_ = conn.Close(websocket.StatusNormalClosure, "")
	}()

	invalidCount := 0
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	for {
		_, data, err := conn.Read(ctx)
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

		case MsgTypeInitClient:
			if !ValidClientID(msg.ClientID) {
				return
			}

			if h.GetClientID(conn) != "" {
				continue
			}

			h.SetClientID(conn, msg.ClientID)

			snap, version := h.Store.Snapshot()
			events, ok := h.Store.GetSince(msg.LastVersion)

			if ok && len(events) > 0 {
				resp := ServerResponse{
					Type:    MsgTypeSync,
					Events:  events,
					Version: h.Store.Version(),
				}

				b, err := json.Marshal(resp)
				if err != nil {
					return
				}

				trySend(client.send, b)
				continue
			}

			snap, version := h.Store.Snapshot()

			if err := handleInit(
				h,
				client,
				conn,
				snap,
				version,
				); err != nil {
				return
			}

			continue

		case MsgTypeSync:
			handleSync(h, client, msg)

		case MsgTypeSetPixel:
			id := h.GetClientID(conn)
			if id == "" {
				continue
			}
			handleSetPixel(h, client, id, msg)

		default:
			continue
		}
	}
}

func handleInit(h *Hub, client *Client, conn *websocket.Conn, snap map[string]string, version int,) error {
	id := h.GetClientID(conn)

	resp := ServerResponse{
		Type:         MsgTypeInit,
		Pixels:       snap,
		Version:      version,
		CooldownEnd:  h.GetCooldownEnd(id),
	}

	b, err := json.Marshal(resp)
	if err != nil {
		return err
	}

	trySend(client.send, b)
	return nil
}

func handleSync(h *Hub, client *Client, msg ClientMsg) {
	if !ValidVersion(msg.LastVersion) {
		return
	}

	events, ok := h.Store.GetSince(msg.LastVersion)

	if !ok {
		snap, version := h.Store.Snapshot()

		resp := ServerResponse{
			Type:    MsgTypeInit,
			Pixels:  snap,
			Version: version,
		}

		b, err := json.Marshal(resp)
		if err != nil {
			return
		}

		trySend(client.send, b)
		return
	}

	resp := ServerResponse{
		Type:    MsgTypeSync,
		Events:  events,
		Version: h.Store.Version(),
	}

	b, err := json.Marshal(resp)
	if err != nil {
		return
	}

	trySend(client.send, b)
}

func handleSetPixel(h *Hub, client *Client, id string, msg ClientMsg) {
	if id == "" {
		return
	}

	if !ValidCoords(msg.X, msg.Y) || !ValidColor(msg.Color) {
		return
	}

	now := time.Now().UnixMilli()

	if !h.UpdateCooldown(id, now, CooldownMs) {
		return
	}

	key := fmt.Sprintf("%d:%d", msg.X, msg.Y)

	ev := h.Store.Set(key, msg.X, msg.Y, msg.Color)

	out, err := json.Marshal(PixelUpdateMsg{
		Type:    MsgTypePixelUpdate,
		Version: ev.Version,
		X:       ev.X,
		Y:       ev.Y,
		Color:   ev.Color,
	})
	if err != nil {
		return
	}

	h.Broadcast(out)

	cd, err := json.Marshal(CooldownMsg{
		Type: MsgTypeCooldown,
		End:  now + CooldownMs,
	})
	if err != nil {
		return
	}

	h.SendToClientID(id, cd)
}
