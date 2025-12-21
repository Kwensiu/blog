<script lang="ts">
import {
	getCurrentLanguage,
	getTranslation,
	type Translation,
} from "@i18n/translation";
import Icon from "@iconify/svelte";
import { setLanguage } from "@utils/setting-utils";

let currentLang = getCurrentLanguage();
let translation: Translation;

// Language options with display names
const languages = [
	{ code: "zh_CN", name: "中文", flag: "🇨🇳" },
	// { code: "zh_TW", name: "繁體", flag: "🇹🇼" }, // Commented out: Only Simplified Chinese is used
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "ja", name: "日本語", flag: "🇯🇵" },
	{ code: "ko", name: "한국어", flag: "🇰🇷" },
	{ code: "th", name: "ไทย", flag: "🇹🇭" },
	{ code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
	{ code: "id", name: "Bahasa", flag: "🇮🇩" },
	{ code: "tr", name: "Türkçe", flag: "🇹🇷" },
];

function switchLanguage(langCode: string) {
	setLanguage(langCode);
	currentLang = langCode;
	translation = getTranslation(langCode);

	// Dispatch custom event for language change
	window.dispatchEvent(
		new CustomEvent("languagechange", { detail: { language: langCode } }),
	);

	// Close the panel
	const panel = document.getElementById("language-setting");
	if (panel) {
		panel.classList.add("float-panel-closed");
	}
}

// Initialize translation
translation = getTranslation(currentLang);

// Listen for language changes from other sources
if (typeof window !== "undefined") {
	window.addEventListener("languagechange", (event: any) => {
		currentLang = event.detail.language;
		translation = getTranslation(currentLang);
	});
}
</script>

<div id="language-setting" class="float-panel float-panel-closed absolute transition-all w-48 right-4 px-4 py-4">
	<div class="flex flex-col gap-2">
		<div class="font-bold text-lg text-neutral-900 dark:text-neutral-100 transition mb-2">
			语言 / Language
		</div>
		{#each languages as lang}
			<button
				class="flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left {currentLang === lang.code ? 'bg-[var(--primary)] text-white' : 'text-neutral-700 dark:text-neutral-300'}"
				on:click={() => switchLanguage(lang.code)}
			>
				<span class="text-lg">{lang.flag}</span>
				<span class="text-sm font-medium">{lang.name}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.float-panel {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		z-index: 1000;
	}

	.float-panel-closed {
		opacity: 0;
		visibility: hidden;
		transform: translateY(-10px) scale(0.95);
		pointer-events: none;
	}
</style>
