---
title: Fuwari 的上手指南(拓展)
published: 2024-04-01T00:00:00.000Z
description: 如何使用这个博客模板。
image: ./cover.jpeg
tags: ["Fuwari", "博客", "自定义"]
category: 指南
draft: false
hidden: true
updated: 2025-12-18T13:58:53.762Z
---

> 图片来源: [image.civitai.com](https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg)

对于本指南中没有提到的事情，您可以在[Astro Docs](https://docs.astro.build/)中找到答案。

## 贴文格式

```yaml
---
title: 我的第一个贴文
published: 2023-09-09
description: 这是我在博客的第一篇贴文。
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false  //
pin: false //顶置开关
pinOrder: 0  //顶置顺序
updated: 2025-12-18T13:58:53.762Z //贴文更新时间
---
```

| Attribute     | Description                                                                                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | 贴文的标题 |
| `published`   | 贴文的发布时间 |
| `description` | 贴文的简述，会展示在列表中 |
| `image`       | 贴文的封面图片路径<br/>1. 以 `http://` 或 `https://` 开头：使用web图像<br/>2. 以 `/` 开头：使用 `public` 目录下的图像<br/>3. 无前缀：使用 markdown 相对路径的文件 |
| `tags`        | 贴文的标签 |
| `category`    | 贴文的分类 |
| `draft`       | 草稿开关，草稿状态的贴文不会被展示在列表中 |
| `pin`         | 顶置开关 |
| `pinOrder`    | 顶置顺序，顺序高的贴文会优先展示 |
| `updated`     | 贴文更新时间，构建时会自动识别更新 |

## 在哪放置贴文文件

你的帖文文件应该放在‘ src/content/posts/ ’目录下。您还可以创建子目录来更好地组织您的贴文和资源。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```
