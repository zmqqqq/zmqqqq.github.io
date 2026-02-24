---
title: 2 Transforms的使用
draft: false
tags:
  - "#Transforms"
date: 2026-02-07
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

![[Pasted image 20260223154339.png]]

### 1.2 Tensor数据类型

查看文件的结构可以使用`Alt+7`：下图可以看到Totensor的作用是可以将PIL的img或者是numpy转化成tensor数据类型：

![[Pasted image 20260223152851.png]]

![[Pasted image 20260223153805.png]]

如下图，图片是PIL格式的：

![[Pasted image 20260223153607.png]]

```python
from PIL import Image  
from torchvision import transforms  
  
# python的用法 =》 tensor数据类型  
# 通过transforms.Totensor去解决两个问题  
# 1、 transforms该如何使用(python)  
# 2、 为什么我们需要Tensor数据类型？  
  
# 绝对路径 D:\deskbook\PyTorch\tuDui-Pytorch\Learn_torch\dataset\train\ants\0013035.jpg# 相对路径 dataset/train/ants/0013035.jpgimg_path = "dataset/train/ants/0013035.jpg"  
img = Image.open(img_path)  
# print(img)  
tensor_trans = transforms.ToTensor() # 一个对象  
tensor_img = tensor_trans(img)  
print(tensor_img)
```

打印经过transform成功将PTL转化为Tensor类型数据：

![[Pasted image 20260223154007.png]]

神经网络需要tensor的数据进行训练。

## 2 常见的Transforms

![[Pasted image 20260223155213.png]]

### 2.1 Python的__call__方法

在 Python 中__call__是一个特殊方法（也称为魔术方法或双下划线方法），用于使对象可以像函数一样被调用。当你在一个对象上调用obj() 时，Python解释器会查找该对象的call方法并调用它。

```python
class Person:
	def __call__(self,name):
		print("__call__"+"hello"+name)
	
	def hello(self,name):
		print("hello"+name)

person=Person()

# 方式1：使用 __call__ 方法
person("zhangsan") # 自动调用 __call__ 方法，而不需要person.call("zhangsan")

# 方式2：调用普通方法
person.hello("lisi") # 显式调用 hello 方法
```

![[Pasted image 20260223160338.png]]

### 2.2 ToTensor的使用

**作用：将PIL图像（H, W, C） 或Numpy数组（H, W, C） 转为PyTorch张量（C, H, W），同时将像素值从0-255 归一化到 0-1 。**

```python
from PIL import Image  
from torch.utils.tensorboard import SummaryWriter  
from torchvision import transforms  
  
writer = SummaryWriter("logs")  
img = Image.open("dataset/train/ants/0013035.jpg")  
print(img)  

# ToTensor的使用
trans_totensor = transforms.ToTensor()  
img_tensor = trans_totensor(img)  
writer.add_image("ToTensor", img_tensor)  
writer.close()
```

打开终端：

![[Pasted image 20260223161052.png]]

![[Pasted image 20260223161132.png]]

### 2.3 ToPILImage() 的使用

![[Pasted image 20260223161449.png]]

作用：将张量（C, H, W）或 Numpy 数组转回 PIL 图像，用于可视化。

![[Pasted image 20260223161946.png]]
### 2.4 Normalize() 归一化（关键！加速模型收敛）

![[Pasted image 20260223162046.png]]

Normalize(mean, std, inplace=False)

作用：对张量图像进行标准化，公式： output = (input - mean) / std 。

核心目的：将像素值从 0-1 映射到更均匀的分布（通常为 -1~1 附近），避免因像素值范围过大导致模型训练不稳定。

参数：
	mean ：每个通道的均值（如 RGB 图像需传入 3 个值）。
	std ：每个通道的标准差（需与 mean 对应）。

![[Pasted image 20260223162619.png]]

```python
from PIL import Image  
from torch.utils.tensorboard import SummaryWriter  
from torchvision import transforms  
  
writer = SummaryWriter("logs")  
img = Image.open("dataset/train/ants/0013035.jpg")  
print(img)  
  
# ToTensor的使用  
trans_totensor = transforms.ToTensor()  
img_tensor = trans_totensor(img)  
writer.add_image("ToTensor", img_tensor)  
  
# ToPILImage() 的使用  
# trans_topil = transforms.ToPILImage()  
# img_pil = trans_topil(img_tensor)  
# print(img_pil)  
  
# Normalize的使用  
print(img_tensor[0][0][0])  
trans_norm = transforms.Normalize(mean = [0.5,0.5,0.5], std = [0.5,0.5,0.5])  
img_norm = trans_norm(img_tensor)  
print(img_norm[0][0][0])  
writer.add_image("Normalize", img_norm)  
  
writer.close()
```

运行完毕我们查看tensorboard：发现经过归一化之后的图片和原先是有区别的。

![[Pasted image 20260223163018.png]]

![[Pasted image 20260223162844.png]]

### 2.5 Resize()的使用

![[Pasted image 20260223204900.png]]

作用：调整图像大小

输入支持：PIL 图像和 PyTorch 张量（形状为 [..., H, W] ）

