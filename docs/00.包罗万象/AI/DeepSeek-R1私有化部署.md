# DeepSeek-R1私有化部署

## 本地部署的作用

- **数据隐私**：使用的所有数据都存储在本地，不会上传到云端，对话内容涉及不能公开的敏感数据的，可以有效的保护隐私。

- **无额外限制**：本地模型内容输出更自由，不受平台内置规则的限制。

- **稳定性**：本地模型无需联网，可离线使用，不会出现云端服务繁忙的情况。

- **灵活定制**：可定制AI知识库，如书架，源码，个人信息等。通过定制化，模型能够给出更符合需求的回答和解决方案。

![image-20250214211744101](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214211744101.png)

## 本地部署的缺陷

由于完全体的DeepSeek对算力的需求极大，起码将近30W的费用才能搭建起能流畅使用的设备，对大部分人来说都不太现实，而且使用过程中的电费开销日积月累也是一笔不小的开销，所以基本只能使用 **蒸馏版的DeepSeek**

![image-20250214211836550](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214211836550.png)

从模型名字可以看出蒸馏模型的参数和原模型，例如 **DeepSeek-R1-Distill-Qwen-7B** 就是蒸馏自通义千问模型，参数数量只有7B，参数越多模型越聪明。

博主的电脑设备只能流畅运行7B的模型做演示，你的设备能运行多大的模型，可以参考下图：

![微信图片_20250214220613](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250214220613.png)

## 安装Ollama

### windows和mac

