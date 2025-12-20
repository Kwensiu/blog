---
title: Dock 组件集成指南
published: 2025-12-19
description: '展示如何集成我的 Dock 组件到 fuwari'
image: ''
tags: [开发, 博客, fuwari]
category: '开发'
draft: false 
lang: 'zh_CN'
en: "how-to-add-dock/en/"
updated: 2025-12-21T02:44:00.000Z
---

_如有任何问题，敬请指出。_

# 上拉页面即可看到 Dock 组件

# 组件概述

Dock 组件的添加解决三个主要问题：
1. 阅读时无法搜索或切换页面
2. 中小屏幕下"回到顶部"按钮的缺失  
3. 更有质感的博客

## 主要功能

1. **自动显隐**: 向下滚动(超过 150 像素)时自动显示，向上滚动或返回顶部时隐藏。
2. **快速导航**：提供首页、存档和关于页面的快速访问按钮
3. **返回顶部**：一键平滑滚动至页面顶部
4. **底部搜索**：一个类似导航栏搜索的组件

## 文件结构

```
src/components/dock/
├── Dock.svelte
└── DockSearch.svelte
```
---

# 集成步骤

## 1. 创建文件

在项目的 `src/components/` 目录下创建一个名为 `dock` 的文件夹(可选)，并添加以下两个文件：

1. **Dock.svelte** - Dock 组件组件主体，包括UI显示与滚动处理
- 下面是 `Dock.svelte` 的完整代码。

```ts title="Dock.svelet" collapse={2-64, 69-141, 145-169}
<script lang="ts">
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import DockSearch from "./DockSearch.svelte";

// Configurable options - can be customized based on site needs
const config = {
scrollThreshold: 150, // Show dock after scrolling this many pixels
homePath: "/",
archivePath: "/archive/",
aboutPath: "/about/",
};

let showDock = false;

onMount(() => {
handleScroll();

window.addEventListener("scroll", handleScroll, { passive: true });

return () => {
        window.removeEventListener("scroll", handleScroll);
};
});

function handleScroll() {
const currentScrollY = window.scrollY;

// Dock displayed when the currentScrollY > scrollThreshold
showDock = currentScrollY > config.scrollThreshold;
}

function navigateHome(event: Event) {
event.preventDefault();
if (window.swup) {
        window.swup.navigate(url(config.homePath));
}
}

// Return to Top
function scrollToTop(e: Event) {
e.stopPropagation();
window.scrollTo({
        top: 0,
        behavior: "smooth",
});
}

// Navigate to Archive
function navigateToArchive(event: Event) {
event.preventDefault();
if (window.swup) {
        window.swup.navigate(url(config.archivePath));
}
}

// Navigate to About
function navigateToAbout(event: Event) {
event.preventDefault();
if (window.swup) {
        window.swup.navigate(url(config.aboutPath));
}
}
</script>

<!-- Dock -->
<div
id="dock"
role="toolbar"
tabindex="0"
class="fixed left-1/2 z-50 transition-all duration-300 ease-out"
class:bottom-6={showDock}
class:-bottom-14={!showDock}
class:opacity-100={showDock}
class:h-18={showDock}
class:scale-100={showDock}
>
<!-- Backdrop Blur -->
<div
class="absolute inset-0 bg-white/60 dark:bg-neutral-500/60 backdrop-blur-xs rounded-full shadow-lg border border-black/10 dark:border-white/20"
></div>

<!-- Buttons Container -->
<div
class="relative flex items-center justify-center h-full px-6 will-change-transform"
>
<!-- Search Button -->
<DockSearch />

<!-- Home Button -->
<a
href={url(config.homePath)}
class="btn-plain scale-animation rounded-3xl w-11 h-11 active:scale-90"
aria-label="Home Page"
on:click={navigateHome}
>
<Icon
icon="material-symbols:home-outline-rounded"
class="text-[1.5rem]"
/>
</a>

<!-- Return to Top Button -->
<button
class="btn-dock-primary items-center justify-center mx-1"
on:click={scrollToTop}
aria-label="Return to Top"
>
<Icon
icon="material-symbols:keyboard-arrow-up-rounded"
class="text-[1.5rem]"
/>
</button>

<!-- Archive Button -->
<a
href={url(config.archivePath)}
class="btn-plain scale-animation rounded-3xl w-11 h-11 active:scale-90"
aria-label="Archive Page"
on:click={navigateToArchive}
>
<Icon
icon="material-symbols:inventory-2-outline-rounded"
class="text-[1.5rem]"
/>
</a>

<!-- About Button -->
<a
href={url(config.aboutPath)}
class="btn-plain scale-animation rounded-3xl w-11 h-11 active:scale-90"
aria-label="About Page"
on:click={navigateToAbout}
>
<Icon
icon="material-symbols:info-outline-rounded"
class="text-[1.5rem]"
/>
</a>
</div>
</div>

<style>
/* Dock Container Style */
#dock {
transform: translateX(-50%);
}

/* Dock Main Button (Return to Top) Style */
.btn-dock-primary {
width: 3rem;
height: 3rem;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
background-color: var(--primary);
color: white;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
transition-property: all;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
transition-duration: 200ms;
}

.btn-dock-primary:hover {
opacity: 0.8;
transform: scale(1.05);
}
</style>
```

