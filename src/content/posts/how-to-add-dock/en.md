---
title: Dock Component Integration Guide
published: 2025-12-19
description: "Show how to add the Dock component into fuwari"
image: ""
tags: [开发, 博客, fuwari]
category: "开发"
draft: false
lang: en
cn: "how-to-add-dock/cn/"
updated: 2025-12-24
---

_Feel free to point out any issues._

# Scroll down now to see the Dock.

# Component Overview

The Dock component solves three main problems:

1. Inability to search or switch pages while reading
2. The absence of the "Back to Top" button on small and medium-sized screens
3. A more polished blog experience

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

- Here I post the **Complete** code for `Dock.svelte`

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

- Reference: [Github | Dock.svelte](https://github.com/Kwensiu/blog/blob/main/src/components/dock/Dock.svelte)

2. **DockSearch.svelte** - Search functionality component

- Also post the **Complete** code for `DockSearch.svelte` here.

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

- Reference: [Github | DockSearch.svelte](https://github.com/Kwensiu/blog/blob/main/src/components/dock/DockSearch.svelte)
- This is optional if you don’t need to add a search button to the Dock.

## 2. Import into Layout

1. Import and add the Dock component to your main layout file (usually `src/layouts/Layout.astro`):
2. Add `<Dock client:only="svelte" />` before `</body>`
   :::note
   > Use `client:only="svelte"` to avoid hydration issues
   > :::

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
        // Add `Dock` here
        <Dock client:only="svelte" />

        <!-- increase ... -->
        <div id="page-height-extend"></div>
    </body>
</html>
```

- Reference: [Github | Layout.astro](https://github.com/Kwensiu/blog/blob/main/src/layouts/Layout.astro#L162)

---

# Customization

## Configuration Options

The Dock component includes a configuration object that can be modified according to your website's structure and personal preferences:

```js title="Dock.svelet" "150" /"(/)"/ "/archive/" "/about/" startLineNumber=7
// Configurable options...
const config = {
  scrollThreshold: 150, //pixels
  homePath: "/",
  archivePath: "/archive/",
  aboutPath: "/about/",
};
```

## Throttle Optimization

To reduce power consumption, you can add throttling to limit the frequency of scroll event handling in `Dock.svelte`:

```ts title="Dock.svelte" ins={3, 12-14, 23-34} del={19-22} collapse={7-10} "handleScroll" ins="clearTimeout" showLineNumbers=false
// ...
let showDock = false;
let scrollTimer: ReturnType<typeof setTimeout> | null = null;

onMount(() => {
  handleScroll();

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
  };
});

function handleScroll() {
  const currentScrollY = window.scrollY;

  // Dock displayed when the currentScrollY > scrollThreshold
  showDock = currentScrollY > config.scrollThreshold;
  // Clear previous timer
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }

  // Use 16ms throttling (approx 60fps), reduce frequent updates
  scrollTimer = setTimeout(() => {
    const currentScrollY = window.scrollY;
    // Dock displayed when the currentScrollY > scrollThreshold
    showDock = currentScrollY > config.scrollThreshold;
    scrollTimer = null;
  }, 16);
}
// ...
```

---

# Styles Problems?

I've customized some global styles within my project.  
If the final result doesn't match my blog, please check the style definitions.

# What More?

The Dock can actually achieve many other functions, such as:

- Displaying missing `TOC` components on small and medium-sized screens
- Adding long-press/secondary menus to buttons to achieve…TOC!

---

_More content to be updated_
