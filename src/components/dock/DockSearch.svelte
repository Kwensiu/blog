<script lang="ts">
  // 库和模块导入
  import I18nKey from "@i18n/i18nKey";
  import { i18n } from "@i18n/translation";
  import Icon from "@iconify/svelte";
  import { url } from "@utils/url-utils.ts";
  import { onMount, onDestroy } from "svelte";
  import type { SearchResult } from "@/global";

  // 状态定义
  let keyword = "";
  let result: SearchResult[] = [];
  let isSearching = false;
  let pagefindLoaded = false;
  let initialized = false;
  let isVisible = false;

  // 常量定义
  const fakeResult: SearchResult[] = [
    {
      url: url("/"),
      meta: {
        title: "Never Gonna Give You Up",
      },
      excerpt: "Because the search cannot work in the <mark>dev</mark> environment.",
    },
    {
      url: url("/"),
      meta: {
        title: "If You Want to Test the Search",
      },
      excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
    },
  ];

  // UI 交互函数
  function toggleVisibility(): void {
    isVisible = !isVisible;
    if (isVisible) {
      // 稍微延迟聚焦，确保DOM已经渲染
      setTimeout(() => {
        const input = document.querySelector("#dock-search-input") as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 10);
    } else {
      // 隐藏时清除搜索结果
      result = [];
      keyword = "";
    }
  }

function hide(): void {
    isVisible = false;
    result = [];
    keyword = "";
  }

  // 事件处理函数
  function handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const panel = document.getElementById("dock-search-panel");
    const button = document.getElementById("dock-search-button");
    
    if (panel && button && 
        !panel.contains(target) && 
        !button.contains(target)) {
      isVisible = false;
      result = [];
      keyword = "";
    }
  }

  // 搜索处理函数
  async function search(): Promise<void> {
    if (!keyword) {
      result = [];
      return;
    }

    if (!initialized) {
      return;
    }

    isSearching = true;

    try {
      let searchResults: SearchResult[] = [];

      if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
        const response = await window.pagefind.search(keyword);
        searchResults = await Promise.all(
          response.results.map((item) => item.data()),
        );
      } else if (import.meta.env.DEV) {
        searchResults = fakeResult;
      } else {
        searchResults = [];
        console.error("Pagefind is not available in production environment.");
		}

      result = searchResults;
    } catch (error) {
      console.error("Search error:", error);
      result = [];
    } finally {
      isSearching = false;
    }
  }

  // 生命周期管理
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    
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
        initializeSearch(); // Initialize with pagefindLoaded as false
      });

      // Fallback in case events are not caught or pagefind is already loaded by the time this script runs
      setTimeout(() => {
        if (!initialized) {
          console.log("Fallback: Initializing search after timeout.");
          initializeSearch();
        }
      }, 2000); // Adjust timeout as needed
    }

    // 清理函数
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  // 响应式搜索
  $: if (initialized && keyword) {
    (async () => {
      await search();
    })();
  }
</script>

<button 
  id="dock-search-button"
  class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90"
  on:click|stopPropagation={toggleVisibility}
  aria-label="Search"
>
  <Icon icon="material-symbols:search" class="text-[1.25rem]" />
</button>

<div 
  id="dock-search-panel" 
  class="fixed transition-all rounded-xl shadow-xl p-1 max-h-[70vh] overflow-y-auto"
  class:bg-white={true}
  class:dark:bg-black={true}
  class:bg-opacity-90={true}
  class:dark:bg-opacity-90={true}
  class:backdrop-blur-md={true}
  style="bottom: 6rem; left: 50%; transform: translateX(-50%); width: calc(100% - 2rem); max-width: 30rem;"
  class:hidden={!isVisible}
  class:block={isVisible}
>
  <!-- 搜索框 -->
  <div class="relative transition-all items-center h-11 rounded-xl mb-2
    bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
    dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10">
    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
    <input 
      id="dock-search-input"
      placeholder="{i18n(I18nKey.search)}"
      bind:value={keyword}
      class="pl-10 pr-4 py-2 text-sm bg-transparent outline-0 w-full h-full rounded-xl"
    >
    {#if keyword}
      <button 
        on:click|stopPropagation={() => { keyword = ''; result = []; }}
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black/50 dark:hover:text-white/50"
        aria-label="Clear search"
      >
        <Icon icon="material-symbols:close" class="text-[1.25rem]" />
      </button>
    {/if}
  </div>

  <!-- 搜索结果 -->
  {#if result.length > 0}
    <div class="max-h-[50vh] overflow-y-auto">
      {#each result as item}
        <a 
          href={item.url}
          class="transition first-of-type:mt-1 group block rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]"
          on:click|stopPropagation={hide}
        >
          <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
            {item.meta.title}
            <Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"></Icon>
          </div>
          <div class="transition text-sm text-50">
            {@html item.excerpt}
          </div>
        </a>
      {/each}
    </div>
  {:else if keyword && !isSearching}
    <div class="py-4 text-center text-50">
      No results found
    </div>
  {/if}
</div>

<style>
  /* 隐藏滚动条但是保留功能 */
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

  .dark #dock-search-panel::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }
</style>