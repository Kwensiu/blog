<script lang="ts">
import { onMount } from "svelte";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { getStoredTheme, setTheme } from "@utils/setting-utils.ts";
import { AUTO_MODE, DARK_MODE, LIGHT_MODE, DEFAULT_THEME } from "@constants/constants.ts";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";
import DockSearch from "./dock/DockSearch.svelte";
import DockColorSettings from "./dock/DockColorSettings.svelte";

// 状态管理
let isScrolled = false;
let lastScrollY = 0;
let scrollThreshold = 50;
let showDock = false;
let currentTheme: LIGHT_DARK_MODE = DEFAULT_THEME;

// 组件挂载后监听滚动事件
onMount(() => {
    // 初始状态 - dock是半掩半透明的
    handleScroll();
    
    // 初始化当前主题
    const storedTheme = getStoredTheme();
    currentTheme = storedTheme || DEFAULT_THEME;
    
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 监听主题变化
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'theme') {
            const newTheme = getStoredTheme();
            currentTheme = newTheme || DEFAULT_THEME;
        }
    };
    
    const handleThemeChange = () => {
        const newTheme = getStoredTheme();
        currentTheme = newTheme || DEFAULT_THEME;
    };
    
    // 监听HTML元素的class变化，因为主题可能通过class切换
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    window.addEventListener('storage', handleStorageChange);
    
    // 定期检查主题状态，确保同步
    const themeCheckInterval = setInterval(handleThemeChange, 1000);
    
    // 清理事件监听
    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('storage', handleStorageChange);
        observer.disconnect();
        clearInterval(themeCheckInterval);
    };
});

// 滚动处理函数 - 决定是否显示dock
function handleScroll() {
    const currentScrollY = window.scrollY;
    
    // 只要不在顶部（滚动位置大于0）就显示dock
    if (currentScrollY > 100) {
        if (!showDock) {
            showDock = true;
        }
    } 
    // 向下滚动或接近顶部时隐藏dock
    else if (currentScrollY > lastScrollY || currentScrollY <= 100) {
        if (showDock) {
            showDock = false;
        }
    }
    
    lastScrollY = currentScrollY;
}



// // 切换dock展开/收起状态
// function toggleExpanded(e: Event) {
//     // 阻止事件冒泡，避免触发其他点击事件
//     e.stopPropagation();
//     expanded = !expanded;
    
//     // 添加弹性动画
//     const dockerElement = document.getElementById('docker');
//     if (dockerElement) {
//         dockerElement.classList.add('bounce');
//         setTimeout(() => {
//             dockerElement.classList.remove('bounce');
//         }, 600);
//     }
// }

// 回到顶部功能
function scrollToTop(e: Event) {
    // 阻止事件冒泡，避免触发其他点击事件
    e.stopPropagation();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 切换亮/暗色模式
function toggleTheme(e: Event) {
    // 阻止事件冒泡，避免触发其他点击事件
    e.stopPropagation();
    const themes: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE, AUTO_MODE];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    currentTheme = themes[nextIndex];
    setTheme(currentTheme);
}

// 打开颜色设置面板
function openColorSettings(e: Event) {
    // 阻止事件冒泡，避免触发其他点击事件
    e.stopPropagation();
    // 直接操作DOM元素，模拟点击事件
    const settingsButton = document.getElementById("display-settings-switch");
    if (settingsButton) {
        // 创建并触发点击事件
        const clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        });
        settingsButton.dispatchEvent(clickEvent);
        return;
    }
    
    // 如果按钮不存在，直接显示面板
    const displaySettings = document.getElementById("display-setting");
    if (displaySettings) {
        displaySettings.classList.remove("float-panel-closed");
    }
}

// 打开搜索面板
function openSearch(e: Event) {
    // 阻止事件冒泡，避免触发其他点击事件
    e.stopPropagation();
    // 直接操作DOM元素，模拟点击事件
    const searchButton = document.getElementById("search-switch");
    if (searchButton) {
        // 创建并触发点击事件
        const clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        });
        searchButton.dispatchEvent(clickEvent);
        return;
    }
    
    // 如果按钮不存在，直接显示面板
    const searchPanel = document.getElementById("search-panel");
    if (searchPanel) {
        searchPanel.classList.remove("float-panel-closed");
        // 聚焦搜索输入框
        setTimeout(() => {
            const input = document.querySelector("#search-bar-inside input") as HTMLInputElement;
            if (input) {
                input.focus();
            }
        }, 100);
    }
}

