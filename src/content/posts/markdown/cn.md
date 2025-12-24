---
title: Markdown 示例
published: 2023-10-01
description: 一个简单的Markdown博客文章的示例。
tags: [Markdown, 博客, 演示]
category: 示例
draft: false
lang: zh_CN
updated: 2025-12-23
en: "markdown/en/"
---

:::note
This is a translated version.
:::

:::Warning
我在翻译时发现有很多功能“似乎”没有正确实现，未知原因，故暂停翻译
:::

# 一个 h1 标题

段落之间用一个空行隔开。

第二段， _斜体_, **粗体**, 和 `等宽`.  
分项列表看起来像:

- 你好
- 我好
- 大家好

请注意，在实际文本 --- 不考虑星号 ---  
内容从4列开始  

> 单引号是，  
> 写起来长这样  
>  
> 它们可以跨越多个段落，  
> 如果你喜欢的话  

破折需要用连续3个破折号。 两个破折号用于显示范围 (例如, "内容在12-14章内")。 
三个点 ... 会被转换为省略号  
Unicode 也是支持的 ☺  

## 这是 h2 标题

以下是一个编号列表:

1. 第1项
2. 第2️⃣项
3. 第叁项

请注意，实际文本是从左侧第 4 列（第 4 个字符）开始的。以下是代码示例：

    # 让我再重申一下 ...
    for i in 1 .. 10 { do-something(i) }

正如你可能已经猜到的，这里缩进了 4 个空格。
顺便说一下，除了缩进代码块之外，如果你愿意，也可以使用分隔符分隔的代码块：

```
define foobar() {
    print "欢迎来到风味之乡!";
}
```

（这样可以更方便地复制粘贴）。您可以选择性地  
标记以下分隔符块，以便 Pandoc 对其进行语法高亮显示：

```python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print i
```

### 这是一个一个 h3 标题

现在是一个嵌套列表:

1. 首先，准备以下食材:

    - 胡萝卜
    - 芹菜(我不喜欢吃)
    - 扁豆

2. 烧开水

3. 将所有食材倒入大锅，并按照下面步骤进行：
    算法(?)如下:

        找到木勺
        打开锅盖
        搅拌
        盖上锅盖
        将木勺小心地放在锅柄上
        等待十分钟
        返回第一步 (或者关火)

    不要碰撞木勺，否则它会掉下来。

再次注意文本总是以 4 个空格的缩进对齐（包括  
上面第 3 项的最后一行）。

这里有一个指向[网站](http://foo.bar)的链接，  
一个指向[本地文档](local-doc.html)的链接，  
以及一个指向[当前文档中的章节标题](#an-h2-header)的链接。这里还有一个脚注[^1]。

[^1]: 脚注文字写在这里。

表格可以像这样：

尺寸 材质 颜色

-------

9 棕色皮革
10 天然麻帆布
11 透明玻璃

表格：鞋子、尺码和材质

（以上为表格标题。）Pandoc 还支持
多行表格：
---

keyword text

---

red Sunsets, apples, and
other red or reddish
things.

green Leaves, grass, frogs
and other things it's
not easy being.

---

A horizontal rule follows.

---

Here's a definition list:

apples
: Good for making applesauce.
oranges
: Citrus!
tomatoes
: There's no "e" in tomatoe.

Again, text is indented 4 spaces. (Put a blank line between each
term/definition pair to spread things out more.)

Here's a "line block":

| Line one
| Line too
| Line tree

and images can be specified like so:

[//]: # (![example image]&#40;./demo-banner.png "An exemplary image"&#41;)

Inline math equations go in like so: $\omega = d\phi / dt$. Display
math should get its own line and be put in in double-dollarsigns:

$$I = \int \rho R^{2} dV$$

$$
\begin{equation*}
\pi
=3.1415926535
 \;8979323846\;2643383279\;5028841971\;6939937510\;5820974944
 \;5923078164\;0628620899\;8628034825\;3421170679\;\ldots
\end{equation*}
$$

And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.
