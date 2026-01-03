<script lang="ts">
import Giscus from "@giscus/svelte";
import { onDestroy, onMount } from "svelte";
import { commentConfig } from "@/config";

if (!commentConfig || !commentConfig.giscus) {
	throw new Error("Giscus comments are not configured");
}
const giscus = commentConfig.giscus;

// 确保 giscus.repo 符合 `${string}/${string}` 格式
if (!giscus.repo || typeof giscus.repo !== 'string' || !giscus.repo.includes('/')) {
	throw new Error("Giscus repo must be in the format 'owner/repo'");
}

let hue = 80;
let mode = 'light'; // 默认值，将在 onMount 中更新

let giscus_base: string | null = null;
let giscus_dark: string | null = null;
let giscus_light: string | null = null;
let theme: string;

// Load CSS files
let isClient = false;

onMount(async () => {
	isClient = true;
	
	// 现在可以安全地访问 document 了
	mode = document.documentElement.classList.contains("dark")
		? "dark"
		: "light";

	try {
		const [baseModule, darkModule, lightModule] = await Promise.all([
			import("@styles/giscus-base.css?raw"),
			import("@styles/giscus-dark.css?raw"),
			import("@styles/giscus-light.css?raw"),
		]);
		giscus_base = baseModule.default;
		giscus_dark = darkModule.default;
		giscus_light = lightModule.default;
		theme = getGiscusThemeValue();
	} catch (error) {
		console.error("Failed to load giscus styles:", error);
		theme = mode;
	}
	
	// 现在初始化 MutationObserver
	const observer = new MutationObserver(() => {
		const new_mode = document.documentElement.classList.contains("dark")
			? "dark"
			: "light";
		if (mode !== new_mode) {
			mode = new_mode;
			updateGiscusTheme();
		}
	});

	findGiscusIframe();

	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class", "style"],
	});
	
	// 重新获取hue值
	hue = getHue();
});

onDestroy(() => {
	// observer?.disconnect(); // 在 onMount 中创建的 observer 无法在此处访问
	// 我们需要将 observer 移到外部作用域
});

let giscus_iframe: HTMLIFrameElement | null = null;
let observer: MutationObserver | null = null;

onMount(() => {
	// 重新定义 observer，因为需要在客户端环境中
	if (isClient) {
		observer = new MutationObserver(() => {
			const new_hue = getHue();
			const new_mode = document.documentElement.classList.contains("dark")
				? "dark"
				: "light";
			if (hue !== new_hue || mode !== new_mode) {
				hue = new_hue;
				mode = new_mode;
				updateGiscusTheme();
			}
		});

		findGiscusIframe();

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "style"],
		});
	}
});

onDestroy(() => {
	observer?.disconnect();
});

function getHue() {
	// Try to get from localStorage first
	const stored = localStorage.getItem("hue");
	if (stored) {
		return Number.parseInt(stored, 10);
	}

	// Fallback to config carrier data attribute
	if (!isClient) return 80; // 如果不在客户端环境中，返回默认值
	const configCarrier = document.getElementById("config-carrier");
	if (configCarrier?.dataset.hue) {
		return Number.parseInt(configCarrier.dataset.hue, 10);
	}

	// Fallback to computed style
	const style = getComputedStyle(document.documentElement);
	const hueMatch = style.getPropertyValue("--hue");
	return hueMatch ? Number.parseInt(hueMatch, 10) : 80;
}

function findGiscusIframe(retries = 0, maxRetries = 10) {
	if (!isClient) return; // 确保只在客户端环境中运行
	
	giscus_iframe = document
		.getElementById("giscus-comments")
		?.shadowRoot?.querySelector("iframe") as HTMLIFrameElement;
	if (!giscus_iframe && retries < maxRetries) {
		setTimeout(
			() => findGiscusIframe(retries + 1, maxRetries),
			100 * 1.5 ** retries,
		);
	} else if (giscus_iframe) {
		// Update theme once iframe is found
		setTimeout(() => updateGiscusTheme(), 100);
	}
}

function getGiscusThemeValue() {
	if (!giscus_base || !giscus_dark || !giscus_light) {
		return mode;
	}
	const hue_style = `main { --hue: ${hue}; }`;
	const css =
		mode === "dark"
			? hue_style + giscus_dark + giscus_base
			: hue_style + giscus_light + giscus_base;
	// 将 CSS 编码为 data URI
	return `data:text/css;base64,${btoa(css)}`;
}

function updateGiscusTheme(retries = 0, maxRetries = 10) {
	if (!isClient) return; // 确保只在客户端环境中运行
	
	if (!giscus_iframe || !giscus_iframe.contentWindow) {
		if (retries < maxRetries) {
			setTimeout(
				() => updateGiscusTheme(retries + 1, maxRetries),
				100 * 1.5 ** retries,
			);
		}
		return;
	}
	const message = {
		giscus: {
			setConfig: {
				theme: getGiscusThemeValue(),
			},
		},
	};
	giscus_iframe.contentWindow.postMessage(message, "https://giscus.app");
}

// 定义 Giscus 组件的类型
type MappingType = 
  | 'url'
  | 'title'
  | 'og:title'
  | 'specific'
  | 'number'
  | 'pathname';

type BooleanString = '0' | '1';

type InputPosition = 'top' | 'bottom';

type Theme = 
  | 'light'
  | 'light_high_contrast'
  | 'light_protanopia'
  | 'dark'
  | 'dark_high_contrast'
  | 'dark_protanopia'
  | 'dark_dimmed'
  | 'transparent_dark'
  | 'preferred_color_scheme'
  | string;

type AvailableLanguage = 
  | 'en'
  | 'ar'
  | 'ca'
  | 'da'
  | 'de'
  | 'el'
  | 'es'
  | 'fi'
  | 'fr'
  | 'he'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'nl'
  | 'pl'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'th'
  | 'tr'
  | 'uk'
  | 'vi'
  | 'zh-CN'
  | 'zh-TW';

type Loading = 'lazy' | 'eager';
</script>

<Giscus
	id="giscus-comments"
	repo={giscus.repo as `${string}/${string}`}
	repoId={giscus.repoId as string}
	category={giscus.category as string}
	categoryId={giscus.categoryId as string}
	mapping={giscus.mapping as MappingType}
	term={giscus.term ? giscus.term : ""}
	strict={giscus.strict as BooleanString}
	reactionsEnabled={giscus.reactionsEnabled as BooleanString}
	emitMetadata={giscus.emitMetadata as BooleanString}
	inputPosition={giscus.inputPosition as InputPosition}
	theme={theme as Theme}
	lang={giscus.lang as AvailableLanguage}
	loading={giscus.loading as Loading}
/>