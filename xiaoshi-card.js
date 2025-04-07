class VideoCard extends HTMLElement {
  setConfig(config) {
    this.config = config;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.currentVideo = 1;
    this.touchYStart = null;  // 新增触摸起始位置
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
  // 新增滑动处理逻辑
  initSwipeControls() {
    const SWIPE_THRESHOLD = 10; // 滑动触发阈值（像素）
    const hostElement = this.shadowRoot.host;
    // 触摸开始记录位置
    const touchStart = (e) => {
      this.touchYStart = e.touches[0].clientY;
    };
    // 触摸移动处理
    const touchMove = (e) => {
      if (!this.touchYStart) return;
      const touchYEnd = e.touches[0].clientY;
      const deltaY = this.touchYStart - touchYEnd; // 计算垂直滑动距离
      // 当向上滑动超过阈值时触发刷新
      if (deltaY > SWIPE_THRESHOLD) {
        this.touchYStart = null; // 重置起始位置
        this.shadowRoot.getElementById('refreshBtn').click(); // 触发刷新
        e.preventDefault(); // 阻止默认滚动行为
      }
    };

    // 触摸结束清理数据
    const touchEnd = () => {
      this.touchYStart = null;
    };

    // 添加事件监听
    hostElement.addEventListener('touchstart', touchStart, { passive: false });
    hostElement.addEventListener('touchmove', touchMove, { passive: false });
    hostElement.addEventListener('touchend', touchEnd);
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

    this.initSwipeControls();
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
console.info("%c 消逝集合卡. 视频卡 \n%c   Version 1.1.2    ", "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");
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
console.info("%c 消逝集合卡. 图片卡 \n%c   Version 1.1.2    ", "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");
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
        min-height: 80px;
        border-radius: 12px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        gap: 16px;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        justify-content: space-between; /* 两端对齐 */
				margin-bottom: 8px; /* 新增下边距 */
      }

      /* 名称样式 */
      .device-name {
        flex: 0 1 auto; /* 禁止扩展 */
        font-size: 1.2rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        z-index: 1;
        text-overflow: ellipsis;
				text-align: left; /* 新增左对齐属性 */
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
console.info("%c 消逝集合卡. 灯光卡 \n%c   Version 1.1.2    ", "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");
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
    				padding: 0;
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
    // 全关按钮
    const offButton = document.createElement('div');
    offButton.className = 'all-off-button';
		offButton.textContent = '全关'; // 改为文字内容
    offButton.addEventListener('click', () => this._turnOffAll());
		offButton.style.color = '#fff'; // 白色文字
		offButton.style.backgroundColor = '#FE6F21'; // 橙色背景
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
console.info("%c 消逝集合卡. 灯组卡 \n%c   Version 1.1.2    ", "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");
customElements.define('xiaoshi-light-group-card', LightGroupCard);

class XiaoshiTimeCard extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    this._updateContent();
  }
  setConfig(config) {
    this.config = config;
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this._updateContent();
    this._updateInterval = setInterval(() => this._updateContent(), 1000);
  }
  disconnectedCallback() {
    clearInterval(this._updateInterval);
  }
  async _updateContent() {
    const lunarEntity = this.config?.entity || 'sensor.lunar';
    const lunarState = this._hass.states[lunarEntity];
    const wasConnected = !!this.shadowRoot.getElementById('tap');
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 240px;
          height: 170px;
          color: white !important;
          --text-color: white;
        }
        ha-card {
          background: transparent !important;
          box-shadow: none !important;
        }
        .grid-container {
          display: grid;
          grid-template-areas: 
						"tap     tap     tap     tap "
            "time    time    time    time"
            "date    week    jieqi   jieqi"
            "year    mon     mon     day"
            "line    line    line    line"
            "shengri shengri shengri shengri"
            "jieri   jieri   jieri   jieri";
          grid-template-columns: 80px 58px 16px 72px;
          grid-template-rows: 20px 45px 20px 20px 15px 20px 20px;
          font-weight: bold;
          font-size: 16px;
        }
        #tap {
          grid-area: tap;
          height: 170px;
          margin-top: 0px;
          z-index: 10;
        }
        #time {
          grid-area: time;
          font-size: 57px;
          font-weight: 430;
          text-align: center;
          white-space: nowrap;
          overflow: visible;
          color: var(--text-color);
        }
        #date    { grid-area: date; color: var(--text-color) }
        #week    { grid-area: week; color: var(--text-color) }
        #jieqi   { grid-area: jieqi; text-align: right; color: var(--text-color) }
        #year    { grid-area: year; color: var(--text-color) }
        #mon     { grid-area: mon; color: var(--text-color) }
        #day     { grid-area: day; text-align: right; color: var(--text-color) }
        #line    { grid-area: line; color: var(--text-color) }
        #shengri { grid-area: shengri; color: var(--text-color); font-size: 15px}
        #jieri   { grid-area: jieri; color: var(--text-color); font-size: 15px }
      </style>
      <ha-card>
        <div class="grid-container">
          <div id="tap" @click=${this._showPopup}></div>
          <div id="time">${this._getCurrentTime()}</div>
          <div id="date">${this._getAttribute(lunarState, 'now_solar.日期A')}</div>
          <div id="week">${this._getAttribute(lunarState, 'now_solar.星期A')}</div>
          <div id="jieqi">${this._getAttribute(lunarState, 'jieqi.节气')}</div>
          <div id="year">${this._getAttribute(lunarState, 'now_lunar.年')}</div>
          <div id="mon">${this._getAttribute(lunarState, 'now_lunar.日期')}</div>
          <div id="day">${this._getShichen()}</div>
          <div id="line">------------------------------------</div>
          <div id="shengri">${this._getAttribute(lunarState, 'shengriwarn.最近的生日.0')}</div>
          <div id="jieri">${this._getAttribute(lunarState, 'shengriwarn.最近的节日.0')}</div>
        </div>
      </ha-card>
    `;
    const tapElement = this.shadowRoot.getElementById('tap');
		tapElement.addEventListener('click', () => this._showPopup());
  }
  _getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-GB').replace(/:/g, ':');
  }
  _getShichen() {
    const tzArr = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const skArr = ['一','二','三','四'];
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const shichenIndex = Math.floor(h / 2);
    const shikeIndex = Math.floor(m / 15);
    return `${tzArr[shichenIndex]}时${skArr[shikeIndex]}刻`;
  }
  _getAttribute(state, path) {
    return path.split('.').reduce((obj, key) => (obj || {})[key], state?.attributes || {}) || '';
  }
  _showPopup() {
    window.browser_mod.service('popup', { 
      style: `
				--popup-min-width: 870px;
				--mdc-theme-surface: rgb(0,0,0,0);
				--dialog-backdrop-filter: blur(10px) brightness(1);
			`,
      content: {
        type: 'custom:button-card',
				template: '万年历平板端'
      }
    });
  }
}
console.info("%c 消逝集合卡. 时间卡 \n%c   Version 1.1.2    ", "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");
customElements.define('xiaoshi-time-card', XiaoshiTimeCard);

class XiaoshiSwitchCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    // 创建主容器
    this.container = document.createElement('div');
    this.container.className = 'xiaoshi-container';

    // 样式表
    const style = document.createElement('style');
    style.textContent = `
		/* 主容器 */
      .xiaoshi-container {
        min-height: 80px;
        border-radius: 12px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        gap: 16px;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        justify-content: space-between; 
				margin-bottom: 8px;
      }

      .device-name {
        font-size: 1.2rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        z-index: 1;
      }
      .name-power-container {
        display: flex;
        align-items: baseline;
        gap: 8px;
        min-width: 0;
        flex: 1;
      }

      .power-value {
        font-size: 0.9rem;
        opacity: 0.8;
        white-space: nowrap;
      }

      /* 电源按钮样式 */
      .power-button {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .power-button.active {
        background: #c8191d;
      }

      /* 图标通用样式 */
      ha-icon {
        --mdc-icon-size: 24px;
        color: var(--icon-color, #c8191d);
      }
      .power-button.active ha-icon {
        color: white;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.container);
    
    // 状态管理变量
    this._clickCount = 0;
    this._clickTimer = null;
    this._config = null;       // 配置信息
    this._hass = null;         // Home Assistant 实例
  }

  setConfig(config) {
    this._config = config;		
		this._render();
  }

  set hass(hass) {
    this._hass = hass;
		this._render();
  }

  // 主题评估方法
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

  // 背景颜色计算
  _getBackground(state) {
    const theme = this._evaluateTheme();
    return state === 'on' 
      ? (theme === 'off' 
          ? 'linear-gradient(90deg, #c8191d -20%, #323232 70%)' 
          : 'linear-gradient(90deg, #c8191d -20%, #FFF 70%)')
      : (theme === 'off' ? '#323232' : '#FFF');
  }

  // 主渲染方法
  _render() {
    	if (!this._config || !this._hass) return;
			// 清空容器
			this.container.innerHTML = '';
			// 获取设备状态
			const entity = this._config.entity;
			const stateObj = this._hass.states[entity] || {};
			const state = stateObj.state || 'off';
			const attributes = stateObj.attributes || {};
			// 获取功率数值
			let powerElement = '';
			if (this._config.power) {
				const powerState = this._hass.states[this._config.power];
				
				if (powerState && !isNaN(powerState.state)) {
					const powerValue = parseFloat(powerState.state);
					const powerUnit = powerState.attributes?.unit_of_measurement || 'W';
					
					powerElement = document.createElement('div');
					powerElement.className = 'power-value';
					powerElement.textContent = `${powerValue.toFixed(1)}${powerUnit}`;
					powerElement.style.color = this._evaluateTheme() === 'on' ? '#333' : '#FFF';
				}
			}
			// 创建设备名称元素
			const nameElement = document.createElement('div');
			nameElement.className = 'device-name';
			nameElement.textContent = attributes.friendly_name || entity;
			nameElement.style.color = this._evaluateTheme() === 'on' ? '#333' : '#FFF';
			// 创建名称和功率容器
			const namePowerContainer = document.createElement('div');
			namePowerContainer.className = 'name-power-container';
			namePowerContainer.append(nameElement, powerElement); 
			// 创建电源按钮
			const powerButton = document.createElement('div');
			powerButton.className = `power-button ${state === 'on' ? 'active' : ''}`;
			powerButton.innerHTML = '<ha-icon icon="mdi:power-socket-uk"></ha-icon>';
			powerButton.onclick = () => this._handlePowerButtonClick();

			// 容器样式设置
			this.container.style.cssText = `
				width: ${this._config.width || '100vw'};
				height: ${this._config.height || '20vw'};
				background: ${this._getBackground(state)};
				box-shadow: ${this._evaluateTheme() === 'off' 
					? '0 2px 4px rgba(0,0,0,0.1)' 
					: 'none'};
			`;

			this.container.append(namePowerContainer, powerButton);
  }

	_handlePowerButtonClick(e) {
		this._clickCount++;
		if (this._clickTimer) {
			clearTimeout(this._clickTimer);
		}
		this._clickTimer = setTimeout(() => {
			if (this._clickCount >= 2) {
				this._togglePower();
			}
			this._clickCount = 0;
		}, 1000);
		try { navigator.vibrate(50); } catch(e) {}
	}

  _togglePower() {
    const entity = this._config.entity;
    this._hass.callService('switch', 'toggle', { entity_id: entity });
    this._clickCount = 0;
  }

  disconnectedCallback() {
    if (this._clickTimer) {
      clearTimeout(this._clickTimer);
    }
  }
}
console.info("%c 消逝集合卡. 插座卡 \n%c   Version 1.1.2    ", "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");
customElements.define('xiaoshi-switch-card', XiaoshiSwitchCard);

