class VideoCard extends HTMLElement {
  setConfig(config) {
    this.config = config;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
		const top = this.config.top || '0';  ;
		const url_sum = this.config.url;
		var url = url_sum[Math.floor(Math.random() * url_sum.length)] ;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100vw;
          height: 100vh;
					top: ${top};
          --control-size: 44px;
          --icon-size: 24px;
          --button-spacing: 12px;
          --bg-color: rgba(0, 0, 0, 0);
          --hover-bg: rgba(0, 0, 0, 0);
        }

				.image-container {
					position: relative;  /* 创建定位上下文 */
					width: 100vw;        /* 自定义容器尺寸 */
					height: 100vh;
					overflow: hidden;    /* 裁剪超出部分 */
					display: flex;           /* 新增 */
					justify-content: center; /* 新增 */
					align-items: center;     /* 新增 */
				}

				#Imgid {
					object-fit: cover;
					object-position: center;
					min-width: 100%;     /* 新增 */
					min-height: 100%;    /* 新增 */
					position: relative;  /* 如果不需要绝对定位可改为 relative */
				}

        .controls-container {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: flex;
          gap: var(--button-spacing);
          z-index: 10;
        }

        .control-btn {
          width: 15px;
          height: 15px;
          background: rgb(0,0,0,0);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0);
          border: 1px solid rgba(0, 0, 0, 0);
        }
        .control-btn:hover {
          background: var(--hover-bg);
          transform: scale(1.05);
        }

        .control-btn:active {
          transform: scale(0.95);
        }

        ha-icon {
          width: var(--icon-size);
          height: var(--icon-size);
          color: white;
        }
      </style>
			<div class="image-container">
				<img id="Imgid" src="${url}" alt="content">
			</div>
      <div class="controls-container">
        <div class="control-btn" id="refreshBtn" aria-label="Refresh video">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </div>
      </div>
    `;

    // 刷新功能
		const refreshBtn = this.shadowRoot.getElementById('refreshBtn');
		refreshBtn.addEventListener('click', () => {
			const imgElement = this.shadowRoot.getElementById('Imgid');
			
			// 按钮旋转动画（保持原有交互反馈）
			refreshBtn.animate([
				{ transform: 'rotate(0deg)' },
				{ transform: 'rotate(360deg)' }
			], {
				duration: 1000,
				iterations: 1
			});
		
			// 带缓存清除的图片刷新
			const newSrc = `${url}?t=${Date.now()}`;
			
			// 使用图片预加载模式避免闪白
			const tempImg = new Image();
			tempImg.onload = () => {
				imgElement.src = newSrc;
			};
			tempImg.src = newSrc;
		});

  }
}

customElements.define('xiaoshi-image-card', VideoCard);
