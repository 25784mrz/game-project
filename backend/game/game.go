package game

import (
	"sync"
	"time"
)

// GameConfig 游戏配置
type GameConfig struct {
	MaxPlayers int           `json:"maxPlayers"`
	Difficulty string        `json:"difficulty"`
	Duration   time.Duration `json:"duration"`
}

// GameState 游戏状态
type GameState string

const (
	StateWaiting   GameState = "waiting"
	StatePlaying   GameState = "playing"
	StatePaused    GameState = "paused"
	StateFinished  GameState = "finished"
)

// Player 玩家
type Player struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Score     int    `json:"score"`
	Lives     int    `json:"lives"`
	Level     int    `json:"level"`
	IsReady   bool   `json:"isReady"`
	Connected bool   `json:"connected"`
}

// Game 游戏实例
type Game struct {
	ID          string            `json:"id"`
	Config      *GameConfig       `json:"config"`
	State       GameState         `json:"state"`
	Players     map[string]*Player `json:"players"`
	StartTime   time.Time         `json:"startTime,omitempty"`
	EndTime     time.Time         `json:"endTime,omitempty"`
	mu          sync.RWMutex
	stateChange chan GameState
}

// NewGame 创建新游戏
func NewGame(id string, config *GameConfig) *Game {
	if config == nil {
		config = &GameConfig{
			MaxPlayers: 4,
			Difficulty: "normal",
			Duration:   10 * time.Minute,
		}
	}

	return &Game{
		ID:          id,
		Config:      config,
		State:       StateWaiting,
		Players:     make(map[string]*Player),
		stateChange: make(chan GameState, 10),
	}
}

// AddPlayer 添加玩家
func (g *Game) AddPlayer(player *Player) bool {
	g.mu.Lock()
	defer g.mu.Unlock()

	if len(g.Players) >= g.Config.MaxPlayers {
		return false
	}

	g.Players[player.ID] = player
	return true
}

// RemovePlayer 移除玩家
func (g *Game) RemovePlayer(playerID string) {
	g.mu.Lock()
	defer g.mu.Unlock()

	delete(g.Players, playerID)
}

// GetPlayer 获取玩家
func (g *Game) GetPlayer(playerID string) (*Player, bool) {
	g.mu.RLock()
	defer g.mu.RUnlock()

	p, ok := g.Players[playerID]
	return p, ok
}

// Start 开始游戏
func (g *Game) Start() bool {
	g.mu.Lock()
	defer g.mu.Unlock()

	if g.State != StateWaiting {
		return false
	}

	g.State = StatePlaying
	g.StartTime = time.Now()
	g.stateChange <- StatePlaying
	return true
}

// Pause 暂停游戏
func (g *Game) Pause() bool {
	g.mu.Lock()
	defer g.mu.Unlock()

	if g.State != StatePlaying {
		return false
	}

	g.State = StatePaused
	g.stateChange <- StatePaused
	return true
}

// Resume 继续游戏
func (g *Game) Resume() bool {
	g.mu.Lock()
	defer g.mu.Unlock()

	if g.State != StatePaused {
		return false
	}

	g.State = StatePlaying
	g.stateChange <- StatePlaying
	return true
}

// Finish 结束游戏
func (g *Game) Finish() {
	g.mu.Lock()
	defer g.mu.Unlock()

	g.State = StateFinished
	g.EndTime = time.Now()
	g.stateChange <- StateFinished
}

// UpdateScore 更新分数
func (g *Game) UpdateScore(playerID string, points int) {
	g.mu.Lock()
	defer g.mu.Unlock()

	if player, ok := g.Players[playerID]; ok {
		player.Score += points
	}
}

// LoseLife 失去生命
func (g *Game) LoseLife(playerID string) int {
	g.mu.Lock()
	defer g.mu.Unlock()

	if player, ok := g.Players[playerID]; ok {
		player.Lives--
		return player.Lives
	}
	return 0
}

// NextLevel 下一关
func (g *Game) NextLevel(playerID string) int {
	g.mu.Lock()
	defer g.mu.Unlock()

	if player, ok := g.Players[playerID]; ok {
		player.Level++
		return player.Level
	}
	return 0
}

// GetState 获取游戏状态
func (g *Game) GetState() map[string]interface{} {
	g.mu.RLock()
	defer g.mu.RUnlock()

	players := make([]map[string]interface{}, 0, len(g.Players))
	for _, p := range g.Players {
		players = append(players, map[string]interface{}{
			"id":        p.ID,
			"name":      p.Name,
			"score":     p.Score,
			"lives":     p.Lives,
			"level":     p.Level,
			"isReady":   p.IsReady,
			"connected": p.Connected,
		})
	}

	return map[string]interface{}{
		"id":         g.ID,
		"state":      g.State,
		"players":    players,
		"startTime":  g.StartTime,
		"endTime":    g.EndTime,
		"config":     g.Config,
	}
}

// StateChannel 获取状态变化通道
func (g *Game) StateChannel() <-chan GameState {
	return g.stateChange
}
