import fs from 'fs';
import path from 'path';
import GitCommander from './gitScripts.js';
import chalk from 'chalk';

// 获取项目的根目录
const projectRoot = process.cwd();
// 需要忽略的目录
const ignoredDirectories = ['node_modules', '.git'];

// 递归地检查目录中的空文件夹
function checkEmptyDirectories(dirPath) {
    const stats = fs.statSync(dirPath);
    // 如果不是目录，直接返回
    if (!stats.isDirectory()) return;
    // 跳过忽略的目录
    if (ignoredDirectories.includes(path.basename(dirPath))) return

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

// 调用函数检查项目根目录下的空文件夹
checkEmptyDirectories(projectRoot);
// 自动添加所有文件到 git

(async () => {
    const gitCommander = new GitCommander();
    const pullResult = await gitCommander.pull()
    const addResult = pullResult && gitCommander.add()
    const statusResult = addResult && gitCommander.status()
    const commitResult = statusResult && await gitCommander.commit()
    commitResult && await gitCommander.push()
})()

