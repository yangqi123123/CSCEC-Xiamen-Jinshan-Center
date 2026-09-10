# 日志管理 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在系统管理下新增日志管理三级导航，并实现操作日志、登录日志两个可交互的静态后台原型页面。

**Architecture:** 保持现有多页面 HTML 原型架构。菜单配置扩展为可递归树，侧边栏和顶部搜索递归消费同一份配置；两个日志页面分别负责自己的模拟数据、筛选和详情抽屉，公共 CSS 负责表格区域滚动与右侧操作列固定。

**Tech Stack:** 原生 HTML、CSS、JavaScript；现有 `tob-ui.css`、`sidebar.js`、`header.js`、`drawer.js`；不引入新依赖、不接真实接口。

---

### Task 1: 扩展菜单配置与递归导航渲染

**Files:**
- Modify: `C:\Users\10208\Desktop\产品基座\app\config\menu.js`
- Modify: `C:\Users\10208\Desktop\产品基座\app\components\sidebar.js`
- Modify: `C:\Users\10208\Desktop\产品基座\app\components\header.js`
- Modify: `C:\Users\10208\Desktop\产品基座\web\assets\css\tob-ui.css`

- [ ] **Step 1: 将系统菜单配置改为包含日志管理节点的树结构**

在 `system.children` 的 `system.parameter` 后增加：

```js
{
  key: "system.logs",
  label: "日志管理",
  children: [
    { key: "system.operation-log", label: "操作日志", href: "../system/operation-log.html" },
    { key: "system.login-log", label: "登录日志", href: "../system/login-log.html" },
  ],
},
```

- [ ] **Step 2: 将侧边栏子菜单渲染改为递归函数**

在 `sidebar.js` 中让 `renderChildren(children, currentKey, depth = 1)` 对含 `children` 的节点递归调用自身；叶子节点继续输出带 `href` 的 `.submenu-item`，父节点输出 `.submenu-group` 和 `.submenu-group-label`，并根据当前 key 或后代 key 展开。保留现有 `.submenu-item.active` 选中态和导航点击写入 `app-route-tabs` 的逻辑。

- [ ] **Step 3: 让顶部菜单搜索递归收集叶子菜单**

在 `header.js` 中增加递归 `flattenMenu(items)`，只返回存在可访问 `href` 的叶子项；替换当前只展开一层的 `flatMap`，确保搜索结果包含操作日志和登录日志。

- [ ] **Step 4: 增加三级菜单缩进样式**

在公共 CSS 中补充 `.submenu-group`、`.submenu-group-label` 和 `.submenu .submenu` 样式，使用 8px 网格和更深一级的左内边距；三级叶子项在当前页时使用蓝色文字和浅蓝背景，不改变现有二级页面布局。

- [ ] **Step 5: 静态检查导航引用**

运行：

```powershell
rg -n "system\.logs|operation-log|login-log|renderChildren|flattenMenu" app web/assets/css/tob-ui.css
```

预期：菜单配置、递归渲染函数、两个页面链接和三级样式均能被定位。

### Task 2: 沉淀日志页面公共样式

**Files:**
- Modify: `C:\Users\10208\Desktop\产品基座\web\assets\css\tob-ui.css`

- [ ] **Step 1: 增加日志页面筛选区与工具栏样式**

为 `.log-page`、`.log-filter-row`、`.log-toolbar`、`.log-table` 添加紧凑筛选网格、工具栏按钮排列和日志表格最小宽度规则；筛选区在窄屏下可换行，表格不压缩文本。

- [ ] **Step 2: 复用并覆盖公共表格滚动约束**

确保日志列表使用：

```css
.log-list-card { min-width: 0; overflow: hidden; }
.log-list-card .table-wrap { min-width: 0; max-width: 100%; overflow: auto; }
.log-table { min-width: 1380px; }
```

并让最后一列通过 `.table-actions-sticky` 固定在右侧，表头、普通行、悬停行和选中行背景分别可见。

- [ ] **Step 3: 增加日志状态与类型标签样式**

复用 `.tag.primary`、`.tag.success`、`.tag.danger` 和现有按钮状态；为操作类型提供 `log-type-create`、`log-type-export` 等低干扰标签色，不引入新的视觉体系。

### Task 3: 实现操作日志页面

**Files:**
- Create: `C:\Users\10208\Desktop\产品基座\web\pages\system\operation-log.html`

- [ ] **Step 1: 创建页面壳与筛选字段**