class XiaoshiSwitchGroupCard  extends HTMLElement {
  constructor() {
    super();
		this._isUnlocked = false;
    const shadow = this.attachShadow({ mode: 'open' });
    this.container = document.createElement('div');
    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';
    shadow.appendChild(this.container);
    
    // 创建主容器
    this.container = document.createElement('div');
    this.container.className = 'xiaoshi-container';
    
    // 样式表（关键修改点1：调整布局顺序）
    const style = document.createElement('style');
    style.textContent = `

		/* 主容器 */
      .xiaoshi-container {
				flex-direction: column;
				align-items: stretch;
        min-height: 80px;
        border-radius: 12px;
        padding: 0 0;
        display: flex;
        gap: 16px;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        justify-content: space-between;
      }

      /* 设备名称样式 */
      .device-name {
        font-size: 1.2rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        z-index: 1;
      }
      .name-power-container {
        display: flex;
        align-items: baseline;
        gap: 8px;
        min-width: 0;
        flex: 1;
      }

      .power-value {
        font-size: 0.9rem;
        opacity: 0.8;
        white-space: nowrap;
      }

      /* 电源按钮样式 */
      .power-button {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .power-button.active {
        background: #c8191d;
      }

      /* 图标通用样式 */
      ha-icon {
        --mdc-icon-size: 24px;
        color: var(--icon-color, #c8191d);
      }
      .power-button.active ha-icon {
        color: white;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.container);
    
    // 状态管理变量
    this._clickCount = 0;
    this._unlockTimer = null;  // 解锁定时器
    this._config = null;       // 配置信息
    this._hass = null;         // Home Assistant 实例
  }

  // 配置设置方法
  setConfig(config) {
    this._config = {
      gap: config.gap || '0',
      width: config.width || '400px',
      height: config.height || '80px',
      entities: config.entities || [],
			theme: config.theme || null, // 允许用户强制指定主题
    };
    this._render();
		this.container.style.gap = this._config.gap;
  }

  // 更新Home Assistant实例
  set hass(hass) {
    this._hass = hass;
    this._renderCards();
  }

  // 主题评估方法
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

  // 背景颜色计算
  _getBackground(state) {
    const theme = this._evaluateTheme();
    return state === 'on' 
      ? (theme === 'off' 
          ? 'linear-gradient(90deg, #c8191d -20%, #323232 70%)' 
          : 'linear-gradient(90deg, #c8191d -20%, #FFF 70%)')
      : (theme === 'off' ? '#323232' : '#FFF');
  }

  _renderCards() {

    this.container.innerHTML = '';
    // 新增：创建统计容器
    const statsContainer = this._createStatsRow();
    this.container.appendChild(statsContainer);

    this._config.entities.forEach(entityPair => {
      const [switchEntity, sensorEntity] = this._parseEntityConfig(entityPair);
      const card = document.createElement('xiaoshi-switch-card');
      card.setConfig({
        entity: switchEntity,
        power: sensorEntity,
        width: this._config.width,
        height: this._config.height,
				theme: this._config.theme // 继承父级主题配置
      });
      card.hass = this._hass;
      this.container.appendChild(card);
    });
  }
	// 新增：创建统计行方法
	_createStatsRow() {
		let onCount = 0;
		let totalPower = 0;

		// 遍历所有实体计算统计值
		this._config.entities.forEach(entityPair => {
			const [switchEntity, sensorEntity] = this._parseEntityConfig(entityPair);
			const switchState = this._hass.states[switchEntity]?.state;
			const powerValue = parseFloat(this._hass.states[sensorEntity]?.state);

			if (switchState === 'on') {
				onCount++;
				if (!isNaN(powerValue)) totalPower += powerValue;
			}
		})
		// 在创建统计容器部分进行如下修改
		const themeMode = this._evaluateTheme(); // 获取当前主题模式
		const isLightTheme = themeMode === 'on'; // 假设评估方法返回'light'或'dark'
		const textColor = isLightTheme ? '#333' : '#FFF';

		const stats = document.createElement('div');
		stats.className = 'stats-container';
		stats.style.cssText = `
			display: flex;
			justify-content: center; 
			padding: 2vw 0 1vw 0;
			background: rgba(0, 0, 0, 0);
			border-radius: 0;
			margin-bottom: 6px;
			font-size: 1em;
			font-weight: 700;
			color: ${textColor};
			text-shadow: ${isLightTheme ?
				'0.05em 0 #fff, -0.05em 0 #fff, 0 0.05em #fff, 0 -0.05em #fff, 0.05em 0.05em #fff, -0.05em -0.05em #fff, 0.05em -0.05em #fff, -0.05em 0.05em #fff' 
				: 'none'};
		`;
		// 创建统计内容
		stats.innerHTML = `
			开启 ${onCount} 个&emsp;关闭 ${this._config.entities.length - onCount} 个&emsp;总功率：${totalPower.toFixed(1)}W
		`;
		return stats;
	}

  // 主渲染方法
  _render() {
    	if (!this._config || !this._hass) return;
			// 清空容器
			this.container.innerHTML = '';

			// 获取设备状态
			const entity = this._config.entity;
			const stateObj = this._hass.states[entity] || {};
			const state = stateObj.state || 'off';
			const attributes = stateObj.attributes || {};

			// 获取功率数值
			let powerElement = '';
			if (this._config.power) {
				const powerState = this._hass.states[this._config.power];
				
				if (powerState && !isNaN(powerState.state)) {
					const powerValue = parseFloat(powerState.state);
					const powerUnit = powerState.attributes?.unit_of_measurement || 'W';
					
					powerElement = document.createElement('div');
					powerElement.className = 'power-value';
					powerElement.textContent = `${powerValue.toFixed(1)}${powerUnit}`;
					powerElement.style.color = this._evaluateTheme() === 'on' ? '#333' : '#FFF';
				}
			}

			// 创建设备名称元素
			const nameElement = document.createElement('div');
			nameElement.className = 'device-name';
			nameElement.textContent = attributes.friendly_name || entity;
			nameElement.style.color = this._evaluateTheme() === 'on' ? '#333' : '#FFF';
			// 创建名称和功率容器
			const namePowerContainer = document.createElement('div');
			namePowerContainer.className = 'name-power-container';
			namePowerContainer.append(nameElement, powerElement); 

			// 创建电源按钮
			const powerButton = document.createElement('div');
			powerButton.className = `power-button ${state === 'on' ? 'active' : ''}`;
			powerButton.innerHTML = '<ha-icon icon="mdi:power-socket-uk"></ha-icon>';
			powerButton.onclick = () => this._handlePowerButtonClick();

			// 容器样式设置
			this.container.style.cssText = `
				width: ${this._config.width || '100vw'};
				height: ${this._config.height || '20vw'};
				background: ${this._getBackground(state)};
				box-shadow: ${this._evaluateTheme() === 'off' 
					? '0 2px 4px rgba(0,0,0,0.1)' 
					: 'none'};
				display: ${this._config.show === 'auto' && state !== 'on' ? 'none' : 'flex'};
			`;

			// 组装元素
			this.container.append(namePowerContainer, powerButton);
  }

	_handlePowerButtonClick(e) {
		this._clickCount++;
		if (this._clickTimer) {
			clearTimeout(this._clickTimer);
		}
		this._clickTimer = setTimeout(() => {
			if (this._clickCount >= 2) {
				this._togglePower();
			}
			this._clickCount = 0;
		}, 1000);
		try { navigator.vibrate(50); } catch(e) {}
	}

  _togglePower() {
    const entity = this._config.entity;
    this._hass.callService('switch', 'toggle', { entity_id: entity });
    this._clickCount = 0;
  }

  _parseEntityConfig(config) {
    if (Array.isArray(config)) { 
      return [config[0], config[1]];
    }
    if (typeof config === 'string') {
      return config.split(',').map(e => e.trim());
    }
    return [config.entity, config.power];
  }

  disconnectedCallback() {
    if (this._clickTimer) {
      clearTimeout(this._clickTimer);
    }
  }
}
console.info("%c 消逝集合卡. 插座组 \n%c   Version 1.1.2    ", "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");
customElements.define('xiaoshi-switch-group-card', XiaoshiSwitchGroupCard); 

window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: 'xiaoshi-video-card',
    name: '消逝卡片组 视频卡',
    description: '加载api视频背景'
  },
  {
    type: 'xiaoshi-image-card',
    name: '消逝卡片组 图片卡',
    description: '加载api图片背景'
  },
  {
    type: 'xiaoshi-light-card',
    name: '消逝卡片组 灯光卡',
    description: '加载灯光'
  },
  {
    type: 'xiaoshi-light-group-card',
    name: '消逝卡片组 灯组卡',
    description: '加载灯光组'
  },
  {
    type: 'xiaoshi-switch-card',
    name: '消逝卡片组 插座卡',
    description: '加载插座'
  },
  {
    type: 'xiaoshi-switch-group-card',
    name: '消逝卡片组 插座组',
    description: '加载插座组'
  },
  {
    type: 'xiaoshi-time-card',
    name: '消逝卡片组 时间卡',
    description: '显示时间（需要配合万年历NR和button模板）'
  }
);
