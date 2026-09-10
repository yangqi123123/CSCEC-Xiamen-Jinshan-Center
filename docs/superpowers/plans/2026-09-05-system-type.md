# 系统类型 Implementation Plan

**Goal:** 在新增的“配置中心”一级菜单下提供树状“系统类型”管理原型。

**Architecture:** 扩展共享菜单配置，新增独立的 `web/pages/config/system-type.html` 页面。页面复用现有 TOB 样式、侧栏、顶部栏、抽屉和确认弹窗组件，使用 Mock 树数据实现展开、筛选、新增、编辑和删除交互。

**Tech Stack:** 原生 HTML、CSS、JavaScript、现有 `tob-ui.css` 与 `app/components` 组件。

---

### Task 1: 扩展配置中心菜单

**Files:**
- Modify: `app/config/menu.js`

- [ ] 在顶层菜单中新增 `config` 一级菜单，设置名称为“配置中心”，并添加 `config.system-type` 二级菜单，链接到 `../config/system-type.html`。
- [ ] 保留已有菜单及其顺序，执行 JavaScript 语法检查，并确认新菜单层级正确。

### Task 2: 创建系统类型管理页面

**Files:**
- Create: `web/pages/config/system-type.html`

- [ ] 按“菜单管理”页面结构创建独立 HTML，加载共享侧栏、顶部栏、抽屉和确认弹窗组件。
- [ ] 使用 Mock 数据展示“机电系统”和“弱电系统”两级树，以及用户指定的全部子系统。
- [ ] 实现树节点展开/收起、关键词筛选和操作列的编辑、新增、删除按钮。
- [ ] 新增和编辑抽屉包含系统名称、系统编号、显示排序、系统简介，四项均在保存时校验必填。
- [ ] 删除存在子级的节点时显示“当前系统下存在子级，不允许删除。”；叶子节点删除前显示确认弹窗。
- [ ] 检查页面无乱码、引用路径正确，完成静态脚本检查。

### Task 3: 验证

**Files:**
- Verify: `app/config/menu.js`
- Verify: `web/pages/config/system-type.html`

- [ ] 使用 Node.js 检查两个内联脚本的语法。
- [ ] 通过文本检查确认 `config.system-type` 只出现一次、页面保留所有必填字段和删除提示文案。
- [ ] 检查新增文件与修改文件没有替换字符或乱码。
