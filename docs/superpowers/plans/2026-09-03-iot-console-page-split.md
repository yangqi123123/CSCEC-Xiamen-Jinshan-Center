# 智能物联页面拆分实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 IoT 单页原型拆分为九个独立 HTML 页面，接入现有后台菜单与视觉组件，并完整保留原型功能。

**Architecture:** 新增 `web/pages/lot/iot-common.css` 和 `iot-common.js` 作为共享样式、Mock 数据、抽屉和交互资源；九个独立 HTML 页面复用现有 `tob-ui.css`、sidebar/header/drawer 组件，并由共享脚本按页面 key 渲染各自主体。`app/config/menu.js` 增加智能物联一级菜单与九个真实路由。

**Tech Stack:** 静态 HTML、CSS、原生 JavaScript、现有 `tob-ui.css` 和后台公共组件。

---

### Task 1: Extend Shared Navigation

**Files:** `app/config/menu.js`, `app/components/sidebar.js`

- [x] Add the `lot` menu group and nine child routes under existing menu data.
- [x] Add a `lot` navigation icon while preserving existing expand/active behavior.
- [x] Syntax-check both JavaScript files.

### Task 2: Create Shared IoT Resources

**Files:** `web/pages/lot/iot-common.css`, `web/pages/lot/iot-common.js`

- [x] Port prototype tokens and dense list styling to existing light enterprise tokens.
- [x] Port all page Mock datasets, drawer titles/forms, integration detail content, list rendering, toast, and save/cancel interactions.
- [x] Render each page from its own copied document with a fixed initial view; no page depends on another document's DOM.
- [x] Syntax-check the shared navigation and confirm all nine page keys are implemented.

### Task 3: Create Nine Independent HTML Pages

**Files:** `web/pages/lot/overview.html`, `integration.html`, `devices.html`, `models.html`, `mapping.html`, `tasks.html`, `monitor.html`, `commands.html`, `alarms.html`

- [x] Build each page as an independent app shell with page-specific `data-menu-key`, title, and `data-lot-page`.
- [x] Load shared CSS plus `tob-ui.css` and the IoT shared resource hooks; preserve each page's original prototype interaction script.
- [x] Verify each page opens directly by URL and its navigation links target sibling HTML pages.

### Task 4: Preserve and Verify Prototype Behavior

- [x] Check all original page titles, descriptions, table fields, rows, quick entries, and drawer form labels remain in the split pages.
- [x] Check each route returns HTTP 200 through the local server.
- [x] Check all JavaScript files with Node syntax validation.
- [x] Check each page has balanced HTML/script/style structures and no mojibake.

**Environment constraint:** `.git` metadata is unavailable in this workspace, so no commit is attempted.
