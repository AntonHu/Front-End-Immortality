import fs from "fs";
import path from "path";

// 定义要遍历的目录
const docsDir = path.join(__dirname, "../../docs");

// 递归生成嵌套结构
function buildNestedStructure(dir) {
  const result = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 如果是目录，递归处理
      const nestedItems = buildNestedStructure(filePath);
      result.push({
        text: file, // 目录名
        collapsed: false, // 默认展开
        items: nestedItems, // 嵌套的子项
      });
    } else if (
      stat.isFile() &&
      path.extname(file) === ".md" &&
      path.basename(file) !== "index.md"
    ) {
      // 如果是 Markdown 文件，生成链接
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
  //   console.log(JSON.stringify(nestedStructure, null, 2));
  return nestedStructure;
};
