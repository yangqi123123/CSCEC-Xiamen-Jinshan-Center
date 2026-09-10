# Device Management Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成设备管理页面的二维码下载、设备录入联动、房源级联、平面图打点以及真实 Excel 导入导出。

**Architecture:** 保留现有单页 HTML 与公共抽屉组件，将系统类型和设备分类作为共享 Mock 数据加载。设备页面内部新增轻量树形选择、三级级联、居中业务弹窗、二维码画布和 Excel 文件处理函数，不改动其他业务页面结构。

**Tech Stack:** HTML、CSS、原生 JavaScript、现有 `tob-ui.css`、QRCode.js、SheetJS、JSZip。

---

### Task 1: 共享设备分类数据与平面图资源

**Files:**
- Create: `app/data/device-categories.js`
- Modify: `web/pages/device/category.html`
- Create: `web/assets/images/device-floor-plan.png`

- [ ] **Step 1: 创建共享设备分类 Mock 数据**

将电梯系统与综合安防的八条分类写入 `window.APP_DEVICE_CATEGORIES`，字段固定为 `id`、`name`、`code`、`system`、`sort`、`remark`。

- [ ] **Step 2: 让设备分类页面读取共享数据**

在 `category.html` 加载 `device-categories.js`，并使用浅拷贝保留页面内新增、编辑、删除能力：

```js
const categories = (window.APP_DEVICE_CATEGORIES || []).map((item) => ({ ...item }));
```

- [ ] **Step 3: 保存平面图资源**

将用户提供的图五复制为 `web/assets/images/device-floor-plan.png`，保持原始 PNG 尺寸与透明区域。

- [ ] **Step 4: 验证共享数据和图片**

运行 JavaScript 语法检查，确认共享数组为八条记录，并确认图片可读取且宽高大于零。

### Task 2: 优化设备表单字段与联动组件

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: 加载共享数据与第三方库**

在页面加载 `system-types.js`、`device-categories.js`、QRCode.js、SheetJS 和 JSZip，保留现有公共组件脚本顺序。

- [ ] **Step 2: 调整设备数据字段名称**

统一使用 `code` 表示设备编码、`house` 表示所属房源、`coordinate` 表示设备坐标；移除表单中的 `bimId`、`subsystem`、`height` 和目标坐标字段。

- [ ] **Step 3: 实现所属系统树形下拉**

树节点读取 `window.APP_SYSTEM_TYPES`，支持父子级展开、收起、完整路径回显；只有点击具体节点才关闭面板。

- [ ] **Step 4: 实现设备分类联动**

设备分类初始禁用。所属系统选中后，按 `category.system === selectedSystemName` 过滤共享分类；系统变化时清空原分类值，编辑时回显匹配分类。

- [ ] **Step 5: 实现所属房源三级级联**

使用 Mock 数据生成“楼栋 → 楼层 → 房源”三列面板，选中房源后回填完整路径，例如 `A01 / 4F / 4-01`。

- [ ] **Step 6: 实现智能化字段显隐**

监听是否智能化单选项：值为“否”时隐藏并清空物模型与第三方编码，值为“是”时恢复显示。

- [ ] **Step 7: 对齐表单间距**

服务范围、备注与其他表单项统一使用 16px 垂直间距，点位信息只保留设备坐标与点位选择按钮。

### Task 3: 平面图点位选择

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: 增加点位选择弹窗结构与样式**

使用居中遮罩弹窗，左侧显示楼栋和楼层，右侧显示 `device-floor-plan.png`；弹窗遵循 4px 圆角、浅边框和系统按钮样式。

- [ ] **Step 2: 实现楼层选择**

点击楼栋或楼层更新当前选择和标题，不关闭弹窗；默认使用当前所属房源对应楼层，没有房源时默认 `A01 / 1F`。

- [ ] **Step 3: 实现图片打点**

