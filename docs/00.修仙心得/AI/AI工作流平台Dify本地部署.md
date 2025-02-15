
# AI工作流平台Dify本地部署

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

下面我将详细知道你搭建本地Dify，并在Dify中配置AI模型。

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

# 正常返回
[+] Running 74/9
 ✔ db Pulled                                                    834.2s
 ✔ sandbox Pulled                                              1120.7s
 ✔ weaviate Pulled                                              526.5s
 ✔ web Pulled                                                   174.0s
 ✔ redis Pulled                                                 893.7s
 ✔ api Pulled                                                  2919.8s
 ✔ worker Pulled                                               2919.8s
 ✔ ssrf_proxy Pulled                                            494.0s
 ✔ nginx Pulled                                                 184.7s
[+] Running 11/11
 ✔ Network docker_default             Created                     0.0s
 ✔ Network docker_ssrf_proxy_network  Created                     0.0s
 ✔ Container docker-db-1              Started                     1.1s
 ✔ Container docker-web-1             Started                     1.1s
 ✔ Container docker-redis-1           Started                     1.1s
 ✔ Container docker-sandbox-1         Started                     1.1s
 ✔ Container docker-weaviate-1        Started                     1.1s
 ✔ Container docker-ssrf_proxy-1      Started                     1.1s
 ✔ Container docker-api-1             Started                     0.7s
 ✔ Container docker-worker-1          Started                     0.7s
 ✔ Container docker-nginx-1           Started                     0.8s
```

等待命令安装完成，打开Docker Desktop或者通过命令行即可查看到安装好的Dify包含的所有镜像

![image-20250214233806221](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214233806221.png)

在Docker中启动Dify容器，打开浏览器访问 http://localhost:80/install

![image-20250214234032549](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214234032549.png)

初次登录需要设置管理员账号密码，然后使用账号密码登录即可进入到平台，至此你的Dify就安装好了

## 配置AI模型

我们的目的是制作AI应用，所在创建应用之前，你需要在Dify上配置可供平台使用的大模型。你可以通过调用大模型的API进行使用，也可以部署自己的本地大模型私有化使用。

### 第三方AI模型

你可以直接配置第三方模型的API-KEY调用，通过"设置"-"模型供应商"找到对应的模型，设置你的API-KEY即可添加

![image-20250215210404057](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215210404057.png)

![image-20250215210500258](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215210500258.png)

![image-20250215210523637](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215210523637.png)

配置保存后，模型即可在AI应用中使用。

### 本地AI模型

如果是打算做私有化的应用，则需要本地的AI模型来保护隐私，就需要部署本地的AI模型。

#### 部署本地模型

本地模型可以使用 **Ollama** 进行部署，部署指南可以参考[《DeepSeek-R1私有化部署》](./DeepSeek-R1私有化部署)

#### 使用本地模型

部署完成本地AI模型，就可以在设置的模型供应商中找到 **Ollama** ，点击添加模型

![image-20250215210946112](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215210946112.png)

填写模型名称，这里需要填写Ollama中正确完整的模型名称，你可以通过命令行 `ollama list` 指令查看

```bash
Ollama list

NAME                  ID              SIZE      MODIFIED
llama3.2:latest       a80c4f17acd5    2.0 GB    41 minutes ago
deepseek-r1:latest    0a8c26691023    4.7 GB    26 hours ago
deepseek-r1:7b        0a8c26691023    4.7 GB    11 days ago
```

配置Ollama的访问路径，这里使用域名 `localhost` 可能无法访问，因为是docker服务，建议使用 `host.docker.internal` 域名

![image-20250215211620744](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215211620744.png)

添加模型后，在Dify上创建AI应用的时候，大模型节点即可选择对应模型进行处理了。

![image-20250215211909739](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215211909739.png)

到此Dify的本地搭建工作就完成了，建议你继续阅读[《Dify搭建私有化RAG应用》](./Dify搭建私有化RAG应用)，通过实操来学习如何创建一个AI工作流应用。

