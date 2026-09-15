# 能源总表与分表视图 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为用电、用水、冷量概览增加总表与分表设备视图，并从总表详情查看当前查询范围内的关联分表统计数据。

**Architecture:** 在现有 `energy-data.js` 配置和 Mock 行数据中增加 `meterLevel`、`parentMeterId`，由共享组件 `energy-overview.js` 统一处理三态视图、层级过滤、动态列、详情抽屉和导出。三个业务页面继续共用同一组件，光伏通过配置能力标记保持原双 Tab 行为。

**Tech Stack:** HTML5、CSS3、原生 JavaScript、现有 Font Awesome 与 `openAppDrawer` 抽屉组件。

---

### Task 1: 建立总表与分表 Mock 关系

**Files:**
- Modify: `app/data/energy-data.js`

- [ ] **Step 1: 增加支持能力与数据关系**

为 `createConfig` 增加 `supportsMeterHierarchy` 配置；用电、用水、冷量设为 `true`，光伏设为 `false`。为前三类设备行按稳定规则写入：

```js
row.meterLevel = deviceIndex % 4 === 0 ? "master" : "sub";
row.parentMeterId = row.meterLevel === "sub" ? masterIdForCurrentGroup : null;
```

确保每种能源至少有多个总表，每个总表至少关联两条分表，且总分表均覆盖多个楼栋、楼层和统计时间。

- [ ] **Step 2: 增加总表操作列配置**

保留现有设备业务列，新增总表专用列：

```js
masterDeviceColumns: [...deviceColumns, "操作"]
```

分表继续使用 `deviceColumns`。光伏不生成 `masterDeviceColumns`。

- [ ] **Step 3: 运行数据语法和关系断言**

Run:

```powershell
node --check app/data/energy-data.js
node -e "global.window=global;require('./app/data/energy-data.js');for(const k of ['electricity','water','cooling']){const r=ENERGY_PAGE_CONFIGS[k].rows;const m=r.filter(x=>x.meterLevel==='master');const s=r.filter(x=>x.meterLevel==='sub');if(!m.length||!s.length||s.some(x=>!m.some(y=>y.id===x.parentMeterId)))process.exit(1)}"
```

Expected: 两条命令退出码均为 `0`。

### Task 2: 将设备视图拆分为总表与分表

**Files:**
- Modify: `app/components/energy-overview.js`

- [ ] **Step 1: 扩展视图状态与 Tab 渲染**

将支持层级页面的设备视图值定义为 `master`、`sub`，渲染：

```html
<button data-energy-view="floor">按楼层</button>
<button data-energy-view="master">按设备（总表）</button>
<button data-energy-view="sub">按设备（分表）</button>
```

光伏继续渲染 `floor`、`device` 两个视图。所有设备专用筛选条件在 `master`、`sub`、`device` 下均可见。

- [ ] **Step 2: 按视图筛选数据**

在公共时间和条件筛选完成后增加：

```js
if (state.view === "master") rows = rows.filter((row) => row.meterLevel === "master");
if (state.view === "sub") rows = rows.filter((row) => row.meterLevel === "sub");
```

切换视图时设置 `state.page = 1` 并重新渲染工具栏、汇总卡片、表格和分页。

- [ ] **Step 3: 动态选择表格列**

`getColumns()` 按 `floor/master/sub/device` 返回对应列；“操作”单元格渲染为：

```html
<button class="table-action" type="button" data-energy-action="meter-detail" data-meter-id="设备ID">详情</button>
```

空状态 `colspan` 使用当前动态列数。

- [ ] **Step 4: 检查组件语法**

Run: `node --check app/components/energy-overview.js`

Expected: 退出码为 `0`，无语法错误。

### Task 3: 实现当前筛选范围内的关联分表详情

**Files:**
- Modify: `app/components/energy-overview.js`
- Modify: `web/pages/energy/electricity-overview.html`
- Modify: `web/pages/energy/water-overview.html`
- Modify: `web/pages/energy/cooling-overview.html`

- [ ] **Step 1: 引入现有抽屉组件**

确认三个页面在 `energy-overview.js` 前加载：

```html
<script src="../../../app/components/drawer.js"></script>
```

- [ ] **Step 2: 提取可复用查询函数**

将公共时间范围及表单筛选整理为可传入数据集的函数：

