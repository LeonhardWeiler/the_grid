package main

import (
	"log"
	"mime"
	"net/http"

	"the_grid/internal"
)

func init() {
	mime.AddExtensionType(".js", "application/javascript")
}

func main() {

	hub := internal.NewHub()

	fs := http.FileServer(http.Dir("./public/dist"))
	http.Handle("/", fs)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		internal.HandleWS(hub, w, r)
	})

	log.Println("Server running on :4000")

	http.ListenAndServe(":4000", nil)
}
