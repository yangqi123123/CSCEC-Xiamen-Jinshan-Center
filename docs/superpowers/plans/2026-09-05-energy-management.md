# 能源管理概览页面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有后台中新增能源管理一级菜单及四个独立能源概览页面，支持楼层/设备视图、小时/日/月/年时间粒度、筛选、分页和 CSV 导出。

**Architecture:** 保留每个功能界面的独立 HTML 入口，四页共享一个能源页面渲染器、一个能源数据配置文件和一份页面专用 CSS。每个 HTML 通过 `data-energy-type` 指定页面配置，渲染器根据配置生成指标卡、筛选项、表格字段和 Mock 统计记录；不使用查询参数承载多个菜单页面。

**Tech Stack:** 原生 HTML、CSS、JavaScript、现有 `tob-ui.css`、现有侧栏/顶部栏组件、Font Awesome 资源、浏览器原生 Blob CSV 下载。

---

## 文件清单

- Modify: `app/config/menu.js`，新增 `energy` 一级菜单和四个子菜单。
- Create: `app/data/energy-data.js`，定义四类能源的页面配置、筛选选项、指标卡和 Mock 行数据。
- Create: `app/components/energy-overview.js`，渲染能源页面并处理视图、粒度、筛选、分页和导出。
- Create: `web/assets/css/energy-overview.css`，承载能源页面布局、指标卡、时间切换、表格空状态和窄屏规则。
- Create: `web/pages/energy/electricity-overview.html`，用电概览独立页面。
- Create: `web/pages/energy/water-overview.html`，用水概览独立页面。
- Create: `web/pages/energy/cooling-overview.html`，冷量概览独立页面。
- Create: `web/pages/energy/photovoltaic-overview.html`，光伏概览独立页面。

## Task 1: Register the Energy Menu

**Files:**
- Modify: `app/config/menu.js`

- [ ] **Step 1: Add the new top-level menu after the existing `lot` item.**

Insert this object into `window.APP_MENU` after the current 智能物联 item:

```js
{
  key: "energy",
  label: "能源管理",
  icon: "fa-solid fa-bolt",
  children: [
    { key: "energy.electricity", label: "用电概览", href: "../energy/electricity-overview.html" },
    { key: "energy.water", label: "用水概览", href: "../energy/water-overview.html" },
    { key: "energy.cooling", label: "冷量概览", href: "../energy/cooling-overview.html" },
    { key: "energy.photovoltaic", label: "光伏概览", href: "../energy/photovoltaic-overview.html" },
  ],
},
```

The existing sidebar fallback icon will render if `fa-bolt` has no custom icon definition, so no unrelated sidebar changes are required.

- [ ] **Step 2: Verify the menu object is syntactically valid and all hrefs resolve from an existing page.**

Run:

```powershell
node --check app/config/menu.js
Test-Path web/pages/energy
```

Expected: `node --check` exits with code 0; the directory check is `False` until Task 5 creates it, so do not treat that temporary result as a failure.

## Task 2: Define Shared Energy Data and Page Contracts

**Files:**
- Create: `app/data/energy-data.js`

- [ ] **Step 1: Define one explicit configuration object for each energy type.**

Use this contract so the renderer has no page-specific conditionals for labels or columns. Each row must have the fields shown below; the `view` value determines whether it is rendered in the floor or device view:

