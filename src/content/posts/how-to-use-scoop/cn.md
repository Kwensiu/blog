---
title: 优雅地使用Scoop
published: 2025-12-26
updated: 2025-12-26
description: '介绍一些近一年使用Scoop的心得'
image: ''
tags: [Scoop, 软件, 开发]
category: '软件'
draft: false
lang: 'zh_CN'
pin: false
pinOrder: 0
hidden: none
---

# 关于Scoop

> 来自[ Scoop 官网](https://scoop.sh) 简介(翻译)：  
> 
> Scoop 允许您通过命令行安装你熟悉和喜爱的程序，且几乎没有任何障碍:
> 
> - 消除安装时的权限弹  
> - 隐藏GUI向导式安装程序  
> - 防止安装大量程序后对 PATH 的污染  
> - 避免安装和卸载程序带来的残留和意外副作用  
> - 自动查找并安装依赖项  
> - 自动执行所有额外的设置步骤以确保程序可用  

一句话总结：以Windows可识别的方式安装 **绿色版** 软件，同时支持完整的 **安装/更新/卸载** 与 **环境变量设置**。

多应用、多空间。工作生活，互不干扰，尤其适合安装各种编译依赖库。  
基于“绿色版”的独立性，还可以完整备份与迁移软件数据(目录)。

---

# 安装 Scoop

Scoop有很多的安装方式，其根本在于使用一个有完整Scoop主体的 Git 仓库作为源。这特性也让Scoop可以在不同仓库和分支间快速切换

## 1. 官方Scoop安装

这里引用官方推荐的安装命令：

:::warning
(尽量) **不要** 在管理员下的Powershell安装，这会将Scoop/软件全局安装(所有用户)
:::

```powershell
# 必须先为当前用户设置执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# 这段便是Scoop本体的安装命令
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```
只需两步就能将Scoop安装在默认的系统盘下了，路径为 `$env:USERPROFILE\scoop`。  

或许你不喜欢安装在C盘。的确，通过Scoop安装的软件，实际上在任何位置都能被正确调用。  
但在讲解如何更改安装盘符前，这里我要详细说说第二条安装命令到底做了什么。 

或者[点击这里](#2-所以如何更改安装scoop的目录)查看安装目录更改方式。

---

### Scoop是如何被安装的？

```powershell
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

1. `Invoke-RestMethod`

用于向指定的 URI 发送 HTTP/HTTPS 请求，并将返回的 **结构化数据** 解析成Powershell易于处理的对象。

2. `-Uri https://get.scoop.sh`  

不难看出是指定向get.scoop.sh发送请求。通过查看链接内容可知，其实际上指向了Scoop官方仓库的 **master** 分支下的 `install.ps1`，也就是Scoop的安装脚本。

1. 管道 `|` 是 Powershell 用于将前一个命令的输出内容输入给后一个命令的标识符。  
2. `Invoke-Expression`

用于将输入的字符串作为 PowerShell 代码来执行。  

通过梳理可知，我们只需要获得安装Scoop的 `install.ps1` ，就能对其安装过程“动手脚”。

---

## 2. 所以如何更改安装Scoop的目录？

>参考：[官方文档](https://github.com/ScoopInstaller/Install#readme) | [翻译版本](../scoop-installation-cn/)

:::note
限于篇幅，我这里只介绍经典安装。
:::

#### 经典安装(Typical Installation)

```powershell
irm get.scoop.sh | iex
# 如果你在访问 GitHub 时遇到网络问题，可以使用代理，例如：
irm get.scoop.sh -Proxy 'http://<ip:port>' | iex
```

> `irm` = `Invoke-RestMethod` | `iex` = `Invoke-Expression`

由上文可知，如果需要进行自定义高级安装，必须要先下载 `install.ps1` 到本地。  

先执行以下命令将 `install.ps1` 下载到本地(默认为Powershell的根目录)：

```powershell
irm get.scoop.sh -outfile 'install.ps1'
```
然后执行以下命令，指定 `Scoop` 与 `GlobalScoopApps` 的安装位置：
```powershell
# 注意更改你需要的路径
.\install.ps1 -ScoopDir 'D:\Scoop' -ScoopGlobalDir 'D:\GlobalScoopApps'
```

至此，Scoop 本体的安装就完成了

---

## 3. 第三方Scoop安装

使用第三方Scoop库，主要还是针对 **网络环境不好** 的设备。这些库一般放在Gitee，或者在安装过程为Github域名添加了加速前缀。

### `scoop.201704.xyz`
这是我首次安装Scoop使用的库 ，所以在这里首推。  

:::tip
更多信息请查看[Gitee](https://gitee.com/scoop-installer/scoop)  
:::

执行以下命令即可完整安装：
```
# 脚本执行策略更改，默认自动同意
Set-ExecutionPolicy RemoteSigned -scope CurrentUser -Force

# 执行安装命令（默认安装在用户目录下，如需更改请执行“自定义安装目录”命令）
iwr -useb scoop.201704.xyz | iex


## 自定义安装目录（注意将目录修改为合适位置)
irm scoop.201704.xyz -outfile 'install.ps1'
.\install.ps1 -ScoopDir 'D:\Scoop' -ScoopGlobalDir 'D:\GlobalScoopApps'
```
---

### `scoop-cn`

这是我后来找到的另一个CN库，没有尝试过，故不展示过程。  

::github{repo="duzyn/scoop-cn"}

还有很多其他的CN库我就不介绍了~

---

# 使用Rscoop管理

这里推荐一下来自AmarBego开发的Rscoop，以及我对其Fork后加以改进的版本：

::github{repo="Kwensiu/Rscoop"}

::github{repo="AmarBego/Rscoop"}

相关功能介绍我已在仓库内详细介绍。

由于只有我一个人测试，所以不能找到所有潜在的问题，非常欢迎提交Issue！

![rscoop](rscoop01.webp)

_更多内容等待更新_