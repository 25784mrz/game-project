/**
 * 登录界面 UI 生成器
 * 用于在 Cocos Creator 编辑器中创建完整的登录界面
 */
import { Component, Node } from 'cc';
export declare class LoginUIBuilder extends Component {
    designWidth: number;
    designHeight: number;
    /**
     * 构建登录界面（在编辑器中调用）
     */
    buildLoginUI(): Node;
    /**
     * 创建背景
     */
    private createBackground;
    /**
     * 创建标题
     */
    private createTitle;
    /**
     * 创建表单容器
     */
    private createFormContainer;
    /**
     * 创建用户名输入框
     */
    private createUsernameInput;
    /**
     * 创建密码输入框
     */
    private createPasswordInput;
    /**
     * 创建登录按钮
     */
    private createLoginButton;
    /**
     * 创建注册按钮
     */
    private createRegisterButton;
    /**
     * 创建切换提示文本
     */
    private createToggleLabel;
    /**
     * 创建错误提示标签
     */
    private createErrorLabel;
    /**
     * 绑定控制器引用
     */
    private bindControllerReferences;
    /**
     * 播放入场动画
     */
    playEnterAnimation(rootNode: Node): void;
}
