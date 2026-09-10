# Big Screen Pages Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将大屏按总览、机电系统、弱电系统、能源管理、运营管理拆分为五个英文命名的独立 HTML 页面，同时保持现有视觉、建筑主体、平面图和核心交互。

**Architecture:** 使用一个公共 `styles.css` 保留现有大屏视觉规范，一个公共 `app.js` 承担缩放、时钟、导航、楼层和平面图点位等通用交互；五个 HTML 只包含公共头部/建筑场景和各自页面的看板内容。原 `index.html` 改为轻量入口，默认跳转 `overview.html`。

**Tech Stack:** 原生 HTML、CSS、JavaScript、Font Awesome、Mock 数据。

---

### Task 1: Extract shared assets

**Files:**
- Create: `Big Screen/styles.css`
- Create: `Big Screen/app.js`
- Create: `Big Screen/assets/*` (reuse existing assets)

- [x] 从现有 `index.html` 提取公共样式，追加页面级布局选择器。
- [x] 抽取缩放、时钟、页面导航、楼层菜单、设备点位开关和设备弹窗通用逻辑。
- [x] 检查提取结果为 UTF-8，搜索替换产生的乱码字符。

### Task 2: Create independent HTML pages

**Files:**
- Create: `Big Screen/overview.html`
- Create: `Big Screen/mep.html`
- Create: `Big Screen/weak-electric.html`
- Create: `Big Screen/energy.html`
- Create: `Big Screen/operation.html`

- [x] 每个页面保留独立的 `<html>`、头部、模块导航和对应看板。
- [x] 页面之间使用英文文件名链接，导航按钮按当前页面高亮。
- [x] 中间建筑效果图、楼层按钮、平面图资源和点位结构在五页保持一致。
- [x] 页面内容使用现有 Mock 数据，不引入后端依赖。

### Task 3: Keep the existing entry stable

**Files:**
- Modify: `Big Screen/index.html`

- [x] 将原单体页面入口改为跳转 `overview.html`，不再承载五个页面的看板内容。
- [x] 保留直接打开 `index.html` 的兼容性。

### Task 4: Verify behavior and layout

**Files:**
- Verify: `Big Screen/overview.html`
- Verify: `Big Screen/mep.html`
- Verify: `Big Screen/weak-electric.html`
- Verify: `Big Screen/energy.html`
- Verify: `Big Screen/operation.html`

- [x] 检查五个页面 HTTP 200、标题和 HTML 结构完整。
- [x] 检查导航切换、楼层展开/选中后保持展开、设备点位开关和设备详情弹窗。
- [x] 检查能源管理六块看板左右三块布局与运营管理两个子视图。
- [x] 检查浏览器控制台无 JavaScript 错误，并确认无乱码。
