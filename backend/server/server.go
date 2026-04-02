package server

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// 消息类型
type MessageType string

const (
	MsgConnect      MessageType = "connect"
	MsgDisconnect   MessageType = "disconnect"
	MsgAuthLogin    MessageType = "auth_login"
	MsgAuthRegister MessageType = "auth_register"
	MsgAuthLogout   MessageType = "auth_logout"
	MsgAuthToken    MessageType = "auth_token"
	MsgGameAction   MessageType = "game_action"
	MsgGameState    MessageType = "game_state"
	MsgGameEvent    MessageType = "game_event"
	MsgAudioRequest MessageType = "audio_request"
	MsgAudioResponse MessageType = "audio_response"
	MsgResourceRequest MessageType = "resource_request"
	MsgResourceResponse MessageType = "resource_response"
	MsgError        MessageType = "error"
)

// 网络消息
type NetworkMessage struct {
	Type      MessageType `json:"type"`
	Data      interface{} `json:"data,omitempty"`
	RequestID string      `json:"requestId,omitempty"`
	Timestamp int64       `json:"timestamp,omitempty"`
}

// 客户端连接
type Client struct {
	conn   *websocket.Conn
	send   chan NetworkMessage
	server *Server
	mu     sync.RWMutex
}

// 服务器
type Server struct {
	addr     string
	clients  map[*Client]bool
	broadcast chan NetworkMessage
	register  chan *Client
	unregister chan *Client
	mu       sync.RWMutex
	upgrader websocket.Upgrader
	auth     *AuthService
}

// 创建服务器
func NewServer(addr string) *Server {
	return &Server{
		addr: addr,
		clients: make(map[*Client]bool),
		broadcast: make(chan NetworkMessage, 256),
		register: make(chan *Client),
		unregister: make(chan *Client),
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true // 允许所有来源 (生产环境应该限制)
			},
		},
		auth: NewAuthService(),
	}
}

// 启动服务器
func (s *Server) Start() {
	go s.run()
}

func (s *Server) run() {
	for {
		select {
		case client := <-s.register:
			s.mu.Lock()
			s.clients[client] = true
			s.mu.Unlock()
			log.Printf("📡 Client connected. Total: %d", len(s.clients))

			// 发送欢迎消息
			client.send <- NetworkMessage{
				Type: MsgConnect,
				Data: map[string]interface{}{
					"message": "Connected to game server",
					"clientId": getClientID(client),
				},
			}

		case client := <-s.unregister:
			s.mu.Lock()
			if _, ok := s.clients[client]; ok {
				delete(s.clients, client)
				close(client.send)
			}
			s.mu.Unlock()
			log.Printf("📡 Client disconnected. Total: %d", len(s.clients))

		case message := <-s.broadcast:
			s.mu.RLock()
			for client := range s.clients {
				select {
				case client.send <- message:
				default:
					// 客户端缓冲区满，断开连接
					close(client.send)
					delete(s.clients, client)
				}
			}
			s.mu.RUnlock()
		}
	}
}

// WebSocket 处理器
func (s *Server) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("🔴 WebSocket upgrade failed:", err)
		return
	}

	client := &Client{
		conn: conn,
		send: make(chan NetworkMessage, 256),
		server: s,
	}

	s.register <- client

	// 启动读写协程
	go client.writePump()
	go client.readPump()
}

// 健康检查
func (s *Server) HandleHealth(w http.ResponseWriter, r *http.Request) {
	s.mu.RLock()
	clientCount := len(s.clients)
	s.mu.RUnlock()

	response := map[string]interface{}{
		"status": "ok",
		"clients": clientCount,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// 广播消息
func (s *Server) Broadcast(msg NetworkMessage) {
	s.broadcast <- msg
}

// 发送消息给特定客户端
func (s *Server) SendTo(client *Client, msg NetworkMessage) {
	select {
	case client.send <- msg:
	default:
		// 缓冲区满
	}
}

// 客户端读取协程
func (c *Client) readPump() {
	defer func() {
		c.server.unregister <- c
		c.conn.Close()
	}()

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("🔴 Read error: %v", err)
			}
			break
		}

		// 解析消息
		var msg NetworkMessage
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("🔴 Parse error: %v", err)
			continue
		}

		log.Printf("📥 Received: %s", msg.Type)

		// 处理消息
		c.handleMessage(msg)
	}
}

