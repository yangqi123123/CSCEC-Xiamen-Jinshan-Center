# CSCEC Login and Admin Branding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Web login and admin shell branding with China Construction Fourth Engineering Bureau branding and add a shared-login Tab switch for the big screen and admin system.

**Architecture:** Keep the existing static HTML/CSS/JavaScript structure. The login page owns the selected product target and updates one shared login link; the shared sidebar component renders the same logo and system name across every admin page, with shared CSS constraining the brand block inside the unchanged sidebar width.

**Tech Stack:** Static HTML5, CSS3, vanilla JavaScript, existing Font Awesome CDN, browser-based visual verification.

---

## File Map

- Create `web/assets/images/login-ai-platform.png`: user-provided AI guide artwork used only by the Web login page.
- Create `web/assets/images/cscec-logo.png`: user-provided CSCEC logo shared by login and admin sidebar.
- Modify `web/web-login.html`: replace brand and illustration, add product Tabs, remove obsolete links, and route login by selected Tab.
- Modify `app/components/sidebar.js`: render the shared CSCEC logo and full system name.
- Modify `app/components/header.js`: use the new system name as the fallback breadcrumb section.
- Modify `app/components/drawer.js`: use the new system name as the default drawer subtitle.
- Modify `app/components/requirement.js`: update the workbench requirement section label.
- Modify `web/assets/css/tob-ui.css`: size the sidebar brand logo and name without changing `--sidebar-width`.
- Modify matching `web/pages/**/*.html` files: replace old product-name title suffixes and the workbench breadcrumb section.

### Task 1: Add Approved Image Assets

**Files:**
- Create: `web/assets/images/login-ai-platform.png`
- Create: `web/assets/images/cscec-logo.png`

- [x] **Step 1: Copy the two supplied PNG files into the project**

Run:

```powershell
Copy-Item -LiteralPath 'C:\Users\10208\AppData\Local\Temp\codex-clipboard-e7e198ae-5dd3-4c51-872a-876648fb8c08.png' -Destination 'web\assets\images\login-ai-platform.png'
Copy-Item -LiteralPath 'C:\Users\10208\AppData\Local\Temp\codex-clipboard-87a4f90e-709c-47c4-83bb-c5cdf75da245.png' -Destination 'web\assets\images\cscec-logo.png'
```

Expected: both destination files exist and retain PNG dimensions and transparency/color data.

- [x] **Step 2: Verify asset presence and nonzero size**

Run:

```powershell
Get-Item 'web\assets\images\login-ai-platform.png','web\assets\images\cscec-logo.png' | Select-Object Name,Length
```

Expected: two rows with `Length` greater than zero.

### Task 2: Rebuild the Login Brand and Product Switch

**Files:**
- Modify: `web/web-login.html`

- [x] **Step 1: Replace the old brand mark and illustration markup**

Use the shared logo image and remove all four `.guide-chip` elements:

```html
<section class="brand-area" aria-label="中建四局智能运营管理系统">
  <img class="brand-logo" src="assets/images/cscec-logo.png" alt="中建四局">
  <span class="brand-name">中建四局智能运营管理系统</span>
</section>

<section class="guide-area" aria-label="智能运营管理平台引导图">
  <img class="guide-image" src="assets/images/login-ai-platform.png" alt="智能运营管理平台引导图">
</section>
```

- [x] **Step 2: Add accessible product Tabs above the login title**

```html
<div class="login-product-tabs" role="tablist" aria-label="选择登录系统">
  <button class="login-product-tab" type="button" role="tab" aria-selected="false" data-login-target="screen">可视化大屏</button>
  <button class="login-product-tab active" type="button" role="tab" aria-selected="true" data-login-target="admin">智能运营管理系统</button>
</div>
```

Expected: the admin Tab is selected on initial load.

- [x] **Step 3: Remove obsolete actions and keep one shared form**

Replace the option/footer area with:

```html
<div class="login-options">
  <label><input type="checkbox"> 记住密码</label>
</div>
<a id="loginButton" class="login-button" href="pages/home/home.html">登录</a>
```

Expected: no visible or source occurrences remain for `忘记密码`, `服务协议`, or `隐私政策`.

- [x] **Step 4: Route the login button from the active Tab**

Add to the existing script:

```js
const loginButton = document.getElementById("loginButton");
const loginTabs = [...document.querySelectorAll("[data-login-target]")];
const loginTargets = {
  screen: "../Big Screen/overview.html",
  admin: "pages/home/home.html",
};

loginTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    loginTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    loginButton.href = loginTargets[tab.dataset.loginTarget];
  });
});
```

Expected: changing Tabs preserves username and password values and changes only the login `href`.

- [x] **Step 5: Style the new logo, illustration, and Tabs**

Add fixed, responsive constraints rather than viewport-scaled type:

