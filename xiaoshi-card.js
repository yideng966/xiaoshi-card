console.info("%c 消逝集合卡 \n%c   v 2.6.8 ", "color: red; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");

import { cardConfigs } from './xiaoshi-config.js';

const loadCards  = async () => {
    await import('./cards/xiaoshi-light-card.js');
    await import('./cards/xiaoshi-switch-card.js');
    await import('./cards/xiaoshi-image-card.js');
    await import('./cards/xiaoshi-video-card.js');
    await import('./cards/xiaoshi-slider-card.js');
    await import('./cards/xiaoshi-text-card.js');
    await import('./cards/xiaoshi-time-card.js');
    await import('./cards/xiaoshi-grid-card.js');
    await import('./cards/xiaoshi-lunar-card.js');
    await import('./cards/xiaoshi-stategrid-card.js');
    
    window.customCards = window.customCards || [];
    window.customCards.push(...cardConfigs);
};

loadCards ();
