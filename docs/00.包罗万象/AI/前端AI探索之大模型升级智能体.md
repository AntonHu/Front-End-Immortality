# 前端AI探索之大模型升级智能体

在使用语言大模型时，AI只能通过文字告诉你怎么做，却不能帮你执行，例如生成的代码或文档，你只能手动复制到需要用的地方，粘贴格式还可能错乱。

通过使用 **MCP** 和 **LangChain** ，我们可以给大模型赋能，让大模型拥有实操的能力，不只是纸上谈兵，这种有实操能力的大模型，我们也称它为智能体。

作为一名前端，本篇章就将使用 **Nodejs** 通过 **MCP** 实现一个 **“会上网”** 的智能体，再通过 **LangChain** 实现一个会 **“写文档”** 的智能体。

## 概念

首先介绍一下 **MCP**和 **LangChain** 是什么：

**MCP**（Model Context Protocol，模型上下文协议）是由 Anthropic 公司于 2024 年 11 月提出的开放标准，旨在标准化大型语言模型（LLM）与外部数据源和工具之间的通信。它类似于 AI 世界的“USB-C 接口”，为 AI 应用提供了一种标准化的方式，连接到不同的数据源和工具，例如文件系统、数据库、API 等。

**LangChain** 是一个用于构建基于大语言模型（LLM）应用的框架，旨在帮助开发者更高效地将 LLM（如 OpenAI 的 GPT、Hugging Face 的模型等）与外部工具、数据源和功能集成。它的核心思想是通过“链式调用”（Chains）将多个模块组合起来，实现复杂的任务。

## 区别

### 功能

#### **MCP（Model Context Protocol）**

- **目标**：为 LLM 提供一种标准化的方式，动态发现和调用外部工具、数据源或 API。
- **特点**：
  - **标准化协议**：MCP 是一个开放协议，定义了 LLM 与外部服务之间的通信规范。
  - **动态发现**：LLM 可以动态发现可用的工具和数据源，无需预先配置。
  - **双向通信**：支持 LLM 主动调用工具，也支持工具向 LLM 推送数据。
  - **安全与隔离**：敏感数据（如 API Key）由用户管理，确保安全性。
  - **轻量级**：MCP 服务器是轻量级程序，易于部署和集成。
- **适用场景**：适合需要标准化、模块化和安全性的场景，尤其是本地优先设计。

#### **LangChain 的 Function Calling**

- **目标**：通过函数调用（Function Calling）机制，让 LLM 能够与外部工具或 API 交互。
- **特点**：
  - **框架集成**：LangChain 是一个框架，提供了 Function Calling 的实现，开发者可以自定义函数。
  - **预定义函数**：开发者需要预先定义函数，LLM 通过提示词（prompt）或工具描述调用这些函数。
  - **灵活性**：支持多种工具和 API 的集成，但需要开发者手动配置。
  - **生态系统**：LangChain 提供了丰富的工具链（如检索、记忆、代理等），适合构建复杂的 AI 应用。
- **适用场景**：适合需要灵活性和复杂功能的场景，尤其是构建端到端的 AI 应用。

### 设计理念

#### **MCP**

- **协议优先**：MCP 是一个协议，定义了 LLM 与外部服务之间的通信规范，类似于 USB-C 的标准化接口。
- **动态性**：MCP 强调动态发现和调用，LLM 无需预先知道工具的具体细节。
- **本地优先**：MCP 的设计适合本地部署，确保数据安全和隐私。

#### **LangChain**

- **框架优先**：LangChain 是一个框架，提供了 Function Calling 的实现，开发者需要在框架内定义和配置工具。
- **预定义性**：LangChain 的 Function Calling 需要开发者预先定义函数和工具，LLM 通过提示词调用这些工具。
- **灵活性**：LangChain 提供了丰富的功能和工具链，适合构建复杂的 AI 应用。

------

### 实现方式

#### **MCP**

