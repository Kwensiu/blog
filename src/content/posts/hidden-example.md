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
hidden: "part"
updated: 2025-12-23
---

# 这是一篇隐藏文章

这篇文章设置了 `hidden: "part"` 属性，因此它再主页隐藏了，只能在归档页面看到。

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
hidden: "part"  # 部分隐藏，只能在归档页面看到
---

文章内容...
```

hidden属性有3个值：
- `"none"`: 默认值，不隐藏
- `"part"`: 只在主页隐藏，在归档页面显示
- `"all"`: 完全隐藏，只能通过直接链接访问