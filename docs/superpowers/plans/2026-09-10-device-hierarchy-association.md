# Device Hierarchy Association Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the attachment-device concept with a two-level device hierarchy and let primary devices associate existing downstream devices.

**Architecture:** Keep the existing single-page HTML prototype and extend each device record with `parentDeviceId`. Render detail tabs conditionally from `attachment`, and manage associations by updating existing device records instead of creating copies.

**Tech Stack:** HTML, CSS, vanilla JavaScript, SheetJS, existing app drawer/confirm components.

---

### Task 1: Rename Device Hierarchy Fields

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Update visible labels and options**

Replace every visible “是否附属设备” label with “设备层级” and every “附属设备” option/value with “下游设备” in filters, table headers, forms, detail fields, mock records and messages. Keep the internal property name `attachment` to minimize unrelated churn.

- [ ] **Step 2: Add relationship state**

Add `parentDeviceId:""` to `blankDevice()` and initialized records. Seed at least one downstream device with a valid primary-device ID so both detail states can be verified.

- [ ] **Step 3: Verify labels**

Run:

```powershell
rg -n "是否附属设备|附属设备" web/pages/device/list.html
```

Expected: no user-facing legacy labels remain; any intentional compatibility conversion is explicitly scoped.

### Task 2: Render Conditional Device Details

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Add parent-device display data**

Update `detailInfo(device)` to resolve `device.parentDeviceId` through `deviceById()`. For downstream devices append “所属主设备”, showing `主设备名称（设备编码）`; show `-` when unassociated.

- [ ] **Step 2: Render tabs by hierarchy**

Update `openDevice("detail", id)` so primary devices render “设备信息 / 下游设备 / 文件资料”, while downstream devices render only “设备信息 / 文件资料”.

- [ ] **Step 3: Protect invalid hierarchy edits**

Before saving a primary device as downstream, check `devices.some(item => item.parentDeviceId === device.id)`. If true, show “请先解除全部下游设备关联” and keep the edit drawer open. When saving a downstream device as primary, clear its `parentDeviceId`.

### Task 3: Build Downstream Association List

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Replace mock related-device rendering**

Remove `relatedDevice()` and render rows from:

```js
devices.filter((item) => item.parentDeviceId === primaryDevice.id)
```

The operation column contains only “详情” and “解除关联”. Render an empty row when no downstream devices are associated.

- [ ] **Step 2: Open real downstream details**

Pass the row device ID through `data-related-detail` and open the independent nested detail drawer using `detailInfo(device)`. Do not show tabs inside this nested drawer.

- [ ] **Step 3: Implement unlink confirmation**

Replace deletion behavior with `data-related-unlink`. Confirm the action, set the selected device’s `parentDeviceId` to an empty string, then rerender only the current downstream panel. Do not remove the device from `devices`.

### Task 4: Associate Existing Downstream Devices

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Build candidate filtering**

Candidates must satisfy:

```js
item.attachment === "下游设备" &&
!item.parentDeviceId &&
item.id !== primaryDevice.id &&
(item.system === primaryDevice.system || item.type === primaryDevice.type)
```

- [ ] **Step 2: Replace the current create-device drawer**

Clicking “新增” opens a nested right drawer containing a checkbox table of eligible candidates. Include device name, device code, system, category and property location. Disable the confirm button until at least one row is selected.

- [ ] **Step 3: Save associations**

On confirmation, set each selected candidate’s `parentDeviceId` to the current primary-device ID, close only the nested drawer, rerender the downstream panel and show a success message.

- [ ] **Step 4: Verify uniqueness**

Reopen the candidate drawer and confirm newly associated devices are absent. Unlink one device and confirm it becomes eligible again.

### Task 5: Update Import, Export and Template Contracts

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Change spreadsheet headers**

Replace “是否附属设备” with “设备层级” in `importHeaders`, template rows, export mappings and import mappings.

- [ ] **Step 2: Validate hierarchy values**

During import accept only `主设备` and `下游设备`. Imported downstream devices receive `parentDeviceId:""`; invalid values increment the failed-row count.

- [ ] **Step 3: Verify spreadsheet generation paths**

Trigger template download and export in the browser and confirm the workbook header is “设备层级”. Confirm import still requires all configured mandatory headers.

### Task 6: Protect Deletion and Run Regression Checks

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Protect primary-device deletion**

Before deleting a primary device, detect linked downstream records. When present, show a message requiring associations to be removed and do not delete the primary device.

- [ ] **Step 2: Run JavaScript syntax validation**

Run:

```powershell
$html=Get-Content -Raw 'web/pages/device/list.html'
$matches=[regex]::Matches($html,'<script(?:\s[^>]*)?>([\s\S]*?)</script>')
$inline=$matches | Where-Object { $_.Groups[1].Value.Trim() } | Select-Object -Last 1
$temp=Join-Path $env:TEMP 'device-list-inline.js'
Set-Content -LiteralPath $temp -Value $inline.Groups[1].Value -Encoding UTF8
node --check $temp
```

Expected: exit code 0 with no syntax errors.

- [ ] **Step 3: Verify page availability**

Run:

```powershell
Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:4173/web/pages/device/list.html' | Select-Object StatusCode
```

Expected: `StatusCode` is 200.

- [ ] **Step 4: Perform browser interaction checks**

Verify primary-device details show the downstream tab; downstream-device details hide it and show the parent; candidate selection associates existing devices; details open correctly; unlink keeps the device record; and all existing filters, forms and file tabs remain usable.