- **协议实现**：MCP 通过 JSON-RPC 2.0 进行通信，支持标准输入输出（stdio）和基于 SSE 的 HTTP 通信。
- **轻量级服务器**：MCP 服务器是轻量级程序，负责暴露特定功能或数据源。
- **动态发现**：LLM 可以动态发现可用的工具和数据源，无需预先配置。

#### **LangChain**

- **框架实现**：LangChain 通过 Python 或 JavaScript 实现 Function Calling，开发者需要定义函数并配置工具。
- **工具链集成**：LangChain 提供了丰富的工具链（如检索、记忆、代理等），开发者可以灵活组合这些工具。
- **预定义函数**：开发者需要预先定义函数，LLM 通过提示词调用这些函数。

------

### 适用场景

#### **MCP**

- **标准化集成**：适合需要标准化、模块化和安全性的场景，尤其是本地优先设计。
- **动态调用**：适合需要动态发现和调用工具的场景，例如 IDE 插件、客户支持系统等。
- **轻量级部署**：适合需要轻量级部署的场景，例如本地文件系统、数据库等。

#### **LangChain**

- **复杂应用**：适合需要构建复杂 AI 应用的场景，例如聊天机器人、知识库系统等。
- **灵活性需求**：适合需要灵活性和自定义功能的场景，例如多工具链集成、记忆机制等。
- **端到端开发**：适合需要端到端开发的场景，例如从数据检索到生成完整响应的流程。

------

### 总结

|     特性     |             MCP              | LangChain Function Calling |
| :----------: | :--------------------------: | :------------------------: |
| **设计目标** | 标准化 LLM 与外部服务的交互  |   提供灵活的函数调用机制   |
|  **动态性**  |    支持动态发现和调用工具    |      需要预先定义函数      |
|  **安全性**  |      强调数据安全和隔离      |      依赖开发者的配置      |
| **实现方式** |   基于 JSON-RPC 2.0 的协议   |   基于框架的函数调用实现   |
| **适用场景** | 标准化、模块化、本地优先设计 |  复杂 AI 应用、端到端开发  |

## 实践

下面就开始进入实战

### MCP Puppeteer

使用该服务可以让大模型拥有启动无头浏览器的能力，能实现模拟网页操作、截图、爬虫等工作，对前端而言可应用到UI自动化测试。

本案例在Cline中演示使用效果，你也可以在支持MCP的Cursor，Winsurf等地方使用，或者提供API给自己的模型调用。

#### 完整代码

https://github.com/AntonHu/AI-Explore/blob/main/src/MCP/anton-puppeteer.ts

#### 核心实现

##### 安装工具库

```bash
pnpm add @modelcontextprotocol/sdk puppeteer
```

##### 创建服务

```ts
// 创建 MCP Server 实例
const server = new Server(
  {
    name: "anton-puppeteer", // MCP Server 名称
    version: "0.1.0", // MCP Server 版本
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);
```

##### 定义工具

```ts
import { Tool } from "@modelcontextprotocol/sdk/types.js";

// 定义工具列表
const TOOLS: Tool[] = [
  {
    name: "puppeteer_navigate",
    description: "导航到指定的 URL",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string" },
      },
      required: ["url"],
    },
  },
  // ...
]


server.setRequestHandler(ListToolsRequestSchema, async () => ({
  // 列出所有可用工具
  tools: TOOLS,
}));
```

##### 工具调用

```ts
/**
 * 处理工具调用
 * @param {string} name 工具名称
 * @param {any} args 工具参数
 * @returns {Promise<CallToolResult>} 返回工具调用的结果
 */
async function handleToolCall(
  name: string,
  args: any
): Promise<CallToolResult> {
  const page = await ensureBrowser(); // 确保浏览器实例存在

  switch (name) {
    case "puppeteer_navigate":
      // 导航到指定的 URL
      await page.goto(args.url);
      return {
        content: [
          {
            type: "text",
            text: `Navigated to ${args.url}`,
          },
        ],
        isError: false,
      };
     // ...
  }
}

server.setRequestHandler(CallToolRequestSchema, async (request) =>
  // 处理工具调用
  handleToolCall(request.params.name, request.params.arguments ?? {})
);
```

