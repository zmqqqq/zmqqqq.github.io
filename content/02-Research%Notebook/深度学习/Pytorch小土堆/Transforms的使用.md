---
title: 2 Transforms的使用
draft: false
tags:
  - "#Transforms"
---
**Transforms 是 PyTorch 中 `torchvision` 提供的图像预处理与数据增强工具集**，  
核心作用是：**把原始数据转换为模型可用、且更利于学习的形式**。

Transform：是数据的“预处理和增强工厂”，工作在模型训练之前。

- 格式转换（PIL Image → Tensor、HWC → CHW）
- 数值标准化（像素缩放、Normalize）
- 数据增强（随机裁剪、翻转、旋转等）
- 尺寸处理（Resize、Crop）

目标：将杂乱的原始数据，转换为干净、规整、适合模型训练的张量。

## 1 Torchvision中的Transforms

### 1.1 Transforms的结构和用法

用于对图像进行预处理和数据增强操作，如调整图像大小、中心裁剪、随机裁剪、随机水平翻转、归一化、将 PIL 图像转换为 Tensor 等等。

如果要看Transforms的解释和用途说明，就要点两次这个单词

![[Pasted image 20260207164753.png]]

![[Pasted image 20260207164804.png]]

最后才能到 transforms.py




