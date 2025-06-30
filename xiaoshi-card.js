console.info("%c 消逝集合卡 \n%c   v 2.5.2  ", "color: red; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");
import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

class XiaoshiLightCard extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { type: Object, state: true },
    _onCount: { type: Number, state: true },
    _sliderValues: { type: Object, state: true },
    _showScenes: { type: Object, state: true }
  };

  static styles = css`
    .scene-mode-button {
      position: absolute;
      bottom: 4px;
      left: 0;
      padding: 2px 6px;
      font-size: 0.7rem;
      border-radius: 4px;
      background: rgba(180, 180, 180, 0.2);
      color: #FE6F21;
      cursor: pointer;
      transition: all 0.3s ease;
      width: fit-content;
    }
    
    .scenes-container {
      flex: 2;
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      padding: 0px;
      z-index: 1;
      align-items: center;
    }
    
    .scene-button {
      padding: 0px 4px 0px 4px;
      border-radius: 6px;
      background: rgba(180, 180, 180, 0.2);
      text-align: start;
      font-size: 0.65rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: start;
      justify-content: start;
      height: 20px;
      max-width: 35px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      gap: 4px;
    }
    
    .main-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      padding: 0;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(var(--column-count, 1), 1fr);
      gap: 8px !important;
      width: 100%;
    }

    .stats-header {
      min-height: 20px;
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
      visibility: visible !important;
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
      transition: opacity 0.3s ease;
    }

    .all-off-button:hover {
      opacity: 0.8;
      transform: scale(1.05);
      border-radius: 8px;
      cursor: none;
    }

    .entity-container {
      min-height: 60px;
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
    .device-name-area {
      min-width: 80px;
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
      z-index: 1;
      overflow: visible;
    }
    .device-name-container {
      min-width: 80px;
      flex: 1;
      font-size: 1.2rem;
      font-weight: 600;
      white-space: nowrap;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
    }

    .device-name {
      font-size: 1.2rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      overflow: visible;
    }
    .controls-container {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1;
    }

    .slider-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .slider-label {
      width: 30px;
      font-size: 0.8rem;
      background: rgb(0,0,0,0);
      line-height: 1.1;
    }

    .slider-track {
      flex: 1;
      height: 25px;
      border-radius: 7px;
      position: relative;
      cursor: none;
    }
    
    .slider-track.brightness-track {
      background: rgba(254, 111, 33, 0.2);
    }
    
    .slider-track.color_temp-track {
      background: linear-gradient(to right, #FE6F21, #FFFFFF) !important;
    }
    
    .slider-track.inactive {
      background: rgb(180,180,180,0.5) !important;
    }
    
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

  constructor() {
    super();
    this._config = null;
    this._hass = null;
    this._onCount = 0;
    this._sliderValues = {};
    this._debounceTimers = {};
    this._showScenes = {};
  }

  setConfig(config) {
    const configCopy = JSON.parse(JSON.stringify(config));
    const normalizedEntities = this._normalizeEntities(configCopy);
    
    this._config = {
      entities: normalizedEntities,
      rgb: configCopy.rgb,
      theme: configCopy.theme || 'off',
      width: configCopy.width || '100%',
      height: configCopy.height || '60px',
      show: configCopy.show,
      total: config.total !== undefined ? config.total : 'on',
      columns: config.columns || 1  // Add columns configuration
    };
    
    normalizedEntities.forEach(entity => {
      this._sliderValues[entity] = {
        brightness: null,
        color_temp: null
      };
      this._showScenes[entity] = false;
    });
    
    this.requestUpdate();
  }

  _normalizeEntities(config) {
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

  _getBackground(state) {
    const theme = this._evaluateTheme();
    if (state === 'on') {
      return theme === 'off' 
        ? 'linear-gradient(90deg, #FE6F21 -30%, #323232 50%)'
        : 'linear-gradient(90deg, #FE6F21 -30%, #FFF 50%)';
    }
    return theme === 'off' ? '#323232' : '#FFF';
  }

  _renderHeader() {
    if (this._config.total === 'off') return html``;

    this._onCount = this._config.entities.filter(entity => 
      this.hass?.states[entity]?.state === 'on'
    ).length;

    const themeColor = this._evaluateTheme() === 'on' ? '#333' : '#FFF';
    
    return html`
      <div class="stats-header">
        <div class="stats-text" style="color: #ffffff">
          总共开启 ${this._onCount} 盏灯
        </div>
        <div 
          class="all-off-button"
          style="
            opacity: ${this._onCount > 0 ? 1 : 0};
            pointer-events: ${this._onCount > 0 ? 'auto' : 'none'};
            color: #fff;
            background-color: #FE6F21;
          "
          @click=${this._turnOffAll}
        >
          全关
        </div>
      </div>
    `;
  }

  _renderEntity(entity) {
    if (!this.hass?.states[entity]) {
      console.error(`实体 ${entity} 不存在`);
      return html``;
    }

    const stateObj = this.hass.states[entity] || {};
    const state = stateObj.state || 'off';
    const isActive = state === 'on';
    const attributes = stateObj.attributes || {};
    const showMode = this._config.show || 'always';
    const showCard = showMode === 'auto' ? state === 'on' : true;
    const showScenes = this._showScenes[entity];
    const hasScenes = attributes.effect_list && attributes.effect_list.length > 0;

    return html`
      <div class="entity-container"
        style="
          width: ${this._config.width || '100%'};
          height: ${this._config.height};
          background: ${this._getBackground(state)};
          box-shadow: ${this._evaluateTheme() === 'off' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};
          display: ${showCard ? 'flex' : 'none'};
        ">
        <div class="device-name-area" style="color: ${this._evaluateTheme() === 'off' ? '#FFF' : '#333'}">
          <div class="device-name">
            ${attributes.friendly_name || entity}
          </div>
          ${hasScenes ? html`
            <div class="scene-mode-button" style="color: ${this._evaluateTheme() === 'off' ? '#FFF' : '#333'}"
              @click=${() => this._toggleSceneMode(entity)}>
              情景模式
            </div>
          ` : ''}
        </div>
        
        ${showScenes && hasScenes ? 
          this._renderScenes(entity) : 
          (this._config.rgb ? this._renderControls(entity, isActive, attributes) : '')
        }
        
        ${this._renderPowerButton(entity, isActive)}
      </div>
    `;
  }

  _renderControls(entity, isActive, attributes) {
    const themeColor = this._evaluateTheme() === 'on' ? '#333' : '#FFF';
    const controls = [];
    
    if (attributes.brightness !== undefined) {
      const brightness = Math.max(5, Math.min(255, attributes.brightness || 5));
      const brightnessPercent = ((brightness - 5) / 250 * 100).toFixed(1);
      
      controls.push(this._renderSlider(
        entity, '亮度', 'brightness', themeColor, 
        brightness, 5, 255, brightnessPercent, isActive
      ));
    }
    
    if (attributes.supported_color_modes?.includes('color_temp')) {
      const kelvin = attributes.color_temp_kelvin || Math.round(1000000 / (attributes.color_temp || 370));
      const colorTempPercent = ((kelvin - 2700) / 3800 * 100).toFixed(1);
      
      controls.push(this._renderSlider(
        entity, '色温', 'color_temp', themeColor,
        kelvin, 2700, 6500, colorTempPercent, isActive
      ));
    }
    
    return html`
      <div class="controls-container">
        ${controls}
      </div>
    `;
  }

  _renderSlider(entity, label, type, color, value, min, max, percent, isActive) {
    const currentValue = this._sliderValues[entity]?.[type] ?? value;
    const currentPercent = ((currentValue - min) / (max - min) * 100).toFixed(1);

    return html`
      <div class="slider-group ${isActive ? 'active' : 'inactive'}">
        <span class="slider-label" style="color: ${color}">
          ${label}${isActive ? ` ${type === 'brightness' ? Math.round(currentValue/2.55) : currentValue}${type === 'brightness' ? '%' : 'K'}` : ''}
        </span>
        <div class="slider-track ${type}-track ${isActive ? 'active' : 'inactive'}">
          <div class="slider-progress ${type}-track" style="width: ${currentPercent}%"></div>
          <input
            class="slider-input"
            type="range"
            min=${min}
            max=${max}
            .value=${currentValue}
            data-type=${type}
            data-entity=${entity}
            @input=${this._handleSliderInput}
            @change=${this._handleSliderChange}
          />
          <div class="slider-thumb ${isActive ? 'active' : 'inactive'}" style="left: ${currentPercent}%"></div>
        </div>
      </div>
    `;
  }

  _renderPowerButton(entity, isActive) {
    return html`
      <div 
        class="power-button ${isActive ? 'active' : ''}"
        style="background-color: ${isActive ? '#FE6F21' : 'rgba(150,150,150,0.8)'}"
        @click=${() => this._togglePower(entity)}
      >
        <ha-icon icon="mdi:power" style="color: ${isActive ? '#FFF' : '#FE6F21'}"></ha-icon>
      </div>
    `;
  }

  _renderScenes(entity) {
    const stateObj = this.hass.states[entity];
    if (!stateObj) return html``;
    
    const effectList = stateObj.attributes.effect_list || [];
    
    return html`
      <div class="scenes-container">
        ${effectList.map(scene => html`
          <div 
            class="scene-button"
            @click=${() => this._activateScene(entity, scene)}
            style="color: ${this._evaluateTheme() === 'off' ? '#FFF' : '#333'}"
            title=${scene}
          >
            ${scene}
          </div>
        `)}
      </div>
    `;
  }

  render() {
    if (!this._config || !this.hass) return html``;
    
    return html`
      <div class="main-container">
        ${this._renderHeader()}
        <div class="entities-grid" style="--column-count: ${this._config.columns}">
          ${this._config.entities.map(entity => this._renderEntity(entity))}
        </div>
      </div>
    `;
  }

  _handleSliderInput(e) {
    const type = e.target.dataset.type;
    const entity = e.target.dataset.entity;
    const value = parseInt(e.target.value);
    const min = parseInt(e.target.min);
    const max = parseInt(e.target.max);
    const percent = ((value - min) / (max - min) * 100).toFixed(1);
    this._sliderValues[entity][type] = value;
    const track = e.target.parentElement;
    if (track) {
      track.querySelector('.slider-progress').style.width = `${percent}%`;
      track.querySelector('.slider-thumb').style.left = `${percent}%`;
    }
    
    this.requestUpdate();
  }

  _handleSliderChange(e) {
    const type = e.target.dataset.type;
    const entity = e.target.dataset.entity;
    const value = parseInt(e.target.value);

    this._debounceTimers[`${entity}_${type}`] = setTimeout(() => {
      if (type === 'brightness') {
        this._adjustBrightness(entity, value);
      } else if (type === 'color_temp') {
        this._adjustColorTemp(entity, value);
      }
    }, 300);
  }

  _togglePower(entity) {
    this.hass.callService('light', 'toggle', { entity_id: entity });
    try { navigator.vibrate(50); } catch(e) {}
    
    const button = this.shadowRoot.querySelector(`[data-entity="${entity}"] .power-button`);
    if (button) {
      button.style.transform = 'scale(0.8)';
      setTimeout(() => button.style.transform = 'scale(1.2)', 300);
    }
  }

  _turnOffAll() {
    this.hass.callService('light', 'turn_off', {
      entity_id: this._config.entities
    });
    
    const button = this.shadowRoot.querySelector('.all-off-button');
    if (button) {
      button.style.transform = 'scale(0.8)';
      setTimeout(() => button.style.transform = 'scale(1)', 200);
    }
  }

  async _adjustBrightness(entity, value) {
    const attributes = this.hass.states[entity]?.attributes || {};
    const params = { brightness: Math.max(5, Math.min(255, value)) };
    
    if (this.hass.states[entity]?.state === 'off') {
      await this.hass.callService('light', 'turn_on', {
        entity_id: entity,
        ...params,
        transition: 0.3
      });
    } else {
      await this.hass.callService('light', 'turn_on', {
        entity_id: entity,
        ...params,
        transition: 0.3
      });
    }
    
    this._syncSliderValue(entity, 'brightness');
  }

  async _adjustColorTemp(entity, value) {
    const attributes = this.hass.states[entity]?.attributes || {};
    const params = {};
    
    if (attributes.color_temp_kelvin !== undefined) {
      params.color_temp_kelvin = value;
    } else if (attributes.color_temp !== undefined) {
      params.color_temp = Math.round(1000000 / value);
    }
    
    if (this.hass.states[entity]?.state === 'off') {
      await this.hass.callService('light', 'turn_on', {
        entity_id: entity,
        ...params,
        transition: 0.3
      });
    } else {
      await this.hass.callService('light', 'turn_on', {
        entity_id: entity,
        ...params,
        transition: 0.3
      });
    }
    
    this._syncSliderValue(entity, 'color_temp');
  }

  _syncSliderValue(entity, type) {
    const state = this.hass.states[entity];
    if (!state) return;

    const attributes = state.attributes || {};
    
    if (type === 'brightness' && attributes.brightness !== undefined) {
      this._sliderValues[entity].brightness = attributes.brightness;
    } 
    else if (type === 'color_temp') {
      if (attributes.color_temp_kelvin !== undefined) {
        this._sliderValues[entity].color_temp = attributes.color_temp_kelvin;
      } else if (attributes.color_temp !== undefined) {
        this._sliderValues[entity].color_temp = Math.round(1000000 / attributes.color_temp);
      }
    }
    
    this.requestUpdate();
  }

  _toggleSceneMode(entity) {
    this._showScenes[entity] = !this._showScenes[entity];
    this.requestUpdate();
  }

  _activateScene(entity, scene) {
    this.hass.callService('light', 'turn_on', {
      entity_id: entity,
      effect: scene
    });
    
    this._showScenes[entity] = false;
    this.requestUpdate();
    
    try { navigator.vibrate(50); } catch(e) {}
  }

  updated(changedProperties) {
    if (changedProperties.has('hass') && this._config) {
      this._config.entities.forEach(entity => {
        this._syncSliderValue(entity, 'brightness');
        this._syncSliderValue(entity, 'color_temp');
      });
    }
  }
}
customElements.define('xiaoshi-light-card', XiaoshiLightCard);

class XiaoshiSwitchCard extends LitElement {
  static get TIMING() {
    return {
      UNLOCK: 5000,        // 解锁持续时间（毫秒）
      FEEDBACK: 500       // 动画持续时间（毫秒）
    };
  }

  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
      _unlockedCards: { type: Object }
    };
  }

  constructor() {
    super();
    this._config = null;
    this._unlockedCards = {};
  }

  static get styles() {
    return css`
      /* 主容器 */
      .xiaoshi-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        min-height: 60px;
        border-radius: 12px;
        padding: 0 16px;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        justify-content: space-between;
        margin-bottom: 8px;
        background: var(--card-background-color, #f0f0f0);
      }

      /* 网格布局容器 */
      .entities-grid {
        display: grid;
        grid-template-columns: repeat(var(--column-count, 1), 1fr);
        gap: 8px;
        width: 100%;
      }

      /* 设备名称样式 */
      .device-name {
        font-size: 1.2rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-flex;
        align-items: center;
      }

      .stats-container {
        color: var(--primary-text-color);
        font-weight: 700;
        font-size: 1rem;
        text-align: center;
        padding: 12px 0;
        margin-bottom: 8px;
      }

      .name-container {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        overflow: hidden;
      }

      .power-value {
        font-size: 0.8rem;
        opacity: 1;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        margin-left: 8px;
      }

      /* 按钮容器 */
      .button-container {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 12px;
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
        cursor: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0.5;
        pointer-events: none;
      }

      .power-button.active {
        background: #c8191d;
      }

      .power-button.unlocked {
        opacity: 1;
        pointer-events: auto;
      }

      /* 锁按钮样式 */
      .lock-button {
        cursor: none;
        margin-right: 8px;
      }

      /* 图标通用样式 */
      ha-icon {
        --mdc-icon-size: 24px;
        color: var(--icon-color, #c8191d);
      }
      .power-button.active ha-icon {
        color: white;
      }
      /* 锁图标状态颜色 */
      .lock-button ha-icon {
        --mdc-icon-size: 20px;
        transition: all 0.3s ease;
        color: #c8191d;
      }

      .lock-button.unlocked ha-icon {
        color: #4CAF50 !important;
      }

      /* 解锁进度条动画 */
      @keyframes unlock-progress {
        from { width: 100% }
        to { width: 0 }
      }

      .unlock-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: #4CAF50;
        animation: unlock-progress ${this.TIMING.UNLOCK}ms linear;
      }
    `;
  }

  setConfig(config) {
    this._config = {
      width: config.width || '100%',
      height: config.height || '60px',
      entities: config.entities || [],
      theme: config.theme || 'off',
      total: config.total !== undefined ? config.total : 'on', // 默认值为'on',
      columns: config.columns || 1  // 新增列数配置
    };
    this.requestUpdate();
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
    if (state === 'on') {
      return theme === 'off' 
        ? 'linear-gradient(90deg, #c8191d 0%, #323232 100%)' 
        : 'linear-gradient(90deg, #c8191d 0%, #FFFFFF 100%)';
    }
    return theme === 'off' ? '#323232' : '#FFFFFF';
  }

  // 解析实体配置
  _parseEntityConfig(config) {
    if (Array.isArray(config)) {
      return [config[0], config[1]];
    }
    if (typeof config === 'string') {
      return config.split(',').map(e => e.trim());
    }
    return [config.entity, config.power];
  }

  // 创建统计行
  _createStatsRow() {
    if (this._config.total === 'off') return null;

    let onCount = 0;
    let totalPower = 0;

    this._config.entities.forEach(entityPair => {
      const [switchEntity, sensorEntity] = this._parseEntityConfig(entityPair);
      const switchState = this.hass.states[switchEntity]?.state;
      const powerValue = parseFloat(this.hass.states[sensorEntity]?.state);

      if (switchState === 'on') {
        onCount++;
        if (!isNaN(powerValue)) totalPower += powerValue;
      }
    });

    const themeMode = this._evaluateTheme();
    const textColor = themeMode === 'on' ? '#333' : '#FFF';

    return html`
      <div class="stats-container" style="color: ${textColor}">
        开启 ${onCount} 个&emsp;关闭 ${this._config.entities.length - onCount} 个&emsp;总功率：${totalPower.toFixed(1)}W
      </div>
    `;
  }

  // 解锁控制方法
  _unlockControls(cardId) {
    const { UNLOCK } = this.constructor.TIMING;

    // 设置当前解锁的卡片
    this._unlockedCards[cardId] = true;
    this.requestUpdate();

    // 设置自动锁定定时器
    setTimeout(() => {
      delete this._unlockedCards[cardId];
      this.requestUpdate();
    }, UNLOCK);
  }

  // 切换电源状态
  async _togglePower(entity, cardId) {
    const { FEEDBACK } = this.constructor.TIMING;
    
    // 调用Home Assistant服务
    await this.hass.callService('switch', 'toggle', { entity_id: entity });
    
    // 触觉反馈
    try { navigator.vibrate(50); } catch(e) {}
    
    // 按钮动画
    const button = this.shadowRoot.querySelector(`#${cardId} .power-button`);
    if (button) {
      button.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(0.8)' },
        { transform: 'scale(1)' }
      ], { duration: FEEDBACK });
    }
  }

  render() {
    if (!this._config || !this.hass) return html``;

    return html`
      ${this._createStatsRow()}
      <div class="entities-grid" style="--column-count: ${this._config.columns}">
      ${this._config.entities.map((entityPair, index) => {
        const [switchEntity, sensorEntity] = this._parseEntityConfig(entityPair);
        const stateObj = this.hass.states[switchEntity] || {};
        const state = stateObj.state || 'off';
        const attributes = stateObj.attributes || {};
        const cardId = `card-${index}`;
        const isUnlocked = !!this._unlockedCards[cardId];

        // 获取功率数值
        let powerValue = '';
        if (sensorEntity) {
          const powerState = this.hass.states[sensorEntity];
          if (powerState && !isNaN(powerState.state)) {
            const powerUnit = powerState.attributes?.unit_of_measurement || 'W';
            powerValue = `${parseFloat(powerState.state).toFixed(1)}${powerUnit}`;
          }
        }

        const themeMode = this._evaluateTheme();
        const textColor = themeMode === 'on' ? '#333' : '#FFF';
        const bgColor = state === 'on' 
          ? (themeMode === 'off' ? '#323232' : '#FFFFFF')
          : (themeMode === 'off' ? '#323232' : '#FFFFFF');
        const bgImage = state === 'on'
          ? (themeMode === 'off'
              ? 'linear-gradient(90deg, #c8191d 0%, #323232 100%)'
              : 'linear-gradient(90deg, #c8191d 0%, #FFFFFF 100%)')
          : 'none';

        return html`
          <div id="${cardId}" class="xiaoshi-container" 
            style="
              width: ${this._config.width};
              height: ${this._config.height};
              background-color: ${bgColor};
              background-image: ${bgImage};
              color: ${textColor};
            ">
            <div class="name-container">
              <span class="device-name">${attributes.friendly_name || switchEntity}</span>
              ${powerValue ? html`<span class="power-value">${powerValue}</span>` : ''}
            </div>

            <div class="button-container">
              <div class="lock-button ${isUnlocked ? 'unlocked' : ''}" 
                   @click=${() => this._unlockControls(cardId)}
                   @touchend=${() => this._unlockControls(cardId)}>
                <ha-icon icon=${isUnlocked ? 'mdi:lock-open' : 'mdi:lock'}></ha-icon>
              </div>

              <div class="power-button ${state === 'on' ? 'active' : ''} ${isUnlocked ? 'unlocked' : ''}"
                   @click=${() => this._togglePower(switchEntity, cardId)}>
                <ha-icon icon="mdi:power-socket-uk"></ha-icon>
              </div>
            </div>

            ${isUnlocked ? html`
              <div class="unlock-progress"></div>
            ` : ''}
          </div>
        `;
      })}
    `;
  }
 
  disconnectedCallback() {
    super.disconnectedCallback();
    this._unlockedCards = {};
  }
}
customElements.define('xiaoshi-switch-card', XiaoshiSwitchCard);  
 
class XiaoshiTextCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
      _value: String,
      _isEditing: Boolean,
      _pendingSave: Boolean
    }; 
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      
      .input-container {
        display: flex;
        align-items: center;
        padding: 0;
        height: 100%;
        transition: all 0.3s ease;
      }
      
      .input-container.on {
        background-color: rgb(255,255,255);
        color: black;
      }
      
      .input-container.off {
        background-color: rgb(50,50,50);
        color: white;
      }
      
      .icon {
        margin-right: 0.5rem;
        font-size: 1.2rem;
        margin-left: 0.5rem;
      }
      
      .input-wrapper {
        flex-grow: 1;
        position: relative;
      }
      
      input {
        width: 100%;
        border: none;
        background: transparent;
        color: inherit;
        font-size: 1rem;
        padding: 0.5rem 0;
        outline: none;
      }
      
      .placeholder {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        color: gray;
        pointer-events: none;
        transition: all 0.2s ease;
        font-size: 0.9rem;
        opacity: 1;
      }
      
      input:focus + .placeholder,
      input:not(:placeholder-shown) + .placeholder,
      .placeholder.hidden {
        top: 0;
        transform: translateY(0);
        font-size: 0.7rem;
        opacity: 0;
      }
    `;
  }

  constructor() {
    super();
    this._value = '';
    this._isEditing = false;
    this._pendingSave = false;
  }

  _getTheme() {
    try {
      if (typeof this.config.theme === 'function') return this.config.theme();
      if (typeof this.config.theme === 'string' && this.config.theme.includes('theme(')) {
        return (new Function('return theme()'))();
      }
      return this.config.theme || 'on';
    } catch(e) {
      console.error('Error evaluating theme:', e);
      return 'on';
    }
  }

  render() {
    if (!this.config || !this.hass) return html``;

    const entity = this.config.entity;
    const entityState = entity ? this.hass.states[entity] : null;
    const friendlyName = entityState ? entityState.attributes.friendly_name : '';
    const currentValue = entityState ? entityState.state : '';
    
    if (!this._isEditing && this._value !== currentValue) {
      this._value = currentValue;
    }
    
    const themeResult = this._getTheme();
    const themeClass = themeResult === 'off' ? 'off' : 'on';

    const showPlaceholder = !this._value && !this._isEditing;
    const borderRadius = this.config.border_radius || '10px';
		const icon = this.config.icon || 'mdi:magnify';

    return html`
      <div class="input-container ${themeClass}" 
           style="width: ${this.config.width || '60vw'}; 
                  height: ${this.config.height || '8vw'};
                  border-radius: ${borderRadius};">
        <div class="icon">
          <ha-icon icon="${icon}"></ha-icon>
        </div>
        <div class="input-wrapper">
          <input
            type="text"
            .value=${this._value}
            @input=${this._handleInput}
            @keydown=${this._handleKeyDown}
            @focus=${() => this._isEditing = true}
            @blur=${this._handleBlur}
            placeholder=" "
          />
          <div class="placeholder ${!showPlaceholder ? 'hidden' : ''}">${friendlyName}</div>
        </div>
      </div>
    `;
  }

  _handleInput(e) {
    this._value = e.target.value;
    this._isEditing = true;
  }

  _handleKeyDown(e) {
    if (e.key === 'Enter' && this.config.entity) {
      this._pendingSave = true;
      this._setEntityValue();
      this._isEditing = false;
      e.target.blur();
    }
  }

  _handleBlur() {
    this._isEditing = false;
    // Only save if not already saved by Enter key
    if (!this._pendingSave && this.config.entity) {
      this._setEntityValue();
    }
    this._pendingSave = false;
  }

  _setEntityValue() {
    if (!this.config.entity) return;
    
    this.hass.callService('text', 'set_value', {
      entity_id: this.config.entity,
      value: this._value,
    });
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
}
customElements.define('xiaoshi-text-card', XiaoshiTextCard);

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

class XiaoshiTimeCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _currentTime: { type: Object },
      _lunarState: { type: Object },
      _flipParts: { type: Array },
      _previousTime: { type: Object },
      _displayTime: { type: Object },
      _theme: { type: String }, 
      _theme_on: { type: String }, 
      _theme_off: { type: String }, 
      _filterValue: { type: String }
    };
  }

  constructor() {
    super();
    this._currentTime = { hours: '', minutes: '', seconds: '' };
    this._previousTime = { hours: '', minutes: '', seconds: '' };
    this._displayTime = { hours: '', minutes: '', seconds: '' };
    this._flipParts = [];
    this._updateInterval = null;
    this._mode = 'A';
    this._theme = 'off';
		this._theme_on= 'rgb(150,70,70)';
		this._theme_off = 'rgb(50,50,50)'; 
    this._filterValue = '0deg';
  }

  setConfig(config) {
    this.config = config;
    this._mode = config.mode || 'A';
    this._theme = config.theme || 'off';
    this._theme_on = config.theme_on || 'rgb(150,70,70)';
    this._theme_off = config.theme_off || 'rgb(50,50,50)';
    this._filterEntity = config.filter || '';
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateTime();
    this._updateInterval = setInterval(() => this._updateTime(), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._updateInterval);
  }

  set hass(hass) {
    this._hass = hass;
    const lunarEntity = this.config?.entity || 'sensor.lunar';
    this._lunarState = this._hass.states[lunarEntity];
    if (this._filterEntity) {
      const filterState = this._hass.states[this._filterEntity];
      this._filterValue = filterState ? filterState.state + 'deg' : '0deg';
    }
		this._updateStyles();
    this.requestUpdate();
  }

  _updateTime() {
    const now = new Date();
    this._previousTime = {...this._displayTime};
    const newTime = {
      hours: now.getHours().toString().padStart(2, '0'),
      minutes: now.getMinutes().toString().padStart(2, '0'),
      seconds: now.getSeconds().toString().padStart(2, '0')
    };
    
    if (this._mode === 'B') {
      this._updateFlipParts(newTime);
    } else {
      this._currentTime = newTime;
      this._displayTime = {...newTime};
      this.requestUpdate();
    }
  }

  _updateFlipParts(newTime) {
    this._flipParts = [];
    const parts = ['hours', 'minutes', 'seconds'];
    
    parts.forEach(part => {
      if (newTime[part] !== this._displayTime[part]) {
        this._flipParts.push({
          part,
          newValue: newTime[part],
          oldValue: this._displayTime[part],
          flipping: true
        });
        
        setTimeout(() => {
          this._displayTime[part] = newTime[part];
          this._flipParts = this._flipParts.filter(p => p.part !== part);
          this.requestUpdate();
        }, 300);
      }
    });
    
    this._currentTime = newTime;
    this.requestUpdate();
  }

  render() {
    return html`
      <ha-card @click=${this._showPopup}>
        <div class="grid-container">
          ${this._mode === 'A' 
            ? html`<div id="time">${this._currentTime.hours}:${this._currentTime.minutes}:${this._currentTime.seconds}</div>`
            : this._renderFlipClock()
          }
          <div id="date">${this._getAttribute(this._lunarState, 'now_solar.日期A')}</div>
          <div id="week">${this._getAttribute(this._lunarState, 'now_solar.星期A')}</div>
          <div id="jieqi">${this._getAttribute(this._lunarState, 'jieqi.节气')}</div>
          <div id="year">${this._getAttribute(this._lunarState, 'now_lunar.年')}</div>
          <div id="mon">${this._getAttribute(this._lunarState, 'now_lunar.日期')}</div>
          <div id="day">${this._getShichen()}</div>
          <div id="line"></div>
          <div id="shengri">${this._getAttribute(this._lunarState, 'shengriwarn.最近的生日.0')}</div>
          <div id="jieri">${this._getAttribute(this._lunarState, 'shengriwarn.最近的节日.0')}</div>
        </div>
      </ha-card>
    `;
  }

  _renderFlipClock() {
    const renderPart = (part) => {
      const flipPart = this._flipParts.find(p => p.part === part);
      const displayValue = flipPart ? flipPart.oldValue : this._displayTime[part];
      const topValue = flipPart ? flipPart.newValue : displayValue; // 上半部分显示新值
      
      return html`
        <div class="flip-part-container">
          <!-- 静态显示的上半部分 -->
          <div class="part-top">${topValue}</div>
          
          <!-- 翻转动画部分 -->
          ${flipPart ? html`
            <div class="flip-animation flipping">
              <div class="flip-animation-top">${flipPart.oldValue}</div>
              <div class="flip-animation-bottom">${flipPart.newValue}</div>
            </div>
          ` : ''}
          
          <!-- 静态显示的下半部分 -->
          <div class="part-bottom">${displayValue}</div>
        </div>
      `;
    };

    return html`
      <div id="time" class="flip-clock">
        ${renderPart('hours')}
        <div class="colon">:</div>
        ${renderPart('minutes')}
        <div class="colon">:</div>
        ${renderPart('seconds')}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 240px;
        height: 145px;
        color: white !important;
        --text-color: white;
      }
      ha-card {
        background: transparent !important;
        box-shadow: none !important;
        cursor: pointer;
      }
      .grid-container {
        display: grid;
        grid-template-areas: 
          "time    time    time    time"
          "date    week    jieqi   jieqi"
          "year    mon     mon     day"
          "line    line    line    line"
          "shengri shengri shengri shengri"
          "jieri   jieri   jieri   jieri";
        grid-template-columns: 80px 58px 16px 72px;
        grid-template-rows: 55px 20px 20px 15px 20px 20px;
        font-weight: bold;
        font-size: 16px;
      }
      #time {
        grid-area: time;
        font-size: 57px;
        font-weight: 430;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        color: var(--text-color);
        line-height: 0.9;
      }
      .colon {
        display: flex;
        align-items: center;
        font-size: 50px;
        color: var(--text-color);
        margin: 0 -5px;
      }
      .flip-clock {
        display: flex;
        justify-content: center;
        gap: 10px;
      }
      .flip-part-container {
        position: relative;
        width: 80px;
        height: 50px;
        perspective: 200px;
      }
      .part-top, .part-bottom {
				line-height: 50px;
				font-size: 47px;
        position: absolute;
        width: 100%;
        height: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        backface-visibility: hidden;
        border-radius: 4px;
				filter: var(--time-filter, none);
				background: var(--time-bg-color, rgba(0, 0, 0, 1));
      }
      .part-top {
        top: 0px;
				bottom: 2px;
        border-radius: 4px 4px 0 0;
        align-items: flex-start;
        z-index: 2;
        transform: translateZ(1px);
      }
      .part-bottom {
				bottom: -1px;
        border-radius: 0 0 4px 4px;
        align-items: flex-end;
        z-index: 1;
        transform: translateZ(1px);
      }
      .flip-animation {
        position: absolute;
        top: 0;
        width: 100%;
        height: 52%;
        transform-style: preserve-3d;
        transform-origin: bottom;
        z-index: 3;
      }
      .flip-animation-top, .flip-animation-bottom {
				line-height: 50px;
				font-size: 47px;
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        overflow: hidden;
        backface-visibility: hidden;
        border-radius: 4px;
        transform-style: preserve-3d;
				filter: var(--time-filter, none);
				background: var(--time-bg-color, rgba(0, 0, 0, 1));
      } 
      .flip-animation-top {
        top: 0px;
				bottom: 2px;
        align-items: flex-start;
        transform: rotateX(0deg) translateZ(1px);
        border-radius: 4px 4px 0 0;
      }
      .flip-animation-bottom {
				bottom: -1px;
        align-items: flex-end;
        transform: rotateX(180deg) translateZ(1px);
        border-radius: 0 0 4px 4px;
      }
      .flipping {
        animation: flip 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      @keyframes flip {
        0% { transform: rotateX(0deg); }
        100% { transform: rotateX(-180deg); }
      }
      #date    { grid-area: date; color: var(--text-color) }
      #week    { grid-area: week; color: var(--text-color) }
      #jieqi   { grid-area: jieqi; text-align: right; color: var(--text-color) }
      #year    { grid-area: year; color: var(--text-color) }
      #mon     { grid-area: mon; color: var(--text-color) }
      #day     { grid-area: day; text-align: right; color: var(--text-color) }
      #line    { 
          grid-area: line; 
          border-bottom: 2px solid rgb(255,255,255); 
          margin: 5px 0;
        }
      #shengri { grid-area: shengri; color: var(--text-color); font-size: 15px }
      #jieri   { grid-area: jieri; color: var(--text-color); font-size: 15px }
    `;
  } 
 
  updated(changedProperties) {
    if (changedProperties.has('_theme') || changedProperties.has('_filterValue')) {
      this._updateStyles(); 
    }
  }
  _updateStyles() {
		const theme = this._evaluateTheme();
    const bgColor =  theme  == 'on' ? this.config.theme_on : this.config.theme_off;
    this.style.setProperty('--time-bg-color', bgColor);
    this.style.setProperty('--time-filter', `hue-rotate(${this._filterValue})`);
  }
  
  _evaluateTheme() {
    try {
      if (typeof this.config.theme === 'function') return this.config.theme();
      if (typeof this.config.theme === 'string' && this.config.theme.includes('theme()')) {
        return (new Function('return theme()'))();
      }
      return this.config.theme || 'off';
    } catch(e) {
      return 'off';
    }
  }

  _getCurrentTime() {
    const now = new Date();
    return {
      hours: now.getHours().toString().padStart(2, '0'),
      minutes: now.getMinutes().toString().padStart(2, '0'),
      seconds: now.getSeconds().toString().padStart(2, '0')
    };
  }

  _getShichen() {
		const tzArr = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子']
		const skArr = ['一', '二', '三', '四', '五', '六', '七', '八']
		const h = new Date().getHours()
		const m = new Date().getMinutes();
		const shichen = tzArr[parseInt( (h+1) / 2)] + '时';
		const shike = skArr[parseInt(m / 15) + Math.abs((h % 2) - 1) * 4] + "刻";
    return shichen+shike;
  }

  _getAttribute(state, path) { 
    return path.split('.').reduce((obj, key) => (obj || {})[key], state?.attributes || {}) || '';
  }

  _showPopup() {
    const popupContent = this.config.popup_content || {
      type: 'custom:xiaoshi-lunar-pad',
			theme: this._evaluateTheme()
    };
    
    const popupStyle = this.config.popup_style || `
      --popup-min-width: 800px;
      --mdc-theme-surface: rgb(0,0,0,0);
      --dialog-backdrop-filter: blur(10px) brightness(1);
    `;
    
    window.browser_mod.service('popup', { 
      style: popupStyle,
      content: popupContent
    });
  }
}
customElements.define('xiaoshi-time-card', XiaoshiTimeCard);

class XiaoshiGridCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    };
  }

  static get styles() {
    return css`
      .container {
        position: relative;
        display: block;
        overflow: hidden;
      }
      .grid-item {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-sizing: border-box;
        border: 0;
				cursor: pointer;
      }
    `;
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error('You need to define entities');
    }
    this.config = {
      width: config.width || '400px',
      height: config.height || '80px',
      min: config.min || 0,
      max: config.max || 100,
      mode: config.mode || '温度',
      display: config.display || false,
      entities: config.entities.map(entity => ({
        ...entity,
        state: entity.state !== false, // 默认true，除非显式设置为false
        
      })),
    };
  }

  render() {
		if(this._display()) return;
		return html`
			<div class="container" 
				style="width: ${this.config.width}; 
				height: ${this.config.height};"
			>
				${this.config.entities.map((entityConfig) => {
					const entity = this.hass.states[entityConfig.entity];
					if (!entity) return html``;
					
					const value = parseFloat(entity.state);
					const grid = entityConfig.grid ? entityConfig.grid.split(',') : ['0%', '0%', '100%', '100%'];
					const unit = entityConfig.unit || '';
					
					// 计算背景颜色
					let filter;
					if (this.config.mode === '温度') {
						filter = this._calculateTemperatureFilter(value);
					} else if (this.config.mode === '湿度') {
						filter = this._calculateHumidityFilter(value);
					}
					let size = Number(grid[2].slice(0, grid[2].length-1));
					let fsize ="11px";
					if (size<25 )  fsize ="10px";
					if (size<20 )  fsize ="9px";
					if (size<15 )  fsize ="8px";
					return html`
						<div 
							class="grid-item" 
							style="
								left: ${grid[0]};
								top: ${grid[1]};
								width: ${grid[2]};
								height: ${grid[3]};
								background-color: rgba(0, 200, 0, 0.8);
								filter: ${filter};
								font-size: ${fsize};
							"
						>
							${entityConfig.state !== false ? html`${entity.state}${unit}` : ''}
						</div>
					`;
				})}
			</div> 
		`;
	}

	_display() {
		try {
			if (this.config.display === undefined) return false;
			if (typeof this.config.display === 'boolean') {
				return this.config.display;
			}
			if (typeof this.config.display === 'function') {
				const result = this.config.display();
				return result === true || result === "true"; // 同时接受 true 和 "true"
			}
			if (typeof this.config.display === 'string') {
				const displayStr = this.config.display.trim();
				if (displayStr.startsWith('[[[') && displayStr.endsWith(']]]')) {
					const funcBody = displayStr.slice(3, -3).trim();
					const result = new Function('states', funcBody)(this.hass.states);
					return result === true || result === "true"; // 同时接受 true 和 "true"
				}
				if (displayStr.includes('return') || displayStr.includes('=>')) {
					const result = (new Function(`return ${displayStr}`))();
					return result === true || result === "true";
				}
				const result = (new Function(`return ${displayStr}`))();
				return result === true || result === "true";
			}
			return false;
		} catch(e) {
			console.error('显示出错:', e);
			return false;
		}
	}

	_calculateTemperatureFilter(temp) {
		temp = parseFloat(temp);
		const { min, max } = this.config;
		let deg;
		  
		if (temp > 25) {
			deg = (25 - temp) * 120 / (max - 25);
		} else {
			deg = (25 - temp) * 100 / (25 - min);
		}
		
		return `hue-rotate(${deg}deg)`;
	}
	 
	_calculateHumidityFilter(hum) {
		hum = parseFloat(hum);
		const { min, max } = this.config;
		let deg;
		
		if (hum > 50) {
			deg = (50 - hum) * 100 / (50 - max);
		} else {
			deg = (50 - hum) * 120 / (min - 50);
		}
		
		return `hue-rotate(${deg}deg)`;
	}

  getCardSize() {
    return 1;
  }
}
customElements.define('xiaoshi-grid-card', XiaoshiGridCard);

class XiaoshiSliderCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
      _value: Number,
      _min: Number,
      _max: Number,
      _dragging: Boolean
    };
  }

  static get styles() {
    return css`
      .slider-root {
        position: relative;
        width: var(--slider-width, 100%);
        height: var(--slider-height, 30px);
        touch-action: none; /* 禁用浏览器默认触摸行为 */
      }
      
      .slider-track {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        height: var(--track-height, 5px);
        background: var(--track-color, rgba(255,255,255,0.3));
        border-radius: var(--track-radius, 2px);
      }
      
      .slider-fill {
        position: absolute;
        height: 100%;
        background: var(--slider-color, #f00);
        border-radius: inherit;
      }
      
      .slider-thumb {
        position: absolute;
        top: 50%;
        width: var(--thumb-size, 15px);
        height: var(--thumb-size, 15px);
        background: var(--thumb-color, #fff);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
    `;
  }

  constructor() {
    super();
    this._value = 0;
    this._min = 0;
    this._max = 100;
    this._dragging = false;
    this._startX = 0;
    this._startValue = 0;
    this._moveHandler = (e) => this._handleDrag(e);
    this._endHandler = () => this._endDrag();
  }

  setConfig(config) {
    if (!config.entity) throw new Error('必须指定实体');
    this.config = config;
    if (config.style) {
      Object.keys(config.style).forEach(key => {
        this.style.setProperty(`--${key}`, config.style[key]);
      });
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('hass')) {
      const state = this.hass.states[this.config.entity];
      if (state) {
        this._value = Number(state.state);
        this._min = Number(state.attributes.min || 0);
        this._max = Number(state.attributes.max || 100);
      }
    }
  }

  render() {
    const percent = Math.max(0, Math.min(100, (this._value - this._min) / (this._max - this._min) * 100));
    
    return html`
      <div class="slider-root"
           @mousedown=${this._startDrag}
           @touchstart=${this._startDrag}>
        <div class="slider-track">
          <div class="slider-fill" style="width: ${percent}%"></div>
          <div class="slider-thumb" style="left: ${percent}%"></div>
        </div>
      </div>
    `;
  }

  _startDrag(e) {
    e.preventDefault();
    this._dragging = true;
    
    const slider = this.shadowRoot.querySelector('.slider-track');
    const rect = slider.getBoundingClientRect();
    this._sliderLeft = rect.left;
    this._sliderWidth = rect.width;
    
    window.addEventListener('mousemove', this._moveHandler);
    window.addEventListener('touchmove', this._moveHandler, { passive: false });
    window.addEventListener('mouseup', this._endHandler);
    window.addEventListener('touchend', this._endHandler);
    
    // 立即处理初始点击位置
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    this._updateValue((clientX - this._sliderLeft) / this._sliderWidth);
  }

  _endDrag() {
    if (!this._dragging) return;
    
    this._dragging = false;
    this._removeEventListeners();
  }

  _handleDrag(e) {
    if (!this._dragging) return;
    e.preventDefault();
    
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    this._updateValue((clientX - this._sliderLeft) / this._sliderWidth);
  }

  _removeEventListeners() {
    window.removeEventListener('mousemove', this._moveHandler);
    window.removeEventListener('touchmove', this._moveHandler);
    window.removeEventListener('mouseup', this._endHandler);
    window.removeEventListener('touchend', this._endHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }
  _updateValue(ratio) {
    // 严格限制在0-1范围内
    const safeRatio = Math.max(0, Math.min(1, ratio));
    const newValue = this._min + safeRatio * (this._max - this._min);
    const roundedValue = Math.round(newValue);
    
    // 只有值确实变化了才更新
    if (roundedValue !== this._value) {
      this._value = roundedValue;
      this._debouncedSetValue(roundedValue);
    }
  }

  _debouncedSetValue(value) {
    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => {
      this._callService(value);
    }, 50); // 50ms防抖
  }

  _callService(value) {
    const service = this.config.entity.split('.')[0];
    this.hass.callService(service, 'set_value', {
      entity_id: this.config.entity,
      value: value
    });
  }
}
customElements.define('xiaoshi-slider-card', XiaoshiSliderCard);

class XiaoshiStateGridCalendar extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      width: { type: String, attribute: true },
      height: { type: String, attribute: true },
      year: { type: Number },
      month: { type: Number },
      entity: { type: String },
      activeNav: { type: String },
      colorNum: { type: String, attribute: true },
      colorCost: { type: String, attribute: true },
			theme: { type: String },
			config: { type: Object }
    };
  }
  
  setConfig(config) {
		this.config = config;
    if (config) {
      if (config.width !== undefined) this.width = config.width;
      if (config.height !== undefined) this.height = config.height;
      if (config.year !== undefined) this.year = config.year;
      if (config.month !== undefined) this.month = config.month;
      if (config.entity !== undefined) this.entity = config.entity;
      if (config.color_num !== undefined) this.colorNum = config.color_num;
      if (config.color_cost !== undefined) this.colorCost = config.color_cost;
      this.requestUpdate();
    }
  }

  constructor() {
    super();
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.width = '330px';
    this.height = '380px';
    this.theme = 'on';
    this.entity = 'sensor.state_grid';
    this.dayData = [];
    this.activeNav = '';
    this.monthData = null;
    this.colorNum = '#0fccc3';
    this.colorCost = '#804aff';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      
      .calendar-grid {
        border-radius: 10px;
        display: grid;
        grid-template-areas:
          "yearlast year yearnext today monthlast month monthnext"
          "week1 week2 week3 week4 week5 week6 week7" 
          "id1 id2 id3 id4 id5 id6 id7" 
          "id8 id9 id10 id11 id12 id13 id14" 
          "id15 id16 id17 id18 id19 id20 id21" 
          "id22 id23 id24 id25 id26 id27 id28" 
          "id29 id30 id31 id32 id33 id34 id35" 
          "id36 id37 id98 id98 id99 id99 id99";
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: 1fr 0.6fr 1fr 1fr 1fr 1fr 1fr 1fr;
        gap: 0px;
        padding: 2px;
      }

      .celltotal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0;
        cursor: default;
        font-size: 15px;
        font-weight: 600;
      }

      .cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0;
        cursor: default;
        font-size: 12px;
        line-height: 12px;
        font-weight: 500;
      }

      .month-cell {
        border-bottom: 0.5px solid #00a0a080;
        border-right: 0.5px solid #00a0a080;
      }
      .month-cell-left {
        border-left: 0.5px solid #00a0a080;
      }
      .month-cell-top {
        border-top: 0.5px solid #00a0a080;
      }
      .month-cell-right {
        border-right: 0.5px solid #00a0a080;
      }
      .month-cell-bottom {
        border-bottom: 0.5px solid #00a0a080;
      }

      .nav-button {
        cursor: pointer;
        user-select: none;
        font-size: 12px;
        transition: all 0.2s ease;
				border-radius: 10px;
      }
      
      .nav-button:active {
        transform: scale(0.95);
        opacity: 0.8;
      }
      
      .active-nav {
        background-color: rgba(0, 160, 160, 0.2);
        border-radius: 4px;
      }
      
      .today-button {
        cursor: pointer;
        user-select: none;
      }
      
      .weekday {
        //font-weight: bold;
      }
      
      .month-day {
        cursor: pointer;
      }
      
      .electricity-num {
        font-size: 12px;
        line-height: 12px;
      }
      
      .electricity-cost {
        font-size: 12px;
        line-height: 12px;
      }
      
      .min-usage {
        background-color: rgba(0, 255, 0, 0.2);
      }
      
      .max-usage {
        background-color: rgba(255, 0, 0, 0.2);
      }
      
      .summary-info {
        display: flex;
        flex-direction: column;
        align-items:  flex-start;
        justify-content: center;
        font-size: 13px;
        line-height: 16px;
        font-weight: 500;
				padding: 0 0 0 30px;
				white-space: nowrap;
      }
    `;
  }

  // 从hass对象中获取实体数据
  updateDayData() {
    if (this.hass && this.entity) {
      const entityObj = this.hass.states[this.entity];
      if (entityObj && entityObj.attributes) {
        if (entityObj.attributes.daylist) {
          this.dayData = entityObj.attributes.daylist;
        } else {
          this.dayData = [];
        }
        
        if (entityObj.attributes.monthlist) {
          const monthStr = `${this.year}-${this.month.toString().padStart(2, '0')}`;
          this.monthData = entityObj.attributes.monthlist.find(item => item.month === monthStr);
        } else {
          this.monthData = null;
        }
      } else {
        this.dayData = [];
        this.monthData = null;
      }
    }
  }

  // 根据日期获取用电数据
  getDayData(year, month, day) {
    if (!this.dayData || this.dayData.length === 0) return null;
    
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return this.dayData.find(item => item.day === dateStr);
  }
  // 根据日期获取用电数据的最小值和最大值
	getMinMaxUsageDays() {
    if (!this.dayData || this.dayData.length === 0) return { minDays: [], maxDays: [] };
    
    const monthStr = `${this.year}-${this.month.toString().padStart(2, '0')}`;
    const monthDays = this.dayData.filter(item => item.day.startsWith(monthStr));
    
    if (monthDays.length === 0) return { minDays: [], maxDays: [] };
    
    const validDays = monthDays.filter(day => day.dayEleNum !== undefined && day.dayEleNum !== null);
    
    if (validDays.length === 0) return { minDays: [], maxDays: [] };
    
    const minUsage = Math.min(...validDays.map(day => parseFloat(day.dayEleNum)));
    const maxUsage = Math.max(...validDays.map(day => parseFloat(day.dayEleNum)));
    
    // 修正：去掉日期前导零，确保格式匹配
    const minDays = validDays
        .filter(day => parseFloat(day.dayEleNum) === minUsage)
        .map(day => parseInt(day.day.split('-')[2], 10).toString()); // 转为数字再转字符串去掉前导零
        
    const maxDays = validDays
        .filter(day => parseFloat(day.dayEleNum) === maxUsage)
        .map(day => parseInt(day.day.split('-')[2], 10).toString());
    
    return { minDays, maxDays };
  }

  // 当hass对象更新时调用
  set hass(value) {
    this._hass = value;
    this.updateDayData();
    this.requestUpdate();
  }

  get hass() {
    return this._hass;
  }

  render() {
    // 根据主题设置颜色
		const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';

    // 计算当月天数
    const daysInMonth = this.getDaysInMonth(this.year, this.month);
    // 计算当月第一天是星期几 (0-6, 0是星期日)
    const firstDayOfMonth = new Date(this.year, this.month - 1, 1).getDay();
    // 调整中国习惯，星期一到星期日 (一 二 三 四 五 六 日)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const { minDays, maxDays } = this.getMinMaxUsageDays();

    // 生成日期单元格
    const days = [];
    const weekdayNames = ['一', '二', '三', '四', '五', '六', '日'];

    // 1. 渲染年份和月份导航行 
    const yearMonthRow = html` 
      <div class="celltotal nav-button ${this.activeNav === 'yearlast' ? 'active-nav' : ''}" 
           style="grid-area: yearlast;" 
           @click=${this.prevYear}
           @mousedown=${() => this.activeNav = 'yearlast'}
           @mouseup=${() => this.activeNav = ''}
           @mouseleave=${() => this.activeNav = ''}>◀</div>
      <div class="celltotal" style="grid-area: year;">${this.year+"年"}</div>
      <div class="celltotal nav-button ${this.activeNav === 'yearnext' ? 'active-nav' : ''}" 
           style="grid-area: yearnext;" 
           @click=${this.nextYear}
           @mousedown=${() => this.activeNav = 'yearnext'}
           @mouseup=${() => this.activeNav = ''}
           @mouseleave=${() => this.activeNav = ''}>▶</div>
      <div class="celltotal today-button" style="grid-area: today;" @click=${this.goToToday}>当月</div>
      <div class="celltotal nav-button ${this.activeNav === 'monthlast' ? 'active-nav' : ''}" 
           style="grid-area: monthlast;" 
           @click=${this.prevMonth}
           @mousedown=${() => this.activeNav = 'monthlast'}
           @mouseup=${() => this.activeNav = ''}
           @mouseleave=${() => this.activeNav = ''}>◀</div>
      <div class="celltotal" style="grid-area: month;">${this.month+"月"}</div>
      <div class="celltotal nav-button ${this.activeNav === 'monthnext' ? 'active-nav' : ''}" 
           style="grid-area: monthnext;" 
           @click=${this.nextMonth}
           @mousedown=${() => this.activeNav = 'monthnext'}
           @mouseup=${() => this.activeNav = ''}
           @mouseleave=${() => this.activeNav = ''}>▶</div>
    `;

    // 2. 渲染星期行
    const weekdaysRow = weekdayNames.map((day, index) => 
      html`<div class="celltotal weekday" style="grid-area: week${index + 1};">${day}</div>`
    );

    // 3. 渲染日期单元格
    // 3.1 上个月的日期 (空白)
    for (let i = 0; i < adjustedFirstDay; i++) {
      if (i==adjustedFirstDay-1){
        days.push(html`<div class="cell month-cell-bottom month-cell-right" style="grid-area: id${i + 1};"></div>`);
      }
      else{
        days.push(html`<div class="cell month-cell-bottom" style="grid-area: id${i + 1};"></div>`);
      }
    }
 
    // 3.2 当月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      const dayData = this.getDayData(this.year, this.month, i);
      
      const isMinDay = minDays.includes(i.toString());
      const isMaxDay = maxDays.includes(i.toString());
      const dayClass = isMinDay ? 'min-usage' : isMaxDay ? 'max-usage' : '';
      
      const dayContent = html`
        <div>${i}</div>
        ${dayData ? html`
          <div class="electricity-num" style="color: ${this.colorNum}">${dayData.dayEleNum}°</div>
          <div class="electricity-cost" style="color: ${this.colorCost}">${dayData.dayEleCost}元</div>
        ` : ''}
      `;

      if(adjustedFirstDay>0 && i>=1 && i<=7-adjustedFirstDay){
        days.push(html`
        <div class="cell month-cell month-cell-top month-day ${dayClass}" style="grid-area: id${i + adjustedFirstDay};">
          ${dayContent}
        </div>
        `);
      }
      else if(adjustedFirstDay==0 && i==1){
        days.push(html`
        <div class="cell month-cell month-cell-top month-cell-left month-day ${dayClass}" style="grid-area: id${i + adjustedFirstDay};">
          ${dayContent}
        </div>
        `);
      }
      else if(adjustedFirstDay==0 && i>1 && i<=7-adjustedFirstDay){
        days.push(html`
        <div class="cell month-cell month-cell-top month-day ${dayClass}" style="grid-area: id${i + adjustedFirstDay};">
          ${dayContent}
        </div>
        `);
      }
      else if(i==8-adjustedFirstDay || i==15-adjustedFirstDay || i==22-adjustedFirstDay || i==29-adjustedFirstDay || i==36-adjustedFirstDay){
        days.push(html`
        <div class="cell month-cell month-cell-left month-day ${dayClass}" style="grid-area: id${i + adjustedFirstDay};">
          ${dayContent}
        </div>
        `);
      }
      else{
        days.push(html`
        <div class="cell month-cell month-day ${dayClass}" style="grid-area: id${i + adjustedFirstDay};">
          ${dayContent}
        </div>
        `);
      }
    }

    // 3.3 下个月的日期 (空白)
    const totalCells = 37;
    for (let i = daysInMonth + adjustedFirstDay + 1; i <= totalCells; i++) {
      days.push(html`<div class="cell" style="grid-area: id${i};"></div>`);
    }

    // 4. 底部保留区域
    const bottomRow = html`
      <div class="cell" style="grid-area: id98;"></div>
      <div class="cell summary-info" style="grid-area: id99;">
        ${this.monthData ? html`
          <div><span  style="color: ${this.colorNum}">月电量: ${this.monthData.monthEleNum}度</span></div>
          <div><span  style="color: ${this.colorCost}">月电费: ${this.monthData.monthEleCost}元</span></div>
        ` : html`<div></div>`}
      </div>
    `;
    
    return html`
      <div class="calendar-grid" 
           style="width: ${this.width}; height: ${this.height}; 
                  background-color: ${bgColor}; color: ${fgColor}; 
                  ">
        ${yearMonthRow}
        ${weekdaysRow}
        ${days}
        ${bottomRow}
      </div>
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  prevYear() {
    this.year--;
    this.updateDayData();
    this.requestUpdate();
  }

  nextYear() {
    this.year++;
    this.updateDayData();
    this.requestUpdate();
  }

  prevMonth() {
    if (this.month === 1) {
      this.month = 12;
      this.year--;
    } else {
      this.month--;
    }
    this.updateDayData();
    this.requestUpdate();
  }

  nextMonth() {
    if (this.month === 12) {
      this.month = 1;
      this.year++;
    } else {
      this.month++;
    }
    this.updateDayData();
    this.requestUpdate();
  }

  goToToday() {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.updateDayData();
    this.requestUpdate();
  }
}
customElements.define('xiaoshi-state-grid-calendar', XiaoshiStateGridCalendar);

class XiaoshiStateGridNodeRed extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _data: { type: Object, state: true },
      border: { type: String, attribute: 'border-radius' },
      cardwidth: { type: String, attribute: 'card-width' },
      cardheight: { type: String, attribute: 'card-height' },
      _isRefreshing: { type: Boolean, state: true },
      colorNum: { type: String, attribute: true },
      colorCost: { type: String, attribute: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: Arial, sans-serif;
        --title-font-size: 20px;
      }
      
      .card-container {
        display: grid;
        border-radius: var(--border-radius, 10px);
        padding: 2px 2px 2px 2px;
        cursor: default;
        justify-items: center;
        align-items: center;
      }

      .card-container.show-n {
        grid-template-areas: 
          "名称 名称 名称 名称 名称"   
          "刷新时间 刷新时间 刷新时间 刷新时间 电费余额"   
          "数据日期 数据日期 数据日期 数据日期 电费余额"   
          "日总用电 日峰用电 日平用电 日谷用电 日用电费"      
          "月总用电 月峰用电 月平用电 月谷用电 月用电费"     
          "上月总用电 上月峰用电 上月平用电 上月谷用电 上月用电费"       
          "年总用电 年峰用电 年平用电 年谷用电 年用电费";
        grid-template-columns: auto auto auto auto auto;
        grid-template-rows: auto auto auto auto auto auto auto;
      }

      .card-container.hide-n {
        grid-template-areas: 
          "名称 名称 名称 名称"   
          "刷新时间 刷新时间 刷新时间 电费余额"   
          "数据日期 数据日期 数据日期 电费余额"   
          "日总用电 日峰用电 日谷用电 日用电费"      
          "月总用电 月峰用电 月谷用电 月用电费"     
          "上月总用电 上月峰用电 上月谷用电 上月用电费"       
          "年总用电 年峰用电 年谷用电 年用电费";
        grid-template-columns: auto auto auto auto;
        grid-template-rows: auto auto auto auto auto auto auto;
      }

      .light-theme {
        background: rgb(255,255,255);
        color: rgb(0,0,0);
      }
      
      .dark-theme {
        background: rgb(50,50,50);
        color: rgb(255,255,255);
      }
      
      .title {
        grid-area: 名称;
        font-size: var(--title-font-size);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
      }
      
      .refresh-time {
        grid-area: 刷新时间;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        padding-left: 5px;
        justify-self: start;
      }

      .refresh-button {
        margin-left: 10px;
        cursor: pointer;
        color: rgb(0,200,200);
        transition: transform 1s ease;
      }

      .refresh-button.rotating {
        transform: rotate(360deg);
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .data-date {
        grid-area: 数据日期;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        padding-left: 5px;
        justify-self: start;
      }

      .balance {
        grid-area: 电费余额;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: var(--card-width, 70px);
      }
      
      .data-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(0,200,200,0.5);
        border-radius: 20px;
        width: var(--card-width, 70px);
        height: var(--card-height, 35px);
      }
      
      .data-item.light {
        background: rgb(255,255,255);
      }
      
      .data-item.dark {
        background: rgb(50,50,50);
      }
      
      .data-item-content {
        display: flex;
        align-items: center;
        width: 100%;
      }
      
      .data-item-icon {
        width: 9px;
        color: rgb(0,200,200);
        margin-right: 5px;
        flex-shrink: 0;
        transform: scale(0.7);
      }
      
      .data-item-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        width: 100%;
        text-align: center;
      }
      
      .data-item-value {
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        text-align: center;
        margin-top: -4px;
      }
      
      .data-item-name {
        font-size: 9px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        text-align: center;
        margin-top: 2px;
      }
      
      .warning {
        color: #FF2000;
        font-weight: bold;
      }
    `;
  }

  constructor() {
    super();
    this.hass = null;
    this.config = {
      entity: 'sensor.state_grid',
      title: '电费信息',
      theme: 'on',
      height: '330px',
      width: '380px',
      border: '10px',
      cardwidth: '70px',
      cardheight: '35px',
      titleFontSize: '20px',
      n_num: '', // 新增参数，默认显示平用电
      balance_name: '电费余额' // 新增参数，默认显示"电费余额"
    };
    this._data = {};
    this._interval = null;
    this._isRefreshing = false;
    this.colorNum = '#0fccc3';
    this.colorCost = '#804aff';
  }

  setConfig(config) {
    this.config = {
      ...this.config,
      ...config
    };
    this.border = this.config.border || '10px';
    this.cardwidth = this.config.cardwidth || '70px';
    this.cardheight = this.config.cardheight || '35px';
    this.style.setProperty('--title-font-size', this.config.titleFontSize || '20px'); 
    if (config.color_num !== undefined) this.colorNum = config.color_num;
    if (config.color_cost !== undefined) this.colorCost = config.color_cost;
  }

  updated(changedProperties) {
    if (changedProperties.has('hass')) {
      this._fetchData();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchData();
    this._setupInterval();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  _setupInterval() {
    this._interval = setInterval(() => {
      this._fetchData();
    }, 60000);
  }

  async _fetchData() {
    if (!this.hass || !this.config.entity) return;
    
    try {
      const entity = this.hass.states[this.config.entity];
      if (!entity) return;
      
      const attributes = entity.attributes || {};
      const dayData = attributes.daylist?.[0] || {};
      const monthData = attributes.monthlist?.[0] || {};
      const last_monthData = attributes.monthlist?.[1] || {};
      const yearData = attributes.yearlist?.[0] || {};
      
      this._data = {
        refresh_time: attributes.date || 'N/A',
        daily_lasted_date: dayData.day || 'N/A',
        balance: entity.state || 'N/A',
        dayEleNum: dayData.dayEleNum || '0',
        daily_p_ele_num: dayData.dayPPq || '0',
        daily_n_ele_num: dayData.dayNPq || '0',
        daily_v_ele_num: dayData.dayVPq || '0',
        daily_ele_cost: dayData.dayEleCost || '0',
        month_ele_num: monthData.monthEleNum || '0',
        month_p_ele_num: monthData.monthPPq || '0',
        month_n_ele_num: monthData.monthNPq || '0',
        month_v_ele_num: monthData.monthVPq || '0',
        month_ele_cost: monthData.monthEleCost || '0',
        last_month_ele_num: last_monthData.monthEleNum || '0',
        last_month_p_ele_num: last_monthData.monthPPq || '0',
        last_month_n_ele_num: last_monthData.monthNPq || '0',
        last_month_v_ele_num: last_monthData.monthVPq || '0',
        last_month_ele_cost: last_monthData.monthEleCost || '0',
        year_ele_num: yearData.yearEleNum || '0',
        year_p_ele_num: yearData.yearPPq || '0',
        year_n_ele_num: yearData.yearNPq || '0',
        year_v_ele_num: yearData.yearVPq || '0',
        year_ele_cost: yearData.yearEleCost || '0'
      };
    } catch (error) {
      console.error('获取数据出错:', error);
    } finally {
      this._isRefreshing = false;
    }
  }

  _handleRefresh() {
    if (this._isRefreshing || !this.config.button || 
        !this.hass.states[this.config.button]) return;
    this._isRefreshing = true;
    
    setTimeout(() => {
      this._isRefreshing = false;
      this.hass.callService('button', 'press', {entity_id: this.config.button});
    }, 1000);
  }

  _formatBalance(balance) {
    return balance >= 20 ? 
      `${balance}元` : 
      html`<span class="warning">${balance}元</span>`;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.config) return html``;
    
    const theme = this._evaluateTheme();
    const themeClass = theme === 'on' ? 'light-theme' : 'dark-theme';
    const itemThemeClass = theme === 'on' ? 'light' : 'dark';
    const showN = this.config.n_num !== 'none'; // 判断是否显示平用电
    const layoutClass = showN ? 'show-n' : 'hide-n'; // 根据是否显示平用电选择布局类
    
    return html`
      <div class="card-container ${themeClass} ${layoutClass}" 
           style="height: ${this.config.height}; 
           width: ${this.config.width};
           --border-radius: ${this.border};
           --card-width: ${this.cardwidth};
           --card-height: ${this.cardheight}">
        <div class="title">${this.config.title || '电费信息'}</div>
        
        <div class="refresh-time">
          用电刷新时间: ${this._data.refresh_time || 'N/A'}
          ${this.config.button ? html`
          <ha-icon class="refresh-button ${this._isRefreshing ? 'rotating' : ''}" 
                   icon="mdi:refresh" 
                   @click=${this._handleRefresh} 
                   title="手动刷新数据"></ha-icon>
          ` : ''}
        </div>

        <div class="data-date">
          最新用电日期: ${this._data.daily_lasted_date || 'N/A'}
        </div>

        <div class="balance">
          ${this._renderDataItem(this.config.balance_name || '电费余额', 'mdi:cash', this._formatBalance(this._data.balance), itemThemeClass, null, this.colorCost)}
        </div>
        
        ${this._renderDataItem('日总用电', 'mdi:lightning-bolt', `${this._data.dayEleNum || '0'}°`, itemThemeClass, '日总用电', this.colorNum)}
        ${this._renderDataItem('日峰用电', 'mdi:lightning-bolt', `${this._data.daily_p_ele_num || '0'}°`, itemThemeClass, '日峰用电', this.colorNum)}
        ${showN ? this._renderDataItem('日平用电', 'mdi:lightning-bolt', `${this._data.daily_n_ele_num || '0'}°`, itemThemeClass, '日平用电', this.colorNum) : ''}
        ${this._renderDataItem('日谷用电', 'mdi:lightning-bolt', `${this._data.daily_v_ele_num || '0'}°`, itemThemeClass, '日谷用电', this.colorNum)}
        ${this._renderDataItem('日用电费', 'mdi:cash', `${this._data.daily_ele_cost || '0'}元`, itemThemeClass, '日用电费', this.colorCost)}
        
        ${this._renderDataItem('月总用电', 'mdi:lightning-bolt', `${this._data.month_ele_num || '0'}°`, itemThemeClass, '月总用电', this.colorNum)}
        ${this._renderDataItem('月峰用电', 'mdi:lightning-bolt', `${this._data.month_p_ele_num || '0'}°`, itemThemeClass, '月峰用电', this.colorNum)}
        ${showN ? this._renderDataItem('月平用电', 'mdi:lightning-bolt', `${this._data.month_n_ele_num || '0'}°`, itemThemeClass, '月平用电', this.colorNum) : ''}
        ${this._renderDataItem('月谷用电', 'mdi:lightning-bolt', `${this._data.month_v_ele_num || '0'}°`, itemThemeClass, '月谷用电', this.colorNum)}
        ${this._renderDataItem('月用电费', 'mdi:cash', `${this._data.month_ele_cost || '0'}元`, itemThemeClass, '月用电费', this.colorCost)}

        ${this._renderDataItem('上月总用电', 'mdi:lightning-bolt', `${this._data.last_month_ele_num || '0'}°`, itemThemeClass, '上月总用电', this.colorNum)}
        ${this._renderDataItem('上月峰用电', 'mdi:lightning-bolt', `${this._data.last_month_p_ele_num || '0'}°`, itemThemeClass, '上月峰用电', this.colorNum)}
        ${showN ? this._renderDataItem('上月平用电', 'mdi:lightning-bolt', `${this._data.last_month_n_ele_num || '0'}°`, itemThemeClass, '上月平用电', this.colorNum) : ''}
        ${this._renderDataItem('上月谷用电', 'mdi:lightning-bolt', `${this._data.last_month_v_ele_num || '0'}°`, itemThemeClass, '上月谷用电', this.colorNum)}
        ${this._renderDataItem('上月用电费', 'mdi:cash', `${this._data.last_month_ele_cost || '0'}元`, itemThemeClass, '上月用电费', this.colorCost)}
        
        ${this._renderDataItem('年总用电', 'mdi:lightning-bolt', `${this._data.year_ele_num || '0'}°`, itemThemeClass, '年总用电', this.colorNum)}
        ${this._renderDataItem('年峰用电', 'mdi:lightning-bolt', `${this._data.year_p_ele_num || '0'}°`, itemThemeClass, '年峰用电', this.colorNum)}
        ${showN ? this._renderDataItem('年平用电', 'mdi:lightning-bolt', `${this._data.year_n_ele_num || '0'}°`, itemThemeClass, '年平用电', this.colorNum) : ''}
        ${this._renderDataItem('年谷用电', 'mdi:lightning-bolt', `${this._data.year_v_ele_num || '0'}°`, itemThemeClass, '年谷用电', this.colorNum)}
        ${this._renderDataItem('年用电费', 'mdi:cash', `${this._data.year_ele_cost || '0'}元`, itemThemeClass, '年用电费', this.colorCost)}
      </div>
    `;
  }

  _renderDataItem(name, icon, value, themeClass, gridArea, color) {
    return html`
      <div class="data-item ${themeClass}" style="${gridArea ? `grid-area: ${gridArea}` : ''}">
        ${icon ? html`
          <div class="data-item-content">
            <ha-icon class="data-item-icon" .icon=${icon} style="color: ${color}"></ha-icon>
            <div class="data-item-text">
              <div class="data-item-name">${name}</div>
              <div class="data-item-value" style="color: ${color}">${value}</div>
            </div>
          </div>
        ` : html`
          <div class="data-item-text">
            <div class="data-item-name">${name}</div>
            <div class="data-item-value" style="color: ${color}">${value}</div>
          </div>
        `}
      </div>
    `;
  }
}
customElements.define('xiaoshi-state-grid-nodered', XiaoshiStateGridNodeRed);

class XiaoshiStateGridHassbox extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _data: { type: Object, state: true },
      _price: { type: Number, state: true },
			border: { type: String, attribute: 'border-radius' },
			cardwidth: { type: String, attribute: 'card-width' },
			cardheight: { type: String, attribute: 'card-height' },
      colorNum: { type: String, attribute: true },
      colorCost: { type: String, attribute: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: Arial, sans-serif;
				--title-font-size: 20px;
      }
      
      .card-container {
        display: grid;
        border-radius: var(--border-radius, 10px);
        padding: 2px 2px 2px 2px;
        cursor: default;
        justify-items: center;
        align-items: center;
      }

      .card-container.show-n {
        grid-template-areas: 
          "名称 名称 名称 名称 名称"   
          "刷新时间 刷新时间 刷新时间 刷新时间 电费余额"   
          "数据日期 数据日期 数据日期 数据日期 电费余额"   
          "日总用电 日峰用电 日平用电 日谷用电 日用电费"      
          "月总用电 月峰用电 月平用电 月谷用电 月用电费"     
          "上月总用电 上月峰用电 上月平用电 上月谷用电 上月用电费"       
          "年总用电 年峰用电 年平用电 年谷用电 年用电费";
        grid-template-columns: auto auto auto auto auto;
        grid-template-rows: auto auto auto auto auto auto auto;
      }

      .card-container.hide-n {
        grid-template-areas: 
          "名称 名称 名称 名称"   
          "刷新时间 刷新时间 刷新时间 电费余额"   
          "数据日期 数据日期 数据日期 电费余额"   
          "日总用电 日峰用电 日谷用电 日用电费"      
          "月总用电 月峰用电 月谷用电 月用电费"     
          "上月总用电 上月峰用电 上月谷用电 上月用电费"       
          "年总用电 年峰用电 年谷用电 年用电费";
        grid-template-columns: auto auto auto auto;
        grid-template-rows: auto auto auto auto auto auto auto;
      }
      
      .light-theme {
        background: rgb(255,255,255);
        color: rgb(0,0,0);
      }
      
      .dark-theme {
        background: rgb(50,50,50);
        color: rgb(255,255,255);
      }
      
      .title {
        grid-area: 名称;
        font-size: var(--title-font-size);;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
      }
      
      .refresh-time {
        grid-area: 刷新时间;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
				padding-left: 5px;
				justify-self: start;
      }
      
      .data-date {
        grid-area: 数据日期;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
				padding-left: 5px;
				justify-self: start;
      }
      
      .balance {
        grid-area: 电费余额;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: var(--card-width, 70px);
      }
      
      .data-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(0,200,200,0.5);
        border-radius: 20px;
        width: var(--card-width, 70px);
        height: var(--card-height, 35px);
      }
      
      .data-item.light {
        background: rgb(255,255,255);
      }
      
      .data-item.dark {
        background: rgb(50,50,50);
      }
      
      .data-item-content {
        display: flex;
        align-items: center;
        width: 100%;
      }
      
      .data-item-icon {
        width: 9px;
        color: rgb(0,200,200);
        margin-right: 5px;
        flex-shrink: 0;
        transform: scale(0.7);
      }
      
      .data-item-text {
        display: flex;
        flex-direction: column;
				align-items: center;
        justify-content: center;
        overflow: hidden;
        width: 100%;
				text-align: center;
      }
      
      .data-item-value {
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
				text-align: center;
        margin-top: -4px;
      }
      
      .data-item-name {
        font-size: 9px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
				text-align: center;
      }
      
      .warning {
        color: #FF2000;
        font-weight: bold;
      }
    `;
  }

  constructor() {
    super();
    this.hass = null;
    this.config = {
      id: '',
			title: '电费信息',
      price: 0.5,
      theme: 'on',
      height: '330px',
      width: '380px',
			border: '10px',
			cardwidth: '70px',
			cardheight: '35px',
			titleFontSize: '20px',
      n_num: '', // 新增参数，默认显示平用电
      balance_name: '电费余额' // 新增参数，默认显示"电费余额"
    };
    this._data = {};
    this._price = 0.5;
    this._interval = null;
    this.colorNum = '#0fccc3';
    this.colorCost = '#804aff';
  }

  setConfig(config) {
    this.config = {
      ...this.config,
      ...config
    };
		this.border = this.config.border || '10px';
		this.cardwidth = this.config.cardwidth || '70px';
		this.cardheight = this.config.cardheight || '35px';
		this.style.setProperty('--title-font-size', this.config.titleFontSize || '20px'); 
    this._calculatePrice();
    if (config.color_num !== undefined) this.colorNum = config.color_num;
    if (config.color_cost !== undefined) this.colorCost = config.color_cost;
  }

  updated(changedProperties) {
    if (changedProperties.has('hass')) {
      this._calculatePrice();
      this._fetchData();
    }
  }

	_calculatePrice() {
		try {
			if (!this.hass || !this.config) {
				this._price = 0.5;
				return;
			}
			if (typeof this.config.price === 'number') {
				this._price = this.config.price;
				return;
			}
			if (typeof this.config.price === 'string') {
				const template = this.config.price.trim();
				if (template.startsWith('[[[') && template.endsWith(']]]')) {
					const jsCode = template.slice(3, -3).trim();
					try {
						const calculateFn = new Function('states', `
							try {
								${jsCode}
							} catch (e) {
								return 0.5;
							}
						`);
						const result = calculateFn(this.hass.states);
						this._price = Number(result) || 0.5;
					} catch (e) {
						this._price = 0.5;
					}
				} else {
					this._price = Number(template) || 0.5;
				}
				return;
			}
			this._price = 0.5;
		} catch (e) {
			this._price = 0.5;
		}
	}

  connectedCallback() {
    super.connectedCallback();
    this._fetchData();
    this._setupInterval();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  _setupInterval() {
    this._interval = setInterval(() => {
      this._fetchData();
    }, 60000);
  }

  async _fetchData() {
    if (!this.hass || !this.config.id) return;
    
    try {
      const entities = [
        'refresh_time', 'daily_lasted_date', 'balance',
        'daily_ele_num', 'month_ele_num', 'year_ele_num',
        'daily_p_ele_num', 'month_p_ele_num', 'year_p_ele_num',
        'daily_n_ele_num', 'month_n_ele_num', 'year_n_ele_num',
        'daily_v_ele_num', 'month_v_ele_num', 'year_v_ele_num',
				'last_month_ele_cost', 'last_month_ele_num'
      ];
      
      const data = {};
      
      for (const entity of entities) {
        const fullEntity = `sensor.state_grid_${this.config.id}_${entity}`;
        data[entity] = this.hass.states[fullEntity]?.state || 'N/A';
      }
      
      this._data = data;
    } catch (error) {
      console.error('获取数据出错:', error);
    }
  }

  _formatBalance(balance) {
    return balance >= 20 ? 
      `${balance}元` : 
      html`<span class="warning">${balance}元</span>`;
  }
  
  _formatCost(value) {
    const num = parseFloat(value) || 0;
    const rounded = Math.round(num * this._price * 10) / 10;
    return `${rounded}元`;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.config) return html``;
    
    const theme = this._evaluateTheme();
    const themeClass = theme === 'on' ? 'light-theme' : 'dark-theme';
    const itemThemeClass = theme === 'on' ? 'light' : 'dark';
    const showN = this.config.n_num !== 'none'; // 判断是否显示平用电
    const layoutClass = showN ? 'show-n' : 'hide-n'; // 根据是否显示平用电选择布局类
    
    return html`
      <div class="card-container ${themeClass} ${layoutClass}" 
			     style="height: ${this.config.height}; 
					 width: ${this.config.width};
					 --border-radius: ${this.border};
					 --card-width: ${this.cardwidth};
					 --card-height: ${this.cardheight}">
        <div class="title">${this.config.title || '电费信息'}</div>
        
        <div class="refresh-time">
          用电刷新时间: ${this._data.refresh_time || 'N/A'}
        </div>
        
        <div class="data-date">
          最新用电日期: ${this._data.daily_lasted_date || 'N/A'}
        </div>
        
        <div class="balance">
          ${this._renderDataItem(this.config.balance_name || '电费余额', 'mdi:cash', this._formatBalance(this._data.balance), itemThemeClass, null, this.colorCost)}
        </div>
        
        ${this._renderDataItem('日总用电', 'mdi:lightning-bolt', `${this._data.daily_ele_num || '0'}°`, itemThemeClass, '日总用电', this.colorNum)}
        ${this._renderDataItem('日峰用电', 'mdi:lightning-bolt', `${this._data.daily_p_ele_num || '0'}°`, itemThemeClass, '日峰用电', this.colorNum)}
        ${showN ? this._renderDataItem('日平用电', 'mdi:lightning-bolt', `${this._data.daily_n_ele_num || '0'}°`, itemThemeClass, '日平用电', this.colorNum) : ''}
        ${this._renderDataItem('日谷用电', 'mdi:lightning-bolt', `${this._data.daily_v_ele_num || '0'}°`, itemThemeClass, '日谷用电', this.colorNum)}
        ${this._renderDataItem('日用电费', 'mdi:cash', this._formatCost(this._data.daily_ele_num), itemThemeClass, '日用电费', this.colorCost)}
        
        ${this._renderDataItem('月总用电', 'mdi:lightning-bolt', `${this._data.month_ele_num || '0'}°`, itemThemeClass, '月总用电', this.colorNum)}
        ${this._renderDataItem('月峰用电', 'mdi:lightning-bolt', `${this._data.month_p_ele_num || '0'}°`, itemThemeClass, '月峰用电', this.colorNum)}
        ${showN ? this._renderDataItem('月平用电', 'mdi:lightning-bolt', `${this._data.month_n_ele_num || '0'}°`, itemThemeClass, '月平用电', this.colorNum) : ''}
        ${this._renderDataItem('月谷用电', 'mdi:lightning-bolt', `${this._data.month_v_ele_num || '0'}°`, itemThemeClass, '月谷用电', this.colorNum)}
        ${this._renderDataItem('月用电费', 'mdi:cash', this._formatCost(this._data.month_ele_num), itemThemeClass, '月用电费', this.colorCost)}

        ${this._renderDataItem('上月总用电', 'mdi:lightning-bolt', `${this._data.last_month_ele_num || '0'}°`, itemThemeClass, '上月总用电', this.colorNum)}
        ${this._renderDataItem('上月峰用电', 'mdi:lightning-bolt', `${this._data.last_month_p_ele_num || '0'}°`, itemThemeClass, '上月峰用电', this.colorNum)}
        ${showN ? this._renderDataItem('上月平用电', 'mdi:lightning-bolt', `${this._data.last_month_n_ele_num || '0'}°`, itemThemeClass, '上月平用电', this.colorNum) : ''}
        ${this._renderDataItem('上月谷用电', 'mdi:lightning-bolt', `${this._data.last_month_v_ele_num || '0'}°`, itemThemeClass, '上月谷用电', this.colorNum)}
        ${this._renderDataItem('上月用电费', 'mdi:cash', `${this._data.last_month_ele_cost || '0'}元`, itemThemeClass, '上月用电费', this.colorCost)}
        
        ${this._renderDataItem('年总用电', 'mdi:lightning-bolt', `${this._data.year_ele_num || '0'}°`, itemThemeClass, '年总用电', this.colorNum)}
        ${this._renderDataItem('年峰用电', 'mdi:lightning-bolt', `${this._data.year_p_ele_num || '0'}°`, itemThemeClass, '年峰用电', this.colorNum)}
        ${showN ? this._renderDataItem('年平用电', 'mdi:lightning-bolt', `${this._data.year_n_ele_num || '0'}°`, itemThemeClass, '年平用电', this.colorNum) : ''}
        ${this._renderDataItem('年谷用电', 'mdi:lightning-bolt', `${this._data.year_v_ele_num || '0'}°`, itemThemeClass, '年谷用电', this.colorNum)}
        ${this._renderDataItem('年用电费', 'mdi:cash',this._formatCost(this._data.year_ele_num), itemThemeClass, '年用电费', this.colorCost)}
      </div>
    `;
  }

  _renderDataItem(name, icon, value, themeClass, gridArea, color) {
    return html`
      <div class="data-item ${themeClass}" style="${gridArea ? `grid-area: ${gridArea}` : ''}">
        ${icon ? html`
          <div class="data-item-content">
            <ha-icon class="data-item-icon" .icon=${icon} style="color: ${color}"></ha-icon>
            <div class="data-item-text">
              <div class="data-item-name">${name}</div>
              <div class="data-item-value" style="color: ${color}">${value}</div>
            </div>
          </div>
        ` : html`
          <div class="data-item-text">
            <div class="data-item-name">${name}</div>
            <div class="data-item-value" style="color: ${color}">${value}</div>
          </div>
        `}
      </div>
    `;
  }
}
customElements.define('xiaoshi-state-grid-hassbox', XiaoshiStateGridHassbox);

class XiaoshiLunar extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      width: { type: String, attribute: true },
      height: { type: String, attribute: true },
      year: { type: Number },
      month: { type: Number },
      activeNav: { type: String },
      theme: { type: String },
      config: { type: Object },
      selectedDate: { type: String },
      dateEntity: { type: String },
      lunarEntity: { type: String },
      lunarData: { type: Array },
      todayDate: { type: String },
      birthdays: { type: Array },
      solarFestivals: { type: Array },
      lunarFestivals: { type: Array },
      solarTerms: { type: Array },
      lunarDaysData: { type: Array },
      holidays: { type: Array }
    };
  }
  
  setConfig(config) {
    this.config = config;
    if (config) {
      if (config.width !== undefined) this.width = config.width;
      if (config.height !== undefined) this.height = config.height;
      if (config.year !== undefined) this.year = config.year;
      if (config.month !== undefined) this.month = config.month;
      this.dateEntity = config.date || 'text.lunar_date';
      this.lunarEntity = config.lunar || 'sensor.lunar';
      this.requestUpdate();
    }
  }

  constructor() {
    super();
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.day = today.getDate();
    this.width = '100%';
    this.height = '260px';
    this.theme = 'on';
    this.activeNav = '';
    this.todayDate = `${today.getFullYear()}-${this.pad(today.getMonth() + 1)}-${this.pad(today.getDate())}`;
    this.selectedDate = this.todayDate;
    this.dateEntity = 'text.lunar_date';
    this.lunarEntity = 'sensor.lunar';
    this.lunarData = [];
    this.birthdays = [];
    this.solarFestivals = [];
    this.lunarFestivals = [];
    this.solarTerms = [];
    this.lunarDaysData = [];
    this.holidays = [];
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      
      .calendar-grid {
        border-radius: 10px;
        display: grid;
        grid-template-areas:
          "yearlast year yearnext today monthlast month monthnext"
          "week1 week2 week3 week4 week5 week6 week7" 
          "id1 id2 id3 id4 id5 id6 id7" 
          "id8 id9 id10 id11 id12 id13 id14" 
          "id15 id16 id17 id18 id19 id20 id21" 
          "id22 id23 id24 id25 id26 id27 id28" 
          "id29 id30 id31 id32 id33 id34 id35" 
          "id36 id37 id38 id39 id40 id41 id42";
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: 1fr 0.6fr 1fr 1fr 1fr 1fr 1fr 1fr;
        gap: 1px;
        padding: 2px;
        --current-month-color: inherit;
        --other-month-color: rgb(160,160,160,0.5);
				user-select: none; /* 禁止文本选择 */
				-webkit-user-select: none; /* Safari兼容 */
				-moz-user-select: none; /* Firefox兼容 */
				-ms-user-select: none; /* IE10+/Edge兼容 */
				margin-bottom: -3px;
      }

      .celltotal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0;
        cursor: default;
        font-size: 15px;
        font-weight: 600;
				white-space: nowrap;
      }

      .cell {
        position: relative; /* 添加相对定位 */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0;
        cursor: default;
        font-size: 12px;
        line-height: 12px;
        font-weight: 500;
        height: 100%; /* 确保高度填满 */
      }

			/* 禁用默认触摸高亮并设置点击反馈 */
			.cell {
				-webkit-tap-highlight-color: transparent;
				tap-highlight-color: transparent;
			}
			
			/* 日期点击反馈效果 - 桌面和移动端统一 */
			.cell:active .selected-day:not(.selected-today),
			.cell.touched .selected-day:not(.selected-today) {
				border-radius: 10px;
			}

      .nav-button {
        cursor: pointer;
        user-select: none;
        font-size: 12px;
        transition: all 0.5s ease;
        border-radius: 10px;
      }
      
      .nav-button:active {
        transform: scale(0.95);
        opacity: 0.8;
        border-radius: 10px;
      }
      
      .active-nav {
        border-radius: 10px;
        transition: all 0.5s ease;
      }
      
      .today-button {
        cursor: pointer;
        user-select: none;
        transition: all 0.5s ease;
				border-radius: 10px;
      }
			
			/* 禁用默认的触摸高亮效果 */
			.nav-button, .today-button {
				-webkit-tap-highlight-color: transparent;
				tap-highlight-color: transparent;
			}
			
			/* 确保激活状态也有圆角 */
			.nav-button:active, .today-button:active,
			.nav-button.active-nav, .today-button.active-nav {
				border-radius: 10px !important;
				background-color: rgba(0, 160, 160, 0.2) !important;
			}

      .weekday {
        font-size: 13px;
        font-weight: bold;
      }
      
      .month-day {
        cursor: pointer;
        color: var(--current-month-color);
      }

      .month-day .lunar-day {
        color: var(--current-month-color);
      }

      .prev-month-day, .next-month-day {
        color: var(--other-month-color);
      }

      .prev-month-day .lunar-day,
      .next-month-day .lunar-day {
        color: var(--other-month-color);
      }

      .birthday-current,
      .festival-current,
      .solar-term-current {
        color: inherit !important;
      }

      .selected-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
      
      .selected-today {
        background-color: #00a0a0;
        color: white;
      }
      
      .selected-other {
        border: 2px solid #00a0a0;
      }
      
      .today-not-selected {
        color: #00a0a0;
        font-weight: 800;
      }
      
      .lunar-day {
        font-size: 10px;
        margin-top: 2px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 90%;
      }
      
      .selected-day .lunar-day {
        color: inherit;
      }
      
      .birthday-current {
        color: rgb(255, 70, 0) !important;
      }
      
      .birthday-other {
        color: rgb(255, 140, 50, 0.6) !important;
      }
      
      .festival-current {
        color: rgb(0, 191, 255) !important;
      }
      
      .festival-other {
        color: rgb(0, 150, 200, 0.6) !important;
      }
      
      .solar-term-current {
        color: rgb(50, 220, 80) !important;
      }
      
      .solar-term-other {
        color: rgb(104, 192, 104, 0.6) !important;
      }

      .holiday-work {
        background-color: rgba(10, 200, 20, 0.1);
        border-radius: 10px;
      }
      
      .holiday-rest {
        background-color: rgba(255, 0, 0, 0.1);
        border-radius: 10px;
      }
      
      .holiday-label {
        position: absolute;
        top: 2px;
        left: 2px;
        font-size: 10px;
        font-weight: bold;
        z-index: 1;
        border-radius: 2px;
        padding: 0 2px;
        line-height: 1.2;
      }
      
      .holiday-work .holiday-label {
        color: rgb(10, 200, 20);
      }
      
      .holiday-rest .holiday-label {
        color: rgb(255, 0, 0);
      }
      
      .info-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        justify-content: center; /* 垂直居中 */
      }
      
      .selected-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has('hass') && this.hass) {
      this.updateLunarData();
    }
  }

  updateLunarData() {
    if (this.hass && this.hass.states[this.lunarEntity]) {
      const lunarState = this.hass.states[this.lunarEntity];
      
      if (lunarState.attributes) {
        this.lunarData = lunarState.attributes.lunar_label || [];
        this.birthdays = lunarState.attributes.shengri || [];
        this.solarFestivals = lunarState.attributes.jieri_label_solar || [];
        this.lunarFestivals = lunarState.attributes.jieri_label_lunar || [];
        this.solarTerms = lunarState.attributes.jieqi_label || [];
        this.lunarDaysData = lunarState.attributes.lunarday_num || [];
        this.holidays = lunarState.attributes.jiaqi_label || [];
      }
      
      this.requestUpdate();
    }
  }

  getDisplayInfo(index, isCurrentMonth) {
    const result = {
      displayText: '',
      className: '',
      holidayInfo: null,
      holidayLabel: ''
    };
    
    // 1. 检查节假日 (独立显示)
    const holiday = this.checkHoliday(index);
    if (holiday) {
      result.holidayInfo = holiday;
      result.className = holiday.className;
      result.holidayLabel = holiday.label;
    }
    
    // 2. 检查生日
    const birthday = this.checkBirthday(index);
    if (birthday) {
      result.displayText = birthday.name;
      result.className += isCurrentMonth ? ' birthday-current' : ' birthday-other';
      return result;
    }
    
    // 3. 检查阳历节日
    const solarFestival = this.checkSolarFestival(index);
    if (solarFestival) {
      result.displayText = solarFestival;
      result.className += isCurrentMonth ? ' festival-current' : ' festival-other';
      return result;
    }
    
    // 4. 检查农历节日
    const lunarFestival = this.checkLunarFestival(index);
    if (lunarFestival) {
      result.displayText = lunarFestival;
      result.className += isCurrentMonth ? ' festival-current' : ' festival-other';
      return result;
    }
    
    // 5. 检查节气
    const solarTerm = this.checkSolarTerm(index);
    if (solarTerm) {
      result.displayText = solarTerm;
      result.className += isCurrentMonth ? ' solar-term-current' : ' solar-term-other';
      return result;
    }
    
    // 6. 默认显示农历信息
    result.displayText = this.getLunarDay(index);
    return result;
  }

  checkHoliday(index) {
    if (!this.holidays || this.holidays.length <= index) return null;
    
    const holiday = this.holidays[index];
    if (holiday === true) {
      return { className: 'holiday-work', label: '班' };
    } else if (holiday === false) {
      return { className: 'holiday-rest', label: '休' };
    }
    return null;
  }

	getDateForCellIndex(index) {
		const firstDayOfMonth = new Date(this.year, this.month - 1, 1).getDay();
		const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
		
		// 上个月日期
		if (index < adjustedFirstDay) {
			const prevMonth = this.month === 1 ? 12 : this.month - 1;
			const prevYear = this.month === 1 ? this.year - 1 : this.year;
			const daysInPrevMonth = this.getDaysInMonth(prevYear, prevMonth);
			const day = daysInPrevMonth - (adjustedFirstDay - index - 1);
			return `${prevYear}-${this.pad(prevMonth)}-${this.pad(day)}`;
		}
		
		// 当月日期
		const dayInMonth = index - adjustedFirstDay + 1;
		const daysInMonth = this.getDaysInMonth(this.year, this.month);
		if (dayInMonth <= daysInMonth) {
			return `${this.year}-${this.pad(this.month)}-${this.pad(dayInMonth)}`;
		}
		
		// 下个月日期
		const nextMonth = this.month === 12 ? 1 : this.month + 1;
		const nextYear = this.month === 12 ? this.year + 1 : this.year;
		const day = dayInMonth - daysInMonth;
		return `${nextYear}-${this.pad(nextMonth)}-${this.pad(day)}`;
	}

	checkBirthday(index) {
		if (!this.birthdays || this.birthdays.length === 0) return null;
		if (!this.lunarDaysData || this.lunarDaysData.length <= index) return null;
		
		// 获取当前单元格对应的实际日期
		const date = this.getDateForCellIndex(index);
		if (!date) return null;

		const [year, month, day] = date.split('-').map(Number);

		for (const birthday of this.birthdays) {
			// 检查阳历生日
			if (birthday.阳历) {
				const birthDateStr = birthday.阳历.padStart(4, '0');
				const birthMonth = parseInt(birthDateStr.substring(0, 2));
				const birthDay = parseInt(birthDateStr.substring(2));

				// 处理2月29日特殊情况
				if (birthMonth === 2 && birthDay === 29) {
					const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
					
					// 闰年精确匹配
					if (isLeapYear && month === 2 && day === 29) {
						return { name: birthday.名称 };
					}
					// 平年在2月28日显示
					if (!isLeapYear && month === 2 && day === 28) {
						return { name: birthday.名称 };
					}
					continue;
				}

				// 普通日期精确匹配
				if (month === birthMonth && day === birthDay) {
					return { name: birthday.名称 };
				}
			}
			
			// 农历生日检查保持不变
			if (birthday.农历) {
				const lunarDayData = this.lunarDaysData[index];
				if (!lunarDayData || lunarDayData.length !== 6) continue;
				
				const lunarMonth = lunarDayData.substring(0, 2);
				const lunarDay = lunarDayData.substring(2, 4);
				const totalDays = parseInt(lunarDayData.substring(4));
				
				const birthMonth = birthday.农历.substring(0, 2).padStart(2, '0');
				const birthDay = birthday.农历.substring(2).padStart(2, '0');
				const birthDayNum = parseInt(birthDay);
				
				if (birthMonth !== lunarMonth) continue;
				
				if (birthDayNum > totalDays && lunarDay === totalDays.toString().padStart(2, '0')) {
					return { name: birthday.名称 };
				}
				
				if (birthDay === lunarDay) {
					return { name: birthday.名称 };
				}
			}
		}
		
		return null;
	}

  checkSolarFestival(index) {
    if (!this.solarFestivals || this.solarFestivals.length <= index) return null;
    let festival = this.solarFestivals[index];
    
    if (!festival || festival === 'null' || festival === 'false' || festival === '') {
      return null;
    }
    
    // 特殊节日名称处理
    if (festival === '全国中小学生安全教育日') {
      return '安全教育日';
    } else if (festival === '全民国防教育日') {
      return '国防教育日';
    } else if (festival === '消费者权益日') {
      return '消费者日';
    }
    
    return festival;
  }

  checkLunarFestival(index) {
    if (!this.lunarFestivals || this.lunarFestivals.length <= index) return null;
    const festival = this.lunarFestivals[index];
    return festival && festival !== 'null' && festival !== 'false' && festival !== '' ? festival : null;
  }

  checkSolarTerm(index) {
    if (!this.solarTerms || this.solarTerms.length <= index) return null;
    const term = this.solarTerms[index];
    return term && term !== 'null' && term !== 'false' && term !== '' ? term : null;
  }

  getLunarDay(index) {
    if (!this.lunarData || this.lunarData.length <= index) return '';
    const lunarDate = this.lunarData[index];
    if (lunarDate.startsWith('闰')) {
      return lunarDate.includes('初一') ? lunarDate.substring(0, 3) : lunarDate.substring(3, 5);
    } else {
      return lunarDate.includes('初一') ? lunarDate.substring(0, 2) : lunarDate.substring(2, 4);
    }
  }

	renderDayCell(index, day, isCurrentMonth, isToday, isSelected, onClick) {
		// 获取当前单元格对应的实际日期
		const date = this.getDateForCellIndex(index);
		const [year, month, dayNum] = date.split('-').map(Number);
		
		// 正确判断是否是当前月
		const isActuallyCurrentMonth = (month === this.month && year === this.year);
		
		const { displayText, className, holidayInfo, holidayLabel } = this.getDisplayInfo(index, isActuallyCurrentMonth);
		
		// 确定单元格的月份类别
		const monthClass = isActuallyCurrentMonth ? 'month-day' : (day > 15 ? 'prev-month-day' : 'next-month-day');
		
		return html`
			<div class="cell ${monthClass} ${isToday && !isSelected ? 'today-not-selected' : ''} ${className}" 
					 style="grid-area: id${index + 1};" 
					 @click=${onClick}>
				${holidayInfo ? html`<div class="holiday-label">${holidayLabel}</div>` : ''}
				<div class="info-container">
					<div class="selected-day ${isSelected ? (isToday ? 'selected-today' : 'selected-other') : ''}">
						${day}
						<div class="lunar-day">${displayText}</div>
					</div>
				</div>
			</div>
		`;
	}
	
  render() {
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';

    const daysInMonth = this.getDaysInMonth(this.year, this.month);
    const firstDayOfMonth = new Date(this.year, this.month - 1, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const prevMonth = this.month === 1 ? 12 : this.month - 1;
    const prevYear = this.month === 1 ? this.year - 1 : this.year;
    const daysInPrevMonth = this.getDaysInMonth(prevYear, prevMonth);
    const prevMonthDays = [];
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      prevMonthDays.push(daysInPrevMonth - i);
    }

    const nextMonth = this.month === 12 ? 1 : this.month + 1;
    const nextYear = this.month === 12 ? this.year + 1 : this.year;
    const daysInNextMonth = this.getDaysInMonth(nextYear, nextMonth);
    const nextMonthDays = [];
    const totalCells = 42;
    const remainingCells = totalCells - adjustedFirstDay - daysInMonth;
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push(i);
    }

    const days = [];
    const weekdayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

		const yearMonthRow = html` 
		<div class="celltotal nav-button ${this.activeNav === 'yearlast' ? 'active-nav' : ''}" 
				 style="grid-area: yearlast;" 
				 @click=${this.prevYear}
				 @mousedown=${() => this.activeNav = 'yearlast'}
				 @mouseup=${() => this.activeNav = ''}
				 @mouseleave=${() => this.activeNav = ''}>◀</div>
		<div class="celltotal" style="grid-area: year;">${this.year+"年"}</div>
		<div class="celltotal nav-button ${this.activeNav === 'yearnext' ? 'active-nav' : ''}" 
				 style="grid-area: yearnext;" 
				 @click=${this.nextYear}
				 @mousedown=${() => this.activeNav = 'yearnext'}
				 @mouseup=${() => this.activeNav = ''}
				 @mouseleave=${() => this.activeNav = ''}>▶</div>
		<div class="celltotal today-button ${this.activeNav === 'today' ? 'active-nav' : ''}" 
				 style="grid-area: today;" 
				 @click=${this.goToToday}
				 @mousedown=${() => this.activeNav = 'today'}
				 @mouseup=${() => this.activeNav = ''}
				 @mouseleave=${() => this.activeNav = ''}>今天</div>
		<div class="celltotal nav-button ${this.activeNav === 'monthlast' ? 'active-nav' : ''}" 
				 style="grid-area: monthlast;" 
				 @click=${this.prevMonth}
				 @mousedown=${() => this.activeNav = 'monthlast'}
				 @mouseup=${() => this.activeNav = ''}
				 @mouseleave=${() => this.activeNav = ''}>◀</div>
		<div class="celltotal" style="grid-area: month;">${this.month+"月"}</div>
		<div class="celltotal nav-button ${this.activeNav === 'monthnext' ? 'active-nav' : ''}" 
				 style="grid-area: monthnext;" 
				 @click=${this.nextMonth}
				 @mousedown=${() => this.activeNav = 'monthnext'}
				 @mouseup=${() => this.activeNav = ''}
				 @mouseleave=${() => this.activeNav = ''}>▶</div>
	`;

    const weekdaysRow = weekdayNames.map((day, index) => 
      html`<div class="celltotal weekday" style="grid-area: week${index + 1};">${day}</div>`
    );

    let cellIndex = 0;
    
    // 上个月的日期
    prevMonthDays.forEach(day => {
      const currentDate = `${prevYear}-${this.pad(prevMonth)}-${this.pad(day)}`;
      const isToday = currentDate === this.todayDate;
      const isSelected = currentDate === this.selectedDate;
      
      days.push(this.renderDayCell(
        cellIndex, 
        day, 
        false, 
        isToday, 
        isSelected, 
        () => this.handlePrevMonthDayClick(day)
      ));
      cellIndex++;
    });

    // 当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = `${this.year}-${this.pad(this.month)}-${this.pad(day)}`;
      const isToday = currentDate === this.todayDate;
      const isSelected = currentDate === this.selectedDate;
      
      days.push(this.renderDayCell(
        cellIndex, 
        day, 
        true, 
        isToday, 
        isSelected, 
        () => this.selectDate(day)
      ));
      cellIndex++;
    }

    // 下个月的日期
    nextMonthDays.forEach(day => {
      const currentDate = `${nextYear}-${this.pad(nextMonth)}-${this.pad(day)}`;
      const isToday = currentDate === this.todayDate;
      const isSelected = currentDate === this.selectedDate;
      
      days.push(this.renderDayCell(
        cellIndex, 
        day, 
        false, 
        isToday, 
        isSelected, 
        () => this.handleNextMonthDayClick(day)
      ));
      cellIndex++;
    });
    
    return html`
      <div class="calendar-grid" 
           style="width: ${this.width}; height: ${this.height}; 
                  background-color: ${bgColor}; color: ${fgColor};">
        ${yearMonthRow}
        ${weekdaysRow}
        ${days}
      </div>
    `;
  }

  handlePrevMonthDayClick(day) {
    const prevMonth = this.month === 1 ? 12 : this.month - 1;
    const prevYear = this.month === 1 ? this.year - 1 : this.year;
    this.year = prevYear;
    this.month = prevMonth;
    this.selectDate(day);
  }

  handleNextMonthDayClick(day) {
    const nextMonth = this.month === 12 ? 1 : this.month + 1;
    const nextYear = this.month === 12 ? this.year + 1 : this.year;
    this.year = nextYear;
    this.month = nextMonth;
    this.selectDate(day);
  }

  selectDate(day) {
    this.selectedDate = `${this.year}-${this.pad(this.month)}-${this.pad(day)}`;
    this.updateDateEntity();
    this.requestUpdate();
  }

  pad(num) {
    return num < 10 ? `0${num}` : num;
  }

  firstUpdated() {
    super.firstUpdated();
    // 首次更新后执行一次日期更新
    this.updateDateEntity();
  }

  updateDateEntity() {
    if (this.hass && this.dateEntity && this.selectedDate) {
      this.hass.callService('text', 'set_value', {
        entity_id: this.dateEntity,
        value: this.selectedDate
      });
    }
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  prevYear() {
    this.year--;
    this.updateSelectedDate();
    this.requestUpdate();
  }

  nextYear() {
    this.year++;
    this.updateSelectedDate();
    this.requestUpdate();
  }

  prevMonth() {
    if (this.month === 1) {
      this.month = 12;
      this.year--;
    } else {
      this.month--;
    }
    this.updateSelectedDate();
    this.requestUpdate();
  }

  nextMonth() {
    if (this.month === 12) {
      this.month = 1;
      this.year++;
    } else {
      this.month++;
    }
    this.updateSelectedDate();
    this.requestUpdate();
  }

  goToToday() {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.day = today.getDate();
    this.selectedDate = `${this.year}-${this.pad(this.month)}-${this.pad(this.day)}`;
    this.updateDateEntity();
    this.requestUpdate();
  }

  updateSelectedDate() {
    if (!this.selectedDate) {
      this.selectedDate = `${this.year}-${this.pad(this.month)}-01`;
      this.updateDateEntity();
      return;
    }
    
    const [_, __, originalDay] = this.selectedDate.split('-').map(Number);
    const daysInMonth = this.getDaysInMonth(this.year, this.month);
    const day = Math.min(originalDay, daysInMonth);
    
    this.selectedDate = `${this.year}-${this.pad(this.month)}-${this.pad(day)}`;
    this.updateDateEntity();
  }
}
customElements.define('xiaoshi-lunar', XiaoshiLunar); 

class XiaoshiLunarHead extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '60px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%';
    this.height = '60px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "gonglilabel gongli"
          "nonglilabel nongli";
        grid-template-columns: 15% 85%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
				margin-bottom: -3px;
      }
      .gongli-label, .nongli-label {
        font-size: 15px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gongli-label {
        grid-area: gonglilabel;
      }
      .nongli-label {
        grid-area: nonglilabel;
      }
      .gongli-data, .nongli-data {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .gongli-data {
        grid-area: gongli;
      }
      .nongli-data {
        grid-area: nongli;
      }
      .date-diff {
        font-size: 10px;
        color: rgb(150,150,150);
				display: inline-flex;
				align-items: flex-end;
				padding-top: 2px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes;

    // 公历信息
    const solarDate = lunarData.tap_solar?.日期B || '';
    const nowSolarDate = lunarData.now_solar?.日期B || '';
    const weekDay = lunarData.tap_solar?.星期A || '';
    const zodiac = this.getZodiacWithSymbol(lunarData.tap_solar?.星座 || '');
    const dateDiff = this.calculateDateDiff(solarDate, nowSolarDate);

    // 农历信息
    const lunarYear = lunarData.tap_lunar?.年 || '';
    const lunarDate = lunarData.tap_lunar?.日期 || '';
    const season = lunarData.huangli?.季节 || '';
    const moonPhase = this.getMoonPhaseWithSymbol(lunarData.huangli?.月相 || '');

    return html`
      <div class="calendar" style="${style}">
        <div class="gongli-label">公历</div>
        <div class="gongli-data">
          ${solarDate}&ensp;
          ${dateDiff ? html`<span class="date-diff">${dateDiff}</span>` : ''}&ensp;
          ${weekDay}&emsp;${zodiac}
        </div>
        
        <div class="nongli-label">农历</div>
        <div class="nongli-data">
          ${lunarYear}&emsp;${lunarDate}&emsp;${season}&emsp;${moonPhase}
        </div>
      </div>
    `;
  }

  calculateDateDiff(tapDate, nowDate) {
    if (!tapDate || !nowDate) return '';
    
    const tapDateTime = new Date(`${tapDate}T00:00:00`);
    const nowDateTime = new Date(`${nowDate}T00:00:00`);
    const diffTime = tapDateTime.getTime() - nowDateTime.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
    
    if (diffDays === 0) return '';
    if (diffDays > 0) return `(${diffDays}天后)`;
    return `(${Math.abs(diffDays)}天前)`;
  }

  getZodiacWithSymbol(zodiac) {
    const zodiacSymbols = {
      '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
      '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
      '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓'
    };
    return zodiac + (zodiacSymbols[zodiac] || '');
  }

  getMoonPhaseWithSymbol(moonPhase) {
    const moonPhaseSymbols = {
      '朔月': '🌑', '既朔月': '🌑', '蛾眉新月': '🌒', '蛾眉月': '🌒',
      '夕月': '🌓', '上弦月': '🌓', '九夜月': '🌓', '宵月': '🌔',
      '渐盈凸月': '🌔', '小望月': '🌕', '望月': '🌕', '既望月': '🌕',
      '立待月': '🌖', '居待月': '🌖', '寝待月': '🌖', '更待月': '🌖',
      '渐亏凸月': '🌗', '下弦月': '🌗', '有明月': '🌗', '蛾眉残月': '🌘',
      '残月': '🌘', '晓月': '🌑', '晦月': '🌑'
    };
    return moonPhase + (moonPhaseSymbols[moonPhase] || '');
  }
}
customElements.define('xiaoshi-lunar-head', XiaoshiLunarHead);

class XiaoshiLunarBody1 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on'; 
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%';
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a0 a1 a2 a3 a4 a5 a6 a7 a8 a9 a10 a11 a12"
          "b0 b1 b2 b3 b4 b5 b6 b7 b8 b9 b10 b11 b12";
        grid-template-columns: repeat(13, minmax(0, 1fr));
        grid-template-rows: 65% 35%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .time-cell {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        text-align: center;
        font-size: 13px;
				white-space: nowrap;
				overflow: visible;
				display: flex;
				width: 100%;
				height: 100%;
				justify-content: center;
				align-items: center;
      }
      .luck-cell {
        text-align: center;
        font-size: 13px;
				width: 100%;
				height: 100%;
				min-width: 0; 
				justify-content: center;
				align-items: center;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes;
    const nowDate = lunarData.now_solar?.日期B || '';
    const selectedDate = lunarData.tap_solar?.日期B || '';
    const isCurrentDay = nowDate === selectedDate;
    
    // 获取当前时间信息
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    
    // 特殊处理子时（23:00-1:00）
    let currentShichenIndex = -1;
    if (isCurrentDay) {
      if (hour === 23 || (hour === 0 && minutes < 60)) {
        // 子时特殊处理
        if (hour === 23) {
          currentShichenIndex = 0; // 当天最后一个时辰（a0）
        } else {
          currentShichenIndex = 12; // 次日第一个时辰（a12）
        }
      } else {
        // 正常时辰计算
        const tzArr = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
        const currentShichen = tzArr[(Math.floor((hour + 1) / 2)) % 12];
        // 找到当前时辰对应的index
        for (let i = 0; i < 13; i++) {
          const shichenGanzhi = lunarData.huangli.时辰干支[i] || '';
          const shichen = shichenGanzhi.slice(1, 2);
          if (shichen === currentShichen) {
            currentShichenIndex = i;
            break;
          }
        }
      }
    }

    // 渲染时辰干支
    const timeCells = [];
    for (let i = 0; i < 13; i++) {
      const shichenGanzhi = lunarData.huangli.时辰干支[i] || '';
      const isCurrent = i === currentShichenIndex;
      const cellStyle = isCurrent ? 'color: rgb(0,191,255);' : '';
      timeCells.push(html`
        <div class="time-cell" style="${cellStyle}">${shichenGanzhi}</div>
      `);
    }

    // 渲染时辰吉凶（保持不变）
    const luckCells = [];
    for (let i = 0; i < 13; i++) {
      const luck = lunarData.huangli.时辰吉凶[i] || '';
      const color = luck === '吉' ? 'rgb(50,250,50)' : 'rgb(255,0,0)';
      luckCells.push(html`
        <div class="luck-cell" style="color: ${color}">${luck}</div>
      `);
    }

    return html`
      <div class="calendar" style="${style}">
        ${timeCells.map((cell, index) => html`<div style="grid-area: a${index}">${cell}</div>`)}
        ${luckCells.map((cell, index) => html`<div style="grid-area: b${index}">${cell}</div>`)}
      </div>
    `;
  }
}
customElements.define('xiaoshi-lunar-body1', XiaoshiLunarBody1);

class XiaoshiLunarBody2 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%';
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1 b1"
					"a2 b2";
        grid-template-columns: 10% 90%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label1 {
        color: rgb(0,220,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
				font-size: 15px;
      }
      .label2 {
        color: rgb(255,0,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
				font-size: 15px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
				line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 40) return '13px';
    if (length <= 70) return '12px';
    if (length <= 100) return '11px';
    if (length <= 130) return '10px';
    return '9px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const label1 = lunarData.宜;
    const label2 = lunarData.忌;
    
    // 取两者中较长的文本长度来计算字体大小
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);

    return html`
      <div class="calendar" style="${style}">
				<div class="label1">宜</div>
				<div class="state" style="grid-area: b1; font-size: ${commonFontSize}">${label1}</div>
				<div class="label2">忌</div>
				<div class="state" style="grid-area: b2; font-size: ${commonFontSize}">${label2}</div>
      </div>
    `;
  }
}
customElements.define('xiaoshi-lunar-body2', XiaoshiLunarBody2);

class XiaoshiLunarBody3 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%';
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 b1"
          "a2 b2";
        grid-template-columns: 10% 90%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label1 {
        color: rgb(0,220,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
				font-size: 13px;
      }
      .label2 {
        color: rgb(255,0,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
				font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
				line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 40) return '13px';
    if (length <= 80) return '12px';
    if (length <= 120) return '11px';
    if (length <= 160) return '10px';
    return '9px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const label1 = lunarData.吉神;
    const label2 = lunarData.凶煞;
    
    // 取两者中较长的文本长度来计算字体大小
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);

    return html`
      <div class="calendar" style="${style}">
        <div class="label1">吉神</div>
        <div class="state" style="grid-area: b1; font-size: ${commonFontSize}">${label1}</div>
        <div class="label2">凶煞</div>
        <div class="state" style="grid-area: b2; font-size: ${commonFontSize}">${label2}</div>
      </div>
    `;
  }
}
customElements.define('xiaoshi-lunar-body3', XiaoshiLunarBody3);

class XiaoshiLunarBody4 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%';
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1 b1 a3 b3"
					"a2 b2 a4 b4";
        grid-template-columns: 10% 40% 10% 40%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(255,0,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
				font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
				font-size: 13px;
				line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

	render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const label1 = lunarData.彭祖干;
    const label2 = lunarData.彭祖支;
    const label3 = lunarData.相冲;
    const label4 = lunarData.岁煞;

    return html`
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">彭祖</div>
        <div class="state" style="grid-area: b1;">${label1}</div>
        <div class="label" style="grid-area: a2;">百忌</div>
        <div class="state" style="grid-area: b2;">${label2}</div>
        <div class="label" style="grid-area: a3;">相冲</div>
        <div class="state" style="grid-area: b3;">${label3}</div>
        <div class="label" style="grid-area: a4;">岁煞</div>
        <div class="state" style="grid-area: b4;">${label4}</div>
      </div>
    `;
  }
}
customElements.define('xiaoshi-lunar-body4', XiaoshiLunarBody4);

class XiaoshiLunarBody5 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1 b1 a3 b3"
					"a2 b2 a4 b4";
        grid-template-columns: 10% 40% 10% 40%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(0,220,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
				font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
				font-size: 13px;
				line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

	render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const label1 = lunarData.本月胎神 + " " + lunarData.今日胎神;
    const label2 = lunarData.物候;
    const label3 = lunarData.星宿;
    const label4 = lunarData.天神;

    return html`
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">胎神</div>
        <div class="state" style="grid-area: b1;">${label1}</div>
        <div class="label" style="grid-area: a2;">物候</div>
        <div class="state" style="grid-area: b2;">${label2}</div>
        <div class="label" style="grid-area: a3;">星宿</div>
        <div class="state" style="grid-area: b3;">${label3}</div>
        <div class="label" style="grid-area: a4;">天神</div>
        <div class="state" style="grid-area: b4;">${label4}</div>
      </div>
    `;
  }
}
customElements.define('xiaoshi-lunar-body5', XiaoshiLunarBody5);

class XiaoshiLunarBody6 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1 b1 a2 b2 b2 b2"
					"a3 b3 a4 b4 a5 b5";
        grid-template-columns: 10% 40% 10% 10% 20% 10%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(0,220,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
				font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
				font-size: 13px;
				line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

	render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const label1 = lunarData.九星;
    const label2 = lunarData.纳音.年 + " "+lunarData.纳音.月+" "+lunarData.纳音.日;
    const label3 = lunarData.日禄;
    const label4 = lunarData.六耀;
    const label5 = lunarData.值星;

    return html`
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">九星</div>
        <div class="state" style="grid-area: b1;">${label1}</div>
        <div class="label" style="grid-area: a2;">纳音</div>
        <div class="state" style="grid-area: b2;">${label2}</div>
        <div class="label" style="grid-area: a3;">日禄</div>
        <div class="state" style="grid-area: b3;">${label3}</div>
        <div class="label" style="grid-area: a4;">六耀</div>
        <div class="state" style="grid-area: b4;">${label4}</div>
        <div class="label" style="grid-area: a5;">十二建星</div>
        <div class="state" style="grid-area: b5;">${label5}</div>
      </div>
    `;
  }
}
customElements.define('xiaoshi-lunar-body6', XiaoshiLunarBody6);

class XiaoshiLunarBody7 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 a2 a3 a4 a5"
          "b1 b2 b3 b4 b5";
        grid-template-columns: 20% 20% 20% 20% 20%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(0,220,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
      .direction-container {
        display: flex;
        align-items: center;
        justify-content: center;
				--mdc-icon-size: 15px;
      }
      .direction-icon {
        transition: transform 0.3s ease;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _getRotationAngle(label) {
    if (!label) return "rotate(0deg)";
    if (label.includes("正北")) return "rotate(0deg)";
    if (label.includes("东北")) return "rotate(45deg)";
    if (label.includes("正东")) return "rotate(90deg)";
    if (label.includes("东南")) return "rotate(135deg)";
    if (label.includes("正南")) return "rotate(180deg)";
    if (label.includes("西南")) return "rotate(225deg)";
    if (label.includes("正西")) return "rotate(270deg)";
    if (label.includes("西北")) return "rotate(315deg)";
    return "rotate(0deg)";
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const label1 = lunarData.喜神;
    const label2 = lunarData.福神;
    const label3 = lunarData.财神;
    const label4 = lunarData.阳贵;
    const label5 = lunarData.阴贵;

    const renderDirection = (label) => html`
      <div class="direction-container">
        <ha-icon 
          class="direction-icon"
          icon="mdi:arrow-up-bold" 
          style="transform: ${this._getRotationAngle(label)};"
        ></ha-icon>
        ${label}
      </div>
    `;

    return html`
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">喜神</div>
        <div class="state" style="grid-area: b1;">${renderDirection(label1)}</div>
        <div class="label" style="grid-area: a2;">福神</div>
        <div class="state" style="grid-area: b2;">${renderDirection(label2)}</div>
        <div class="label" style="grid-area: a3;">财神</div>
        <div class="state" style="grid-area: b3;">${renderDirection(label3)}</div>
        <div class="label" style="grid-area: a4;">阳贵</div>
        <div class="state" style="grid-area: b4;">${renderDirection(label4)}</div>
        <div class="label" style="grid-area: a5;">阴贵</div>
        <div class="state" style="grid-area: b5;">${renderDirection(label5)}</div>
      </div>
    `;
  }
}
customElements.define('xiaoshi-lunar-body7', XiaoshiLunarBody7);

class XiaoshiLunarLeft1 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '90px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '90px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1 a2 a3"
					"b1 b2 b3"
					"c1 c2 c3";
        grid-template-columns: 33% 17% 50%;
        grid-template-rows: repeat(3, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const labela1 = lunarData.干支.年+"年";
    const labelb1 = lunarData.干支.月+"月";
    const labelc1 = lunarData.干支.日+"日";
    const labela2 = lunarData.生肖.年;
    const labelb2 = lunarData.生肖.月;
    const labelc2 = lunarData.生肖.日;
    const labela3 = lunarData.纳音.年;
    const labelb3 = lunarData.纳音.月;
    const labelc3 = lunarData.纳音.日;

    return html`
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">${labela1}</div>
        <div class="label" style="grid-area: b1;">${labelb1}</div>
        <div class="label" style="grid-area: c1;">${labelc1}</div>
        <div class="state" style="grid-area: a2;">${labela2}</div>
        <div class="state" style="grid-area: b2;">${labelb2}</div>
        <div class="state" style="grid-area: c2;">${labelc2}</div>
        <div class="state" style="grid-area: a3;">${labela3}</div>
        <div class="state" style="grid-area: b3;">${labelb3}</div>
        <div class="state" style="grid-area: c3;">${labelc3}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-left1', XiaoshiLunarLeft1);

