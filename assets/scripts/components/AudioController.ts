/**
 * 音频控制器组件
 * 管理背景音乐、音效播放
 */

import { _decorator, Component, Node, AudioClip, AudioSource, assetManager, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    @property(AudioClip)
    bgmClip: AudioClip | null = null;
    
    @property(AudioClip)
    clickClip: AudioClip | null = null;
    
    @property
    bgmVolume: number = 0.5;
    
    @property
    sfxVolume: number = 0.8;
    
    @property
    maxAudioSources: number = 10;
    
    private bgmSource: AudioSource | null = null;
    private sfxPool: AudioSource[] = [];
    private currentSfxIndex: number = 0;
    
    static instance: AudioController | null = null;
    
    static getInstance(): AudioController {
        if (!AudioController.instance) {
            const node = new Node('AudioController');
            AudioController.instance = node.addComponent(AudioController);
            game.addPersistRootNode(node);
        }
        return AudioController.instance;
    }
    
    onLoad() {
        if (AudioController.instance && AudioController.instance !== this) {
            this.node.destroy();
            return;
        }
        AudioController.instance = this;
        
        // 初始化 BGM 音源
        this.bgmSource = this.node.addComponent(AudioSource);
        this.bgmSource.loop = true;
        this.bgmSource.volume = this.bgmVolume;
        
        if (this.bgmClip) {
            this.bgmSource.clip = this.bgmClip;
        }
        
        // 初始化音效池
        for (let i = 0; i < this.maxAudioSources; i++) {
            const source = this.node.addComponent(AudioSource);
            source.volume = this.sfxVolume;
            this.sfxPool.push(source);
        }
        
        console.log('[AudioController] Initialized');
    }
    
    onDestroy() {
        AudioController.instance = null;
    }
    
    /**
     * 播放背景音乐
     */
    playBGM(clip?: AudioClip): void {
        if (!this.bgmSource) return;
        
        if (clip) {
            this.bgmSource.clip = clip;
        }
        
        if (this.bgmSource.clip && !this.bgmSource.playing) {
            this.bgmSource.play();
            console.log('[AudioController] Playing BGM');
        }
    }
    
    /**
     * 停止背景音乐
     */
    stopBGM(): void {
        if (this.bgmSource && this.bgmSource.playing) {
            this.bgmSource.stop();
            console.log('[AudioController] Stopped BGM');
        }
    }
    
    /**
     * 暂停背景音乐
     */
    pauseBGM(): void {
        if (this.bgmSource && this.bgmSource.playing) {
            this.bgmSource.pause();
        }
    }
    
    /**
     * 恢复背景音乐
     */
    resumeBGM(): void {
        if (this.bgmSource && this.bgmSource.paused) {
            this.bgmSource.play();
        }
    }
    
    /**
     * 播放音效
     */
    playSFX(clip: AudioClip): void {
        if (!clip) return;
        
        const source = this.sfxPool[this.currentSfxIndex];
        source.clip = clip;
        source.play();
        
        // 循环使用音效池
        this.currentSfxIndex = (this.currentSfxIndex + 1) % this.maxAudioSources;
    }
    
    /**
     * 播放点击音效
     */
    playClick(): void {
        if (this.clickClip) {
            this.playSFX(this.clickClip);
        }
    }
    
    /**
     * 设置 BGM 音量
     */
    setBGMVolume(volume: number): void {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgmSource) {
            this.bgmSource.volume = this.bgmVolume;
        }
    }
    
    /**
     * 设置音效音量
     */
    setSFXVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.sfxPool.forEach(source => {
            source.volume = this.sfxVolume;
        });
    }
    
    /**
     * 静音所有音频
     */
    muteAll(): void {
        if (this.bgmSource) {
            this.bgmSource.volume = 0;
        }
        this.sfxPool.forEach(source => {
            source.volume = 0;
        });
    }
    
    /**
     * 取消静音
     */
    unmuteAll(): void {
        if (this.bgmSource) {
            this.bgmSource.volume = this.bgmVolume;
        }
        this.sfxPool.forEach(source => {
            source.volume = this.sfxVolume;
        });
    }
    
    /**
     * 从资源加载音频
     */
    async loadAudio(path: string): Promise<AudioClip | null> {
        return new Promise((resolve) => {
            resources.load(path, AudioClip, (err, clip) => {
                if (err) {
                    console.error('[AudioController] Failed to load audio:', path, err);
                    resolve(null);
                } else {
                    console.log('[AudioController] Loaded audio:', path);
                    resolve(clip);
                }
            });
        });
    }
}
