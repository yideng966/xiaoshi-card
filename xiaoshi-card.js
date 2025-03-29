class VideoCard extends HTMLElement {
  setConfig(config) {
    this.config = config;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.currentVideo = 1; // 当前显示的视频标识
    this.render();
  }

  render() {
    const top = this.config.top || '0';
    const initialUrl = this.getRandomUrl();
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100vw; !important;
          height: 100vh; !important;
          overflow: hidden;
          top: ${top};
          --control-size: 44px;
          --icon-size: 24px;
          --button-spacing: 12px;
          --bg-color: rgba(0, 0, 0, 0);
          --hover-bg: rgba(0, 0, 0, 0);
          --transition-duration: 0.1s;
          --background-color: rgba(0, 0, 0, 0);
        }
        .video-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          visibility: hidden;
          background: var(--background-color); /* 背景保护层 */
        }
        .video-container.active {
          opacity: 1;
          visibility: visible;
          transition-delay: 0s;
        }
        /* 新增中间过渡保护层 */
        .transition-guard {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--background-color);
          opacity: 0;
          pointer-events: none;
          z-index: 999;
          transition: opacity calc(var(--transition-duration) / 2) ease;
        }

        .transition-active .transition-guard {
          opacity: 1;
        }

        .active {
          opacity: 1 !important;
        }

        /* 隐藏所有浏览器控件 */
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
					display: block;
          border-radius: 0
					transition: opacity 0.3s ease; /* 新增过渡效果 */
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        video::-webkit-media-controls {
          display: none !important;
        }

        .controls-container1 {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: flex;
          gap: var(--button-spacing);
          z-index: 10;
        }
        .controls-container2 {
          position: absolute;
          bottom: 16px;
          left: 16px;
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
			
      <!-- 添加过渡保护层 -->
      <div class="transition-guard"></div>
      <!-- 双视频容器 -->
      <div class="video-container active" id="video1">
        <video 
          id="vid1"
          muted 
          autoplay 
          loop 
          playsinline
          webkit-playsinline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        >
          <source src="${initialUrl}" type="video/mp4">
        </video>
      </div>
      
      <div class="video-container" id="video2">
        <video 
          id="vid2"
          muted 
          autoplay 
          loop 
          playsinline
          webkit-playsinline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        ></video>
      </div>

      <!-- 控制按钮保持不变 -->
      <div class="controls-container1">
        <div class="control-btn" id="refreshBtn">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </div>
      </div>
      <div class="controls-container2">
        <div class="control-btn" id="muteBtn">
          <ha-icon icon="mdi:volume-off"></ha-icon>
        </div>
      </div>
    `;


    this.initVideos();
    this.initControls();
  }

  getRandomUrl() {
    return this.config.url[Math.floor(Math.random() * this.config.url.length)];
  }

  initVideos() {
    this.vid1 = this.shadowRoot.getElementById('vid1');
    this.vid2 = this.shadowRoot.getElementById('vid2');
    this.container1 = this.shadowRoot.getElementById('video1');
    this.container2 = this.shadowRoot.getElementById('video2');
  }

  initControls() {
    // 静音功能（同步控制两个视频）
    const muteBtn = this.shadowRoot.getElementById('muteBtn');
    muteBtn.addEventListener('click', () => {
      const newMuted = !this.vid1.muted;
      [this.vid1, this.vid2].forEach(vid => vid.muted = newMuted);
      muteBtn.querySelector('ha-icon').setAttribute('icon', 
        newMuted ? 'mdi:volume-off' : 'mdi:volume-high'
      );
    });

    // 刷新功能（改进版）
    const refreshBtn = this.shadowRoot.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', async () => {
			const currentVideo = this.currentVideo === 1 ? this.vid1 : this.vid2;
			const nextVideo = this.currentVideo === 1 ? this.vid2 : this.vid1;
			const currentContainer = this.currentVideo === 1 ? this.container1 : this.container2;
			const nextContainer = this.currentVideo === 1 ? this.container2 : this.container1;
	
			// 激活过渡保护
			this.shadowRoot.host.classList.add('transition-active');
	
			try {
				// 步骤1：预加载新视频
				const newSrc = `${this.getRandomUrl()}?t=${Date.now()}`;
				nextVideo.src = newSrc;
				nextVideo.muted = currentVideo.muted;
	
				// 步骤2：等待新视频可播放 
				await new Promise((resolve, reject) => {
					nextVideo.addEventListener('loadeddata', resolve, { once: true });
					nextVideo.addEventListener('error', reject, { once: true });
				});
	
				// 步骤3：同步播放状态
				if (!currentVideo.paused) {
					nextVideo.play().catch(() => {});
				}
	
				// 步骤4：执行交叉过渡
				currentContainer.style.transitionDelay = '0s';
				nextContainer.style.transitionDelay = '0s';
				
				nextContainer.classList.add('active');
				currentContainer.classList.remove('active');
	
				// 步骤5：延迟清理旧容器
				setTimeout(() => {
					currentVideo.pause();
					currentVideo.currentTime = 0;
					currentVideo.src = '';
					this.shadowRoot.host.classList.remove('transition-active');
				}, this.transitionDuration * 1000);
	
				this.currentVideo = this.currentVideo === 1 ? 2 : 1;
	
      } catch (error) {
        this.shadowRoot.host.classList.remove('transition-active');
      }
    });
  }
}

customElements.define('xiaoshi-video-card', VideoCard);

class ImageCard extends HTMLElement {
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

customElements.define('xiaoshi-image-card', ImageCard);

class LightCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    // 基础容器
    this.container = document.createElement('div');
    this.container.className = 'xiaoshi-container';
    
    // 样式表（固定部分）
    const style = document.createElement('style');
    style.textContent = `
      /* 基础容器样式 */
      .xiaoshi-container {
        min-height: 80px; /* 默认高度 */
        border-radius: 12px;
        padding: 0 16px 0 8px;
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
        gap: 16px;
        position: relative;
        overflow: hidden;
      }

      /* 名称样式 */
      .device-name {
        min-width: 100px;
        flex: 1;
        font-size: 1.2rem;
        font-weight: 600;
        white-space: nowrap;
        z-index: 1;
      }

      /* 控制区域 */
      .controls-container {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 1;
      }

      /* 滑动条容器 */
      .slider-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .slider-label {
        width: 30px;
        font-size: 0.9rem;
				background: rgb(0,0,0,0)
      }

      /* 滑动条轨道 */
      .slider-track {
        flex: 1;
        height: 25px;
        border-radius: 7px;
        position: relative;
        cursor: none;
      }
			.slider-track.brightness-track {
				background: rgba(254, 111, 33, 0.2); /* 注意移除多余分号 */
			}
			.slider-track.color_temp-track {
				background: linear-gradient(to right, #FE6F21, #FFFFFF) !important;
			}
      .slider-track.inactive {
        background: rgb(180,180,180,0.5) !important;
      }
			
      /* 进度条 */
      .slider-progress {
        position: absolute;
        left: 0;
        height: 100%;
        background: #fe6f21;
        border-radius: 7px 0 0 7px;
        transition: width 0.2s ease;
        cursor: none;
      }
			.slider-progress.color_temp-track {
				background: rgb(0,0,0,0) !important;
			}
      /* 原生滑动条隐藏 */
      .slider-input {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0;
        z-index: 2;
        cursor: none;
        -webkit-appearance: none;
      }

      /* 自定义滑块 */
      .slider-thumb {
        position: absolute;
        width: 3px;
        height: 20px;
        background: #999;
        border-radius: 3px;
        border: 1.5px solid #fff;
				box-shadow: 0px 0px 0px 1px #999;
        top: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 3;
      }
      .slider-thumb.inactive {
				opacity: 0;
      }

      /* 电源按钮 */
      .power-button {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .power-button.active {
        background: #fe6f21;
      }

      ha-icon {
        --mdc-icon-size: 24px;
        color: var(--icon-color, #666666);
      }

      .power-button.active ha-icon {
        color: white;
      }
    `;

    // 初始化DOM结构
    shadow.appendChild(style);
    shadow.appendChild(this.container);
    
    // 状态变量
    this._config = null;
    this._hass = null;
  }

  setConfig(config) {
    this._config = config;
    this._renderContent();
  }

  set hass(hass) {
    this._hass = hass;
    this._renderContent();
  }

  // 新增主题评估方法
  _evaluateTheme() {
    try {
      if (typeof this._config.theme === 'function') return this._config.theme();
      if (typeof this._config.theme === 'string' && this._config.theme.includes('theme()')) {
        return (new Function('return theme()'))();
      }
      return this._config.theme || 'off';
    } catch(e) {
      return 'off';
    }
  }
  // 新增背景生成方法
  _getBackground(state) {
    const theme = this._evaluateTheme();
    if (state === 'on') {
      return theme === 'off' 
        ? 'linear-gradient(90deg, #FE6F21 -20%, #323232 70%)'
        : 'linear-gradient(90deg, #FE6F21 -20%, #FFF 70%)';
    }
    return theme === 'off' ? '#323232' : '#FFF';
  }


  _renderContent() {
    if (!this._config || !this._hass) return;
    // 应用用户定义的尺寸
    this.container.style.width = this._config.width || '100vw';
    this.container.style.height = this._config.height || '20vw';
    const entity = this._config.entity;
    const stateObj = this._hass.states[entity] || {};
    const state = stateObj.state || 'off';
		const isActive = state === 'on';
    const attributes = stateObj.attributes || {};
    // 获取主题颜色
    const themeColor = this._evaluateTheme() === 'on' ? '#333' : '#FFF';
    // 设备名称颜色设置
    const nameElement = document.createElement('div');
    nameElement.className = 'device-name';
    nameElement.textContent = attributes.friendly_name || entity;
    nameElement.style.color = themeColor; // 设置名称颜色

    // 处理show配置
    const showMode = this._config.show || 'always';
    const showCard = showMode === 'auto' ? state === 'on' : true;
    if (!showCard) {
      this.container.style.display = 'none';
      return;
    }
    this.container.style.display = 'flex';

    // 应用背景样式
    this.container.style.background = this._getBackground(state);
    this.container.style.boxShadow = this._evaluateTheme() === 'off' 
      ? '0 2px 4px rgba(0,0,0,0.1)' 
      : 'none';

    // 清除旧内容
    this.container.innerHTML = '';


    // 控制区域
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';

    // 处理rgb配置
    if (this._config.rgb) {
      // 亮度控制
      const brightnessGroup = this._createSliderGroup(
        '亮度',
        'brightness',
        themeColor, // 传入颜色参数
        Math.max(5, Math.min(255, attributes.brightness || 5)),
        5,
        255,
        ((attributes.brightness - 5) / 250 * 100).toFixed(1),
				isActive // 传递激活状态
      );
      controlsContainer.appendChild(brightnessGroup);

      // 色温控制
      if (attributes.supported_color_modes?.includes('color_temp')) {
        const kelvin = attributes.color_temp_kelvin || 
          Math.round(1000000 / (attributes.color_temp || 370));
					const colorTempGroup = this._createSliderGroup(
						'色温',
						'color_temp',
						themeColor,    // 新增颜色参数
						kelvin,
						2700,
						6500,
						((kelvin - 2700) / 3800 * 100).toFixed(1),
						isActive // 传递激活状态
					);
        controlsContainer.appendChild(colorTempGroup);
      }
    }

    // 电源按钮
    const powerButton = document.createElement('div');
    powerButton.className = `power-button ${state === 'on' ? 'active' : ''}`;
    powerButton.innerHTML = '<ha-icon icon="mdi:power"></ha-icon>';
    powerButton.style.backgroundColor = state === 'on' ? '#FE6F21' : 'rgba(150,150,150,0.8)';
    powerButton.querySelector('ha-icon').style.color = state === 'on' ? '#FFF' : '#FE6F21';
    powerButton.addEventListener('click', () => this._togglePower());


    // 组合元素
    this.container.appendChild(nameElement);
    if (this._config.rgb) this.container.appendChild(controlsContainer);
    this.container.appendChild(powerButton);

    // 初始化滑动条事件
    this._initSliders(); 
  }

  _createSliderGroup(label, type, color, value, min, max, percent, isActive) {
    const group = document.createElement('div');
		group.className = `slider-group ${isActive ? 'active' : 'inactive'}`;
    const labelElement = document.createElement('span');
    labelElement.className = 'slider-label';
    labelElement.textContent = label;
    labelElement.style.color = color; // 应用统一颜色

    const track = document.createElement('div');
    track.className = `slider-track ${type}-track ${isActive ? 'active' : 'inactive'}`; 

    // 仅亮度需要进度条
		const progress = document.createElement('div');
		progress.className = `slider-progress ${type}-track`; 
		progress.style.width = `${percent}%`;


    const input = document.createElement('input');
    input.className = 'slider-input';
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.value = value;
    input.dataset.type = type;

    const thumb = document.createElement('div');
    thumb.className = `slider-thumb ${isActive ? 'active' : 'inactive'}`;
    thumb.style.left = `${percent}%`;


    track.appendChild(progress);
    track.appendChild(input);
    track.appendChild(thumb);
    
    group.appendChild(labelElement);
    group.appendChild(track);
    return group;
  }

  _initSliders() {
    this.container.querySelectorAll('.slider-input').forEach(input => {
      input.addEventListener('input', e => {
        const type = e.target.dataset.type;
        const value = parseInt(e.target.value);
        const percent = ((value - e.target.min) / (e.target.max - e.target.min) * 100).toFixed(1);
        
        // 更新视觉元素
        const track = e.target.parentElement;
        track.querySelector('.slider-progress').style.width = `${percent}%`;
        track.querySelector('.slider-thumb').style.left = `${percent}%`;

        // 调用服务
        if (type === 'brightness') {
          this._adjustBrightness(value);
        } else if (type === 'color_temp') {
          this._adjustColorTemp(value);
        }
      });
    });
  }

  _togglePower() {
    const entity = this._config.entity;
    this._hass.callService('light', 'toggle', { entity_id: entity });
    
    // 触觉反馈
    try { navigator.vibrate(50); } catch(e) {}
    
    // 按钮动画
    const button = this.container.querySelector('.power-button');
    button.style.transform = 'scale(0.8)';
    setTimeout(() => button.style.transform = 'scale(1.2)', 300);
  }

  _adjustBrightness(value) {
    const entity = this._config.entity;
    this._hass.callService('light', 'turn_on', {
      entity_id: entity,
      brightness: Math.max(5, Math.min(255, value)),
      transition: 0.3
    });
  }

  _adjustColorTemp(value) {
    const entity = this._config.entity;
    const attributes = this._hass.states[entity]?.attributes || {};
    
    const params = {};
    if (attributes.color_temp_kelvin !== undefined) {
      params.color_temp_kelvin = value;
    } else if (attributes.color_temp !== undefined) {
      params.color_temp = Math.round(1000000 / value);
    }

    this._hass.callService('light', 'turn_on', {
      entity_id: entity,
      ...params,
      transition: 0.3
    });
  }
}

customElements.define('xiaoshi-light-card', LightCard);

class LightGroupCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this.mainContainer = document.createElement('div');
    this.mainContainer.className = 'main-container';
    shadow.appendChild(this.mainContainer); // 将主容器直接加入shadow root
    this.container = document.createElement('div');
    
    // 样式表（固定部分）
    const style = document.createElement('style');
    style.textContent = `
			/* 新增外层容器样式 */
			.main-container {
				display: flex;
				flex-direction: column;
				gap: 8px;
				width: 100%;
			}

      /* 新增头部样式 */
      .stats-header {
				min-height: 20px; /* 保持最小高度 */
        display: flex;
        justify-content: space-between;
        align-items: center;
				position: relative;
        padding: 0 8px 0 8px;
        margin-bottom: 5px;
      }

			.stats-text {
				text-shadow: 
					0.05em 0 0 #fff,
					-0.05em 0 0 #fff,
					0 0.05em 0 #fff,
					0 -0.05em 0 #fff,
					0.05em 0.05em 0 #fff,
					-0.05em -0.05em 0 #fff,
					0.05em -0.05em 0 #fff,
					-0.05em 0.05em 0 #fff;
				font-size: 1.2rem;
				font-weight: 700;
				transition: color 0.3s;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				width: max-content;
			}
			
      .all-off-button {
				visibility: visible !important; /* 始终保留空间 */
				width: 40px;
				height: 20px;
				margin-left: auto;
        margin-right: 8px;
				font-size: 0.9rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: none;
				transition: opacity 0.3s ease; /* 添加渐隐效果 */
      }

      .all-off-button:hover {
        opacity: 0.8;
        transform: scale(1.05);
        border-radius: 8px;
        cursor: none;
      }


      /* 基础容器样式 */
      .entity-container {
        min-height: 80px; /* 默认高度 */
        border-radius: 12px;
        padding: 0 16px 0 8px;
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
        gap: 16px;
        position: relative;
        overflow: hidden;
        width: 100%;
      }

      /* 名称样式 */
      .device-name {
        min-width: 100px;
        flex: 1;
        font-size: 1.2rem;
        font-weight: 600;
        white-space: nowrap;
        z-index: 1;
      }

      /* 控制区域 */
      .controls-container {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 2vw;
        z-index: 1;
      }

      /* 滑动条容器 */
      .slider-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .slider-label {
        width: 30px;
        font-size: 0.9rem;
				background: rgb(0,0,0,0)
      }

      /* 滑动条轨道 */
      .slider-track {
        flex: 1;
        height: 25px;
        border-radius: 7px;
        position: relative;
        cursor: none;
      }
			.slider-track.brightness-track {
				background: rgba(254, 111, 33, 0.2); /* 注意移除多余分号 */
			}
			.slider-track.color_temp-track {
				background: linear-gradient(to right, #FE6F21, #FFFFFF) !important;
			}
      .slider-track.inactive {
        background: rgb(180,180,180,0.5) !important;
      }
			
      /* 进度条 */
      .slider-progress {
        position: absolute;
        left: 0;
        height: 100%;
        background: #fe6f21;
        border-radius: 7px 0 0 7px;
        transition: width 0.2s ease;
        cursor: none;
      }
			.slider-progress.color_temp-track {
				background: rgb(0,0,0,0) !important;
			}
      /* 原生滑动条隐藏 */
      .slider-input {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0;
        z-index: 2;
        cursor: none;
        -webkit-appearance: none;
      }

      /* 自定义滑块 */
      .slider-thumb {
        position: absolute;
        width: 3px;
        height: 20px;
        background: #999;
        border-radius: 3px;
        border: 1.5px solid #fff;
				box-shadow: 0px 0px 0px 1px #999;
        top: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 3;
      }
      .slider-thumb.inactive {
				opacity: 0;
      }

      /* 电源按钮 */
      .power-button {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .power-button.active {
        background: #fe6f21;
      }

      ha-icon {
        --mdc-icon-size: 24px;
        color: var(--icon-color, #666666);
      }

      .power-button.active ha-icon {
        color: white;
      }
    `;

    // 初始化DOM结构
    shadow.appendChild(style);
    shadow.appendChild(this.container);
    
    // 状态变量
    this._config = null;
    this._hass = null;
  }

  setConfig(config) {
    const configCopy = JSON.parse(JSON.stringify(config));
    const normalizedEntities = this._normalizeEntities(configCopy);
    // 确保entity始终为数组
    // 构建新配置对象
    this._config = Object.freeze({
      entities: normalizedEntities,
      rgb: configCopy.rgb ,
      theme: configCopy.theme || 'off',
      width: configCopy.width || '100%',
      height: configCopy.height || '20vw',
      show: configCopy.show 
    });
  }
  _normalizeEntities(config) {
    // 处理实体字段的三种情况
    if (config.entities) {
      return Array.isArray(config.entities) 
        ? [...config.entities]
        : [config.entities];
    }
    if (config.entity) {
      return Array.isArray(config.entity)
        ? [...config.entity]
        : [config.entity];
    }
    throw new Error('必须配置至少一个实体');
  }

  set hass(hass) {
    this._hass = hass;
    this._renderContent();
  }

  // 新增主题评估方法
  _evaluateTheme() {
    try {
      if (typeof this._config.theme === 'function') return this._config.theme();
      if (typeof this._config.theme === 'string' && this._config.theme.includes('theme()')) {
        return (new Function('return theme()'))();
      }
      return this._config.theme || 'off';
    } catch(e) {
      return 'off';
    }
  }
  // 新增背景生成方法
  _getBackground(state) {
    const theme = this._evaluateTheme();
    if (state === 'on') {
      return theme === 'off' 
        ? 'linear-gradient(90deg, #FE6F21 -30%, #323232 50%)'
        : 'linear-gradient(90deg, #FE6F21 -30%, #FFF 50%)';
    }
    return theme === 'off' ? '#323232' : '#FFF';
  }


  _renderContent() {
    if (!this._config || !this._hass) return;
    this.mainContainer.innerHTML = '';

    const header = this._createStatsHeader();
    this.mainContainer.appendChild(header);
    // 遍历所有实体
    this._config.entities.forEach(entity => {
      // 修正2：验证实体是否存在
      if (!this._hass.states[entity]) {
        console.error(`实体 ${entity} 不存在`);
        return;
      }
      const entityContainer = document.createElement('div');
      entityContainer.className = 'entity-container';
			// 应用用户定义的尺寸
      entityContainer.style.width = this._config.width || '100%';
      entityContainer.style.height = this._config.height ;
			const stateObj = this._hass.states[entity] || {};
			const state = stateObj.state || 'off';
			const isActive = state === 'on';
			const attributes = stateObj.attributes || {};

			// 设备名称颜色设置
			const nameElement = document.createElement('div');
			nameElement.className = 'device-name';
			nameElement.textContent = attributes.friendly_name || entity;
			nameElement.style.color = this._evaluateTheme() === 'off' ? '#FFF' : '#333';

			// 控制区域
			const controlsContainer = document.createElement('div');
			controlsContainer.className = 'controls-container';
			// 获取主题颜色
			const themeColor = this._evaluateTheme() === 'on' ? '#333' : '#FFF';
			// 处理rgb配置
			if (this._config.rgb) {
				// 亮度控制（修改为当前实体）
				if (attributes.brightness !== undefined) {
					const brightnessGroup = this._createSliderGroup(
						entity, 
						'亮度', 
						'brightness', 
						themeColor, // 传入颜色参数
						Math.max(5, Math.min(255, attributes.brightness || 5)),
						5, 
						255, 
						((attributes.brightness - 5) / 250 * 100).toFixed(1), 
						isActive
					);
					controlsContainer.appendChild(brightnessGroup);
				}

				// 色温控制（修改为当前实体）
				if (attributes.supported_color_modes?.includes('color_temp')) {
					const kelvin = attributes.color_temp_kelvin || Math.round(1000000 / (attributes.color_temp || 370));
					const colorTempGroup = this._createSliderGroup(
						entity, 
						'色温', 
						'color_temp',
						themeColor, // 传入颜色参数
						kelvin, 
						2700, 
						6500, 
						((kelvin - 2700) / 3800 * 100).toFixed(1), isActive
					);
					controlsContainer.appendChild(colorTempGroup);
				}
			}

      // 电源按钮（绑定当前实体）
      const powerButton = this._createPowerButton(entity, state);

      // 组合元素
      entityContainer.appendChild(nameElement);
      if (this._config.rgb) entityContainer.appendChild(controlsContainer);
      entityContainer.appendChild(powerButton);
      
      // 应用背景样式
      entityContainer.style.background = this._getBackground(state);
      entityContainer.style.boxShadow = this._evaluateTheme() === 'off' 
        ? '0 2px 4px rgba(0,0,0,0.1)' 
        : 'none';


			// 处理show配置
			const showMode = this._config.show || 'always';
			const showCard = showMode === 'auto' ? state === 'on' : true;
      entityContainer.style.display = showCard ? 'flex' : 'none'; // 修正这里

      this.mainContainer.appendChild(entityContainer);
      entityContainer.querySelectorAll('.slider-input').forEach(input => {
        this._initSliders(input, entity);
      });
    });
  }

  _createStatsHeader() {
    const header = document.createElement('div');
    header.className = 'stats-header';
    
    // 统计开启数量
    const onCount = this._config.entities.filter(entity => 
      this._hass.states[entity]?.state === 'on'
    ).length;

    // 应用主题颜色
    const themeColor = this._evaluateTheme() === 'on' ? '#333' : '#FFF';
    const bgColor = this._evaluateTheme() === 'on' ? '#FFF' : '#333';
    // 统计文本
    const statsText = document.createElement('div');
    statsText.className = 'stats-text';
    statsText.textContent = `总共开启 ${onCount} 盏灯`;
    statsText.style.color = themeColor;
		statsText.style.textShadow = themeColor === '#333' 
    ? '0.05em 0 #fff, -0.05em 0 #fff, 0 0.05em #fff, 0 -0.05em #fff, 0.05em 0.05em #fff, -0.05em -0.05em #fff, 0.05em -0.05em #fff, -0.05em 0.05em #fff' 
    : 'none'; // 深色主题时显示轮廓
    // 全关按钮
    const offButton = document.createElement('div');
    offButton.className = 'all-off-button';
		offButton.textContent = '全关'; // 改为文字内容
    offButton.addEventListener('click', () => this._turnOffAll());
		offButton.style.color = '#fff'; // 白色文字
		offButton.style.backgroundColor = '#777'; // 橙色背景
		offButton.style.border  = '1px solid #fff';
    
		// 当开启数量为0时隐藏
		offButton.style.opacity = onCount > 0 ? 1 : 0;
		offButton.style.pointerEvents = onCount > 0 ? 'auto' : 'none';
    header.appendChild(statsText);
    header.appendChild(offButton);
    return header;
  }

  // 新增：关闭所有灯光
  _turnOffAll() {
    this._hass.callService('light', 'turn_off', {
      entity_id: this._config.entities
    });
    
    // 按钮动画
    const button = this.mainContainer.querySelector('.all-off-button');
    button.style.transform = 'scale(0.8)';
    setTimeout(() => button.style.transform = 'scale(1)', 200);
  }


  _createPowerButton(entity, state) {
    const powerButton = document.createElement('div');
		powerButton.className = `power-button ${state === 'on' ? 'active' : ''}`;
		powerButton.innerHTML = '<ha-icon icon="mdi:power"></ha-icon>';
		powerButton.style.backgroundColor = state === 'on' ? '#FE6F21' : 'rgba(150,150,150,0.8)';
		powerButton.querySelector('ha-icon').style.color = state === 'on' ? '#FFF' : '#FE6F21';
    powerButton.addEventListener('click', () => this._togglePower(entity));
    return powerButton;
  }

	

  _createSliderGroup(entity, label, type, color, value, min, max, percent, isActive) {
    const group = document.createElement('div');
		group.className = `slider-group ${isActive ? 'active' : 'inactive'}`;
    const labelElement = document.createElement('span');
    labelElement.className = 'slider-label';
    labelElement.textContent = label;
    labelElement.style.color = color; // 应用统一颜色

    const track = document.createElement('div');
    track.className = `slider-track ${type}-track ${isActive ? 'active' : 'inactive'}`; 

    // 仅亮度需要进度条
		const progress = document.createElement('div');
		progress.className = `slider-progress ${type}-track`; 
		progress.style.width = `${percent}%`;


    const input = document.createElement('input');
		input.dataset.entity = entity; // 添加实体标识
    input.className = 'slider-input';
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.value = value;
    input.dataset.type = type;

    const thumb = document.createElement('div');
    thumb.className = `slider-thumb ${isActive ? 'active' : 'inactive'}`;
    thumb.style.left = `${percent}%`;


    track.appendChild(progress);
    track.appendChild(input);
    track.appendChild(thumb);
    
    group.appendChild(labelElement);
    group.appendChild(track);
    return group;
  }

  _initSliders(sliderInput, entity) {
    sliderInput.addEventListener('input', (e) => {
        const type = e.target.dataset.type;
        const value = parseInt(e.target.value);
        const percent = ((value - e.target.min) / (e.target.max - e.target.min) * 100).toFixed(1);
        
        // 更新视觉元素
        const track = e.target.parentElement;
        track.querySelector('.slider-progress').style.width = `${percent}%`;
        track.querySelector('.slider-thumb').style.left = `${percent}%`;

        // 调用服务
        if (type === 'brightness') {
          this._adjustBrightness(entity, value);
        } else if (type === 'color_temp') {
          this._adjustColorTemp(entity, value);
        }
      });
    };

  _togglePower(entity) {
		this._hass.callService('light', 'toggle', { entity_id: entity });
    // 触觉反馈
    try { navigator.vibrate(50); } catch(e) {}
    
    // 按钮动画
    const button = this.container.querySelector('.power-button');
    button.style.transform = 'scale(0.8)';
    setTimeout(() => button.style.transform = 'scale(1.2)', 300);
  }

  _adjustBrightness(entity, value) {
    this._hass.callService('light', 'turn_on', {
      entity_id: entity,
      brightness: Math.max(5, Math.min(255, value)),
      transition: 0.3
    });
  }

  _adjustColorTemp(entity, value) {
    const attributes = this._hass.states[entity]?.attributes || {};
    
    const params = {};
    if (attributes.color_temp_kelvin !== undefined) {
      params.color_temp_kelvin = value;
    } else if (attributes.color_temp !== undefined) {
      params.color_temp = Math.round(1000000 / value);
    }

    this._hass.callService('light', 'turn_on', {
      entity_id: entity,
      ...params,
      transition: 0.3
    });
  }
} 

customElements.define('xiaoshi-light-group-card', LightGroupCard);
