---
title: 隐藏文章示例
published: 2024-01-15T00:00:00.000Z
description: 这是一个不在主页显示但在archive页面可见的文章示例。
tags:
  - 示例
  - 隐藏
category: 示例
draft: false
lang: zh_CN
hidden: true
updated: 2025-12-18T13:58:53.768Z
---

# 这是一篇隐藏文章

这篇文章设置了 `hidden: true` 属性，因此它不会在主页显示，但你仍然可以在[归档页面](../../archive/)中找到它。

这种功能适用于：
- 特殊用途的文章
- 不希望占据主页位置的次要内容
- 需要保留但不希望被普通访客直接看到的内容

## 如何使用

在你的文章frontmatter中添加：

```yaml
---
title: 文章标题
published: 2024-01-01
draft: false
hidden: true  # 添加这个属性
---

文章内容...
```

这样文章就不会在主页显示，但仍可通过归档页面或直接访问URL查看。