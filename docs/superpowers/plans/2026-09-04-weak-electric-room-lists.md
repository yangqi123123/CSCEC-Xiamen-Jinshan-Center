# Weak Electric Room Lists Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the weak-electric overview's left lists with selectable 25-location weak-shaft and equipment-room panels that match the supplied dashboard reference.

**Architecture:** Keep `weak-electric.html` as the independent page and reuse its existing panel containers. Add deterministic mock-location generation and small panel render functions to `app.js`, then scope the required compact dashboard styling to weak-overview classes in `styles.css`.

**Tech Stack:** Static HTML5, CSS3, vanilla JavaScript, Font Awesome already loaded by the page.

---

### Task 1: Add stable panel hooks

**Files:**
- Modify: `Big Screen/weak-electric.html`

- [x] **Step 1: Add explicit weak-list classes and accessible container labels**

Keep `mepDeviceRows` and `weakRoomRows` as render targets, add weak-overview-specific classes, and leave all center/right markup unchanged.

- [x] **Step 2: Verify independent page structure**

Run: `rg -n "weak-shaft|weak-equipment-room|building-scene|weakDock" "Big Screen/weak-electric.html"`

Expected: both list hooks exist and the existing building scene and dock remain present.

### Task 2: Render 25 locations and interactions

**Files:**
- Modify: `Big Screen/app.js`

- [x] **Step 1: Generate deterministic mock data**

Create 25 records for buildings 1-5 and floors 1F-5F. Each record contains shaft and room names plus device, environment, electricity, and duty-state values.

- [x] **Step 2: Add focused render functions**

Render a weak-shaft selector, the columns `序号 / 设备名称 / 状态 / 操作`, and a right-arrow operation. Render an equipment-room selector and its six requested details with a right-arrow header control.

- [x] **Step 3: Bind selector and arrow behavior**

Selector changes update the matching panel. Arrow clicks advance one record and wrap from index 24 to index 0. Bind events after every weak-overview render because the panel HTML is replaced.

- [x] **Step 4: Preserve all other subsystem behavior**

Call the new render functions only when `key === 'weak-overview'`; meeting, parking, security, network, building, and floor-plan paths keep their current rendering.

- [x] **Step 5: Run JavaScript syntax validation**

Run: `node --check "Big Screen/app.js"`

Expected: exit code 0 with no output.

### Task 3: Match the reference panel appearance

**Files:**
- Modify: `Big Screen/styles.css`

- [x] **Step 1: Add scoped list styling**

Style the selectors, shaft table, room detail grid, and circular/chevron arrow controls under `.workspace.weak-overview` so existing module panels are unaffected.

- [x] **Step 2: Check source integrity**

Run: `rg -n "�|弱电并列表|<span>在线</span>" "Big Screen/weak-electric.html" "Big Screen/app.js" "Big Screen/styles.css"`

Expected: no replacement characters, obsolete title, or old right-side online label in the weak-overview renderer.

- [ ] **Step 3: Verify in the browser**

Open `Big Screen/weak-electric.html`, select `系统总览`, and confirm both selectors contain 25 options. Change each selector, click each arrow, verify names/details update, and confirm the center building, floor controls, right dashboards, and bottom dock do not move.
