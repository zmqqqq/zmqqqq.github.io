---
title: 1 神经网络的基本骨架-nn.Module的使用
draft: false
tags:
  - "#神经网络"
date: 2026-02-24
---
这里的 **`nn` 就是 `neural network`（神经网络）** 的缩写。

![[Pasted image 20260224145347.png]]

如果把构建神经网络比作搭积木， torch.nn 就是提供各种标准积木块的"工具箱"。

而在 PyTorch 中，==任何自定义的神经网络层或整个模型都必须继承自 nn.Module== 。

基本骨架结构：

```python
import torch.nn as nn

class MyNetwork(nn.Module):  # 1. 必须继承 nn.Module
    def __init__(self):
        super().__init__()  # 2. 必须调用父类构造函数
        # 3. 在这里定义网络层
        self.layer1 = nn.Linear(10, 5)
        self.layer2 = nn.ReLU()

    def forward(self, x):  # 4. 必须实现 forward 方法
        # 5. 定义数据如何流过网络
        x = self.layer1(x)
        x = self.layer2(x)
        return x
```

简单示例：

```python
import torch  
from torch import nn  
  
class MyNetwork(nn.Module):  
    def __init__(self):  
        super().__init__()  
  
    def forward(self, input):  
        output = input + 1  
        return output  
  
# 创建神经网络  
my_network = MyNetwork()  
x = torch.tensor(1.0)  
output = my_network(x)  
print(output) # tensor(2.)
```

