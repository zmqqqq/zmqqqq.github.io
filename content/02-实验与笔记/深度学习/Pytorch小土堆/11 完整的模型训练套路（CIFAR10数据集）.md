
## 1 format格式化输出字符串

print函数的format是一种格式化输出字符串的方法，用来插入变量值或格式化输出字符串的样式，将{}的地方替换为变量值。

```python
name = "mqqq"
age = 18
print("My name is {} and I am {} years old.".format(name, age))
```

## 2 搭建后面要用的神经网络

![[Pasted image 20260313101059.png]]

model.py：

```python
import torch  
from torch import nn  
  
# 搭建神经网络  
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
  
if __name__ == '__main__':  
    tudui = Tudui()  
    input = torch.ones((64,3,32,32))  
    output = tudui(input)  
    print(output.shape)
```

构造输入，测试网络搭建是否正确：

![[Pasted image 20260313101723.png]]

## 3 item()函数

item()函数用于从只包含单个元素的张量中提取Python数值，将张量转换为标量值

```python
import torch

# 创建一个只包含一个元素的张量
tensor = torch.tensor([3.14])

# 使用item()函数获取张量的数值
value = tensor.item()

print("Value extracted using item():", value)
print("Type of extracted value:", type(value))
```

![[Pasted image 20260313103313.png|384]]

训练代码初具雏形：

```python
import torchvision  
from model import *  
from torch import nn  
from torch.utils.data import DataLoader  
  
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
tudui = Tudui()  
  
# 损失函数  
loss_fn = nn.CrossEntropyLoss()  
  
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
  
for i in range(epoch):  
    print("----------第 {} 轮训练开始----------".format(i+1))  
  
    # 训练步骤开始  
    for data in train_dataloader:  
        imgs, targets = data  
        outputs = tudui(imgs)  
        loss = loss_fn(outputs, targets)  
        # 优化器优化模型  
        optimizer.zero_grad()  
        loss.backward()  
        optimizer.step()  
  
        total_train_step += 1  
        print("训练次数: {}, Loss: {}".format(total_train_step,loss.item()))
```

![[Pasted image 20260313103414.png]]

## 4 torch.no_grad()

在推理或评估模型时使用 torch.no_grad() ，表明当前计算不需要反向传播，使用之后，强制后边的内容不进行计算图的构建。

with 语句是 Python 中的一个语法结构，用于包裹代码块的执行，并确保在代码块执行完毕后，能够自动执行一些清理工作。

一句话，torch.no_grad()用于在推理或评估模型时关闭梯度计算，避免构建计算图，从而减少内存占用并提高运行速度。

## 5 完整的模型训练与测试套路

![[Pasted image 20260313105435.png|652]]

```python
import torchvision  
from torch.utils.tensorboard import SummaryWriter  
from model import *  
from torch import nn  
from torch.utils.data import DataLoader  
  
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
tudui = Tudui()  
  
# 损失函数  
loss_fn = nn.CrossEntropyLoss()  
  
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
  
for i in range(epoch):  
    print("----------第 {} 轮训练开始----------".format(i+1))  
  
    # 训练步骤开始  
    for data in train_dataloader:  
        imgs, targets = data  
        outputs = tudui(imgs)  
        loss = loss_fn(outputs, targets)  
        # 优化器优化模型  
        optimizer.zero_grad()  
        loss.backward()  
        optimizer.step()  
  
        total_train_step += 1  
        if total_train_step % 100 == 0:  
            print("训练次数: {}, Loss: {}".format(total_train_step,loss.item()))  
            writer.add_scalar("train_loss",loss.item(),total_train_step)  
  
    # 测试步骤开始  
    total_test_loss = 0  
    with torch.no_grad():  
        for data in test_dataloader:  
            imgs, targets = data  
            outputs = tudui(imgs)  
            loss = loss_fn(outputs, targets)  
            total_test_loss += loss.item()  
    print("整体测试集上的Loss: {}".format(total_test_loss))  
    writer.add_scalar("test_loss",total_test_loss,total_test_step)  
    total_test_step += 1  
  
    torch.save(tudui, "tudui_{}.pth".format(i))  
    print("模型已保存")  
  
writer.close()
```

![[Pasted image 20260313134527.png]]
## 6 分类问题计算正确率的方法

![[Pasted image 20260313134926.png|217]]

==argmax 是一个数学和编程中常用的术语，它表示找到一个函数或数组中最大值的索引或位置。==

在 PyTorch 中， torch.argmax 是一个函数，用于返回输入张量（Tensor）中最大值的索引。

`outputs.argmax(1)`——每一行找最大值的位置；

`outputs.argmax(0)`——每一列找最大值的位置。

```python
import torch
outputs = torch.tensor([[0.1, 0.2],
						[0.3, 0.4]])
print(outputs.argmax(1))

preds = outputs.argmax(1)
targets = torch.tensor([0,1])

print(preds == targets)
print((preds == targets).sum())
```

![[Pasted image 20260313135648.png]]

## 7 补充正确率代码

```python
import torchvision  
from torch.utils.tensorboard import SummaryWriter  
  
from model import *  
from torch import nn  
from torch.utils.data import DataLoader  
  
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
tudui = Tudui()  
  
# 损失函数  
loss_fn = nn.CrossEntropyLoss()  
  
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
  
for i in range(epoch):  
    print("----------第 {} 轮训练开始----------".format(i+1))  
  
    # 训练步骤开始
    tudui.train()  
    for data in train_dataloader:  
        imgs, targets = data  
        outputs = tudui(imgs)  
        loss = loss_fn(outputs, targets)  
        # 优化器优化模型  
        optimizer.zero_grad()  
        loss.backward()  
        optimizer.step()  
  
        total_train_step += 1  
        if total_train_step % 100 == 0:  
            print("训练次数: {}, Loss: {}".format(total_train_step,loss.item()))  
            writer.add_scalar("train_loss",loss.item(),total_train_step)  
  
    # 测试步骤开始
    tudui.eval()  
    total_test_loss = 0  
    total_accuracy = 0  
    with torch.no_grad():  
        for data in test_dataloader:  
            imgs, targets = data  
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


![[Pasted image 20260313140645.png]]
## 8 model.train()和model.eval()

![[Pasted image 20260313140738.png]]

![[Pasted image 20260313140844.png|454]]


