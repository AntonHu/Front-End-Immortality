# Dify搭建私有化RAG

[Dify](https://dify.ai/zh) 是一个支持通过AI工作流的形式，开发AI应用的开源平台，他相比 `LangChain` 更加的易用，甚至零代码即可创建你的AI应用。

![image-20250214231234188](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214231234188.png)

| 功能                     | Dify.AI            | LangChain   | Flowise      | OpenAI Assistant API |
| ------------------------ | ------------------ | ----------- | ------------ | -------------------- |
| 编程方法                 | API + 应用程序导向 | Python 代码 | 应用程序导向 | API 导向             |
| 支持的 LLMs              | 丰富多样           | 丰富多样    | 丰富多样     | 仅限 OpenAI          |
| RAG引擎                  | ✅                  | ✅           | ✅            | ✅                    |
| Agent                    | ✅                  | ✅           | ❌            | ✅                    |
| 工作流                   | ✅                  | ❌           | ✅            | ❌                    |
| 可观测性                 | ✅                  | ✅           | ❌            | ❌                    |
| 企业功能（SSO/访问控制） | ✅                  | ❌           | ❌            | ❌                    |
| 本地部署                 | ✅                  | ✅           | ✅            | ❌                    |

所谓AI工作流，就是能将多个AI的输入输出进行关联，还可以在任意环节加入知识库，数据库，python/JS脚本，插件等进行高度定制处理的流式工作空间。

通过使用工作流的形式组织多个AI各司其职，可以实现更复杂功能，例如私有知识库RAG，模型管理，AI应用。

下面我将通过搭建Dify，并用Dify创建私有化RAG工作流来教会你使用它。

## 安装Dify

### 下载源码

将Dify的源码克隆到本地

```bash
git clone https://github.com/langgenius/dify.git
```

![image-20250214231652765](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214231652765.png)

### 使用Docker安装

如果你还没有Dokcer，可以前往官网下载 [Docker Desktop](https://www.docker.com/) 一键安装Docker

![image-20250214223810043](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214223810043.png)

进入docker文件夹，在文件夹下执行命令行，拷贝环境配置文件

```bahs
cp .env.example .env
```

然后从当前文件夹内找到 `docker-compose.yaml` 文件，使用它可以便捷的安装Dify

![image-20250214231927547](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214231927547.png)

默认 `docker-compose.yaml` 文件的配置，安装的Dify会在80端口启动，如果不想80端口被占用，可以打开该文件，修改 `nginx` 配置

![image-20250214232331519](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214232331519.png)

通过命令行使用docker-compose安装Dify

```bash
docker compose up -d
```

等待命令安装完成，打开Docker Desktop或者通过命令行即可查看到安装好的Dify包含的所有镜像

![image-20250214233806221](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214233806221.png)

在Docker中启动Dify容器，打开浏览器访问 http://localhost:80/install

![image-20250214234032549](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214234032549.png)

初次登录需要设置管理员账号密码，然后使用账号密码登录即可进入到平台，至此你的Dify就安装好了

## 配置AI模型

### 第三方AI模型

### 本地AI模型

#### 部署本地模型

本地模型的部署指南可以参考[《部署本地DeepSeek》](./部署本地DeepSeek)

#### 使用本地模型



#### 配置本地模型

## 创建RAG应用

### 创建知识库

知识库是可以提供给AI模型检索训练的文档，通过上传各种常见格式的文档文件，转换为AI更易于检索的向量数据，存储在知识库中。你可以创建自己的私人信息库，甚至公司的技术文档，团队的项目源码，再使用本地AI检索学习，就能定制一个精通你个人业务的专属AI应用，例如生成符合团队技术栈风格的代码。

![image-20250214234447481](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214234447481.png)

点击创建知识库，Dify支持本地文件，Notion笔记，还有url的导入形式，这里我导入一个本地写的“Anton生日.txt”

![image-20250214235303029](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214235303029.png)

保存后，Dify集成的知识库处理模型会自动将文档内容进行向量处理，等待处理完成，前往知识库就能看到 `Anton生日` 知识库并使用了。

![image-20250214235432709](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214235432709.png)

### 创建RAG应用

有了知识库后，下面将针对这个知识库创建一个RAG应用，就以做一个生日问答应用为简单的示例。

#### 创建应用

前往Dify平台上的工作室模块进行应用的创建。

![image-20250215000323759](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215000323759.png)

创建应用可以使用平台上公开的应用模板，一键复制即可再定制修改，这里我为了演示创建空白的应用，并选择工作流的形式。

![image-20250214235955259](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214235955259.png)

#### 开始节点

创建的空白应用仅包含一个开始节点，点击节点后的添加按钮，可以看到各种能创建的节点类型，其中“知识检索”节点就可以让工作流获取到知识库并进行检索工作。

![image-20250215000147957](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215000147957.png)

从开始节点的配置面板可以看到，节点本身具有一些系统环境变量，例如`user_id`、`app_id`、`workflow_id`这些字符可以在你需要针对用户，针对对话处理特殊逻辑时提供帮助。

![image-20250215010937490](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215010937490.png)

除系统字段之外，几乎所有节点都还有输入和输出字段，你可以自定义他们，在工作流间传递关键信息。

![image-20250215010130352](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215010130352.png)

现在我们就需要增加一个字段，用来接收用户通过对话框发起的问题，这里创建一个 `input` 字段，用户的问题应该是一句文本，故而选择“文本”字段类型，且是必须输入的内容，勾选必填

![image-20250215011121691](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215011121691.png)

然后在开始节点的后方增加一个知识检索节点。

#### 知识检索节点

创建好了知识检索节点，在其配置面板，知识库这一栏的右侧点击加号按钮添加知识库

![image-20250215004515565](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215004515565.png)

选择刚才创建的 **`Anton生日`** 知识库

![image-20250215004938979](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215004938979.png)

#### 大模型节点



#### 输出节点



#### 应用调试



#### 应用发布