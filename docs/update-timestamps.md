# 自动更新贴文时间戳功能

本项目支持自动更新贴文的"最后修改时间"(updated)字段，确保读者能够看到最新的内容信息。

## 功能概述

- 自动检测贴文的最后修改时间
- 更新frontmatter中的`updated`字段
- 自动跳过草稿文件(draft: true)
- 仅处理`src/content/posts`目录下的文件
- 支持手动更新和自动监控两种模式

## 使用方法

### 1. 手动更新所有贴文时间戳

```bash
pnpm update-timestamps
```

或者直接运行：

```bash
node scripts/update-timestamp.js update
```

### 2. 监控文件变化并实时更新

```bash
pnpm watch-timestamps
```

或者直接运行：

```bash
node scripts/update-timestamp.js watch
```

### 3. 构建时自动更新

项目已配置`prebuild`钩子，每次构建时会自动运行时间戳更新：

```bash
pnpm build
```

构建过程如下：
1. 自动更新所有贴文的时间戳
2. 执行Astro构建
3. 运行Pagefind搜索索引生成

## 工作原理

### 更新逻辑

- 脚本会比较文件的最后修改时间和frontmatter中的`updated`字段
- 如果文件没有`updated`字段或`updated`时间早于文件修改时间，则会更新
- 草稿文件(draft: true)会被自动跳过
- 更新时间为文件的最后修改时间，使用ISO 8601格式

### 目录限制

脚本仅处理`src/content/posts`目录下的Markdown文件，不会影响其他目录中的文件。

### 显示逻辑

- `src/components/PostMeta.astro`组件负责显示更新时间
- 只有当更新时间与发布时间不同时，才会显示更新时间
- 使用编辑图标与发布时间区分

## GitHub Actions集成

项目包含GitHub Actions工作流(`.github/workflows/update-timestamps.yml`)，可在以下情况自动更新时间戳：

- 推送到主分支
- 创建针对主分支的拉取请求

工作流程：
1. 检出仓库
2. 安装依赖
3. 更新时间戳
4. 提交更改(如果有)
5. 构建项目
6. 上传构建产物

## 注意事项

1. **文件格式**：只处理有frontmatter的Markdown文件
2. **草稿跳过**：标记为`draft: true`的文件会被跳过
3. **时间格式**：使用ISO 8601格式的时间戳，如`2025-12-18T13:48:14.306Z`
4. **手动编辑**：也可以手动在frontmatter中添加或修改`updated`字段

## 故障排除

如果遇到问题，可以尝试以下解决方案：

1. 确保Node.js版本兼容
2. 检查文件权限是否允许读写
3. 确认frontmatter格式正确(YAML格式)
4. 查看控制台输出的错误信息