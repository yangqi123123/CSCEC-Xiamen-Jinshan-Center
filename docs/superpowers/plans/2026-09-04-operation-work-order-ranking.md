# 运营管理工单排行 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在运营管理左侧“维保计划”下方展示工单完成人员前五名，并随本月/本年筛选同步切换。

**Architecture:** 在现有维保计划面板内部增加一个排行容器。`app.js` 使用原型静态工单排行数据按周期渲染前五名，现有维保计划渲染函数同时刷新排行；`styles.css` 为排行增加现有大屏 HUD 斜纹标题、序号、进度条和数量布局，保持面板固定高度。

**Tech Stack:** 静态 HTML、CSS、原生 JavaScript。

---

### Task 1: 增加排行挂载点与静态统计数据

**Files:**
- Modify: `Big Screen/operation.html:36`
- Modify: `Big Screen/app.js:131-172`

- [ ] **Step 1: 在维保计划内容区域保留排行挂载点**

在 `#maintenancePlanContent` 后增加独立挂载节点：

```html
<div id="workOrderRanking" aria-live="polite"></div>
```

- [ ] **Step 2: 增加本月和本年工单完成排行静态数据**

在 `maintenanceRecords` 后增加：

```js
const workOrderRankingData = {
  month: [
    { name: '张工', count: 28 },
    { name: '李工', count: 22 },
    { name: '王工', count: 18 },
    { name: '陈工', count: 14 },
    { name: '赵工', count: 10 }
  ],
  year: [
    { name: '张工', count: 168 },
    { name: '李工', count: 142 },
    { name: '王工', count: 126 },
    { name: '陈工', count: 108 },
    { name: '赵工', count: 94 }
  ]
};
```

- [ ] **Step 3: 实现排行渲染并让维保周期同步刷新**

新增 `renderWorkOrderRanking(period = 'month')`，将当前周期数据按 `count` 降序、`name` 升序排序后取前五名，计算最大值作为进度条基准，并写入 `#workOrderRanking`。在 `renderMaintenancePlan` 尾部调用 `renderWorkOrderRanking(period)`；无数据时写入 `暂无排行数据`。

### Task 2: 完成排行 HUD 视觉布局

**Files:**
- Modify: `Big Screen/styles.css:706-724`

- [ ] **Step 1: 为排行增加标题和列表样式**

增加以下规则：

```css
.work-order-ranking { min-height: 0; margin-top: 9px; }
.work-order-ranking-title { display: flex; align-items: center; height: 28px; padding: 0 7px; color: #ecffff; background: repeating-linear-gradient(-45deg, rgba(75, 194, 215, .2) 0 8px, rgba(75, 194, 215, .08) 8px 16px); border-bottom: 1px solid rgba(79, 208, 220, .35); font-size: 12px; font-weight: 700; }
.work-order-ranking-title::before { content: "▶"; margin-right: 6px; color: #f6cc42; font-size: 9px; }
.work-order-ranking-list { display: grid; gap: 5px; padding-top: 7px; }
.work-order-ranking-row { display: grid; grid-template-columns: 22px minmax(56px, 66px) minmax(0, 1fr) 38px; align-items: center; gap: 6px; min-height: 25px; color: #dff5f7; font-size: 10px; }
.work-order-ranking-row > i { display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; color: #fff7d0; background: #567294; font: 700 10px var(--mono); font-style: normal; }
.work-order-ranking-row:first-child > i { color: #fff; background: #dfb934; box-shadow: 0 0 7px rgba(241, 199, 62, .5); }
.work-order-ranking-row > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.work-order-ranking-track { height: 6px; overflow: hidden; background: rgba(12, 43, 82, .8); }
.work-order-ranking-track span { display: block; width: var(--rank); height: 100%; background: linear-gradient(90deg, #5fded0, #a6f0dc); box-shadow: 0 0 7px rgba(95, 222, 208, .38); }
.work-order-ranking-row:first-child .work-order-ranking-track span { background: linear-gradient(90deg, #e4bb42, #fff0a0); box-shadow: 0 0 7px rgba(242, 197, 58, .42); }
.work-order-ranking-row > b { color: #f4cd4b; font: 700 12px var(--mono); text-align: right; }
```

- [ ] **Step 2: 确保排行不撑破维保面板**

排行列表使用固定行高和 `overflow: hidden`，父级 `#maintenancePlanContent` 继续使用现有 flex 约束；不修改运营面板网格行高。

### Task 3: 静态与交互验证

**Files:**
- Test: `Big Screen/app.js`
- Test: `Big Screen/operation.html`
- Test: `Big Screen/styles.css`

- [ ] **Step 1: 检查 JavaScript 语法**

Run: `node --check 'Big Screen/app.js'`

Expected: 成功退出且无语法错误。

- [ ] **Step 2: 验证排行数据和挂载结构**

Run: `$html = Get-Content -Raw 'Big Screen/operation.html'; $js = Get-Content -Raw 'Big Screen/app.js'; @('workOrderRanking','工单排行','张工','赵工') | ForEach-Object { if (($html + $js) -notmatch [regex]::Escape($_)) { throw "Missing $_" } }`

Expected: 命令成功退出。

- [ ] **Step 3: 在运营管理资产管理状态检查本月和本年排行**

Expected: 维保计划下方出现工单排行，最多显示五行；点击“本年”后排行数量更新为年度数据，面板和中央建筑不位移。

- [ ] **Step 4: 在 1920x1080 视口检查布局**

Expected: 左侧维保面板内标题、姓名、进度条和数量完整可见，无横向溢出或遮挡；控制台无 error/warning。