```css
.brand-logo { width: 56px; height: 48px; object-fit: contain; }
.brand-area .brand-name { max-width: 280px; color: #1f2d3d; font-size: 18px; font-weight: 700; }
.guide-image { width: min(620px, 100%); height: 100%; object-fit: contain; object-position: center bottom; }
.login-card { min-height: 454px; padding: 0 44px 34px; }
.login-product-tabs { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #dfe7f2; }
.login-product-tabs { margin: 0 -44px 26px; padding: 0 28px; }
.login-product-tab { min-width: 0; height: 54px; padding: 0 10px; color: #66788b; background: transparent; font-size: 14px; }
.login-product-tab.active { color: #135afa; border-bottom: 2px solid #135afa; font-weight: 700; }
.login-title { margin-bottom: 26px; }
.login-options { margin: 18px 0; justify-content: flex-start; }
```

At the existing narrow-screen breakpoint, retain the card width rule and use:

```css
@media (max-width: 1180px) {
  .login-card { padding-right: 32px; padding-left: 32px; }
  .login-product-tabs { margin: 0 -32px 24px; padding: 0 16px; }
}
```

- [x] **Step 6: Run static login checks**

Run:

```powershell
rg -n "中建四局智能运营管理系统|data-login-target|loginTargets|Big Screen/overview.html|pages/home/home.html" web/web-login.html
rg -n "忘记密码|服务协议|隐私政策|guide-chip" web/web-login.html
```

Expected: the first command finds all required strings; the second command returns no matches.

### Task 3: Update Shared Admin Sidebar Branding

**Files:**
- Modify: `app/components/sidebar.js`
- Modify: `web/assets/css/tob-ui.css`

- [x] **Step 1: Render the new brand from the shared sidebar component**

Replace the existing brand mark/name with:

```html
<img class="brand-logo" src="../../assets/images/cscec-logo.png" alt="中建四局">
<span class="brand-name">中建四局智能运营管理系统</span>
```

Expected: every admin page using `#app-sidebar` receives the same brand automatically.

- [x] **Step 2: Constrain the shared brand inside the current sidebar width**

Add or adjust the shared styles:

```css
.brand-link { width: 100%; min-width: 0; gap: 8px; }
.sidebar .brand-logo { width: 38px; height: 38px; flex: 0 0 38px; object-fit: contain; }
.sidebar .brand-name { min-width: 0; font-size: 13px; line-height: 1.35; font-weight: 700; white-space: normal; overflow-wrap: anywhere; }
[data-sidebar="collapsed"] .sidebar .brand-logo { width: 32px; height: 32px; flex-basis: 32px; }
```

Do not change `--sidebar-width`, `--sidebar-collapsed`, menu widths, or navigation behavior.

- [x] **Step 3: Run shared-brand checks**

Run:

```powershell
rg -n "cscec-logo.png|中建四局智能运营管理系统" app/components/sidebar.js web/web-login.html
rg -n -- "--sidebar-width|--sidebar-collapsed" web/assets/css/tob-ui.css
```

Expected: both surfaces reference the new brand, while existing sidebar width tokens remain present and unchanged.

### Task 4: Browser Interaction and Layout Verification

**Files:**
- Verify: `web/web-login.html`
- Verify: `web/pages/home/home.html`

- [x] **Step 1: Open the login page through a local HTTP server**

Run:

```powershell
npx --yes serve . -l 4173
```

Expected: the project is available at `http://localhost:4173/web/web-login.html`.

- [ ] **Step 2: Verify desktop login behavior at 1440 x 900**

Expected: the new illustration is fully visible, the brand name does not overlap, both Tabs fit, obsolete links are absent, password visibility works, the default login target is `web/pages/home/home.html`, and the screen Tab changes the target to `Big%20Screen/overview.html`.

- [ ] **Step 3: Verify responsive login behavior at 1024 x 768 and 390 x 844**

Expected: the image keeps its aspect ratio; brand, Tabs, fields, and button do not overlap or create horizontal scrolling.

- [ ] **Step 4: Verify the admin shell at 1440 x 900 and collapsed state**

Expected: sidebar width is unchanged, the full system name is visible when expanded, the Logo remains centered when collapsed, and menu items retain their current layout.

- [x] **Step 5: Review all changed files**

Run:

```powershell
Get-Item web/assets/images/login-ai-platform.png,web/assets/images/cscec-logo.png | Select-Object Name,Length
rg -n "产品基座|中建四局智能运营管理系统" web/web-login.html app/components/sidebar.js
```

Expected: changed surfaces contain only the new visible brand name and both image files are nonempty.

Browser screenshot steps 2-4 could not run because two local-URL browser approval attempts timed out. Static DOM assertions, JavaScript syntax checks, CSS brace checks, and HTTP 200 checks were completed instead; do not mark the visual steps complete without an actual browser run.

## Environment Constraint

The workspace contains an empty `.git` directory, so `git status`, worktree creation, and incremental commits are unavailable. Do not initialize or overwrite repository metadata as part of this feature; complete verification against the working files instead.
