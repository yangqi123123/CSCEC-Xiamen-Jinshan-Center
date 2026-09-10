# 运营管理大屏 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 1920x1080 大屏中实现顶部“运营管理”入口，以及“资产管理/运营管理”两个底部视图和对应左右看板。

**Architecture:** 复用 `Big Screen/index.html` 当前的 `.workspace`、`.left-rail`、`.right-rail` 和 `.building-scene`。新增运营看板作为隐藏的 `.operation-dashboard-panel`，通过 `operation-active` 与 `operation-management` 状态类控制显示，底部按钮只切换数据看板，不改变中央建筑、楼层和平面图节点。

**Tech Stack:** 原生 HTML、CSS Grid/Flex、内联 SVG、原生 JavaScript；无新增依赖或资源。

---

### Task 1: Add Operation Dashboard Layout Styles

**Files:**
- Modify: `Big Screen/index.html:353-405` near the existing energy dashboard styles

- [ ] **Step 1: Define mutually exclusive operation states**

Add selectors for `.workspace.operation-active` and `.workspace.operation-management` so normal rail panels are hidden while the selected operation panels are shown. Use fixed rows within the existing 360px rails:

```css
.operation-dashboard-panel { display: none; }
.workspace.operation-active > .left-rail,
.workspace.operation-active > .right-rail { display: grid; }
.workspace.operation-active > .left-rail > section:not(.operation-dashboard-panel),
.workspace.operation-active > .right-rail > section:not(.operation-dashboard-panel) { display: none; }
.workspace.operation-active .operation-dashboard-panel { display: block; }
.workspace.operation-active > .left-rail { grid-template-rows: 430px 1fr; gap: 16px; }
.workspace.operation-active > .right-rail { grid-template-rows: 300px 300px 1fr; gap: 16px; }
```

- [ ] **Step 2: Add reusable panel primitives**

Define styles for operation metrics, progress bars, two-column floor tables, work-order rows, status colors, and the bottom operation dock. Keep panel title styles inherited from `.panel-title`; constrain row heights and set `overflow: hidden` to prevent layout growth.

### Task 2: Add Asset and Operation Panel Markup

**Files:**
- Modify: `Big Screen/index.html` inside the existing `.left-rail` and `.right-rail`

- [ ] **Step 1: Add asset-management panels**

Insert hidden `.operation-dashboard-panel asset-panel` sections with these titles and content:

```html
<section class="info-panel operation-dashboard-panel asset-panel">
  <h2 class="panel-title">资产总量<span></span></h2>
  <div class="asset-summary"><strong>9.79亿元</strong><span>资产总值</span><b>固定资产 9.79亿元</b><b>可移动资产 0亿元</b></div>
</section>
<section class="info-panel operation-dashboard-panel asset-panel">
  <h2 class="panel-title">维保计划<span></span></h2>
  <div class="maintenance-summary"><strong>8</strong><span>任务总数</span><b>已完成 3</b><b>未完成 5</b></div>
  <div class="maintenance-list"><div>DT01电梯 <em>待处理</em></div><div>DT02电梯 <em>已完成</em></div><div>DT02电梯 <em>待处理</em></div></div>
</section>
```

The asset summary includes `资产总值 9.79亿元` and fixed/movable asset split. The maintenance panel includes task total `8`, completed `3`, unfinished `5`, and three maintenance rows matching the first reference image.

- [ ] **Step 2: Add asset right-rail panels**

Add right panels titled `固定资产`, `可移动资产`, and `故障报警`, including the 9.79 / 0 asset donut summaries, category legends, and today/week/month/year alarm tabs with pending and handled counts.

- [ ] **Step 3: Add operation-management panels**

Add hidden `.operation-management-panel` sections titled `租赁统计`, `楼层租赁明细`, `报事报修`, `工单消息`, and `投诉建议`. The rental panels use the reference totals and a compact two-column floor table. The service panels use the reference counters, completion rates, status labels, timestamps, and message rows.

- [ ] **Step 4: Add operation bottom dock**

Place a `.operation-dock` inside `.building-scene`, adjacent to the existing `#systemDock` and `#weakDock`. It contains exactly two buttons:

```html
<nav class="operation-dock" id="operationDock" aria-label="运营管理子模块">
  <button class="active" type="button" data-operation="asset">资产管理</button>
  <button type="button" data-operation="management">运营管理</button>
</nav>
```

The dock is visible only while `.operation-active` is present and does not modify the existing system or weak-system docks.

### Task 3: Wire Top-Level and Bottom Navigation

**Files:**
- Modify: `Big Screen/index.html` in the main module listener and the bottom dock listener

- [ ] **Step 1: Clear stale module states on top navigation**

At the start of the `.module-nav` click handler, remove `system-overview`, `weak-overview`, `meeting-active`, `parking-active`, `security-active`, `network-active`, `energy-active`, `operation-active`, and `operation-management` before applying the new module state.

- [ ] **Step 2: Activate operation mode**

Use the selected module text to set `isOperation = moduleName === '运营管理'`. Apply `operation-active` and default `operation-management` false. Close the floor selector only under the existing top-level behavior; do not change `#floorPlan`, `assets/jinshan-building-v2.png`, or `assets/floor-plan-15f.png`.

- [ ] **Step 3: Implement bottom operation switching**

Register listeners on `#operationDock button` that call `activateGroup('#operationDock button', button)` and toggle `operation-management` according to `data-operation`. Keep `operation-active` true and leave the central building DOM untouched.

- [ ] **Step 4: Add accessible selected state**

Set `aria-current="page"` on the active top module through the existing `activateGroup` helper and use `aria-pressed` or `aria-selected` consistently for the two operation buttons.

### Task 4: Validate the Feature and Regression Boundaries

**Files:**
- Test: `Big Screen/index.html` using the existing PowerShell/Node checks

- [ ] **Step 1: Run JavaScript syntax validation**

Run:

```powershell
$html=Get-Content -Raw 'Big Screen/index.html'
$script=[regex]::Match($html,'(?s)<script>(.*?)</script>').Groups[1].Value
$tmp=Join-Path $env:TEMP 'big-screen-check.js'
[IO.File]::WriteAllText($tmp,$script)
& 'D:\node.exe' --check $tmp
```

Expected: no output and exit code `0`.

- [ ] **Step 2: Check static structure and protected assets**

Verify the file contains exactly two operation dock buttons, the five operation panel titles, `assets/jinshan-building-v2.png`, and `assets/floor-plan-15f.png`.

- [ ] **Step 3: Verify layout dimensions**

Open the page at the existing local preview URL, click `运营管理`, then confirm the central scene remains in the 1920x1080 workspace and the bottom two buttons are fully visible. Click both operation buttons and confirm the expected panel title sets switch without horizontal scrolling.

- [ ] **Step 4: Check module regression**

Switch to `总览`, `机电系统`, `弱电系统`, and `能源管理`; confirm their existing docks and left/right panels return and no operation panel remains visible.

## Plan Self-Review

- Spec coverage: top entry, two bottom buttons, asset view, operation view, fixed layout, state cleanup, and protected central interactions are covered by Tasks 1-4.
- Placeholder scan: 未发现未完成标记或未解析的实现占位内容。
- Consistency: `operation-active`, `operation-management`, `operationDock`, `asset`, and `management` are used consistently across CSS, markup, JavaScript, and validation.
