// 图片查看器工具类
class ImageViewerManager {
	private instance: any = null;
	private container: HTMLElement | null = null;

	// 初始化图片查看器
	init() {
		// 创建容器元素
		if (typeof document !== "undefined" && !this.container) {
			this.container = document.createElement("div");
			this.container.id = "image-viewer-container";
			document.body.appendChild(this.container);
		}
	}

	// 打开图片查看器
	open(options: {
		imageUrl: string;
		imageAlt?: string;
		imageTitle?: string;
		imageDescription?: string;
		imageMetadata?: {
			width?: number;
			height?: number;
			size?: string;
			format?: string;
			date?: string;
		};
	}) {
		if (!this.container) {
			this.init();
		}

		// 触发自定义事件，通知 Svelte 组件
		const event = new CustomEvent("open-image-viewer", {
			detail: {
				imageUrl: options.imageUrl,
				imageAlt: options.imageAlt || "",
				imageTitle: options.imageTitle || "",
				imageDescription: options.imageDescription || "",
				imageMetadata: {
					width: options.imageMetadata?.width || 0,
					height: options.imageMetadata?.height || 0,
					size: options.imageMetadata?.size || "",
					format: options.imageMetadata?.format || "",
					date: options.imageMetadata?.date || "",
				},
				// 添加PhotoSwipe配置选项，禁用鼠标滚轮滚动行为
				pswpOptions: {
					wheelToZoom: false,
					preventWheelZoom: true,
					wheelAction: "none",
					allowWheelOnImage: false,
				},
			},
		});

		document.dispatchEvent(event);
	}

	// 关闭图片查看器
	close() {
		const event = new CustomEvent("close-image-viewer");
		document.dispatchEvent(event);
	}
}

// 创建全局单例实例
const imageViewerManager = new ImageViewerManager();

// 导出管理器
export { imageViewerManager };

// 导出一个便捷函数，用于直接打开图片查看器
export function openImageViewer(options: {
	imageUrl: string;
	imageAlt?: string;
	imageTitle?: string;
	imageDescription?: string;
	imageMetadata?: {
		width?: number;
		height?: number;
		size?: string;
		format?: string;
		date?: string;
	};
}) {
	imageViewerManager.open(options);
}