[访问官网](https://ollama.com/)下载安装包，一键安装即可。

![1739553616600](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739553616600.jpg)

### linux

通过指令进行安装

```bash
curl -fsSL https://ollama.com/install.sh | sudo bash
sudo usermod -aG ollama $USER  # 添加用户权限
sudo systemctl start ollama    # 启动服务
```

### 安装完成校验

```bas
ollama -v

# 输出ollama version is 0.5.7
```

出现上述则表示安装成功，也可以浏览器访问 `http://localhost:11434/` 验证

![image-20250214220036857](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214220036857.png)

### 修改模型目录

默认的模型安装目录可能并不如意，尤其是模型往往文件体积过大，例如在windows上默认安装在C盘会占据大量的内存，所以你可能会需要修改Ollama安装模型的目录，如不需要请跳过本步骤。

通过设置环境变量 `OLLAMA_MODELS` 来指定Ollama安装模型的目录。以下是不同操作系统的具体步骤：

#### Windows 系统

1. **创建新的模型存储目录** ：打开资源管理器，创建一个新的目录作为模型存储路径。例如，创建 `D:\AIModels\Ollama`  。

2. **修改环境变量** ：

   - 右键点击 “此电脑” 或 “计算机” 图标，选择 “属性”。

   - 在系统属性窗口中，点击 “高级系统设置”。

   - 在 “系统属性” 窗口中，切换到 “高级” 选项卡，点击 “环境变量”。

     ![image-20250215234150721](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215234150721.png)

   - 在 “环境变量” 窗口中，点击 “新建” 按钮。

   - 输入变量名 `OLLAMA_MODELS`，变量值为新的模型路径，例如 `F:\AI\ollama\models`  。

     ![image-20250215234300257](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250215234300257.png)

3. **迁移现有模型（可选）** ：如果已经下载了一些模型，可以将它们从默认路径复制到新的路径：

   ```bash
   xcopy C:\Users\<用户名>\.ollama\models\* F:\AI\ollama\models /E /I
   ```

4. **验证更改** ：打开命令提示符，输入 `ollama list` 列出已下载的模型，检查是否使用新的模型路径  。

#### Linux 系统

1. **创建新的模型存储目录** ：打开终端，创建一个新的目录作为模型存储路径。例如，创建 `/data/Ollama/models` ：

   ```bash
   sudo mkdir -p /data/Ollama/models
   ```

2. **更改目录权限** ：确保 Ollama 有权限访问和写入新目录：

   ```bash
   sudo chown -R $(whoami):$(whoami) /data/Ollama/models
   sudo chmod -R 775 /data/Ollama/models
   ```

3. **修改 Ollama 服务配置文件** ：

   - 编辑 Ollama 服务的配置文件：

     ```bash
     sudo nano /etc/systemd/system/ollama.service
     ```

   - 在 `[Service]` 部分的 `Environment` 字段后，添加新的 `Environment` 字段，指定新的模型路径：

     ```bash
     Environment="OLLAMA_MODELS=/data/Ollama/models"
     ```

   - 完整的配置示例如下：

     ```bash
     [Unit]
     Description=Ollama Service
     After=network-online.target
     
     [Service]
     ExecStart=/usr/local/bin/ollama serve
     User=$(whoami)
     Group=$(whoami)
     Restart=always
     RestartSec=3
     Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
     Environment="OLLAMA_MODELS=/data/Ollama/models"
     
     [Install]
     WantedBy=default.target
     ```

4. **重载配置并重启 Ollama 服务** ：

   - 重载系统服务配置：

     ```bash
     sudo systemctl daemon-reload
     ```

   - 重启 Ollama 服务：

     ```bash
     sudo systemctl restart ollama
     ```

   - 查看服务状态：

     ```bash
     sudo systemctl status ollama
     ```

5. **验证更改** ：

   - 检查默认路径 `/usr/share/ollama/.ollama/models`，确认模型文件是否已经消失。
   - 检查新路径 `/data/Ollama/models`，确认是否生成了 `blobs` 和 `manifests` 文件夹  。

#### MacOS 系统

1. **创建新的模型存储目录** ：打开终端，创建一个新的目录作为模型存储路径。例如，创建 `/Users/yourusername/AIModels/Ollama` 。

2. **设置环境变量** ：编辑 `~/.bash_profile` 或 `~/.zshrc` 文件，添加以下行来设置 `OLLAMA_MODELS` 环境变量：

   ```bash
   export OLLAMA_MODELS="/Users/yourusername/AIModels/Ollama"
   ```

3. **使环境变量生效** ：在终端中运行以下命令：

   ```bash
   source ~/.bash_profile
   ```

4. **验证更改** ：打开终端，输入 `ollama list` 列出已下载的模型，检查是否使用新的模型路径  。

通过以上步骤，你就成功修改了 Ollama 安装模型的目录。

## 安装DeepSeek

访问[Ollama官网的DeepSeek模型页](https://ollama.com/library/deepseek-r1)，你能直接复制模型的运行指令。

![image-20250214221453149](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214221453149.png)

在终端使用Ollama运行模型时，如果模型未安装则会先进行自动安装。

ollama安装 `deepseek-r1` 默认就是7B的模型，如果你想安装70B的模型，则应该指定 `ollama run deepseek-r1:70B` 

```bash
ollama run deepseek-r1
# 执行后
pulling manifest
pulling 96c415656d37... 100% ▕██████████████▏ 4.7 GB
pulling 369ca498f347... 100% ▕██████████████▏ 387 B
pulling 6e4c38e1172f... 100% ▕██████████████▏ 1.1 KB
pulling f4d24e9138dd... 100% ▕██████████████▏ 148 B
pulling 40fb844194b2... 100% ▕██████████████▏ 487 B
verifying sha256 digest
writing manifest
success
> > > Send a message (/? for help)
```

看到Send a message这句话，DeepSeek就已经安装好并可以使用了，你还可以在命令行输入 `ollama list` 查看已经安装的模型列表

![image-20250214221905107](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214221905107.png)

现在你已经可以直接在命令行进行对话：

![image-20250214222149016](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214222149016.png)

## Open-WebUI

通过命令行进行对话不太方便，所以还需要集成一个好用的WebUI来让对话可视化，例如[ChatBox](https://chatboxai.app/zh)，还有我即将介绍的Open-WebUI.

[Open-WebUI](https://openwebui.com/)是一个AI托管平台，支持各种 LLM 运行器（如Ollama），并为AI大语言模型提供对话式的web界面。

![image-20250214223445523](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214223445523.png)

### 使用Python pip安装

```bash
pip install open-webui
```

启动

```bash
open-webui serve
```

### 使用docker安装

如果你还没有Dokcer，可以前往官网下载 [Docker Desktop](https://www.docker.com/) 一键安装Docker

![image-20250214223810043](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214223810043.png)

安装好Docker后，通过命令行将open-webui安装到Docker

```bash
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

安装完成后，即可在容器中启用：

![image-20250214224046156](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214224046156.png)

打开http://localhost:3000已经可以看到webUI界面了

![1739553644741](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739553644741.jpg)

初次使用需要设置一个管理员账号

![image-20250214224456767](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214224456767.png)

登录进去之后，open-webui自动绑定了ollama的端口，已经可以直接开始使用你安装的DeepSeek

![image-20250214224659269](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214224659269.png)

![image-20250214224728072](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/image-20250214224728072.png)

至此，一个本地化的DeepSeek就完成了！
