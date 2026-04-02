package server

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
)

// ResourceInfo 资源信息
type ResourceInfo struct {
	ID       string `json:"id"`
	URL      string `json:"url"`
	Type     string `json:"type"`
	Size     int64  `json:"size,omitempty"`
	Checksum string `json:"checksum,omitempty"`
}

// ResourceManager 资源管理器
type ResourceManager struct {
	resources map[string]*ResourceInfo
	metadata  map[string]interface{}
	mu        sync.RWMutex
}

// NewResourceManager 创建资源管理器
func NewResourceManager() *ResourceManager {
	rm := &ResourceManager{
		resources: make(map[string]*ResourceInfo),
		metadata:  make(map[string]interface{}),
	}
	
	// 注册默认资源
	rm.registerDefaultResources()
	return rm
}

// 注册默认资源
func (rm *ResourceManager) registerDefaultResources() {
	defaultResources := []ResourceInfo{
		{ID: "config", URL: "/static/config.json", Type: "json"},
		{ID: "bgm", URL: "/static/audio/bgm.mp3", Type: "audio"},
		{ID: "click", URL: "/static/audio/click.mp3", Type: "audio"},
		{ID: "player", URL: "/static/images/player.png", Type: "image"},
		{ID: "enemy", URL: "/static/images/enemy.png", Type: "image"},
	}

	for _, r := range defaultResources {
		rm.resources[r.ID] = &r
	}
}

// GetResource 获取资源
func (rm *ResourceManager) GetResource(id string) (*ResourceInfo, bool) {
	rm.mu.RLock()
	defer rm.mu.RUnlock()

	r, ok := rm.resources[id]
	return r, ok
}

// ListResources 列出所有资源
func (rm *ResourceManager) ListResources() []*ResourceInfo {
	rm.mu.RLock()
	defer rm.mu.RUnlock()

	resources := make([]*ResourceInfo, 0, len(rm.resources))
	for _, r := range rm.resources {
		resources = append(resources, r)
	}
	return resources
}

// AddResource 添加资源
func (rm *ResourceManager) AddResource(resource *ResourceInfo) {
	rm.mu.Lock()
	defer rm.mu.Unlock()

	rm.resources[resource.ID] = resource
	log.Printf("📦 Resource added: %s", resource.ID)
}

// RemoveResource 移除资源
func (rm *ResourceManager) RemoveResource(id string) {
	rm.mu.Lock()
	defer rm.mu.Unlock()

	delete(rm.resources, id)
	log.Printf("📦 Resource removed: %s", id)
}

// GetResourceBundle 获取资源包
func (rm *ResourceManager) GetResourceBundle(ids []string) map[string]*ResourceInfo {
	rm.mu.RLock()
	defer rm.mu.RUnlock()

	bundle := make(map[string]*ResourceInfo)
	for _, id := range ids {
		if r, ok := rm.resources[id]; ok {
			bundle[id] = r
		}
	}
	return bundle
}

// HandleResourceRequest HTTP 处理器
func (rm *ResourceManager) HandleResourceRequest(w http.ResponseWriter, r *http.Request) {
	resourceID := r.URL.Query().Get("id")
	
	if resourceID == "" {
		// 返回所有资源
		resources := rm.ListResources()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status": "ok",
			"resources": resources,
		})
		return
	}

	// 返回特定资源
	resource, ok := rm.GetResource(resourceID)
	if !ok {
		http.Error(w, "Resource not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "ok",
		"resource": resource,
	})
}
