(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) root.setAttribute('data-theme', storedTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  const helpBtn = document.getElementById('help-btn');
  const helpOverlay = document.getElementById('help-overlay');
  const helpClose = document.getElementById('help-close');
  helpBtn.addEventListener('click', () => { showComingSoon('Quick tour', "This help walkthrough is coming soon — it'll walk you through adding categories, tiles, and personalizing your homepage."); });
  helpClose.addEventListener('click', () => { helpOverlay.hidden = true; });
  helpOverlay.addEventListener('click', (e) => {
    if (e.target === helpOverlay) helpOverlay.hidden = true;
  });

  function showComingSoon(title, message) {
    helpOverlay.querySelector('h2').textContent = title;
    helpOverlay.querySelector('p').textContent = message;
    helpOverlay.hidden = false;
  }

  document.getElementById('profile-btn').addEventListener('click', () => {
    showComingSoon('Settings', 'Profile photo and settings are coming in a later pass.');
  });

  const searchForm = document.getElementById('search-form');
  const searchEngine = document.getElementById('search-engine');
  const storedEngine = localStorage.getItem('searchEngine');
  if (storedEngine) {
    searchEngine.value = storedEngine;
    searchForm.action = storedEngine;
  }
  searchEngine.addEventListener('change', () => {
    searchForm.action = searchEngine.value;
    localStorage.setItem('searchEngine', searchEngine.value);
  });

  document.querySelectorAll('.category:not(.category--home) .category-header').forEach((btn) => {
    const section = btn.closest('.category');
    const id = section.dataset.categoryId;
    const grid = section.querySelector('.tile-grid');
    const stored = localStorage.getItem('category-collapsed-' + id);
    const collapsed = stored === null ? true : stored === 'true';
    setExpanded(!collapsed);

    function setExpanded(expanded) {
      grid.hidden = !expanded;
      btn.setAttribute('aria-expanded', String(expanded));
    }

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      setExpanded(!expanded);
      localStorage.setItem('category-collapsed-' + id, String(expanded));
    });
  });

  function attachLongPress(el, callback) {
    const LONG_PRESS_MS = 550;
    const MOVE_CANCEL_PX = 20;
    let pressTimer = null;
    let startX = 0;
    let startY = 0;
    let suppressNextClick = false;

    function cancelPress() {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    }

    el.addEventListener('pointerdown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
      cancelPress();
      pressTimer = setTimeout(() => {
        pressTimer = null;
        suppressNextClick = true;
        callback();
      }, LONG_PRESS_MS);
    });

    el.addEventListener('pointermove', (e) => {
      if (!pressTimer) return;
      if (Math.abs(e.clientX - startX) > MOVE_CANCEL_PX || Math.abs(e.clientY - startY) > MOVE_CANCEL_PX) {
        cancelPress();
      }
    });

    el.addEventListener('pointerup', cancelPress);
    el.addEventListener('pointercancel', cancelPress);
    el.addEventListener('pointerleave', cancelPress);

    el.addEventListener('click', (e) => {
      if (suppressNextClick) {
        suppressNextClick = false;
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
  }

  const CLOCK_SETTINGS_KEY = 'clockSettings';
  const defaultClockSettings = { mode: 'digital', scheme: 'red-black', hour12: true };
  let storedClockSettings = {};
  try {
    storedClockSettings = JSON.parse(localStorage.getItem(CLOCK_SETTINGS_KEY) || '{}');
  } catch (e) {
    storedClockSettings = {};
  }
  const clockSettings = Object.assign({}, defaultClockSettings, storedClockSettings);
  function saveClockSettings() {
    localStorage.setItem(CLOCK_SETTINGS_KEY, JSON.stringify(clockSettings));
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }
  function polarPoint(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function addHand(svg, cx, cy, angleDeg, length, width, color) {
    const tip = polarPoint(cx, cy, length, angleDeg);
    svg.appendChild(svgEl('line', {
      x1: cx, y1: cy, x2: tip.x, y2: tip.y,
      stroke: color, 'stroke-width': width, 'stroke-linecap': 'round',
    }));
  }

  function renderAnalogFace(svg, hour12) {
    svg.innerHTML = '';
    const cx = 50;
    const cy = 50;
    const now = new Date();

    svg.appendChild(svgEl('circle', { cx, cy, r: 48, fill: '#fff', stroke: '#333', 'stroke-width': 1 }));

    if (hour12) {
      for (let i = 1; i <= 12; i++) {
        const angle = i * 30;
        const outer = polarPoint(cx, cy, 46, angle);
        const inner = polarPoint(cx, cy, 41, angle);
        svg.appendChild(svgEl('line', {
          x1: outer.x, y1: outer.y, x2: inner.x, y2: inner.y,
          stroke: '#333', 'stroke-width': i % 3 === 0 ? 1.5 : 0.6,
        }));
      }
      [3, 6, 9, 12].forEach((n) => {
        const p = polarPoint(cx, cy, 28, n * 30);
        const t = svgEl('text', { x: p.x, y: p.y + 3, 'text-anchor': 'middle', 'font-size': 9, fill: '#222' });
        t.textContent = String(n);
        svg.appendChild(t);
      });
      const totalMin = (now.getHours() % 12) * 60 + now.getMinutes();
      addHand(svg, cx, cy, (totalMin / 720) * 360, 24, 2.5, '#222');
      addHand(svg, cx, cy, (now.getMinutes() / 60) * 360, 36, 1.5, '#222');
    } else {
      const innerR = 34;
      const nightFill = getComputedStyle(document.documentElement).getPropertyValue('--clock-analog-night').trim() || '#c9c9c9';
      svg.appendChild(svgEl('circle', { cx, cy, r: innerR, fill: '#fff' }));
      svg.appendChild(svgEl('path', {
        d: `M ${cx - innerR} ${cy} A ${innerR} ${innerR} 0 0 1 ${cx + innerR} ${cy} Z`,
        fill: nightFill,
      }));
      for (let i = 1; i <= 24; i++) {
        const angle = i * 15;
        const outer = polarPoint(cx, cy, 46, angle);
        const inner = polarPoint(cx, cy, 41, angle);
        svg.appendChild(svgEl('line', {
          x1: outer.x, y1: outer.y, x2: inner.x, y2: inner.y,
          stroke: '#333', 'stroke-width': i % 6 === 0 ? 1.5 : 0.5,
        }));
      }
      [6, 12, 18, 24].forEach((n) => {
        const p = polarPoint(cx, cy, 37.5, n * 15);
        const t = svgEl('text', { x: p.x, y: p.y + 2.5, 'text-anchor': 'middle', 'font-size': 7, fill: '#222' });
        t.textContent = String(n);
        svg.appendChild(t);
      });
      const totalMin = now.getHours() * 60 + now.getMinutes();
      addHand(svg, cx, cy, (totalMin / 1440) * 360, 22, 2.5, '#222');
      addHand(svg, cx, cy, (now.getMinutes() / 60) * 360, 30, 1.5, '#222');
    }
    svg.appendChild(svgEl('circle', { cx, cy, r: 2, fill: '#222' }));
  }

  function updateMiniClocks() {
    const now = new Date();
    document.querySelectorAll('.mini-clock').forEach((mc) => {
      let h = now.getHours();
      let ap = '';
      if (clockSettings.hour12) {
        ap = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        if (h === 0) h = 12;
      }
      mc.querySelector('.mh').textContent = String(h).padStart(2, '0');
      mc.querySelector('.mm').textContent = ':' + String(now.getMinutes()).padStart(2, '0') + (ap ? ' ' + ap : '');
    });
  }

  function setHiddenAttr(el, isHidden) {
    if (isHidden) {
      el.setAttribute('hidden', '');
    } else {
      el.removeAttribute('hidden');
    }
  }

  function applyClockDisplayMode() {
    const face = document.getElementById('clock-face');
    face.dataset.mode = clockSettings.mode;
    face.dataset.scheme = clockSettings.scheme;
    document.getElementById('clock-digital').hidden = clockSettings.mode !== 'digital';
    setHiddenAttr(document.getElementById('clock-analog-svg'), clockSettings.mode !== 'analog');
  }

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let ampm = null;
    if (clockSettings.hour12) {
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
    }
    document.getElementById('clock-hour').textContent = String(hours).padStart(2, '0');
    document.getElementById('clock-minute').textContent = String(now.getMinutes()).padStart(2, '0');
    const ampmEl = document.getElementById('clock-ampm');
    ampmEl.hidden = !clockSettings.hour12;
    ampmEl.textContent = ampm || '';
    document.getElementById('clock-day').textContent = now.toLocaleDateString(undefined, { weekday: 'short' });
    document.getElementById('clock-month').textContent = now.toLocaleDateString(undefined, { month: 'short' });
    document.getElementById('clock-daynum').textContent = String(now.getDate());

    if (clockSettings.mode === 'analog') {
      renderAnalogFace(document.getElementById('clock-analog-svg'), clockSettings.hour12);
    }
    updateMiniClocks();
    const analogPreviewGroup = document.getElementById('clock-analog-preview-group');
    if (analogPreviewGroup && !analogPreviewGroup.hidden) {
      renderAnalogFace(document.getElementById('clock-analog-preview-svg'), clockSettings.hour12);
    }
  }
  function scheduleNextClockTick() {
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    setTimeout(() => {
      updateClock();
      scheduleNextClockTick();
    }, msToNextMinute);
  }
  applyClockDisplayMode();
  updateClock();
  scheduleNextClockTick();

  const clockOptionsOverlay = document.getElementById('clock-options-overlay');
  const clockOptionsClose = document.getElementById('clock-options-close');
  const clockDigitalPreviewGroup = document.getElementById('clock-digital-preview-group');
  const clockAnalogPreviewGroup = document.getElementById('clock-analog-preview-group');

  function syncClockOptionsUI() {
    clockOptionsOverlay.querySelectorAll('.segmented').forEach((seg) => {
      const setting = seg.dataset.setting;
      const currentVal = setting === 'clockMode' ? clockSettings.mode : (clockSettings.hour12 ? '12' : '24');
      seg.querySelectorAll('button').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.value === currentVal);
      });
    });
    clockOptionsOverlay.querySelectorAll('.scheme-swatch').forEach((sw) => {
      sw.classList.toggle('active', sw.dataset.scheme === clockSettings.scheme);
    });
    clockDigitalPreviewGroup.hidden = clockSettings.mode !== 'digital';
    clockAnalogPreviewGroup.hidden = clockSettings.mode !== 'analog';
    if (clockSettings.mode === 'analog') {
      renderAnalogFace(document.getElementById('clock-analog-preview-svg'), clockSettings.hour12);
    }
    updateMiniClocks();
  }

  function openClockOptions() {
    syncClockOptionsUI();
    clockOptionsOverlay.hidden = false;
  }
  function closeClockOptions() {
    clockOptionsOverlay.hidden = true;
  }
  clockOptionsClose.addEventListener('click', closeClockOptions);
  clockOptionsOverlay.addEventListener('click', (e) => {
    if (e.target === clockOptionsOverlay) closeClockOptions();
  });

  clockOptionsOverlay.querySelectorAll('.segmented button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const setting = btn.closest('.segmented').dataset.setting;
      if (setting === 'clockMode') {
        clockSettings.mode = btn.dataset.value;
      } else if (setting === 'clockHour12') {
        clockSettings.hour12 = btn.dataset.value === '12';
      }
      saveClockSettings();
      applyClockDisplayMode();
      updateClock();
      syncClockOptionsUI();
    });
  });

  clockOptionsOverlay.querySelectorAll('.scheme-swatch').forEach((btn) => {
    btn.addEventListener('click', () => {
      clockSettings.scheme = btn.dataset.scheme;
      saveClockSettings();
      applyClockDisplayMode();
      syncClockOptionsUI();
    });
  });

  attachLongPress(document.getElementById('clock-widget'), openClockOptions);

  const uvBadge = document.querySelector('.uv-badge');
  function uvSeverityClass(uv) {
    if (uv <= 2) return 'uv-low';
    if (uv <= 5) return 'uv-moderate';
    if (uv <= 7) return 'uv-high';
    if (uv <= 10) return 'uv-veryhigh';
    return 'uv-extreme';
  }
  if (uvBadge) {
    uvBadge.classList.add(uvSeverityClass(Number(uvBadge.dataset.uv)));
  }

  const WEATHER_SETTINGS_KEY = 'weatherSettings';
  const defaultWeatherSettings = {
    tempUnit: 'F',
    windUnit: 'mph',
    feelsLike: true,
    uv: true,
    wind: true,
    visibility: true,
    cloud: true,
    severeAlerts: true,
    moonPhase: true,
    sunGradient: true,
    liveSkin: true,
  };
  let storedWeatherSettings = {};
  try {
    storedWeatherSettings = JSON.parse(localStorage.getItem(WEATHER_SETTINGS_KEY) || '{}');
  } catch (e) {
    storedWeatherSettings = {};
  }
  const weatherSettings = Object.assign({}, defaultWeatherSettings, storedWeatherSettings);
  function saveWeatherSettings() {
    localStorage.setItem(WEATHER_SETTINGS_KEY, JSON.stringify(weatherSettings));
  }

  const weatherState = { tempF: 88, hiF: 91, loF: 72, feelsF: 92, windMph: 8, cloudPct: 20 };
  let displayTempUnit = weatherSettings.tempUnit;

  const tempUnitBtn = document.getElementById('weather-temp-unit');
  const hiEl = document.getElementById('weather-hi');
  const loEl = document.getElementById('weather-lo');
  const feelsEl = document.getElementById('weather-feels');
  const windValEl = document.getElementById('wx-wind-val');

  function toF(f) { return Math.round(f); }
  function toC(f) { return Math.round((f - 32) * 5 / 9); }

  function renderWeatherTemps() {
    const conv = displayTempUnit === 'F' ? toF : toC;
    tempUnitBtn.firstChild.textContent = conv(weatherState.tempF) + '°';
    tempUnitBtn.querySelector('.weather-unit').textContent = displayTempUnit;
    hiEl.textContent = '￪' + conv(weatherState.hiF) + '°';
    loEl.textContent = '￬' + conv(weatherState.loF) + '°';

    const diff = weatherState.feelsF - weatherState.tempF;
    const showFeels = weatherSettings.feelsLike && Math.abs(diff) >= 3;
    feelsEl.hidden = !showFeels;
    feelsEl.textContent = showFeels ? (diff > 0 ? '🌡️' : '🌬️') + conv(weatherState.feelsF) + '°' : '';
  }
  renderWeatherTemps();

  tempUnitBtn.addEventListener('click', () => {
    displayTempUnit = displayTempUnit === 'F' ? 'C' : 'F';
    renderWeatherTemps();
  });

  function renderWind() {
    windValEl.textContent = weatherSettings.windUnit === 'kph'
      ? Math.round(weatherState.windMph * 1.60934) + 'kph'
      : Math.round(weatherState.windMph) + 'mph';
  }
  renderWind();

  document.getElementById('weather-emoji-btn').addEventListener('click', () => {
    showComingSoon('Hourly forecast', 'The hourly forecast view is coming in a later pass.');
  });

  function applyWeatherToggles() {
    document.querySelectorAll('#weather-widget [data-toggle]').forEach((el) => {
      if (el.dataset.toggle === 'feelsLike') return;
      el.hidden = !weatherSettings[el.dataset.toggle];
    });
  }
  applyWeatherToggles();

  const weatherOptionsOverlay = document.getElementById('weather-options-overlay');
  const weatherOptionsClose = document.getElementById('weather-options-close');

  function syncWeatherOptionsUI() {
    weatherOptionsOverlay.querySelectorAll('.segmented').forEach((seg) => {
      const setting = seg.dataset.setting;
      seg.querySelectorAll('button').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.value === weatherSettings[setting]);
      });
    });
    weatherOptionsOverlay.querySelectorAll('[data-toggle-setting]').forEach((input) => {
      input.checked = !!weatherSettings[input.dataset.toggleSetting];
    });
  }

  function openWeatherOptions() {
    syncWeatherOptionsUI();
    weatherOptionsOverlay.hidden = false;
  }
  function closeWeatherOptions() {
    weatherOptionsOverlay.hidden = true;
  }
  weatherOptionsClose.addEventListener('click', closeWeatherOptions);
  weatherOptionsOverlay.addEventListener('click', (e) => {
    if (e.target === weatherOptionsOverlay) closeWeatherOptions();
  });

  weatherOptionsOverlay.querySelectorAll('.segmented button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const setting = btn.closest('.segmented').dataset.setting;
      weatherSettings[setting] = btn.dataset.value;
      saveWeatherSettings();
      syncWeatherOptionsUI();
      if (setting === 'tempUnit') {
        displayTempUnit = weatherSettings.tempUnit;
        renderWeatherTemps();
      } else if (setting === 'windUnit') {
        renderWind();
      }
    });
  });

  weatherOptionsOverlay.querySelectorAll('[data-toggle-setting]').forEach((input) => {
    input.addEventListener('change', () => {
      const key = input.dataset.toggleSetting;
      weatherSettings[key] = input.checked;
      saveWeatherSettings();
      applyWeatherToggles();
      if (key === 'feelsLike') renderWeatherTemps();
      if (key === 'sunGradient' || key === 'liveSkin') renderWeatherSkin();
      if (key === 'severeAlerts') applyAlertTicker();
    });
  });

  // --- Sunrise/sunset gradient (v8 spec keyframe logic) ---
  const SUNRISE_SEC = 6 * 3600 + 30 * 60;
  const SUNSET_SEC = 19 * 3600 + 45 * 60;
  const TWILIGHT_HALF = 45 * 60;
  const TWILIGHT_WINDOW = TWILIGHT_HALF * 2;
  const DEEP_NIGHT_SKY = { top: '#020617', bottom: '#020617' };
  const FULL_DAY_SKY = { top: '#4a90e2', bottom: '#d1e8ff' };
  const SUNRISE_KEYFRAMES = [
    { ratio: 0.00, top: '#020617', bottom: '#020617' },
    { ratio: 0.10, top: '#0f172a', bottom: '#581c87' },
    { ratio: 0.25, top: '#2563eb', bottom: '#fca5a5' },
    { ratio: 0.45, top: '#38bdf8', bottom: '#fef08a' },
    { ratio: 1.00, top: '#4a90e2', bottom: '#d1e8ff' },
  ];
  const SUNSET_KEYFRAMES = [
    { ratio: 0.00, top: '#020617', bottom: '#020617' },
    { ratio: 0.10, top: '#0f172a', bottom: '#701a75' },
    { ratio: 0.20, top: '#1a365d', bottom: '#ff4500' },
    { ratio: 0.40, top: '#3568a6', bottom: '#ffb347' },
    { ratio: 1.00, top: '#4a90e2', bottom: '#d1e8ff' },
  ];

  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(rgb) {
    return '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  }
  function lerpColor(hexA, hexB, t) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    return rgbToHex(a.map((v, i) => v + (b[i] - v) * t));
  }
  function interpolateKeyframes(keyframes, xRatio) {
    for (let i = 0; i < keyframes.length - 1; i++) {
      const lower = keyframes[i];
      const upper = keyframes[i + 1];
      if (xRatio >= lower.ratio && xRatio <= upper.ratio) {
        const f = (xRatio - lower.ratio) / (upper.ratio - lower.ratio);
        return { top: lerpColor(lower.top, upper.top, f), bottom: lerpColor(lower.bottom, upper.bottom, f) };
      }
    }
    return keyframes[keyframes.length - 1];
  }
  function computeSkyColors(now) {
    const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    if (nowSec >= SUNRISE_SEC - TWILIGHT_HALF && nowSec <= SUNRISE_SEC + TWILIGHT_HALF) {
      const xRatio = Math.min(1, Math.max(0, (nowSec - (SUNRISE_SEC - TWILIGHT_HALF)) / TWILIGHT_WINDOW));
      return interpolateKeyframes(SUNRISE_KEYFRAMES, xRatio);
    }
    if (nowSec >= SUNSET_SEC - TWILIGHT_HALF && nowSec <= SUNSET_SEC + TWILIGHT_HALF) {
      const xRatio = Math.min(1, Math.max(0, 1 - (nowSec - (SUNSET_SEC - TWILIGHT_HALF)) / TWILIGHT_WINDOW));
      return interpolateKeyframes(SUNSET_KEYFRAMES, xRatio);
    }
    if (nowSec > SUNRISE_SEC + TWILIGHT_HALF && nowSec < SUNSET_SEC - TWILIGHT_HALF) {
      return FULL_DAY_SKY;
    }
    return DEEP_NIGHT_SKY;
  }

  const weatherSkin = document.getElementById('weather-skin');
  function renderWeatherSkin() {
    if (weatherSettings.sunGradient) {
      const sky = computeSkyColors(new Date());
      weatherSkin.style.background = `linear-gradient(to bottom, ${sky.top}, ${sky.bottom})`;
    } else {
      weatherSkin.style.background = '';
    }

    if (weatherSettings.liveSkin) {
      if (!weatherSkin.dataset.cloudsBuilt) {
        weatherSkin.querySelectorAll('.weather-skin-overlay, .wx-skin-cloud').forEach((el) => el.remove());
        const cloudPct = weatherState.cloudPct;
        const overlay = document.createElement('div');
        overlay.className = 'weather-skin-overlay';
        overlay.style.opacity = String(cloudPct / 2 / 100);
        weatherSkin.appendChild(overlay);

        const cloudCount = Math.round(cloudPct / 10);
        const baseDurationSec = 34;
        for (let i = 0; i < cloudCount; i++) {
          const cloud = document.createElement('span');
          cloud.className = 'wx-skin-cloud';
          cloud.textContent = '☁️';
          const size = 1 + Math.random();
          const duration = baseDurationSec / size;
          cloud.style.fontSize = size + 'rem';
          cloud.style.top = (10 + Math.random() * 60) + '%';
          cloud.style.animationDuration = duration + 's';
          cloud.style.animationDelay = (-Math.random() * duration) + 's';
          weatherSkin.appendChild(cloud);
        }
        weatherSkin.dataset.cloudsBuilt = '1';
      }
    } else {
      weatherSkin.querySelectorAll('.weather-skin-overlay, .wx-skin-cloud').forEach((el) => el.remove());
      delete weatherSkin.dataset.cloudsBuilt;
    }
  }
  renderWeatherSkin();

  // --- Severe weather alert ticker ---
  const WEATHER_ALERT_KEY = 'weatherAlertState';
  const sampleAlert = {
    id: 'heat-advisory-sample-1',
    text: '⚠️ Heat Advisory in effect until 8:00 PM for Los Ranchos de Albuquerque, NM — take precautions to avoid heat-related illness. (Tap to dismiss.)',
  };
  let alertState = {};
  try {
    alertState = JSON.parse(localStorage.getItem(WEATHER_ALERT_KEY) || '{}');
  } catch (e) {
    alertState = {};
  }
  function saveAlertState() {
    localStorage.setItem(WEATHER_ALERT_KEY, JSON.stringify(alertState));
  }
  function shouldShowAlert() {
    if (!weatherSettings.severeAlerts) return false;
    if (alertState.dismissedId !== sampleAlert.id) return true;
    const twoHoursMs = 2 * 60 * 60 * 1000;
    return (Date.now() - (alertState.dismissedAt || 0)) >= twoHoursMs;
  }
  const alertTicker = document.getElementById('weather-alert-ticker');
  const alertTrack = document.getElementById('weather-alert-track');
  const weatherFooter = document.getElementById('weather-footer');
  function applyAlertTicker() {
    const show = shouldShowAlert();
    alertTicker.hidden = !show;
    weatherFooter.hidden = show;
    if (show) {
      alertTrack.textContent = sampleAlert.text;
    }
  }
  applyAlertTicker();
  alertTicker.addEventListener('click', () => {
    alertState.dismissedId = sampleAlert.id;
    alertState.dismissedAt = Date.now();
    saveAlertState();
    applyAlertTicker();
  });

  attachLongPress(document.getElementById('weather-widget'), openWeatherOptions);
})();
