# Device Sync Log Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add device-data synchronization, device-status synchronization, an in-page synchronization-log workspace, and device source-module tracking to the existing device management prototype.

**Architecture:** Keep `web/pages/device/list.html` as the single implementation unit. Introduce explicit device/log view containers and render mock batch/detail data with small JavaScript render functions, while reusing the existing drawer, confirm, table, filter, button and pagination components.

**Tech Stack:** HTML, CSS, vanilla JavaScript, SheetJS, existing app drawer and confirm components.

---

### Task 1: Add Source Module to Device Records and UI

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Extend device data**

Add `sourceModule` to initialized and blank records. Existing/manual records use `人工台账`; selected mock synchronized records use `第三方同步`.

- [ ] **Step 2: Extend filters and table**

Add an expanded filter select with values `人工台账` and `第三方同步`. Add the 来源模块 column to the device table and update empty-state `colspan`.

- [ ] **Step 3: Extend forms and detail**

Add a 来源模块 select to create/edit forms and an info item to device and downstream-device details. Keep the field required and default manual creation to `人工台账`.

- [ ] **Step 4: Extend export/import behavior**

Add `来源模块` to export output. Keep it out of `importHeaders`; assign imported rows `sourceModule:"人工台账"`.

### Task 2: Add Sync Actions and Data-Sync Drawer

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Add toolbar buttons**

Add secondary buttons with system icons for `同步设备数据`, `同步设备状态`, and `同步日志` before destructive/create actions.

- [ ] **Step 2: Build data-sync drawer**

Use `window.openAppDrawer()` with a 同步模式 select (`首次全量同步`, `后续增量同步`) and a 同步设备状态 switch defaulting off. Footer actions are 取消 and 开始同步.

- [ ] **Step 3: Submit a mock batch**

On start, generate a batch number in the form `IOTS-XXXXXXXXXXXX`, prepend an executing log record, close the drawer and show the submitted-task message. Map modes to `FULL` and `INCREMENTAL`.

- [ ] **Step 4: Implement status sync message**

Generate a status-sync batch number and show the submitted-task message without changing device rows.

### Task 3: Build Device and Log View Switching

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Separate mode containers**

Wrap the existing device filter/list in a device-mode container. Add a hidden log-mode container containing a log filter card and a log list card.

- [ ] **Step 2: Render log filters and toolbar**

Log filters contain 批次号, 通道编码 and 同步模式 with 重置 and 搜索. The toolbar contains 刷新批次 and 返回设备列表.

- [ ] **Step 3: Implement mode controls**

Click 同步日志 to hide device mode and show log mode; click 返回设备列表 to restore device mode. Keep filter values in their own controls so state survives switching.

### Task 4: Render and Filter Synchronization Batches

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Define mock batch records**

Create records with `id`, `channelName`, `channelCode`, `mode`, `status`, `total`, `success`, `failed`, `startTime`, `endTime`, and `error`. Include running, successful and failed examples.

- [ ] **Step 2: Render the batch table**

Render all required columns, map status to compact system tags, and add a 查看明细 action carrying the batch ID. Show a standard empty row when filters return no records.

- [ ] **Step 3: Implement search/reset/refresh**

Search by partial batch/channel code and exact mode. Reset clears log controls. Refresh restores all records and rerenders without leaving log mode.

### Task 5: Build Batch Detail and Staging List

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Render selected batch summary**

Below the log list, show channel, status, success/failed, mode, start/end time and error for the selected batch.

- [ ] **Step 2: Add detail filters**

Add filters for 外部设备ID, 外部设备编码, 内部设备编码 and 设备名称, with reset and search actions aligned to the existing public filter convention.

- [ ] **Step 3: Define and render staging records**

Create mock detail rows keyed by batch ID and render 外部设备ID, 外部设备编码, 内部设备编码, 设备名称, 清洗状态, 匹配设备ID, 清洗说明, 来源更新时间 and 操作. Add 查看报文 carrying the detail ID.

- [ ] **Step 4: Implement detail filtering**

Filter the selected batch's staging rows by partial field matches. Reset returns all rows for that batch.

### Task 6: Build Message Detail Drawer

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Define normalized and raw payloads**

Each staging record includes `normalizedPayload` and `rawPayload` objects with realistic device, system, room and supplier fields.

- [ ] **Step 2: Open the report drawer**

Open a large nested right drawer titled 暂存报文详情 with `标准化报文` and `原始报文` tabs. Render escaped, formatted JSON inside a dark, scrollable `<pre>` region.

- [ ] **Step 3: Implement report tab switching**

Tab clicks switch the visible payload without closing the batch detail or log workspace. The drawer footer contains only 关闭.

### Task 7: Verify Behavior and Layout

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: Run static label checks**

Run `rg -n "来源模块|同步设备数据|同步设备状态|同步日志|查看明细|查看报文" web/pages/device/list.html` and confirm each requested surface is present.

- [ ] **Step 2: Run JavaScript syntax validation**

Extract the final inline script and run `node --check`; expect exit code 0.

- [ ] **Step 3: Verify local HTTP response**

Request `http://127.0.0.1:4173/web/pages/device/list.html`; expect HTTP 200.

- [ ] **Step 4: Run browser interaction checks**

Verify source module in filters/list/forms/details; both synchronization actions; device/log mode switching; log filters; batch detail; detail filters; and both report tabs. Check browser console errors and verify none are emitted.
