import { gitKeepHandler } from './gitkeep-tool.js'
import GitCommander from './git-tool.js';

// 获取项目的根目录
const projectRoot = process.cwd();
// 需要忽略的目录
const ignoredDirectories = ['node_modules', '.git', 'dist'];

// 空文件夹处理
gitKeepHandler(projectRoot, ignoredDirectories)

// 自动推送
async function autoPush() {
    const gitCommander = new GitCommander();
    const pullResult = await gitCommander.pull();
    const addResult = pullResult && gitCommander.add();
    const statusResult = addResult && gitCommander.status();
    const commitResult = statusResult && await gitCommander.commit();
    commitResult && await gitCommander.push();
}

autoPush()
