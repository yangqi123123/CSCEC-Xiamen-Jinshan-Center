# 运营管理服务面板美化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将运营管理右侧的“报事报修”和“投诉建议”模块调整为参考图中的深蓝科技 HUD 面板，同时保留现有静态数据和筛选交互。

**Architecture:** 继续使用 `operation.html` 中现有的面板 DOM 和 `app.js` 的事件绑定。HTML 只补充统计区的可读结构，CSS 通过运营管理面板作用域覆盖服务模块视觉，避免影响资产、租赁和其他系统面板。

**Tech Stack:** 静态 HTML、CSS、现有 Font Awesome 6、原生 JavaScript。

---

### Task 1: 补充服务统计区语义结构

**Files:**
- Modify: `Big Screen/operation.html:42-44`
- Test: `Big Screen/operation.html`

- [x] **Step 1: 为报事报修统计区增加独立数字格和完成率块**

将报事报修模块中的现有 `.service-counter` 替换为：

```html
<div class="service-counter service-counter--reference">
  <div class="service-icon" aria-hidden="true"><i class="fa-solid fa-clipboard-list"></i></div>
  <div class="service-total"><span class="service-total-digits" aria-label="工单总数0129"><i>0</i><i>1</i><i>2</i><i>9</i></span><small>工单总数</small></div>
  <div class="service-stats">
    <div class="service-progress"><span>已完成</span><b>66</b><small>件</small></div>
    <div class="service-progress service-progress--rate"><span>完成率</span><b>51.16%</b></div>
  </div>
</div>
```

- [x] **Step 2: 为投诉建议统计区增加独立数字格和完成率块**

将投诉建议模块中的现有 `.service-counter` 替换为：

```html
<div class="service-counter service-counter--reference">
  <div class="service-icon" aria-hidden="true"><i class="fa-solid fa-clipboard-list"></i></div>
  <div class="service-total"><span class="service-total-digits" aria-label="反馈总数0095"><i>0</i><i>0</i><i>9</i><i>5</i></span><small>反馈总数</small></div>
  <div class="service-stats">
    <div class="service-progress"><span>已办理</span><b>79</b><small>件</small></div>
    <div class="service-progress service-progress--rate"><span>完成率</span><b>83.16%</b></div>
  </div>
</div>
```

- [x] **Step 3: 确认现有事件选择器仍能命中筛选按钮**

Run: `Select-String -Path 'Big Screen\\app.js' -Pattern 'operation-tabs'`

Expected: 输出现有 `.operation-tabs button` 事件绑定；不改动 `app.js`。

### Task 2: 实现参考图 HUD 视觉样式

**Files:**
- Modify: `Big Screen/styles.css:684-787`
- Test: `Big Screen/styles.css`

- [x] **Step 1: 添加服务面板的局部视觉覆盖**

在现有服务模块规则之后追加以下样式，使统计区和消息区固定在右侧面板高度内：

