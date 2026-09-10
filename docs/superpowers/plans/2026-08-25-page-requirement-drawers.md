# 页面需求说明抽屉 Implementation Plan

> **For agentic workers:** Execute in this workspace because the repository metadata is not a valid Git worktree.

**Goal:** 为 13 个业务页面提供独立、完整且与页面实际控件一致的需求说明抽屉。

**Architecture:** 由 `requirement.js` 集中维护按菜单键索引的文档，统一渲染八项章节及字段表；页面内旧 JSON 不再优先，缺少公共组件引用的页面补充引用。

**Tech Stack:** HTML5, JavaScript, CSS.

---

### Task 1: 建立集中页面文档

**Files:**
- Modify: `C:\Users\10208\Desktop\产品基座\app\components\requirement.js`

- [ ] 为工作台、设备、个人中心及九个系统配置页逐一建立文档。
- [ ] 每份文档输出八个固定章节，并覆盖筛选区、列表与抽屉组件字段。
- [ ] 删除所有需求说明中的模拟数据表述，改为业务模块的数据来源关系。

### Task 2: 接入缺失页面

**Files:**
- Modify: `C:\Users\10208\Desktop\产品基座\web\pages\system\parameter.html`
- Modify: `C:\Users\10208\Desktop\产品基座\web\pages\system\notice.html`
- Modify: `C:\Users\10208\Desktop\产品基座\web\pages\system\operation-log.html`
- Modify: `C:\Users\10208\Desktop\产品基座\web\pages\system\login-log.html`

- [ ] 在各页加载公共需求说明组件。

### Task 3: 验证

**Files:**
- Verify: `C:\Users\10208\Desktop\产品基座\app\components\requirement.js`

- [ ] 用 Node 校验脚本语法。
- [ ] 验证 13 个页面键均有集中配置，且每份均含八个章节与字段表。
- [ ] 扫描需求文案，禁止出现 `mock`、`模拟数据`、`mock-data.js`。
