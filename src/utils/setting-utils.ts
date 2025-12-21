import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

// Default language
const DEFAULT_LANGUAGE = "zh_CN";

/**
 * Detect user's preferred language from browser
 */
export function detectUserLanguage(): string {
	if (typeof navigator === "undefined") {
		return DEFAULT_LANGUAGE;
	}

	// Get browser language
	const browserLang = navigator.language || navigator.languages?.[0] || "zh-CN";

	// Normalize language code (convert to lowercase and replace dash with underscore)
	const normalizedLang = browserLang.toLowerCase().replace("-", "_");

	// Check if we support this language, otherwise fallback to zh_CN
	const supportedLanguages = [
		"zh_cn",
		/* "zh_tw", */ "en",
		"ja",
		"ko",
		"th",
		"vi",
		"id",
		"tr",
	];

	// Check exact match first
	if (supportedLanguages.includes(normalizedLang)) {
		return normalizedLang;
	}

	// Check language prefix (e.g., 'zh' for 'zh-CN')
	const langPrefix = normalizedLang.split("_")[0];
	const prefixMatches = supportedLanguages.filter((lang) =>
		lang.startsWith(langPrefix),
	);

	if (prefixMatches.length > 0) {
		// Return the first match (prioritize zh_cn for Chinese)
		return prefixMatches.includes("zh_cn") ? "zh_cn" : prefixMatches[0];
	}

	return DEFAULT_LANGUAGE;
}

/**
 * Get stored language or detect from browser
 */
export function getLanguage(): string {
	const stored = localStorage.getItem("language");
	return stored || detectUserLanguage();
}

/**
 * Set language preference
 */
export function setLanguage(lang: string): void {
	localStorage.setItem("language", lang.toLowerCase());
}

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
