---
title: Quartz日常工作流
tags:
  - 工具箱
  - "#Quartz"
date: 2026-01-28
---

## 本地预览

```powershell
npx quartz build --serve
```

## 检查当前状态

```powershell
git status
```
如果你看到类似：
- `deleted: content/index.md`
- `deleted: content/关于我.md`
说明只是工作区临时变动，还没提交。

## 添加所有修改（加入暂存区）

```powershell
git add .
```

## 提交（commit）

```powershell
git commit -m "update quartz content"
```

## 上传到 GitHub（让网站更新）

```powershell
git push
```

## 一些提示框


> [!NOTE]+ 默认展开
> 这是note

> [!NOTE]- 默认折叠
> 这是note

> [!example]- example
> 这是example

> [!tips]- tips
> 这是tips提示

> [!warning]- warning
> 这是warning

> [!abstract]- abstract
> 这是abstract摘要

> [!info]- info
> 这是info信息

> [!cite]- cite
> 这是cite引用










