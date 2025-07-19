import { LitElement, html, css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

export class XiaoshiClimateCard extends LitElement {
  static get properties() {
      return {
          hass: { type: Object },
          width: { type: String, attribute: true },
          config: { type: Object },
          buttons: { type: Array },
          theme: { type: String },
          _timerInterval: { state: true }  // 添加定时器状态
      };
  }
  
  setConfig(config) {
      this.config = config;
      this.buttons = config.buttons || [];
      if (config.width !== undefined) this.width = config.width;
  }
  
  static get styles() { 
      return css`
          .card {
              position: relative;
              border-radius: 12px;
              overflow: hidden;
              box-sizing: border-box;
							margin-bottom: 8px;
          }
          
          .content-container {
              position: relative;
              z-index: 1;
              height: 100%;
              display: grid;
              grid-template-areas: 
                  "name status power"
                  "icon modes modes"
                  "icon fan fan "
                  "icon swing swing"
                  "icon timer timer"
                  "icon extra extra"
                  "a a a"; 
              grid-template-columns: 25% 60% 13%;
              grid-template-rows: auto auto auto auto auto auto 4px;
          }
          
          .active-gradient {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, var(--active-color), transparent);
              opacity: 0.6;
              pointer-events: none;
              z-index: 0;
          }
          
          .name-area {
              grid-area: name;
              display: flex;
              align-items: center;
              font-size: 16px;
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-left: 10px; 
              font-weight: bold;
          }
          
          .status-area {
              grid-area: status;
              display: flex;
              align-items: center;
              font-size: 12px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-left: 5px; 
              gap: 1px;
              font-weight: bold;
          }
          .temp-adjust-container {
              display: inline-flex;
              align-items: center;
              gap: 1px;
          }
          .temp-adjust-button {
              background: none;
              border: none;
              cursor: pointer;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--button);;
              width: 24px;
              height: 24px;
							border-radius: 5px;
							cursor: default;
          }

          .temp-display {
              font-size: 12px;
              min-width: 35px;
              text-align: center;
              color: var(--button);;
          }
          .current-temp {
              font-size: 12px;
              margin-left: 5px;
          }
          .power-area {
              grid-area: power;
              display: flex;
              justify-content: flex-end;
              align-items: center;
          }
          
          .power-button {
              background: none;
              border: none;
              cursor: pointer;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              width: 100%;
              height: 35px;
							border-radius: 5px;
							cursor: default;
          }
          
          .power-icon {
              --mdc-icon-size: 30px;
              transition: all 0.3s ease;
          }
          
          .icon-area {
              grid-area: icon;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              height: 100%;
          }

          .fan-icon-container {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
          }
          
          .fan-icon {
              --mdc-icon-size: 50px;
              margin-top: -3px;
          }
          
          .active-icon {
              animation: spin 2s linear infinite;
              color: var(--active-color);
          }

          .modes-area, .fan-area, .swing-area, .timer-area, .extra-area {
              display: flex;
              gap: 5px;
              width: 100%;
              height: 25px;
              margin-bottom: 5px;
          }
          
          .modes-area {
              grid-area: modes;
          }
          
          .fan-area {
              grid-area: fan;
              overflow-x: auto;
              scrollbar-width: none;
          }
          
          .fan-area::-webkit-scrollbar {
              display: none;
          }
          
          .swing-area {
              grid-area: swing;
              overflow-x: auto;
              scrollbar-width: none;
          }
          
          .swing-area::-webkit-scrollbar {
              display: none;
          }
          
          .timer-area {
              grid-area: timer;
              display: grid;
              grid-template-columns: repeat(8, 1fr);
              gap: 5px;
          }
          
          .timer-button {
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: var(--button-bg);
              color: var(--button-fg);
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 10px;
              min-width: 0;
              overflow: hidden;
              padding: 0 2px;
							cursor: default;
          }
          
          .timer-display {
              grid-column: span 2;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: var(--button-bg);
              color: var(--button-fg);
              border-radius: 8px;
              font-size: 10px;
              font-weight: bold;
              font-family: monospace;
          }
          
          .extra-area {
              grid-area: extra;
              display: grid;
              grid-template-columns: repeat(6, 1fr);
              gap: 5px;
          }
          
          .extra-button {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background-color: rgb(0,0,0,0);
              color: var(--button);
              border: none;
              cursor: pointer;
              min-width: 0;
              overflow: visible;
							cursor: default;
          }
          
          .extra-button-icon {
              --mdc-icon-size: 27px;
              height: 23px;
              margin-top: -3px;
							cursor: default;
          }
          
          .extra-button-text {
              font-size: 10px;
              white-space: nowrap;
              overflow: visible;
              text-overflow: clip;
              max-width: 100%;
              height: auto;
              margin-top: -3px;
              line-height: normal;
							cursor: default;
          }
          
          .mode-button {
              background-color: var(--button-bg);
              color: var(--button-fg);
              border: none;
              border-radius: 8px;
              cursor: pointer;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              flex: 1;
              min-width: 0;
              position: relative;
							cursor: default;
          }

          .icon {
              --mdc-icon-size: 16px;
          }
          
          @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }
          
          .fan-button {
              position: relative;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
          }
          
          .fan-text {
              position: absolute;
              font-size: 8px;
              font-weight: bold;
              bottom: 0px;
              right: 0px; 
              border-radius: 4px;
              height: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 1;
              padding: 1px 2px;  
              background-color: var(--button-bg);  
          }
          
          .swing-button {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
          }
          
          .swing-text {
              font-size: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
          }
          
          .active-mode {
              color: var(--active-color) !important;
          }
          
          .active-extra {
              color: var(--active-color) !important;
          }
      `;
  }

  constructor() {
      super();
      this.hass = {};
      this.config = {};
      this.buttons = [];
      this.theme = 'on';
      this.width = '100%';
      this._timerInterval = null;  // 初始化定时器
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
      if (!this.hass || !this.config.entity) {
          return html``;
      }

      const entity = this.hass.states[this.config.entity];
      if (!entity) {
          return html`<div>实体未找到: ${this.config.entity}</div>`;
      }

      const attrs = entity.attributes;
      const state = entity.state;
      const isOn = state !== 'off';
      
      const theme = this._evaluateTheme();
      const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
      const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
      const buttonBg = theme === 'on' ? 'rgb(50,50,50)' : 'rgb(120,120,120)';
      const buttonFg = 'rgb(250,250,250)';

      let statusColor = 'rgb(250,250,250)';
      if (state === 'cool') statusColor = 'rgb(33,150,243)';
      else if (state === 'heat') statusColor = 'rgb(254,111,33)';
      else if (state === 'dry') statusColor = 'rgb(255,151,0)';
      else if (state === 'fan' || state === 'fan_only') statusColor = 'rgb(0,188,213)';
      else if (state === 'auto') statusColor = 'rgb(200,188,213)';
      else if (state === 'off') statusColor = 'rgb(250,250,250)';



      const stateTranslations = {
          'cool': '制冷',
          'heat': '制热',
          'dry': '除湿',
          'fan': '吹风',
          'fan_only': '吹风',
          'auto': '自动',
          'off': '关闭',
					'unknown': '未知',
					'undefined': '离线'
      };
      const translatedState = stateTranslations[state] || state;

      const hasFanModes = attrs.fan_modes && attrs.fan_modes.length > 0;
      const hasSwingModes = attrs.swing_modes && attrs.swing_modes.length > 0;
      const hasTimer = this.config.timer;
      const timerEntity = hasTimer ? this.hass.states[this.config.timer] : null;
      const hasExtra = this.buttons && this.buttons.length > 0;
      
      const gridTemplateRows = [
          'auto',
          'auto',
          hasFanModes ? 'auto' : '0',
          hasSwingModes ? 'auto' : '0',
          hasTimer ? 'auto' : '0',
          hasExtra ? 'auto' : '0'
      ].join(' ');

      return html`
      <div class="card"
               style="
                    width: ${this.width};
                    background: ${bgColor}; 
                    color: ${fgColor}; 
                    --button-bg: ${buttonBg}; 
                    --button-fg: ${buttonFg}; 
                    --active-color: ${statusColor};
                    grid-template-rows: ${gridTemplateRows}">
                                                              
              ${isOn ? html`<div class="active-gradient"></div>` : ''}
              
              <div class="content-container">
                      <div class="name-area">${attrs.friendly_name}</div>
                      <div class="status-area" style="color: ${fgColor}">
                      ${translatedState}：
                      <div class="temp-adjust-container">
                              <button class="temp-adjust-button" @click=${() => this._adjustTemperature('down')}>
                                      <ha-icon icon="mdi:chevron-left"></ha-icon>
                              </button>
                              <div class="temp-display">${attrs.temperature}°C</div>
                              <button class="temp-adjust-button" @click=${() => this._adjustTemperature('up')}>
                                      <ha-icon icon="mdi:chevron-right"></ha-icon>
                              </button>
                      </div>
                        室温: ${attrs.current_temperature}°C
              </div>
                      <div class="power-area">
                              <button class="power-button" @click=${this._togglePower}>
                                      <ha-icon 
                                              class="power-icon"
                                              icon="${isOn ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}"
                                              style="color: ${isOn ? statusColor : fgColor};"
                                      ></ha-icon>
                              </button>
                      </div>
                      
                      <div class="icon-area">
                              <div class="fan-icon-container">
                                      <ha-icon 
                                              class="fan-icon ${isOn ? 'active-icon' : ''}" 
                                              icon="${isOn ? 'mdi:fan' : 'mdi:fan-off'}"
                                              style="color: ${isOn ? statusColor : ''}"
                                      ></ha-icon>
                              </div>
                      </div>
      
          <div class="modes-area">
              ${this._renderModeButtons(attrs.hvac_modes, state)}
          </div>
          
          ${hasFanModes ? html`
              <div class="fan-area">
                  ${this._renderFanButtons(attrs.fan_modes, attrs.fan_mode)}
              </div>
          ` : ''}
          
          ${hasSwingModes ? html`
              <div class="swing-area">
                  ${this._renderSwingButtons(attrs.swing_modes, attrs.swing_mode)}
              </div>
          ` : ''}
          
          ${hasTimer ? html`
              <div class="timer-area">
                  ${this._renderTimerControls(timerEntity)}
              </div>
          ` : ''}
          
          ${hasExtra ? html`
              <div class="extra-area">
                  ${this._renderExtraButtons()}
              </div>
          ` : ''}
      </div>
  </div>
  `;
  }
  connectedCallback() {
      super.connectedCallback();
      // 组件挂载时启动定时器
      this._startTimerRefresh();
  }

  disconnectedCallback() {
      super.disconnectedCallback();
      // 组件卸载时清除定时器
      this._stopTimerRefresh();
  }

  _startTimerRefresh() {
      // 每秒刷新一次
      this._timerInterval = setInterval(() => {
          this.requestUpdate();  // 触发重新渲染
      }, 1000);
  }

  _stopTimerRefresh() {
      if (this._timerInterval) {
          clearInterval(this._timerInterval);
          this._timerInterval = null;
      }
  }

  _renderTimerControls(timerEntity) {
    if (!timerEntity) return html``;
    
    // 获取空调实体状态和颜色
    const climateEntity = this.hass.states[this.config.entity];
    const climateState = climateEntity ? climateEntity.state : 'off';
    const isOn = climateState !== 'off';
    
    // 定义状态颜色
    let activeColor = 'rgb(33,150,243)'; // 默认cool颜色
    if (isOn) {
        if (climateState === 'cool') activeColor = 'rgb(33,150,243)';
        else if (climateState === 'heat') activeColor = 'rgb(254,111,33)';
        else if (climateState === 'dry') activeColor = 'rgb(255,151,0)';
        else if (climateState === 'fan' || climateState === 'fan_only') activeColor = 'rgb(0,188,213)';
        else if (climateState === 'auto') activeColor = 'rgb(200,188,213)';
    }
    
    // 获取当前时间
    const now = new Date();
    // 获取定时器结束时间
    const finishesAt = new Date(timerEntity.attributes.finishes_at || 0);
    // 计算剩余时间（秒）
    let remainingSeconds = Math.max(0, Math.floor((finishesAt - now) / 1000));
    
    // 如果定时器不是active状态，显示00:00:00
    const state = timerEntity.state;
    if (state !== 'active') {
        remainingSeconds = 0;
    } else if (remainingSeconds <= 0) {
        // 定时器结束，关闭空调
        this._turnOffClimate();
        this._cancelTimer();
        remainingSeconds = 0;
    }
    
    // 格式化剩余时间为HH:MM:SS
    const remainingTime = this._formatSeconds(remainingSeconds);
    
    // 确定显示颜色：非零时使用空调状态颜色，零时使用按钮前景色
    const displayColor = remainingSeconds > 0 ? activeColor : 'var(--button-fg)';
    
    return html`
        <button class="timer-button" @click=${this._cancelTimer}>
            取消
        </button>
        <button class="timer-button" @click=${() => this._adjustTimer(-1, remainingSeconds)}>
            -
        </button>
        <div class="timer-display" style="color: ${displayColor}">
            ${remainingTime}
        </div>
        <button class="timer-button" @click=${() => this._adjustTimer(1, remainingSeconds)}>
            +
        </button>
        <button class="timer-button" @click=${() => this._setTimer(60 * 60)}>
            1h
        </button>
        <button class="timer-button" @click=${() => this._setTimer(3 * 60 * 60)}>
            3h
        </button>
        <button class="timer-button" @click=${() => this._setTimer(8 * 60 * 60)}>
            8h
        </button>
    `;
}

  _formatSeconds(totalSeconds) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  _getTimerAdjustAmount(currentSeconds, direction) {
      const currentMinutes = Math.ceil(currentSeconds / 60);
      
      if (direction === -1) { // 减少
          if (currentMinutes > 30) return '30分';
          if (currentMinutes > 10) return '10分';
          return '取消';
      } else {
          if (currentSeconds === 0) return '10分';
          if (currentMinutes < 30) return '10分';
          if (currentMinutes < 180) return '30分';
          return '1小时';
      }
  }

  _adjustTimer(direction, currentSeconds) {
      if (!this.config.timer) return;
      
      const currentMinutes = Math.ceil(currentSeconds / 60);
      let newSeconds = 0;
      
      if (direction === -1) { // 减少
          if (currentMinutes > 30) {
              newSeconds = currentSeconds - (30 * 60);
          } else if (currentMinutes > 10) {
              newSeconds = currentSeconds - (10 * 60);
          } else {
              this._cancelTimer();
              return;
          }
      } else { // 增加
          if (currentSeconds === 0) {
              newSeconds = 10 * 60;
          } else if (currentMinutes < 30) {
              newSeconds = currentSeconds + (10 * 60);
          } else if (currentMinutes < 180) {
              newSeconds = currentSeconds + (30 * 60);
          } else {
              newSeconds = currentSeconds + (60 * 60);
          }
      }
      
      this._setTimer(newSeconds);
  }

  _cancelTimer() {
      if (!this.config.timer) return;
      this._callService('timer', 'cancel', {
          entity_id: this.config.timer
      });
  }

  _setTimer(totalSeconds) {
      if (!this.config.timer) return;
      const now = new Date();
      const finishesAt = new Date(now.getTime() + totalSeconds * 1000);
      if (this.hass.states[this.config.timer].state === 'active') {
          this._callService('timer', 'cancel', {
              entity_id: this.config.timer
          });
      }
      this._callService('timer', 'start', {
          entity_id: this.config.timer,
          duration: this._formatSeconds(totalSeconds)
      });
  }


  _renderExtraButtons() {
    if (!this.buttons || this.buttons.length === 0) return html``;

    const buttonsToShow = this.buttons.slice(0, 6);

    const entity = this.hass.states[this.config.entity];
    if (!entity) {
        return html`<div>实体未找到: ${this.config.entity}</div>`;
    }
    
    const state = entity.state;
    const isOn = state !== 'off';
    const theme = this._evaluateTheme();
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    
    // 定义状态颜色
    let activeColor = theme === 'on' ? 'rgb(75,0,130)' : 'rgb(216,191,216)';
    if (isOn) {
        if (state === 'cool') activeColor = 'rgb(33,150,243)';
        else if (state === 'heat') activeColor = 'rgb(254,111,33)';
        else if (state === 'dry') activeColor = 'rgb(255,151,0)';
        else if (state === 'fan' || state === 'fan_only') activeColor = 'rgb(0,188,213)';
        else if (state === 'auto') activeColor = 'rgb(238,130,238)';
    }

    return buttonsToShow.map(buttonEntityId => {
        const entity = this.hass.states[buttonEntityId];
        if (!entity) return html``;
        
        const isActive = entity.state === 'on';
        const friendlyName = entity.attributes.friendly_name || '';
        const shortName = friendlyName.length > 3 ? friendlyName.slice(0, 3) : friendlyName;
        
        // 确定颜色：开启时用状态颜色，关闭时用前景色
        const buttonColor = isActive ? activeColor : fgColor;
        
        return html`
            <button 
                class="extra-button ${isActive ? 'active-extra' : ''}" 
                @click=${() => this._toggleExtraButton(buttonEntityId)}
                style="color: ${buttonColor}"
                title="${friendlyName}"
            >
                <ha-icon 
                    class="extra-button-icon"
                    icon="${isActive ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}"
                    style="color: ${buttonColor}"
                ></ha-icon>
                <div class="extra-button-text"
                     style="color: ${buttonColor}"
                >${shortName}</div>
            </button>
        `;
    });
}

  _toggleExtraButton(entityId) {
      const entity = this.hass.states[entityId];
      if (!entity) return;
      
      const domain = entityId.split('.')[0];
      const service = entity.state === 'on' ? 'turn_off' : 'turn_on';
      
      this._callService(domain, service, {
          entity_id: entityId
      });
  }

  _adjustTemperature(direction) {
      const entity = this.hass.states[this.config.entity];
      if (!entity) return;
      
      const currentTemp = entity.attributes.temperature;
      const step = entity.attributes.target_temp_step || 1;
      
      let newTemp = currentTemp;
      if (direction === 'up') {
          newTemp += step;
      } else {
          newTemp -= step;
      }
      
      this._callService('climate', 'set_temperature', {
          entity_id: this.config.entity,
          temperature: newTemp
      });
  }

  _getSwingIcon(mode) {
      const swingIcons = {
          'off': 'mdi:arrow-oscillating-off',
          'vertical': 'mdi:arrow-up-down',
          'horizontal': 'mdi:arrow-left-right',
          'both': 'mdi:arrow-all'
      };
      return swingIcons[mode] || '';
  }

  _renderModeButtons(modes, currentMode) {
      if (!modes) return html``;
      
      const modeIcons = {
          'auto': 'mdi:thermostat-auto',
          'heat': 'mdi:fire',
          'cool': 'mdi:snowflake',
          'dry': 'mdi:water-percent',
          'fan_only': 'mdi:fan',
          'fan': 'mdi:fan',
          'off': 'mdi:power'
      };
      
      return modes.map(mode => {
          const isActive = mode === currentMode;
          return html`
              <button 
                  class="mode-button ${isActive ? 'active-mode' : ''}" 
                  @click=${() => this._setHvacMode(mode)}
                  style="color: ${isActive ? 'var(--active-color)' : ''}"
                  title="${this._translateMode(mode)}"
              >
                  <ha-icon class="icon" icon="${modeIcons[mode] || 'mdi:thermostat'}" style="color: ${isActive ? 'var(--active-color)' : ''}"></ha-icon>
              </button>
          `;
      });
  }

  _renderFanButtons(fanModes, currentFanMode) {
      if (!fanModes) return html``;
      
      return fanModes.map(mode => {
          const isActive = mode === currentFanMode;
          const activeColor = isActive ? 'var(--active-color)' : '';
          
          return html`
              <button 
                  class="mode-button ${isActive ? 'active-mode' : ''}" 
                  @click=${() => this._setFanMode(mode)}
                  style="color: ${activeColor}"
              >
                  <div class="fan-button">
                      <ha-icon 
                          class="icon" 
                          icon="mdi:fan" 
                          style="color: ${activeColor}; position: relative;"
                      ></ha-icon>
                      <span 
                          class="fan-text" 
                          style="color: ${isActive ? activeColor : 'var(--button-fg)'};"
                      >
                          ${this._translateFanMode(mode)}
                      </span>
                  </div>
              </button>
          `;
      });
  }

  _renderSwingButtons(swingModes, currentSwingMode) {
      if (!swingModes) return html``;
      
      return swingModes.map(mode => {
          const isActive = mode === currentSwingMode;
          return html`
              <button 
                  class="mode-button ${isActive ? 'active-mode' : ''}" 
                  @click=${() => this._setSwingMode(mode)}
                  style="color: ${isActive ? 'var(--active-color)' : ''}"
              >
                  <div class="swing-button">
                      <ha-icon class="icon" icon="${this._getSwingIcon(mode)}" style="color: ${isActive ? 'var(--active-color)' : ''}"></ha-icon>
                      <span class="swing-text">${this._translateSwingMode(mode)}</span>
                  </div>
              </button>
          `;
      });
  }

  _translateMode(mode) {
      const translations = {
          'cool': '制冷',
          'heat': '制热',
          'dry': '除湿',
          'fan_only': '吹风',
          'fan': '吹风',
          'auto': '自动',
          'off': '关闭'
      };
      return translations[mode] || mode;
  }

  _translateFanMode(mode) {
      if (mode.includes('最大') || mode.includes('max')|| mode.includes('Max')) return 'M';
      if (mode.includes('自动') || mode.includes('auto')) return 'A';
      if (mode.includes('一') || mode.includes('1')) return '1';
      if (mode.includes('二') || mode.includes('2')) return '2';
      if (mode.includes('三') || mode.includes('3')) return '3';
      if (mode.includes('四') || mode.includes('4')) return '4';
      if (mode.includes('五') || mode.includes('5')) return '5';
      if (mode.includes('六') || mode.includes('6')) return '6';
      if (mode.includes('七') || mode.includes('7')) return '7';
      if (mode.includes('silent') || mode.includes('静')) return '静';
      if (mode.includes('low') || mode.includes('低')) return '低';
      if (mode.includes('稍弱')) return '弱';
      if (mode.includes('稍强')) return '强';
      if (mode.includes('medium') || mode.includes('中')) return '中';
      if (mode.includes('high') || mode.includes('高')) return '高';
      if (mode.includes('full') || mode.includes('全')) return '全';
      return mode;
  }

  _translateSwingMode(mode) {
      const translations = {
          'off': '\u00A0\u00A0关闭',
          'vertical': '\u00A0\u00A0垂直',
          'horizontal': '\u00A0\u00A0水平',
          'both': '\u00A0\u00A0立体'
      };
      return translations[mode] || mode;
  }
  _turnOffClimate() {
    if (!this.config.entity) return;
    
    this._callService('climate', 'turn_off', {
        entity_id: this.config.entity
    });
  }

  _togglePower() {
      const entity = this.hass.states[this.config.entity];
      if (entity.state === 'off') {
          this._callService('climate', 'turn_on', {
              entity_id: this.config.entity
          });
      } else {
          this._callService('climate', 'turn_off', {
              entity_id: this.config.entity
          });
        this._cancelTimer();
      }
  }

  _setHvacMode(mode) {
      this._callService('climate', 'set_hvac_mode', {
          entity_id: this.config.entity,
          hvac_mode: mode
      });
  }

  _setFanMode(mode) {
      this._callService('climate', 'set_fan_mode', {
          entity_id: this.config.entity,
          fan_mode: mode
      });
  }

  _setSwingMode(mode) {
      this._callService('climate', 'set_swing_mode', {
          entity_id: this.config.entity,
          swing_mode: mode
      });
  }

  _callService(domain, service, data) {
      this.hass.callService(domain, service, data);
  }
}
customElements.define('xiaoshi-climate-card', XiaoshiClimateCard);