```js
window.ENERGY_PAGE_CONFIG = {
  electricity: {
    menuKey: "energy.electricity",
    section: "能源管理",
    title: "用电量",
    unit: "kW·h",
    icon: "fa-bolt",
    summary: ["总电量", "裙房用电", "低区用电", "中区用电", "高区用电"],
    filters: { floor: ["楼栋", "楼层", "区域"], device: ["楼栋", "楼层", "设备名称", "区域", "用途"] },
    floorColumns: ["序号", "时间", "楼栋", "楼层", "区域", "用电量(kW·h)"],
    deviceColumns: ["序号", "时间", "设备名称", "设备类型", "设备号", "楼栋", "楼层", "用途", "区域", "用电量(kW·h)"],
    rows: [{ id: "electricity-001", view: "floor", date: "2026-09-05T00:00", building: "中建科创大厦", floor: "5层", area: "分表", deviceName: "办公普通照明1", deviceType: "电", deviceNo: "204814200005", usage: "办公照明", value: 0 }],
  },
  water: {
    menuKey: "energy.water",
    section: "能源管理",
    title: "用水量",
    unit: "m³",
    icon: "fa-droplet",
    summary: ["总水量", "地下室用水", "裙房用水", "低区用水", "中区用水", "高区用水"],
    filters: { floor: ["楼栋", "楼层", "区域"], device: ["楼栋", "楼层", "设备名称", "区域"] },
    floorColumns: ["序号", "获取时间", "楼层信息", "区域信息", "用水量(m³)"],
    deviceColumns: ["序号", "获取时间", "设备名称", "设备号", "楼栋", "楼层", "区域", "用水量(m³)"],
    rows: [{ id: "water-001", view: "floor", date: "2026-09-05T00:00", building: "中建科创大厦", floor: "5层", area: "裙房", deviceName: "生活水泵房（主）", deviceNo: "W204810001", value: 0 }],
  },
  cooling: {
    menuKey: "energy.cooling",
    section: "能源管理",
    title: "用冷量",
    unit: "kW",
    icon: "fa-snowflake",
    summary: ["总冷量", "地下室用冷", "裙房用冷", "低区用冷", "中区用冷", "高区用冷"],
    filters: { floor: ["楼栋", "楼层", "区域"], device: ["楼栋", "楼层", "设备名称", "区域"] },
    floorColumns: ["序号", "获取时间", "楼层信息", "区域信息", "用冷量(kW)"],
    deviceColumns: ["序号", "获取时间", "设备名称", "设备号", "楼栋", "楼层", "区域", "用冷量(kW)"],
    rows: [{ id: "cooling-001", view: "floor", date: "2026-09-05T00:00", building: "中建科创大厦", floor: "5层", area: "裙房", deviceName: "冷水机组1", deviceNo: "C204810001", value: 0 }],
  },
  photovoltaic: {
    menuKey: "energy.photovoltaic",
    section: "能源管理",
    title: "光伏发电量",
    unit: "kW·h",
    icon: "fa-solar-panel",
    summary: ["总发电量", "西立面", "东立面", "南立面", "屋面"],
    filters: { floor: ["楼栋", "楼层", "区域"], device: ["楼栋", "楼层", "设备名称", "区域"] },
    floorColumns: ["序号", "时间", "楼层信息", "区域", "发电量(kW·h)"],
    deviceColumns: ["序号", "时间", "设备名称", "设备号", "楼栋", "楼层", "区域", "发电量(kW·h)"],
    rows: [],
  },
};
```

Expand the concrete row arrays for electricity, water, and cooling to at least 24 hourly records each so the default view visibly supports a full day and pagination; include daily, monthly, and yearly source records for transformation tests. Keep photovoltaic `rows` empty so its initial table renders the reference empty state.

- [ ] **Step 2: Define shared option values for building, floor, area, device, and usage filters.**

Use values visible in the reference pages, including `中建科创大厦`, `5层`, `裙房`, `分表`, `备用`, `电`, and representative device names such as `生活水泵房（主）`. Keep the options inside the data file so pages do not duplicate them.

- [ ] **Step 3: Verify the data file parses without executing page code.**

Run:

```powershell
node --check app/data/energy-data.js
rg -n "总电量|总水量|总冷量|总发电量|小时|日|月|年" app/data/energy-data.js
```

Expected: syntax check passes and all four energy types plus four time labels are present.

## Task 3: Build the Shared Energy Renderer

**Files:**
- Create: `app/components/energy-overview.js`

- [ ] **Step 1: Read page configuration and mount the existing admin shell.**

On `DOMContentLoaded`, read `document.body.dataset.energyType`, resolve `window.ENERGY_PAGE_CONFIG[type]`, and render into these existing elements: `#energyToolbar`, `#energySummary`, `#energyTableHead`, `#energyTableBody`, and `#energyPagination`. Use `data-menu-key`, `data-page-section`, and `data-page-title` from each HTML for sidebar/header state. Because `header.js` initializes its filter layout before this renderer mounts dynamic controls, the renderer must call its own `setupEnergyFilterLayout` immediately after rendering the toolbar.

- [ ] **Step 2: Implement the time state and formatting functions.**

Define these functions with the following behavior:

