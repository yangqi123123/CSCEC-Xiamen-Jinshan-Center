# Big Screen HUD Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Execute the tasks inline with checkpoints and visual verification.

**Goal:** Rebuild `Big Screen/index.html` as a polished dark-blue HUD operations dashboard based on the supplied references, using a 1920×1080 desktop canvas that scales proportionally across computer windows.

**Architecture:** Keep the page self-contained as one static HTML file. Use a fixed 1920×1080 inner canvas inside a viewport wrapper, CSS custom properties for the visual system, semantic HTML for panels/tables, inline SVG for charts and central decorative data visualization, and a small inline script for live time and accessible navigation feedback.

**Tech Stack:** HTML5, CSS3, inline SVG, vanilla JavaScript, existing Font Awesome CDN.

---

### Task 1: Replace the page shell and visual tokens

**Files:**
- Modify: `C:/Users/10208/Desktop/产品基座/Big Screen/index.html`

- [ ] Replace the current responsive SaaS grid shell with a viewport wrapper and a fixed 1920×1080 `.screen-shell` that is centered and scaled using CSS custom properties set by JavaScript.
- [ ] Add the dark navy background, hex-grid texture, edge frame, corner brackets, top title plate, and bottom navigation rail.
- [ ] Define reusable tokens for panel surfaces, blue/cyan glows, warning colors, typography, borders, shadows, spacing, and HUD cut corners.
- [ ] Keep all implementation self-contained and do not add new project files or assets.

### Task 2: Build the header and KPI rail

**Files:**
- Modify: `C:/Users/10208/Desktop/产品基座/Big Screen/index.html`

- [ ] Add the header brand, centered title, top navigation buttons, online indicator, live date/time, and existing back-to-entry link.
- [ ] Add four KPI cards for device total, online rate, abnormal alerts, and pending work orders with readable numeric hierarchy and trend metadata.
- [ ] Ensure every icon-only control has an accessible label and every navigation control has a visible focus state.

### Task 3: Build the three-column dashboard content

**Files:**
- Modify: `C:/Users/10208/Desktop/产品基座/Big Screen/index.html`

- [ ] Create the left column with device health cards, alert stream, and region summary table.
- [ ] Create the center column with the SVG operation trend chart, legend, central status visualization, and live data annotation.
- [ ] Create the right column with online structure donut, regional ranking bars, and device alert table.
- [ ] Use consistent section headers with clipped HUD title bars and compact information density matching the references.

### Task 4: Add interaction and motion polish

**Files:**
- Modify: `C:/Users/10208/Desktop/产品基座/Big Screen/index.html`

- [ ] Add live clock updates and a small “last updated” state.
- [ ] Add hover/focus states for navigation, KPI cards, and table rows without changing layout dimensions.
- [ ] Add restrained scanning-line and chart-point animations and disable nonessential motion under `prefers-reduced-motion: reduce`.

### Task 5: Verify the rendered page

**Files:**
- Verify: `C:/Users/10208/Desktop/产品基座/Big Screen/index.html`

- [ ] Run a static structure check to confirm the HTML contains the expected shell, header, KPI rail, chart, table, and responsive scaling hooks.
- [ ] Serve the workspace locally and inspect the page at 1920×1080, 1366×768, and 2560×1440 equivalent viewport ratios.
- [ ] Confirm no console-breaking script errors, no horizontal scroll at the desktop canvas, no Chinese mojibake in the source, and a working return link.
- [ ] Verify reduced-motion CSS is present and all primary controls remain keyboard-focusable.
