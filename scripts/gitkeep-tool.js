import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * 递归地检查目录中的空文件夹
 * 如果是空的，创建 .gitkeep 文件
 * 如果不是空的，删除 .gitkeep 文件
 *  */
export function gitKeepHandler(targetPath, ignoredDirectories) {
    const stats = fs.statSync(targetPath); // 获取文件信息
    // 如果不是目录，直接返回
    if (!stats.isDirectory()) return;
    // 跳过忽略的目录
    if (ignoredDirectories.includes(path.basename(targetPath))) return;

    const files = fs.readdirSync(targetPath);
    if (files.length === 0) {
        // 如果目录为空，创建 .gitkeep 文件
        const gitkeepPath = path.join(targetPath, '.gitkeep');
        fs.writeFileSync(gitkeepPath, '');
        console.log(chalk.green(`已创建 .gitkeep 文件：${gitkeepPath}`));
        return;
    }
    if (files.length === 1 && files[0] === '.gitkeep') {
        // 如果目录中只有.gitkeep 文件，无需处理
        return;
    }
    if (files.length > 1 && files.includes('.gitkeep')) {
        // 如果目录中有多个文件，且有.gitkeep 文件，删除.gitkeep 文件
        const gitkeepPath = path.join(targetPath, '.gitkeep');
        fs.unlinkSync(gitkeepPath);
        console.log(chalk.yellow(`已删除 .gitkeep 文件：${gitkeepPath}`));
        return;
    }

    // 遍历目录中的文件，递归调用 gitKeepHandler 函数
    files.forEach(file => gitKeepHandler(path.join(targetPath, file), ignoredDirectories));
}