```js
const GRANULARITIES = ["hour", "day", "month", "year"];

function formatPeriodLabel(date, granularity) {
  if (granularity === "hour") return `${date.slice(0, 10).replaceAll("-", "/")}-${date.slice(11, 13)}:00`;
  if (granularity === "day") return date.slice(0, 10).replaceAll("-", "/");
  if (granularity === "month") return date.slice(0, 7).replace("-", "/");
  return date.slice(0, 4);
}

function getRangeInputType(granularity) {
  return granularity === "hour" ? "datetime-local" : granularity === "month" ? "month" : granularity === "year" ? "number" : "date";
}
```

The initial hour range is `2026-09-05T00:00` through `2026-09-05T23:59`; day, month, and year inputs use matching ranges. Changing a granularity updates both range inputs, selected button, input hints, and the displayed period labels while preserving building/floor/area/device filters.

- [ ] **Step 3: Implement floor/device tabs and filter layout.**

Render the “按楼层” and “按设备” buttons from a shared template. When device view is selected, switch the configured fields and table columns. Place the first four filter fields in the visible row; add `filter-field-extra` to the remaining fields and render controls in the exact order `展开/收起`, `重置`, `搜索`, matching the project rule. Keep the renderer-local class names compatible with the existing `.filter-layout`, `.filter-field-extra`, and `.is-expanded` styles.

- [ ] **Step 4: Implement summary cards and table rendering.**

Build cards from `config.summary` and the current aggregation. The total card uses the orange treatment; other cards use the blue treatment. Use six cards for water and cooling, five for electricity and photovoltaic. Render table cells from configured columns, format all values with two decimal places, and show the centered `暂无数据` state when the filtered result is empty.

- [ ] **Step 5: Implement filtering, pagination, and CSV export.**

Use a 10-row page size. Search filters only the current page dataset by exact select matching and substring text matching, resets to page 1, then updates cards and rows. Reset restores hour granularity, 2026-09-05, floor view, and empty filters. Export the current filtered rows using `Blob`, UTF-8 BOM, configured column headers, current granularity in the filename, and `URL.createObjectURL`.

- [ ] **Step 6: Verify the renderer syntax and required handlers.**

Run:

```powershell
node --check app/components/energy-overview.js
rg -n "data-energy-type|datetime-local|formatPeriodLabel|Blob|filter-field-extra|暂无数据" app/components/energy-overview.js
```

Expected: syntax check passes and the renderer contains the four required behavior areas.

## Task 4: Add Energy Page Styles

**Files:**
- Create: `web/assets/css/energy-overview.css`

- [ ] **Step 1: Define the energy page layout using existing TOB tokens.**

Style `.energy-page` with the same page background, spacing, card borders, low radius, and typography as `user.html`. Use an upper white content band for controls and summary cards, a light divider band before the table section, and a white table surface. Use an 8px-based rhythm and avoid gradients, large rounded cards, and decorative backgrounds.

- [ ] **Step 2: Style period controls, segmented tabs, summary cards, table, empty state, and pagination.**

Keep controls at 32px high, use `#135AFA` for selected states and primary actions, use an orange icon treatment only for the total card, and allow the table wrapper to scroll horizontally. Keep the first and last table columns readable at narrow widths without clipping labels.

- [ ] **Step 3: Add narrow-screen rules and filter collapse styles.**

At widths below 1100px allow the upper controls to wrap; below 760px stack the control groups, make the summary grid two columns, and keep `.energy-table-wrap { overflow-x: auto; }`. Hidden extra filters remain `display: none` until `.filter-layout.is-expanded` is present.

- [ ] **Step 4: Scan the file for forbidden visual patterns and encoding issues.**

Run:

```powershell
rg -n "border-radius:\s*(1[2-9]|[2-9][0-9])px|purple|bokeh|orb|gradient" web/assets/css/energy-overview.css
Get-Content -Raw -LiteralPath 'web/assets/css/energy-overview.css'
```

Expected: no large-radius/decorative-pattern matches; the file displays readable Chinese-free CSS and valid ASCII syntax.

## Task 5: Create the Four Independent HTML Pages

**Files:**
- Create: `web/pages/energy/electricity-overview.html`
- Create: `web/pages/energy/water-overview.html`
- Create: `web/pages/energy/cooling-overview.html`
- Create: `web/pages/energy/photovoltaic-overview.html`

- [ ] **Step 1: Create the shared HTML shell for each page.**

Each document must include this structure, with only the page metadata and `data-energy-type` changed:

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>用电概览 - 中建四局智能运营管理系统</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <link rel="stylesheet" href="../../assets/css/tob-ui.css">
  <link rel="stylesheet" href="../../assets/css/energy-overview.css">
