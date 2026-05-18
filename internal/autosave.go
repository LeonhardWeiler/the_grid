package internal

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func StartAutosave(h *Hub) {
	go func() {
		ticker := time.NewTicker(AutosaveInterval)
		defer ticker.Stop()

		for range ticker.C {
			saveSnapshot(h, "autosave")
		}
	}()
}

func SetupShutdownSave(h *Hub) {
	c := make(chan os.Signal, 1)

	signal.Notify(
		c,
		os.Interrupt,
		syscall.SIGTERM,
	)

	go func() {
		<-c

		saveSnapshot(h, "shutdown")

		os.Exit(0)
	}()
}

func saveSnapshot(h *Hub, source string) {
	snap, version := h.Store.Snapshot()

	if err := h.Persistence.Save(
		snap,
		version,
	); err != nil {
		log.Printf(
			"%s save failed: %v",
			source,
			err,
		)
	}
}
