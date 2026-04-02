package server

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

// User 用户结构
type User struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Password  string    `json:"-"` // 不序列化
	Avatar    string    `json:"avatar"`
	Level     int       `json:"level"`
	Score     int       `json:"score"`
	CreatedAt time.Time `json:"createdAt"`
	LastLogin time.Time `json:"lastLogin"`
}

// Token 令牌结构
type Token struct {
	Token     string    `json:"token"`
	UserID    string    `json:"userId"`
	ExpiresAt time.Time `json:"expiresAt"`
}

// AuthService 认证服务
type AuthService struct {
	users      map[string]*User      // username -> User
	tokens     map[string]*Token     // token -> Token
	userIDMap  map[string]string     // id -> username
	mu         sync.RWMutex
	guestCount int
}

// LoginRequest 登录请求
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// RegisterRequest 注册请求
type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthResponse 认证响应
type AuthResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	User    *User  `json:"user,omitempty"`
	Token   string `json:"token,omitempty"`
}

// NewAuthService 创建认证服务
func NewAuthService() *AuthService {
	as := &AuthService{
		users:     make(map[string]*User),
		tokens:    make(map[string]*Token),
		userIDMap: make(map[string]string),
	}
	
	// 创建测试用户
	as.createTestUser()
	
	return as
}

// 创建测试用户
func (as *AuthService) createTestUser() {
	testUser := &User{
		ID:        "user_001",
		Username:  "test",
		Email:     "test@example.com",
		Password:  "123456", // 实际项目中应该加密
		Avatar:    "",
		Level:     1,
		Score:     0,
		CreatedAt: time.Now(),
		LastLogin: time.Now(),
	}
	
	as.users[testUser.Username] = testUser
	as.userIDMap[testUser.ID] = testUser.Username
	log.Println("✅ Test user created: test / 123456")
}

// generateToken 生成随机令牌
func (as *AuthService) generateToken() string {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		log.Printf("Failed to generate token: %v", err)
		return ""
	}
	return hex.EncodeToString(bytes)
}

// Login 用户登录
func (as *AuthService) Login(username, password string) *AuthResponse {
	as.mu.RLock()
	defer as.mu.RUnlock()

	user, exists := as.users[username]
	if !exists {
		return &AuthResponse{
			Success: false,
			Message: "用户不存在",
		}
	}

	if user.Password != password {
		return &AuthResponse{
			Success: false,
			Message: "密码错误",
		}
	}

	// 生成令牌
	token := &Token{
		Token:     as.generateToken(),
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(24 * time.Hour), // 24 小时有效期
	}
	as.tokens[token.Token] = token

	// 更新最后登录时间
	user.LastLogin = time.Now()

	log.Printf("👤 User logged in: %s", username)

	return &AuthResponse{
		Success: true,
		Message: "登录成功",
		User:    user,
		Token:   token.Token,
	}
}

// Register 用户注册
func (as *AuthService) Register(username, email, password string) *AuthResponse {
	as.mu.Lock()
	defer as.mu.Unlock()

	// 检查用户名是否存在
	if _, exists := as.users[username]; exists {
		return &AuthResponse{
			Success: false,
			Message: "用户名已存在",
		}
	}

	// 创建新用户
	user := &User{
		ID:        generateUserID(),
		Username:  username,
		Email:     email,
		Password:  password, // 实际项目中应该加密
		Avatar:    "",
		Level:     1,
		Score:     0,
		CreatedAt: time.Now(),
		LastLogin: time.Now(),
	}

	as.users[username] = user
	as.userIDMap[user.ID] = username

	log.Printf("👤 User registered: %s", username)

	return &AuthResponse{
		Success: true,
		Message: "注册成功",
	}
}

// Logout 用户登出
func (as *AuthService) Logout(token string) {
	as.mu.Lock()
	defer as.mu.Unlock()

	delete(as.tokens, token)
	log.Println("👤 User logged out")
}

// ValidateToken 验证令牌
func (as *AuthService) ValidateToken(token string) (*User, bool) {
	as.mu.RLock()
	defer as.mu.RUnlock()

	t, exists := as.tokens[token]
	if !exists {
		return nil, false
	}

	if time.Now().After(t.ExpiresAt) {
		return nil, false
	}

	username, exists := as.userIDMap[t.UserID]
	if !exists {
		return nil, false
	}

	user, exists := as.users[username]
	if !exists {
		return nil, false
	}

	return user, true
}

// GetUserByID 通过 ID 获取用户
func (as *AuthService) GetUserByID(userID string) (*User, bool) {
	as.mu.RLock()
	defer as.mu.RUnlock()

	username, exists := as.userIDMap[userID]
	if !exists {
		return nil, false
	}

	user, exists := as.users[username]
	if !exists {
		return nil, false
	}

	return user, true
}

// GetUserByUsername 通过用户名获取用户
func (as *AuthService) GetUserByUsername(username string) (*User, bool) {
	as.mu.RLock()
	defer as.mu.RUnlock()

	user, exists := as.users[username]
	return user, exists
}

// GuestLogin 游客登录
func (as *AuthService) GuestLogin() *AuthResponse {
	as.mu.Lock()
	defer as.mu.Unlock()

	as.guestCount++
	username := fmt.Sprintf("Guest_%d", as.guestCount)

	user := &User{
		ID:        f"guest_{as.guestCount}",
		Username:  username,
		Email:     "",
		Password:  "",
		Avatar:    "",
		Level:     1,
		Score:     0,
		CreatedAt: time.Now(),
		LastLogin: time.Now(),
	}

	as.users[username] = user
	as.userIDMap[user.ID] = username

	token := &Token{
		Token:     as.generateToken(),
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(1 * time.Hour), // 游客 1 小时有效期
	}
	as.tokens[token.Token] = token

	log.Printf("👤 Guest logged in: %s", username)

	return &AuthResponse{
		Success: true,
		Message: "游客登录成功",
		User:    user,
		Token:   token.Token,
	}
}

// 生成用户 ID
func generateUserID() string {
	return fmt.Sprintf("user_%d", time.Now().UnixNano())
}

// HandleAuth HTTP 认证处理器
func (as *AuthService) HandleAuth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Action   string `json:"action"`
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
		Token    string `json:"token"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var response *AuthResponse

	switch req.Action {
	case "login":
		response = as.Login(req.Username, req.Password)
	case "register":
		response = as.Register(req.Username, req.Email, req.Password)
	case "logout":
		as.Logout(req.Token)
		response = &AuthResponse{Success: true, Message: "登出成功"}
	case "guest":
		response = as.GuestLogin()
	case "validate":
		user, valid := as.ValidateToken(req.Token)
		if valid {
			response = &AuthResponse{
				Success: true,
				User:    user,
			}
		} else {
			response = &AuthResponse{
				Success: false,
				Message: "令牌无效",
			}
		}
	default:
		response = &AuthResponse{
			Success: false,
			Message: "未知操作",
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
