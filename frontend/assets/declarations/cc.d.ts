// Cocos Creator 基础类型声明
declare module 'cc' {
    export const _decorator: any;
    export class Component {
        node: Node;
        start(): void;
        onLoad(): void;
        onDestroy(): void;
    }
    export class Node {
        constructor(name?: string);
        parent: Node | null;
        children: Node[];
        active: boolean;
        name: string;
        position: Vec3;
        eulerAngles: Vec3;
        scale: Vec3;
        opacity: number;
        isValid: boolean;
        static EventType: {
            TOUCH_END: string;
        };
        addComponent<T extends Component>(constructor: any): T;
        getComponent<T extends Component>(constructor: any): T | null;
        setPosition(position: Vec3): void;
        setPosition(x: number, y: number, z?: number): void;
        setRotationFromEuler(euler: Vec3): void;
        getChildByName(name: string): Node | null;
        getChildByPath(path: string): Node | null;
        on(type: string, callback: Function, target?: any): void;
        off(type: string, callback: Function, target?: any): void;
        destroy(): boolean;
    }
    export class Label extends Component {
        node: Node;
        string: string;
        fontSize: number;
        fontWeight: string;
        color: Color;
        horizontalAlign: number;
        verticalAlign: number;
        static FontWeight: {
            NORMAL: string;
            BOLD: string;
        };
        static HorizontalAlign: {
            LEFT: number;
            CENTER: number;
            RIGHT: number;
        };
        static VerticalAlign: {
            TOP: number;
            CENTER: number;
            BOTTOM: number;
        };
    }
    export class Button extends Component {
        node: Node;
        static EventType: {
            CLICK: string;
        };
        on(type: string, callback: Function, target?: any): void;
        off(type: string, callback: Function, target?: any): void;
    }
    export class Sprite extends Component {
        node: Node;
        color: Color;
    }
    export class UITransform extends Component {
        node: Node;
        setContentSize(width: number, height: number): void;
        width: number;
        height: number;
    }
    export class Widget extends Component {
        node: Node;
        isAlignLeft: boolean;
        isAlignRight: boolean;
        isAlignTop: boolean;
        isAlignBottom: boolean;
        isAlignHorizontalCenter: boolean;
        isAlignVerticalCenter: boolean;
        left: number;
        right: number;
        top: number;
        bottom: number;
    }
    export class Color {
        constructor(r: number, g: number, b: number, a: number);
    }
    export class Vec3 {
        constructor(x: number, y: number, z: number);
        x: number;
        y: number;
        z: number;
        clone(): Vec3;
        set(x: number, y: number, z: number): void;
        add(v: Vec3): Vec3;
        multiplyScalar(s: number): Vec3;
        length(): number;
        normalize(): void;
    }
    export class ProgressBar extends Component {
        node: Node;
        progress: number;
    }
    export class SpriteFrame {
    }
    export class Canvas extends Component {
        node: Node;
        fitWidth: boolean;
        fitHeight: boolean;
    }
    export class Camera extends Component {
        node: Node;
        priority: number;
    }
    export class EventTarget {
        on(type: string, callback: Function, target?: any): void;
        once(type: string, callback: Function, target?: any): void;
        off(type: string, callback?: Function, target?: any): void;
        emit(type: string, ...args: any[]): void;
    }
    export class director {
        static addPersistRootNode(node: Node): void;
        static loadScene(sceneName: string): Promise<void>;
        static preloadScene(sceneName: string, callback?: (err: Error | null) => void): void;
        static runScene(scene: Scene): void;
        static getScene(): Scene | null;
    }
    export function find(path: string): Node | null;
    export function tween(target: any): Tween<any>;
    export class Tween<T> {
        to(duration: number, props: any, options?: any): Tween<T>;
        delay(duration: number): Tween<T>;
        then(tween: Tween<T>): Tween<T>;
        call(callback: Function): Tween<T>;
        start(): Tween<T>;
    }
    export class EditBox extends Component {
        node: Node;
        string: string;
        placeholder: string;
        fontSize: number;
        fontColor: Color;
        inputFlag: number;
        returnType: number;
        static InputFlag: {
            PASSWORD: number;
        };
        static KeyboardReturnType: {
            DONE: number;
        };
        editingDidBegan: Function;
    }
    export class Layout extends Component {
        node: Node;
        type: number;
        spacingY: number;
        paddingTop: number;
        paddingBottom: number;
        paddingLeft: number;
        paddingRight: number;
        resizeMode: number;
        static Type: {
            VERTICAL: number;
        };
        static ResizeMode: {
            CONTAINER: number;
        };
    }
    export const game: {
        addPersistRootNode(node: Node): void;
        pause(): void;
        resume(): void;
        restart(): void;
        end(): void;
        canvasSize: { width: number; height: number };
    };
    export const resources: {
        load(path: string, type: any, callback: (err: Error | null, asset: any) => void): void;
    };
    export const input: {
        on(type: string, callback: Function, target?: any): void;
        off(type: string, callback: Function, target?: any): void;
    };
    export class Input {
        static EventType: {
            KEY_DOWN: string;
            KEY_UP: string;
            TOUCH_START: string;
            TOUCH_MOVE: string;
            TOUCH_END: string;
            MOUSE_DOWN: string;
            MOUSE_UP: string;
            MOUSE_MOVE: string;
            MOUSE_WHEEL: string;
        };
    }
    export class EventKeyboard {
        keyCode: number;
    }
    export class EventTouch {
        getAllTouches(): any[];
        getLocation(): { x: number; y: number };
    }
    export class EventMouse {
        getButton(): number;
        getLocation(): { x: number; y: number };
        getScrollY(): number;
    }
    export class KeyCode {
        static KEY_W: number;
        static KEY_S: number;
        static KEY_A: number;
        static KEY_D: number;
        static KEY_J: number;
        static KEY_K: number;
        static KEY_P: number;
        static ARROW_UP: number;
        static ARROW_DOWN: number;
        static ARROW_LEFT: number;
        static ARROW_RIGHT: number;
        static SPACE: number;
        static ESCAPE: number;
    }
    export class Vec2 {
        constructor(x: number, y: number);
        x: number;
        y: number;
        set(x: number, y: number): void;
        length(): number;
    }
    export class Animation {
        getState(name: string): any;
    }
    export class AudioSource extends Component {
        node: Node;
        clip: AudioClip | null;
        loop: boolean;
        volume: number;
        playing: boolean;
        paused: boolean;
        play(): void;
        stop(): void;
        pause(): void;
    }
    export class Scene {
        name: string;
    }
    export class AssetManager {
    }
    export class ImageAsset {
    }
    export class AudioClip {
    }
    export class Prefab {
    }
    export const assetManager: AssetManager;
}
