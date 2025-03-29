class XiaoshiLightCard extends HTMLElement {
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
        min-height: 5vw; /* 默认高度 */
        border-radius: 12px;
        padding: 0 4vw 0 2vw;
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
        gap: 16px;
        position: relative;
        overflow: hidden;
      }

      /* 名称样式 */
      .device-name {
        flex: 1;
        font-size: 1.2rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
        height: 6vw;
        border-radius: 2vw;
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
        border-radius: 2vw 0 0 2vw;
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
        width: 0.3vw;
        height: 4vw;
        background: #999;
        border-radius: 0.6vw;
        border: 0.8vw solid #fff;
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
        width: 10vw;
        height: 10vw;
        border-radius: 3vw;
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

customElements.define('xiaoshi-light-card', XiaoshiLightCard);
