import childProcess from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";

class GitCommander {
    constructor() {
        this.init()
    }
    init = () => {
        // 监听 SIGINT 信号（Ctrl+C）
        process.on('SIGINT', () => {
            console.log(chalk.yellow('\n检测到Ctrl+C。执行 git reset...'));
            this.reset();
            process.exit(0);
        });
    
        // 未捕获的异常处理
        process.on('uncaughtException', (err) => {
            console.error(chalk.red('未捕获的异常:', err));
            this.reset();
            process.exit(1);
        });
    }

    reset = () => {
        try {
            // 执行 git reset 命令
            const resetResult = childProcess.execSync(`git reset`);
            console.log(chalk.red(`已执行 git reset 指令：\n${resetResult.toString()}`));
            return true
        } catch (error) {
            console.error("执行 git reset 失败:", error);
            return false
        }
    };

    pull = (remote = "origin") => {
        try {
            // 执行 git pull 命令
            const pullResult = childProcess.execSync(`git pull ${remote}`);
            console.log(chalk.green(`已执行 git pull 指令：\n${pullResult.toString()}`));
            return true
        } catch (error) {
            this.reset();
            console.error("执行 git pull 失败:", error);
            return false
        }
    };
    
    add = (path = ".") => {
        try {
            // 执行 git add 命令
            const addResult = childProcess.execSync(`git add ${path}`);
            console.log(chalk.green(`已执行 git add 指令：\n${addResult.toString()}`));
            return true
        } catch (error) {
            this.reset();
            console.error("执行 git add 失败:", error);
            return false
        }
    };
    
    status = () => {
        try {
            const output = childProcess.execSync("git status").toString();
            const lines = output.split("\n");
            const changes = [];
    
            for (let line of lines) {
                line = line.trim();
                if (
                    line.startsWith("modified:") ||
                    line.startsWith("deleted:") ||
                    line.startsWith("new file:") ||
                    line.startsWith("renamed:") ||
                    line.startsWith("copied:") ||
                    line.startsWith("type change:")
                ) {
                    const changeParts = line.split(":");
                    if (changeParts.length >= 2) {
                        const changeType = changeParts[0].trim();
                        const fileName = changeParts.slice(1).join(":").trim();
                        changes.push({ 变动: changeType, 文件: fileName });
                    }
                }
            }
    
            if (changes.length > 0) {
                console.log(chalk.blue("本次提交有以下变更文件:"));
                console.table(changes);
                return true
            } else {
                this.reset();
                console.log(chalk.red("本次提交无变更文件"));
                return false
            }
        } catch (err) {
            this.reset();
            console.log(chalk.red("无法获取 git status:", err));
            return false
        }
    };
    
    commit = async () => {
        // 使用 inquirer 提示用户输入 commit message
        const answer = await inquirer.prompt([
            {
                type: "list",
                name: "commitType",
                message: chalk.blue("选择本次提交的类型:"),
                choices: [
                    "【功能】",
                    "【BUG】",
                    "【维护】",
                    "【测试】",
                    "【规范】",
                    "【文档】",
                    "【重构】",
                ],
                default: "【维护】",
            },
            {
                type: "input",
                name: "commitMessage",
                message: chalk.blue("请输入commit message:"),
                validate: (input) => {
                    if (input.trim().length === 0) {
                        return "不能提交空的 commit message";
                    }
                    return true;
                },
            },
        ]);
    
        // 提取用户输入的 commit message
        const { commitMessage, commitType } = answer;
    
        try {
            // 执行 git commit 命令
            childProcess.execSync(`git commit -am "${commitType}${commitMessage}"`);
            console.log(chalk.green(
                `已执行 git commit -am 指令: ${commitType}${commitMessage}`
            ));
            return true
        } catch (error) {
            this.reset();
            console.error("执行 git commit 失败:", error);
            return false
        }
    };
    
    push = async (remote = "origin") => {
        // 使用 inquirer 提示用户输入 commit message
        const answer = await inquirer.prompt([
            {
                type: "input",
                name: "ifPush",
                message: chalk.blue("是否要推送到远程,默认是(Y/N):"),
                validate: (input) => {
                    if (input.trim() !== "" && input.trim() !== "Y" && input.trim() !== "N") {
                        return "请输入 Y 或 N";
                    }
                    return true;
                },
                default: "Y",
            },
        ]);
    
        const { ifPush } = answer;
        if (ifPush !== "Y") {
            console.log(chalk.red("请自行推送到远程仓库"));
            return;
        }
        try {
            // 执行 git push 命令
            const pushResult = childProcess.execSync(`git push ${remote}`);
            console.log(chalk.green(`已执行 git push 指令：\n${pushResult.toString()}`));
            return true
        } catch (error) {
            this.reset();
            console.error("执行 git push 失败:", error);
            return false
        }
    };
}

export default GitCommander