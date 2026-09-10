# Big Screen Requirement Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable requirement-document trigger and modal to every big-screen business page.

**Architecture:** A standalone browser script mounts the shared UI outside the scaled screen canvas and clones page-owned content from an HTML template. Shared CSS matches the existing big-screen modal language, while each page owns only its editable requirement copy.

**Tech Stack:** HTML5 templates, vanilla JavaScript, CSS, Font Awesome

---

### Task 1: Shared component

**Files:**
- Create: `Big Screen/requirement.js`
- Modify: `Big Screen/styles.css`

- [ ] Create the trigger, tooltip, modal, focus restoration and close interactions.
- [ ] Clone `#requirementDocument`, remove empty sections and empty table rows, and skip mounting when no meaningful content remains.
- [ ] Add fixed positioning, large-screen modal styling, scrolling and narrow-viewport constraints.

### Task 2: Page-owned documents

**Files:**
- Modify: `Big Screen/overview.html`
- Modify: `Big Screen/mep.html`
- Modify: `Big Screen/weak-electric.html`
- Modify: `Big Screen/energy.html`
- Modify: `Big Screen/operation.html`

- [ ] Add a template following the fixed sections from `docs/大屏需求文档模板.md`.
- [ ] Add page-specific operation entries and interaction descriptions.
- [ ] Load `requirement.js` after `app.js` on every business page.

### Task 3: Verification

**Files:**
- Test: all five `Big Screen/*.html` business pages

- [ ] Verify every page contains one template and one script reference.
- [ ] Verify the shared script parses without syntax errors.
- [ ] Open the overview page and confirm position, tooltip, modal, scrolling and all close paths.
- [ ] Check a desktop and narrow viewport for clipping or overlap.
