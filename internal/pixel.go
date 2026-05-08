package internal

import "sync"

type PixelStore struct {
	mu      sync.Mutex
	pixels  map[string]string
	version int
}

func NewPixelStore() *PixelStore {
	return &PixelStore{
		pixels: make(map[string]string),
	}
}

func (s *PixelStore) Set(key string, color string) int {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.version++
	s.pixels[key] = color

	return s.version
}

func (s *PixelStore) GetSnapshot() (map[string]string, int) {
	s.mu.Lock()
	defer s.mu.Unlock()

	copy := make(map[string]string)
	for k, v := range s.pixels {
		copy[k] = v
	}

	return copy, s.version
}
