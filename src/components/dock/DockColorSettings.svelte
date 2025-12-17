<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { getDefaultHue, getHue, setHue } from "@utils/setting-utils";

let hue = getHue();
const defaultHue = getDefaultHue();
let isVisible = false;

function resetHue() {
	hue = getDefaultHue();
}

function toggleVisibility() {
  isVisible = !isVisible;
}

function hide() {
  isVisible = false;
}

$: if (hue || hue === 0) {
	setHue(hue);
}

// 点击外部区域隐藏面板
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  const panel = document.getElementById("dock-display-setting");
  const button = document.getElementById("dock-color-settings-button");
  
  if (panel && button && 
      !panel.contains(target) && 
      !button.contains(target)) {
    isVisible = false;
  }
}

// 添加和清理事件监听器
import { onMount, onDestroy } from "svelte";

onMount(() => {
  document.addEventListener('click', handleClickOutside);
});

onDestroy(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<button 
  id="dock-color-settings-button"
  class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90"
  on:click|stopPropagation={toggleVisibility}
  aria-label="Color Settings"
>
  <Icon icon="material-symbols:palette-outline" class="text-[1.25rem]" />
</button>

<div 
  id="dock-display-setting" 
  class="fixed transition-all w-64 rounded-xl shadow-xl p-4"
  class:bg-white={true}
  class:dark:bg-black={true}
  class:bg-opacity-90={true}
  class:dark:bg-opacity-90={true}
  class:backdrop-blur-md={true}
  style="bottom: 6rem; left: 50%; transform: translateX(-50%);"
  class:hidden={!isVisible}
  class:block={isVisible}
>
  <div class="flex flex-col gap-3">
    <div class="flex flex-row gap-2 items-center justify-between">
      <div class="flex gap-2 font-bold text-md text-neutral-900 dark:text-neutral-100 transition relative">
        {i18n(I18nKey.themeColor)}
        <button 
          aria-label="Reset to Default" 
          class="btn-regular w-6 h-6 rounded-md active:scale-90 will-change-transform flex items-center justify-center"
          class:opacity-0={hue === defaultHue} 
          class:pointer-events-none={hue === defaultHue} 
          on:click|stopPropagation={resetHue}
        >
          <div class="text-[var(--btn-content)]">
            <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.75rem]" />
          </div>
        </button>
      </div>
      <div class="flex gap-1">
        <div class="transition bg-[var(--btn-regular-bg)] w-8 h-6 rounded-md flex justify-center
          font-bold text-xs items-center text-[var(--btn-content)]">
          {hue}
        </div>
      </div>
    </div>
    <div class="w-full h-5 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none">
      <input 
        aria-label={i18n(I18nKey.themeColor)} 
        type="range" 
        min="0" 
        max="360" 
        bind:value={hue}
        class="slider w-full" 
        id="colorSlider" 
        step="5"
      >
    </div>
  </div>
</div>

<style lang="stylus">
  #dock-display-setting input[type="range"] {
    -webkit-appearance: none;
    height: 1.25rem;
    background-image: var(--color-selection-bar);
    transition: background-image 0.15s ease-in-out;
    border-radius: 0.25rem;
  }

  #dock-display-setting input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 1rem;
    width: 0.5rem;
    border-radius: 0.125rem;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: none;
  }

  #dock-display-setting input[type="range"]::-webkit-slider-thumb:hover {
    background: rgba(255, 255, 255, 0.8);
  }

  #dock-display-setting input[type="range"]::-webkit-slider-thumb:active {
    background: rgba(255, 255, 255, 0.6);
  }

  #dock-display-setting input[type="range"]::-moz-range-thumb {
    height: 1rem;
    width: 0.5rem;
    border-radius: 0.125rem;
    border-width: 0;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: none;
  }

  #dock-display-setting input[type="range"]::-moz-range-thumb:hover {
    background: rgba(255, 255, 255, 0.8);
  }

  #dock-display-setting input[type="range"]::-moz-range-thumb:active {
    background: rgba(255, 255, 255, 0.6);
  }
</style>