---
title: Project DIVA MEGA MIX+
published: 2025-12-24
updated: 2025-12-24
description: "整理与记录 MEGA39's + 的游玩历程"
image: ''
tags: [初音ミク, 音游, Mod]
category: '游戏'
draft: false 
lang: 'zh_CN'
pin: false
pinOrder: 0
hidden: none
---

# MIKU！

 2025/12/24

 观望了几个月，今天也是在黑盒买下了MEGA39！VIP版CDK 优惠+盒币最终75￥买下也是挺值的！
![Screenshot about game](img/pv-buy.webp)
![Screenshot about game](img/pv02.webp)

模型也是 超！级！丰！富！随便截几张~
![Screenshot about game characters](img/char01.webp)
> 重音帝特ahhh

打歌的时候太忙啦，没截图。不过真的很多老歌！每首都有3DMV太赞了~
![Screenshot about songlist](img/songlist01.webp)

# MOD



## DivaModManager

安装MOD也是很简单，首先下载安装DivaModManager。

::github{repo="TekkaGB/DivaModManager"}

作为MOD管理器，安装位置可以随意。

如果你系统有Scoop，也可以通过Scoop安装，这样使用还方便一点！

我之后会写一篇文章，介绍如何优雅地使用 Scoop。

```
// 先添加 games 仓库，或者 spc 仓库也是有的
scoop bucket add games

// 然后执行安装
scoop install games/divamodmanager
```

管理器内还自带 GameBanana 和 DivaModArchive 网站的快捷搜索下载。
> 下文会有介绍

![Screenshot about DivaModManager](img/divamodmanager01.webp)

## DivaModLoader

可能还需要在游戏目录导入 DivaModLoader 允许 MOD 注入游戏。

::github{repo="blueskythlikesclouds/DivaModLoader"}

下载安装包后解压，复制里面的三个文件/文件夹复制到游戏本体目录下

```plaintext  ins={3-5}
...\Hatsune Miku Project DIVA Mega Mix Plus
├── 📁 Crashreport
├── 📁 mods
├── 📄 config.toml
├── 📄 dinput8.dll
├── ...
├── 🥬 DivaMegaMix.exe
└── ...

```

## Mods 网站

### GameBanana

这里首推 GameBanana 的 [Hatsune Miku: Project DIVA Mega Mix+](https://gamebanana.com/games/16522) 分区。
![Screenshot about GameBanana website](img/gamebanana01.webp)

不是很清楚为什么是 **MEGA Mix+** 而不是 **MEGA39's +**，

在Steam库页面的宣传图也是写的 **MEGA Mix+** 。
![Screenshot about steam game's banner](img/steam01.webp)

### DivaModArchive

DivaModArchive 似乎是另一群同好者维护的一个Mod网站，也是非常丰富和高质的！
![DivaModArchive website](img/divamodarchive01.webp)

刚开始接触，之后再慢慢整理吧！

_摸鱼更新中_