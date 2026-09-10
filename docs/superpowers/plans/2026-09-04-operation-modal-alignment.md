# Operation Modal Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align operation-management modals with the MEP device-detail panel and present the requested maintenance fields in asset details.

**Architecture:** Keep all changes within the existing shared stylesheet and static `app.js` renderer. Reuse the MEP modal visual language through scoped operation modal selectors, leaving page markup and unrelated system panels untouched.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript.

---

### Task 1: Unify Operation Modal Presentation

**Files:**
- Modify: `Big Screen/styles.css:633-712`
- Modify: `Big Screen/app.js:148-152`

- [ ] **Step 1: Update the modal containers and panels**

Replace the open state for `.asset-modal` and `.maintenance-modal` with centered flex layout, then apply the device-detail visual properties to `.asset-dialog`, `.asset-detail-dialog`, and `.maintenance-dialog`:

```css
.asset-modal.open, .maintenance-modal.open { display: flex; align-items: center; justify-content: center; padding: 0; }
.asset-dialog, .maintenance-dialog { position: relative; width: 1180px; height: 650px; }
.asset-detail-dialog { position: relative; width: 760px; height: 820px; }
```

Apply the existing device-dialog border, gradient, glow, `clip-path`, and `::before` diagonal stripe treatment to these three panel selectors. Position each close button in the upper-right corner and align each title header to the device-dialog header baseline.

- [ ] **Step 2: Left-align list and detail content**

Add left alignment for list headers, list cells, and asset-detail labels/values:

```css
.asset-table-head, .asset-table-row, .maintenance-record-head, .maintenance-record-row { text-align: left; }
.asset-detail-field { justify-items: start; text-align: left; }
.asset-detail-field span, .asset-detail-field b { width: 100%; text-align: left; }
```

Keep the existing grid column definitions and overflow ellipsis rules so the list remains usable at the fixed modal width.

- [ ] **Step 3: Make asset maintenance fields explicit in the renderer**

Retain the existing ordered static detail field list in `openAssetDetail`, including this final sequence:

```js
['保养到期时间', '-'],
['保养说明', '-'],
['预计折旧期限（月）', '-'],
['标签链接', '-'],
['图片', '暂无图片']
```

Continue applying `wide` only to the existing full-row indices for `备注`、`保养说明` and `图片`, so the two depreciation/link fields remain paired in the three-column grid.

- [ ] **Step 4: Run static verification**

Run:

```powershell
node --check 'Big Screen\app.js'
rg -n "�" 'Big Screen\operation.html' 'Big Screen\app.js' 'Big Screen\styles.css'
```

Expected: JavaScript syntax check exits with code 0 and the replacement-character scan returns no matches.

- [ ] **Step 5: Review the target selectors manually**

Run:

```powershell
rg -n -A 30 -B 4 "\.asset-modal|\.maintenance-modal|\.asset-detail-field" 'Big Screen\styles.css'
rg -n -A 8 -B 3 "保养到期时间" 'Big Screen\app.js'
```

Expected: All four modal types use centered MEP-style panels, list/detail text is left-aligned, and the four fields follow `保养到期时间` in order.