class XiaoshiLunarRight1 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '90px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '90px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1 a2"
					"b1 b2"
					"c1 c2";
        grid-template-columns: 27% 73%;
        grid-template-rows: repeat(3, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const labela2 = lunarData.相冲;
    const labelb2 = lunarData.岁煞;
    const labelc2 = lunarData.天神;
 
    return html`
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">相冲</div>
        <div class="label" style="grid-area: b1;">岁煞</div>
        <div class="label" style="grid-area: c1;">天神</div>
        <div class="state" style="grid-area: a2;">${labela2}</div>
        <div class="state" style="grid-area: b2;">${labelb2}</div>
        <div class="state" style="grid-area: c2;">${labelc2}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-right1', XiaoshiLunarRight1);

class XiaoshiLunarLeft2 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '30px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '30px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1";
        grid-template-columns: 100%;
        grid-template-rows: 100%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes;
    const label = lunarData.jieqi.上一节气;

    return html`
      <div class="calendar" style="${style}">
        <div class="state" style="grid-area: a1;">${label}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-left2', XiaoshiLunarLeft2);

class XiaoshiLunarRight2 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '30px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '30px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1";
        grid-template-columns: 100%;
        grid-template-rows: 100%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height}; 
    `;

    const lunarData = this.hass.states[this.lunar].attributes;
    const label = lunarData.jieqi.下一节气;

    return html`
      <div class="calendar" style="${style}">
        <div class="state" style="grid-area: a1;">${label}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-right2', XiaoshiLunarRight2);

