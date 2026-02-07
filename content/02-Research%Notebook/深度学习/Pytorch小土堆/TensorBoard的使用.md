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
# TensorBoard必须在 logs 文件夹的上级目录中启动。
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

## 3 add_image() 的使用（常用来观察训练结果）

### 3.1 add_image() 方法详解

**① add_image() 方法详解**

add_image()用来把“图片”写进 TensorBoard，方便我们可视化输入数据或中间结果。

先使用help看一下方法说明：

```python
from torch.utils.tensorboard import SummaryWriter
help(SummaryWriter.add_image)
```

![[Pasted image 20260207154643.png]]

注意：add_image的参数img_tensor类型需为torch.Tensor, numpy.array, or string/blobname。

**②基本语法**

```python
add_image(tag, img_tensor, global_step=None, walltime=None, dataformats='CHW')
```

`参数说明：`
- tag (string): 图像标签名称，用于分类显示
- img_tensor (torch.Tensor, numpy.array): 图像数据张量
- global_step (int): 全局步数（epoch/iteration）
- walltime (float): 时间戳（通常不需要）
- dataformats (string): 数据格式，如 'CHW' , 'HWC' , 'HW' 等

`数据格式详解：`

支持的图像格式
1. CHW 格式 (Channels, Height, Width)
2. HWC 格式 (Height, Width, Channels)
3. HW 格式 (Height, Width)

数值范围：
1. 浮点数: 通常应该在 [0, 1] 范围内
2. 整数: 应该在 [0, 255] 范围内

### 3.2 如何查看读取图片的类型呢？

通过PIL中的Image读取图像其对应的类型是<class ‘PIL.JpegImagePlugin.JpegImageFile’>

![[Pasted image 20260207155644.png]]

这个类型，它不是 Tensor，也不是 NumPy 数组，PyTorch 要的是：**“数值张量”**，TensorBoard 的 `add_image()` 也只认torch.Tensor和numpy.ndarray。而 PIL Image本质是一个 **图片对象**。

所以需要对图片进行转换。

### 3.3 利用Opencv读取图片，获得numpy型图片数据

安装：

```bash
pip install opencv-python
```

### 3.4 利用numpy.array()，对PIL图片进行转换

将PIL类型的img转换为numpy类型：

![[Pasted image 20260207160820.png]]

并且我们发现它的图像格式是HWC：

![[Pasted image 20260207160849.png]]

接下来我们看一段报错的代码：

```python
from torch.utils.tensorboard import SummaryWriter # SummaryWriter 用来把数据写到日志文件中  
import numpy as np  
from PIL import Image  
  
writer = SummaryWriter("logs") # 所有数据都会写到这个文件夹里  
img_path = "data/train/ants_image/0013035.jpg"  
img_PIL = Image.open(img_path)  
img_array = np.array(img_PIL)  
print(img_array.shape) # (512,768,3)
  
writer.add_image("test", img_array, 1)  
# y = x  
for i in range(100):  
    writer.add_scalar("y=x", i, i) # tag："y=x" scalar_value：i(y轴的值) global_step：i(x轴（通常是step / epoch）)  
  
writer.close()
```

![[Pasted image 20260207161429.png]]

问题原因，图像形状默认为 : math: (3, H, W)，而上面通过打印发现形状为(512, 768, 3)，需对通道参数进行转换

![[Pasted image 20260207161626.png]]

调整过后就没有问题啦~

![[Pasted image 20260207161733.png]]

我们打开tensorboard：

![[Pasted image 20260207162020.png]]

![[Pasted image 20260207162215.png]]

**如果实现两张图片滑动展示的话就要注意**

![[Pasted image 20260207162626.png]]

第一张图片的 global_step =1；

第二张图片的 global_step =2

才可以实现滑动展示

如果想让另外的照片单独显示，那么就要将标题重新命名就行了

比如我一开始命名的是test，然后我新命名为train：

![[Pasted image 20260207162713.png]]

### 3.5 TensorBoard典型工作流

`步骤一：在训练代码中记录数据（以 PyTorch 为例）`

```python
from torch.utils.tensorboard import SummaryWriter

writer = SummaryWriter('runs/exp1') # 创建一个记录器

for epoch in range(100):
	# ... 训练逻辑 ...
	loss = ...
	accuracy = ...

	# 将损失和准确率记录到 TensorBoard
	writer.add_scalar('Loss/train', loss, epoch)
	writer.add_scalar('Accuracy/train', accuracy, epoch)

	# 还可以记录模型图、直方图、图像等
	# writer.add_graph(model, input_sample)
	# writer.add_histogram('weights', model.layer1.weight, epoch)
writer.close()
```

`步骤二：在终端启动 TensorBoard 服务`

```python
tensorboard --logdir=runs
```

`runs` 是**所有实验的根目录**，TensorBoard 会自动扫描：
- `runs/exp1`
- `runs/exp2`
- …

`步骤三：在浏览器中查看（通常是 http://localhost:6006 ）`

你会在网页上看到实时更新的损失和准确率曲线，并且可以同时加载 runs/exp1 , runs/exp2 等不同实验进行对比。

