---
title: 博客更新日志
published: 2025-12-18
updated: 2025-12-24
description: 博客前后端更新记录
image: ''
tags:
  - 更新日志
  - 版本记录
category: 博客
draft: false
---

# NaN - 0x01

记录博客系统的功能更新与优化历程。

::github{repo="kwensiu/blog"}

---

<details>
<summary>v0.0.26 - 2025-12-24 [MEGA39]</summary>

feat: 添加MEGA39游戏记录文章与相关图片内容
feat(writing): 完善写作页面功能，实际上更像一个格式生成器
feat(dock): 为Dock组件添加节流，并更新Dock文章

</details>

<details>
<summary>v0.0.25 - 2025-12-23</summary>

feat(css): 为post背景添加水彩渐变; 为blog背景添加网格装饰
fix(utils): 修复 part 贴文未正确隐藏的问题
fix(styl): 修复 User-Card 缺少的 Github 图标
fix(css): 调整 data-language 徽章的位置

</details>

<details>
<summary>v0.0.24 - 2025-12-23 [GitHub 用户卡片]</summary>

feat(expressive-code): 新增 GitHub 用户卡片样式  

- 使用新函数 GithubUserCardComponent 实现 Github 用户卡片
- 默认语法为 ::github{user="username"}
- 更新了 markdown-extended.md 介绍用法
- 为 markdown-extend.styl 添加相应样式
- 为 astro.config.mjs 导入组件

</details>

<details>
<summary>v0.0.23 - 2025-12-22</summary>

style(css): 调整 navbar 和 markdown 样式细节  

feat(PostCard): 修复PostCard样式与分隔线显示  

feat(components): 修复移动设备无法打开语言切换菜单  

fix(pnpm): 修复莫名奇妙的 @iconify/svelte 版本问题  

</details>

<details>
<summary>v0.0.22 - 2025-12-21 [完善i18n]|[Writing页面]|[hidden重构]|[...]</summary>

fix(posts): 调整文章的hidden与lang字段，更新部分文档  

feat(posts): 为hidden字段添加更多可选项  
- 将 `hidden` 字段类型从 boolean 更改为枚举：`"none" | "part" | "all"`
  - "none": 为默认回退值，不隐藏
  - "part": 不显示在主页，归档不重要贴文
  - "all": 不显示在主页与归档，通过搜索、URL等依然可以访问贴文
- 引入 `getArchivePosts` 和 `getArchivePostsList` 函数，用于处理归档页面中的文章
- 调整客户端过滤以适应新的隐藏值
- 在归档页面中，将 `getSortedPostsList` 重命名并更新其用法为 `getArchivePostsList`

fix(i18n): 将简体中文语言键的更正为 zh_CN，避免语言检测和选择出现不匹配的问题  

feat(i18n): 实现多语言支持及语言过滤逻辑  

- 支持从浏览器设置中检测语言
- 将默认语言配置为简体中文 (zh_CN)
- 添加语言切换器组件，带有图标和切换列表
  - 添加语言切换事件监听器和 DOM 更新
  - 实现客户端按语言过滤文章的功能，
  - 添加区域变体的语言规范化映射

- 更新 ArchivePanel，使其能够按语言和隐藏状态过滤文章
- 修改文章组件，使其能够处理语言和隐藏的 frontmatter 字段
- 调整文章卡片的样式
<div class="text-white/60">⚠️ 我的博客自定义了过滤逻辑，en文章将同时被展示在除了zh_CN以外的语言</div>

docs(posts): 更新项目引用链接  

feat(config): 更新站点配置为新域名和路径  

refactor(editor): 调整写作编辑器保存逻辑与上传接口地址  

feat(page): 实验性添加 "Writing" 页面  

feat(ImageWrapper): 为图片添加 fetchpriority 属性支持  

其他:  

- 更新 VS Code 扩展配置
- 修改部分贴文 lang & hidden 字段，
- 添加markdown.md、markdown-extended.md 以及 expressive-code.md原文档以及引用
- 重新开启颜色选择按钮
- 更新文档

</details>

<details>
<summary>v0.0.18 - 2025-12-20</summary>

feat(sytles): 完善文本横线的显示，用伪元素方式解决链接文本的虚线闪烁问题  

- 同时为extensions.json添加建议拓展方便同步

</details>

<details>
<summary>v0.0.17 - 2025-12-20</summary>

日常维护：

- 优化banner图片
- 删除Vercel部署残留文件
- 更新 Dock组件集成指南cn/en文档

</details>

<details>
<summary>v0.0.16 - 2025-12-20</summary>

日常维护:

- 微调内容与aria-label
- 为posts添加缺失的lang
- 压缩Banner图片优化加载

