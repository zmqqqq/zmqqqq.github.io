---
title: 1 TensorBoard的使用
draft: false
tags:
  - "#TensorBoard"
---
![[Pasted image 20260206212549.png]]

这两个工具是深度学习，尤其是使用 `PyTorch` 和 `TensorFlow` 时，必不可少的重要组件，但它们负责的任务完全不同。

- **TensorBoard** 用来可视化训练过程，帮助观察模型是否正常学习。
- **transforms** 是“数据预处理工具”，用来把原始数据变成模型能用、且更好学的数据。
- transforms 决定数据如何进入模型，TensorBoard 决定你如何看懂模型在训练什么。

![[Pasted image 20260206212835.png]]

![[Pasted image 20260206212917.png]]

## 1 TensorBoard的安装

**如何查看导入的这个类的作用呢？**--`Ctrl +点击那个类即可`

![[Pasted image 20260206213412.png]]

![[Pasted image 20260206213354.png]]

安装tensorboard：

```bash
pip install tensorboard
```

## 2 add_scalar() 的使用（常用来绘制train / val loss）

`add_saclar` 用于在TensorBoard中添加标量数据。该方法可以用来添加训练过程中的损失值、准确率等指标，以便于在TensorBoard中进行可视化和比较。

add_scalar() 主要用于记录和可视化`标量数据`（单个数值），常用于跟踪：
- 训练损失 (train loss)
- 验证损失 (val loss)
- 准确率 (accuracy)
- 学习率 (learning rate)
- 其他需要监控的数值指标

### 2.1 基本语法

```python
add_scalar(tag, scalar_value, global_step=None, walltime=None)
```

参数说明：
- tag (string): 数据的标签名称，用于在 TensorBoard 中分类显示
- scalar_value (float): 要记录的标量值（如 loss、accuracy）
- global_step (int): 全局步数，通常是 epoch 或 iteration 数
- walltime (float): 时间戳（通常不需要手动设置）

### 2.2 使用案例

使用tensorboard绘制 y = x 的函数

```python
from torch.utils.tensorboard import SummaryWriter # SummaryWriter 用来把数据写到日志文件中  
  
writer = SummaryWriter("logs") # 所有数据都会写到这个文件夹里  
  
# writer.add_image()  
# y = x  
for i in range(100):  
    writer.add_scalar("y=x", i, i) # tag："y=x" scalar_value：i(y轴的值) global_step：i(x轴（通常是step / epoch）)  
  
writer.close()
```

![[Pasted image 20260206215237.png]]

运行代码后，启动 TensorBoard：

```bash
tensorboard --logdir=logs  # logdir=事件文件所在的文件夹名
# tensorboard --logdir=logs --port=6009 # 还可以修改默认的端口名，避免冲突
```

![[Pasted image 20260206215434.png]]

![[Pasted image 20260206215825.png]]

y = 2x：

![[Pasted image 20260206220036.png]]

![[Pasted image 20260206220056.png]]

当未改变图像标题，重复修改y值 如writer.add_scalar(“y = x”, i, i)，writer.add_scalar(“y = x”, 2i, i)，writer.add_scalar(“y = x”, 3i, i)，会导致新绘制会包含之前绘制的图像：

![[Pasted image 20260206220228.png]]

解决方法：删除所有log文件，重新执行程序，再在tensorboard中查看。

## 3 add_image() 的使用（常用俩观察训练结果）


