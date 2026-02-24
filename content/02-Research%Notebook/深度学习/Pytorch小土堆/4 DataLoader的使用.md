---
title: 4 DataLoader的使用
draft: false
tags:
  - "#DataLoader"
date: 2026-02-24
---
## 1 Dataset 和 DataLoader 区别

### Dataset

- 负责“单个数据”的读取，定义数据集的结构，实现：
	- `__len__()`：返回数据总数量
	- `__getitem__(index)`：根据索引返回一条数据（img，target）

它只解决“数据怎么取”的问题。

### DataLoader

- 基于 Dataset，自动完成：
	- 批量拼接（batch）
	- 数据打乱（shuffle）
	- 多线程加载（num_workers）
	- 内存加速（pin_memory）

最终输出按 batch 组织好的 Tensor 数据，用于模型训练。

## 2 Dataloader的参数设置

```python
class torch.utils.data.DataLoader(dataset, batch_size=1, shuffle=None, num_workers=0,drop_last=False)
```

- 参数
	- dataset (Dataset) - 用于加载数据的数据集。
	- batch_size (int, 可选) - 每个批次加载的样本数量（默认值：1）。
	- shuffle (bool, 可选) - 设置为 True 时，在每个周期（epoch）都会重新打乱数据（默认值：False）。
		- ① shuffle=False(顺序一致)
		- ② shuffle=True（顺序打乱）
	- num_workers (int, 可选) - 用于数据加载的子进程数量。 0 表示数据将在主进程中加载（默认值： 0 ）。
	- drop_last (bool, 可选) - 如果设置为 True，当数据集大小不能被批次大小整除时，将丢弃最后一个不完整的批次。如果为 False 并且数据集大小不能被批次大小整除，则最后一个批次将会更小（默认值：False）

![[Pasted image 20260224143135.png]]

![[Pasted image 20260224141902.png]]

![[Pasted image 20260224142257.png]]

```python
import torchvision  
from torch.utils.data import DataLoader  
from torch.utils.tensorboard import SummaryWriter  
  
from test_tb import writer  
  
# 准备的测试数据集  
test_data = torchvision.datasets.CIFAR10(root="./dataset", train=False, transform=torchvision.transforms.ToTensor())  
  
test_loader = DataLoader(test_data, batch_size=64, shuffle=True, num_workers=0, drop_last=False)  
  
# 测试数据集中第一张图片及target  
img,target = test_data[0]  
print(img.shape) # torch.Size([3, 32, 32])  
print(target) # 3  
  
writer = SummaryWriter(log_dir="dataloader")  
step = 0  
for data in test_loader:  
    imgs,targets = data  
    # print(imgs.shape)  
    # print(targets)    writer.add_images("test_dataset",imgs,step)  
    step += 1  
  
writer.close()
```

打开终端打开tensorboard：tensorboard --logdir=`dataloader`,一个batch对应着64张图：

![[Pasted image 20260224142838.png]]

## 3__getitem__() 函数

它定义了 “如何通过索引（或键）从你的对象中获取一个数据”。返回图片和标签。

![[Pasted image 20260224143356.png]]

## 4 add_image() 与add_images() 的区别

![[Pasted image 20260224143507.png]]

