# Overview People Statistics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the overview people statistics panel with synchronized period switching, the existing people-type ring, and a passage-count trend chart.

**Architecture:** Keep the feature inside the existing overview panel and shared big-screen assets. Static HTML provides the semantic chart containers, page-scoped CSS preserves the dashboard style, and a page-key-gated JavaScript renderer updates Mock totals and SVG geometry for each period.

**Tech Stack:** HTML5, CSS Grid, inline SVG, vanilla JavaScript

---

### Task 1: Add the people statistics chart structure

**Files:**
- Modify: `Big Screen/overview.html:70`

- [ ] **Step 1: Replace the current people panel body**

Add a four-button toolbar, the `人员类型` subsection containing the existing ring and side totals, and a `通行次数` subsection containing an accessible SVG with grid, area, line, points, and axis groups. Use stable IDs for values and SVG nodes so JavaScript can render without rebuilding the panel.

- [ ] **Step 2: Verify required hooks exist**

Run:

```powershell
rg -n "data-people-period|人员类型|通行次数|peopleTrendLine|peopleTrendAxis" "Big Screen/overview.html"
```

Expected: all four period buttons, both subtitles, and all chart hooks are present.

### Task 2: Fit both charts into the existing panel

**Files:**
- Modify: `Big Screen/styles.css:166`
- Modify: `Big Screen/styles.css:248`

- [ ] **Step 1: Add overview people panel layout styles**

Use a fixed internal grid with rows for toolbar, `人员类型`, ring content, `通行次数`, and trend chart. Keep the current cyan ring construction, reduce its dimensions only enough to fit the new chart, and style the period controls consistently with alarm statistics.

- [ ] **Step 2: Add trend chart styles**

Reuse the alarm chart visual language: dashed cyan grid, translucent cyan area, glowing cyan line, compact axis labels, and `单位（次）` in the upper-left. Ensure SVG content remains inside the panel.

- [ ] **Step 3: Check stylesheet integrity**

Run:

```powershell
rg -n "people-period-tabs|people-section-title|people-trend-chart" "Big Screen/styles.css"
git diff --check -- "Big Screen/styles.css"
```

Expected: new selectors exist and no whitespace errors are reported.

### Task 3: Implement synchronized period rendering

**Files:**
- Modify: `Big Screen/app.js`

- [ ] **Step 1: Add page-scoped Mock data**

Define `today`, `week`, `month`, and `year` entries containing office count, visitor count, axis labels, and passage-count values. Keep this block behind `pageKey === 'overview'`.

- [ ] **Step 2: Add the SVG renderer**

Implement a renderer that calculates points from the selected values, updates the area and line paths, creates point circles and x-axis text, and updates office, visitor, and total values. It must handle all four fixed datasets without external libraries.

- [ ] **Step 3: Bind the period buttons**

Bind click handlers to `[data-people-period]`, keep exactly one active button, and call the same renderer so the ring figures and trend chart update together. Render `today` on initialization.

- [ ] **Step 4: Verify JavaScript and hooks**

Run:

```powershell
node --check "Big Screen/app.js"
rg -n "peopleStatisticsData|data-people-period|renderPeopleStatistics" "Big Screen/app.js"
```

Expected: syntax check exits successfully and implementation hooks are found.

### Task 4: Browser and regression verification

**Files:**
- Verify: `Big Screen/overview.html`
- Verify: `Big Screen/styles.css`
- Verify: `Big Screen/app.js`

- [ ] **Step 1: Open the overview page at dashboard resolution**

Verify the panel contains the period controls, both subtitles, the original ring style, and the passage trend without clipping or overlap.

- [ ] **Step 2: Exercise all four periods**

Click `今日`, `本周`, `本月`, and `本年`. Confirm each click updates both people totals and trend labels/data, while only one button remains active.

- [ ] **Step 3: Run final static checks**

Run:

```powershell
node --check "Big Screen/app.js"
git diff --check -- "Big Screen/overview.html" "Big Screen/styles.css" "Big Screen/app.js"
$bad = Select-String -Path 'Big Screen/overview.html','Big Screen/styles.css','Big Screen/app.js' -Pattern '锟|�|Ã|Â'
```

Expected: JavaScript is valid, diff check succeeds, and `$bad` is empty.
