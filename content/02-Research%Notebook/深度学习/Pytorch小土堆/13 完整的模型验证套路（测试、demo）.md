---
title: 13 完整的模型验证套路（测试、demo）
draft: false
tags:
  - example-tag
date: 2026-03-13
---
## 1 测试代码和结果

```python
import torch  
from PIL import Image  
import torchvision  
from torch import nn  
  
device = torch.device("cuda")  
  
img_path = "../imgs/dog.png"  
img = Image.open(img_path)  
# print(img)  # PIL类型  
  
transform = torchvision.transforms.Compose([  
    torchvision.transforms.Resize((32,32)),  
    torchvision.transforms.ToTensor()])  
img = transform(img)  
# print(img.shape)  # tensor类型  
  
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
  
model = torch.load("tudui_0.pth",weights_only=False)  
model = model.to(device)  
print(model)  
img = torch.reshape(img,(1,3,32,32))  
img = img.to(device)  
model.eval()  
with torch.no_grad():  
    output = model(img)  
print(output)  
  
print(output.argmax(1))
```

![[Pasted image 20260313173952.png]]

==经常遗忘的代码：==

![[Pasted image 20260313174018.png|584]]

![[Pasted image 20260313174048.png|625]]

## 2 用debug来看训练代码里面的类别

![[Pasted image 20260313174234.png]]

![[Pasted image 20260313174242.png]]

## 3 使用gpu训练保存的模型在cpu上使用

![[Pasted image 20260313174525.png|422]]

==解决方法==，使用：

```python
model = torch.load("model.pth", map_location=torch.device("cpu"))
```

![[Pasted image 20260313174624.png|447]]

