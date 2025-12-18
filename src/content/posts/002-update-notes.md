---
title: 博客更新日志
published: 2025-12-18
description: '博客前后端更新记录'
image: ''
tags: [更新日志, 版本记录]
category: '博客'
draft: false
lang: 'zh'
---

# NaN - 0x01

记录博客系统的功能更新与优化历程。

::github{repo="kwensiu/mSpace"}

---

<details>
<summary>v1.0.10 - 2025-12-18 - [大图查看]</summary>

```
feat(image): 为 ImageWrapper 添加 PhotoSwipe 支持及相关属性

feat(layout): 扩展 PhotoSwipe 配置并支持 Banner 图片展示
```

</details>

<details>
<summary>v1.0.9 - 2025-12-18</summary>

```
fix(Dock): 调整Dock组件隐藏状态，调整Dock暗色以及搜索栏背景色，以提高可视度
feat(posts): 重命名文章文件名并调整分类标签
- 同时调整了部分页面的Tag与分类
```

</details>

<details>
<summary>v1.0.8 - 2025-12-18</summary>

```
docs: 添加 Biome 格式化代码记录文章
docs: 添加更新日志板块，并为导航页添加链接
docs: 更新软件推荐贴文内容
refactor(dock): run `pnpm format`
refactor(dock): 手动执行Biome相关命令格式化代码
```

</details>

<details>
<summary>v1.0.7 - 2025-12-18</summary>

```
feat(dock): 优化 dock 组件交互与样式

- 为 Svelte 文件添加 VSCode 格式化配置
- 重构 Dock.svelte 组件逻辑和结构，提升可读性
- 修改滚动判断逻辑，改善 dock 显示/隐藏体验
- 替换主页导航方式为 swup 平滑跳转
- 更新图标大小及按钮圆角样式，统一视觉风格
- 改进 DockColorSettings 和 DockSearch 组件细节
- 实现搜索面板动态宽度调整功能
- 增强搜索结果展示与键盘交互支持
- 修复部分 DOM 操作和事件监听器清理问题
```

</details>

<details>
<summary>v1.0.6 - 2025-12-18</summary>

```
docs(posts): 更新导航页描述和内容
```

</details>

<details>
<summary>v1.0.5 - 2025-12-18 - [添加Dock]</summary>

```
feat(dock): 添加底部悬浮 Dock 组件及搜索、主题切换功能

新增了一个基于 Svelte 的底部悬浮 Dock 组件，包含以下特性：
- 滚动时自动显示/隐藏
- 集成搜索面板入口（DockSearch）
- 集成颜色设置面板入口（DockColorSettings）
- 支持亮色/暗色/自动模式切换
- 包含返回顶部按钮与主页跳转链接

同时调整了主布局结构以引入该组件，并为防止移动端 Footer 与 Dock 冲突，
在 MainGridLayout 中增加了底部内边距。
```

</details>

<details>
<summary>v1.0.4 - 2025-12-18 - [Navbar模糊]</summary>

```
feat(navbar): 更新Navbar样式并优化动画效果

- 将 `#navbar` 的类名从 `onload-animation` 更改为 `navbar-slide`，并添加滑入动画
- 更新Navbar背景样式，增加毛玻璃效果与边框
- 调整 `.float-panel` 圆角大小，并新增 `.navbar` 样式定义
- 在 Tailwind 配置中扩展 backdrop blur 和高度工具类
- 修改站点标题
- 移除文章页底部mb-4
```

</details>

<details>
<summary>v1.0.3 - 2025-12-16</summary>

```
feat(astro): 更新部署配置以支持 GitHub Pages
```

</details>

<details>
<summary>v1.0.2 - 2025-12-16</summary>

```
build(astro): 更新站点配置中的 vercel 部署地址
```

</details>

<details>
<summary>v1.0.1 - 2025-12-16</summary>

```
小小的更新

- 更新settings.json
- 改进搜索面板行为与焦点控制
- Never Gonna Give You Up
- 调整 Profile 卡片布局与响应式样式
- 更新文章分类与草稿状态
- 移除 GitHub 链接导航项
```

</details>

<details>
<summary>v1.0.0 - 2025-12-16 - [部署] </summary>

```
世界加载完成：现已支持 Vercel 快递直达

- 为世界注入了 Vercel 配置
```

</details>

<details>
<summary>v0.0.2 - 2025-12-16</summary>

```
正在初始化世界: 生成个性化内容

- 可爱的东西正在涌现，Ciallo
- 似乎混入了外来之物
- 创世者初具人形
- 有东西被藏匿了...它们在哪
```

</details>

<details>
 <summary>v0.0.1 - 2025-12-16</summary>

```
正在初始化世界: 调整世界生成类型

- 现在全世界都在讲中国话
- 世界变得更加锐利
- 事物被赋予了顶置功能
- 微调日夜更替的构架
- 为基岩添加了更多依赖
```

</details>