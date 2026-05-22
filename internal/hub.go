package internal

import (
	"context"
	"sync"
	"time"

	"github.com/coder/websocket"
)

type Hub struct {
	mu 					sync.RWMutex
	clients 		map[*websocket.Conn]*Client
	Store 			*PixelStore
	lastAction  map[string]int64
	connToID    map[*websocket.Conn]string
	idToClients map[string]map[*Client]struct{}
	Persistence *Persistence
}

type Client struct {
	conn     *websocket.Conn
	send     chan []byte
	ctx      context.Context
	cancel   context.CancelFunc
}

func NewHub() *Hub {
	p := NewPersistence("data/snapshot.json")

	pixels, version, err := p.Load()
	if err != nil {
		panic(err)
	}

	store := NewPixelStore()
	store.LoadSnapshot(pixels, version)

	return &Hub{
		clients:     make(map[*websocket.Conn]*Client),
		Store: 			 store,
		lastAction:  make(map[string]int64),
		connToID:    make(map[*websocket.Conn]string),
		idToClients: make(map[string]map[*Client]struct{}),
		Persistence: p,
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
		defer func() {
			h.RemoveClient(cl.conn)
			cl.conn.Close(websocket.StatusNormalClosure, "")
		}()

		for {
			select {
			case msg, ok := <-cl.send:
				if !ok {
					return
				}

				ctx, cancel := context.WithTimeout(cl.ctx, 5*time.Second)
				err := cl.conn.Write(ctx, websocket.MessageText, msg)
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
			go h.RemoveClient(client.conn)
		}
	}
}

func (h *Hub) SendToClientID(id string, msg []byte) {
	h.mu.RLock()
	clientSet, ok := h.idToClients[id]
	if !ok {
		h.mu.RUnlock()
		return
	}

	clients := make([]*Client, 0, len(clientSet))
	for client := range clientSet {
		clients = append(clients, client)
	}
	h.mu.RUnlock()

	for _, client := range clients {
		select {
		case client.send <- msg:
		default:
			h.RemoveClient(client.conn)
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

	client := h.clients[conn]
	if client == nil {
		return
	}

	oldID := h.connToID[conn]
	if oldID == id {
		return
	}

	if oldID != "" && oldID != id {
		if oldSet, ok := h.idToClients[oldID]; ok {
			delete(oldSet, client)

			if len(oldSet) == 0 {
				delete(h.idToClients, oldID)
			}
		}
	}

	h.connToID[conn] = id

	if h.idToClients[id] == nil {
		h.idToClients[id] = make(map[*Client]struct{})
	}

	h.idToClients[id][client] = struct{}{}
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

func (h *Hub) GetCooldownEnd(id string) int64 {
	h.mu.RLock()
	defer h.mu.RUnlock()

	last := h.lastAction[id]

	if last == 0 {
		return 0
	}

	return last + CooldownMs
}

func (h *Hub) RemoveClient(conn *websocket.Conn) {
	h.mu.Lock()

	client := h.clients[conn]
	id := h.connToID[conn]

	if client != nil {
		delete(h.clients, conn)
		delete(h.connToID, conn)

		if id != "" {
			if clients, ok := h.idToClients[id]; ok {
				delete(clients, client)
				if len(clients) == 0 {
					delete(h.idToClients, id)
				}
			}
		}
	}

	h.mu.Unlock()

	if client != nil {
		client.cancel()
		client.send = nil
	}
}


func trySend(ch chan []byte, msg []byte) {
    select {
    case ch <- msg:
    default:
    }
}
