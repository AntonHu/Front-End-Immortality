# Dify搭建私有化RAG应用

在阅读之前，如果你还不知道Dify是什么，没有一个本地部署的Dify，请先学习[《AI工作流平台Dify本地部署》](./AI工作流平台Dify本地部署)。

本教程将通过实操搭建一个“生日管家”，教你学会如何使用Dify来创建一个RAG（检索增强生成）应用。

大致的实现逻辑就是，AI对话的形式，提出你的诉求，根据诉求检索你的私人知识库，将知识库检索结果给到AI模型处理，AI给出定制化的回答。

下面来看详细的实操过程。

## 创建知识库

知识库是可以提供给AI模型检索训练的文档，通过上传各种常见格式的文档文件，转换为AI更易于检索的向量数据，存储在知识库中。你可以创建自己的私人信息库，甚至公司的技术文档，团队的项目源码，再使用本地AI检索学习，就能定制一个精通你个人业务的专属AI应用，例如生成符合团队技术栈风格的代码。

![image-20250214234447481](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214234447481.png)

点击创建知识库，Dify支持本地文件，Notion笔记，还有url的导入形式，这里我导入一个本地写的“Anton生日.txt”

![image-20250214235303029](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214235303029.png)

保存后，Dify集成的知识库处理模型会自动将文档内容进行向量处理，等待处理完成，前往知识库就能看到 `Anton生日` 知识库并使用了。

![image-20250214235432709](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214235432709.png)

## 创建RAG应用

有了知识库后，下面将针对这个知识库创建一个RAG应用，就以做一个生日问答应用为简单的示例。

### 创建应用

前往Dify平台上的工作室模块进行应用的创建。

![image-20250215000323759](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215000323759.png)

创建应用可以使用平台上公开的应用模板，一键复制即可再定制修改，这里我为了演示创建空白的应用，并选择工作流的形式。

![image-20250214235955259](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214235955259.png)

### 开始节点

创建的空白应用仅包含一个开始节点，点击节点后的添加按钮，可以看到各种能创建的节点类型，其中“知识检索”节点就可以让工作流获取到知识库并进行检索工作。

![image-20250215000147957](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215000147957.png)

从开始节点的配置面板可以看到，节点本身具有一些系统环境变量，例如`user_id`、`app_id`、`workflow_id`这些字符可以在你需要针对用户，针对对话处理特殊逻辑时提供帮助。

![image-20250215010937490](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215010937490.png)

除系统字段之外，几乎所有节点都还有输入和输出字段，你可以自定义他们，在工作流间传递关键信息。

![image-20250215010130352](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215010130352.png)

现在我们就需要增加一个字段，用来接收用户通过对话框发起的问题，这里创建一个 `input` 字段，用户的问题应该是一句文本，故而选择“文本”字段类型，且是必须输入的内容，勾选必填

![image-20250215011121691](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215011121691.png)

### 知识检索节点

#### 创建节点

处理好输入节点后，在其后方继续添加一个 **知识检索节点** ，在其配置面板，知识库这一栏的右侧点击加号按钮添加知识库

![image-20250215004515565](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215004515565.png)

#### 添加知识库

选择刚才创建的 **`Anton生日`** 知识库

![image-20250215004938979](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215004938979.png)

添加后就是这样的，在这个节点就会检索目标知识库

![image-20250215212438803](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215212438803.png)

#### 输出变量

展开输出变量，可以看到知识库检索节点的输出格式，该节点的输出没法自定义，但这些字段已经足够使用

![image-20250215212740213](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215212740213.png)

#### 查询变量

最后还要配置查询变量，也就是知识检索节点的输入变量，这里直接选择接收开始节点中，我们新增的input字段

![image-20250215212612139](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215212612139.png)

#### 节点调试

节点还支持单独调试的功能，点击调试按钮

![image-20250215213040543](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215213040543.png)

首先会需要提供该节点必须的查询变量，也就是input字段来提供节点测试，我们输入“Anton生日是什么时候”

![image-20250215213629496](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215213629496.png)

点击运行，即可查看该节点运行的结果

![image-20250215213901576](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215213901576.png)

知识检索节点到此就完成了

### 大模型节点

如果你只想做个搜索知识库的功能，到这已经有答案了，但是增加大模型节点，能让回答更加的人性化，而且能让模型推理出更多元的答案，例如，Anton今年几岁？2000年的时候几岁？农历生日几号？

#### 创建节点

下面来继续新增一个大模型 **LLM** 节点

![image-20250215214248918](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215214248918.png)

#### 模型配置

从LLM配置面板可以看到有模型的选择，上下文的配置，还有设置输出变量，甚至能开启视觉理解的能力，便可以发送图片来让AI解读

![image-20250215214738392](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215214738392.png)

首先选择你想使用的AI模型，这里选择Ollama本地部署的DeepSeek-R1，能看到还有很多模型微调的参数可供调整，可以自行尝试。

![image-20250215214952103](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215214952103.png)

#### 上下文配置

上下文，其实就是配置输入变量，我们需要选择知识检索节点的结果，这里也能看到结果的类型是一个对象数组

