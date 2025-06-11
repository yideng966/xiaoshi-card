console.info("%c 消逝集合卡 \n%c   v 2.3.8  ", "color: red; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");
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
    const popupContent = this.config.popup_content || {
      type: 'custom:button-card',
      template: '万年历平板端'
    };
    
    const popupStyle = this.config.popup_style || `
      --popup-min-width: 870px;
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
      entities: config.entities.map(entity => ({
        ...entity,
        state: entity.state !== false, // 默认true，除非显式设置为false
        
      })),
    };
  }

  render() {
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

class XiaoshiStateGridNodeRed extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _data: { type: Object, state: true },
      border: { type: String, attribute: 'border-radius' },
      cardwidth: { type: String, attribute: 'card-width' },
      cardheight: { type: String, attribute: 'card-height' },
      _isRefreshing: { type: Boolean, state: true }
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
        grid-template-areas: 
          "名称 名称 名称 名称 名称"   
          "刷新时间 刷新时间 刷新时间 刷新时间 电费余额"   
          "数据日期 数据日期 数据日期 数据日期 电费余额"   
          "日总用电 日峰用电 日平用电 日谷用电 日用电费"      
          "月总用电 月峰用电 月平用电 月谷用电 月用电费"     
          "年总用电 年峰用电 年平用电 年谷用电 年用电费";
        grid-template-columns: auto auto auto auto auto;
        grid-template-rows: auto auto auto auto auto auto;
        border-radius: var(--border-radius, 10px);
        padding: 0 5px 0 5px;
        cursor: default;
        justify-items: center;
        align-items: center;
        margin: 0 auto;
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
        border: 1.5px solid rgba(0,200,200,0.5);
        border-radius: 20px;
        width: var(--card-width, 70px);
        height: var(--card-height, 35px);
      }
      
      .data-item.light {
        background: rgb(250,250,250);
      }
      
      .data-item.dark {
        background: rgb(80,80,80);
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        text-align: center;
        margin-top: -4px;
      }
      
      .data-item-name {
        font-size: 9px;
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
      height: '280px',
      width: '400px',
      border: '10px',
      cardwidth: '70px',
      cardheight: '35px',
      titleFontSize: '20px',
    };
    this._data = {};
    this._interval = null;
    this._isRefreshing = false;
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
    const num = parseFloat(balance) || 0;
    const rounded = Math.round(num * 10) / 10;
    return num >= 20 ? 
      `${rounded}元` : 
      html`<span class="warning">${rounded}元</span>`;
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
    
    return html`
      <div class="card-container ${themeClass}" 
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
          ${this._renderDataItem('电费余额', 'mdi:cash', this._formatBalance(this._data.balance), itemThemeClass)}
        </div>
        
        ${this._renderDataItem('日总用电', 'mdi:lightning-bolt', `${this._data.dayEleNum || '0'}°`, itemThemeClass, '日总用电')}
        ${this._renderDataItem('日峰用电', 'mdi:lightning-bolt', `${this._data.daily_p_ele_num || '0'}°`, itemThemeClass, '日峰用电')}
        ${this._renderDataItem('日平用电', 'mdi:lightning-bolt', `${this._data.daily_n_ele_num || '0'}°`, itemThemeClass, '日平用电')}
        ${this._renderDataItem('日谷用电', 'mdi:lightning-bolt', `${this._data.daily_v_ele_num || '0'}°`, itemThemeClass, '日谷用电')}
        ${this._renderDataItem('日用电费', 'mdi:cash',           `${this._data.daily_ele_cost || '0'}元`, itemThemeClass, '日用电费')}
        
        ${this._renderDataItem('月总用电', 'mdi:lightning-bolt', `${this._data.month_ele_num || '0'}°`, itemThemeClass, '月总用电')}
        ${this._renderDataItem('月峰用电', 'mdi:lightning-bolt', `${this._data.month_p_ele_num || '0'}°`, itemThemeClass, '月峰用电')}
        ${this._renderDataItem('月平用电', 'mdi:lightning-bolt', `${this._data.month_n_ele_num || '0'}°`, itemThemeClass, '月平用电')}
        ${this._renderDataItem('月谷用电', 'mdi:lightning-bolt', `${this._data.month_v_ele_num || '0'}°`, itemThemeClass, '月谷用电')}
        ${this._renderDataItem('月用电费', 'mdi:cash',           `${this._data.month_ele_cost || '0'}元`, itemThemeClass, '月用电费')}
        
        ${this._renderDataItem('年总用电', 'mdi:lightning-bolt', `${this._data.year_ele_num || '0'}°`, itemThemeClass, '年总用电')}
        ${this._renderDataItem('年峰用电', 'mdi:lightning-bolt', `${this._data.year_p_ele_num || '0'}°`, itemThemeClass, '年峰用电')}
        ${this._renderDataItem('年平用电', 'mdi:lightning-bolt', `${this._data.year_n_ele_num || '0'}°`, itemThemeClass, '年平用电')}
        ${this._renderDataItem('年谷用电', 'mdi:lightning-bolt', `${this._data.year_v_ele_num || '0'}°`, itemThemeClass, '年谷用电')}
        ${this._renderDataItem('年用电费', 'mdi:cash',           `${this._data.year_ele_cost || '0'}元`, itemThemeClass, '年用电费')}
      </div>
    `;
  }

  _renderDataItem(name, icon, value, themeClass, gridArea) {
    return html`
      <div class="data-item ${themeClass}" style="${gridArea ? `grid-area: ${gridArea}` : ''}">
        ${icon ? html`
          <div class="data-item-content">
            <ha-icon class="data-item-icon" .icon=${icon}></ha-icon>
            <div class="data-item-text">
              <div class="data-item-name">${name}</div>
              <div class="data-item-value">${value}</div>
            </div>
          </div>
        ` : html`
          <div class="data-item-text">
            <div class="data-item-name">${name}</div>
            <div class="data-item-value">${value}</div>
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
			cardheight: { type: String, attribute: 'card-height' }
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
        grid-template-areas: 
          "名称 名称 名称 名称 名称"   
          "刷新时间 刷新时间 刷新时间 刷新时间 电费余额"   
          "数据日期 数据日期 数据日期 数据日期 电费余额"
          "日总用电 日峰用电 日平用电 日谷用电 日用电费"      
          "月总用电 月峰用电 月平用电 月谷用电 月用电费"     
          "年总用电 年峰用电 年平用电 年谷用电 年用电费";
        grid-template-columns: auto auto auto auto auto;
        grid-template-rows: auto auto auto auto auto auto;
        border-radius: var(--border-radius, 10px);
        padding: 0 5px 0 5px;
        cursor: default;
				justify-items: center;
				align-items: center;
				margin: 0 auto;
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
        border: 1.5px solid rgba(0,200,200,0.5);
        border-radius: 20px;
        width: var(--card-width, 70px);
        height: var(--card-height, 35px);
      }
      
      .data-item.light {
        background: rgb(250,250,250);
      }
      
      .data-item.dark {
        background: rgb(80,80,80);
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
				text-align: center;
        margin-top: -4px;
      }
      
      .data-item-name {
        font-size: 9px;
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
      height: '280px',
      width: '400px',
			border: '10px',
			cardwidth: '70px',
			cardheight: '35px',
			titleFontSize: '20px'
    };
    this._data = {};
    this._price = 0.5;
    this._interval = null;
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
        'daily_v_ele_num', 'month_v_ele_num', 'year_v_ele_num'
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
    const num = parseFloat(balance) || 0;
    const rounded = Math.round(num * 10) / 10;
    return num >= 20 ? 
      `${rounded}元` : 
      html`<span class="warning">${rounded}元</span>`;
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
    
    return html`
      <div class="card-container ${themeClass}" 
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
          ${this._renderDataItem('电费余额', 'mdi:cash', this._formatBalance(this._data.balance), itemThemeClass)}
        </div>
        
        ${this._renderDataItem('日总用电', 'mdi:lightning-bolt', `${this._data.daily_ele_num || '0'}°`, itemThemeClass, '日总用电')}
        ${this._renderDataItem('日峰用电', 'mdi:lightning-bolt', `${this._data.daily_p_ele_num || '0'}°`, itemThemeClass, '日峰用电')}
        ${this._renderDataItem('日平用电', 'mdi:lightning-bolt', `${this._data.daily_n_ele_num || '0'}°`, itemThemeClass, '日平用电')}
        ${this._renderDataItem('日谷用电', 'mdi:lightning-bolt', `${this._data.daily_v_ele_num || '0'}°`, itemThemeClass, '日谷用电')}
        ${this._renderDataItem('日用电费', 'mdi:cash', this._formatCost(this._data.daily_ele_num), itemThemeClass, '日用电费')}
        
        ${this._renderDataItem('月总用电', 'mdi:lightning-bolt', `${this._data.month_ele_num || '0'}°`, itemThemeClass, '月总用电')}
        ${this._renderDataItem('月峰用电', 'mdi:lightning-bolt', `${this._data.month_p_ele_num || '0'}°`, itemThemeClass, '月峰用电')}
        ${this._renderDataItem('月平用电', 'mdi:lightning-bolt', `${this._data.month_n_ele_num || '0'}°`, itemThemeClass, '月平用电')}
        ${this._renderDataItem('月谷用电', 'mdi:lightning-bolt', `${this._data.month_v_ele_num || '0'}°`, itemThemeClass, '月谷用电')}
        ${this._renderDataItem('月用电费', 'mdi:cash', this._formatCost(this._data.month_ele_num), itemThemeClass, '月用电费')}
        
        ${this._renderDataItem('年总用电', 'mdi:lightning-bolt', `${this._data.year_ele_num || '0'}°`, itemThemeClass, '年总用电')}
        ${this._renderDataItem('年峰用电', 'mdi:lightning-bolt', `${this._data.year_p_ele_num || '0'}°`, itemThemeClass, '年峰用电')}
        ${this._renderDataItem('年平用电', 'mdi:lightning-bolt', `${this._data.year_n_ele_num || '0'}°`, itemThemeClass, '年平用电')}
        ${this._renderDataItem('年谷用电', 'mdi:lightning-bolt', `${this._data.year_v_ele_num || '0'}°`, itemThemeClass, '年谷用电')}
        ${this._renderDataItem('年用电费', 'mdi:cash', this._formatCost(this._data.year_ele_num), itemThemeClass, '年用电费')}
      </div>
    `;
  }

  _renderDataItem(name, icon, value, themeClass, gridArea) {
    return html`
      <div class="data-item ${themeClass}" style="${gridArea ? `grid-area: ${gridArea}` : ''}">
        ${icon ? html`
          <div class="data-item-content">
            <ha-icon class="data-item-icon" .icon=${icon}></ha-icon>
            <div class="data-item-text">
							<div class="data-item-name">${name}</div>
              <div class="data-item-value">${value}</div>
            </div>
          </div>
        ` : html`
          <div class="data-item-text">
						<div class="data-item-name">${name}</div>
            <div class="data-item-value">${value}</div>
          </div>
        `}
      </div>
    `;
  }
}
customElements.define('xiaoshi-state-grid-hassbox', XiaoshiStateGridHassbox);

class XiaoshiStateGridNodeRedn extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _data: { type: Object, state: true },
      border: { type: String, attribute: 'border-radius' },
      cardwidth: { type: String, attribute: 'card-width' },
      cardheight: { type: String, attribute: 'card-height' },
      _isRefreshing: { type: Boolean, state: true }
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
        grid-template-areas: 
          "名称 名称 名称  名称"   
          "刷新时间 刷新时间  刷新时间 电费余额"   
          "数据日期 数据日期  数据日期 电费余额"   
          "日总用电 日峰用电  日谷用电 日用电费"      
          "月总用电 月峰用电  月谷用电 月用电费"     
          "年总用电 年峰用电  年谷用电 年用电费";
        grid-template-columns: auto  auto auto auto;
        grid-template-rows: auto auto auto auto auto auto;
        border-radius: var(--border-radius, 10px);
        padding: 0 5px 0 5px;
        cursor: default;
        justify-items: center;
        align-items: center;
        margin: 0 auto;
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
        border: 1.5px solid rgba(0,200,200,0.5);
        border-radius: 20px;
        width: var(--card-width, 70px);
        height: var(--card-height, 35px);
      }
      
      .data-item.light {
        background: rgb(250,250,250);
      }
      
      .data-item.dark {
        background: rgb(80,80,80);
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        text-align: center;
        margin-top: -4px;
      }
      
      .data-item-name {
        font-size: 9px;
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
      height: '280px',
      width: '400px',
      border: '10px',
      cardwidth: '70px',
      cardheight: '35px',
      titleFontSize: '20px'
    };
    this._data = {};
    this._interval = null;
    this._isRefreshing = false;
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
			this.hass.callService('button', 'press', {entity_id: this.config.refreshButton});
		}, 1000);
	}

  _formatBalance(balance) {
    const num = parseFloat(balance) || 0;
    const rounded = Math.round(num * 10) / 10;
    return num >= 20 ? 
      `${rounded}元` : 
      html`<span class="warning">${rounded}元</span>`;
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
    
    return html`
      <div class="card-container ${themeClass}" 
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
          ${this._renderDataItem('上月电费', 'mdi:cash', this._formatBalance(this._data.balance), itemThemeClass)}
        </div>
        
        ${this._renderDataItem('日总用电', 'mdi:lightning-bolt', `${this._data.dayEleNum || '0'}°`, itemThemeClass, '日总用电')}
        ${this._renderDataItem('日峰用电', 'mdi:lightning-bolt', `${this._data.daily_p_ele_num || '0'}°`, itemThemeClass, '日峰用电')}
        ${this._renderDataItem('日谷用电', 'mdi:lightning-bolt', `${this._data.daily_v_ele_num || '0'}°`, itemThemeClass, '日谷用电')}
        ${this._renderDataItem('日用电费', 'mdi:cash',           `${this._data.daily_ele_cost || '0'}元`, itemThemeClass, '日用电费')}
        
        ${this._renderDataItem('月总用电', 'mdi:lightning-bolt', `${this._data.month_ele_num || '0'}°`, itemThemeClass, '月总用电')}
        ${this._renderDataItem('月峰用电', 'mdi:lightning-bolt', `${this._data.month_p_ele_num || '0'}°`, itemThemeClass, '月峰用电')}
        ${this._renderDataItem('月谷用电', 'mdi:lightning-bolt', `${this._data.month_v_ele_num || '0'}°`, itemThemeClass, '月谷用电')}
        ${this._renderDataItem('月用电费', 'mdi:cash',           `${this._data.month_ele_cost || '0'}元`, itemThemeClass, '月用电费')}
        
        ${this._renderDataItem('年总用电', 'mdi:lightning-bolt', `${this._data.year_ele_num || '0'}°`, itemThemeClass, '年总用电')}
        ${this._renderDataItem('年峰用电', 'mdi:lightning-bolt', `${this._data.year_p_ele_num || '0'}°`, itemThemeClass, '年峰用电')}
        ${this._renderDataItem('年谷用电', 'mdi:lightning-bolt', `${this._data.year_v_ele_num || '0'}°`, itemThemeClass, '年谷用电')}
        ${this._renderDataItem('年用电费', 'mdi:cash',           `${this._data.year_ele_cost || '0'}元`, itemThemeClass, '年用电费')}
      </div>
    `;
  }

  _renderDataItem(name, icon, value, themeClass, gridArea) {
    return html`
      <div class="data-item ${themeClass}" style="${gridArea ? `grid-area: ${gridArea}` : ''}">
        ${icon ? html`
          <div class="data-item-content">
            <ha-icon class="data-item-icon" .icon=${icon}></ha-icon>
            <div class="data-item-text">
              <div class="data-item-name">${name}</div>
              <div class="data-item-value">${value}</div>
            </div>
          </div>
        ` : html`
          <div class="data-item-text">
            <div class="data-item-name">${name}</div>
            <div class="data-item-value">${value}</div>
          </div>
        `}
      </div>
    `;
  }
}
customElements.define('xiaoshi-state-grid-nodered-n', XiaoshiStateGridNodeRedn);

class XiaoshiStateGridHassboxn extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _data: { type: Object, state: true },
      _price: { type: Number, state: true },
			border: { type: String, attribute: 'border-radius' },
			cardwidth: { type: String, attribute: 'card-width' },
			cardheight: { type: String, attribute: 'card-height' }
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
        grid-template-areas: 
          "名称 名称 名称 名称"   
          "刷新时间 刷新时间 刷新时间 电费余额"   
          "数据日期 数据日期 数据日期 电费余额"
          "日总用电 日峰用电 日谷用电 日用电费"      
          "月总用电 月峰用电 月谷用电 月用电费"     
          "年总用电 年峰用电 年谷用电 年用电费";
        grid-template-columns: auto auto auto auto;
        grid-template-rows: auto auto auto auto auto auto;
        border-radius: var(--border-radius, 10px);
        padding: 0 5px 0 5px;
        cursor: default;
				justify-items: center;
				align-items: center;
				margin: 0 auto;
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
        border: 1.5px solid rgba(0,200,200,0.5);
        border-radius: 20px;
        width: var(--card-width, 70px);
        height: var(--card-height, 35px);
      }
      
      .data-item.light {
        background: rgb(250,250,250);
      }
      
      .data-item.dark {
        background: rgb(80,80,80);
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
				text-align: center;
        margin-top: -4px;
      }
      
      .data-item-name {
        font-size: 9px;
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
      height: '280px',
      width: '400px',
			border: '10px',
			cardwidth: '70px',
			cardheight: '35px',
			titleFontSize: '20px'
    };
    this._data = {};
    this._price = 0.5;
    this._interval = null;
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
        'daily_v_ele_num', 'month_v_ele_num', 'year_v_ele_num'
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
    const num = parseFloat(balance) || 0;
    const rounded = Math.round(num * 10) / 10;
    return num >= 20 ? 
      `${rounded}元` : 
      html`<span class="warning">${rounded}元</span>`;
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
    
    return html`
      <div class="card-container ${themeClass}" 
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
          ${this._renderDataItem('上月电费', 'mdi:cash', this._formatBalance(this._data.balance), itemThemeClass)}
        </div>
        
        ${this._renderDataItem('日总用电', 'mdi:lightning-bolt', `${this._data.daily_ele_num || '0'}°`, itemThemeClass, '日总用电')}
        ${this._renderDataItem('日峰用电', 'mdi:lightning-bolt', `${this._data.daily_p_ele_num || '0'}°`, itemThemeClass, '日峰用电')}
        ${this._renderDataItem('日谷用电', 'mdi:lightning-bolt', `${this._data.daily_v_ele_num || '0'}°`, itemThemeClass, '日谷用电')}
        ${this._renderDataItem('日用电费', 'mdi:cash', this._formatCost(this._data.daily_ele_num), itemThemeClass, '日用电费')}
        
        ${this._renderDataItem('月总用电', 'mdi:lightning-bolt', `${this._data.month_ele_num || '0'}°`, itemThemeClass, '月总用电')}
        ${this._renderDataItem('月峰用电', 'mdi:lightning-bolt', `${this._data.month_p_ele_num || '0'}°`, itemThemeClass, '月峰用电')}
        ${this._renderDataItem('月谷用电', 'mdi:lightning-bolt', `${this._data.month_v_ele_num || '0'}°`, itemThemeClass, '月谷用电')}
        ${this._renderDataItem('月用电费', 'mdi:cash', this._formatCost(this._data.month_ele_num), itemThemeClass, '月用电费')}
        
        ${this._renderDataItem('年总用电', 'mdi:lightning-bolt', `${this._data.year_ele_num || '0'}°`, itemThemeClass, '年总用电')}
        ${this._renderDataItem('年峰用电', 'mdi:lightning-bolt', `${this._data.year_p_ele_num || '0'}°`, itemThemeClass, '年峰用电')}
        ${this._renderDataItem('年谷用电', 'mdi:lightning-bolt', `${this._data.year_v_ele_num || '0'}°`, itemThemeClass, '年谷用电')}
        ${this._renderDataItem('年用电费', 'mdi:cash', this._formatCost(this._data.year_ele_num), itemThemeClass, '年用电费')}
      </div>
    `;
  }

  _renderDataItem(name, icon, value, themeClass, gridArea) {
    return html`
      <div class="data-item ${themeClass}" style="${gridArea ? `grid-area: ${gridArea}` : ''}">
        ${icon ? html`
          <div class="data-item-content">
            <ha-icon class="data-item-icon" .icon=${icon}></ha-icon>
            <div class="data-item-text">
							<div class="data-item-name">${name}</div>
              <div class="data-item-value">${value}</div>
            </div>
          </div>
        ` : html`
          <div class="data-item-text">
						<div class="data-item-name">${name}</div>
            <div class="data-item-value">${value}</div>
          </div>
        `}
      </div>
    `;
  }
}
customElements.define('xiaoshi-state-grid-hassbox-n', XiaoshiStateGridHassboxn);

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
    type: 'xiaoshi-state-grid-nodered-n',
    name: '消逝卡片组 国网卡片-NR整合数据(无平用电)',
    description: '国网信息卡'
  },
  {
    type: 'xiaoshi-state-grid-hassbox-n',
    name: '消逝卡片组 国网卡片-hassbox集成数据(无平用电)',
    description: '国网信息卡'
  },
);
