# 项目管理 Mock 数据调整 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 移除项目管理列表中的福州项目数据，并将楼栋列表补充为厦门金山财富中心1号楼至4号楼。

**Architecture:** 只修改三个独立 HTML 页面中的静态 Mock 数组；楼栋页同步维护 `buildingRelations`，不改页面结构、样式和交互函数。

**Tech Stack:** 原生 HTML、JavaScript Mock 数据。

---

### Task 1: 调整楼栋数据

**Files:**
- Modify: `web/pages/project/building.html`

- [ ] 删除 `buildings` 数组中的福州项目 A座对象。
- [ ] 新增 id 为3、4的厦门金山财富中心3号楼、4号楼对象，编码分别为 `JS-03`、`JS-04`，补齐所有现有字段。
- [ ] 将 `buildingRelations` 的 id 3、4设为 `{floors:0,houses:0}`。

### Task 2: 删除楼层与房源数据

**Files:**
- Modify: `web/pages/project/floor.html`
- Modify: `web/pages/project/house.html`

- [ ] 删除 `floors` 数组中 id 4的福州滨海新城项目记录。
- [ ] 删除 `houses` 数组中 id 3的福州滨海新城项目记录。

### Task 3: 验证

**Files:**
- Test: `web/pages/project/building.html`
- Test: `web/pages/project/floor.html`
- Test: `web/pages/project/house.html`

- [ ] 提取三个页面最后一个内联脚本并执行 `node --check`，预期全部退出码为0。
- [ ] 搜索三个 Mock 数组，确认楼栋4条、楼层3条、房源2条，且列表数据不再包含福州滨海新城项目。
- [ ] 执行 `git diff --check`，预期无空白错误；搜索乱码字符，预期无匹配。