class XiaoshiLunarLeft3 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '120px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '120px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1"
					"b1";
        grid-template-columns: 100%;
        grid-template-rows: 15% 85%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
				place-items: center; 
      }

      .label{
        background: rgb(0,220,0);
				border-radius: 100%;
				color: rgb(255,255,255);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
				width: 25px;
				height: 25px;
        margin-top: 15px;
      }

      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 16px;
        padding: 0 5px 0 5px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 70) return '13px';
    if (length <= 100) return '12px';
    if (length <= 130) return '11px';
    return '10px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const label1 = lunarData.宜;
    const label2 = lunarData.忌;
 
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);

    return html` 
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">宜</div>
				<div class="state" style="grid-area: b1; font-size: ${commonFontSize}">${label1}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-left3', XiaoshiLunarLeft3); 

class XiaoshiLunarRight3 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '120px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '120px';
  }

  static get styles() { 
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1"
					"b1";
        grid-template-columns: 100%;
        grid-template-rows: 15% 85%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
				place-items: center; 
      }

      .label{
        background: rgb(200,20,0);
				border-radius: 100%;
				color: rgb(255,255,255);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
				width: 25px;
				height: 25px;
        margin-top: 15px;
      }

      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 16px;
        padding: 0 5px 0 5px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 70) return '13px'; 
    if (length <= 100) return '12px';
    if (length <= 130) return '11px';
    return '10px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const label1 = lunarData.宜;
    const label2 = lunarData.忌;
 
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);

    return html` 
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">忌</div>
				<div class="state" style="grid-area: b1; font-size: ${commonFontSize}">${label2}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-right3', XiaoshiLunarRight3); 