</details>

<details>
<summary>v0.0.15 - 2025-12-20</summary>

feat(PostMeta): 添加文章多语言版本支持与语言切换按钮  

docs(dock-component): 添加 Dock 组件集成指南的中英文文档  

- 同时优化了"更新日期"组件的显示

</details>

<details>
<summary>v0.0.14 - 2025-12-19 - [Dock重构]</summary>

feat(dock): 重构 Dock 相关组件并增强可配置性，完善CN/EN文档介绍Dock组件  

- 引入 config 对象统一管理滚动阈值和导航路径，提升组件灵活性
- 简化滚动逻辑，仅在滚动超过设定阈值时显示 Dock
- 优化 Dock 样式类名与结构，改进响应式表现和视觉效果
- 重构搜索组件逻辑，增加节流控制和空值检查以提高性能与稳定性
- 更新组件文档，提供完整集成指南与自定义配置说明

</details>

<details>
<summary>v0.0.13 - 2025-12-18 </summary>

feat(ImageWrapper): 修复大图查看下意外出现的透明容器导致的放大问题  

feat(image-viewer): 尝试修复图片查看器滚轮会上下滑动而非缩放的问题  

fix: 执行命令 `pnpm exec biome check --write --unsafe` 格式化  

posts:为biome-formatter贴文添加cover  

</details>

<details>
<summary>v0.0.12 - 2025-12-18 </summary>

refactor(dock): 将 Dock 组件的*颜色*与*亮暗色*按钮改为*归档*与*关于*页面  

feat(image-viewer): 尝试修复图片查看器滚轮会上下滑动而非缩放的问题  

</details>

<details>
<summary>v0.0.11 - 2025-12-18</summary>

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
<summary>v0.0.10 - 2025-12-18 - [大图查看]</summary>

feat(image): 为 ImageWrapper 添加 PhotoSwipe 支持及相关属性  

feat(layout): 扩展 PhotoSwipe 配置并支持 Banner 图片展示  

feat(posts): 添加updated字段显示贴文更新日期  

fix(posts): 修改文章页面底部导航按钮布局  

</details>

<details>
<summary>v0.0.9 - 2025-12-18</summary>

fix(Dock): 调整Dock组件隐藏状态，调整Dock暗色以及搜索栏背景色，以提高可视度  

feat(posts): 重命名文章文件名并调整分类标签  
- 同时调整了部分页面的Tag与分类  

</details>

<details>
<summary>v0.0.8 - 2025-12-18</summary>

docs: 添加 Biome 格式化代码记录文章  

docs: 添加更新日志板块，并为导航页添加链接  

docs: 更新软件推荐贴文内容  

refactor(dock): run `pnpm format`  

refactor(dock): 手动执行Biome相关命令格式化代码  


</details>

<details>
<summary>v0.0.7 - 2025-12-18</summary>

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
<summary>v0.0.6 - 2025-12-18</summary>

docs(posts): 更新导航页描述和内容  

</details>

<details>
<summary>v0.0.5 - 2025-12-18 - [添加Dock]</summary>

feat(dock): 添加底部悬浮 Dock 组件及搜索、主题切换功能  
- 滚动时自动显示/隐藏
- 集成搜索面板入口（DockSearch）
- 集成颜色设置面板入口（DockColorSettings）
- 支持亮色/暗色/自动模式切换
- 包含返回顶部按钮与主页跳转链接

</details>

<details>
<summary>v0.0.4 - 2025-12-18 - [Navbar模糊]</summary>

feat(navbar): 更新Navbar样式并优化动画效果  

- 将 `#navbar` 的类名从 `onload-animation` 更改为 `navbar-slide`，并添加滑入动画
- 更新Navbar背景样式，增加毛玻璃效果与边框
- 调整 `.float-panel` 圆角大小，并新增 `.navbar` 样式定义
- 在 Tailwind 配置中扩展 backdrop blur 和高度工具类
- 修改站点标题
- 移除文章页底部mb-4

</details>

<details>
<summary>v0.0.3 - 2025-12-16</summary>

feat(astro): 更新部署配置以支持 GitHub Pages  

</details>

<details>
<summary>v0.0.2 - 2025-12-16</summary>

build(astro): 更新站点配置中的 vercel 部署地址  

</details>

<details>
<summary>v0.0.1 - 2025-12-16</summary>

小小的更新

- 更新settings.json
- 改进搜索面板行为与焦点控制
- Never Gonna Give You Up
- 调整 Profile 卡片布局与响应式样式
- 更新文章分类与草稿状态
- 移除 GitHub 链接导航项

</details>

<details>
<summary>v0.0.0 - 2025-12-16 - [部署] </summary>

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