---
title: Dock Component Integration Guide
published: 2025-12-19
description: 'Show how to add the Dock component into fuwari'
image: ''
tags: [开发, 博客, fuwari]
category: '开发'
draft: false 
lang: 'en'
cn: "how-to-add-dock/cn/"
updated: 2025-12-20T06:01:00.000Z
hidden: true
---

_This article was written hastily. Feel free to point out any issues._

# Scroll down now to see the Dock.

The Dock component solves two main problems:
1. Inability to search or switch pages while reading
2. The absence of the "Back to Top" button on small and medium-sized screens
3. ~A more polished blog experience~

# Component Overview

## Main Features

1. **Responsive Display**: Automatically shows when scrolling down (more than 150 pixels), and hides when scrolling up or returning to the top.
2. **Quick Navigation**: Provides quick access buttons for the Home, Archives, and About pages.
3. **Return to Top**: Smoothly scrolls to the top of the page with one click.
4. **Search Bottom**: I also created a component similar to a navigation bar search.

## File Structure

```
src/components/dock/
├── Dock.svelte
└── DockSearch.svelte
```
---

# Merging Steps

## 1. Create 2 Component Files

Create a `dock` folder in your project's `src/components/` directory and add the following two files:

1. **Dock.svelte** - The main component of Dock, including UI and scrolling handling.
   - Reference: [src/components/dock/Dock.svelte](https://github.com/Kwensiu/mSpace/blob/main/src/components/dock/Dock.svelte)

2. **DockSearch.svelte** - Search functionality component
   - Reference: [src/components/dock/DockSearch.svelte](https://github.com/Kwensiu/mSpace/blob/main/src/components/dock/DockSearch.svelte)
   - This is optional if you don't need to add a search button to the Dock.

## 2. Import into Layout

Import and add the Dock component to your main layout file (usually `src/layouts/Layout.astro`):

```astro title="Layout.astro" {"  // Add this before the closing body tag":4-5}
---
import Dock from "@components/dock/Dock.svelte";
---

<Dock client:only="svelte" />
```

   - Reference: [src/layouts/Layout.astro](https://github.com/Kwensiu/mSpace/blob/main/src/layouts/Layout.astro#L157)

---

# Customization

## Configuration Options

The Dock component includes a configuration object that can be modified according to your website's structure and personal preferences:

```js title="Dock.svelet"
const config = {
	scrollThreshold: 150, //piexl
	homePath: "/",
	archivePath: "/archive/",
	aboutPath: "/about/"
};
```

## Debounce Function

If you need debounce, you can also add a simple timer in `Dock.svelte`.

```diff lang:"js" title="Dock.svelet"
+ let scrollTimer: NodeJS.Timeout | null = null;
                       
  function handleScroll() {

+   if (scrollTimer) clearTimeout(scrollTimer);
+   scrollTimer = setTimeout(() => {
      const currentScrollY = window.scrollY;
      showDock = currentScrollY > config.scrollThreshold;
+   }, 100); // Set the delay time here.
  }
  
+ onDestroy(() => {
+   if (scrollTimer) clearTimeout(scrollTimer);
+   scrollTimer = null;
+ });
```
---

# Styles Problems?

I've customized some global styles within my project.   
If the final result doesn't match my blog, please check the style definitions.

# What More

The Dock can also perform many other functions, such as displaying the missing `TOC` component on small screens.

---

_More content to be updated_