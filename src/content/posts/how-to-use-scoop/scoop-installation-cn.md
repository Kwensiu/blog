---
title: Scoop 安装文档
published: 2025-12-26
updated: 2025-12-26
description: ''
image: ''
tags: [Scoop]
category: '软件'
draft: false 
lang: 'zh_CN'
pin: false
pinOrder: 0
hidden: all
---

:::important
这是一篇非官方翻译文档  
This is an unofficial translated document.  

本文档仅为学习和交流使用，内容可能更新不及时，请以[官方文档](https://github.com/ScoopInstaller/Install#readme)为准。  
This document is for educational and communication purposes only, and may not be up-to-date. Please refer to the [official documentation](https://github.com/ScoopInstaller/Install#readme) for the most accurate information.
:::

# Scoop 安装与卸载

## 安装

### 先决条件

[PowerShell](https://aka.ms/powershell) 最新版本 或 [Windows PowerShell 5.1](https://aka.ms/wmf5download)

- PowerShell [语言模式] 必须为 `FullLanguage` 才能运行安装程序和 Scoop。
- PowerShell [执行策略] 必须为 `RemoteSigned`、`Unrestricted` 或 `ByPass` 之一才能运行安装程序。例如，可以通过以下方式设置为 `RemoteSigned`：

  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### 典型安装

从 **非管理员** PowerShell 运行以下命令以使用默认配置安装scoop，
scoop 将被安装到 `C:\Users\<您的用户名>\scoop`。

```powershell
irm get.scoop.sh | iex
# 如果访问 GitHub 有网络问题，可以使用代理，例如：
irm get.scoop.sh -Proxy 'http://<ip:port>' | iex
```

### 高级安装

如果想要进行高级安装，您可以下载安装程序并使用参数手动执行。

```powershell
irm get.scoop.sh -outfile 'install.ps1'
```

要查看安装程序的所有可配置参数。

```powershell
.\install.ps1 -?
```

例如，您可以将 Scoop 安装到自定义目录，配置 Scoop 将全局程序安装到自定义目录，并在安装过程中绕过系统代理。

```powershell
.\install.ps1 -ScoopDir 'D:\Applications\Scoop' -ScoopGlobalDir 'F:\GlobalScoopApps' -NoProxy
```

或者您可以使用旧方法通过设置环境变量来配置自定义目录。（不推荐）

```powershell
$env:SCOOP='D:\Applications\Scoop'
$env:SCOOP_GLOBAL='F:\GlobalScoopApps'
[Environment]::SetEnvironmentVariable('SCOOP_GLOBAL', $env:SCOOP_GLOBAL, 'Machine')
irm get.scoop.sh | iex
```

#### 管理员模式

出于安全考虑，默认情况下已禁用管理员控制台下的安装。如果您知道自己在做什么并希望以管理员身份安装 Scoop，请下载安装程序并在提升权限的控制台中使用 `-RunAsAdmin` 参数手动执行。以下是一个示例：

```powershell
irm get.scoop.sh -outfile 'install.ps1'
.\install.ps1 -RunAsAdmin [-其他参数 ...]
# 我不关心其他参数，想要一行命令
iex "& {$(irm get.scoop.sh)} -RunAsAdmin"
```

### 静默安装

您可以将所有输出重定向到 Out-Null 或日志文件以使安装程序静默运行。您可以使用 `$LASTEXITCODE` 检查安装结果，如果安装成功，它将为 `0`。

```powershell
# 省略输出
.\install.ps1 [-参数 ...] | Out-Null
# 或收集日志
.\install.ps1 [-参数 ...] > install.log
# 获取结果
$LASTEXITCODE
```

## 许可证

该项目以 [Unlicense 许可证](LICENSE) 发布并进入公共领域。

[语言模式]: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_modes
[执行策略]: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies