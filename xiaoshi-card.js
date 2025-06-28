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
    this.colorNum = '#FF6347';
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
