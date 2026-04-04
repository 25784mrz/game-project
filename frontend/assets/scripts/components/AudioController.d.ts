/**
 * 音频控制器组件
 * 管理背景音乐、音效播放
 */
import { Component, AudioClip } from 'cc';
export declare class AudioController extends Component {
    bgmClip: AudioClip | null;
    clickClip: AudioClip | null;
    bgmVolume: number;
    sfxVolume: number;
    maxAudioSources: number;
    private bgmSource;
    private sfxPool;
    private currentSfxIndex;
    static instance: AudioController | null;
    static getInstance(): AudioController;
    onLoad(): void;
    onDestroy(): void;
    /**
     * 播放背景音乐
     */
    playBGM(clip?: AudioClip): void;
    /**
     * 停止背景音乐
     */
    stopBGM(): void;
    /**
     * 暂停背景音乐
     */
    pauseBGM(): void;
    /**
     * 恢复背景音乐
     */
    resumeBGM(): void;
    /**
     * 播放音效
     */
    playSFX(clip: AudioClip): void;
    /**
     * 播放点击音效
     */
    playClick(): void;
    /**
     * 设置 BGM 音量
     */
    setBGMVolume(volume: number): void;
    /**
     * 设置音效音量
     */
    setSFXVolume(volume: number): void;
    /**
     * 静音所有音频
     */
    muteAll(): void;
    /**
     * 取消静音
     */
    unmuteAll(): void;
    /**
     * 从资源加载音频
     */
    loadAudio(path: string): Promise<AudioClip | null>;
}
