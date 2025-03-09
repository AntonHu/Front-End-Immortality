# Verdaccio 搭建npm私有库

## npm 私有库的作用

- 安全性角度考虑：如果我们想要一个公共组件库，那么把组件放到我们私有库中，只有内网可以访问，这样可以避免组件中业务的泄露；
- 模块复用性角度考虑：多个项目之间有重复的共有模块，当需要修改模块，通过简单的统一的配置就可以实现；提炼后的组件有专门的地址可以用来查看，方便使用，在后期项目的引用中也能节约开发成本
- npm 包下载速度角度考虑：使用内部的地址，能够在开发下载 node 包的同时，将关联的依赖包缓存到 npm 私有仓库服务器中，下载速度更快；
- 项目开发中的路劲角度考虑：在项目开发中书写代码更整洁简练，不需书写更长的相对路径；
- 公司技术沉淀角度考虑：知识的沉淀，在公司业务相关的应用上尤佳；
- 版本角度的考虑：相当于一个容器，统一管理需要的包，保持版本的唯一；
- 开发效率角度考虑：使私有公共业务或组件模块能以共有包一样的管理组织方式，保持一致性，提高开发效率.

## 私有库原理

![img](https://image.antoncook.xyz/picGo/private-npm.f27dab4e.jpg)

用户 install 后向私有 npm 发起请求，服务器会先查询所请求的这个模块是否是我们自己的私有模块或已经缓存过的公共模块，如果是则直接返回给用户；如果请求的是一个还没有被缓存的公共模块，那么则会向上游源请求模块并进行缓存后返回给用户。上游的源可以是 npm 仓库，也可以是淘宝镜像。

## 框架选型

npm 私有仓库搭建有以下几种方式：

- 付费购买 npm 企业私有仓库
- 使用 git + ssh 这种方式直接引用到 GitHub 项目地址
- 开源代码源代码方式或者 docker 化构建

常用的 npm 私有仓库框架：

- Nexus: https://www.sonatype.com/nexus-repository-oss
- Sinopia: https://github.com/rlidwka/sinopia
- Verdaccio: [https://verdaccio.org](https://verdaccio.org/)
- cnpm: [https://cnpmjs.org](https://cnpmjs.org/)
- cpm: https://github.com/cevio/cpm
- npmfrog: https://github.com/dmstern/npmfrog

Nexus 是 Java 社区的一个方案，可以用于 Maven、npm 多种类型的仓库，界面比较丑。

Sinopia 是基于 Node.js 构建的，已经年久失修不维护了。

Verdaccio 是 forked Sinopia 进行改造的，Sinopia 和 Verdaccio 比较偏向于一个零配置、轻量型的私有 npm 模块管理工具，不需要额外的数据库配置，它内部自带小型数据库，支持私有模块管理的同时也支持缓存使用过的公共模块，发布及缓存的模块以静态资源形式本地存储。

cnpm 支持静态配置型用户管理机制，以及分层模块权限设置，可以实现公共模块镜像更新以及私有模块管理，支持拓展多种存储形式，相对的数据库的配置较多，部署过程略复杂，是淘宝及多家大型公司搭建内部私有 npm 仓库选择的方案。

由于 Verdaccio 构建成本比较低，后期也好维护，最终选择了Verdaccio。

## Verdaccio 搭建

Verdaccio 是一个 Node.js 创建的轻量的私有 npm proxy registry。

- 基于 Node.js 的网页应用程序
- 私有 npm registry
- 本地网络 proxy
- 可插入式应用程序
- 易安装和使用
- 提供 Docker 和 Kubernetes 支持
- 与 yarn, npm 和 pnpm 100% 兼容
- forked 于 sinopia@1.4.0 并且 100% 向后兼容。

![img](https://image.antoncook.xyz/picGo/verdaccio.1ea892c6.png)

### docker 方式安装

1. 拉取 Verdaccio 的 docker 镜像：

```text
docker pull verdaccio/verdaccio
```

2. 在根目录下创建 docker 文件

```text
mkdir -p ~/docker/data
cd ~/docker/data
```

3. 从 git 拉取示例到 data 到目录下

```text
git clone https://github.com/verdaccio/docker-examples
cd ~/docker/data/docker-examples
```

4. 移动配置文件

```text
mv docker-local-storage-volume ~/docker/verdaccio
```

5. 设置文件夹权限

```text
chown -R 100:101 ~/docker/verdaccio
```

6. 启动镜像

使用 docker-compose 启动:

```text
cd ~/docker/verdaccio
docker-compose build
docker-compose up
```

或者使用 docker run 命令启动:

```text
V_PATH=~/docker/verdaccio; docker run -it --rm --name verdaccio \
  -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

可以看到已经启动起来了

![img](https://image.antoncook.xyz/picGo/verdaccio-docker.4f5f3a9a.png)

### npm 方式安装

1. Nodejs 环境下全局安装 verdaccio

```text
npm install -g verdaccio --unsafe-perm
```

加上 -–unsafe-perm 的原因是防止报 grywarn 权限的错。

2. 修改配置文件

verdaccio 的特点是，你在哪个目录运行，它的就会在对应的目录下创建自己的文件。目录下默认有两个文件：config.yaml 和 storage，htpasswd 是添加用户之后自动创建的。

打开默认启动的 config.yaml 文件：

```text
vim /root/.config/verdaccio/config.yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    max_users: -1
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
  cnpm:
    url: https://registry.npm.taobao.org
packages:
  "@aemp/*":
    access: $authenticated
    publish: $authenticated
    unpublish: $authenticated
  "@*/*":
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: cnpm
  "**":
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: cnpm
```

access 是访问权限控制，总共有三种身份：所有人($all)、匿名用户($anonymous)、认证(登陆)用户($authenticated)。

3. 对外开放 4873 端口

verdaccio 继承了 sinopia，端口号 4873 依然不变。

```shell
firewall-cmd --state                 # 先查看防火墙状态，
service firewalld start              # 开启防火墙:
firewall-cmd --zone=public --add-port=4873/tcp –permanent  # 开放4873端口
firewall-cmd --reload                # 重新载入
firewall-cmd --zone=public --query-port=4873/tcp    # 查看是否添加成功
```

4. 启动 verdaccio

```text
verdaccio
```

5. pm2 守护 verdaccio 进程

安装 pm2：

```text
npm install -g pm2 --unsafe-perm
```

使用 pm2 启动 verdaccio：

```text
pm2 start verdaccio
```

查看 pm2 守护下的进程 verdaccio 的实时日志：

```text
pm2 show verdaccio
```

6. nginx 配置

```nginx
server {
	listen 443 ssl http2;
	server_name registry.xxx.com;
  
    # ssl
    ssl on;
    ssl_certificate cert.crt;
    ssl_certificate_key cert.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1.2 TLSv1.1 TLSv1; #SSL协议
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;#SSL加密算法
    ssl_prefer_server_ciphers on;

	location / {
        proxy_set_header    Host $host;
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto $scheme;
        proxy_pass          http://127.0.0.1:4873/;
        proxy_read_timeout  600;
        proxy_redirect off;
	 }

	 location ~ ^/verdaccio/(.*)$ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://127.0.0.1:4873/$1;
        proxy_redirect off;
    }
}
```

### 用户管理/私有包管理

1. 设置仓库源

```text
npm set registry http://localhost:4873
```

2. 添加用户

```text
npm adduser --registry http://localhost:4873
```

输入 username、password 以及 Email 即可

3. 登录

```text
npm login --registry http://localhost:4873
```

4. 上传私有包

```text
npm publish --registry http://localhost:4873
```