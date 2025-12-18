#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'js-yaml';
import chalk from 'chalk';

// 获取当前脚本的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 需要监控的目录
const POSTS_DIR_PATH = path.join(__dirname, '../src/content/posts');

// 支持的文件扩展名
const SUPPORTED_EXTENSIONS = ['.md'];

// 文件变化类型
const WATCH_EVENTS = ['change'];

/**
 * 从markdown内容中提取frontmatter
 * @param {string} content - markdown文件内容
 * @returns {Object} {frontmatter: Object, content: string, hasFrontmatter: boolean}
 */
function parseFrontmatter(content) {
  // 检查是否有frontmatter
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return {
      frontmatter: {},
      content: content,
      hasFrontmatter: false
    };
  }
  
  try {
    const frontmatter = YAML.load(match[1]);
    return {
      frontmatter: frontmatter,
      content: match[2],
      hasFrontmatter: true
    };
  } catch (error) {
    console.error(chalk.red(`解析frontmatter出错: ${error.message}`));
    return {
      frontmatter: {},
      content: content,
      hasFrontmatter: false
    };
  }
}

/**
 * 将frontmatter和内容合并为markdown格式
 * @param {Object} frontmatter - frontmatter对象
 * @param {string} content - markdown内容
 * @returns {string} 合并后的markdown内容
 */
function stringifyFrontmatter(frontmatter, content) {
  const yamlContent = YAML.dump(frontmatter, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false
  });
  
  return `---\n${yamlContent}---\n\n${content}`;
}

/**
 * 更新文件的修改时间
 * @param {string} filePath - 文件路径
 */
function updateFileModifiedTime(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const modifiedTime = stats.mtime;
    
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // 解析frontmatter
    const { frontmatter, content, hasFrontmatter } = parseFrontmatter(fileContent);
    
    // 如果文件没有frontmatter，跳过
    if (!hasFrontmatter) {
      return;
    }
    
    // 检查是否是草稿文件
    if (frontmatter.draft === true) {
      return;
    }
    
    // 检查是否需要更新
    const lastUpdated = frontmatter.updated ? new Date(frontmatter.updated) : null;
    
    // 如果文件已经被修改过，且上次更新时间早于文件的修改时间，则更新
    if (!lastUpdated || lastUpdated < modifiedTime) {
      // 更新frontmatter中的updated字段
      frontmatter.updated = modifiedTime;
      
      // 将更新后的内容写回文件
      const updatedContent = stringifyFrontmatter(frontmatter, content);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      
      console.log(chalk.green(`✓ 已更新: ${path.basename(filePath)}`));
    }
  } catch (error) {
    console.error(chalk.red(`处理文件出错 ${filePath}: ${error.message}`));
  }
}

/**
 * 批量更新目录下所有文件的修改时间
 */
function updateAllFiles() {
  console.log(chalk.blue('开始批量更新所有贴文的修改时间...'));
  
  // 检查目录是否存在
  if (!fs.existsSync(POSTS_DIR_PATH)) {
    console.error(chalk.red(`错误: 目录不存在: ${POSTS_DIR_PATH}`));
    return;
  }
  
  let updateCount = 0;
  
  // 递归遍历目录
  function walkDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        walkDirectory(filePath);
      } else if (SUPPORTED_EXTENSIONS.includes(path.extname(filePath))) {
        updateFileModifiedTime(filePath);
        updateCount++;
      }
    }
  }
  
  walkDirectory(POSTS_DIR_PATH);
  console.log(chalk.green(`批量更新完成! 共处理 ${updateCount} 个文件`));
}

/**
 * 监控文件变化并实时更新
 */
function watchFiles() {
  console.log(chalk.blue('开始监控文件变化...'));
  
  // 使用fs.watch监控目录
  fs.watch(POSTS_DIR_PATH, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    
    const filePath = path.join(POSTS_DIR_PATH, filename);
    const ext = path.extname(filePath);
    
    // 只处理支持的文件类型
    if (SUPPORTED_EXTENSIONS.includes(ext)) {
      // 延迟一点时间，确保文件已经完全写入
      setTimeout(() => {
        console.log(chalk.yellow(`检测到文件变化: ${filePath}`));
        updateFileModifiedTime(filePath);
      }, 1000);
    }
  });
}

// 主函数
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'watch':
      watchFiles();
      break;
    case 'update':
      updateAllFiles();
      break;
    default:
      console.log(chalk.blue('用法:'));
      console.log('  node update-timestamp.js update  - 批量更新所有贴文的修改时间');
      console.log('  node update-timestamp.js watch   - 监控文件变化并实时更新时间');
      process.exit(1);
  }
}

// 如果直接运行此脚本
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export {
  updateFileModifiedTime,
  updateAllFiles,
  watchFiles
};