##### 启动服务

````ts
/**
 * 运行 MCP Server
 */
async function runServer() {
  const transport = new StdioServerTransport(); // 创建 StdioServerTransport 实例
  await server.connect(transport); // 连接到 transport
}

runServer().catch(console.error); // 运行 server，如果出错则打印错误信息
````

#### 成品效果

与模型对话，要求其打开B站获取首屏的视频信息：

![image-20250315025108348](https://image.antoncook.xyz/picList/2025/03/9865af9ac32fb95242bb2ad51fb6314f.webp)

模型会自己使用puppeteer的可用工具，打开网页，分析网页的元素结构，并编写js脚本来获取我指定的信息，最终整理成 JSON：

![image-20250315025240909](https://image.antoncook.xyz/picList/2025/03/465701958573c4b02d340a8fc0dee7c2.webp)

### LangChain 文件管家AI应用

让大模型具备本地读写的能力，例如通过对话让大模型访问你授权的目录，进行文件编辑。

#### 完整代码

https://github.com/AntonHu/AI-Explore/tree/main/src/langchain/file-LLM

#### 核心实现

##### 安装工具库

```bash
pnpm add @langchain/ollama @langchain/core
```

##### 定义工具

```js
/**
 * 读取指定文件的内容
 * @param {string} filePath - 文件的路径
 * @returns {Promise<string>} - 文件内容
 */
class ReadFile extends Tool {
  name = "read_file";
  description = "读取指定路径的文件内容";

  async _call(input) {
    const { path: filePath } = JSON.parse(input);
    try {
      const absolutePath = path.resolve(filePath); // 将路径解析为绝对路径
      const content = await fs.promises.readFile(absolutePath, "utf-8");
      return content;
    } catch (error) {
      throw new Error(`读取文件失败: ${error.message}`);
    }
  }
}

// 创建工具实例
export default [
  new ReadFile()
];
```

##### 设定模板

```js
import tools from "./tools.js";

export const functionCallTemplate = `你是一个智能助手，可以根据用户需求调用工具。以下是可用工具：
${tools.map((item) => `-${item.name}: ${item.description}`).join("\n")}

用户问题：{question}
请根据问题选择合适的工具并返回一个JSON数据格式的结果:
{ name: 工具名称, args: { 参数名: 参数值 } }
`;
```

##### 集成工具

```js
import { ChatOllama } from "@langchain/ollama";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOllama({
  model: "deepseek-coder-v2",
  temperature: 0.1,
  verbose: false,
});

// 绑定工具
const modelWithTools = model.bindTools(tools);
```

##### 工具调用

```js
async function chatWithModel() {
  // ...
  // 调用模型
   const response = await modelWithTools.invoke([new HumanMessage(userInput)]);
   if (response && response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];
      const toolName = toolCall.name;
      const toolInput = toolCall.args;
      const tool = tools.find((t) => t.name === toolName);

      if (tool) {
        const toolResult = await tool._call(JSON.stringify(toolInput));
        const response = await model.invoke([
          new HumanMessage(
            `根据用户提问 ${userInput}，你使用工具 ${toolName} 获得了结果：${toolResult}，请整理成易于理解的回答。`
          ),
        ]);
        console.log(response.content);
      } else {
        console.log(`未找到工具: ${toolName}`);
      }
  }
  // ...
}
```

#### 成品效果

##### 理解文件内容

![image-20250315042125340](https://image.antoncook.xyz/picList/2025/03/8d0e46e2f60e0d9e6cf70010de4dfa04.webp)

##### 获取项目结构

![image-20250314232208205](https://image.antoncook.xyz/picList/2025/03/f7f7b8d609cce2845cdfee6427a370d8.webp)

## 总结

到这你已经掌握如何用Node为大模型赋能，定制自己的AI智能体、AI应用了。有了这个能力之后，相信你的AI大有可为，有什么好的想法和整活，欢迎评论区讨论