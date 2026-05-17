package main

import (
	"log"
	"mime"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

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

	go func(h *internal.Hub) {
		ticker := time.NewTicker(internal.AutosaveInterval)
		defer ticker.Stop()

		for range ticker.C {
			snap, version := h.Store.Snapshot()

			if err := h.Persistence.Save(snap, version); err != nil {
				log.Println("autosave failed:", err)
			}
		}
	}(hub)

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-c
		snap, version := hub.Store.Snapshot()
		if err := hub.Persistence.Save(snap, version); err != nil {
			log.Println("shutdown save failed:", err)
		}
		os.Exit(0)
	}()

	log.Println("Server running on :4000")

	if err := http.ListenAndServe(":4000", nil); err != nil {
		log.Fatal(err)
	}
}
