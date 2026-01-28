---
title: Quartz日常工作流
tags:
  - 工具箱
---

## 本地预览

```powershell
npx quartz build --serve
```

## 同步

```powershell
npx quartz sync
```
有时候会遇到网络卡顿，或者你手动中断（Ctrl + C），可能会出现 **工作区文件“看起来被删了”** 的情况。  
别慌！一般都能恢复回来 🙌

## 检查当前状态

```powershell
git status
```
如果你看到类似：
- `deleted: content/index.md`
- `deleted: content/关于我.md`
说明只是工作区临时变动，还没提交。
建议在同步前也检查一次**status**
## 一键恢复 content（救命命令）

```powershell
git restore content
```
执行后再跑一次 `git status`，通常就会回到干净状态 ✅
## 上传到 GitHub（让网站更新）

```powershell
git push
```