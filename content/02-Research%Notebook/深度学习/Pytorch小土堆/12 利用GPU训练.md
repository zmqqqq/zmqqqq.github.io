---
title: 12 利用GPU训练
draft: false
tags:
  - example-tag
date: 2026-03-13
---
## 1 使用GPU进行训练方式1 xx = xx.cuda()

我们只要找到这三种变量（==网络模型、数据、损失函数==），然后.cuda()，返回就可以了。

训练数据和测试数据都要.cuda()

![[Pasted image 20260313144408.png|425]]

![[Pasted image 20260313144805.png]]

![[Pasted image 20260313144810.png]]

![[Pasted image 20260313144827.png]]

![[Pasted image 20260313144836.png]]

==时间的显示：==

![[Pasted image 20260313145050.png|455]]

![[Pasted image 20260313145109.png|462]]

![[Pasted image 20260313145115.png]]

没有GPU的情况：

![[Pasted image 20260313145332.png|302]]

有GPU的情况：

![[Pasted image 20260313145345.png]]

## 2 使用GPU进行训练方式2（更常用） xx = xx.to(device)

如果你的电脑上有一个显卡的话，就是torch.device("cuda:0")

如果你的电脑上有多张显卡，那么就可以指定torch.device("cuda:1")

![[Pasted image 20260313145434.png|314]]

![[Pasted image 20260313161726.png|598]]

![[Pasted image 20260313161733.png|578]]

![[Pasted image 20260313161831.png]]

![[Pasted image 20260313161835.png]]

```python
import torch  
import torchvision  
from torch.utils.tensorboard import SummaryWriter  
import time  
# from model import *  
from torch import nn  
from torch.utils.data import DataLoader  
  
device = torch.device("cuda:0")  
  
# 准备数据集  
train_data = torchvision.datasets.CIFAR10(root="../data",train=True,transform=torchvision.transforms.ToTensor(),download=True)  
test_data = torchvision.datasets.CIFAR10(root="../data",train=False,transform=torchvision.transforms.ToTensor(),download=True)  
  
# length 长度  
train_data_size = len(train_data)  
test_data_size = len(test_data)  
print("训练数据集的长度为:{}".format(train_data_size))  
print("测试数据集的长度为:{}".format(test_data_size))  
  
# 利用 DataLoader 来加载数据集  
train_dataloader = DataLoader(train_data,batch_size=64)  
test_dataloader = DataLoader(test_data,batch_size=64)  
  
# 创建网络模型  
class Tudui(nn.Module):  
    def __init__(self):  
        super(Tudui,self).__init__()  
        self.model = nn.Sequential(  
            # 这里的padding官网上有计算公式，前面的笔记也提到了，忘了就往前看吧  
            nn.Conv2d(in_channels=3,out_channels=32,kernel_size=5,stride=1,padding=2),  
            nn.MaxPool2d(kernel_size=2),  
            nn.Conv2d(in_channels=32,out_channels=32,kernel_size=5,stride=1,padding=2),  
            nn.MaxPool2d(kernel_size=2),  
            nn.Conv2d(in_channels=32,out_channels=64,kernel_size=5,stride=1,padding=2),  
            nn.MaxPool2d(kernel_size=2),  
            nn.Flatten(),  
            nn.Linear(in_features=64*4*4,out_features=64),  
            nn.Linear(in_features=64,out_features=10),  
        )  
  
    def forward(self,x):  
        x = self.model(x)  
        return x  
tudui = Tudui()  
tudui = tudui.to(device)  
  
  
# 损失函数  
loss_fn = nn.CrossEntropyLoss()  
loss_fn = loss_fn.to(device)  
  
# 优化器  
learning_rate = 0.01  
optimizer = torch.optim.SGD(tudui.parameters(),lr=learning_rate)  
  
# 设置训练网络的一些参数  
# 记录训练的次数  
total_train_step = 0  
# 记录测试的次数  
total_test_step = 0  
# 训练的轮数  
epoch = 10  
  
# 添加tensorboard  
writer = SummaryWriter("../logs_train")  
start_time = time.time()  
  
for i in range(epoch):  
    print("----------第 {} 轮训练开始----------".format(i+1))  
  
    # 训练步骤开始  
    tudui.train()  
    for data in train_dataloader:  
        imgs, targets = data  
        imgs = imgs.to(device)  
        targets = targets.to(device)  
        outputs = tudui(imgs)  
        loss = loss_fn(outputs, targets)  
        # 优化器优化模型  
        optimizer.zero_grad()  
        loss.backward()  
        optimizer.step()  
  
        total_train_step += 1  
        if total_train_step % 100 == 0:  
            end_time = time.time()  
            print(end_time-start_time)  
            print("训练次数: {}, Loss: {}".format(total_train_step,loss.item()))  
            writer.add_scalar("train_loss",loss.item(),total_train_step)  
  
    # 测试步骤开始  
    tudui.eval()  
    total_test_loss = 0  
    total_accuracy = 0  
    with torch.no_grad():  
        for data in test_dataloader:  
            imgs, targets = data  
            imgs = imgs.to(device)  
            targets = targets.to(device)  
            outputs = tudui(imgs)  
            loss = loss_fn(outputs, targets)  
            total_test_loss += loss.item()  
            accuracy = (outputs.argmax(1) == targets).sum()  
            total_accuracy += accuracy.item()  
  
    print("整体测试集上的Loss: {}".format(total_test_loss))  
    print("整体测试集上的正确率: {}".format(total_accuracy/test_data_size))  
    writer.add_scalar("test_loss",total_test_loss,total_test_step)  
    writer.add_scalar("test_accuracy",total_accuracy/test_data_size,total_test_step)  
    total_test_step += 1  
  
    torch.save(tudui, "tudui_{}.pth".format(i))  
    print("模型已保存")  
  
writer.close()
```

==更便捷的写法：==

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```