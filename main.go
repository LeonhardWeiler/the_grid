package main

import (
	"context"
	"log"
	"net/http"

	"github.com/coder/websocket"
)

var clients = map[*websocket.Conn]bool{}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	clients[conn] = true

	log.Println("client connected")

	defer func() {
		delete(clients, conn)
		conn.Close(websocket.StatusNormalClosure, "")
	}()

	for {
		_, data, err := conn.Read(context.Background())
		if err != nil {
			break
		}

		for client := range clients {
			client.Write(
				context.Background(),
				websocket.MessageText,
				data,
			)
		}
	}
}

func main() {
	fs := http.FileServer(http.Dir("./public"))

	http.Handle("/", fs)
	http.HandleFunc("/ws", wsHandler)

	log.Println("server running on :4000")

	http.ListenAndServe(":4000", nil)
}
