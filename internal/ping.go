package internal

import (
	"context"
	"time"
)

func StartPingLoop(h *Hub) {
	ticker := time.NewTicker(20 * time.Second)

	for range ticker.C {
		h.mu.RLock()
		clients := make([]*Client, 0, len(h.clients))
		for _, c := range h.clients {
			clients = append(clients, c)
		}
		h.mu.RUnlock()

		for _, c := range h.clients {
			if time.Since(c.lastPong) > 60*time.Second {
				c.cancel()
				continue
			}

			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			err := c.conn.Ping(ctx)
			cancel()

			if err != nil {
				c.cancel()
				continue
			}
		}
	}
}