- 参考: [Github | Dock.svelte](https://github.com/Kwensiu/blog/blob/main/src/components/dock/Dock.svelte)

2. **DockSearch.svelte** - Dock 的搜索功能组件
- 下面是 `DockSearch.svelte` 的完整代码。

```ts title="DockSearch.svelet" collapse={2-212, 216-221, 225-300, 304-321}
<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";

let keyword = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;
let isVisible = false;
let searchPanelElement: HTMLDivElement;
let searchInputElement: HTMLInputElement;

// Mock data for development environment - customize as needed
const fakeResult: SearchResult[] = [
{
        url: url("/posts/nggyu/"),
        meta: {
                title: "Never Gonna Give You Up",
        },
        excerpt:
                "Because the search cannot work in the <mark>dev</mark> environment.",
},
{
        url: url("/"),
        meta: {
                title: "If You Want to Test the Search",
        },
        excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
},
];

function toggleVisibility(): void {
isVisible = !isVisible;
if (isVisible) {
        setTimeout(() => {
                if (searchInputElement) searchInputElement.focus();
        }, 10);
} else {
        resetSearch();
}
}

function hide(): void {
isVisible = false;
resetSearch();
}

function resetSearch(): void {
result = [];
keyword = "";
}

function navigateToResult(event: Event, itemUrl: string): void {
event.preventDefault();
hide(); // Hide search panel
if (window.swup) {
        window.swup.navigate(itemUrl);
} else {
        window.location.href = itemUrl;
}
}

function handleClickOutside(event: Event): void {
const target = event.target as HTMLElement;
if (
        !searchPanelElement?.contains(target) &&
        !target?.closest("#dock-search-button")
) {
        hide();
}
}

async function search(): Promise<void> {
if (!keyword) {
        result = [];
        return;
}

if (!initialized) return;

isSearching = true;

try {
        if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
                const response = await window.pagefind.search(keyword);
                result = await Promise.all(response.results.map((item) => item.data()));
        } else if (import.meta.env.DEV) {
                result = fakeResult;
        } else {
                result = [];
                console.error("Pagefind is not available in production environment.");
        }
} catch (error) {
        console.error("Search error:", error);
        result = [];
} finally {
        isSearching = false;
}
}

$: hasResults = result.length > 0;

$: panelWidth = (() => {
// When not searching
if (!keyword?.trim()) return "30rem";

// When search results are available
if (hasResults) {
        // Calculate the estimated width of the longest heading
        const maxLength = Math.max(
                ...result.map(
                        (item) =>
                                (item?.meta?.title?.length || 0) * 1.2 +
                                (item?.excerpt?.length || 0) * 0.3,
                ),
        );

        // Calculate the width based on the content length
        const minWidth = 35; // rem
        const maxWidth = 55; // rem
        const calculatedWidth = Math.min(
                Math.max(minWidth, maxLength / 10),
                maxWidth,
        );
        return `${calculatedWidth}rem`;
}

// When searching or no results found
return "35rem";
})();

// Optimize performance using throttling
let lastPanelWidth = "";
let updateTimeout: ReturnType<typeof setTimeout>;
let searchTimeout: ReturnType<typeof setTimeout>;

function updatePanelWidth(width: string) {
if (width !== lastPanelWidth) {
        if (updateTimeout) clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
                if (typeof document !== "undefined") {
                        document.documentElement.style.setProperty(
                                "--search-panel-width",
                                width,
                        );
                        lastPanelWidth = width;
                }
        }, 50); // 50ms throttling
}
}

$: updatePanelWidth(panelWidth);

// Lifecycle Management
onMount(() => {
document.addEventListener("click", handleClickOutside);

const initializeSearch = (): void => {
        initialized = true;
        pagefindLoaded =
                typeof window !== "undefined" &&
                !!window.pagefind &&
                typeof window.pagefind.search === "function";
        console.log("Pagefind status on init:", pagefindLoaded);
        if (keyword) search();
};

if (import.meta.env.DEV) {
        console.log(
                "Pagefind is not available in development mode. Using mock data.",
        );
        initializeSearch();
} else {
        document.addEventListener("pagefindready", () => {
                console.log("Pagefind ready event received.");
                initializeSearch();
        });
        document.addEventListener("pagefindloaderror", () => {
                console.warn(
                        "Pagefind load error event received. Search functionality will be limited.",
                );
                initializeSearch();
        });

        // Fallback in case events are not caught or pagefind is already loaded
        setTimeout(() => {
                if (!initialized) {
                        console.log("Fallback: Initializing search after timeout.");
                        initializeSearch();
                }
        }, 2000);
}

return () => {
        document.removeEventListener("click", handleClickOutside);
        if (updateTimeout) clearTimeout(updateTimeout);
        if (searchTimeout) clearTimeout(searchTimeout);
};
});

// Responsive Search with throttling
$: if (initialized && keyword) {
if (searchTimeout) clearTimeout(searchTimeout);
searchTimeout = setTimeout(async () => {
        await search();
}, 300); // 300ms throttling
}
</script>

<button
id="dock-search-button"
class="btn-plain scale-animation rounded-3xl w-11 h-11 active:scale-90"
on:click|stopPropagation={toggleVisibility}
aria-label="Search"
>
<Icon icon="material-symbols:search" class="text-[1.5rem]" />
</button>

<div
class="fixed transition-all duration-300 ease-in-out"
class:opacity-0={!isVisible}
class:opacity-100={isVisible}
class:pointer-events-none={!isVisible}
class:-z-10={!isVisible}
class:z-50={isVisible}
style="bottom: 6rem; left: 50%; transform: translateX(-50%); width: calc(100% - 0rem); max-width: var(--search-panel-width, 30rem);"
>
<div
bind:this={searchPanelElement}
id="dock-search-panel"
class="rounded-3xl shadow-xl p-1 max-h-[70vh] overflow-y-auto border border-black/5 dark:border-white/5 bg-white/80 dark:bg-neutral-500/80 backdrop-blur-xs"
class:scale-95={!isVisible}
class:scale-100={isVisible}
>
<!-- Search Result Panel -->
{#if hasResults}
<div class="max-h-[50vh] overflow-y-auto mb-2">
{#each result as item}
        <div
        role="button"
        tabindex="0"
        class="transition first-of-type:mt-1 group block rounded-2xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] cursor-pointer"
        on:click={(e) => navigateToResult(e, item.url)}
        on:keydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateToResult(e, item.url);
        }
        }}
        >
        <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
        {item.meta.title}
        <Icon
        icon="fa6-solid:chevron-right"
        class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"
        />
        </div>
        <div class="transition text-sm text-50">
        {#if import.meta.env.PROD}
        {@html item.excerpt}
        {:else}
        {item.excerpt}
        {/if}
        </div>
        </div>
{/each}
</div>
{:else if keyword && !isSearching}
<div class="py-4 text-center text-50 mb-2">No results found</div>
{/if}

<!-- Search Panel -->
<div class="relative flex items-center h-11 rounded-3xl bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10">
<Icon
icon="material-symbols:search"
class="absolute text-[1.25rem] pointer-events-none ml-3 text-black/30 dark:text-white/30"
/>
<input
id="dock-search-input"
bind:this={searchInputElement}
placeholder={i18n(I18nKey.search)}
bind:value={keyword}
class="pl-10 pr-8 py-2 text-sm bg-transparent outline-0 w-full h-full rounded-3xl"
/>
{#if keyword}
<button
        on:click|stopPropagation={resetSearch}
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black/50 dark:hover:text-white/50"
        aria-label="Clear search"
>
        <Icon icon="material-symbols:close" class="text-[1rem]" />
</button>
{/if}
</div>
</div>
</div>

<style>
/* Hide the scrollbar but retain functionality */
#dock-search-panel::-webkit-scrollbar {
width: 6px;
}

#dock-search-panel::-webkit-scrollbar-track {
background: transparent;
}

#dock-search-panel::-webkit-scrollbar-thumb {
background: rgba(0, 0, 0, 0.2);
border-radius: 3px;
}

#dock-search-panel {
transition: width 0.3s ease-in-out, transform 0.3s ease-in-out;
max-width: var(--search-panel-width, 30rem);
}
</style>
```

- 参考: [Github | DockSearch.svelte](https://github.com/Kwensiu/blog/blob/main/src/components/dock/DockSearch.svelte)
- 这是可选的，假如你不需要 Dock 的搜索功能

## 2. 导入到 Layout

1. 将 Dock 组件导入并添加到 Layout 文件（`src/layouts/Layout.astro`）：
2. 在 `</body>` 前添加 `<Dock client:only="svelte" />`
:::note
使用 `client:only="svelte"` 避免水合问题
:::

```js title="Layout.astro" ins={3, 11-12} showLineNumbers=false
// ...
import ConfigCarrier from "@components/ConfigCarrier.astro";
import Dock from "@components/dock/Dock.svelte";
// ...
<!DOCTYPE html>
<html lang={siteLang} class="...">
<body class="...">
// ...
<ConfigCarrier></ConfigCarrier>
<slot />
// 添加Dock组件,同时避免水合问题
<Dock client:only="svelte" />

<!-- increase ... -->
<div id="page-height-extend"></div>
</body>
</html>
```

- 参考: [Github | Layout.astro](https://github.com/Kwensiu/blog/blob/main/src/layouts/Layout.astro#L162)

---

# 个性化设置

## 配置选项

Dock 组件包含一个配置对象，可根据网站的结构和个人偏好进行修改：

```js title="Dock.svelet" "150" /"(/)"/ "/archive/" "/about/" startLineNumber=7
// Configurable options...
const config = {
scrollThreshold: 150, //pixels
homePath: "/",
archivePath: "/archive/",
aboutPath: "/about/"
};
```

## 防抖功能

如果需要防抖功能，还可以在 `Dock.svelte` 中添加一个简单的定时器（待优化）

```js title="Dock.svelet" ins={12-13, 15-16, 21, 23-27} collapse={3-9, 30-33} "handleScroll" showLineNumbers=false
// ...
onMount(() => {
handleScroll();

window.addEventListener("scroll", handleScroll, { passive: true });

return () => {
        window.removeEventListener("scroll", handleScroll);
};
});

let scrollTimer: NodeJS.Timeout | null = null;

function handleScroll() {
if (scrollTimer) clearTimeout(scrollTimer);
scrollTimer = setTimeout(() => {
const currentScrollY = window.scrollY;

// Dock displayed when the currentScrollY > scrollThreshold
showDock = currentScrollY > config.scrollThreshold;
}, 100); // 在这里设置延迟时间。
}

onDestroy(() => {
if (scrollTimer) clearTimeout(scrollTimer);
scrollTimer = null;
});

function navigateHome(event: Event) {
event.preventDefault();
if (window.swup) {
        window.swup.navigate(url(config.homePath));
}
}
// ...
```
---

# 样式问题？

我在项目中自定义了一些全局样式。
如果最终呈现与我的示例不同，请检查样式定义。

# 更多功能？

通过 Dock 其实还可以实现许多功能，例如：
- 在中小屏幕上显示缺失的 `TOC` 组件
- 为按钮添加长按/二级菜单实现...TOC!
---

_更多功能等待更新_