</head>
<body class="energy-page" data-energy-type="electricity" data-menu-key="energy.electricity" data-page-section="能源管理" data-page-title="用电概览">
  <div class="app-shell">
    <aside id="app-sidebar" class="sidebar"></aside>
    <header id="app-header" class="header"></header>
    <main class="main">
      <div class="screen-frame energy-screen">
        <section class="energy-overview" aria-labelledby="energy-title">
          <div id="energyToolbar"></div>
          <div id="energySummary"></div>
        </section>
        <section class="energy-statistics" aria-labelledby="statistics-title">
          <div class="energy-section-head"><h2 id="statistics-title">统计数据</h2><button class="btn btn-secondary" type="button" data-energy-action="export">导出</button></div>
          <div class="energy-table-wrap"><table class="table energy-table"><thead><tr id="energyTableHead"></tr></thead><tbody id="energyTableBody"></tbody></table></div>
          <div id="energyPagination"></div>
        </section>
      </div>
    </main>
  </div>
  <script src="../../../app/config/menu.js"></script>
  <script src="../../../app/data/energy-data.js"></script>
  <script src="../../../app/components/sidebar.js"></script>
  <script src="../../../app/components/header.js"></script>
  <script src="../../../app/components/energy-overview.js"></script>
</body>
</html>
```

Use the same shell for all four pages, changing title/data attributes only. Do not combine these documents or route by query string.

- [ ] **Step 2: Set page-specific metadata and titles.**

Use `electricity` / `用电概览`, `water` / `用水概览`, `cooling` / `冷量概览`, and `photovoltaic` / `光伏概览`; use `光伏发电量` as the visible energy content title inside the photovoltaic page configuration if needed by the reference image.

- [ ] **Step 3: Check every HTML page for independent entry points and correct relative paths.**

Run:

```powershell
rg -n "data-energy-type|data-menu-key|tob-ui.css|energy-overview.css|energy-overview.js" web/pages/energy/*.html
Get-ChildItem web/pages/energy -Filter *.html | Measure-Object
```

Expected: four HTML files are listed; every page contains its own metadata and shared resource references.

## Task 6: Browser Verification and Encoding Check

**Files:**
- Verify all files from Tasks 1-5; modify only if a verification issue is found.

- [ ] **Step 1: Start a local static server.**

Run from the project root:

```powershell
python -m http.server 4173
```

Expected: server listens at `http://localhost:4173/`.

- [ ] **Step 2: Verify navigation and default desktop layout.**

Open `http://localhost:4173/web/pages/energy/electricity-overview.html`. Confirm the sidebar shows 能源管理 and the four submenu items, the default page opens in 按楼层 + 小时, summary cards and table are visible, and no text is clipped.

- [ ] **Step 3: Verify all time granularities.**

For each of the four pages, click 小时、日、月、年 and confirm the range inputs change to datetime/date/month/year semantics and table labels are respectively `YYYY/MM/DD-HH:00`, `YYYY/MM/DD`, `YYYY/MM`, and `YYYY`.

- [ ] **Step 4: Verify view switching and filters.**

Switch to 按设备 and confirm device-specific fields and columns appear. Enter a building, area, device, or usage filter, click 搜索, confirm rows and summary values update, then click 重置 and confirm defaults return. For the electricity device view, confirm the fifth filter is hidden until 展开 is clicked.

- [ ] **Step 5: Verify pagination, export, and empty state.**

Confirm 10 rows per page, page changes update only the table, 导出 downloads a CSV with the current granularity in its name, and the photovoltaic page shows 暂无数据 when no records match.

- [ ] **Step 6: Check encoding after every edit and run final static scans.**

Run:

```powershell
Get-ChildItem app\config\menu.js,app\data\energy-data.js,app\components\energy-overview.js,web\assets\css\energy-overview.css,web\pages\energy\*.html | ForEach-Object { Get-Content -Raw -LiteralPath $_.FullName | Out-Null; $_.FullName }
rg -n "�|锟斤拷|Ã|Â" app\config\menu.js app\data\energy-data.js app\components\energy-overview.js web\assets\css\energy-overview.css web\pages\energy
```

Expected: all files can be read, and the second command returns no matches. Stop the server after verification with `Ctrl+C`.
