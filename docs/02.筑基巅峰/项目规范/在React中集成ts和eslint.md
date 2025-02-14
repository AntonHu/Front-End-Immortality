# 在React中集成ts和eslint

> 当我们想要在typescript项目开发中用到代码提示和约束，我们有两个选择：eslint和tslint。tslint只可以用在typescript环境，而eslint在JS和TS环境都可以使用。
>
> 同时，在TypeScript 2019
>
> Roadmap中，TypeScript团队提到他们将会弃用tslint，全面投入eslint和ts的集成。所以在2019年我们应该选择TypeScript+Eslint的组合。 那么，具体应该怎么配置呢？

## 1. 配置eslint

### 1.1 首先安装依赖：

```Bash
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

说明：

eslint: eslint核心库

@typescript-eslint/parser: 解析器，允许eslint解析typescript代码

@typescript-eslint/eslint-plugin: 包含了typescript需要的一堆rules的插件

### 1.2. 在项目的根目录下添加.eslintrc.js

```JavaScript
module.exports =  {
  parser:  '@typescript-eslint/parser', 
  extends:  [
    'plugin:@typescript-eslint/recommended',
  ],
 parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  'module',
  },
  rules:  {
  },
};
```

在typescript和react的项目中，我们还需要用到eslint-plugin-react插件：

```Bash
npm i -D eslint-plugin-react
```

然后修改上面的.estlintrc.js:

```JavaScript
module.exports =  {
  parser:  '@typescript-eslint/parser', 
  extends:  [
    'plugin:react/recommended', 
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions:  {
  ecmaVersion:  2018,
  sourceType:  'module',  
  ecmaFeatures:  {
    jsx:  true, 
  },
  },
  rules:  {
  },
  settings:  {
    react:  {
      version:  'detect',
    },
  },
};
```

这样，eslint的配置就完成了。我们就可以根据需要往rules里面添加我们需要的规则了。

具体的规则可以参考：typescript-eslint-rules

## 2. 集成prettier

prettier可以很好地和eslint配合，它在代码格式化上的功能非常强大。所以我们现在把prettier也集成进来。

### 2.1. 安装依赖：

```Bash
npm i -D prettier eslint-config-prettier eslint-plugin-prettier
```

说明：

prettier: prettier核心库

eslint-config-prettier: 将可能和prettier冲突的eslint规则禁用

eslint-plugin-prettier: 将prettier当成eslint的一个规则

### 2.2. 在项目根目录下添加.prettierrc.js

```JavaScript
module.exports =  {
  semi:  true,
  trailingComma:  'all',
  singleQuote:  true,
  printWidth:  120,
  tabWidth:  2,
};
```

### 2.3. 修改.eslintrc.js

```Plain
module.exports =  {
  parser:  '@typescript-eslint/parser', 
  extends:  [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended', 
  ],
  parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  'module', 
  },
  rules: {
  }
};
```

这样，我们就完美地把prettier也集成到我们的开发环境中了。

prettier的配置项可以参考：prettier options

## 3. 配置vscode

为了追求更好的开发体验，将我们的编辑器配置成自动运行eslint并且自动按照规则修复我们保存的代码是一种非常有用的方式。所以我们现在来配置一下vscode。

### 3.1 安装扩展

从vscode的扩展库里面找到eslint和prettier并且安装:

#### eslint:

![img](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=Y2EyMmFkNzEzYWE5NzNlNWQ3MjkwMWNiOTdiNzg1NTFfYnVZdGdRS0ZaVUVrRUNscmVvYWdlaHo5azJNQ0ZLT29fVG9rZW46T1c2VGI4TDI5b1RKNnp4QXkyQWNjYkk5bktnXzE3Mzk0NTM0MjY6MTczOTQ1NzAyNl9WNA)

#### prettier:

![img](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=NWIyZjc3N2U4ODFkNjM2MWNkZTQ4ZjBhN2ZjODE0MTFfSDhNeFlJQ2JiQU9pMUxySEg2eGRha1hLN0sxT3YzSVlfVG9rZW46VzQ1NWJwMmNQbzhadnF4a0N3MGNXM1VxbndkXzE3Mzk0NTM0MjY6MTczOTQ1NzAyNl9WNA)

### 3.2 配置

打开菜单：code / preferences / settings:

按照以下配置进行修改：

```JavaScript
  "javascript.updateImportsOnFileMove.enabled": "always",
  "javascript.implicitProjectConfig.experimentalDecorators": true,
  "javascript.validate.enable": false,
  "javascript.format.enable": false,
  "editor.formatOnSave": true,
  "prettier.eslintIntegration": true,
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    { "language": "typescript", "autoFix": true },
    { "language": "typescriptreact", "autoFix": true }
  ],
  "[javascript]": {
    "editor.formatOnSave": false
  },
  "[javascriptreact]": {
    "editor.formatOnSave": false
  },
  "[typescript]": {
    "editor.formatOnSave": false
  },
  "[typescriptreact]": {
    "editor.formatOnSave": false
  },
```

这样配置好了之后，当我们在保存一个ts/tsx/js/jsx文件时，vscode会自动根据项目配置的.eslintrc.js和.prettierrc.js帮我们格式化和修复代码。

## 4. 和git整合

为了保证整个团队里面的代码风格一致，也保证提交到git仓库的代码都是经过了eslint和prettier规则校验过的。我们需要在提交commit到git仓库之前，让eslint和prettier帮我们再做一次确认。

### 4.1 安装husky和lint-staged

```Bash
npm i -D husky lint-staged
```

### 4.2 配置package.json

在package.json中添加以下配置：

```JavaScript
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx,json,css,scss}": [
      "prettier --check src/**/*.ts",
      "prettier --check src/**/*.tsx",
      "eslint src/**/*.ts",
      "eslint src/**/*.tsx"
    ]
  },
```

这样，我们在提交代码的时候，git就会通过触发pre-commit钩子来执行lint-staged里面的配置，对我们的代码从prettier和eslint两方面进行校验，校验通过之后才可以提交，如果校验失败，会给出具体的提示，我们根据提示修改代码之后，再次提交，就可以了。

至此，我们整个开发环境就配置好了。开始愉快地coding吧！