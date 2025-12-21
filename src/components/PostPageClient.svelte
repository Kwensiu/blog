<!--
	PostPageClient.svelte - Client-side post filtering component

	This component implements personalized language filtering logic:

	1. English posts are shown in ALL non-Chinese languages (not just English)
	2. Traditional Chinese support is disabled (only Simplified Chinese)

	TO RESTORE STANDARD BEHAVIOR:
	- Uncomment zh_TW related lines in normalizeLang function
	- Replace the custom language logic with: if (postLang === normalizedCurrentLang)
	- Uncomment zh_TW in LanguageSwitch.svelte languages array

	This allows English documentation to serve as fallback content for international users.
-->
<script lang="ts">
import { getCurrentLanguage } from "@i18n/translation";
import { onMount } from "svelte";

let currentLang = getCurrentLanguage();

// Language normalization function
// Note: Traditional Chinese (zh_TW) support is commented out for Simplified Chinese only usage
// To enable Traditional Chinese support, uncomment the zh-tw related lines below
function normalizeLang(lang: string): string {
	if (!lang) return "";
	const normalized = lang.toLowerCase().replace("-", "_");
	// Map common variations
	const langMap: Record<string, string> = {
		zh_cn: "zh_cn",
		//'zh-tw': 'zh_tw', // Commented out: Only Simplified Chinese is used
		//'zh_hk': 'zh_tw', // Hong Kong uses Traditional Chinese
		//'zh_mo': 'zh_tw', // Macau uses Traditional Chinese
		zh_sg: "zh_cn", // Singapore uses Simplified Chinese
		zh_my: "zh_cn", // Malaysia uses Simplified Chinese
		en_us: "en",
		en_gb: "en",
		en_au: "en",
		en_ca: "en",
		ja_jp: "ja",
		ko_kr: "ko",
		th_th: "th",
		vi_vn: "vi",
		id_id: "id",
		tr_tr: "tr",
	};
	return langMap[normalized] || normalized.split("_")[0];
}

function filterPostsByLanguage() {
	const normalizedCurrentLang = normalizeLang(currentLang);

	// Find all post cards on the page
	const postCards = document.querySelectorAll(".post-card");

	postCards.forEach((card) => {
		const langAttr = card.getAttribute("data-lang");
		const hiddenAttr = card.getAttribute("data-hidden");

		// Skip hidden posts regardless of language
		if (hiddenAttr === "true") {
			(card as HTMLElement).style.display = "none";
			return;
		}

		// If post has no lang field, show it in all languages (default behavior)
		if (!langAttr) {
			(card as HTMLElement).style.display = "block";
			return;
		}

		const postLang = normalizeLang(langAttr);

		// Custom language logic: English posts are shown in all non-Chinese languages
		// This is a personalized setting for blogs that primarily use Chinese but want English content
		// available to international users. To revert to standard behavior, replace this block with:
		// if (postLang === normalizedCurrentLang) { ... } else { ... }
		if (normalizedCurrentLang === "zh_cn") {
			// In Chinese mode, only show Chinese posts
			if (postLang === "zh_cn") {
				(card as HTMLElement).style.display = "block";
			} else {
				(card as HTMLElement).style.display = "none";
			}
		} else {
			// In non-Chinese languages, show posts in current language OR English posts
			if (postLang === normalizedCurrentLang || postLang === "en") {
				(card as HTMLElement).style.display = "block";
			} else {
				(card as HTMLElement).style.display = "none";
			}
		}
	});

	// Check if any posts are visible
	const visiblePosts = document.querySelectorAll(
		'.post-card[style*="display: block"]',
	);
	const noContentMessage = document.getElementById("no-content-message");

	if (visiblePosts.length === 0 && noContentMessage) {
		noContentMessage.style.display = "block";
	} else if (noContentMessage) {
		noContentMessage.style.display = "none";
	}
}

function setupLanguageListener() {
	// Listen for language changes
	window.addEventListener("languagechange", (event: any) => {
		currentLang = event.detail.language;
		filterPostsByLanguage();
	});
}

onMount(() => {
	setupLanguageListener();
	// Small delay to ensure DOM is ready
	setTimeout(() => {
		filterPostsByLanguage();
	}, 100);
});
</script>

<!-- Hidden message for when no posts match the current language -->
<div id="no-content-message" class="card-base p-8 text-center" style="display: none;">
	<div class="text-[var(--text-secondary)]">
		<p class="text-lg mb-2">暂无内容</p>
		<p class="text-sm">当前语言下没有可显示的文章</p>
	</div>
</div>

<style>
	.card-base {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-large);
		transition: all 0.2s ease;
	}
</style>