使用现有 `app-shell`、侧边栏、头部、`screen-frame stack` 和 `card` 结构；页面 body 使用 `data-menu-key="system.operation-log"`、`data-page-section="系统管理"`、`data-page-title="操作日志"`。筛选字段依次为系统模块、操作人员、操作类型、操作 IP、状态、操作时间，并提供收起、重置、搜索按钮。

- [ ] **Step 2: 创建模拟数据与表格渲染**

定义包含以下字段的数组：`id`、`module`、`type`、`operator`、`ip`、`location`、`status`、`time`、`duration`、`detail`、`request`、`method`、`params`。表格列为选择框、系统模块、操作类型、操作人员、IP 地址、IP 信息、操作状态、操作日期、操作耗时、操作；操作列仅保留“预览”。

- [ ] **Step 3: 实现筛选、重置和批量删除**

筛选按钮按非空字段执行字符串包含匹配，枚举字段执行精确匹配；重置恢复原始数组；勾选行后启用删除按钮，确认删除后移除模拟记录并重新渲染。

- [ ] **Step 4: 实现操作日志详情抽屉**

点击“预览”调用 `window.openAppDrawer`，标题为“查看日志”，内容使用 `.log-detail-table` 展示日志编号、操作结果、操作模块、操作信息、请求信息、方法、请求参数、请求耗时、操作时间；底部提供关闭按钮。详情内容根据当前记录填充。

- [ ] **Step 5: 实现工具按钮原型反馈**

清空按钮清除当前数据前弹出确认；导出、刷新、表格辅助按钮使用轻量提示或 `openAppConfirm`，不创建真实下载文件。

### Task 4: 实现登录日志页面

**Files:**
- Create: `C:\Users\10208\Desktop\产品基座\web\pages\system\login-log.html`

- [ ] **Step 1: 创建页面壳与筛选字段**

复用操作日志页面的公共壳，使用 `data-menu-key="system.login-log"`、页面标题“登录日志”。筛选字段为 IP 地址、用户账号、登录状态、登录日期，并提供收起、重置、搜索按钮。

- [ ] **Step 2: 创建模拟数据与表格渲染**

定义包含 `id`、`account`、`platform`、`ip`、`location`、`browser`、`os`、`status`、`message`、`time`、`device` 的数组。表格列为选择框、用户账号、登录平台、IP 地址、IP 地点、浏览器、系统、登录结果、信息、日期、操作；操作列包含“详情”和“删除”。

- [ ] **Step 3: 实现筛选、重置、详情和删除**

按筛选字段匹配模拟数据；详情调用右侧抽屉展示登录状态、登录平台、账号信息、登录时间、登录信息、登录设备和浏览器；删除使用确认弹窗，确认后从当前模拟数组移除。

- [ ] **Step 4: 实现批量工具按钮原型反馈**

实现选择框和批量删除启用态；清空、导出、解锁、刷新按钮提供原型确认/提示，不接真实能力。

### Task 5: 联调与回归验证

**Files:**
- Verify: `C:\Users\10208\Desktop\产品基座\app\config\menu.js`
- Verify: `C:\Users\10208\Desktop\产品基座\app\components\sidebar.js`
- Verify: `C:\Users\10208\Desktop\产品基座\app\components\header.js`
- Verify: `C:\Users\10208\Desktop\产品基座\web\assets\css\tob-ui.css`
- Verify: `C:\Users\10208\Desktop\产品基座\web\pages\system\operation-log.html`
- Verify: `C:\Users\10208\Desktop\产品基座\web\pages\system\login-log.html`

- [ ] **Step 1: 检查 HTML/JavaScript 基础语法**

运行项目现有可用的静态检查命令；若无 package scripts，则使用 PowerShell 对页面脚本块做文件级检查，并通过浏览器加载页面观察控制台无语法错误。

- [ ] **Step 2: 验证导航状态**

分别打开操作日志和登录日志页面，确认系统管理展开、日志管理展开、当前三级菜单高亮、顶部标签标题正确，顶部搜索能检索到两个日志页面。

- [ ] **Step 3: 验证操作日志交互**

验证筛选、重置、勾选启用删除、删除确认、预览抽屉字段和关闭；横向滚动时确认滚动条位于表格区域且操作列保持可见。

- [ ] **Step 4: 验证登录日志交互**

验证筛选、重置、详情抽屉、单条删除和批量删除；横向滚动与操作日志保持一致。

- [ ] **Step 5: 回归现有页面**

至少打开参数设置、菜单管理、用户管理，确认原有二级菜单、表格区域滚动、固定操作列和抽屉交互没有回归。

