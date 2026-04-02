/**
 * 全局类型定义
 */

// 游戏状态
export type GameStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'gameover';

// 玩家数据
export interface PlayerData {
  id: string;
  name: string;
  score: number;
  level: number;
  lives: number;
  avatar?: string;
}

// 游戏配置
export interface GameConfig {
  difficulty: 'easy' | 'normal' | 'hard';
  maxPlayers: number;
  duration: number; // 秒
}

// 网络状态
export type NetworkStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

// 资源类型
export type ResourceType = 'image' | 'audio' | 'video' | 'json' | 'text';

// 模块定义
export interface ModuleDefinition {
  name: string;
  version: string;
  dependencies?: string[];
  init?: () => Promise<void>;
  destroy?: () => void;
}

// 事件定义
export interface GameEvents {
  'game:start': () => void;
  'game:pause': () => void;
  'game:resume': () => void;
  'game:stop': () => void;
  'game:over': (score: number) => void;
  'player:score': (score: number) => void;
  'player:levelup': (level: number) => void;
  'network:connected': () => void;
  'network:disconnected': () => void;
  'audio:ready': () => void;
  'resource:loaded': (id: string) => void;
}

// API 响应
export interface ApiResponse<T = any> {
  status: 'ok' | 'error';
  data?: T;
  message?: string;
  code?: number;
}

// WebSocket 消息
export interface WSMessage {
  type: string;
  data?: any;
  requestId?: string;
  timestamp?: number;
}