</script>

<!-- Docker组件 - 底部悬浮dock -->
<div 
    id="docker"
    role="toolbar"
    tabindex="0"
    class="fixed left-1/2 z-50 transition-all duration-300 ease-out"
    class:bottom-6={showDock}
    class:bottom-4={!showDock}

    class:opacity-100={showDock}
    class:min-w-48={showDock}
    class:min-w-40={!showDock}
    class:h-18={showDock}
    class:h-12={!showDock}
    class:cursor-pointer={!showDock}
    class:cursor-default={showDock}
    class:show={showDock}

>
    <!-- 背景模糊效果 - 半掩状态也有模糊 -->
    <div class="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-xs rounded-full shadow-lg border border-black/10 dark:border-white/20"></div>
    
    <!-- 按钮容器 -->
    <div class="relative flex items-center justify-center h-full px-6">
        <!-- 半掩状态下显示所有按钮但半透明 -->
        {#if !showDock}
            <!-- 搜索按钮 -->
            <DockSearch />
            
            <!-- 主页按钮 -->
            <a 
                href={url('/')}
                class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90"
                aria-label="主页"
                on:click|stopPropagation
            >
                <Icon icon="material-symbols:home-outline-rounded" class="text-[1.25rem]"></Icon>
            </a>
            
            <!-- 回到顶部按钮 - 中间突出显示 -->
            <button 
                class="btn-docker-primary opacity-50 flex items-center justify-center mx-1"
                on:click={scrollToTop}
                aria-label="回到顶部"
            >
                <Icon icon="material-symbols:keyboard-arrow-up-rounded" class="text-[1.5rem]"></Icon>
            </button>
            
            <!-- 颜色设置按钮 -->
            <DockColorSettings />
            
            <!-- 亮/暗色切换按钮 -->
            <button 
                class="btn-docker-item opacity-50 flex items-center justify-center"
                on:click={toggleTheme}
                aria-label="切换主题"
            >
                {#if currentTheme === LIGHT_MODE}
                    <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]"></Icon>
                {:else if currentTheme === DARK_MODE}
                    <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]"></Icon>
                {:else}
                    <Icon icon="material-symbols:radio-button-partial-outline" class="text-[1.25rem]"></Icon>
                {/if}
            </button>
        {:else}
            <!-- 搜索按钮 -->
            <DockSearch />
            
            <!-- 主页按钮 -->
            <a 
                href={url('/')}
                class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90"
                aria-label="主页"
                on:click|stopPropagation
            >
                <Icon icon="material-symbols:home-outline-rounded" class="text-[1.25rem]"></Icon>
            </a>
            
            <!-- 回到顶部按钮 - 中间突出显示 -->
            <button 
                class="btn-docker-primary flex items-center justify-center mx-1"
                on:click={scrollToTop}
                aria-label="回到顶部"
            >
                <Icon icon="material-symbols:keyboard-arrow-up-rounded" class="text-[1.5rem]"></Icon>
            </button>
            
            <!-- 颜色设置按钮 -->
            <DockColorSettings />
            
            <!-- 亮/暗色切换按钮 -->
            <button 
                class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90"
                on:click={toggleTheme}
                aria-label="切换主题"
            >
                {#if currentTheme === LIGHT_MODE}
                    <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]"></Icon>
                {:else if currentTheme === DARK_MODE}
                    <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]"></Icon>
                {:else}
                    <Icon icon="material-symbols:radio-button-partial-outline" class="text-[1.25rem]"></Icon>
                {/if}
            </button>
        {/if}
    </div>
    

</div>

<style>
    /* Docker容器样式 */
    #docker {
        transform: translateX(-50%);
    }
    
    /* 半掩状态 */
    #docker:not(.expanded):not(.show) {
        transform: translateX(-50%) translateY(2rem) scale(0.9);
    }
    
    /* Docker按钮基础样式 */
    .btn-docker-item {
        @apply w-10 h-10 rounded-full flex items-center justify-center 
               transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/20 
               text-black/80 dark:text-white/90 hover:text-[var(--primary)];
        margin: 0 2px;
    }
    
    /* Docker主要按钮样式 */
    .btn-docker-primary {
        @apply w-12 h-12 rounded-full flex items-center justify-center 
               bg-[var(--primary)] text-white shadow-md 
               transition-all duration-200 hover:opacity-80 hover:scale-105;
    }

    /* 动画效果 */
    @keyframes dockerBounce {
        0% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
        100% { transform: translateY(0); }
    }
</style>