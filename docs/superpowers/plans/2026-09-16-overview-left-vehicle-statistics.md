# 总览左栏与车辆统计实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在总览页左栏固定展示建筑概况、荣誉展示、人员统计和车辆统计，并让建筑概况仅显示四行后滚动。

**Architecture:** 复用 `overview.html` 已有左栏模块与停车统计视觉组件。删除三块旧停车卡片，新增一个车辆统计面板；使用总览专用 CSS 覆盖左栏网格行高和建筑概况滚动高度。

**Tech Stack:** HTML、CSS、现有 Font Awesome 图标。

### Task 1: 更新总览左栏结构

**Files:** `Big Screen/overview.html`

- [ ] 保留建筑概况、荣誉展示、人员统计模块。
- [ ] 删除旧停车概览、AGV车位、机械车位三个独立模块。
- [ ] 在左栏底部新增 `vehicle-panel`，包含剩余车位汇总、B1/B2 两行和普通车位三项数据。

### Task 2: 调整总览左栏布局样式

**Files:** `Big Screen/styles.css`

- [ ] 将总览默认左栏网格改为四行布局。
- [ ] 让建筑概况内容区固定四行高度并保留纵向滚动。
- [ ] 为车辆统计面板增加紧凑统计卡、楼层进度条和底部三列指标样式。
- [ ] 确保只有建筑概况内部滚动，左栏和其他模块不滚动。

### Task 3: 静态验证

- [ ] 运行 `git diff --check -- "Big Screen/overview.html" "Big Screen/styles.css"`。
- [ ] 检查旧停车模块文案不再出现在总览左栏，B1/B2 和车辆统计新字段存在。