```css
.workspace.operation-active.operation-management .operation-repair,
.workspace.operation-active.operation-management .operation-complaints {
  overflow: hidden;
  border-color: rgba(105, 224, 226, .68);
  background: linear-gradient(160deg, rgba(25, 78, 129, .92), rgba(12, 43, 85, .86));
  box-shadow: inset 0 0 22px rgba(71, 186, 214, .1), 0 0 12px rgba(28, 145, 187, .16);
}
.workspace.operation-active.operation-management .operation-repair::before,
.workspace.operation-active.operation-management .operation-complaints::before {
  content: "";
  position: absolute;
  inset: 8px 10px auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(111, 234, 230, .72) 20%, rgba(111, 234, 230, .72) 80%, transparent);
}
.workspace.operation-active.operation-management .operation-repair .panel-title,
.workspace.operation-active.operation-management .operation-complaints .panel-title {
  position: relative;
  height: 38px;
  color: #f2ffff;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(164, 250, 248, .35);
}
.workspace.operation-active.operation-management .operation-repair .panel-title::before,
.workspace.operation-active.operation-management .operation-complaints .panel-title::before {
  content: "‹‹";
  position: absolute;
  left: 28px;
  color: #70e8e4;
  font: 700 16px/1 var(--mono);
}
.workspace.operation-active.operation-management .operation-repair .panel-title::after,
.workspace.operation-active.operation-management .operation-complaints .panel-title::after {
  content: "››";
  position: absolute;
  right: 28px;
  color: #70e8e4;
  font: 700 16px/1 var(--mono);
}
.workspace.operation-active.operation-management .operation-tabs {
  gap: 5px;
  margin: 0 0 5px;
}
.workspace.operation-active.operation-management .operation-tabs button {
  min-width: 39px;
  height: 24px;
  padding: 0 6px;
  border-color: rgba(123, 231, 231, .6);
  background: linear-gradient(180deg, rgba(41, 109, 148, .7), rgba(14, 55, 103, .7));
  box-shadow: inset 0 0 7px rgba(104, 228, 224, .12);
}
.workspace.operation-active.operation-management .operation-tabs button.active {
  color: #cffffa;
  border-color: #8cf5e9;
  background: rgba(71, 177, 178, .58);
  box-shadow: 0 0 7px rgba(96, 240, 229, .25), inset 0 0 8px rgba(152, 255, 232, .2);
}
.service-counter--reference {
  grid-template-columns: 74px minmax(0, 1fr) 112px;
  gap: 8px;
  min-height: 92px;
  padding: 0 2px 2px;
}
.service-counter--reference .service-icon {
  width: 68px;
  height: 65px;
  color: #d8ffff;
  background: radial-gradient(ellipse, rgba(102, 230, 222, .7), rgba(18, 83, 132, .24) 54%, transparent 70%);
  font-size: 31px;
  transform: translateY(2px);
}
.service-counter--reference .service-total {
  min-width: 0;
  text-align: center;
}
.service-total-digits {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 5px;
}
.service-total-digits i {
  display: grid;
  place-items: center;
  height: 54px;
  border: 1px solid rgba(133, 224, 230, .32);
  background: linear-gradient(180deg, rgba(73, 137, 169, .7), rgba(27, 75, 123, .68));
  color: #f8cf45;
  font: 700 35px/1 var(--mono);
  font-style: normal;
  text-shadow: 0 0 8px rgba(255, 201, 49, .28);
}
.service-counter--reference .service-total small {
  margin-top: 3px;
  font-size: 10px;
}
.service-stats {
  display: grid;
  gap: 6px;
}
.service-counter--reference .service-progress {
  min-height: 37px;
  grid-template-columns: 1fr auto auto;
  align-content: center;
  gap: 2px 5px;
  padding: 4px 6px;
  border: 1px solid rgba(107, 220, 225, .28);
  background: linear-gradient(90deg, rgba(46, 132, 160, .5), rgba(20, 74, 119, .42));
}
.service-counter--reference .service-progress span { height: auto; background: none; }
.service-counter--reference .service-progress b { font-size: 16px; }
.service-counter--reference .service-progress small { color: #bde4e6; font-size: 8px; }
.service-counter--reference .service-progress--rate { grid-template-columns: 1fr; }
.service-counter--reference .service-progress--rate b { color: #b8f1d1; font-size: 14px; }
.workspace.operation-active.operation-management .operation-section-title {
  height: 30px;
  margin: 0 0 7px;
  padding: 0 8px;
  border-bottom-color: rgba(112, 229, 226, .54);
  background: repeating-linear-gradient(-45deg, rgba(80, 191, 216, .22) 0 8px, rgba(58, 120, 169, .1) 8px 16px);
  font-size: 13px;
}
.workspace.operation-active.operation-management .operation-section-title::after {
  content: "";
  width: 5px;
  height: 5px;
  margin-left: auto;
  background: #f3ca45;
  transform: skew(-28deg);
}
.workspace.operation-active.operation-management .service-row {
  min-height: 53px;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: 6px;
  padding: 0 7px;
  border-left: 2px solid rgba(103, 226, 225, .9);
  background: linear-gradient(110deg, rgba(58, 133, 169, .58), rgba(28, 77, 126, .58));
}
.workspace.operation-active.operation-management .service-row + .service-row { margin-top: 7px; }
.workspace.operation-active.operation-management .service-row strong {
  justify-self: center;
  min-width: 32px;
  padding: 4px 3px;
  border-left: 2px solid #e89565;
  background: rgba(139, 92, 83, .44);
  color: #fff2e0;
  font-size: 11px;
  text-align: center;
}
.workspace.operation-active.operation-management .service-row strong.normal {
  border-left-color: #e4c876;
  background: rgba(127, 121, 82, .38);
  color: #fff6d2;
}
.workspace.operation-active.operation-management .service-row b { color: #f4ffff; font-size: 12px; }
.workspace.operation-active.operation-management .service-row small { font-size: 10px; }
.workspace.operation-active.operation-management .service-row em {
  position: relative;
  padding-left: 10px;
  color: #ffd9c0;
  font-size: 10px;
}
.workspace.operation-active.operation-management .service-row em::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #dd8750;
  transform: translateY(-50%);
}
.workspace.operation-active.operation-management .service-row em.done { color: #c6f5d7; }
.workspace.operation-active.operation-management .service-row em.done::before { background: #75e7b4; }
```

- [x] **Step 2: 检查窄窗口下固定网格不会撑破**

Run: `rg -n "service-counter--reference|service-total-digits|service-row" 'Big Screen\\styles.css'`

Expected: 新规则均包含 `minmax(0, 1fr)`、`overflow: hidden` 或省略相关声明，且未删除既有公共服务规则。

### Task 3: 静态与交互验证

**Files:**
- Test: `Big Screen/operation.html`
- Test: `Big Screen/app.js`
- Test: `Big Screen/styles.css`

- [x] **Step 1: 检查 JavaScript 语法**

Run: `node --check 'Big Screen/app.js'`

Expected: 命令成功退出且无语法错误。

- [x] **Step 2: 检查关键内容完整性**

Run: `$html = Get-Content -Raw 'Big Screen\\operation.html'; @('报事报修','投诉建议','工单总数','反馈总数','51.16%','83.16%') | ForEach-Object { if ($html -notmatch [regex]::Escape($_)) { throw "Missing $_" } }`

Expected: 命令成功退出，无 `Missing` 输出。

- [x] **Step 3: 在浏览器打开 `Big Screen/operation.html`，点击“运营管理”底部按钮**

Expected: 右侧显示报事报修和投诉建议；两个面板标题、四个时间按钮、数字格、统计块和消息行完整可见，点击时间按钮后 active 样式移动，中央建筑和其他面板不发生位移。

- [x] **Step 4: 检查 1920x1080 与窄窗口**

Expected: 1920x1080 下右侧两个面板不与中央建筑重叠；窄窗口下标题、数字、状态文本不产生横向溢出，消息标题超长时显示省略号。
