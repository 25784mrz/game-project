package server

import (
	"context"
	"log"
	"sync"
)

// AudioService 语音服务
type AudioService struct {
	enabled bool
	mu      sync.RWMutex
	// 这里可以集成第三方语音服务 API
	// 如：Azure Speech, Google Cloud Speech-to-Text 等
}

// NewAudioService 创建语音服务
func NewAudioService() *AudioService {
	return &AudioService{
		enabled: true,
	}
}

// ProcessVoiceCommand 处理语音命令
func (as *AudioService) ProcessVoiceCommand(transcript string) (string, error) {
	as.mu.RLock()
	defer as.mu.RUnlock()

	if !as.enabled {
		return "", nil
	}

	log.Printf("🎤 Processing voice command: %s", transcript)

	// 简单的命令匹配
	// 实际项目中应该使用 NLP 或调用语音服务 API
	response := as.matchCommand(transcript)
	return response, nil
}

// 匹配语音命令
func (as *AudioService) matchCommand(transcript string) string {
	// 转换为小写进行匹配
	cmd := transcript

	// 游戏控制命令
	if contains(cmd, "开始", "start", "begin") {
		return "游戏已开始"
	}
	if contains(cmd, "停止", "stop", "end") {
		return "游戏已停止"
	}
	if contains(cmd, "暂停", "pause") {
		return "游戏已暂停"
	}
	if contains(cmd, "继续", "resume", "continue") {
		return "游戏已继续"
	}

	// 音量控制
	if contains(cmd, "音量", "volume") {
		if contains(cmd, "大", "高", "up", "increase") {
			return "音量已调大"
		}
		if contains(cmd, "小", "低", "down", "decrease") {
			return "音量已调小"
		}
	}

	// 帮助
	if contains(cmd, "帮助", "help") {
		return "可用命令：开始、停止、暂停、继续、音量大小"
	}

	return "未识别的命令"
}

// TextToSpeech 文字转语音 (返回音频数据)
func (as *AudioService) TextToSpeech(text string) ([]byte, error) {
	as.mu.RLock()
	defer as.mu.RUnlock()

	if !as.enabled {
		return nil, nil
	}

	log.Printf("🔊 Converting to speech: %s", text)

	// 实际项目中应该调用 TTS 服务
	// 这里返回空数据，由前端使用 Web Speech API 处理
	return nil, nil
}

// Enable 启用语音服务
func (as *AudioService) Enable() {
	as.mu.Lock()
	defer as.mu.Unlock()
	as.enabled = true
	log.Println("✅ Audio service enabled")
}

// Disable 禁用语音服务
func (as *AudioService) Disable() {
	as.mu.Lock()
	defer as.mu.Unlock()
	as.enabled = false
	log.Println("⏸️ Audio service disabled")
}

// IsEnabled 检查是否启用
func (as *AudioService) IsEnabled() bool {
	as.mu.RLock()
	defer as.mu.RUnlock()
	return as.enabled
}

// 辅助函数：检查字符串是否包含任意关键词
func contains(text string, keywords ...string) bool {
	for _, keyword := range keywords {
		if containsSubstring(text, keyword) {
			return true
		}
	}
	return false
}

func containsSubstring(text, substr string) bool {
	return len(text) >= len(substr) &&
		(text == substr ||
			findSubstring(text, substr))
}

func findSubstring(text, substr string) bool {
	if len(substr) == 0 {
		return true
	}
	for i := 0; i <= len(text)-len(substr); i++ {
		if text[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

// HealthCheck 健康检查
func (as *AudioService) HealthCheck(ctx context.Context) error {
	// 检查语音服务连接
	// 实际项目中应该检查第三方服务状态
	return nil
}

// Start 启动服务
func (as *AudioService) Start(ctx context.Context) error {
	log.Println("🎤 Audio service started")
	return nil
}

// Stop 停止服务
func (as *AudioService) Stop(ctx context.Context) error {
	log.Println("🎤 Audio service stopped")
	return nil
}
