import { siteConfig } from "../config";
import { getLanguage } from "../utils/setting-utils";
import type I18nKey from "./i18nKey";
import { en } from "./languages/en";
import { es } from "./languages/es";
import { id } from "./languages/id";
import { ja } from "./languages/ja";
import { ko } from "./languages/ko";
import { th } from "./languages/th";
import { tr } from "./languages/tr";
import { vi } from "./languages/vi";
import { zh_CN } from "./languages/zh_CN";
import { zh_TW } from "./languages/zh_TW";

export type Translation = {
	[K in I18nKey]: string;
};

const defaultTranslation = zh_CN; // Default to zh_CN as requested

const map: { [key: string]: Translation } = {
	es: es,
	en: en,
	en_us: en,
	en_gb: en,
	en_au: en,
	zh_CN: zh_CN,
	// zh_tw: zh_TW, // I only use Simplified Chinese in my blog
	ja: ja,
	ja_jp: ja,
	ko: ko,
	ko_kr: ko,
	th: th,
	th_th: th,
	vi: vi,
	vi_vn: vi,
	id: id,
	tr: tr,
	tr_tr: tr,
};

export function getTranslation(lang: string): Translation {
	return map[lang.toLowerCase()] || defaultTranslation;
}

/**
 * Get translation based on stored language preference or site config
 */
export function i18n(key: I18nKey): string {
	// Try to get from localStorage first, fallback to siteConfig
	let lang: string;
	try {
		lang = getLanguage();
	} catch {
		// Fallback for SSR or when localStorage is not available
		lang = siteConfig.lang || "zh_CN";
	}
	return getTranslation(lang)[key];
}

/**
 * Get current language (for client-side use)
 */
export function getCurrentLanguage(): string {
	try {
		return getLanguage();
	} catch {
		return siteConfig.lang || "zh_CN";
	}
}
