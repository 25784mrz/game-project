package main

import (
	"log"
	"net/http"

	"GoGameServer/server"
)

func main() {
	// 创建服务器
	srv := server.NewServer(":8080")

	// 设置路由
	http.HandleFunc("/ws", srv.HandleWebSocket)
	http.HandleFunc("/health", srv.HandleHealth)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("../frontend/dist"))))

	log.Println("🎮 Game Server starting on :8080")
	log.Println("📡 WebSocket endpoint: ws://localhost:8080/ws")
	log.Println("💚 Health check: http://localhost:8080/health")

	// 启动服务器
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("Server failed:", err)
	}
}