class XiaoshiLunarLeft4 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '120px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '120px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1"
					"b1";
        grid-template-columns: 100%;
        grid-template-rows: 15% 85%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
				place-items: center; 
      }

      .label{
        color: rgb(0,220,0); 
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        margin-top: 10px;
      }

      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 16px;
        padding: 0 5px 0 5px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 70) return '13px';
    if (length <= 100) return '12px';
    if (length <= 130) return '11px';
    return '10px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const label1 = lunarData.吉神;
    const label2 = lunarData.凶煞;
 
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);

    return html` 
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">吉神宜趋</div>
				<div class="state" style="grid-area: b1; font-size: ${commonFontSize}">${label1}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-left4', XiaoshiLunarLeft4); 

class XiaoshiLunarRight4 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '120px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '120px';
  }

  static get styles() { 
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1"
					"b1";
        grid-template-columns: 100%;
        grid-template-rows: 15% 85%; 
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px; 
				place-items: center; 
      }

      .label{
        color: rgb(200,20,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        margin-top: 10px;
      }

      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 16px;
        padding: 0 5px 0 5px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 70) return '13px'; 
    if (length <= 100) return '12px';
    if (length <= 130) return '11px';
    return '10px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const label1 = lunarData.吉神;
    const label2 = lunarData.凶煞;
 
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);

    return html` 
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">凶煞宜忌</div>
				<div class="state" style="grid-area: b1; font-size: ${commonFontSize}">${label2}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-right4', XiaoshiLunarRight4); 

