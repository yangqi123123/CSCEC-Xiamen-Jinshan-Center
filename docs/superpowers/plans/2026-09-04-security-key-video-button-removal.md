# 关键区域监控按钮移除 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从弱电大屏的“关键区域监控”面板移除“查看系统图”按钮，同时保留“全局监控”和其他模块的系统图入口。

**Architecture:** 继续使用现有单文件 HTML 结构，仅删除 `.security-key-video-panel` 操作区中的 `security-system-diagram-trigger` 按钮节点。不调整 CSS、弹窗或通用事件逻辑，因为其他模块仍可能使用该类名和系统图入口。

**Tech Stack:** 静态 HTML，PowerShell，ripgrep。

---

### Task 1: 移除关键区域监控中的系统图按钮并验证

**Files:**
- Modify: `Big Screen/weak-electric.html:231`，仅修改“关键区域监控”面板操作区。
- Test: 使用 `rg` 检查目标面板和其他系统图按钮。

- [x] **Step 1: 修改目标操作区**

将目标面板的操作区从：

```html
<div class="security-actions"><button class="global-monitor-trigger" type="button">全局监控</button><button class="security-system-diagram-trigger" type="button">查看系统图</button></div>
```

改为：

```html
<div class="security-actions"><button class="global-monitor-trigger" type="button">全局监控</button></div>
```

- [x] **Step 2: 验证目标按钮已移除且其他入口保留**

运行：

```powershell
rg -n -C 1 '关键区域监控|security-system-diagram-trigger|查看系统图' 'Big Screen/weak-electric.html'
```

预期：目标面板只包含 `global-monitor-trigger`；道闸系统、门禁系统等其他模块的“查看系统图”仍存在。

- [x] **Step 3: 检查修改范围与文本完整性**

运行：

```powershell
git diff -- 'Big Screen/weak-electric.html' 'docs/superpowers/specs/2026-09-04-security-key-video-button-removal-design.md' 'docs/superpowers/plans/2026-09-04-security-key-video-button-removal.md'
```

预期：若当前目录仍非有效 Git 仓库，命令明确报告该环境限制；使用 `rg` 结果确认没有乱码替换字符，且没有修改 CSS、弹窗或其他面板。
