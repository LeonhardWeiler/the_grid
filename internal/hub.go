package internal

import (
	"context"
	"sync"
	"time"

	"github.com/coder/websocket"
)

type Hub struct {
	mu sync.RWMutex

	clients map[*websocket.Conn]*Client

	Store *PixelStore

	lastAction map[string]int64
	connToID   map[*websocket.Conn]string
}

type Client struct {
	conn   *websocket.Conn
	send   chan []byte
	ctx    context.Context
	cancel context.CancelFunc
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
	ctx, cancel := context.WithCancel(context.Background())

	client := &Client{
		conn:   c,
		send:   make(chan []byte, 32),
		ctx:    ctx,
		cancel: cancel,
	}

	h.mu.Lock()
	h.clients[c] = client
	h.mu.Unlock()

	go func(cl *Client) {
		defer cl.conn.Close(
			websocket.StatusNormalClosure,
			"",
			)

		for {
			select {
			case msg, ok := <-cl.send:
				if !ok {
					return
				}

				ctx, cancel := context.WithTimeout(
					cl.ctx,
					5*time.Second,
					)

				err := cl.conn.Write(
					ctx,
					websocket.MessageText,
					msg,
					)

				cancel()

				if err != nil {
					return
				}

			case <-cl.ctx.Done():
				return
			}
		}
	}(client)

	return client
}

func (h *Hub) Broadcast(msg []byte) {
	h.mu.RLock()
	clients := make([]*Client, 0, len(h.clients))
	for _, client := range h.clients {
		clients = append(clients, client)
	}
	h.mu.RUnlock()

	for _, client := range clients {
		select {
		case client.send <- msg:
		default:
			client.cancel()
		}
	}
}

func (h *Hub) GetClientID(conn *websocket.Conn) string {
	h.mu.RLock()
	defer h.mu.RUnlock()
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

func (h *Hub) RemoveClient(conn *websocket.Conn) {
	h.mu.Lock()

	client := h.clients[conn]

	delete(h.clients, conn)
	delete(h.connToID, conn)

	h.mu.Unlock()

	if client != nil {
		client.cancel()
	}
}


func trySend(ch chan []byte, msg []byte) {
    select {
    case ch <- msg:
    default:
    }
}