```js
function filterRows(rows, { meterLevel, parentMeterId } = {}) {
  // 应用当前 period、range 和 filters
  // 可选应用 meterLevel 与 parentMeterId
}
```

页面列表和详情抽屉调用同一函数，避免筛选规则不一致。

- [ ] **Step 3: 渲染详情抽屉**

点击详情时查找目标总表，过滤 `parentMeterId === master.id` 的分表，并调用：

```js
window.openAppDrawer({
  title: "关联分表详情",
  subtitle: `${state.config.title} · ${master.deviceName}`,
  size: "large",
  body: renderMeterDetail(master, relatedRows),
});
```

抽屉顶部展示总表名称、设备编号、统计周期、当前时间范围；下方表格展示序号、获取时间、设备名称、设备编号、楼栋、楼层、房源、当前读数、上次读数和能源用量。无结果时展示“暂无分表统计数据”。

- [ ] **Step 4: 绑定详情事件并防止行级误触**

在现有事件委托中优先处理 `data-energy-action="meter-detail"`，只打开抽屉，不触发搜索、导出或 Tab 切换。

- [ ] **Step 5: 检查脚本引用与语法**

Run:

```powershell
rg -n "drawer.js|energy-overview.js" web/pages/energy/electricity-overview.html web/pages/energy/water-overview.html web/pages/energy/cooling-overview.html
node --check app/components/energy-overview.js
```

Expected: 三页均先加载 `drawer.js`，组件语法通过。

### Task 4: 完善详情抽屉样式与导出规则

**Files:**
- Modify: `web/assets/css/energy-overview.css`
- Modify: `app/components/energy-overview.js`

- [ ] **Step 1: 增加抽屉详情样式**

增加 `.energy-meter-detail`、`.energy-meter-meta`、`.energy-meter-detail-table-wrap`，使用现有颜色变量、2px/4px 圆角与 8px 间距体系；表格设置合理最小宽度和横向滚动，窄屏不压缩字段文本。

- [ ] **Step 2: 排除导出操作列**

导出时使用：

```js
const columns = getColumns().filter((column) => column !== "操作");
```

按楼层、总表、分表分别导出当前视图和当前筛选结果。

- [ ] **Step 3: 执行静态检查**

Run:

```powershell
node --check app/components/energy-overview.js
git diff --check -- app/data/energy-data.js app/components/energy-overview.js web/assets/css/energy-overview.css web/pages/energy/electricity-overview.html web/pages/energy/water-overview.html web/pages/energy/cooling-overview.html
```

Expected: 无语法错误、无空白错误。

### Task 5: 浏览器回归验收

**Files:**
- Verify: `web/pages/energy/electricity-overview.html`
- Verify: `web/pages/energy/water-overview.html`
- Verify: `web/pages/energy/cooling-overview.html`
- Verify: `web/pages/energy/photovoltaic-overview.html`

- [ ] **Step 1: 验证三个业务页面的 Tab 与列表**

分别打开用电、用水、冷量页面，确认存在“按楼层/按设备（总表）/按设备（分表）”，总表列表有详情列，分表列表无操作列，切换后分页返回第一页。

- [ ] **Step 2: 验证筛选继承和详情数据**

在小时范围下设置时间、楼栋或设备条件并搜索，进入总表详情，确认抽屉时间范围与页面一致，且所有详情行的 `parentMeterId` 均属于点击的总表。再选择日、月或年任一粒度重复验证。

- [ ] **Step 3: 验证空状态与布局**

设置不匹配的筛选条件，确认列表和详情分别显示可信空状态；在桌面和窄屏视口确认抽屉、表格、按钮无重叠，详情表格可横向滚动。

- [ ] **Step 4: 验证导出与光伏回归**

分别在总表和分表视图触发导出，确认总表 CSV 不含“操作”列；打开光伏概览，确认仍为“按楼层/按设备”两个 Tab，原列表及导出行为不变。

- [ ] **Step 5: 提交功能改动**

```powershell
git add -- app/data/energy-data.js app/components/energy-overview.js web/assets/css/energy-overview.css web/pages/energy/electricity-overview.html web/pages/energy/water-overview.html web/pages/energy/cooling-overview.html
git commit -m "feat: add energy master and sub meter views"
```
