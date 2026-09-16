# 人行通行记录楼栋文案调整 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将人行通行记录中的指定楼层和位置文案改为“1号楼”。

**Architecture:** 只修改页面 `records` Mock 数组，不改渲染、筛选或其他页面。

**Tech Stack:** 原生 HTML、JavaScript。

---

### Task 1: 定向替换并验证

**Files:**
- Modify: `web/pages/monitoring/pedestrian-record.html`

- [ ] 将设备名称里的 `34F`、`33F` 前缀替换为“1号楼”，保留 `-MK-18` 等设备编码后缀。
- [ ] 将通行位置值 `3418`、`3302` 替换为“1号楼”。
- [ ] 提取最后一个内联脚本执行 `node --check`，并确认本页面不再包含四个旧文案。
