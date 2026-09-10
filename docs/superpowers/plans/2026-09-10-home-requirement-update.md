# Home Requirement Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the outdated workbench requirement drawer with content matching the current dashboard.

**Architecture:** Keep the existing shared requirement drawer and replace only `docs.home` in `app/components/requirement.js`. Derive every section from controls and cards currently rendered by `web/pages/home/home.html`.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript.

---

### Task 1: Replace workbench requirement content

**Files:**
- Modify: `app/components/requirement.js`

- [ ] Replace all eight `docs.home` sections with current workbench behavior.
- [ ] List the period selector, every metric card, space asset metric, rental table column, chart dimension, shortcut selector, pending item, and system message in field descriptions.
- [ ] Keep system-management requirement documents unchanged.

### Task 2: Verify the drawer

**Files:**
- Test: `app/components/requirement.js`
- Test: `web/pages/home/home.html`

- [ ] Run `node --check app/components/requirement.js` and expect exit code 0.
- [ ] Scan the requirement source for prohibited wording and expect no matches.
- [ ] Open the workbench, launch the requirement drawer, and verify the title plus all eight sections.
