# Weak Shaft Two-Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the weak-shaft selector/table with two fixed status cards matching the supplied reference.

**Architecture:** Reuse the existing 25-record `weakLocations` array. Render two consecutive cards from a group start index and advance that index by two when either arrow is clicked; scope all layout changes to the weak-shaft panel.

**Tech Stack:** Vanilla JavaScript and CSS3.

---

### Task 1: Replace the shaft renderer

**Files:**
- Modify: `Big Screen/app.js`

- [x] **Step 1: Render two consecutive cards**

Replace the selector/table markup in `renderShaft` with two cards. Each card must show the full shaft name, device count, online count, offline count, fault count, and an arrow button.

- [x] **Step 2: Bind group navigation**

Bind both arrows to `renderShaft((startIndex + 2) % weakLocations.length)` so the cards advance together and wrap.

- [x] **Step 3: Validate syntax**

Run: `node --check "Big Screen/app.js"`

Expected: exit code 0 and no output.

### Task 2: Match the supplied card layout

**Files:**
- Modify: `Big Screen/styles.css`

- [x] **Step 1: Add the fixed two-card grid**

Make the weak-shaft body a two-row grid. Each card uses a centered name header and a five-column lower area containing four metrics plus the arrow.

- [x] **Step 2: Remove obsolete shaft selector/table presentation**

Ensure no `.weak-location-select`, `.weak-list-head`, or `.weak-list-row` is rendered inside the weak-shaft panel while preserving those styles where the equipment-room selector still uses them.

- [x] **Step 3: Check integrity**

Run: `rg -n "�|选择弱电井|weak-list-head|weak-list-row" "Big Screen/app.js"`

Expected: no replacement character and no obsolete weak-shaft renderer markup.
