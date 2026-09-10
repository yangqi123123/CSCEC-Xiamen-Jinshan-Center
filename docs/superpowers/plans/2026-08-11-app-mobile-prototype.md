# App 移动端登录与首页原型 Implementation Plan

> **For agentic workers:** This plan is executed inline in the current workspace because the workspace contains no usable Git repository.

**Goal:** 将 `app/app-login.html` 重做为 iPhone 15 风格的移动端账号密码登录与工业首页原型，并在登录成功后在同页切换首页。

**Architecture:** 保持单个 HTML 文件，使用两个根视图 `.login-view` 和 `.home-view` 管理登录态；CSS 负责 iPhone 外框、屏幕安全区、首页卡片和响应式缩放，页面内脚本负责固定凭据校验、密码可见性、tab 切换和轻量提示。现有 Web 后台文件及入口链接不改。

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Font Awesome 6 CDN, Unsplash image URL.

---

### Task 1: 替换页面语义结构和静态数据

**Files:**
- Modify: `C:\Users\10208\Desktop\产品基座\app\app-login.html`

- [ ] **Step 1: 删除旧的双栏登录结构和扫码提示**

  移除 `.mobile-login-shell`、`.mobile-copy`、`.scan-box` 和指向 `../web/pages/device/list.html` 的登录链接；保留页面为独立 App 原型，不保留“扫码登录”或“企业微信授权”文案。

- [ ] **Step 2: 添加 iPhone 外框与登录/首页双视图**

  页面结构使用以下根层级，保证两种状态共用同一个手机画布：

  ```html
  <main class="prototype-stage">
    <section class="iphone-shell" aria-label="工业小程序移动端原型">
      <div class="iphone-screen">
        <div class="dynamic-island" aria-hidden="true"></div>
        <header class="ios-status-bar" aria-label="状态栏">...</header>
        <div class="screen-content">
          <section class="login-view" id="loginView">...</section>
          <section class="home-view" id="homeView" hidden>...</section>
        </div>
        <div class="home-indicator" aria-hidden="true"></div>
      </div>
    </section>
  </main>
  ```

- [ ] **Step 3: 添加登录字段和固定凭据提示**

  使用可见 `label`、`autocomplete="username"`、`autocomplete="current-password"` 和 48px 高输入框；账号默认值为 `13800002026`，密码默认值为 `888888`，提示文字明确说明仅用于原型演示。密码切换按钮使用 `aria-label`，错误区使用 `role="alert"`。

- [ ] **Step 4: 添加截图对应的首页首屏**

  首页包含顶部标题和通知徽标、搜索框、蓝色工业横幅、四项数据概览、八个常用功能入口、三条告警信息和四项底部导航。横幅图片使用带固定尺寸和 `alt` 的 Unsplash 图片，卡片数据直接写入页面，避免引入新数据依赖。

### Task 2: 重做 iPhone 15 视觉系统和响应式样式

**Files:**
- Modify: `C:\Users\10208\Desktop\产品基座\app\app-login.html`

- [ ] **Step 1: 定义移动端设计 tokens**

  使用以下 CSS 基础设置，并以苹方为首选字体：

  ```css
  :root {
    --app-blue: #1769e8;
    --app-blue-deep: #0f55ce;
    --app-ink: #182433;
    --app-muted: #7a8798;
    --app-line: #e9eef5;
    --app-surface: #ffffff;
    --app-canvas: #f5f7fb;
    --app-danger: #e25555;
    --app-warning: #e4a52f;
    --app-green: #26b49f;
    --app-font: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
  }
  ```

- [ ] **Step 2: 实现桌面预览和 iPhone 15 屏幕比例**

  `.iphone-shell` 使用 `width: min(393px, calc(100vw - 32px))`、`aspect-ratio: 393 / 852`、深色外框和 38px 外壳圆角；`.iphone-screen` 使用 `overflow: hidden`、白色背景、顶部安全区和底部安全区。小于 480px 时移除外层阴影和多余留白，确保屏幕可用。

- [ ] **Step 3: 实现首页层级、状态色和触控反馈**

  采用 8px 间距节奏；按钮、tab、功能项、告警项均至少 44px 高；主按钮为品牌蓝，卡片仅使用低透明度阴影和不超过 10px 的圆角。增加 `:focus-visible`、`:active` 和 reduced-motion 规则，不依赖 hover 完成核心交互。

- [ ] **Step 4: 实现底部导航固定安全区**

  `.app-tabbar` 固定在首页内容底部并预留 `padding-bottom: calc(12px + env(safe-area-inset-bottom))`；首页滚动区补足底部内边距，避免告警列表被导航遮挡。

### Task 3: 添加登录和首页交互

**Files:**
- Modify: `C:\Users\10208\Desktop\产品基座\app\app-login.html`

- [ ] **Step 1: 定义固定凭据和视图切换方法**

  在页面脚本中定义 `TEST_ACCOUNT = "13800002026"`、`TEST_PASSWORD = "888888"`，并实现 `showView(name)`：登录成功时隐藏 `#loginView`、显示 `#homeView`、更新 `document.title` 并聚焦首页标题。

- [ ] **Step 2: 实现表单校验和加载反馈**

  登录提交按以下顺序处理：空账号显示“请输入账号”，空密码显示“请输入密码”，凭据不匹配显示“账号或密码错误，请检查后重试”；校验通过后按钮改为“正在进入…”，禁用 420ms，再进入首页。阻止默认提交，页面不发生 URL 跳转。

- [ ] **Step 3: 实现密码显示切换和首页轻量交互**

  眼睛按钮切换 password/text 并同步 aria-label；搜索框按回车显示一条 `aria-live="polite"` 提示；通知、功能项和告警项点击显示对应提示；四个底部 tab 使用 `data-tab` 切换简化视图并更新 active 状态。

### Task 4: 静态与视觉验证

**Files:**
- Verify: `C:\Users\10208\Desktop\产品基座\app\app-login.html`
- Verify: `C:\Users\10208\Desktop\产品基座\docs\superpowers\specs\2026-08-11-app-mobile-prototype-design.md`

- [ ] **Step 1: 检查页面脚本语法**

  运行：`node --check app/app-login.html`。如果 Node 不接受 HTML 文件，则先用 PowerShell 提取最后一个 `<script>` 内容到临时文本并运行 `node --check`，预期无 `SyntaxError`。

- [ ] **Step 2: 检查需求文案和跳转残留**

  运行：`rg -n "扫码|企业微信|web/pages/device|TBD|TODO|占位" app/app-login.html`，预期无输出；运行：`rg -n "13800002026|888888|homeView|loginView|app-tabbar" app/app-login.html`，预期均能找到。

- [ ] **Step 3: 用浏览器验证关键交互**

  在 `393 x 852` 视口打开页面，验证错误登录、正确登录、密码显隐、首页 tab 切换和搜索提示；在 `390 x 844` 与 `375 x 812` 视口确认没有横向滚动，底部导航不遮挡内容。

- [ ] **Step 4: 输出最终状态**

  检查工作区 diff 只包含本次 App 原型页面、设计文档和实施计划，向用户报告固定凭据、验证结果和页面路径。
