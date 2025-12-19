---
title: 博客更新日志
published: 2025-12-18T00:00:00.000Z
updated: 2025-12-18T15:17:16.000Z
description: 博客前后端更新记录
image: ''
tags:
  - 更新日志
  - 版本记录
category: 博客
draft: false
lang: zh
---

# NaN - 0x01

记录博客系统的功能更新与优化历程。

::github{repo="kwensiu/mSpace"}

---

<details>
<summary>v1.0.14 - 2025-12-19 - [Dock重构]</summary>

feat(dock): 重构 Dock 相关组件并增强可配置性，完善CN/EN文档介绍Dock组件

- 引入 config 对象统一管理滚动阈值和导航路径，提升组件灵活性
- 简化滚动逻辑，仅在滚动超过设定阈值时显示 Dock
- 优化 Dock 样式类名与结构，改进响应式表现和视觉效果
- 重构搜索组件逻辑，增加节流控制和空值检查以提高性能与稳定性
- 更新组件文档，提供完整集成指南与自定义配置说明

</details>

<details>
<summary>v1.0.13 - 2025-12-18 </summary>

feat(ImageWrapper): 修复大图查看下意外出现的透明容器导致的放大问题
feat(image-viewer): 尝试修复图片查看器滚轮会上下滑动而非缩放的问题
fix: 执行命令 `pnpm exec biome check --write --unsafe` 格式化
posts:为biome-formatter贴文添加cover

</details>

<details>
<summary>v1.0.12 - 2025-12-18 </summary>

refactor(dock): 将 Dock 组件的*颜色*与*亮暗色*按钮改为*归档*与*关于*页面  
feat(image-viewer): 尝试修复图片查看器滚轮会上下滑动而非缩放的问题  

</details>

<details>
<summary>v1.0.11 - 2025-12-18</summary>

feat(post): 调整文章卡片与元数据显示样式及布局  

- 将置顶标签从文章卡片中移至新位置并调整样式
- 为 PostMeta 组件新增 `alignRight` 属性以支持内容右对齐
- 更新图标大小与文本字体大小，优化移动端显示效果
- 调整更新时间显示位置，并使用新的图标样式
- 修改部分样式类名与间距，统一设计风格
- 更新文章文件中的 published 和 updated 时间格式
- 修正页面底部导航按钮布局问题
- 微调 CSS 样式变量，提升视觉一致性

</details>

<details>
<summary>v1.0.10 - 2025-12-18 - [大图查看]</summary>

feat(image): 为 ImageWrapper 添加 PhotoSwipe 支持及相关属性  
feat(layout): 扩展 PhotoSwipe 配置并支持 Banner 图片展示  
feat(posts): 添加updated字段显示贴文更新日期  
fix(posts): 修改文章页面底部导航按钮布局  

</details>

<details>
<summary>v1.0.9 - 2025-12-18</summary>

fix(Dock): 调整Dock组件隐藏状态，调整Dock暗色以及搜索栏背景色，以提高可视度  
feat(posts): 重命名文章文件名并调整分类标签  
- 同时调整了部分页面的Tag与分类  

</details>

<details>
<summary>v1.0.8 - 2025-12-18</summary>

docs: 添加 Biome 格式化代码记录文章  
docs: 添加更新日志板块，并为导航页添加链接  
docs: 更新软件推荐贴文内容  
refactor(dock): run `pnpm format`  
refactor(dock): 手动执行Biome相关命令格式化代码  

</details>

<details>
<summary>v1.0.7 - 2025-12-18</summary>

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

</details>

<details>
<summary>v1.0.6 - 2025-12-18</summary>

docs(posts): 更新导航页描述和内容  

</details>

<details>
<summary>v1.0.5 - 2025-12-18 - [添加Dock]</summary>

feat(dock): 添加底部悬浮 Dock 组件及搜索、主题切换功能  
- 滚动时自动显示/隐藏
- 集成搜索面板入口（DockSearch）
- 集成颜色设置面板入口（DockColorSettings）
- 支持亮色/暗色/自动模式切换
- 包含返回顶部按钮与主页跳转链接

</details>

<details>
<summary>v1.0.4 - 2025-12-18 - [Navbar模糊]</summary>

feat(navbar): 更新Navbar样式并优化动画效果  

- 将 `#navbar` 的类名从 `onload-animation` 更改为 `navbar-slide`，并添加滑入动画
- 更新Navbar背景样式，增加毛玻璃效果与边框
- 调整 `.float-panel` 圆角大小，并新增 `.navbar` 样式定义
- 在 Tailwind 配置中扩展 backdrop blur 和高度工具类
- 修改站点标题
- 移除文章页底部mb-4

</details>

<details>
<summary>v1.0.3 - 2025-12-16</summary>

feat(astro): 更新部署配置以支持 GitHub Pages  

</details>

<details>
<summary>v1.0.2 - 2025-12-16</summary>

build(astro): 更新站点配置中的 vercel 部署地址  

</details>

<details>
<summary>v1.0.1 - 2025-12-16</summary>

小小的更新

- 更新settings.json
- 改进搜索面板行为与焦点控制
- Never Gonna Give You Up
- 调整 Profile 卡片布局与响应式样式
- 更新文章分类与草稿状态
- 移除 GitHub 链接导航项

</details>

<details>
<summary>v1.0.0 - 2025-12-16 - [部署] </summary>

世界加载完成：现已支持 Vercel 快递直达

- 为世界注入了 Vercel 配置

</details>

<details>
<summary>v0.0.2 - 2025-12-16</summary>

正在初始化世界: 生成个性化内容

- 可爱的东西正在涌现，Ciallo
- 似乎混入了外来之物
- 创世者初具人形
- 有东西被藏匿了...它们在哪

</details>

<details>
 <summary>v0.0.1 - 2025-12-16</summary>

正在初始化世界: 调整世界生成类型

- 现在全世界都在讲中国话
- 世界变得更加锐利
- 事物被赋予了顶置功能
- 微调日夜更替的构架
- 为基岩添加了更多依赖

</details>