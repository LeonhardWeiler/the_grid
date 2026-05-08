package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"fmt"

	"github.com/coder/websocket"
)

type Pixel struct {
	X     int    `json:"x"`
	Y     int    `json:"y"`
	Color string `json:"color"`
	Type  string `json:"type"`
}

var (
	clients = map[*websocket.Conn]bool{}
	mu      sync.Mutex
	pixels  = map[string]string{}
)

func key(x, y int) string {
	return fmt.Sprintf("%d:%d", x, y)
}

func broadcast(msg []byte) {
	mu.Lock()
	clientsCopy := make([]*websocket.Conn, 0, len(clients))
	for c := range clients {
		clientsCopy = append(clientsCopy, c)
	}
	mu.Unlock()

	for _, c := range clientsCopy {
		_ = c.Write(context.Background(), websocket.MessageText, msg)
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	mu.Lock()
	clients[conn] = true
	mu.Unlock()

	initMsg, _ := json.Marshal(map[string]any{
		"type":   "init",
		"pixels": pixels,
	})
	conn.Write(context.Background(), websocket.MessageText, initMsg)

	defer func() {
		mu.Lock()
		delete(clients, conn)
		mu.Unlock()
		conn.Close(websocket.StatusNormalClosure, "")
	}()

	for {
		_, data, err := conn.Read(context.Background())
		if err != nil {
			break
		}

		var msg Pixel

		if err := json.Unmarshal(data, &msg); err != nil {
			log.Println("invalid json:", err)
			continue
		}

		if msg.Type == "set_pixel" {
			k := key(msg.X, msg.Y)

			mu.Lock()
			pixels[k] = msg.Color
			mu.Unlock()

			out, _ := json.Marshal(map[string]any{
				"type":  "pixel_update",
				"x":     msg.X,
				"y":     msg.Y,
				"color": msg.Color,
			})

			broadcast(out)
		}
	}
}

func main() {
	fs := http.FileServer(http.Dir("./public"))

	http.Handle("/", fs)
	http.HandleFunc("/ws", wsHandler)

	log.Println("Server running on :4000")
	http.ListenAndServe(":4000", nil)
}
