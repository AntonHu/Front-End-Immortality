# gulp+webpack打包实践



> 旧项目是使用**gulp**构建的react多页面应用，对ES6的支持不太友好，且无法进行模块化开发，最重要的是回调地狱实在可怕！！！
>
> 秉承不影响原有业务逻辑的原则，决定使用**gulp+webpack**对项目进行渐进式改造，让新的业务可以使用现代化的前端技术开发，后续再慢慢做webpack的迁移。



改造目标：大部分构建逻辑依然是gulp，js的打包交给webpack来做。

## 1. 配置babel支持es6+的语法和API

首先安装一些需要用到的依赖

```JavaScript
npm -i -D babel-preset-env  // 可以根据env配置支持的浏览器版本，自动预设目标浏览器需要的ES6+语法糖

npm -i -D babel-runtime babel-plugin-transform-runtime  // 提供API垫片，自动识别使用到的ES6+API并转译成ES5

npm -i -D babel-preset-react  // 支持react语法糖
```

## 2. 配置.babelrc文件

个人喜好，不喜欢把babel配置嵌入到webpack配置里，所以都写到.babelrc文件中，当使用到babel转译的时候，将自动读取你在这里的配置

```JavaScript
/* .babelrc */
/* 转译时，先顺序执行plugins，再倒序执行presets */

{
    "presets": [
        ["env", {
            "targets": {
                "browsers": ["last 2 versions", "ie >= 7"]  // ES6语法支持，主流浏览器最新的两个版本，及IE7+
            }
        }],
        ["react"]  // 支持react语法，JSX
    ],
    "plugins": [
        "transform-runtime"  // 提供ES6+API垫片
    ],
    "retainLines": true  // 保留行号，开发环境sourcemap使用
}
```

## 3.  安装Webpack

这里其实不是安装常规的webpack，而是webpack专为gulp提供的流式工具库**webpack-stream**，如果想直接用webpack也可以，只是gulp是流式的构建工具，webpack打包文件的输入输出，在gulp文件流间传递，对本人来说比较多盲点，折腾了一番，还是webpack-stream香！

```JavaScript
npm -i -D webpack-stream  // 安装webpack为gulp打造的流式工具库

// babel转译loader
// 因为项目中已有babel-core为6.0.15，babel-loader版本则必须7+
// 没有babel-core的同学请一并安装
npm -i -D babel-loader@7.1.5  
```

## 4. 配置Webpack

暂时把webpack的配置都写在这，这里将其封装成一个函数，接收一个**env**参数作为环境变量，以便后续拓展，可以对不同的环境进行不同的打包配置

```JavaScript
/* webpack.config.js */
export const webpackConfig = env => ({
    mode: env || 'development',  // 打包环境，后续拓展区分环境进行打包的配置
    modul
        rules: [{
            test: /\.jsx$/,  // 主要是对项目中的jsx文件进行转译
            exclude: /node_modules/,
            use: ['babel-loader']  // 转译
        }]
    },
    devtool: 'inline-source-map'  // webpack提供的sourceMap，这里设置成行内的，gulp的sourceMap可以不使用了
});
```

## 5. 使用Webpack打包js

这里使用到了vinyl-named这个插件，非必须，主要是命名输出路径，因为项目需求，打包的js需要输出到相同的路径下，于是使用这个工具来改变输出路径，具体可以看注释

```JavaScript
var webpack = require('webpack-stream');
var named = require('vinyl-named');
import { webpackConfig } from '../config/webpack.config.js';

gulp.task('jsx-js', function () {
    const config = webpackConfig();
    return gulp.src('app/scripts/jsx/**/*.jsx')
        .pipe($.cached('jsx-js'))
        .pipe($.plumber())
/* ------------------下面才是关键-------------------- */  

        /*  named回调中传入的file是一个vinyl对象，
            它里面有path和relative分别是完整路径和相对路径，
            通过把相对路径截取掉后缀名作为结果返回，
            就可以在原来不带相对路径的chunk名前加上相对路径，
            从而实现保持编译前的目录结构 */
        .pipe(named(file => {
            if (!file) return;
            console.log(file.path);
            return file.relative.slice(0, -path.extname(file.path).length);
        }))
        .pipe(webpack(config))
        
/* ------------------上面才是关键-------------------- */        
        .pipe($.plumber.stop())
        .pipe(gulp.dest('app/scripts/jsx'));
});
```

## 6. 至此项目已支持模块化开发

新的需求可以用现代化的技术栈进行开发，后续渐进重构整个项目到webpack也容易了许多