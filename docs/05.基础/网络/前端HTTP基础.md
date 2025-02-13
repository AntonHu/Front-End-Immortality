# 前端HTTP基础

## TCP

### 三次握手（创建连接）

客户端向服务端发起连接请求，一个带有SYN（sychronize）标志与连接序列号x的数据包

服务端收到连接请求，回复ACK确认号x+1确认收到，并携带SYN表示同意连接请求，y作为连接序列号

客户端收到SYN+ACK+y数据包，再回复ACK确认号y+1，连接建立

![1739455464714](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739455464714.jpg)

### 四次挥手（关闭连接）

客户端向服务端发起关闭信号FIN（finish），即不再发送请求但可以接收请求

服务端收到关闭请求，回复确认号ACK，此时还可继续发送请求

服务端不再需要发送请求后，发送关闭信号FIN

客户端收到服务端关闭信号，回复ACK确认号，关闭连接

![1739455436587](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739455436587.jpg)

## HTTP

### Header

#### Content-type

前端对发起的请求所携带的请求体的格式声明，告知后端如何处理接收到的数据：

* `application/json` json格式
* `application/x-www-form-urlencoded`

常用于简单文本表单提交，以url编码（序列化）的格式放在post请求的请求体中，并不是get请求那般拼接url

* `multipart/form-data`;boundary=----随机字符串

常用于复杂的携带文件的表单提交，表单数据以boundary分隔符隔开，boundary由请求库自动生成也可以自定义

```JavaScript
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

----WebKitFormBoundary7MA4YWxkTrZu0gW // 必须以--开头
Content-Disposition: form-data; name="username"

John
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="example.txt"
Content-Type: text/plain

(文件内容)
----WebKitFormBoundary7MA4YWxkTrZu0gW-- // 结尾加--表示表单的末尾
```

* `text/plain` 纯文本
* `text/html` html文档

#### Data-type

前端在请求库中设置(例如ajax的dataType属性)，告知后端，前端希望收到什么类型的响应数据

* `json`: 期望服务器返回JSON格式的数据。
* `xml`: 期望服务器返回XML格式的数据。
* `text`: 期望服务器返回纯文本数据。
* `html`: 期望服务器返回HTML文档。

### 状态码

### Https

#### SSL

### Http2.0
