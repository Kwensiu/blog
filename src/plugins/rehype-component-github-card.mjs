/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a GitHub Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.repo - The GitHub repository in the format "owner/repo".
 * @param {string} properties.user - The GitHub username.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function GithubCardComponent(properties, children) {
	// If children exist, it's an invalid directive
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("github" directive must be leaf type "::github{repo=\\"owner/repo\\"}" or "::github{user=\\"username\\"}")',
		]);

	// Create user card if user parameter is provided
	if (properties.user) {
		return GithubUserCardComponent(properties, children);
	}

	// Validate repo parameter
	if (!properties.repo || !properties.repo.includes("/"))
		return h(
			"div",
			{ class: "hidden" },
			'Invalid repository. ("repo" attribute must be in the format "owner/repo")',
		);

	const repo = properties.repo;
	const cardUuid = `GC${Math.random().toString(36).slice(-6)}`; // Collisions are not important

	const nAvatar = h(`div#${cardUuid}-avatar`, { class: "gc-avatar" });
	const nLanguage = h(
		`span#${cardUuid}-language`,
		{ class: "gc-language" },
		"Waiting...",
	);

	const nTitle = h("div", { class: "gc-titlebar" }, [
		h("div", { class: "gc-titlebar-left" }, [
			h("div", { class: "gc-owner" }, [
				nAvatar,
				h("div", { class: "gc-user" }, repo.split("/")[0]),
			]),
			h("div", { class: "gc-divider" }, "/"),
			h("div", { class: "gc-repo" }, repo.split("/")[1]),
		]),
		h("div", { class: "github-logo" }),
	]);

	const nDescription = h(
		`div#${cardUuid}-description`,
		{ class: "gc-description" },
		"Waiting for api.github.com...",
	);

	const nStars = h(`div#${cardUuid}-stars`, { class: "gc-stars" }, "00K");
	const nForks = h(`div#${cardUuid}-forks`, { class: "gc-forks" }, "0K");
	const nLicense = h(`div#${cardUuid}-license`, { class: "gc-license" }, "0K");

	const nScript = h(
		`script#${cardUuid}-script`,
		{ type: "text/javascript", defer: true },
		`
      fetch('https://api.github.com/repos/${repo}', { referrerPolicy: "no-referrer" }).then(response => response.json()).then(data => {
        document.getElementById('${cardUuid}-description').innerText = data.description?.replace(/:[a-zA-Z0-9_]+:/g, '') || "Description not set";
        document.getElementById('${cardUuid}-language').innerText = data.language;
        document.getElementById('${cardUuid}-forks').innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.forks).replaceAll("\u202f", '');
        document.getElementById('${cardUuid}-stars').innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.stargazers_count).replaceAll("\u202f", '');
        const avatarEl = document.getElementById('${cardUuid}-avatar');
        avatarEl.style.backgroundImage = 'url(' + data.owner.avatar_url + ')';
        avatarEl.style.backgroundColor = 'transparent';
        document.getElementById('${cardUuid}-license').innerText = data.license?.spdx_id || "no-license";
        document.getElementById('${cardUuid}-card').classList.remove("fetch-waiting");
        console.log("[GITHUB-CARD] Loaded card for ${repo} | ${cardUuid}.")
      }).catch(err => {
        const c = document.getElementById('${cardUuid}-card');
        c?.classList.add("fetch-error");
        console.warn("[GITHUB-CARD] (Error) Loading card for ${repo} | ${cardUuid}.")
      })
    `,
	);

	return h(
		`a#${cardUuid}-card`,
		{
			class: "card-github fetch-waiting no-styling",
			href: `https://github.com/${repo}`,
			target: "_blank",
			repo,
		},
		[
			nTitle,
			nDescription,
			h("div", { class: "gc-infobar" }, [nStars, nForks, nLicense, nLanguage]),
			nScript,
		],
	);
}

