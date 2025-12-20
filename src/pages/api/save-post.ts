import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	try {
		const { filename, content } = await request.json();

		if (!filename || !content) {
			return new Response(JSON.stringify({ error: "文件名和内容不能为空" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 验证文件名格式
		if (!filename.endsWith(".md")) {
			return new Response(JSON.stringify({ error: "文件名必须以.md结尾" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 验证文件名安全性（防止路径遍历攻击）
		if (
			filename.includes("..") ||
			filename.includes("/") ||
			filename.includes("\\")
		) {
			return new Response(JSON.stringify({ error: "文件名格式不正确" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 验证内容长度
		if (content.length > 10 * 1024 * 1024) {
			return new Response(
				JSON.stringify({ error: "内容过大，请控制在10MB以内" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// 确保content/posts目录存在
		const postsDir = join(process.cwd(), "src", "content", "posts");
		await mkdir(postsDir, { recursive: true });

		// 写入文件
		const filePath = join(postsDir, filename);
		await writeFile(filePath, content, "utf-8");

		return new Response(
			JSON.stringify({
				success: true,
				message: "文章保存成功",
				filename: filename,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("保存文章时出错:", error);
		return new Response(
			JSON.stringify({ error: "服务器内部错误，请稍后重试" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
