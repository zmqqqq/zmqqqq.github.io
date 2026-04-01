---
title: Jupyter notebook
tags:
  - 工具箱
  - "#机器学习"
  - "#Jupyter"
date: 2026-01-28
---
[Jupyter notebook快速入门](https://www.bilibili.com/video/BV1Q4411H7fJ?vd_source=bfdcd6041c71311c083523ea4bcbb589)

# 安装Jupyter notebook

如果安装了Anaconda，其中自带Jupyter notebook。

如果没有，则在命令行中输入：

```powershell
pip install jupyter
```

# 运行Jupyter notebook

打开命令行，输入`jupyter notebook`，回车。稍等片刻即可跳出浏览器网页。

![[Pasted image 20260128194023.png]]

![[Pasted image 20260128194241.png]]

`shift+回车` 运行该行代码块：

![[Pasted image 20260128194534.png]]

在下面的红色处点击**M键**，该块变成markdown单元格：（**Y键**是变成代码单元格）

![[Pasted image 20260128194925.png]]
![[Pasted image 20260128194956.png]]

![[Pasted image 20260128195046.png]]

![[Pasted image 20260128195115.png]]

选中一个代码块，点击**B键**，在该代码块下一行创建代码块（below）；**A**是above，在上方创建代码块；**D**是delete，删除当前代码块；**C**=ctrl c；**V**=ctrl v；

公式$E=mc^2$ --一对美元符号包裹代表是该行内联公式；两对则说明是单行公式:

$$E=mc^2$$

（笔记记到这里啦，劝自己，最好学习一下**LaTex**）

# tips
一个很好的比喻，关于`训练集` as 平常学习，`验证集` as 模拟考试，`测试集` as 高考。我们需要通过平常的学习和模拟考试训练一个好的模型，这样才能在高考中取得好成绩。

注意，训练集和测试集不能混淆，并且还需在同一个分布。

传统的机器学习里，一般建议训练集:测试集=4:1。