```python
class Resize(torch.nn.Module):
	"""将输入图像调整到给定大小。
	如果图像是 torch Tensor，期望具有 [..., H, W] 形状，其中 ... 表示最多两个前导维度
	参数:
		size (序列或整数): 期望的输出大小。如果 size 是一个序列如 (h, w)，
		输出大小将与此匹配。如果 size 是一个整数，图像的较短边将匹配到这个数字。
		即，如果 高度 > 宽度，图像将被重新缩放为 (size * 高度 / 宽度, size)。"""
```

我们详细来讲一下这个方法，如果输入是 Tensor 格式的图片 ，它的形状应该是：[..., H, W]
这里的...的意思是最多可以有两维度，普通图片是[C,H,W]，批量图片是[B,C,H,W]，...可以代表C或B,C。

==size (sequence or int)是什么意思呢？==
	情况一：传入 tuple。Resize((h, w))，eg，Resize((224, 224))，那么图片就会强制变(224, 224)，不管原来是什么比例；
	情况二：传入 int。eg，Resize(224)。这时候不是直接变成 224×224，而是把图片的 **短边** 变成 224，长边按比例缩放。

![[Pasted image 20260223210557.png]]

![[Pasted image 20260223210855.png]]

```python
# Resize  
print(img.size)  
trans_resize = transforms.Resize((512,512))  
# img PIL -> resize -> img_resize PIL  
img_resize = trans_resize(img)  
# img_resize PIL -> totensor -> img_resize tensor  
img_resize = trans_totensor(img_resize)  
print(img_resize)  
print(img_resize.size())
```

注意，只有tensor类型的图片才可以用tensorboard查看。

![[Pasted image 20260223211244.png]]

### 2.6 Compose 组合变化

（1）单个变换

```python
from torchvision import transforms
from PIL import Image
	# 1. 加载图像（PIL Image 格式，默认维度：(H, W, C)，像素值 0-255）
	img = Image.open("test.jpg") # 假设当前目录有 test.jpg
	
	# 2. 定义单个变换：调整图像大小为 224x224
	resize_transform = transforms.Resize((224, 224))
	
	# 3. 应用变换
	img_resized = resize_transform(img)
	
	print(img_resized.size) # 输出：(224, 224)
```

（2）组合变换

![[Pasted image 20260223211638.png]]

==实际任务中需多个变换（如"调整大小→随机翻转→转为张量→归一化"）， Compose 接收变换列表，按列表顺序依次执行。==

```python
# 组合多个变换：Resize → RandomHorizontalFlip → ToTensor → Normalize
	transform = transforms.Compose([
	transforms.Resize((224, 224)), # 1. 调整大小
	transforms.RandomHorizontalFlip(p=0.5), # 2. 50% 概率水平翻转（数据增强）
	transforms.ToTensor(), # 3. 转为张量（必须在 Normalize 之前）
	transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]) # 4. 归一化
	])

# 应用组合变换
img_processed = transform(img)
print(img_processed.shape) # 输出：torch.Size([3, 224, 224])（C, H, W 格式）
```

==注意： Compose 中变换的顺序不可随意调换！例如 ToTensor 必须在 Normalize 之前（ Normalize 仅支持张量输入）。==

```python
# Compose - resize - 2
trans_resize_2 = transforms.Resize(512)
# PIL-> PIL -> tensor
trans_compose = transforms.Compose([trans_resize_2,trans_totensor])
img_resize_2 = trans_compose(img)
writer.add_image("Resize",img_resize_2,1)
```

### 2.7 RandomCrop(size, padding=None) 随机裁剪

![[Pasted image 20260223212331.png]]

作用：随机裁剪指定大小的区域（==数据增强==，仅用于训练集）。

参数： padding ：裁剪前先在图像四周填充指定像素（如 padding=4 表示上下左右各填 4 像素）。

```python
# 示例
# 先填充 4 像素，再随机裁剪 32x32（适合 CIFAR-10 数据集）
random_crop = transforms.RandomCrop(32, padding=4)
```

```python
# RandomCrop
trans_random = transforms.RandomCrop(512)
trans_compose_2 = transforms.Compose([trans_random,trans_totensor])

for i in range(10):
	img_crop = trans_compose_2(img)
	writer.add_image("RandomCrop", img_crop, i)
```

![[Pasted image 20260223212826.png]]

```python
# RandomCrop
trans_random = transforms.RandomCrop((500,400)) # 指定高和宽的裁取
trans_compose_2 = transforms.Compose([trans_random,trans_totensor])
for i in range(10):
	img_crop = trans_compose_2(img)
	writer.add_image("RandomCrop", img_crop, i)
```

==总结：==

`transforms.RandomCrop(size, padding=None)` 用于对图像进行**随机裁剪**，从原图中随机截取一个指定大小的区域作为输出，常用于数据增强。

- `size`：裁剪后的尺寸
	- 若为 `int`，则裁剪为 `(size, size)`
	- 若为 `(h, w)`，则裁剪为指定高宽
- `padding`：在裁剪前对图像四周进行填充（默认填充为0）

- 特点：
	- 每次裁剪位置不同（具有随机性）
	- 不会缩放图像，只是截取一部分
	- 常用于训练阶段增强数据多样性
	- 测试阶段一般使用 `CenterCrop`，保证结果稳定



