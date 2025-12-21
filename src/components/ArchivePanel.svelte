<script lang="ts">
import { onMount } from "svelte";

import I18nKey from "../i18n/i18nKey";
import { getCurrentLanguage, i18n } from "../i18n/translation";
import { getPostUrlBySlug } from "../utils/url-utils";

export let tags: string[];
export let categories: string[];
export let sortedPosts: Post[] = [];

const params = new URLSearchParams(window.location.search);
tags = params.has("tag") ? params.getAll("tag") : [];
categories = params.has("category") ? params.getAll("category") : [];
const uncategorized = params.get("uncategorized");

interface Post {
	slug: string;
	data: {
		title: string;
		tags: string[];
		category?: string;
		published: Date;
		lang?: string;
		hidden?: "none" | "part" | "all";
	};
}

interface Group {
	year: number;
	posts: Post[];
}

let groups: Group[] = [];
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

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

function filterAndGroupPosts() {
	let filteredPosts: Post[] = sortedPosts;
	const normalizedCurrentLang = normalizeLang(currentLang);

	// Filter by language
	filteredPosts = filteredPosts.filter((post) => {
		// If post has no lang field, show it in all languages (default behavior)
		if (!post.data.lang) {
			return true;
		}

		const postLang = normalizeLang(post.data.lang);

		// Custom language logic: English posts are shown in all non-Chinese languages
		// This is a personalized setting for blogs that primarily use Chinese but want English content
		// available to international users. To revert to standard behavior, replace this block with:
		// return postLang === normalizedCurrentLang;
		if (normalizedCurrentLang === "zh_cn") {
			// In Chinese mode, only show Chinese posts
			return postLang === "zh_cn";
		}
		// In non-Chinese languages, show posts in current language OR English posts
		return postLang === normalizedCurrentLang || postLang === "en";
	});

	// Filter by tags
	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	// Filter by categories
	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	// Filter uncategorized
	if (uncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	// Group by year
	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, Post[]>,
	);

	const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		posts: grouped[Number.parseInt(yearStr, 10)],
	}));

	groupedPostsArray.sort((a, b) => b.year - a.year);

	groups = groupedPostsArray;
}

function setupLanguageListener() {
	// Listen for language changes
	window.addEventListener("languagechange", (event: any) => {
		currentLang = event.detail.language;
		filterAndGroupPosts();
	});
}

onMount(async () => {
	setupLanguageListener();
	filterAndGroupPosts();
});
</script>

<div class="card-base px-8 py-6">
    {#each groups as group}
        <div>
            <div class="flex flex-row w-full items-center h-[3.75rem]">
                <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                    {group.year}
                </div>
                <div class="w-[15%] md:w-[10%]">
                    <div
                            class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
                    ></div>
                </div>
                <div class="w-[70%] md:w-[80%] transition text-left text-50">
                    {group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
                </div>
            </div>

            {#each group.posts as post}
                <a
                        href={getPostUrlBySlug(post.slug)}
                        aria-label={post.data.title}
                        class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
                >
                    <div class="flex flex-row justify-start items-center h-full">
                        <!-- date -->
                        <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
                            {formatDate(post.data.published)}
                        </div>

                        <!-- dot and line -->
                        <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                            <div
                                    class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                       outline outline-4 z-50
                       outline-[var(--card-bg)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
                            ></div>
                        </div>

                        <!-- post title -->
                        <div
                                class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                     group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                     text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden"
                        >
                            {post.data.title}
                        </div>

                        <!-- tag list -->
                        <div
                                class="hidden md:block md:w-[15%] text-left text-sm transition
                     whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
                        >
                            {formatTag(post.data.tags)}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/each}
</div>
