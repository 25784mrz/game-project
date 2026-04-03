/**
 * 语音控制模块 - 处理语音输入输出
 * 使用 Web Speech API 和音频流
 */

import { EventSystem } from '@core/EventSystem';
import { NetworkManager, MessageType } from '../network/NetworkManager';

export interface VoiceConfig {
  language: string;
  pitch: number;
  rate: number;
  volume: number;
}

export class AudioController {
  private static instance: AudioController;
  private eventSystem: EventSystem;
  private network: NetworkManager;
  
  // 语音合成
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  
  // 语音识别
  private recognition: any = null;
  private isListening: boolean = false;
  
  // 音频播放
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();

  private config: VoiceConfig = {
    language: 'zh-CN',
    pitch: 1,
    rate: 1,
    volume: 1
  };

  private constructor() {
    this.eventSystem = EventSystem.getInstance();
    this.network = NetworkManager.getInstance();
    this.init();
  }

  static getInstance(): AudioController {
    if (!AudioController.instance) {
      AudioController.instance = new AudioController();
    }
    return AudioController.instance;
  }

  private init(): void {
    // 初始化语音合成
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }

    // 初始化语音识别
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.config.language;
        
        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          this.eventSystem.emit('audio:speech recognized', transcript);
          this.handleSpeechResult(transcript);
        };
        
        this.recognition.onerror = (event: any) => {
          console.error('[Audio] Speech recognition error:', event.error);
          this.eventSystem.emit('audio:error', event.error);
        };
        
        this.recognition.onend = () => {
          this.isListening = false;
          this.eventSystem.emit('audio:listening ended');
        };
      }
    }

    // 初始化音频上下文
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (err) {
      console.error('[Audio] Failed to create audio context:', err);
    }
  }

  private loadVoices(): void {
    if (this.synth) {
      this.voices = this.synth.getVoices();
      console.log('[Audio] Loaded voices:', this.voices.length);
    }
  }

  /**
   * 语音合成 - 文字转语音
   */
  speak(text: string, options?: Partial<VoiceConfig>): void {
    if (!this.synth) {
      console.warn('[Audio] Speech synthesis not available');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    const config = { ...this.config, ...options };
    utterance.lang = config.language;
    utterance.pitch = config.pitch;
    utterance.rate = config.rate;
    utterance.volume = config.volume;

    // 选择中文语音
    const zhVoice = this.voices.find(v => v.lang.startsWith('zh'));
    if (zhVoice) {
      utterance.voice = zhVoice;
    }

    utterance.onstart = () => this.eventSystem.emit('audio:speech started');
    utterance.onend = () => this.eventSystem.emit('audio:speech ended');
    utterance.onerror = (err) => this.eventSystem.emit('audio:error', err);

    this.synth.speak(utterance);
  }

  /**
   * 开始监听语音
   */
  startListening(): void {
    if (!this.recognition) {
      console.warn('[Audio] Speech recognition not available');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      this.recognition.start();
      this.isListening = true;
      this.eventSystem.emit('audio:listening started');
    } catch (err) {
      console.error('[Audio] Failed to start listening:', err);
    }
  }

  /**
   * 停止监听
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * 处理语音识别结果
   */
  private handleSpeechResult(transcript: string): void {
    // 发送语音命令到服务器
    this.network.send({
      type: MessageType.AUDIO_REQUEST,
      data: {
        action: 'voice_command',
        transcript
      }
    });

    // 简单的语音命令处理
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes('开始') || lowerTranscript.includes('start')) {
      this.eventSystem.emit('game:start');
    } else if (lowerTranscript.includes('停止') || lowerTranscript.includes('stop')) {
      this.eventSystem.emit('game:stop');
    } else if (lowerTranscript.includes('暂停') || lowerTranscript.includes('pause')) {
      this.eventSystem.emit('game:pause');
    }
  }

  /**
   * 播放音频流 (从服务器接收)
   */
  async playAudioStream(audioData: ArrayBuffer): Promise<void> {
    if (!this.audioContext) return;

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
      
      this.eventSystem.emit('audio:stream played');
    } catch (err) {
      console.error('[Audio] Failed to play audio stream:', err);
      this.eventSystem.emit('audio:error', err);
    }
  }

  /**
   * 播放音效
   */
  async playSound(soundId: string): Promise<void> {
    if (!this.audioContext) return;

    const buffer = this.audioBuffers.get(soundId);
    if (!buffer) {
      console.warn(`[Audio] Sound not found: ${soundId}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  /**
   * 加载音效
   */
  async loadSound(soundId: string, url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(soundId, audioBuffer);
      console.log(`[Audio] Loaded sound: ${soundId}`);
    } catch (err) {
      console.error(`[Audio] Failed to load sound ${soundId}:`, err);
    }
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * 静音
   */
  mute(): void {
    this.config.volume = 0;
  }

  /**
   * 取消静音
   */
  unmute(): void {
    this.config.volume = 1;
  }

  isListeningEnabled(): boolean {
    return this.isListening;
  }

  isSpeechAvailable(): boolean {
    return this.synth !== null;
  }
}
