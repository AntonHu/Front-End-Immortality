import fs from 'fs';
import path from 'path';
import { gitAddCommander, gitStatusCommander, gitCommitCommander } from './gitScripts.js';
import chalk from 'chalk';

// 获取项目的根目录
const projectRoot = process.cwd();
// 拼接 docs 文件夹的路径
const docsPath = path.join(projectRoot, 'docs');

// 递归地检查目录中的空文件夹
function checkEmptyDirectories(dirPath) {
    const stats = fs.statSync(dirPath);
    // 如果不是目录，直接返回
    if (!stats.isDirectory()) return;
    // 只处理 docs 文件夹及其子文件夹
    // if (dirPath !== docsPath && !dirPath.startsWith(`${docsPath}${path.sep}`)) {
    //     return;
    // }

    const files = fs.readdirSync(dirPath);
    if (files.length === 0) {
        // 如果目录为空，创建 .gitkeep 文件
        const gitkeepPath = path.join(dirPath, '.gitkeep');
        fs.writeFileSync(gitkeepPath, '');
        console.log(chalk.green(`已创建 .gitkeep 文件：${gitkeepPath}`));
        return;
    }
    if (files.length === 1 && files[0] === '.gitkeep') {
        // 如果目录中只有.gitkeep 文件，直接返回
        return;
    }
    if (files.length > 1 && files.includes('.gitkeep')) {
        // 如果目录中有多个文件，且有.gitkeep 文件，删除.gitkeep 文件
        const gitkeepPath = path.join(dirPath, '.gitkeep');
        fs.unlinkSync(gitkeepPath);
        console.log(chalk.yellow(`已删除 .gitkeep 文件：${gitkeepPath}`));
        return;
    }
    // 遍历目录中的文件，递归调用 checkEmptyDirectories 函数
    files.forEach(file => checkEmptyDirectories(path.join(dirPath, file)));
}

// 调用函数检查项目docs目录下的空文件夹
checkEmptyDirectories(docsPath);
// 自动添加所有文件到 git

gitAddCommander()
gitStatusCommander()
gitCommitCommander()
