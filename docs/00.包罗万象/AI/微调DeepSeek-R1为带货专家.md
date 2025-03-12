# 微调DeepSeek-R1为带货专家

由于设备限制，大部分人都无法本地部署满血版的DeepSeek-R1，而蒸馏版的DeepSeek又太人机。这时候可以使用微调的方式，重新训练自己的DeepSeek，让他在你需求的领域里更加的智能，即便蒸馏版也可能比满血版更专业😏。

模型微调是很需要GPU资源的，本就不富裕的个人设备更是雪上加霜了，好在有**Google Colab**提供了免费的GPU资源，免费版提供 NVIDIA Tesla K80 或 T4 GPU，加上Unsloth的微调加速，微调个人的蒸馏模型足够了。

下面我将以短视频带货专家为案例，通过使用[**Colab**](https://colab.research.google.com/)和[**Unsloth**](https://unsloth.ai/)，教你免费微调蒸馏DeepSeek，并上传[**Hugging Face**](https://huggingface.co/)，最终[**Ollama**](https://ollama.com/)部署到本地。

## 创建脚本

打开**Google Colab**新建一个微调脚本，点[这里](https://colab.research.google.com/#create=true)可以直达创建。

![image-20250312003926681](https://image.antoncook.xyz/picList/2025/03/92dca4a545a64cd072be9299a7ecf97e.webp)

新建的运行时默认是CPU，必须改成T4 GPU才能使用**unsloth**（高效微调工具）

![image-20250312004723206](https://image.antoncook.xyz/picList/2025/03/7b0912fc72b33b6a9c646fcf5ae99b1d.webp)

![image-20250312004822954](https://image.antoncook.xyz/picList/2025/03/ce2ae4b2d34d8186a7fb1dc4cb559d88.webp)

## 安装依赖

```pyt
# 安装 unsloth 包。unsloth 是一个用于微调大型语言模型(LLM)的工具，可以让模型运行更快、占用更少内存。
!pip install unsloth

# 卸载当前已安装的 unsloth 包(如果已安装)，然后从 GitHub 的源代码安装最新版本。
# 这样可以确保我们使用的是最新功能和修复。
!pip uninstall unsloth -y && pip install --upgrade --no-cache-dir --no-deps git+https://github.com/unslothai/unsloth.git

#安装 bitsandbytes和unsloth_zoo 包
# bitsandbytes 是一个用于量化和优化模型的库，可以帮助减少模型占用的内存。
# unsloth z00 可能包含了一些预训练模型或其他工具，方便我们使用。
!pip install bitsandbytes unsloth_zoo
```

编写完成后点击运行按钮即可

![image-20250312011038988](https://image.antoncook.xyz/picList/2025/03/a6b03bde4614519e2b9852f4333a01ed.webp)

![](https://image.antoncook.xyz/picList/2025/03/a186b4efcef08ce0b9c691a3c7b80326.webp)

## 加载模型

加载unsloth的deepseek蒸馏模型**unsloth/DeepSeek-R1-Distill-Llama-8B**

```python
from unsloth import FastLanguageModel # 导入FastLanguageModel类，用来加载和使用模型
import torch # 导入torch工具，用于处理模型的数学运算

max_seq_length = 2048 # 设置模型处理文本的最大长度，相当于给模型设置一个“最大容量”
dtype = None #设置数据类型，让模型自动选择最适合的精度
load_in_4bit = True # 使用4位量化来节省内存，就像把大箱子压缩成小箱子


# 加载预训练模型，并获取tokenizer工具
model,tokenizer=FastLanguageModel.from_pretrained(
  model_name="unsloth/DeepSeek-R1-Distill-Llama-8B", #指定要加载的模型名称
  max_seq_length=max_seq_length, #使用即面设置的最大长度
  dtype=dtype, #使用前面设置的数据类型
  load_in_4bit=load_in_4bit, #使用4位量化
  # token="hf ...”，#如果需要访问授权模型，可以在这里填入密钥
)
```

![image-20250312001343109](https://image.antoncook.xyz/picList/2025/03/4397a20a8d0e8bdef647a4d7859542c3.webp)

## 调前效果

加载好模型之后，先看看现在他是如何回答带货视频问题的

```python
prompt_style = """以下是描述任务的指令，以及提供进一步上下文的输入。
请写出一个适当完成请求的回答。
在回答之前，请仔细思考问题，并创建一个逻辑连贯的思考过程，以确保回答准确无误。

### 指令:
你是一位精通短视频带货的脚本专家，能够写出符合营销感低，语言自然，购买欲强的带货视频脚本。
请回答以下带货视频问题。

### 问题:
{}

### 回答:
<think>{}"""
# 定义提示风格的字符串模板，用于格式化问题

question = "制作一个郁金香花种的带货短视频脚本"
# 定义具体的带货短视频问题

FastLanguageModel.for_inference(model)
# 准备模型以进行推理

inputs = tokenizer([prompt_style.format(question, "")], return_tensors="pt").to("cuda")
# 使用 tokenizer 对格式化后的问题进行编码，并移动到 GPU

outputs = model.generate(
  input_ids=inputs.input_ids,
  attention_mask=inputs.attention_mask,
  max_new_tokens=1200,
  use_cache=True,
)
# 使用模型生成回答

response = tokenizer.batch_decode(outputs)
# 解码模型生成的输出为可读文本

print(response[0])
# 打印生成的回答部分
```

写好脚本运行，可以看到以下输出，和短视频带货风格差异较大，反而像一档科普节目。

![image-20250312020914535](https://image.antoncook.xyz/picList/2025/03/b9f522a0ba30db7f682c97cd8eeb2342.webp)

## 加载数据集

由于并没有短视频带货的现成数据集，我使用的数据集是自己整理的，手动整理效率也不高，以教学为主所以数据不多。

```python
# 定义一个用于格式化提示的多行字符串模板
train_prompt_style ="""以下是描述任务的指令，以及提供进一步上下文的输入。
请写出一个适当完成请求的回答。
在回答之前，请仔细思考问题，并创建一个逻辑连贯的思考过程，以确保回答准确无误。

### 指令:
你是一位精通短视频带货的脚本专家，能够写出符合营销感低，语言自然，购买欲强的带货视频脚本。
请回答以下带货视频问题。

### 问题:
{}

### 回答:
<思考>
{}
</思考>
{}"""
```

```python
# 定义结束标记(EOS_TOKEN)，用于指示文本的结束1秒
EOS_TOKEN = tokenizer.eos_token #必须添加结束标记

# 导入数据集加载函数数据集名称
from datasets import load_dataset
# 加载指定的数据集，选择中文语言和训练集的前500条记录
dataset = load_dataset("AntonCook/dypromotion", 'default', split = "train[0:200]", trust_remote_code=True)
# 打印数据集的列名，查看数来中有哪些子段
print(dataset.column_names)

['Question','Response','Complex_CoT']
```

![image-20250312001650477](https://image.antoncook.xyz/picList/2025/03/536dcb6ac172a0636f855a313cc49322.webp)

```python
# 定义一个函数，用于格式化数据集中的每条记录
def formatting_prompts_func(examples):
  # 从数据集中提取问题、复杂思考过程和回答
  inputs = examples["Question"]
  cots = examples["Complex_CoT"]
  outputs = examples["Response"]
  texts = [] # 用于存储格式化后的文本
  # 遍历每个问题、思考过程和回答，进行格式化
  for input,cot,output in zip(inputs, cots, outputs):
    # 使用字符串模板插入数据，并加上结束标记
    text = train_prompt_style.format(input, cot, output) + EOS_TOKEN
    texts.append(text) #将格式化后的文本添加到列表中
  return {
    "text": texts, #返回包含所有格式化文本的字典
  }
dataset = dataset.map(formatting_prompts_func, batched = True)
dataset["text"][0]
```

![image-20250312001737316](https://image.antoncook.xyz/picList/2025/03/f37cd0e6a99f5ddf8c38cb5f355ed524.webp)

## 开始微调

编写微调脚本，配置模型。

```python
FastLanguageModel.for_training(model)

model = FastLanguageModel.get_peft_model(
  model, #传入已经加载好的预训练模型
  r = 16, #设置 LORA 的秩，决定添加的可训练参数数量
  target_modules = ["q_proj","k_proj","v_proj","o_proj","gate_proj","up_proj","down_proj"], # 指定模型中需要微调的关键模块
  lora_alpha = 16, # 设置 LORA 的超参数，影响可训练参数的训练方式
  lora_dropout = 0, # 设置防止过拟合的参数，这里设置为 0 表示不丢弃任何参数
  bias = "none", # 设置是否添加偏置项，这里设置为“none"表示不添加
  use_gradient_checkpointing ="unsloth", # 使用优化技术节省显存并支持更大的批量大小
  random_state = 3407, # 设置随机种子，确保每次运行代码时模型的初始化方式相同
  use_rslora = False, # 设置是否使用 Rank stabilized LoRA 技术，这里设置为 False 表示不使用
  loftq_config = None, # 设置是否使用 LoftQ 技术，这里设置为 None 表示不使用
)
```

![image-20250312001845836](https://image.antoncook.xyz/picList/2025/03/6c1e595b8def6742e9bf9d09ff760344.webp)

设置微调参数，主要是3个**超参数**

Number of Epochs 训练轮数：将完整的数据集学习多少遍，学太多容易思维定式

Learning Rate 学习率：每次学习思路的改动程度，改动大思考多学习快，但也可以出现幻觉偏移

Batch Size 批量大小：一次学习多少，一次学太多可能错失细节

```python
from trl import SFTTrainer #导入 SFTTrainer，用于监督式微调
from transformers import TrainingArguments #导入 TrainingArguments,用于设置训练参数
from unsloth import is_bfloat16_supported #导入函数，检查是否支持 bfloat16 数据格式

trainer = SFTTrainer( #创建一个 SFTTrainer 实例
  model=model, # 传入要微调的模型
  tokenizer=tokenizer, # 传入tokenizer，用于处理文本数据
  train_dataset=dataset, # 传入训练数据集
  dataset_text_field="text", # 指定数据集中文本字段的名称
  max_seq_length=max_seq_length, # 设置最大序列长度
  dataset_num_proc=2, # 设置数据处理的并行进程数
  packing=False, # 是否启用打包功能(这里设置为 False，打包可以让训练更快，但可能影响效果)
  args=TrainingArguments( # 定义训练参数
    per_device_train_batch_size=2, # 每个设备(如 GPU)上的批量大小# 梯度累积步数，用于模拟大批次训练
    gradient_accumulation_steps=4, # 预热步数，训练开始练轮数
    warmup_steps=5, # 预热步数，训练开始时学习率逐渐增加的步数
    max_steps=75, # 最大训练步数
    learning_rate=2e-4, # 学习率，模型学习新知识的速度
    fp16=not is_bfloat16_supported(), # 是否使用 fp16 格式加速训练(如果环境不支持 bfloat16)
    bf16=is_bfloat16_supported(), # 是否使用 bfloat16 格式加速训练(如果环境支持)
    logging_steps=1, # 每隔多少步记录一次训练日志
    optim="adamw_8bit", # 使用的优化器，用于调整模型参数
    weight_decay=0.01, # 权重衰减，防止模型过拟合
    lr_scheduler_type="linear", # 学习率调度器类型，控制学习率的变化方式
    seed=3407, # 随机种子，确保训练结果可复现
    output_dir="outputs", # 训练结果保存的目录
    report_to="none", # 是否将训练结果报告到外部工具(如 WandB)，这里设置为不报告
  ),
)
```

![image-20250312001940964](https://image.antoncook.xyz/picList/2025/03/7423d87d429715eb2f88ce58990d9442.webp)

## 执行微调

```python
trainer_stats = trainer.train()
```

![image-20250312002012099](https://image.antoncook.xyz/picList/2025/03/e8f985e13d91120d9d0419d9d7960304.webp)

## 测试

微调后，模型对于同一个问题的回答有了更美观的格式，和更贴合需求的回答。

```python
# 将模型切换到推理模式，准备回答问题
FastLanguageModel.for_inference(model)

# 将问题转换成模型能理解的格式，并发送到 GPU 上
inputs = tokenizer([prompt_style.format(question, "")], return_tensors="pt").to("cuda")

# 让模型根据问题生成回答，最多生成 1200 个新词
outputs = model.generate(
  input_ids=inputs.input_ids, #输入的数字序列
  attention_mask=inputs.attention_mask, # 注意力遮罩，帮助模型理解哪些部分重要
  max_new_tokens=1200, #最多生成1200个新词
  use_cache=True, #使用缓存加速生成
)

# 将生成的回答从数字转换回文字
response = tokenizer.batch_decode(outputs)

# 打印回答
print(response[0])
```

![image-20250312004101685](https://image.antoncook.xyz/picList/2025/03/94baee290093a2b829d276b85bf1c2da.webp)

## 转GGUF

模型上传到**Hugging Face**，可以转成GGUF格式，体积会更小，便于传输。

在huggingface创建一个给colab使用的token https://huggingface.co/settings/tokens

在微调任务左侧配置你的`Huggingface Token`为变量`HUGGINGFACE_TOKEN`，记得勾选repo的操作权限。

![image-20250312004336584](https://image.antoncook.xyz/picList/2025/03/dfed40fde3696399a3c154b7a899937e.webp)

```pytho
# 导入 Google colab 的 userdata 模块，用于访问用户数据
from google.colab import userdata

# 从 Google Colab 用户数据中获取 Hugging Face 的 API 令牌
HUGGINGFACE_TOKEN = userdata.get('HUGGINGFACE_TOKEN')

# 将模型保存为 8 位量化格式(08 0)
# 这种格式文件小且运行快，适合部署到资源受限的设备
if True: model.save_pretrained_gguf("model",tokenizer,)
# 将模型保存为 16 位量化格式(f16)

# 16 位量化精度更高，但文件稍大
if False: model.save_pretrained_gguf("model f16", tokenizer, quantization_method = "f16")

# 将模型保存为 4 位量化格式(g4 k m)
# 4 位量化文件最小，但精度可能稍低
if False: model.save_pretrained_gguf("model", tokenizer, quantization_method = "g4_k_m" )
```

![image-20250312004358784](https://image.antoncook.xyz/picList/2025/03/8daf0026ce662f1836d8f2234fb97f57.webp)

完成后，左侧文件目录就可以看到打包输出的模型文件，你可以手动下载

![image-20250312005644570](https://image.antoncook.xyz/picList/2025/03/c3bae4ed37723ecf09ebf43e8783129a.webp)

## 上传HuggingFace

```python
#导入 Hugging Face Hub 的 create_repo 函数，用于创建一个新的模型仓库
from huggingface_hub import create_repo

# 在 Hugginracenuulu建列的快空仓库
create_repo("AntonCook/dypromotion", token=HUGGINGFACE_TOKEN, exist_ok=True)

# 将模型和分词器上传到 Hugging Face Hub 上的仓库
model.push_to_hub_gguf("AntonCook/dypromotion", tokenizer, token=HUGGINGFACE_TOKEN)
```

![image-20250312012310285](https://image.antoncook.xyz/picList/2025/03/8e2d5814e6d42c369747b9cd68b0cb95.webp)

完成后，Hugging Face就能看到你自己的开源模型了🤣

![image-20250312012345942](https://image.antoncook.xyz/picList/2025/03/783ff0a0d09d98a7867acca4bd2ac6b0.webp)

## 本地部署

通过ollama安装并运行huggingface上的模型

```python
ollama run hf.co/AntonCook/dypromotion
```

虽然数据集很少，但是由于原版过于人机，所以效果还是十分明显！

![image-20250312020701142](https://image.antoncook.xyz/picList/2025/03/da58a9f69ce8ac40c3d7770cdbe295af.webp)
