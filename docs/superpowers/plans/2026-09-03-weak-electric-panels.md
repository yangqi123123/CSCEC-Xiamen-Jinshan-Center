# Weak Electric Panels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the missing left and right dashboard content for parking, security, and network views in the weak-electric big screen.

**Architecture:** Keep the existing fixed 1920x1080 page and `renderSystem` state machine. Place view-specific panels inside the existing left and right grid rails, then use explicit state selectors to reveal only the panels for the active weak-electric subsystem.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, existing Font Awesome dependency

---

### Task 1: Restore view-specific panel markup

**Files:**
- Modify: `Big Screen/weak-electric.html`

- [ ] Add three parking panels to `.mep-left` for overview, remaining spaces, AGV spaces, and charging piles.
- [ ] Add two security panels to `.mep-left` for barrier gates and access control.
- [ ] Add three network panels to `.mep-left` for the data-center room, fire-control room, and weak-current shaft.
- [ ] Keep the existing parking video, security monitoring, and network status panels in `.mep-right` and add explicit left/right panel classes.
- [ ] Verify the required headings with `rg -n "停车概览|道闸系统|门禁系统|数据中心机房|消控室|弱电井|设备运行状态" "Big Screen/weak-electric.html"`.

### Task 2: Replace fragile panel placement rules

**Files:**
- Modify: `Big Screen/styles.css`

- [ ] Define view-specific grid rows for the left and right rails.
- [ ] Show `.parking-panel`, `.security-panel`, or `.network-panel` only when its matching workspace state is active.
- [ ] Remove the rules that hide `.mep-left`/`.mep-right` and the direct-child `nth-of-type` positioning rules.
- [ ] Add compact ring, status-card, room-summary, and video sizing styles needed by the reference layouts.
- [ ] Verify no obsolete direct-child selectors remain with `rg -n "parking-active > \.mep|nth-of-type.*security-panel|nth-of-type.*network-panel" "Big Screen/styles.css"` and expect no matches.

### Task 3: Simplify subsystem switching and verify

**Files:**
- Modify: `Big Screen/app.js`
- Test: `Big Screen/weak-electric.html`

- [ ] Remove the inline `placePanels` positioning block because CSS owns panel placement.
- [ ] Run a static structure check for balanced HTML and required selectors.
- [ ] Serve the project locally and switch through system overview, meeting, parking, security, and network.
- [ ] Capture the parking, security, and network views at the 1920x1080 design viewport and inspect for blank rails, overlap, clipping, and console errors.

