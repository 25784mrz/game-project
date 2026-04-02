package server

import (
	"GoGameServer/game"
	"log"
	"sync"
)

// GameManager 管理游戏状态
type GameManager struct {
	games map[string]*game.Game
	mu    sync.RWMutex
}

// NewGameManager 创建游戏管理器
func NewGameManager() *GameManager {
	return &GameManager{
		games: make(map[string]*game.Game),
	}
}

// CreateGame 创建新游戏
func (gm *GameManager) CreateGame(gameID string, config *game.GameConfig) *game.Game {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	g := game.NewGame(gameID, config)
	gm.games[gameID] = g
	log.Printf("🎮 Game created: %s", gameID)
	return g
}

// GetGame 获取游戏
func (gm *GameManager) GetGame(gameID string) (*game.Game, bool) {
	gm.mu.RLock()
	defer gm.mu.RUnlock()

	g, ok := gm.games[gameID]
	return g, ok
}

// RemoveGame 移除游戏
func (gm *GameManager) RemoveGame(gameID string) {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	delete(gm.games, gameID)
	log.Printf("🎮 Game removed: %s", gameID)
}

// ListGames 列出所有游戏
func (gm *GameManager) ListGames() []string {
	gm.mu.RLock()
	defer gm.mu.RUnlock()

	ids := make([]string, 0, len(gm.games))
	for id := range gm.games {
		ids = append(ids, id)
	}
	return ids
}