![image-20250215215203761](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215215203761.png)

选择之后会出现提示，要求你必须在下方书写的提示词中，包含上下文变量，其实就是要把输入变量，在提示词中告诉AI模型，如何使用你给的输入变量。

![image-20250215215445499](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215215445499.png)

#### 提示词配置

##### System提示词

接下来就填写提示词，提示词默认只需要填 **System提示词** ，其实是你给模型设定一个“人设”，例如他是一个纪念日的管家，是一个代码仓库的管理员等，并告知他擅长处理一些什么事务，有怎么样的处理风格。

![image-20250215215854049](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215215854049.png)

如果你不知道怎么具体书写，你可以简单的写一些要点，然后点击提示词按钮，让AI模型帮你扩写优化提示词

![image-20250215220313554](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215220313554.png)

例如，我们先把必填的**上下文**写入，使用{}包裹即可插入变量，且有输入提示

![image-20250215223123064](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215223123064.png)

直接可以从下拉列表选中填入

![image-20250215223216997](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215223216997.png)

然后稍微描述一下，让AI模型能知道如何使用上下文

![image-20250215223503540](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215223503540.png)

接着把提示词复制起来，再点击优化按钮，粘贴过来让AI优化我们的提示词

![image-20250215223823353](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215223823353.png)

这里出现了个小问题，提示词生成的结果不完整，这是由于Dify在调用模型生成提示词时限制了token数量

![image-20250215231337651](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215231337651.png)

而DeepSeek-R1由于生成的结果包含思考过程，也就是 `<think>` 标签内的内容，导致token过大出现了不完整的情况，这里建议更换其他模型来生成提示词

###### 修改系统模型

修改提示词生成的AI模型，需要前往“设置”-“模型供应商”，点击【系统模型设置】按钮修改

![image-20250216002544498](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216002544498.png)

在弹出的窗口中，将系统推理模型更改为其他模型，我这里将改为 **Llama 3.2**

![image-20250216002718358](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216002718358.png)

回到提示词生成，可以看到提示词生成AI模型已经更改，生成的提示词也终于完整了

![image-20250216003104989](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216003104989.png)

点击应用按钮，将提示词自动填充替换system提示词

![image-20250216003840494](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216003840494.png)

##### User/Assistant提示词

设置好System提示词后，大模型知道了自己的职责，但是还缺少提问的问题，这时候就需要填写 **User提示词了**

点击添加消息，就会新增一个User提示词输入框，只需要将开始节点的input赋予user提示词即可

#### ![image-20250216004049765](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216004049765.png)输出配置

展开输出变量，可以看到大模型节点只能输出string类型的text字段，无需配置

![image-20250216004131534](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216004131534.png)

#### 节点调试

大模型节点也直接单独调试，但是由于依赖知识库检索节点的上下文，单独调试并不方便，所以这里可以使用整个应用的试运行来调试，点击工作流的运行按钮，在弹出的窗口中，填入开始节点的输入，也就是你的问题。

这次有了大模型，我们可以问一些需要推理的问题，例如：Anton在2000年是多少岁

![image-20250216004359733](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216004359733.png)

运行完成后，切换到追踪tab，展开LLM节点的运行情况，就可以看到该节点的输出是否符合预期了。

![image-20250216004750184](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216004750184.png)

### 结束节点

最后再增加结束节点，用来做整个工作流最终答案的呈现

![image-20250216005032933](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216005032933.png)

在配置面板中，增加输出变量，并选择LLM节点的text输出字段

![image-20250216005019979](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216005019979.png)

到此工作流的搭建就完成了。可以再来调试一遍完整的流程看看，这次不需要去追踪tab了，因为有了结束节点，直接输出了结果

![image-20250216005242684](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216005242684.png)

## 应用发布

点击发布按钮，即可发布做好的AI工作流应用了

![image-20250216005348765](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216005348765.png)

发布后去到应用首页，也就是探索页的工作区，你发布过的应用都能在这里这里使用了

![image-20250216005505624](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216005505624.png)

输入问题试试看，结果符合预期

![image-20250216005607798](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250216005607798.png)

## 总结

到此一个简单的RAG应用就完成了，你还可以通过Dify平台的低代码美化你的应用，改造成AI Agent更美观的对话应用等，这些都是锦上添花的，最重要的核心逻辑就是AI工作流的使用。除了本教程中使用到的节点之外，还有代码节点能写JS/python脚本，媒体节点能处理图片，插件节点能拓展功能，总之发挥你的想象，看看能做出什么吧！

Dify开源的私有化部署AI工作流是足够强大的，但是想要丰富的模型功能，需要拥有诸多模型供应商的API-KEY，这都是要money的。所以如果你对个人应用的数据没有非常严格的私密需求，可以试试字节的Coze，他集成了许多免费的模型和插件，上手成本更低，如果你有兴趣，可以继续看我写的Coze实操教程[《Coze搭建小红书图文AI——英语学习卡》](./Coze搭建小红书图文AI——英语学习卡)