点击图片获取相对于图片显示区域的百分比坐标，绘制蓝色点位标记；重复点击移动同一个标记。

```js
const x = ((event.clientX - rect.left) / rect.width * 100).toFixed(2);
const y = ((event.clientY - rect.top) / rect.height * 100).toFixed(2);
```

- [ ] **Step 4: 回填设备坐标**

点击确认后将 `经度 X%，纬度 Y%` 写入设备坐标输入框并关闭弹窗；未打点时提示用户先选择点位。

### Task 4: 二维码预览与下载

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: 调整工具栏按钮状态**

“打印二维码”改为“下载二维码”，初始禁用；`renderRows()` 根据 `selectedIds.size > 0` 同步按钮状态。

- [ ] **Step 2: 生成二维码图片**

使用 QRCode.js 生成二维码，再绘制到最终 Canvas，上方为二维码，下方依次绘制设备名称和设备编码，导出 PNG Blob。

- [ ] **Step 3: 实现单选与多选下载**

单选直接下载 `设备名称+设备编码.png`；多选用 JSZip 打包同名 PNG，下载 `设备二维码.zip`。

- [ ] **Step 4: 实现操作列二维码弹窗**

点击“二维码”打开居中弹窗，展示生成后的二维码图片、设备名称、设备编码以及下载按钮。

- [ ] **Step 5: 实现依赖错误提示**

QRCode 或 JSZip 未加载时通过系统确认弹窗提示“二维码组件加载失败，请刷新页面后重试”。

### Task 5: Excel 导入、导出与模板下载

**Files:**
- Modify: `web/pages/device/list.html`

- [ ] **Step 1: 拆分导入和导出按钮**

工具栏按“下载二维码、导入、导出、删除、新增设备”排列，按钮尺寸沿用公共 `.btn`。

- [ ] **Step 2: 定义模板表头**

表头固定为：所属系统、设备分类、设备名称、设备编码、所属房源、安装位置、是否附属设备、是否智能化、设备所属物模型。

- [ ] **Step 3: 实现模板下载**

使用 `XLSX.utils.aoa_to_sheet` 和 `XLSX.writeFile` 下载 `设备导入模板.xlsx`，包含表头和一行合法示例。

- [ ] **Step 4: 实现导出**

将当前 `filteredDevices` 映射为中文表头数据，生成 `设备管理.xlsx`。

- [ ] **Step 5: 实现导入抽屉**

抽屉内提供文件选择和拖拽区、已选文件名、下载模板按钮、取消与确认导入按钮，仅接收 `.xlsx`、`.xls`。

- [ ] **Step 6: 校验并写入 Mock 列表**

读取第一个工作表，检查必填表头；逐行校验必填值，是否智能化为“否”时允许物模型为空。有效数据转换为设备对象并写入列表，无效行计入失败数，完成后提示成功和失败数量。

- [ ] **Step 7: 实现依赖错误提示**

SheetJS 未加载或文件解析失败时使用系统确认弹窗显示明确原因，不修改现有列表。

### Task 6: 回归与视觉验证

**Files:**
- Verify: `web/pages/device/list.html`
- Verify: `web/pages/device/category.html`
- Verify: `app/data/device-categories.js`

- [ ] **Step 1: 静态检查**

运行内联 JavaScript 解析、共享数据执行、必填字段搜索和乱码扫描，预期全部通过。

- [ ] **Step 2: 交互检查**

检查系统树、分类联动、房源级联、智能化显隐、点位回填、二维码按钮状态、二维码弹窗、单选下载、多选 ZIP、模板下载、导入和导出。

- [ ] **Step 3: 视觉检查**

在桌面视口打开页面，确认抽屉和居中弹窗无重叠，平面图完整可见，表单字段和按钮符合用户管理页面样式。

- [ ] **Step 4: 最终乱码检查**

对所有本次修改文件搜索 `�|锟|Ã|Â`，预期无匹配结果。
