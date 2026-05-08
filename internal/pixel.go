package internal

import "sync"

type PixelStore struct {
	mu     sync.Mutex
	pixels map[string]string
}

func NewPixelStore() *PixelStore {
	return &PixelStore{
		pixels: make(map[string]string),
	}
}

func (p *PixelStore) Set(key string, color string) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.pixels[key] = color
}

func (p *PixelStore) GetAll() map[string]string {
	p.mu.Lock()
	defer p.mu.Unlock()

	copy := make(map[string]string)
	for k, v := range p.pixels {
		copy[k] = v
	}
	return copy
}
