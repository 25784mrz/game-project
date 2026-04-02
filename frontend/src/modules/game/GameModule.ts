/**
 * 游戏模块 - 示例模块
 * 展示如何使用 MVVC 和分包模式
 */

import { Model } from '@mvc/Model';
import { View } from '@mvc/View';
import { ViewModel } from '@mvc/ViewModel';
import { Controller } from '@mvc/Controller';
import { EventSystem } from '@core/EventSystem';
import { NetworkManager, MessageType } from '@modules/network/NetworkManager';
import { AudioController } from '@modules/audio/AudioController';

// ==================== Model ====================

export class GameModel extends Model {
  constructor() {
    super();
    this.setAll({
      isPlaying: false,
      isPaused: false,
      score: 0,
      level: 1,
      lives: 3
    });
  }

  startGame(): void {
    this.set('isPlaying', true);
    this.set('isPaused', false);
    this.set('score', 0);
    this.eventSystem.emit('game:started');
  }

  pauseGame(): void {
    this.set('isPaused', true);
    this.eventSystem.emit('game:paused');
  }

  resumeGame(): void {
    this.set('isPaused', false);
    this.eventSystem.emit('game:resumed');
  }

  stopGame(): void {
    this.set('isPlaying', false);
    this.set('isPaused', false);
    this.eventSystem.emit('game:stopped');
  }

  addScore(points: number): void {
    const current = this.get<number>('score') || 0;
    this.set('score', current + points);
  }

  loseLife(): void {
    const lives = this.get<number>('lives') || 0;
    if (lives > 0) {
      this.set('lives', lives - 1);
      if (lives - 1 <= 0) {
        this.stopGame();
        this.eventSystem.emit('game:over', { score: this.get('score') });
      }
    }
  }

  nextLevel(): void {
    const level = this.get<number>('level') || 1;
    this.set('level', level + 1);
    this.eventSystem.emit('game:level up', level + 1);
  }
}

// ==================== View ====================

export class GameView extends View {
  render(): string {
    return `
      <div id="game-view" style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div id="game-header" style="display: flex; gap: 20px; margin-bottom: 20px;">
          <span>分数：<strong id="game-score">0</strong></span>
          <span>关卡：<strong id="game-level">1</strong></span>
          <span>生命：<strong id="game-lives">3</strong></span>
        </div>
        <div id="game-canvas" style="width: 800px; height: 600px; background: #1a1a2e; border: 2px solid #4a4a6a;">
          <div id="game-start-screen" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <h1>游戏准备就绪</h1>
            <button id="game-start-btn" style="padding: 15px 30px; font-size: 18px; cursor: pointer;">开始游戏</button>
          </div>
          <div id="game-playing-screen" style="display: none; height: 100%;">
            <p style="color: white; text-align: center; padding-top: 250px;">游戏中...</p>
          </div>
        </div>
        <div id="game-controls" style="margin-top: 20px; display: flex; gap: 10px;">
          <button id="game-voice-btn" style="padding: 10px 20px;">🎤 语音控制</button>
          <button id="game-pause-btn" style="padding: 10px 20px;">⏸️ 暂停</button>
        </div>
      </div>
    `;
  }

  protected onMount(): void {
    console.log('[GameView] Mounted');
  }

  protected bindEvents(): void {
    const startBtn = this.getElement<HTMLButtonElement>('#game-start-btn');
    const pauseBtn = this.getElement<HTMLButtonElement>('#game-pause-btn');
    const voiceBtn = this.getElement<HTMLButtonElement>('#game-voice-btn');

    startBtn?.addEventListener('click', () => {
      this.eventSystem.emit('game:start requested');
    });

    pauseBtn?.addEventListener('click', () => {
      this.eventSystem.emit('game:pause requested');
    });

    voiceBtn?.addEventListener('click', () => {
      this.eventSystem.emit('game:voice toggle');
    });
  }

  protected onUpdate(data?: any): void {
    // 更新 UI
    const scoreEl = this.getElement<HTMLElement>('#game-score');
    const levelEl = this.getElement<HTMLElement>('#game-level');
    const livesEl = this.getElement<HTMLElement>('#game-lives');

    if (scoreEl && data?.score !== undefined) scoreEl.textContent = String(data.score);
    if (levelEl && data?.level !== undefined) levelEl.textContent = String(data.level);
    if (livesEl && data?.lives !== undefined) livesEl.textContent = String(data.lives);
  }
}

// ==================== ViewModel ====================

export class GameViewModel extends ViewModel<GameModel, GameView> {
  private network: NetworkManager;
  private audio: AudioController;
  private isVoiceEnabled: boolean = false;

  constructor(model: GameModel, view: GameView) {
    super(model, view);
    this.network = NetworkManager.getInstance();
    this.audio = AudioController.getInstance();
  }

  protected bindModel(): void {
    // 监听 Model 变化并同步到 View
    this.subscribe(`model:GameModel:change`, (data) => {
      if (data) {
        this.syncToView(this.model.getAll());
      }
    });

    // 监听游戏事件
    this.subscribe('game:start requested', () => {
      this.model.startGame();
      this.network.send({ type: MessageType.GAME_ACTION, data: { action: 'start' } });
    });

    this.subscribe('game:pause requested', () => {
      if (this.model.get('isPaused')) {
        this.model.resumeGame();
        this.network.send({ type: MessageType.GAME_ACTION, data: { action: 'resume' } });
      } else {
        this.model.pauseGame();
        this.network.send({ type: MessageType.GAME_ACTION, data: { action: 'pause' } });
      }
    });

    this.subscribe('game:voice toggle', () => {
      this.toggleVoice();
    });

    // 监听语音识别
    this.subscribe('audio:speech recognized', (transcript) => {
      console.log('[GameVM] Voice command:', transcript);
    });
  }

  private toggleVoice(): void {
    if (this.isVoiceEnabled) {
      this.audio.stopListening();
      this.isVoiceEnabled = false;
    } else {
      this.audio.startListening();
      this.isVoiceEnabled = true;
      this.audio.speak('语音控制已启用');
    }
  }

  protected onInitialize(): void {
    console.log('[GameViewModel] Initialized');
  }
}

// ==================== Controller ====================

export class GameController extends Controller<GameModel, GameView, GameViewModel> {
  constructor(model: GameModel, view: GameView, viewModel: GameViewModel) {
    super(model, view, viewModel);
  }

  protected bindEvents(): void {
    // 监听网络消息
    this.subscribe(`network:${MessageType.GAME_STATE}`, (data) => {
      if (data) {
        this.model.setAll(data);
      }
    });

    // 监听游戏结束
    this.subscribe('game:over', (data) => {
      this.audio.speak(`游戏结束，你的得分是${data?.score || 0}`);
      this.network.send({ type: MessageType.GAME_EVENT, data: { event: 'gameOver', ...data } });
    });

    // 监听升级
    this.subscribe('game:level up', (level) => {
      this.audio.speak(`恭喜升级到第${level}关`);
    });
  }

  protected onInitialize(): void {
    console.log('[GameController] Initialized');
  }

  protected onStart(): void {
    console.log('[GameController] Started');
    this.audio.speak('游戏开始');
  }

  protected onStop(): void {
    console.log('[GameController] Stopped');
  }
}

// ==================== 工厂函数 ====================

export function createGameModule() {
  const model = new GameModel();
  const view = new GameView();
  const viewModel = new GameViewModel(model, view);
  const controller = new GameController(model, view, viewModel);
  
  return {
    model,
    view,
    viewModel,
    controller,
    start: () => controller.initialize(),
    destroy: () => controller.destroy()
  };
}
