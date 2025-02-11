import childProcess from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";

export const gitAddCommander = (path = ".") => {
    childProcess.execSync(`git add ${path}`);
    console.log(chalk.red(`已执行 git add 指令: ${path}`));
};

export const gitStatusCommander = () => {
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
            console.log(chalk.green("本次提交有以下变更文件:"));
            console.table(changes);
        } else {
            console.log(chalk.red("无变更文件"));
        }
    } catch (err) {
        console.log(chalk.red("无法获取 git status:", err));
    }
};

export const gitCommitCommander = async () => {
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
        console.log(
            `已执行 git commit -am 指令: ${commitType}${commitMessage}`
        );
    } catch (error) {
        console.error("Failed to execute git commit:", error);
    }
};
