# Device Sync Status Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the sync-status checkbox with a compact sliding switch while preserving its submitted boolean value.

**Architecture:** Keep the existing native checkbox and `data-sync-with-status` selector as the accessible state source. Hide only its visual box and render the switch track/thumb with CSS; retain the existing change listener for the status label.

**Tech Stack:** HTML, CSS, vanilla JavaScript

---

### Task 1: Implement and verify the switch

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Add switch track and thumb styling**

Extend `.sync-toggle` so its checkbox is visually hidden, add a track element, and style checked/focus states with the system primary color.

- [ ] **Step 2: Update drawer markup**

Insert `<span class="sync-toggle-track" aria-hidden="true"></span>` after the existing checkbox while retaining `data-sync-with-status` and the state text span.

- [ ] **Step 3: Verify JavaScript syntax**

Run `node --check` against the inline JavaScript extracted from `web/pages/device/list.html` and expect exit code 0.

- [ ] **Step 4: Verify in browser**

Open the sync drawer, confirm the control renders as a switch, toggle it, and confirm the text changes between `不同步` and `同步` without console errors.
