---
title: 3 torchvision中数据集使用
draft: false
tags:
  - "#torchvision"
---
torchvision 是 PyTorch 官方提供的计算机视觉专用库，它提供了流行的数据集、预训练模型和图像处理工具，极大地简化了计算机视觉任务的开发流程。

- torchvision.datasets ：包含大量常用的视觉数据集（如 CIFAR10, ImageNet, COCO 等），可以轻松下载和使用。
- torchvision.models ：提供了预训练的经典模型（如 ResNet, VGG, AlexNet 等），方便进行迁移学习或模型比较。
- torchvision.transforms ：包含了一系列常用的图像预处理和数据增强方法（如裁剪、翻转、归一化等），用于构建数据管道。

==没有学小土堆之前，一直以为数据集都是网上自己下载的，比如再kaggle以及github等网页上下载的。但是没想到pytorch里面有自带的数据集，下载着也是很方便的。==

![[Pasted image 20260223215300.png]]

![[Pasted image 20260223215326.png]]

仅用几行代码就可以下载数据集：

```python
import torchvision

# 创建CIFAR10训练数据集实例
train_set = torchvision.datasets.CIFAR10(root='./dataset',train=True,download=True)

# 创建CIFAR10测试数据集实例
test_set = torchvision.datasets.CIFAR10(root='./dataset',train=False,download=True)
```

几种常用的数据集：

==【CIFAR-10】== 是一个用于通用物体识别的小型图像数据集。它包含了 60,000 张 32x32 像素的彩色图像，这些图像被分为 10 个不同的类别。

==【COCO数据集】==是一个大规模、功能丰富的物体检测、分割和字幕生成数据集，以其复杂的日常场景和精细的像素级标注而闻名，已成为评估计算机视觉模型性能的行业基准。

==【MNIST 数据集】==深度学习的“教科书”式入门数据集，内容是手写数字识别（最常见的数据集）。

![[Pasted image 20260223215532.png]]

![[Pasted image 20260223220441.png]]

![[Pasted image 20260223221907.png]]

完整代码：

```python
import torchvision  
from torch.utils.tensorboard import SummaryWriter  
  
dataset_transform = torchvision.transforms.Compose([  
    torchvision.transforms.ToTensor()  
])  
  
# 创建CIFAR10训练数据集实例  
train_set = torchvision.datasets.CIFAR10(root='./dataset',train=True,transform=dataset_transform,download=True)  
# 创建CIFAR10测试数据集实例  
test_set = torchvision.datasets.CIFAR10(root='./dataset',train=False,transform=dataset_transform,download=True)  
  
print(train_set[0])  
  
writer = SummaryWriter("P10")  
for i in range(10):  
    img, target = train_set[i]  
    writer.add_image("test_set", img, i)  
  
writer.close()
```

![[Pasted image 20260223222439.png]]

