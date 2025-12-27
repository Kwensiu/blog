<script lang="ts">
	import Icon from "@iconify/svelte";
	import { onMount, onDestroy } from "svelte";
	import { fly } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	let props = $props();
	let { headings: propHeadings = [] } = props;

	// Configuration
	const CONFIG = {
		SCROLL_THRESHOLD: 150,
		PANEL_WIDTH: '20rem',
		PANEL_BOTTOM_OFFSET: '5rem',
		CENTER_OFFSET: '-10rem',
		DOCK_LEFT_OFFSET: '10.625rem', // 距离 Dock 中心的偏移
	};

	interface Heading {
		depth: number;
		text: string;
		id: string;
	}

	// State
	let showDock = $state(false);
	let showPanel = $state(false);
	let showEmptyMessage = $state(false);
	let isPostPage = $state(false);
	let headings = $state<Heading[]>([]);
	
	// Refs
	let tocPanelElement = $state<HTMLDivElement>();

	// Constants
	const TOC_HEADING_SELECTORS = ['h2', 'h3', 'h4'];
	const POST_CONTAINER_ID = 'post-container';
	const POSTS_PATH = '/posts/';
	
	// Timers
	let scrollTimer: ReturnType<typeof setTimeout> | null = null;
	let swupHooksRegistered = false;

	// Heading utilities
	function extractHeadings(): void {
		setTimeout(() => {
			// 首先使用传入的 headings 数据（与现有 TOC 保持一致）
			if (propHeadings && propHeadings.length > 0) {
				const extractedHeadings: Heading[] = propHeadings.map((h: any) => ({
					depth: h.depth,
					text: h.text.replace(/#$/, ''),
					id: h.slug,
				}));
				headings = extractedHeadings;
				return;
			}

			// 备选方案：从全局获取
			if ((window as any).__astroHeadings) {
				const astroHeadings = (window as any).__astroHeadings as any[];
				const extractedHeadings: Heading[] = astroHeadings.map(h => ({
					depth: h.depth,
					text: h.text.replace(/#$/, ''),
					id: h.slug,
				}));
				headings = extractedHeadings;
				return;
			}

			// 最后备用：从 DOM 提取
			const postContainer = document.getElementById(POST_CONTAINER_ID);
			if (!postContainer) return;

			const headingElements = postContainer.querySelectorAll(TOC_HEADING_SELECTORS.join(', '));
			const extractedHeadings: Heading[] = [];

			headingElements.forEach((element) => {
				const id = element.id;
				if (id) {
					const cloned = element.cloneNode(true) as HTMLElement;
					cloned.removeAttribute('id');
					let text = cloned.textContent || '';
					const hashIndex = text.lastIndexOf('#');
					if (hashIndex === text.length - 1) {
						text = text.substring(0, hashIndex);
					}
					extractedHeadings.push({
						depth: parseInt(element.tagName.charAt(1)),
						text,
						id,
					});
				}
			});

			headings = extractedHeadings;
		}, 100);
	}

	// Swup integration
	function registerSwupHooks(): void {
		if (swupHooksRegistered || !window.swup?.hooks) return;

		window.swup.hooks.on('content:replace', checkPostPage);
		window.swup.hooks.on('page:view', () => {
			checkPostPage();
			handleScroll();
		});

		swupHooksRegistered = true;
	}

	// Lifecycle
	onMount(() => {
		checkPostPage();
		registerSwupHooks();

		if (!swupHooksRegistered) {
			const checkSwup = setInterval(() => {
				if (window.swup?.hooks) {
					clearInterval(checkSwup);
					registerSwupHooks();
				}
			}, 100);

			setTimeout(() => clearInterval(checkSwup), 10000);
		}

		window.addEventListener('popstate', checkPostPage);
		window.addEventListener("scroll", handleScroll, { passive: true });
		document.addEventListener('click', handleClickOutside);
		handleScroll();

		return () => {
			window.removeEventListener("scroll", handleScroll);
			document.removeEventListener('click', handleClickOutside);
			if (scrollTimer) {
				clearTimeout(scrollTimer);
			}
		};
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});

	// Event handlers
	function checkPostPage(): void {
		const currentPath = window.location.pathname;
		isPostPage = currentPath.includes(POSTS_PATH) && currentPath.length > POSTS_PATH.length;

		if (isPostPage) {
			extractHeadings();
		} else {
			headings = [];
			showPanel = false;
		}
	}

	function handleScroll(): void {
		if (scrollTimer) {
			clearTimeout(scrollTimer);
		}

		scrollTimer = setTimeout(() => {
			const currentScrollY = window.scrollY;
			showDock = isPostPage && currentScrollY > CONFIG.SCROLL_THRESHOLD;
			scrollTimer = null;
		}, 16);
	}

	function togglePanel(event: Event): void {
		event?.preventDefault();
		event?.stopPropagation();

		// 如果有面板打开，则关闭所有面板
		if (showPanel || showEmptyMessage) {
			showPanel = false;
			showEmptyMessage = false;
			return;
		}

		// 如果没有面板打开，则打开相应面板
		if (headings.length === 0) {
			showEmptyMessage = true;
		} else {
			showPanel = true;
		}
	}

	function closePanel(): void {
		showPanel = false;
		showEmptyMessage = false;
	}

	function handleHeadingClick(event: Event, id: string): void {
		event.preventDefault();
		event.stopPropagation();

		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
			closePanel();
		}
	}

	function handleClickOutside(event: Event): void {
		if (!showPanel && !showEmptyMessage) return;

		const target = event.target as HTMLElement;
		if (tocPanelElement && !tocPanelElement.contains(target)) {
			closePanel();
		}
	}

	// Heading utilities
	function getMinDepth(): number {
		if (headings.length === 0) return 2;
		return Math.min(...headings.map(h => h.depth));
	}

	function getHeadingNumber(heading: Heading): string {
		if (heading.depth === getMinDepth()) {
			const level1Headings = headings.filter(h => h.depth === getMinDepth());
			return (level1Headings.indexOf(heading) + 1).toString();
		}
		return '';
	}
</script>

<!-- Dock TOC Button -->
<div
  id="dock-toc"
  role="toolbar"
  tabindex="0"
  class="fixed z-50 transition-all duration-300 ease-out"
  class:bottom-[2.5rem]={showDock}
  class:-bottom-14={!showDock}
  class:opacity-100={showDock}
  class:scale-100={showDock}
>
  <!-- TOC Button -->
  <button
    class="relative flex items-center justify-center w-11 h-11 bg-white/60 dark:bg-neutral-500/60 backdrop-blur-xs rounded-full shadow-lg border border-black/10 dark:border-white/20 transition-all duration-200 hover:scale-105 active:scale-90"
    aria-label="Table of Contents"
    onclick={togglePanel}
  >
    <Icon
      icon="material-symbols:view-list-outline-rounded"
      class="text-[1.5rem] opacity-70 text-black dark:text-white"
    />
  </button>

  <!-- Panel Container -->
  {#if showPanel || showEmptyMessage}
    <div
      bind:this={tocPanelElement}
      class="fixed z-40 rounded-2xl shadow-2xl border border-black/5 dark:border-white/5 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm overflow-hidden"
      style="left: 50%; transform: translateX(-103%); bottom: 5rem; width: 20rem; max-height: 60vh;"
      transition:fly={{ y: 10, duration: 200, easing: cubicOut }}
    >
      <!-- Panel Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/5">
        <span class="font-bold text-sm text-black/80 dark:text-white/80">目录</span>
        <button
          class="flex items-center justify-center w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          onclick={closePanel}
          aria-label="Close"
        >
          <Icon
            icon="material-symbols:close-outline-rounded"
            class="text-lg text-black/50 dark:text-white/50"
          />
        </button>
      </div>

      <!-- Panel Content -->
      {#if showPanel && headings.length > 0}
        <div class="overflow-y-auto max-h-[calc(60vh-3.5rem)] custom-scrollbar">
          {#each headings as heading}
            <a
              href={`#${heading.id}`}
              class="px-3 py-2.5 flex gap-3 relative transition w-full min-h-9 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10"
              onclick={(e) => handleHeadingClick(e, heading.id)}
            >
              {#if heading.depth === getMinDepth()}
                <div class="transition w-5 h-5 rounded-lg text-xs flex items-center justify-center font-bold flex-shrink-0 bg-[var(--primary)] text-white ml-0">
                  {getHeadingNumber(heading)}
                </div>
              {:else if heading.depth === getMinDepth() + 1}
                <div class="transition w-5 h-5 flex items-center justify-center font-bold flex-shrink-0 text-transparent ml-4">
                  <div class="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
                </div>
              {:else if heading.depth === getMinDepth() + 2}
                <div class="transition w-5 h-5 flex items-center justify-center font-bold flex-shrink-0 text-transparent ml-8">
                </div>
              {/if}
              <div
                class="transition text-sm flex-1 
                  {(heading.depth === getMinDepth() || heading.depth === getMinDepth() + 1) ? 'text-black/70 dark:text-white/70' : 
                  (heading.depth === getMinDepth() + 2) ? 'text-black/50 dark:text-white/50' : ''}"
              >
                {heading.text}
              </div>
            </a>
          {/each}
        </div>
      {:else if showEmptyMessage}
        <div class="px-4 py-8 text-center">
          <Icon
            icon="material-symbols:format-list-bulleted-outline-rounded"
            class="text-3xl text-black/30 dark:text-white/30 mb-3 mx-auto"
          />
          <p class="text-sm text-black/50 dark:text-white/50 mb-2">
            本文暂无目录
          </p>
          <p class="text-xs text-black/30 dark:text-white/30">
            文章中未找到标题内容
          </p>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Dock TOC Container */
  #dock-toc {
    left: calc(50% + 10.625rem);
    transform: translateX(-50%);
  }

  /* Custom Scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
  }

  .custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.25);
  }
</style>
