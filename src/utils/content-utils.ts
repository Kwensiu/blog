import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

// // Retrieve posts and sort them by pin status and publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		// First sort by pin status
		const aIsPinned = a.data.pin === true;
		const bIsPinned = b.data.pin === true;

		if (aIsPinned && !bIsPinned) return -1;
		if (!aIsPinned && bIsPinned) return 1;

		// If both are pinned or both are not pinned, sort by pinOrder (if available)
		if (aIsPinned && bIsPinned) {
			const aPinOrder = a.data.pinOrder || 999;
			const bPinOrder = b.data.pinOrder || 999;
			if (aPinOrder !== bPinOrder) return aPinOrder - bPinOrder;
		}

		// Finally, sort by publication date
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}

// Get the articles displayed on the homepage (excluding fully hidden articles)
export async function getVisiblePosts() {
	const allPosts = await getRawSortedPosts();
	const visiblePosts = allPosts.filter((post) => post.data.hidden !== "all");

	for (let i = 1; i < visiblePosts.length; i++) {
		visiblePosts[i].data.nextSlug = visiblePosts[i - 1].slug;
		visiblePosts[i].data.nextTitle = visiblePosts[i - 1].data.title;
	}
	for (let i = 0; i < visiblePosts.length - 1; i++) {
		visiblePosts[i].data.prevSlug = visiblePosts[i + 1].slug;
		visiblePosts[i].data.prevTitle = visiblePosts[i + 1].data.title;
	}

	return visiblePosts;
}

// Get the articles displayed on the archive page (excluding fully hidden articles, but including partially hidden)
export async function getArchivePosts() {
	const allPosts = await getRawSortedPosts();
	const archivePosts = allPosts.filter((post) => post.data.hidden !== "all");

	for (let i = 1; i < archivePosts.length; i++) {
		archivePosts[i].data.nextSlug = archivePosts[i - 1].slug;
		archivePosts[i].data.nextTitle = archivePosts[i - 1].data.title;
	}
	for (let i = 0; i < archivePosts.length - 1; i++) {
		archivePosts[i].data.prevSlug = archivePosts[i + 1].slug;
		archivePosts[i].data.prevTitle = archivePosts[i + 1].data.title;
	}

	return archivePosts;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export async function getArchivePostsList(): Promise<PostForList[]> {
	const archiveFullPosts = await getArchivePosts();

	// delete post.body
	const archivePostsList = archiveFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return archivePostsList;
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}