class XiaoshiLunarLeft5 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '60px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '60px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1 a2"
					"b1 b2";
        grid-template-columns: 27% 73%;
        grid-template-rows: repeat(2, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const labela2 = lunarData.彭祖干;
    const labelb2 = lunarData.彭祖支;
 
    return html`
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">彭祖</div>
        <div class="label" style="grid-area: b1;">百忌</div>
        <div class="state" style="grid-area: a2;">${labela2}</div>
        <div class="state" style="grid-area: b2;">${labelb2}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-left5', XiaoshiLunarLeft5);

class XiaoshiLunarRight5 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '60px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '60px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1 a2"
					"b1 b2";
        grid-template-columns: 38% 62%;
        grid-template-rows: repeat(2, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const labela2 = lunarData.本月胎神;
    const labelb2 = lunarData.今日胎神;
 
    return html`
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">本月胎神</div>
        <div class="label" style="grid-area: b1;">今日胎神</div>
        <div class="state" style="grid-area: a2;">${labela2}</div>
        <div class="state" style="grid-area: b2;">${labelb2}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-right5', XiaoshiLunarRight5);

class XiaoshiLunarLeft6 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '60px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '60px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1 a2"
					"b1 b2";
        grid-template-columns: 27% 73%;
        grid-template-rows: repeat(2, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const labela2 = lunarData.日禄;
    const labelb2 = lunarData.物候;
 
    return html`
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">日禄</div>
        <div class="label" style="grid-area: b1;">物候</div>
        <div class="state" style="grid-area: a2;">${labela2}</div>
        <div class="state" style="grid-area: b2;">${labelb2}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-left6', XiaoshiLunarLeft6);

class XiaoshiLunarRight6 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '60px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '60px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
					"a1 a2"
					"b1 b2";
        grid-template-columns: 27% 73%;
        grid-template-rows: repeat(2, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div class="calendar">加载中...</div>`;
    }

    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;

    const lunarData = this.hass.states[this.lunar].attributes.huangli;
    const labela2 = lunarData.九星;
    const labelb2 = lunarData.星宿;
 
    return html`
      <div class="calendar" style="${style}">
        <div class="label" style="grid-area: a1;">九星</div>
        <div class="label" style="grid-area: b1;">星宿</div>
        <div class="state" style="grid-area: a2;">${labela2}</div>
        <div class="state" style="grid-area: b2;">${labelb2}</div>
      </div>
    `;
  }
} 
customElements.define('xiaoshi-lunar-right6', XiaoshiLunarRight6);

