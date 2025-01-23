import fs from "fs";
import path from "path";
import { DefaultTheme } from "vitepress";

type SideBar = DefaultTheme.Config["sidebar"];

const HOME_PAGE = "index.md";
const STATIC_DIRECTORY = "public";

// 定义要遍历的目录
const docsDir = path.join(__dirname, "../../docs");

// 递归生成嵌套结构
function buildNestedStructure(dir) {
  const result: SideBar = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && path.basename(file) !== STATIC_DIRECTORY) {
      // 如果是目录，递归处理，排除 public 目录
      const nestedItems = buildNestedStructure(filePath);
      result.push({
        text: file, // 目录名
        collapsed: false, // 默认展开
        items: nestedItems, // 嵌套的子项
      });
    } else if (
      stat.isFile() &&
      path.extname(file) === ".md" &&
      path.basename(file) !== HOME_PAGE
    ) {
      // 如果是 Markdown 文件，生成链接，排除首页
      const relativePath = path.relative(docsDir, filePath).replace(/\\/g, "/"); // 统一路径分隔符
      const fileNameWithoutExt = path.basename(file, path.extname(file)); // 去掉后缀
      const link = `/${relativePath.replace(/\.md$/, "")}`; // 生成链接

      result.push({
        text: fileNameWithoutExt, // 文件名（去掉后缀）
        link: link, // 文件链接
      });
    }
  });

  return result;
}

export const getSidebars = () => {
  // 生成嵌套结构
  const nestedStructure = buildNestedStructure(docsDir);
  // 输出结果
  // console.log(JSON.stringify(nestedStructure));
  return nestedStructure;
};
