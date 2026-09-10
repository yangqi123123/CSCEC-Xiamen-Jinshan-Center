# Big Screen Reference Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with checkpoints and visual verification.

**Goal:** Rebuild `Big Screen/index.html` as a 1920x1080 fixed-canvas CFIBMS building operations screen that closely matches the supplied reference image while remaining interactive and self-contained.

**Architecture:** Keep one standalone HTML document. Use a centered, proportionally scaled screen shell; semantic HTML/CSS for the header, navigation and side panels; inline SVG and layered CSS for the building/park scene and charts; vanilla JavaScript for the clock, navigation states, control-button states, and reduced-motion behavior.

**Tech Stack:** HTML5, CSS3, inline SVG, vanilla JavaScript, existing Font Awesome CDN dependency.

---

### Task 1: Replace the existing dashboard shell with the reference canvas

**Files:**
- Modify: `C:/Users/10208/Desktop/四局厦门金山项目原型/Big Screen/index.html`

- [ ] **Step 1: Define the fixed canvas and global HUD tokens**

Replace the current visual system with CSS variables for a 1920x1080 canvas, deep navy background, panel blue, cyan lines, amber selected state, red warning state, Chinese font stack, numeric font stack, border glow, and safe insets. Keep `body` overflow hidden and center `.screen-shell` with:

```css
.screen-shell {
  width: 1920px;
  height: 1080px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(var(--scale));
  transform-origin: center;
}
```

Set `--scale` from `Math.min(window.innerWidth / 1920, window.innerHeight / 1080)` and update it on resize, with a minimum value that still keeps the shell inside the viewport.

- [ ] **Step 2: Build the full-screen frame layers**

Add the outer frame, corner brackets, top perspective line, bottom frame line, faint grid, scanline, and central light bloom as pseudo-elements. Ensure each decorative layer has `pointer-events: none`, remains behind content, and does not create scrollbars.

- [ ] **Step 3: Add the reference header and seven-item module navigation**

Replace the prior SaaS-style topbar with a three-zone HUD header: left project name plus live time/date/weather, centered `中建四局智能运营管理系统（CFIBMS）`, and right company mark/tool icons. Add the seven visible nav labels `总览`, `机电系统`, `弱电系统`, `能源管理`, `运营管理`, `运维评价`, `秦碧创新中心`; use amber for the active `总览` item and cyan separators for the other items.

- [ ] **Step 4: Run a static shell check**

Run:

```powershell
Select-String -Path 'Big Screen/index.html' -Pattern 'screen-shell|CFIBMS|机电系统|弱电系统|能源管理|秦碧创新中心|--scale'
```

Expected: all shell, title, navigation, and scaling hooks are present.

### Task 2: Implement the left-side information panels

**Files:**
- Modify: `C:/Users/10208/Desktop/四局厦门金山项目原型/Big Screen/index.html`

- [ ] **Step 1: Add the shared panel and title markup**

Create `.info-panel` modules with a cyan top/bottom rule, clipped corners, title arrows, and a small amber corner marker. Keep panels absolutely positioned within `.left-rail` so their geometry matches the fixed reference: building overview at the top, awards below, people statistics below that, and vehicle statistics at the bottom.

- [ ] **Step 2: Add 建筑概况 content**

Render the reference values as compact rows: `建筑名称 中建科创大厦`, `建筑规模 104402m² / 地上36层、地下3层`, `开工日期 2022年4月17日`, `竣工日期 2024年9月29日`, and `项目定位 建筑科技范 创新总部科研`.

- [ ] **Step 3: Add 荣誉展示 content**

Create a two-row certificate grid with six star/certificate tiles and one certificate preview tile, keeping each tile a stable size. Use CSS-generated certificate silhouettes and star icons so no new image asset is needed.

- [ ] **Step 4: Add 人员统计 and 车辆统计 content**

Render the people ring with `683` total, `办公人员 683`, `访客 0`, and low/middle/high area counts `511`, `0`, `172` as shown. Render vehicle totals `剩余车位 0`, `B1/B2/B3 0`, `AGV车位 22`, `充电桩 44`, and the in-use/free rows.

- [ ] **Step 5: Verify left rail geometry**

Use browser inspection at a 1920x1080 viewport and confirm the left rail has no horizontal overflow, the four panels do not overlap, and the smallest text remains legible at the reference scale.

### Task 3: Build the central building and park scene

