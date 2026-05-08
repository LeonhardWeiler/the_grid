package internal

import (
	"context"
	"sync"

	"github.com/coder/websocket"
)

type Hub struct {
	mu      sync.Mutex
	clients map[*websocket.Conn]bool
	Store   *PixelStore

	lastAction map[string]int64 // 🔥 CHANGED: clientId instead of conn
	connToID   map[*websocket.Conn]string
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*websocket.Conn]bool),
		Store:      NewPixelStore(),
		lastAction: make(map[string]int64),
		connToID:   make(map[*websocket.Conn]string),
	}
}

func (h *Hub) Add(c *websocket.Conn) {
	h.mu.Lock()
	h.clients[c] = true
	h.mu.Unlock()
}

func (h *Hub) Remove(c *websocket.Conn) {
	h.mu.Lock()
	delete(h.clients, c)
	h.mu.Unlock()
}

func (h *Hub) Broadcast(msg []byte) {
	h.mu.Lock()
	clients := make([]*websocket.Conn, 0, len(h.clients))
	for c := range h.clients {
		clients = append(clients, c)
	}
	h.mu.Unlock()

	for _, c := range clients {
		_ = c.Write(context.Background(), websocket.MessageText, msg)
	}
}
