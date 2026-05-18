package internal

import (
	"encoding/json"
	"os"
	"sync"
)

type SnapshotFile struct {
	Pixels  map[string]string `json:"pixels"`
	Version int               `json:"version"`
}

type Persistence struct {
	filePath string
	mu       sync.Mutex
}

func NewPersistence(filePath string) *Persistence {
	_ = os.MkdirAll("data", 0755)

	return &Persistence{
		filePath: filePath,
	}
}

func (p *Persistence) Save(pixels map[string]string, version int) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	data := SnapshotFile{
		Pixels:  pixels,
		Version: version,
	}

	b, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	tmpPath := p.filePath + ".tmp"

	if err := os.WriteFile(tmpPath, b, 0644); err != nil {
		return err
	}

	return os.Rename(tmpPath, p.filePath)
}

func (p *Persistence) Load() (map[string]string, int, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	b, err := os.ReadFile(p.filePath)
	if err != nil {
		if os.IsNotExist(err) {
			return make(map[string]string), 0, nil
		}
		return nil, 0, err
	}

	var data SnapshotFile
	if err := json.Unmarshal(b, &data); err != nil {
		return nil, 0, err
	}

	return data.Pixels, data.Version, nil
}
