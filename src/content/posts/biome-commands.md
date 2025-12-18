---
title: Biome | Formatter
published: 2025-12-18T00:00:00.000Z
description: 记录使用于当前博客的 Biome 命令
image: ''
tags:
  - Biome
  - 开发
  - 效率
category: 开发
draft: false
lang: ''
updated: 2025-12-18T13:58:53.751Z
---

# Biome 格式化命令记录

[Biome 手册](https://biomejs.dev/guides/getting-started/)

当前博客是用 pnpm 构建的，  
所以需要使用对应的命令。

## 1. 使用 --fix 参数

```bash
# 应用所有可自动修复的问题
pnpm exec biome check --apply ./src

# 或者
pnpm exec biome lint --fix ./src
```

## 2. 分步处理不同类型的问题

### 格式化问题

```bash
# 格式化代码
pnpm exec biome format --write ./src
```

### 代码质量检查

```bash
# 检查并修复代码质量问题
pnpm exec biome lint --fix ./src
```

### 不安全代码检查

```bash
# 检查并修复安全问题
pnpm exec biome lint --unsafe ./src
```

## 3. 查看详细报告

```bash
# 查看详细报告，了解具体问题
pnpm exec biome ci --reporter=github ./src
```

## 4. 配置文件中启用自动修复

在 `biome.json` 中配置：

```json
{
  "vcs": {
    "enabled": true,
    "clientKind": "git"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true
  },
  "organizeImports": {
    "enabled": true
  }
}
```

## 5. 提交前自动修复

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint:fix": "biome check --apply ./src"
  }
}
```

## 6. 其他问题

某些问题可能需要手动修复：

- 查看具体的 warning 信息
- 运行 `biome check --apply-unsafe ./src` 尝试修复更多问题

对于特定规则，可以在 `biome.json` 中临时禁用：

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "off"
      }
    }
  }
}
```

> 首先尝试 `biome check --apply` 可以解决大部分自动修复的问题。