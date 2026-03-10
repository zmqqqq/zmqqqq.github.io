---
title: 6 神经网络-搭建小实战和Sequential的使用
draft: false
tags:
  - "#神经网络"
date: 2026-03-10
---
## 1 Sequential

`nn.Sequential` 是 PyTorch 里用来 **按顺序把多个网络层“串起来”组成一个网络模块** 的工具。Sequential 可以把多层网络按顺序组合起来，自动按顺序执行 forward。

![[Pasted image 20260310193116.png|297]]

![[Pasted image 20260310193133.png|318]]

![[Pasted image 20260310193417.png|676]]

## 2 针对 CIFAR-10 数据集的传统卷积神经网络

对CIFAR-10分类的简单神经网络，根据图片的内容识别到底属于哪一类。CIFAR-10就代表是10个类别。

![[Pasted image 20260310193654.png]]

### 2.1 数据的基本属性

- 数据规模：共 60000 张 32×32 彩色图片（RGB 3 通道），分为训练集 50000 张、测试集 10000 张；
- 类别：10 个互斥的常见类别，分别是：飞机（airplane）、汽车（automobile）、鸟（bird）、猫（cat）、鹿（deer）、狗（dog）、青蛙（frog）、马（horse）、船（ship）、卡车（truck）；
- 数据特点：分辨率极低（32×32）、背景噪声大、类内差异大（如不同角度的猫），纯 MLP 效果差，需用CNN 提取空间特征。

![[Pasted image 20260310194031.png]]

- 卷积提取特征 + 池化降维 + 全连接分类
- 最大池化不改变通道数，卷积改变通道数
- padding和stride需要手动计算

我们现在按照上图去实现代码，第一层卷积in_channels=3，out_channels=32, kernel_size=5（上图都能找到），但是==padding==和==stride==没有，==如何计算？==

![[Pasted image 20260310194533.png]]

![[Pasted image 20260310194945.png]]

解得padding=2，stride=1。

![[Pasted image 20260310200226.png]]

### 2.2 未使用Sequential

```python
import torch  
from torch import nn  
from torch.nn import Conv2d,MaxPool2d,Flatten,Linear  
  
class Tudui(nn.Module):  
    def __init__(self):  
        super(Tudui, self).__init__()  
        self.conv1 = Conv2d(in_channels=3, out_channels=32, kernel_size=5, stride=1, padding=2)  
        self.maxpool1 = MaxPool2d(kernel_size=2)  
        self.conv2 = Conv2d(in_channels=32, out_channels=32, kernel_size=5, stride=1, padding=2)  
        self.maxpool2 = MaxPool2d(kernel_size=2)  
        self.conv3 = Conv2d(in_channels=32, out_channels=64, kernel_size=5, stride=1, padding=2)  
        self.maxpool3 = MaxPool2d(kernel_size=2)  
        self.flatten = Flatten()  
        self.linear1 = Linear(in_features=1024, out_features=64)  
        self.linear2 = Linear(in_features=64, out_features=10)  
  
    def forward(self, x):  
        x = self.conv1(x)  
        x = self.maxpool1(x)  
        x = self.conv2(x)  
        x = self.maxpool2(x)  
        x = self.conv3(x)  
        x = self.maxpool3(x)  
        x = self.flatten(x)  
        x = self.linear1(x)  
        x = self.linear2(x)  
        return x  
  
tudui = Tudui()  
print(tudui)  
```

![[Pasted image 20260310200615.png]]

那么在实际情况中，我们该如何验证网络的正确性呢？经过这个网络之后，到底能不能产生一个新的输出是我们要更关心的。

输入是64张图片，每张图片有三个通道并且尺寸是32×32：

```python
input = torch.ones((64, 3, 32, 32))
output = tudui(input)
print(output.shape)
```

![[Pasted image 20260310201317.png]]

### 2.3 使用Sequential并使用tensorboard添加计算图

```python
import torch  
from torch import nn  
from torch.nn import Conv2d,MaxPool2d,Flatten,Linear,Sequential  
from torch.utils.tensorboard import SummaryWriter  
  
class Tudui(nn.Module):  
    def __init__(self):  
        super(Tudui, self).__init__()  
        self.model1 = Sequential(  
            Conv2d(in_channels=3, out_channels=32, kernel_size=5, stride=1, padding=2),  
            MaxPool2d(kernel_size=2),  
            Conv2d(in_channels=32, out_channels=32, kernel_size=5, stride=1, padding=2),  
            MaxPool2d(kernel_size=2),  
            Conv2d(in_channels=32, out_channels=64, kernel_size=5, stride=1, padding=2),  
            MaxPool2d(kernel_size=2),  
            Flatten(),  
            Linear(in_features=1024, out_features=64),  
            Linear(in_features=64, out_features=10)  
        )  
  
    def forward(self, x):  
        x = self.model1(x)  
        return x  
  
tudui = Tudui()  
print("打印这个网络",tudui)  
input = torch.ones((64, 3, 32, 32))  
output = tudui(input)  
print(output.shape)  
  
writer = SummaryWriter("../logs_seq")  
writer.add_graph(tudui, input)  # 把神经网络的计算图写入 TensorBoard，用于可视化网络结构。  
writer.close()
```

![[Pasted image 20260310202614.png]]

