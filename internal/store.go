package internal

import "sync"

type Event struct {
	Version int    `json:"version"`
	X       int    `json:"x"`
	Y       int    `json:"y"`
	Color   string `json:"color"`
}

type PixelStore struct {
	mu      sync.Mutex
	pixels  map[string]string
	events  []Event
	version int
}

func NewPixelStore() *PixelStore {
	return &PixelStore{
		pixels: make(map[string]string),
		events: make([]Event, 0),
	}
}

func (s *PixelStore) Set(key string, x, y int, color string) Event {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.version++

	s.pixels[key] = color

	ev := Event{
		Version: s.version,
		X:       x,
		Y:       y,
		Color:   color,
	}

	s.events = append(s.events, ev)

	return ev
}

func (s *PixelStore) GetSince(v int) []Event {
	s.mu.RLock()
	defer s.mu.RUnlock()

	res := make([]Event, 0)

	for _, e := range s.events {
		if e.Version > v {
			res = append(res, e)
		}
	}

	return res
}

func (s *PixelStore) Snapshot() (map[string]string, int) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	copy := make(map[string]string)
	for k, v := range s.pixels {
		copy[k] = v
	}

	return copy, s.version
}
