---
title: Expressive Code 代码高亮示例
published: 2024-04-10T00:00:00.000Z
description: 使用 Expressive Code 在 Markdown 中代码块的外观示例。
tags:
  - Markdown
  - 博客
  - 演示
category: 示例
draft: false
hidden: true
updated: 2025-12-18T13:58:53.755Z
---

这里，我们将探索使用 [Expressive Code](https://expressive-code.com/) 的代码块外观。提供的示例基于官方文档，你可以参考官方文档获取更多详细信息。

## Expressive Code

### 语法高亮

[相关教程链接](https://expressive-code.com/key-features/syntax-highlighting/)

#### 常规语法高亮

```js
console.log('这段代码被语法高亮了！')
```

#### 渲染 ANSI 转义序列

```ansi
ANSI 颜色:
- 常规: [31m红色[0m [32m绿色[0m [33m黄色[0m [34m蓝色[0m [35m品红色[0m [36m青色[0m
- 粗体: [1;31m红色[0m [1;32m绿色[0m [1;33m黄色[0m [1;34m蓝色[0m [1;35m品红色[0m [1;36m青色[0m
- 调暗: [2;31m红色[0m [2;32m绿色[0m [2;33m黄色[0m [2;34m蓝色[0m [2;35m品红色[0m [2;36m青色[0m

256 色（显示颜色 160-177）:
[38;5;160m160 [38;5;161m161 [38;5;162m162 [38;5;163m163 [38;5;164m164 [38;5;165m165[0m
[38;5;166m166 [38;5;167m167 [38;5;168m168 [38;5;169m169 [38;5;170m170 [38;5;171m171[0m
[38;5;172m172 [38;5;173m173 [38;5;174m174 [38;5;175m175 [38;5;176m176 [38;5;177m177[0m

完整 RGB 颜色:
[38;2;34;139;34m森林绿 - RGB(34, 139, 34)[0m

文本格式: [1m粗体[0m [2m调暗[0m [3m斜体[0m [4m下划线[0m
```

### 编辑器与终端框架

[编辑器与终端框架](https://expressive-code.com/key-features/frames/)

#### 代码编辑器框架

```js title="我的测试文件.js"
console.log('标题属性示例')
```

---

```html
<!-- src/content/index.html -->
<div>文件名注释示例</div>
```

#### 终端框架

```bash
echo "这个终端框架没有标题"
```

---

```powershell title="PowerShell 终端示例"
Write-Output "这个有标题！"
```

#### 覆盖框架类型

```sh frame="none"
echo "看，没有框架！"
```

---

```ps frame="code" title="PowerShell 配置文件.ps1"
# 如果不覆盖，这将是一个终端框架
function Watch-Tail { Get-Content -Tail 20 -Wait $args }
New-Alias tail Watch-Tail
```

### 文本与行标记

[文本与行标记](https://expressive-code.com/key-features/text-markers/)

#### 标记整行与行范围

```js {1, 4, 7-8}
// 第1行 - 被行号标记
// 第2行
// 第3行
// 第4行 - 被行号标记
// 第5行
// 第6行
// 第7行 - 被范围"7-8"标记
// 第8行 - 被范围"7-8"标记
```

#### 选择行标记类型（mark, ins, del）

```js title="行标记.js" del={2} ins={3-4} {6}
function demo() {
  console.log('这一行被标记为已删除')
  // 这一行和下一行被标记为已插入
  console.log('这是第二个已插入行')

  return '这一行使用中性默认标记类型'
}
```

#### 为行标记添加标签

```jsx {"1":5} del={"2":7-8} ins={"3":10-12}
// 带标签行标记.jsx
<button
  role="button"
  {...props}
  value={value}
  className={buttonClassName}
  disabled={disabled}
  active={active}
>
  {children &&
   !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

#### 在独立行上添加长标签

```jsx {"1. 在此处提供 value 属性:":5-6} del={"2. 移除 disabled 和 active 状态:":8-10} ins={"3. 添加此内容以在按钮内部渲染 children:":12-15}
// 带标签的行标记.jsx
<button
  role="button"
  {...props}

  value={value}
  className={buttonClassName}

  disabled={disabled}
  active={active}
>

  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

#### 使用差异类语法

```diff
+这一行将被标记为插入
-这一行将被标记为删除
这是常规行
```

---

```diff
--- a/README.md
+++ b/README.md
@@ -1,3 +1,4 @@
+这是一个实际的差异文件
-所有内容将保持不变
 空白字符也不会被删除
```

#### 结合语法高亮与差异类语法

```diff lang="js"
  function thisIsJavaScript() {
    // 整个代码块将被高亮为 JavaScript，
    // 我们仍然可以添加差异标记！
-   console.log('要删除的旧代码')
+   console.log('全新的代码！')
  }
```

#### 标记行内的单个文本

```js "给定文本"
function demo() {
  // 标记行内的任何给定文本
  return '支持给定文本的多个匹配';
}
```

#### 正则表达式

```ts /ye[sp]/
console.log('单词 yes 和 yep 将被标记。')
```

#### 转义正斜杠

```sh /\/ho.*\//
echo "Test" > /home/test.txt
```

#### 选择内联标记类型（mark, ins, del）

```js "return true;" ins="插入" del="删除"
function demo() {
  console.log('这些是插入和删除标记类型');
  // return 语句使用默认标记类型
  return true;
}
```

### 文本换行

[文本换行](https://expressive-code.com/key-features/word-wrap/)

#### 按块配置文本换行

```js wrap
// 带换行的示例
function getLongString() {
  return '这是一个很长的字符串，除非容器极宽，否则很可能无法适应可用空间'
}
```

---

```js wrap=false
// 带wrap=false的示例
function getLongString() {
  return '这是一个很长的字符串，除非容器极宽，否则很可能无法适应可用空间'
}
```

#### 配置换行行的缩进

```js wrap preserveIndent
// 带preserveIndent的示例（默认启用）
function getLongString() {
  return '这是一个很长的字符串，除非容器极宽，否则很可能无法适应可用空间'
}
```

---

```js wrap preserveIndent=false
// 带preserveIndent=false的示例
function getLongString() {
  return '这是一个很长的字符串，除非容器极宽，否则很可能无法适应可用空间'
}
```

## 可折叠部分

[可折叠部分](https://expressive-code.com/plugins/collapsible-sections/)

```js collapse={1-5, 12-14, 21-24}
// 所有这些样板设置代码将被折叠
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

const engine = someBoilerplateEngine(evenMoreBoilerplate())

// 这部分代码默认可见
engine.doSomething(1, 2, 3, calcFn)

function calcFn() {
  // 你可以有多个折叠部分
  const a = 1
  const b = 2
  const c = a + b

  // 这将保持可见
  console.log(`计算结果: ${a} + ${b} = ${c}`)
  return c
}

// 从这里到代码块结尾的所有代码将再次折叠
engine.closeConnection()
engine.freeMemory()
engine.shutdown({ reason: '示例样板代码结束' })
```

## 行号

[相关教程链接](https://expressive-code.com/plugins/line-numbers/)

### 按块显示行号

```js showLineNumbers
// 此代码块将显示行号
console.log('来自第2行的问候！')
console.log('我在第3行')
```

---

```js showLineNumbers=false
// 此代码块禁用行号
console.log('你好？')
console.log('抱歉，你知道我在哪一行吗？')
```

### 更改起始行号

```js showLineNumbers startLineNumber=5
console.log('来自第5行的问候！')
console.log('我在第6行')
```
