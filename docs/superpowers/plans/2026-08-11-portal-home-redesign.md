# 产品基座入口页整体布局美化 Implementation Plan

> **For agentic workers:** This plan is executed inline in the current workspace because no valid git repository/worktree is available.

**Goal:** 在保留三个入口跳转的前提下，重做 `index.html` 的企业产品门户布局与视觉表现。

**Architecture:** 继续使用单页 HTML + 页面内 CSS，不改变入口链接和公共后台页面。页面由品牌栏、主视觉区、入口卡片区和平台能力栏组成，入口卡片复用统一的蓝色、青绿色和紫色语义色。

**Tech Stack:** HTML5, CSS3, Font Awesome CDN.

---

### Task 1: 重构入口页 HTML 层级

**Files:**
- Modify: `C:\Users\10208\Desktop\产品基座\index.html`

- [x] 保留三个现有入口 `web/web-login.html`、`app/app-login.html` 和 `Big%20Screen/index.html`。
- [x] 将入口页内容拆分为品牌栏、主视觉、入口卡片、平台能力栏四个语义区域。
- [x] 给入口卡片补充可访问名称、状态标签和 focus-visible 所需结构，不增加业务动作。

### Task 2: 重做页面 CSS 视觉与响应式布局

**Files:**
- Modify: `C:\Users\10208\Desktop\产品基座\index.html`

- [x] 以浅灰蓝页面底色、深蓝主视觉区和白色入口卡片建立层次。
- [x] 使用 8px 间距节奏、4px/6px 低圆角和轻量阴影，匹配现有 TOB 规范。
- [x] 为入口卡片实现 hover、focus-visible 和 primary 状态。
- [x] 添加 980px、720px 两档响应式规则，确保小屏单列且无横向滚动。

### Task 3: 静态验证

**Files:**
- Verify: `C:\Users\10208\Desktop\产品基座\index.html`

- [x] 用正则确认三个入口链接各出现一次或以上。
- [x] 用 Node 检查页面内脚本无语法错误。
- [x] 检查 CSS 花括号数量一致，并确认响应式断点存在。