// 处理消息
func (c *Client) handleMessage(msg NetworkMessage) {
	switch msg.Type {
	case MsgAuthLogin:
		c.handleAuthLogin(msg.Data)
	case MsgAuthRegister:
		c.handleAuthRegister(msg.Data)
	case MsgAuthLogout:
		c.handleAuthLogout(msg.Data)
	case MsgGameAction:
		c.handleGameAction(msg.Data)
	case MsgAudioRequest:
		c.handleAudioRequest(msg.Data)
	case MsgResourceRequest:
		c.handleResourceRequest(msg.Data)
	default:
		log.Printf("⚠️ Unknown message type: %s", msg.Type)
	}
}

// 处理游戏动作
func (c *Client) handleGameAction(data interface{}) {
	log.Printf("🎮 Game action: %v", data)
	
	// 处理认证登录
func (c *Client) handleAuthLogin(data interface{}) {
	log.Printf("🔐 Auth login request: %v", data)
	
	m, ok := data.(map[string]interface{})
	if !ok {
		c.sendErrorResponse("invalid request")
		return
	}
	
	username, _ := m["username"].(string)
	password, _ := m["password"].(string)
	
	response := c.server.auth.Login(username, password)
	
	c.send <- NetworkMessage{
		Type: MsgAuthLogin,
		Data: response,
		RequestID: getRequestID(data),
	}
	
	if response.Success {
		log.Printf("✅ Login success: %s", username)
	} else {
		log.Printf("❌ Login failed: %s", response.Message)
	}
}

// 处理认证注册
func (c *Client) handleAuthRegister(data interface{}) {
	log.Printf("🔐 Auth register request: %v", data)
	
	m, ok := data.(map[string]interface{})
	if !ok {
		c.sendErrorResponse("invalid request")
		return
	}
	
	username, _ := m["username"].(string)
	email, _ := m["email"].(string)
	password, _ := m["password"].(string)
	
	response := c.server.auth.Register(username, email, password)
	
	c.send <- NetworkMessage{
		Type: MsgAuthRegister,
		Data: response,
		RequestID: getRequestID(data),
	}
	
	if response.Success {
		log.Printf("✅ Register success: %s", username)
	} else {
		log.Printf("❌ Register failed: %s", response.Message)
	}
}

// 处理认证登出
func (c *Client) handleAuthLogout(data interface{}) {
	log.Printf("🔐 Auth logout request: %v", data)
	
	m, ok := data.(map[string]interface{})
	if !ok {
		return
	}
	
	token, _ := m["token"].(string)
	if token != "" {
		c.server.auth.Logout(token)
	}
}

// 发送错误响应
func (c *Client) sendErrorResponse(message string) {
	c.send <- NetworkMessage{
		Type: MsgError,
		Data: map[string]interface{}{
			"success": false,
			"message": message,
		},
	}
}

// 广播游戏状态更新
	c.server.Broadcast(NetworkMessage{
		Type: MsgGameState,
		Data: data,
	})
}

// 处理语音请求
func (c *Client) handleAudioRequest(data interface{}) {
	log.Printf("🎤 Audio request: %v", data)
	
	// 这里可以集成语音识别服务
	// 返回语音响应
	c.send <- NetworkMessage{
		Type: MsgAudioResponse,
		Data: map[string]interface{}{
			"status": "processed",
			"request": data,
		},
		RequestID: getRequestID(data),
	}
}

// 处理资源请求
func (c *Client) handleResourceRequest(data interface{}) {
	log.Printf("📦 Resource request: %v", data)
	
	// 返回资源信息
	c.send <- NetworkMessage{
		Type: MsgResourceResponse,
		Data: map[string]interface{}{
			"status": "ok",
			"resources": []string{"config.json", "bgm.mp3", "click.mp3"},
		},
		RequestID: getRequestID(data),
	}
}

// 客户端写入协程
func (c *Client) writePump() {
	defer func() {
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				// 通道关闭
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			data, err := json.Marshal(message)
			if err != nil {
				log.Printf("🔴 Marshal error: %v", err)
				continue
			}

			c.mu.RLock()
			err = c.conn.WriteMessage(websocket.TextMessage, data)
			c.mu.RUnlock()

			if err != nil {
				log.Printf("🔴 Write error: %v", err)
				return
			}
		}
	}
}

// 辅助函数
func getClientID(c *Client) string {
	return c.conn.RemoteAddr().String()
}

func getRequestID(data interface{}) string {
	if m, ok := data.(map[string]interface{}); ok {
		if id, ok := m["requestId"].(string); ok {
			return id
		}
	}
	return ""
}