class XiaoshiLunarPhone extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      selectedDate: { type: String },
      todayDate: { type: String }
    };
  }

  setConfig(config) {
    // 创建一个新的配置对象而不是直接修改传入的config
    this.config = {
      lunar: config?.lunar || 'sensor.lunar',
      theme: config?.theme || 'on',
      width: config?.width || '100%',
      height: config?.height || '86vh', // 默认总高度
      date: config?.date || 'text.lunar_date',
      ...config // 保留其他可能传入的配置
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
      .card-container {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
    `;
  }

  render() {
    if (!this.hass) {
      return html`<div>Loading...</div>`;
    }
    const totalHeight = this.config.height;
    
    // 计算各部分高度 (按比例分配)
    const headHeight = '60px'; 
    const calendarHeight = '260px';
    const bodyHeight = `calc((${totalHeight} - 60px - 260px - ${7 * 6}px) / 7)`;
    
    return html`
      <div class="card-container" style="width: ${this.config.width};">
        <xiaoshi-lunar-head 
          .hass=${this.hass}
          .config=${this.config}
          .width=${this.config.width}
          .height=${headHeight}>
        </xiaoshi-lunar-head>
        
        <xiaoshi-lunar 
          .hass=${this.hass}
          .config=${this.config}
          .width=${this.config.width}
          .height=${calendarHeight}>
        </xiaoshi-lunar>
        
        <xiaoshi-lunar-body1 
          .hass=${this.hass}
          .config=${this.config}
          .width=${this.config.width}
          .height=${bodyHeight}>
        </xiaoshi-lunar-body1>
        
        <xiaoshi-lunar-body2 
          .hass=${this.hass}
          .config=${this.config}
          .width=${this.config.width}
          .height=${bodyHeight}>
        </xiaoshi-lunar-body2>
        
        <xiaoshi-lunar-body3 
          .hass=${this.hass}
          .config=${this.config}
          .width=${this.config.width}
          .height=${bodyHeight}>
        </xiaoshi-lunar-body3>
        
        <xiaoshi-lunar-body4 
          .hass=${this.hass}
          .config=${this.config}
          .width=${this.config.width}
          .height=${bodyHeight}>
        </xiaoshi-lunar-body4>
        
        <xiaoshi-lunar-body5 
          .hass=${this.hass}
          .config=${this.config}
          .width=${this.config.width}
          .height=${bodyHeight}>
        </xiaoshi-lunar-body5>
        
        <xiaoshi-lunar-body6 
          .hass=${this.hass}
          .config=${this.config}
          .width=${this.config.width}
          .height=${bodyHeight}>
        </xiaoshi-lunar-body6>
        
        <xiaoshi-lunar-body7 
          .hass=${this.hass}
          .config=${this.config}
          .width=${this.config.width}
          .height=${bodyHeight}>
        </xiaoshi-lunar-body7>
      </div>
    `;
  }
}
customElements.define('xiaoshi-lunar-phone', XiaoshiLunarPhone);

class XiaoshiLunarPad extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  setConfig(config) {
    this.config = {
      lunar: config?.lunar || 'sensor.lunar',
      theme: config?.theme || 'on',
      width: config?.width || '780px',
      height: config?.height || '540px',
      date: config?.date || 'text.lunar_date',
      ...config
    };
  }
 
  static get styles() {
    return css`
      :host {
        display: block;
      } 
      .grid-container {
        display: grid;
        grid-template-areas: 
          "left1 head  right1"
          "left1 lunar right1"            
          "left2 lunar right2"     
          "left3 lunar right3"    
          "left4 lunar right4"      
          "left5 body1 right5" 
          "left6 body7 right6";
        grid-template-columns: 180px 400px 180px;
        grid-template-rows: 60px 20px 30px 120px 120px 60px 60px;
        width: 760px;
        height: 540px;
        gap: 10px;
      } 
      .grid-item {
        display: flex;
        position: relative;
      }
      .left1 { grid-area: left1; height: 90px; }
      .right1 { grid-area: right1; height: 90px; }
      .head { grid-area: head; height: 60px; }
      .lunar { grid-area: lunar; height: 320px; }
      .left2 { grid-area: left2; height: 30px; }
      .right2 { grid-area: right2; height: 30px; }
      .left3 { grid-area: left3; height: 120px; }
      .right3 { grid-area: right3; height: 120px; }
      .left4 { grid-area: left4; height: 120px; }
      .right4 { grid-area: right4; height: 120px; }
      .left5 { grid-area: left5; height: 60px; }
      .right5 { grid-area: right5; height: 60px; }
      .body1 { grid-area: body1; height: 60px; }
      .left6 { grid-area: left6; height: 60px; }
      .right6 { grid-area: right6; height: 60px; }
      .body7 { grid-area: body7; height: 60px; }
    `;
  }

  render() {
    if (!this.hass) {
      return html`<div>Loading...</div>`;
    }
    const headHeight1 = '320px'; 
    const headHeight12 = '120px'; 
    const headHeight9 = '90px'; 
    const headHeight6 = '60px'; 
    const headHeight3 = '30px'; 

    return html`
      <div class="grid-container">
        <div class="grid-item head">
          <xiaoshi-lunar-head 
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight6}
            style="width:100%;height:100%">
          </xiaoshi-lunar-head>
        </div>

        <div class="grid-item lunar">
          <xiaoshi-lunar 
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight1}
            style="width:100%;height:100%">
          </xiaoshi-lunar>
        </div>

        <div class="grid-item body1">
          <xiaoshi-lunar-body1 
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight6}
            style="width:100%;height:100%">
          </xiaoshi-lunar-body1>
        </div>

        <div class="grid-item body7">
          <xiaoshi-lunar-body7 
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight6}
            style="width:100%;height:100%">
          </xiaoshi-lunar-body7>
        </div>
        <div class="grid-item left1">
          <xiaoshi-lunar-left1
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight9}
            style="width:100%;height:100%">
          </xiaoshi-lunar-left1>
        </div>
        
        <div class="grid-item right1">
          <xiaoshi-lunar-right1
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight9}
            style="width:100%;height:100%">
          </xiaoshi-lunar-right1>
        </div>
        
        <div class="grid-item left2">
          <xiaoshi-lunar-left2
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight3}
            style="width:100%;height:100%">
          </xiaoshi-lunar-left2>
        </div>
        
        <div class="grid-item right2">
          <xiaoshi-lunar-right2
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight3}
            style="width:100%;height:100%">
          </xiaoshi-lunar-right2>
        </div>
        
        <div class="grid-item left3">
          <xiaoshi-lunar-left3
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight12}
            style="width:100%;height:100%">
          </xiaoshi-lunar-left3>
        </div>
        
        <div class="grid-item right3">
          <xiaoshi-lunar-right3
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight12}
            style="width:100%;height:100%">
          </xiaoshi-lunar-right3>
        </div>
        
        <div class="grid-item left4">
          <xiaoshi-lunar-left4
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight12}
            style="width:100%;height:100%">
          </xiaoshi-lunar-left4>
        </div>
        
        <div class="grid-item right4">
          <xiaoshi-lunar-right4
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight12}
            style="width:100%;height:100%">
          </xiaoshi-lunar-right4>
        </div>
        
        <div class="grid-item left5">
          <xiaoshi-lunar-left5
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight6}
            style="width:100%;height:100%">
          </xiaoshi-lunar-left5>
        </div>
        
        <div class="grid-item right5">
          <xiaoshi-lunar-right5
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight6}
            style="width:100%;height:100%">
          </xiaoshi-lunar-right5>
        </div>
        
        <div class="grid-item left6">
          <xiaoshi-lunar-left6
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight6}
            style="width:100%;height:100%">
          </xiaoshi-lunar-left6>
        </div>
        
        <div class="grid-item right6">
          <xiaoshi-lunar-right6
            .hass=${this.hass}
            .config=${this.config}
						.height=${headHeight6}
            style="width:100%;height:100%">
          </xiaoshi-lunar-right6>
        </div>
      </div>
    `;
  }
}
customElements.define('xiaoshi-lunar-pad', XiaoshiLunarPad);

window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: 'xiaoshi-light-card',
    name: '消逝卡片组 灯光卡',
    description: '加载灯光'
  },
  {
    type: 'xiaoshi-switch-card',
    name: '消逝卡片组 插座卡',
    description: '加载插座'
  },
  {
    type: 'xiaoshi-text-card',
    name: '消逝卡片组 输入卡',
    description: 'text.实体输入框'
  },
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
    type: 'xiaoshi-time-card',
    name: '消逝卡片组 时间卡',
    description: '显示时间（需要配合万年历NR和button模板）'
  },
  {
    type: 'xiaoshi-grid-card',
    name: '消逝卡片组 分布卡',
    description: '房间温度分布、湿度分布卡片'
  },
  {
    type: 'xiaoshi-slider-card',
    name: '消逝卡片组 进度条',
    description: '进度条'
  },
  {
    type: 'xiaoshi-state-grid-calendar',
    name: '消逝卡片组 国网卡片-日历',
    description: '国网信息卡'
  },
  {
    type: 'xiaoshi-state-grid-nodered',
    name: '消逝卡片组 国网卡片-NR整合数据',
    description: '国网信息卡'
  },
  {
    type: 'xiaoshi-state-grid-hassbox',
    name: '消逝卡片组 国网卡片-hassbox集成数据',
    description: '国网信息卡'
  },
  {
    type: 'xiaoshi-lunar',
    name: '消逝卡片组 万年历日历',
    description: '万年历日历'
  },
  {
    type: 'xiaoshi-lunar-phone',
    name: '消逝卡片组 万年历手机端',
    description: '万年历手机端'
  },
  {
    type: 'xiaoshi-lunar-pad',
    name: '消逝卡片组 万年历平板端',
    description: '万年历平板端'
  },
);