**Files:**
- Modify: `C:/Users/10208/Desktop/四局厦门金山项目原型/Big Screen/index.html`

- [ ] **Step 1: Create the scene background layers**

Add `.building-scene` covering the central gap, with sky-to-water color bands, a perspective ground plane, a river on the right, pale translucent neighboring blocks, road strips, trees, and a soft vignette that fades behind the side rails.

- [ ] **Step 2: Create the main building silhouette**

Use a positioned building group with a tall glass tower and lower podium. Build repeated floor bands and vertical mullions from CSS gradients and pseudo-elements; add the blue `中建科创` roof signage, roof cap, façade shadows, and perspective skew so the tower is the dominant reference-like object.

- [ ] **Step 3: Add the lower podium, roads, trees, and scene controls**

Place the podium in front of the tower, add white/gray site paths and several green/yellow tree clusters, then add bottom-left media/control and bottom-right moon/theme controls as icon-only accessible buttons. Buttons must have a visible pressed/active state without moving the scene.

- [ ] **Step 4: Add restrained scene motion**

Animate the scan glow, water shimmer, and a small data pulse using CSS. Wrap all nonessential animations in a media query that disables them when `prefers-reduced-motion: reduce` is active.

### Task 4: Implement the right-side energy and environment panels

**Files:**
- Modify: `C:/Users/10208/Desktop/四局厦门金山项目原型/Big Screen/index.html`

- [ ] **Step 1: Add 能源管理 instruments**

Render four circular gauges with the reference values `3619531 kWh`, `2436 kW`, `4143861 kW`, and `3166.70 m³`; show monthly/yearly rows underneath using the supplied values. Use conic-gradient rings, inner circles, and cyan/blue/yellow/red semantic colors.

- [ ] **Step 2: Add the energy trend chart**

Use inline SVG with grid lines, axis labels, two smooth paths, a tab strip `今日 / 本周 / 本月 / 本年`, and the legend `碳排放 / 碳减排`. Keep the chart inside the fixed right panel and prevent labels from overlapping.

- [ ] **Step 3: Add 环境指标 content**

Render area tabs `大堂`, `中低区`, `高区`, central environmental illustration using CSS rings and a leaf icon, and the six values `20.9`, `69.1`, `576.0`, `27.0`, `0.032`, `0.1` with their units and colored statuses.

- [ ] **Step 4: Verify right rail readability**

At the reference viewport, check gauge numbers, chart labels, tabs, and environment values fit their panels without clipping or overlap; verify the two right panels remain within the screen shell at all three desktop aspect sizes.

### Task 5: Wire interaction, accessibility, and validation

**Files:**
- Modify: `C:/Users/10208/Desktop/四局厦门金山项目原型/Big Screen/index.html`

- [ ] **Step 1: Implement live time and date updates**

Update the header clock every second with `HH:mm:ss`, date `YYYY.MM.DD`, and weekday. Keep all updates scoped to existing elements so they cannot resize the layout.

- [ ] **Step 2: Implement navigation and control-button states**

Add click handlers to the seven nav items, the carbon tabs, environment tabs, and two scene control buttons. Each handler updates only the relevant active class and `aria-pressed`/`aria-current` state; prevent default navigation for prototype-only controls.

- [ ] **Step 3: Add focus and reduced-motion behavior**

Ensure icon-only controls have `aria-label`, all buttons and links have `:focus-visible` outlines, and a `prefers-reduced-motion: reduce` media query sets animation duration to zero and disables shimmer/pulse effects.

- [ ] **Step 4: Run static correctness checks**

Run:

```powershell
Select-String -Path 'Big Screen/index.html' -Pattern '建筑概况|荣誉展示|人员统计|车辆统计|能源管理|环境指标|CFIBMS|prefers-reduced-motion|aria-label|clockTime'
```

Expected: all required reference sections, accessibility hooks, and reduced-motion rules are present.

- [ ] **Step 5: Serve and inspect all target viewports**

Start a local static server from the project root, open `Big Screen/index.html` in the in-app browser, and capture/check 1920x1080, 1366x768, and 2560x1440 equivalent viewports. Confirm no console-breaking errors, no horizontal scrollbar, correct proportional scaling, visible Chinese text, and working active states.

- [ ] **Step 6: Final source review**

Review the final diff and ensure only `Big Screen/index.html` plus the approved design/plan documents are changed; confirm no external image or font dependency was added and no unrelated dashboard modules remain.