export function GithubUserCardComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("github-user" directive must be leaf type "::github-user{user=\\"username\\"}")',
		]);

	if (!properties.user)
		return h(
			"div",
			{ class: "hidden" },
			'Invalid username. ("user" attribute must be provided)',
		);

	const user = properties.user;
	const cardUuid = `GU${Math.random().toString(36).slice(-6)}`;
	const nAvatar = h(`div#${cardUuid}-avatar`, { class: "gu-avatar" });

	const nDisplayName = h(
		`div#${cardUuid}-name`,
		{ class: "gu-displayname" },
		"Loading... ",
	);

	const nUserName = h("div", { class: "gu-username" }, user);

	const nTitle = h("div", { class: "gu-titlebar" }, [
		h("div", { class: "gu-titlebar-left" }, [
			h("div", { class: "gu-user" }, [
				nAvatar,
				h("div", { class: "gu-user-info" }, [nDisplayName]),
				h("div", { class: "gc-divider" }, "/"),
				h("div", { class: "gu-user-info" }, [nUserName]),
			]),
		]),
		h("div", { class: "github-logo" }),
	]);

	const nDescription = h(
		`div#${cardUuid}-bio`,
		{ class: "gu-bio" },
		"Waiting for api.github.com...",
	);

	const nFollowers = h(
		`div#${cardUuid}-followers`,
		{ class: "gu-followers" },
		"0K",
	);
	const nFollowing = h(
		`div#${cardUuid}-following`,
		{ class: "gu-following" },
		"0K",
	);
	const nRepos = h(`div#${cardUuid}-repos`, { class: "gu-repos" }, "0");

	const nScript = h(
		`script#${cardUuid}-script`,
		{ type: "text/javascript", defer: true },
		`
      fetch('https://api.github.com/users/${user}', { referrerPolicy: "no-referrer" }).then(response => response.json()).then(data => {
        // Use username as display name if name is not available
        const displayName = data.name || data.login;
        document.getElementById('${cardUuid}-name').innerText = displayName;
        
        // Show placeholder if bio is empty
        const bioEl = document.getElementById('${cardUuid}-bio');
        if (data.bio && data.bio.trim() !== "") {
          bioEl.innerText = data.bio;
          bioEl.removeAttribute('data-placeholder');
        } else {
          bioEl.innerText = "There is no bio yet.";
          bioEl.setAttribute('data-placeholder', 'true');
        }
        
        // Followers count
        const followers = data.followers > 0 ? Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.followers).replaceAll("\u202f", '') : "0";
        document.getElementById('${cardUuid}-followers').innerText = followers;
        
        // Following count
        const following = data.following > 0 ? Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.following).replaceAll("\u202f", '') : "0";
        document.getElementById('${cardUuid}-following').innerText = following;
        
        // Repos count
        const repos = data.public_repos > 0 ? Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.public_repos).replaceAll("\u202f", '') : "0";
        document.getElementById('${cardUuid}-repos').innerText = repos;
        const avatarEl = document.getElementById('${cardUuid}-avatar');
        avatarEl.style.backgroundImage = 'url(' + data.avatar_url + ')';
        avatarEl.style.backgroundColor = 'transparent';
        document.getElementById('${cardUuid}-card').classList.remove("fetch-waiting");

        console.log("[GITHUB-USER-CARD] Loaded card for ${user} | ${cardUuid}.")
      }).catch(err => {
        const c = document.getElementById('${cardUuid}-card');
        c?.classList.add("fetch-error");
        console.warn("[GITHUB-USER-CARD] (Error) Loading card for ${user} | ${cardUuid}.")
      })
    `,
	);

	return h(
		`a#${cardUuid}-card`,
		{
			class: "card-github-user fetch-waiting no-styling",
			href: `https://github.com/${user}`,
			target: "_blank",
			user,
		},
		[
			nTitle,
			nDescription,
			h("div", { class: "gu-stats" }, [nFollowers, nFollowing, nRepos]),
			nScript,
		],
	);
}
