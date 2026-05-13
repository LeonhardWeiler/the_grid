package internal

import (
	"context"
	"sync"

	"github.com/coder/websocket"
)

type Hub struct {
	mu sync.Mutex

	clients map[*websocket.Conn]*Client

	Store *PixelStore

	lastAction map[string]int64
	connToID   map[*websocket.Conn]string
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*websocket.Conn]*Client),
		Store:      NewPixelStore(),
		lastAction: make(map[string]int64),
		connToID:   make(map[*websocket.Conn]string),
	}
}

func (h *Hub) Add(c *websocket.Conn) *Client {
	client := &Client{
		conn: c,
		send: make(chan []byte, 32),
	}

	h.mu.Lock()
	h.clients[c] = client
	h.mu.Unlock()

	go func(cl *Client) {
		defer cl.conn.Close(websocket.StatusNormalClosure, "")

		for msg := range cl.send {
			if err := cl.conn.Write(context.Background(), websocket.MessageText, msg); err != nil {
				return
			}
		}
	}(client)

	return client
}

func (h *Hub) Broadcast(msg []byte) {
	h.mu.Lock()
	clients := make([]*Client, 0, len(h.clients))
	for _, client := range h.clients {
		clients = append(clients, client)
	}
	h.mu.Unlock()

	for _, client := range clients {
		select {
		case client.send <- msg:
		default:
		// drop slow client
		}
	}
}

func (h *Hub) GetClientID(conn *websocket.Conn) string {
	h.mu.Lock()
	defer h.mu.Unlock()
	return h.connToID[conn]
}

func (h *Hub) SetClientID(conn *websocket.Conn, id string) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.connToID[conn] = id
}

func (h *Hub) UpdateCooldown(id string, now int64, cooldown int64) bool {
	h.mu.Lock()
	defer h.mu.Unlock()

	last := h.lastAction[id]

	if now-last < cooldown {
		return false
	}

	h.lastAction[id] = now
	return true
}

func (h *Hub) RemoveAll(conn *websocket.Conn) {
	h.mu.Lock()

	id := h.connToID[conn]
	client := h.clients[conn]

	delete(h.clients, conn)
	delete(h.connToID, conn)

	if id != "" {
		delete(h.lastAction, id)
	}

	h.mu.Unlock()

	if client != nil {
		close(client.send)
	}
}
