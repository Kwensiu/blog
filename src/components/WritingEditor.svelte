<script lang="ts">
// UI状态管理
let isInitialized = false;

// 文章元数据
let title = "";
let description = "";
let tags: string[] = [];
let category = "";
let image = "";
let draft = false;
let lang = "zh_CN";

// 内容
let content = "";

// UI状态
let currentTab = "edit"; // 'edit' | 'preview'
let isLoading = false;
let showSuccess = false;
let errorMessage = "";

// 标签输入
let tagInput = "";

// Markdown预览
let previewHtml = "";

function addTag() {
	if (tagInput.trim() && !tags.includes(tagInput.trim())) {
		tags = [...tags, tagInput.trim()];
		tagInput = "";
	}
}

function removeTag(tag: string) {
	tags = tags.filter((t) => t !== tag);
}

function handleTagKeydown(event: KeyboardEvent) {
	if (event.key === "Enter" || event.key === ",") {
		event.preventDefault();
		addTag();
	}
}

// 简单的Markdown转HTML（基础实现）
function markdownToHtml(inputMarkdown: string): string {
	let markdown = inputMarkdown;

	// 先处理代码块，避免内部内容被解析
	const codeBlocks: string[] = [];
	const codeBlockRegex = /```([\s\S]*?)```/g;
	let codeMatch: RegExpExecArray | null;
	let codeIndex = 0;
	codeMatch = codeBlockRegex.exec(markdown);
	while (codeMatch !== null) {
		const fullMatch = codeMatch[0];
		const codeContent = codeMatch[1];
		const placeholder = `__CODE_BLOCK_${codeIndex}__`;
		// 修复：只使用<pre>标签，避免代码被二次包裹
		codeBlocks.push(`<pre>${codeContent}</pre>`);
		markdown = markdown.replace(fullMatch, placeholder);
		codeIndex++;
		codeMatch = codeBlockRegex.exec(markdown);
	}

	// 处理内联代码
	const inlineCodes: string[] = [];
	const inlineCodeRegex = /`([^`]+)`/g;
	let inlineMatch: RegExpExecArray | null;
	let inlineIndex = 0;
	inlineMatch = inlineCodeRegex.exec(markdown);
	while (inlineMatch !== null) {
		const fullMatch = inlineMatch[0];
		const codeContent = inlineMatch[1];
		const placeholder = `__INLINE_CODE_${inlineIndex}__`;
		inlineCodes.push(`<code>${codeContent}</code>`);
		markdown = markdown.replace(fullMatch, placeholder);
		inlineIndex++;
		inlineMatch = inlineCodeRegex.exec(markdown);
	}

	// 处理其他markdown语法
	let html = markdown
		// 标题
		.replace(/^### (.*$)/gim, "<h3>$1</h3>")
		.replace(/^## (.*$)/gim, "<h2>$1</h2>")
		.replace(/^# (.*$)/gim, "<h1>$1</h1>")
		// 粗体
		.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
		// 斜体
		.replace(/\*(.*?)\*/g, "<em>$1</em>")
		// 链接
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
		// 列表
		.replace(/^\* (.*$)/gim, "<li>$1</li>")
		.replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
		// 换行
		.replace(/\n\n/g, "</p><p>")
		.replace(/\n/g, "<br>")
		// 段落包装
		.replace(/^([^<].*)$/gm, "<p>$1</p>");

	// 恢复代码块
	codeBlocks.forEach((codeBlock, index) => {
		html = html.replace(`__CODE_BLOCK_${index}__`, codeBlock);
	});

	// 恢复内联代码
	inlineCodes.forEach((inlineCode, index) => {
		html = html.replace(`__INLINE_CODE_${index}__`, inlineCode);
	});

	return html;
}

// 更新预览
$: if (currentTab === "preview" && content) {
	previewHtml = markdownToHtml(content);
}

// 表单验证
function validateForm(): string | null {
	if (!title.trim()) {
		return "标题不能为空";
	}

	if (title.length > 100) {
		return "标题不能超过100个字符";
	}

	if (!content.trim()) {
		return "内容不能为空";
	}

	if (description && description.length > 200) {
		return "描述不能超过200个字符";
	}

	if (category && category.length > 50) {
		return "分类不能超过50个字符";
	}

	if (image && !image.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
		return "图片格式不正确，请使用jpg、png、gif或webp格式";
	}

	if (tags.length > 10) {
		return "标签不能超过10个";
	}

	for (const tag of tags) {
		if (tag.length > 20) {
			return `标签"${tag}"不能超过20个字符`;
		}
	}

	return null;
}

// 保存文章
async function savePost() {
	const validationError = validateForm();
	if (validationError) {
		errorMessage = validationError;
		return;
	}

	isLoading = true;
	errorMessage = "";

	try {
		// 生成文件名
		const slug = title
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();

		if (!slug) {
			throw new Error("标题格式不正确，无法生成有效的文件名");
		}

		// 构建frontmatter
		const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
published: ${new Date().toISOString()}
description: "${description ? description.replace(/"/g, '\\"') : ""}"
image: "${image}"
tags: [${tags.map((tag) => `"${tag.replace(/"/g, '\\"')}"`).join(", ")}]
category: ${category ? `"${category.replace(/"/g, '\\"')}"` : "null"}
draft: ${draft}
lang: "${lang}"
---`;

		const fullContent = `${frontmatter}\n\n${content}`;

		// 创建Blob对象用于下载
		const blob = new Blob([fullContent], {
			type: "text/markdown;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);

		// 创建下载链接
		const a = document.createElement("a");
		a.href = url;
		a.download = `${slug}.md`;

		// 触发下载
		document.body.appendChild(a);
		a.click();

		// 清理
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		showSuccess = true;
		setTimeout(() => {
			showSuccess = false;
		}, 3000);

		// 清空表单
		title = "";
		description = "";
		tags = [];
		category = "";
		image = "";
		draft = false;
		lang = "zh_CN";
		content = "";
	} catch (error) {
		errorMessage = error instanceof Error ? error.message : "保存失败";
	} finally {
		isLoading = false;
	}
}

// 新增uploadPost函数用于上传到服务器
async function uploadPost() {
	const validationError = validateForm();
	if (validationError) {
		errorMessage = validationError;
		return;
	}

	isLoading = true;
	errorMessage = "";

	try {
		// 生成文件名
		const slug = title
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();

		if (!slug) {
			throw new Error("标题格式不正确，无法生成有效的文件名");
		}

		// 构建frontmatter
		const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
published: ${new Date().toISOString()}
description: "${description ? description.replace(/"/g, '\\"') : ""}"
image: "${image}"
tags: [${tags.map((tag) => `"${tag.replace(/"/g, '\\"')}"`).join(", ")}]
category: ${category ? `"${category.replace(/"/g, '\\"')}"` : "null"}
draft: ${draft}
lang: "${lang}"
---`;

		const fullContent = `${frontmatter}\n\n${content}`;

		// 发送到服务器保存
		const response = await fetch("/blog/api/save-post/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				filename: `${slug}.md`,
				content: fullContent,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "保存失败");
		}

		showSuccess = true;
		setTimeout(() => {
			showSuccess = false;
		}, 3000);

		// 清空表单
		title = "";
		description = "";
		tags = [];
		category = "";
		image = "";
		draft = false;
		lang = "zh_CN";
		content = "";
	} catch (error) {
		errorMessage = error instanceof Error ? error.message : "保存失败";
	} finally {
		isLoading = false;
	}
}
</script>

<div class="writing-editor">

	<!-- 成功提示 -->
	{#if showSuccess}
		<div class="mb-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
			<div class="flex items-center">
				<span class="text-green-800 dark:text-green-200">文章保存成功！</span>
			</div>
		</div>
	{/if}

	<!-- 错误提示 -->
	{#if errorMessage}
		<div class="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
			<span class="text-red-800 dark:text-red-200">{errorMessage}</span>
		</div>
	{/if}

	<!-- 元数据表单 -->
	<div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
		<h3 class="text-lg font-semibold mb-4 text-black/90 dark:text-white/90">文章信息</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- 标题 -->
			<div class="md:col-span-2">
				<label for="title" class="block text-sm font-medium mb-1 text-black/70 dark:text-white/70">标题 *</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					placeholder="输入文章标题"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
				/>
			</div>

			<!-- 描述 -->
			<div class="md:col-span-2">
				<label for="description" class="block text-sm font-medium mb-1 text-black/70 dark:text-white/70">描述</label>
				<input
					id="description"
					type="text"
					bind:value={description}
					placeholder="输入文章描述（可选）"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
				/>
			</div>

			<!-- 分类 -->
			<div>
				<label for="category" class="block text-sm font-medium mb-1 text-black/70 dark:text-white/70">分类</label>
				<input
					id="category"
					type="text"
					bind:value={category}
					placeholder="输入分类"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
				/>
			</div>

			<!-- 图片 -->
			<div>
				<label for="image" class="block text-sm font-medium mb-1 text-black/70 dark:text-white/70">封面图片</label>
				<input
					id="image"
					type="text"
					bind:value={image}
					placeholder="图片路径"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
				/>
			</div>

			<!-- 标签 -->
			<div class="md:col-span-2">
				<label class="block text-sm font-medium mb-1 text-black/70 dark:text-white/70">标签</label>
				<div class="flex flex-wrap gap-2 mb-2">
					{#each tags as tag}
						<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
							{tag}
							<button
								on:click={() => removeTag(tag)}
								class="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
							>
								×
							</button>
						</span>
					{/each}
				</div>
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={tagInput}
						on:keydown={handleTagKeydown}
						placeholder="输入标签，按回车添加"
						class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
					/>
					<button
						on:click={addTag}
						class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
					>
						添加
					</button>
				</div>
			</div>

			<!-- 语言 -->
			<div>
				<label for="lang" class="block text-sm font-medium mb-1 text-black/70 dark:text-white/70">语言</label>
				<select
					id="lang"
					bind:value={lang}
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
				>
					<option value="zh_CN">中文(简体)</option>
					<option value="zh_TW">中文(繁体)</option>
					<option value="en">English</option>
					<option value="ja">日本語</option>
					<option value="ko">한국어</option>
				</select>
			</div>

			<!-- 草稿 -->
			<div class="flex items-center">
				<input
					id="draft"
					type="checkbox"
					bind:checked={draft}
					class="mr-2"
				/>
				<label for="draft" class="text-sm font-medium text-black/70 dark:text-gray-400">草稿</label>
			</div>
		</div>
	</div>

	<!-- 内容编辑器 -->
	<div class="mb-6">
		<!-- 标签页 -->
		<div class="flex border-b border-gray-200 dark:border-gray-700 mb-4">
			<button
				on:click={() => currentTab = 'edit'}
				class="px-4 py-2 border-b-2 {currentTab === 'edit' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'} transition-colors"
			>
				编辑
			</button>
			<button
				on:click={() => currentTab = 'preview'}
				class="px-4 py-2 border-b-2 {currentTab === 'preview' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'} transition-colors"
			>
				预览
			</button>
		</div>

		<!-- 编辑器/预览区域 -->
		{#if currentTab === 'edit'}
			<textarea
				bind:value={content}
				placeholder="在这里输入Markdown内容..."
				class="w-full h-96 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white font-mono text-sm resize-vertical"
				spellcheck="false"
			></textarea>
		{:else}
			<div class="min-h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 overflow-auto">
				{#if content}
					<div class="writing-preview prose dark:prose-invert prose-base !max-w-none custom-md text-black dark:text-white">
						{@html previewHtml}
					</div>
				{:else}
					<div class="text-gray-500 dark:text-gray-400 text-center py-8">
						<p>预览将在您输入内容后显示</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- 操作按钮 -->
	<div class="flex justify-end gap-4">
		<button
			on:click={savePost}
			disabled={isLoading}
			class="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
		>
			{#if isLoading}
				保存中...
			{:else}
				下载文章
			{/if}
		</button>
		
		<button
			on:click={uploadPost}
			disabled={isLoading}
			class="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
		>
			{#if isLoading}
				上传中...
			{:else}
				上传文章
			{/if}
		</button>
	</div>
</div>

<style>
	.writing-editor {
		@apply text-black dark:text-white;
	}

	.writing-editor textarea:focus,
	.writing-editor input:focus,
	.writing-editor select:focus {
		@apply outline-none ring-2 ring-blue-500 border-blue-500;
	}

	/* 预览区域样式覆盖，防止markdown.css的伪元素影响代码块 */
	.writing-preview :global(p::after),
	.writing-preview :global(li::after),
	.writing-preview :global(h1::after),
	.writing-preview :global(h2::after),
	.writing-preview :global(h3::after),
	.writing-preview :global(h4::after),
	.writing-preview :global(h5::after),
	.writing-preview :global(h6::after) {
		display: none !important;
	}

	/* 确保代码块内的内容不受影响 */
	.writing-preview :global(pre),
	.writing-preview :global(code) {
		position: relative;
	}

	.writing-preview :global(pre::after),
	.writing-preview :global(code::after) {
		display: none !important;
	}
</style>