(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const settingsOverlay = document.getElementById('settings-overlay');
  const settingsClose = document.getElementById('settings-close');
  const themeAutoToggleInput = document.getElementById('theme-auto-toggle');

  const THEME_AUTO_KEY = 'themeAutoMode';
  const DAY_START_SEC = 7 * 3600;
  const NIGHT_START_SEC = 19 * 3600;
  let themeAutoMode = localStorage.getItem(THEME_AUTO_KEY) === 'true';
  let themeAutoTimer = null;

  function computeAutoTheme(now) {
    const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return (nowSec >= DAY_START_SEC && nowSec < NIGHT_START_SEC) ? 'light' : 'dark';
  }

  function syncThemeDependentUI() {
    updateClock();
    renderWeatherSkin();
  }

  function applyAutoTheme() {
    const next = computeAutoTheme(new Date());
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  function scheduleNextThemeCheck() {
    if (themeAutoTimer) clearTimeout(themeAutoTimer);
    if (!themeAutoMode) return;
    const now = new Date();
    const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    let nextBoundarySec;
    if (nowSec < DAY_START_SEC) nextBoundarySec = DAY_START_SEC;
    else if (nowSec < NIGHT_START_SEC) nextBoundarySec = NIGHT_START_SEC;
    else nextBoundarySec = DAY_START_SEC + 24 * 3600;
    const msUntil = (nextBoundarySec - nowSec) * 1000 - now.getMilliseconds();
    themeAutoTimer = setTimeout(() => {
      applyAutoTheme();
      syncThemeDependentUI();
      scheduleNextThemeCheck();
    }, msUntil);
  }

  const storedTheme = localStorage.getItem('theme');
  if (themeAutoMode) {
    applyAutoTheme();
    scheduleNextThemeCheck();
  } else if (storedTheme) {
    root.setAttribute('data-theme', storedTheme);
  }
  themeAutoToggleInput.checked = themeAutoMode;

  themeToggle.addEventListener('click', () => {
    if (themeAutoMode) {
      themeAutoMode = false;
      localStorage.setItem(THEME_AUTO_KEY, 'false');
      if (themeAutoTimer) { clearTimeout(themeAutoTimer); themeAutoTimer = null; }
      themeAutoToggleInput.checked = false;
    }
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncThemeDependentUI();
  });

  const WEATHERAPI_KEY_STORAGE = 'weatherApiKey';
  const weatherApiKeyInput = document.getElementById('weatherapi-key-input');
  weatherApiKeyInput.value = localStorage.getItem(WEATHERAPI_KEY_STORAGE) || '';
  weatherApiKeyInput.addEventListener('change', () => {
    const key = weatherApiKeyInput.value.trim();
    if (key) localStorage.setItem(WEATHERAPI_KEY_STORAGE, key);
    else localStorage.removeItem(WEATHERAPI_KEY_STORAGE);
    refreshLiveWeather(true);
  });

  function openSettings() {
    themeAutoToggleInput.checked = themeAutoMode;
    settingsOverlay.hidden = false;
  }
  function closeSettings() {
    settingsOverlay.hidden = true;
  }
  settingsClose.addEventListener('click', closeSettings);
  settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) closeSettings();
  });

  themeAutoToggleInput.addEventListener('change', () => {
    themeAutoMode = themeAutoToggleInput.checked;
    localStorage.setItem(THEME_AUTO_KEY, String(themeAutoMode));
    if (themeAutoMode) {
      applyAutoTheme();
      syncThemeDependentUI();
      scheduleNextThemeCheck();
    } else if (themeAutoTimer) {
      clearTimeout(themeAutoTimer);
      themeAutoTimer = null;
    }
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

  document.getElementById('profile-btn').addEventListener('click', openSettings);

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
    const rootStyle = getComputedStyle(document.documentElement);
    const dayFill = rootStyle.getPropertyValue('--clock-analog-day').trim() || '#fff';
    const nightFill = rootStyle.getPropertyValue('--clock-analog-night').trim() || '#c9c9c9';

    svg.appendChild(svgEl('circle', { cx, cy, r: 48, fill: dayFill, stroke: '#333', 'stroke-width': 1 }));

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
        const p = polarPoint(cx, cy, 34, n * 30);
        const t = svgEl('text', { x: p.x, y: p.y + 3, 'text-anchor': 'middle', 'font-size': 9, fill: '#222' });
        t.textContent = String(n);
        svg.appendChild(t);
      });
      const totalMin = (now.getHours() % 12) * 60 + now.getMinutes();
      addHand(svg, cx, cy, (totalMin / 720) * 360, 24, 2.5, '#222');
      addHand(svg, cx, cy, (now.getMinutes() / 60) * 360, 36, 1.5, '#222');
    } else {
      const innerR = 34;
      svg.appendChild(svgEl('circle', { cx, cy, r: innerR, fill: dayFill }));
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

  const weatherState = {
    tempF: 88, hiF: 91, loF: 72, feelsF: 92, windMph: 8, cloudPct: 20,
    humidity: 55, dewPointF: 68, uv: 6, visibilityMi: 10, moonPhase: 'Full Moon',
    conditionCode: null, conditionText: 'Moderate or heavy freezing rain',
    locationName: 'Los Ranchos de Albuquerque, NM', tzId: null,
    sunrise: null, sunset: null, alerts: [], hourly: [],
  };
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

  const visibilityValEl = document.getElementById('wx-visibility-val');
  const cloudPctValEl = document.getElementById('wx-cloudpct-val');
  const humidityValEl = document.getElementById('wx-humidity-val');
  const dewPointValEl = document.getElementById('wx-dewpoint-val');
  const moonPhaseValEl = document.getElementById('wx-moonphase-val');
  const moonPhaseIconEl = document.getElementById('wx-moonphase-icon');
  const uvValEl = document.getElementById('wx-uv-val');
  const locationEl = document.getElementById('weather-location');
  const descEl = document.getElementById('weather-desc');

  const WX_MOON_PHASE_ICONS = {
    'New Moon': '🌑', 'Waxing Crescent': '🌒', 'First Quarter': '🌓', 'Waxing Gibbous': '🌔',
    'Full Moon': '🌕', 'Waning Gibbous': '🌖', 'Last Quarter': '🌗', 'Waning Crescent': '🌘',
  };

  function renderWeatherExtras() {
    const conv = displayTempUnit === 'F' ? toF : toC;
    visibilityValEl.textContent = Math.round(weatherState.visibilityMi) + 'mi';
    cloudPctValEl.textContent = Math.round(weatherState.cloudPct) + '%';
    humidityValEl.textContent = Math.round(weatherState.humidity) + '%';
    dewPointValEl.textContent = conv(weatherState.dewPointF) + '°';
    moonPhaseValEl.textContent = weatherState.moonPhase;
    moonPhaseIconEl.textContent = WX_MOON_PHASE_ICONS[weatherState.moonPhase] || moonPhaseIconEl.textContent;
    uvValEl.textContent = String(Math.round(weatherState.uv));
    if (uvBadge) {
      uvBadge.className = 'uv-badge ' + uvSeverityClass(Number(weatherState.uv));
      uvBadge.dataset.uv = String(Math.round(weatherState.uv));
    }
    locationEl.textContent = weatherState.locationName;
    descEl.textContent = weatherState.conditionText;
  }
  renderWeatherExtras();

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
  function lerpRgb(rgbA, rgbB, t) {
    return rgbA.map((v, i) => v + (rgbB[i] - v) * t);
  }
  function parseCssColor(str) {
    const m = str.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/);
    return m ? [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])] : [255, 255, 255];
  }
  function relativeLuminance(rgb) {
    const [r, g, b] = rgb.map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
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
  // Shared boundary math: xRatio is 0 at the night end of a transition window and 1 at the day
  // end, consistently for both sunrise and sunset, and pinned to 0/1 outside the windows. Both
  // the sky-color interpolation and the star-fade factor read from this one place.
  function computeSkyPhase(now) {
    const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    if (nowSec >= SUNRISE_SEC - TWILIGHT_HALF && nowSec <= SUNRISE_SEC + TWILIGHT_HALF) {
      const xRatio = Math.min(1, Math.max(0, (nowSec - (SUNRISE_SEC - TWILIGHT_HALF)) / TWILIGHT_WINDOW));
      return { window: 'sunrise', xRatio };
    }
    if (nowSec >= SUNSET_SEC - TWILIGHT_HALF && nowSec <= SUNSET_SEC + TWILIGHT_HALF) {
      const xRatio = Math.min(1, Math.max(0, 1 - (nowSec - (SUNSET_SEC - TWILIGHT_HALF)) / TWILIGHT_WINDOW));
      return { window: 'sunset', xRatio };
    }
    if (nowSec > SUNRISE_SEC + TWILIGHT_HALF && nowSec < SUNSET_SEC - TWILIGHT_HALF) {
      return { window: 'day', xRatio: 1 };
    }
    return { window: 'night', xRatio: 0 };
  }
  function computeSkyColors(now) {
    const phase = computeSkyPhase(now);
    if (phase.window === 'sunrise') return interpolateKeyframes(SUNRISE_KEYFRAMES, phase.xRatio);
    if (phase.window === 'sunset') return interpolateKeyframes(SUNSET_KEYFRAMES, phase.xRatio);
    if (phase.window === 'day') return FULL_DAY_SKY;
    return DEEP_NIGHT_SKY;
  }
  // Continuous 0 (full day) - 1 (full night) value, for the star-fade multiplier when the
  // Sunrise/Sunset Gradient toggle is on (fade through the transition rather than hard-cutting).
  function computeNightFactor(now) {
    return 1 - computeSkyPhase(now).xRatio;
  }

  const weatherSkin = document.getElementById('weather-skin');
  const weatherWidgetEl = document.getElementById('weather-widget');

  // --- Testing panel state (temporary dev tool, not part of the real app) ---
  const weatherTestState = {
    timeOverrideSec: null,
    cloudOverridePct: null,
    textStroke: false,
    conditionSkins: new Set(),
  };

  // Real (non-test) active conditions, derived from live data. Declared here (early) rather
  // than down by the rest of the live-weather code because renderWeatherSkin()'s very first
  // synchronous call at load time already needs getEffectiveConditionSkins() — declaring it
  // later caused a temporal-dead-zone crash that silently prevented the initial fetch from
  // ever running.
  const weatherLiveConditions = new Set();
  function getEffectiveConditionSkins() {
    return weatherTestState.conditionSkins.size > 0 ? weatherTestState.conditionSkins : weatherLiveConditions;
  }

  function getEffectiveSkyTime() {
    if (weatherTestState.timeOverrideSec === null) return new Date();
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setSeconds(weatherTestState.timeOverrideSec);
    return d;
  }

  function getEffectiveCloudPct() {
    return weatherTestState.cloudOverridePct !== null ? weatherTestState.cloudOverridePct : weatherState.cloudPct;
  }

  const WX_TEXT_LIGHT = '#000000';
  const WX_TEXT_DARK = '#808080';
  const WX_TEXT_THRESHOLD_MARGIN = 0.05;
  const WX_TEXT_LUMINANCE_THRESHOLD = relativeLuminance(hexToRgb(WX_TEXT_DARK)) - WX_TEXT_THRESHOLD_MARGIN;
  const WX_CLOUD_OFFSCREEN_BUFFER_PX = 4;

  // Star colors: mostly white/near-white, a minority visibly tinted. Weighted pick at creation.
  const WX_STAR_COLORS = [
    { rgb: [255, 255, 255], weight: 70 },
    { rgb: [202, 225, 255], weight: 12 }, // blue-white
    { rgb: [255, 244, 214], weight: 10 }, // pale yellow
    { rgb: [255, 210, 161], weight: 8 },  // pale orange
  ];
  function pickStarColor() {
    const total = WX_STAR_COLORS.reduce((sum, c) => sum + c.weight, 0);
    let r = Math.random() * total;
    for (const c of WX_STAR_COLORS) {
      if (r < c.weight) return c.rgb;
      r -= c.weight;
    }
    return WX_STAR_COLORS[0].rgb;
  }

  // Cloud overlay tint: no longer a fixed gray — derived from the current sky color's own
  // brightness, scaled by a day/night base plus a per-condition darkening shift. All tunable
  // live via the testing panel sliders.
  const WX_CLOUD_TUNABLES = {
    dayBasePct: 40,
    nightBasePct: 40,
    lightRainPct: 10,
    heavyRainPct: 20,
    thunderstormPct: 40,
  };

  function isDaytime(now) {
    const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return nowSec >= SUNRISE_SEC - TWILIGHT_HALF && nowSec <= SUNSET_SEC + TWILIGHT_HALF;
  }

  // "Clear" is the absence of any of these — not its own explicit signal. Clear Day/Clear Night
  // are inferred from isDaytime()/computeNightFactor() rather than being selectable states.
  const WX_PRECIP_CONDITION_KEYS = ['lightRain', 'heavyRain', 'thunderstorm', 'snow', 'hail', 'fog'];
  function isConditionClear(conditionSkins) {
    return !WX_PRECIP_CONDITION_KEYS.some((k) => conditionSkins.has(k));
  }

  function conditionShiftPct(conditionSkins) {
    if (conditionSkins.has('thunderstorm')) return WX_CLOUD_TUNABLES.thunderstormPct;
    if (conditionSkins.has('heavyRain')) return WX_CLOUD_TUNABLES.heavyRainPct;
    if (conditionSkins.has('lightRain')) return WX_CLOUD_TUNABLES.lightRainPct;
    return 0;
  }

  function computeCloudTint(now, conditionSkins) {
    const sky = computeSkyColors(now);
    const skyRgb = hexToRgb(lerpColor(sky.top, sky.bottom, 0.5));
    const daytime = isDaytime(now);
    const basePct = daytime ? -WX_CLOUD_TUNABLES.dayBasePct : WX_CLOUD_TUNABLES.nightBasePct;
    const multiplier = 1 + basePct / 100 - conditionShiftPct(conditionSkins) / 100;
    const rgb = skyRgb.map((v) => Math.max(0, Math.min(255, v * multiplier)));
    return { rgb, multiplier, daytime };
  }

  function cloudOverlayOpacity(cloudPct, daytime) {
    return daytime ? cloudPct / 2 / 100 : cloudPct / 100;
  }

  function updateCloudTestingReadout(cloudTint, opacityFraction) {
    const readout = document.getElementById('test-cloud-readout');
    const swatch = document.getElementById('test-cloud-swatch');
    const hexEl = document.getElementById('test-cloud-hex');
    if (!readout) return;
    if (!cloudTint) {
      readout.textContent = 'Branch: — · Brightness: — of sky · Opacity: —';
      swatch.style.background = 'transparent';
      hexEl.textContent = '—';
      return;
    }
    const hex = rgbToHex(cloudTint.rgb);
    readout.textContent = `Branch: ${cloudTint.daytime ? 'Day' : 'Night'} · Brightness: ${Math.round(cloudTint.multiplier * 100)}% of sky · Opacity: ${Math.round(opacityFraction * 100)}%`;
    swatch.style.background = hex;
    hexEl.textContent = hex;
  }

  function randomizeCloud(cloud) {
    const topPct = Math.random() * 50;
    const f = topPct / 50;
    const size = 2.5 - 1.5 * f;
    const duration = 17 + 43 * f;
    cloud.style.fontSize = size + 'rem';
    cloud.style.top = topPct + '%';
    cloud.style.animationDuration = duration + 's';
    cloud.style.setProperty('--cloud-w', (cloud.offsetWidth + WX_CLOUD_OFFSCREEN_BUFFER_PX) + 'px');
  }

  // Respawning a cloud by mutating a running animation's duration/delay in place causes the
  // browser to reinterpret its current cycle position and jump — confirmed via isolated repro.
  // The reliable fix is to replace the element entirely: a freshly-created element just starts
  // a clean animation from its own "from" keyframe, nothing to reinterpret.
  function spawnCloud(oldCloud) {
    const cloud = document.createElement('span');
    cloud.className = 'wx-skin-cloud';
    cloud.textContent = '☁️';
    if (oldCloud) {
      weatherSkin.replaceChild(cloud, oldCloud);
    } else {
      weatherSkin.appendChild(cloud);
    }
    randomizeCloud(cloud);
    cloud.addEventListener('animationiteration', () => spawnCloud(cloud));
    return cloud;
  }

  // Mobile Chrome can throttle or reset running CSS animation state for a backgrounded tab.
  // Nothing here listens for that, so a cloud's drift position can come back wrong (stacked at
  // the left edge) after switching away and back. Re-stagger every existing cloud the same safe
  // way the initial batch gets staggered whenever the page becomes visible again — cheap, and a
  // no-op in normal use since this only fires on an actual hide->show transition, not on load.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    weatherSkin.querySelectorAll('.wx-skin-cloud').forEach((oldCloud) => {
      const cloud = spawnCloud(oldCloud);
      cloud.style.animationDelay = (-Math.random() * parseFloat(cloud.style.animationDuration)) + 's';
    });
  });

  // --- Live Condition Skin: precipitation/effect layers (rain, snow, hail, lightning, stars, rays, fog) ---
  // Not blocked on the WeatherAPI connection: driven entirely by the "Preview Condition Skins" testing
  // panel picker (weatherTestState.conditionSkins), since there's no live condition data yet.
  const precipCanvas = document.createElement('canvas');
  precipCanvas.className = 'weather-skin-precip';
  const precipCtx = precipCanvas.getContext('2d');
  const flashDiv = document.createElement('div');
  flashDiv.className = 'weather-skin-flash';

  let conditionParticles = [];
  let conditionStars = [];
  let conditionFog = [];
  let flashState = { until: 0, nextAt: 0, opacity: 0 };
  let lastParticleKey = '';

  function rebuildConditionParticles(c, w, h, ts) {
    conditionParticles = [];
    const heavy = c.has('heavyRain') || c.has('thunderstorm');
    const rainCount = heavy ? 45 : (c.has('lightRain') ? 17 : 0);
    for (let i = 0; i < rainCount; i++) {
      conditionParticles.push({
        type: 'rain', x: Math.random() * w, y: Math.random() * h,
        speed: heavy ? 6 + Math.random() * 2 : 3 + Math.random() * 1.5,
        len: 8 + Math.random() * 6,
      });
    }
    if (c.has('snow')) {
      for (let i = 0; i < 25; i++) {
        conditionParticles.push({
          type: 'snow', x: Math.random() * w, y: Math.random() * h,
          speed: 0.6 + Math.random() * 0.6, r: 1.5 + Math.random() * 1.5,
          swayPhase: Math.random() * Math.PI * 2, swaySpeed: 0.5 + Math.random() * 0.5, swayAmp: 4 + Math.random() * 4,
        });
      }
    }
    if (c.has('hail')) {
      for (let i = 0; i < 30; i++) {
        conditionParticles.push({
          type: 'hail', x: Math.random() * w, y: Math.random() * h,
          speed: 7 + Math.random() * 2, r: 2 + Math.random() * 1.2, state: 'fall', bounceT: 0,
        });
      }
    }
    conditionFog = c.has('fog')
      ? Array.from({ length: 2 + Math.floor(Math.random() * 2) }, () => ({
          x: Math.random() * w, y: h * (0.2 + Math.random() * 0.6), r: w * 0.35 + Math.random() * w * 0.15,
          speed: 3 + Math.random() * 3, dir: Math.random() < 0.5 ? 1 : -1,
        }))
      : [];
    // Stars exist whenever the sky is clear (no precip condition active) — day/night visibility
    // is gated per-frame in stepConditionSkin, not here, so their flicker state survives the
    // sunrise/sunset boundary instead of being torn down and rebuilt at it.
    conditionStars = isConditionClear(c)
      ? Array.from({ length: 15 + Math.floor(Math.random() * 11) }, () => {
          const isDim = Math.random() < 0.2;
          const baseline = isDim ? 0.15 + Math.random() * 0.2 : 0.75 + Math.random() * 0.25;
          return {
            x: Math.random() * w, y: Math.random() * h * 0.8, r: 0.4 + Math.random() * 0.6,
            color: pickStarColor(), isDim, baseline,
            flickerStart: -1, flickerDur: 0, flickerDelta: 0,
            nextFlickerAt: ts + 500 + Math.random() * 6000,
          };
        })
      : [];
  }

  function stepConditionSkin(ts) {
    requestAnimationFrame(stepConditionSkin);
    const c = getEffectiveConditionSkins();
    if (!weatherSettings.liveSkin) {
      if (precipCanvas.width) precipCtx.clearRect(0, 0, precipCanvas.width, precipCanvas.height);
      flashDiv.style.opacity = '0';
      return;
    }
    const rect = weatherSkin.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = window.devicePixelRatio || 1;
    const key = [...c].sort().join(',') + '|' + w + 'x' + h + '@' + dpr;
    if (key !== lastParticleKey) {
      precipCanvas.width = Math.round(w * dpr);
      precipCanvas.height = Math.round(h * dpr);
      precipCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildConditionParticles(c, w, h, ts);
      lastParticleKey = key;
    }
    precipCtx.clearRect(0, 0, w, h);

    precipCtx.strokeStyle = (c.has('heavyRain') || c.has('thunderstorm')) ? 'rgba(120,140,170,0.55)' : 'rgba(160,180,200,0.45)';
    precipCtx.lineWidth = 1.2;
    for (const p of conditionParticles) {
      if (p.type !== 'rain') continue;
      p.y += p.speed;
      p.x += p.speed * 0.25;
      if (p.y > h) { p.y = -p.len; p.x = Math.random() * w; }
      precipCtx.beginPath();
      precipCtx.moveTo(p.x, p.y);
      precipCtx.lineTo(p.x - p.len * 0.3, p.y - p.len);
      precipCtx.stroke();
    }

    precipCtx.fillStyle = 'rgba(255,255,255,0.9)';
    for (const p of conditionParticles) {
      if (p.type !== 'snow') continue;
      p.y += p.speed;
      p.swayPhase += 0.02 * p.swaySpeed;
      if (p.y > h) { p.y = -4; p.x = Math.random() * w; }
      const x = p.x + Math.sin(p.swayPhase) * p.swayAmp;
      precipCtx.beginPath();
      precipCtx.arc(x, p.y, p.r, 0, Math.PI * 2);
      precipCtx.fill();
    }

    precipCtx.fillStyle = 'rgba(230,235,240,0.95)';
    for (const p of conditionParticles) {
      if (p.type !== 'hail') continue;
      if (p.state === 'fall') {
        p.y += p.speed;
        if (p.y > h - p.r) {
          p.state = 'bounce';
          p.bounceT = 0;
          p.bounceFromY = h - p.r;
        }
      } else {
        p.bounceT += 1;
        const hop = Math.sin(Math.min(p.bounceT / 10, 1) * Math.PI) * 8;
        p.y = p.bounceFromY - hop;
        if (p.bounceT > 14) {
          p.state = 'fall';
          p.y = -4;
          p.x = Math.random() * w;
        }
      }
      precipCtx.globalAlpha = p.state === 'bounce' ? Math.max(0, 1 - p.bounceT / 14) : 1;
      precipCtx.beginPath();
      precipCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      precipCtx.fill();
      precipCtx.globalAlpha = 1;
    }

    for (const b of conditionFog) {
      b.x += b.speed * 0.02 * b.dir;
      if (b.x - b.r > w) b.x = -b.r;
      if (b.x + b.r < 0) b.x = w + b.r;
      const grad = precipCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, 'rgba(220,220,225,0.14)');
      grad.addColorStop(1, 'rgba(220,220,225,0)');
      precipCtx.fillStyle = grad;
      precipCtx.beginPath();
      precipCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      precipCtx.fill();
    }

    // Stars: mostly steady at their own baseline brightness, with occasional brief (well under a
    // second), asynchronous dips (usually-bright stars) or flares (usually-dim stars) — real
    // scintillation, not a continuous pulse. Visibility as a whole fades with the sunrise/sunset
    // transition when the gradient toggle is on, or hard-cuts at the day/night boundary when off.
    const skyTime = getEffectiveSkyTime();
    const starVisibility = weatherSettings.sunGradient ? computeNightFactor(skyTime) : (isDaytime(skyTime) ? 0 : 1);
    if (starVisibility > 0) {
      for (const s of conditionStars) {
        if (s.flickerStart < 0 && ts >= s.nextFlickerAt) {
          s.flickerStart = ts;
          s.flickerDur = 150 + Math.random() * 500;
          const swing = (s.isDim ? 1 - s.baseline : s.baseline) * (0.6 + Math.random() * 0.4);
          s.flickerDelta = s.isDim ? swing : -swing;
        }
        let opacity = s.baseline;
        if (s.flickerStart >= 0) {
          const elapsed = ts - s.flickerStart;
          if (elapsed >= s.flickerDur) {
            s.flickerStart = -1;
            s.nextFlickerAt = ts + 2000 + Math.random() * 6000;
          } else {
            const ease = Math.sin((elapsed / s.flickerDur) * Math.PI);
            opacity = s.baseline + s.flickerDelta * ease;
          }
        }
        opacity = Math.max(0, Math.min(1, opacity)) * starVisibility;
        precipCtx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${opacity.toFixed(2)})`;
        precipCtx.beginPath();
        precipCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        precipCtx.fill();
      }
    }

    if (c.has('thunderstorm')) {
      if (ts > flashState.nextAt) {
        flashState.until = ts + 100 + Math.random() * 50;
        flashState.opacity = 0.2 + Math.random() * 0.1;
        flashState.nextAt = ts + 8000 + Math.random() * 12000;
      }
      flashDiv.style.opacity = ts < flashState.until ? String(flashState.opacity) : '0';
    } else {
      flashDiv.style.opacity = '0';
    }
  }
  requestAnimationFrame(stepConditionSkin);

  function renderWeatherSkin() {
    const hasFlourish = weatherSettings.sunGradient || weatherSettings.liveSkin;
    weatherWidgetEl.classList.toggle('no-white-bg', hasFlourish);
    weatherWidgetEl.classList.toggle('test-text-stroke', weatherTestState.textStroke);

    // Day/night is a base fact independent of the gradient toggle: with the toggle on, the full
    // multi-stop sunrise/sunset transition applies; with it off but Live Skin on, a flat
    // day-or-night background still applies (no twilight blending, hard cut at the boundary)
    // instead of no background at all. With both off, there's no background, as before.
    let sky = null;
    if (weatherSettings.sunGradient) {
      sky = computeSkyColors(getEffectiveSkyTime());
      weatherSkin.style.background = `linear-gradient(to bottom, ${sky.top}, ${sky.bottom})`;
      weatherSkin.style.opacity = '1';
    } else if (weatherSettings.liveSkin) {
      sky = isDaytime(getEffectiveSkyTime()) ? FULL_DAY_SKY : DEEP_NIGHT_SKY;
      weatherSkin.style.background = `linear-gradient(to bottom, ${sky.top}, ${sky.bottom})`;
      weatherSkin.style.opacity = '1';
    } else {
      weatherSkin.style.background = '';
      weatherSkin.style.opacity = '';
    }

    weatherSkin.querySelectorAll('.weather-skin-overlay, .wx-skin-cloud').forEach((el) => el.remove());
    const cloudPct = getEffectiveCloudPct();
    let cloudTint = null;
    if (weatherSettings.liveSkin) {
      cloudTint = computeCloudTint(getEffectiveSkyTime(), getEffectiveConditionSkins());
      const overlay = document.createElement('div');
      overlay.className = 'weather-skin-overlay';
      overlay.style.background = rgbToHex(cloudTint.rgb);
      overlay.style.opacity = String(cloudOverlayOpacity(cloudPct, cloudTint.daytime));
      weatherSkin.appendChild(overlay);
      // Fixed layer order: gradient -> cloud overlay -> precipitation -> floating clouds -> lightning flash.
      weatherSkin.appendChild(precipCanvas);

      const cloudCount = Math.floor(cloudPct / 10);
      for (let i = 0; i < cloudCount; i++) {
        const cloud = spawnCloud();
        // Stagger only the initial batch so they don't all start in lockstep; respawns via
        // spawnCloud(oldCloud) deliberately get no delay — a fresh element just starts cleanly.
        cloud.style.animationDelay = (-Math.random() * parseFloat(cloud.style.animationDuration)) + 's';
      }

      weatherSkin.appendChild(flashDiv);
      updateCloudTestingReadout(cloudTint, cloudOverlayOpacity(cloudPct, cloudTint.daytime));
    } else {
      precipCanvas.remove();
      flashDiv.remove();
      updateCloudTestingReadout(null, 0);
    }

    if (hasFlourish) {
      // White base is always off here (no-white-bg is set above whenever hasFlourish), so the
      // composite starts from the sky gradient if there is one, otherwise from the page's own
      // background showing through the now-transparent widget (not the widget's own computed
      // color, which is transparent and would misread as black).
      let composite = sky
        ? hexToRgb(lerpColor(sky.top, sky.bottom, 0.5))
        : parseCssColor(getComputedStyle(document.body).backgroundColor);
      if (weatherSettings.liveSkin && cloudTint) {
        composite = lerpRgb(composite, cloudTint.rgb, cloudOverlayOpacity(cloudPct, cloudTint.daytime));
      }
      const textColor = relativeLuminance(composite) > WX_TEXT_LUMINANCE_THRESHOLD ? WX_TEXT_LIGHT : WX_TEXT_DARK;
      weatherWidgetEl.style.setProperty('--wx-text-color', textColor);
    } else {
      weatherWidgetEl.style.removeProperty('--wx-text-color');
    }
  }
  renderWeatherSkin();

  // --- Testing panel wiring ---
  (function setupTestingPanel() {
    const overlay = document.getElementById('testing-panel-overlay');
    const trigger = document.getElementById('testing-panel-trigger');
    const closeBtn = document.getElementById('testing-panel-close');
    const timeEnabled = document.getElementById('test-time-enabled');
    const timeInput = document.getElementById('test-time-input');
    const cloudSlider = document.getElementById('test-cloud-slider');
    const cloudValue = document.getElementById('test-cloud-value');
    const textStrokeToggle = document.getElementById('test-textstroke-toggle');
    const conditionSkinToggles = document.querySelectorAll('.test-condition-skin');
    const dayBaseSlider = document.getElementById('test-cloud-daybase-slider');
    const dayBaseValue = document.getElementById('test-cloud-daybase-value');
    const nightBaseSlider = document.getElementById('test-cloud-nightbase-slider');
    const nightBaseValue = document.getElementById('test-cloud-nightbase-value');
    const lightRainSlider = document.getElementById('test-cloud-lightrain-slider');
    const lightRainValue = document.getElementById('test-cloud-lightrain-value');
    const heavyRainSlider = document.getElementById('test-cloud-heavyrain-slider');
    const heavyRainValue = document.getElementById('test-cloud-heavyrain-value');
    const thunderstormSlider = document.getElementById('test-cloud-thunderstorm-slider');
    const thunderstormValue = document.getElementById('test-cloud-thunderstorm-value');
    const resetBtn = document.getElementById('test-reset-btn');

    function timeStringToSeconds(str) {
      const [h, m] = str.split(':').map(Number);
      return h * 3600 + m * 60;
    }
    function secondsToTimeString(sec) {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    }

    trigger.addEventListener('click', () => { overlay.hidden = false; });
    closeBtn.addEventListener('click', () => { overlay.hidden = true; });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.hidden = true; });

    timeEnabled.addEventListener('change', () => {
      weatherTestState.timeOverrideSec = timeEnabled.checked ? timeStringToSeconds(timeInput.value) : null;
      renderWeatherSkin();
    });
    timeInput.addEventListener('input', () => {
      if (timeEnabled.checked) {
        weatherTestState.timeOverrideSec = timeStringToSeconds(timeInput.value);
        renderWeatherSkin();
      }
    });

    cloudSlider.addEventListener('input', () => {
      weatherTestState.cloudOverridePct = Number(cloudSlider.value);
      cloudValue.textContent = cloudSlider.value + '%';
      renderWeatherSkin();
    });

    textStrokeToggle.addEventListener('change', () => {
      weatherTestState.textStroke = textStrokeToggle.checked;
      renderWeatherSkin();
    });

    conditionSkinToggles.forEach((cb) => {
      cb.addEventListener('change', () => {
        if (cb.checked) weatherTestState.conditionSkins.add(cb.value);
        else weatherTestState.conditionSkins.delete(cb.value);
        renderWeatherSkin();
      });
    });

    function bindCloudTunable(slider, valueEl, key) {
      slider.addEventListener('input', () => {
        WX_CLOUD_TUNABLES[key] = Number(slider.value);
        valueEl.textContent = slider.value + '%';
        renderWeatherSkin();
      });
    }
    bindCloudTunable(dayBaseSlider, dayBaseValue, 'dayBasePct');
    bindCloudTunable(nightBaseSlider, nightBaseValue, 'nightBasePct');
    bindCloudTunable(lightRainSlider, lightRainValue, 'lightRainPct');
    bindCloudTunable(heavyRainSlider, heavyRainValue, 'heavyRainPct');
    bindCloudTunable(thunderstormSlider, thunderstormValue, 'thunderstormPct');

    resetBtn.addEventListener('click', () => {
      weatherTestState.timeOverrideSec = null;
      weatherTestState.cloudOverridePct = null;
      weatherTestState.textStroke = false;
      weatherTestState.conditionSkins.clear();
      timeEnabled.checked = false;
      timeInput.value = secondsToTimeString(SUNSET_SEC);
      cloudSlider.value = 20;
      cloudValue.textContent = '20%';
      textStrokeToggle.checked = false;
      conditionSkinToggles.forEach((cb) => { cb.checked = false; });
      WX_CLOUD_TUNABLES.dayBasePct = 40;
      WX_CLOUD_TUNABLES.nightBasePct = 40;
      WX_CLOUD_TUNABLES.lightRainPct = 10;
      WX_CLOUD_TUNABLES.heavyRainPct = 20;
      WX_CLOUD_TUNABLES.thunderstormPct = 40;
      dayBaseSlider.value = 40; dayBaseValue.textContent = '40%';
      nightBaseSlider.value = 40; nightBaseValue.textContent = '40%';
      lightRainSlider.value = 10; lightRainValue.textContent = '10%';
      heavyRainSlider.value = 20; heavyRainValue.textContent = '20%';
      thunderstormSlider.value = 40; thunderstormValue.textContent = '40%';
      renderWeatherSkin();
    });
  })();

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
  function currentAlert() {
    if (weatherState.alerts && weatherState.alerts.length > 0) {
      const a = weatherState.alerts[0];
      const headline = a.headline || a.event || 'Weather Alert';
      return { id: headline, text: `⚠️ ${headline}${a.desc ? ' — ' + a.desc : ''} (Tap to dismiss.)` };
    }
    return sampleAlert;
  }
  function shouldShowAlert() {
    if (!weatherSettings.severeAlerts) return false;
    const alert = currentAlert();
    if (alertState.dismissedId !== alert.id) return true;
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
      alertTrack.textContent = currentAlert().text;
    }
  }
  applyAlertTicker();
  alertTicker.addEventListener('click', () => {
    const alert = currentAlert();
    alertState.dismissedId = alert.id;
    alertState.dismissedAt = Date.now();
    saveAlertState();
    applyAlertTicker();
  });

  // --- Live WeatherAPI.com integration ---
  const WEATHER_CACHE_KEY = 'weatherLiveCache';
  const WEATHER_STALE_MS = 15 * 60 * 1000;
  // Fallback location matches the original placeholder text (Los Ranchos de Albuquerque, NM),
  // used only if geolocation is unavailable, declined, or times out.
  const FALLBACK_COORDS = { lat: 35.1497, lon: -106.6764 };

  // WeatherAPI condition codes mapped to the existing Live Condition Skin keys. WeatherAPI's
  // free condition-code set has no distinct "hail" code, so hail isn't mappable this way yet.
  const WX_CONDITION_MAP = {
    1087: 'thunderstorm', 1273: 'thunderstorm', 1276: 'thunderstorm', 1279: 'thunderstorm', 1282: 'thunderstorm',
    1192: 'heavyRain', 1195: 'heavyRain', 1201: 'heavyRain', 1243: 'heavyRain', 1246: 'heavyRain',
    1063: 'lightRain', 1150: 'lightRain', 1153: 'lightRain', 1168: 'lightRain', 1171: 'lightRain',
    1180: 'lightRain', 1183: 'lightRain', 1186: 'lightRain', 1189: 'lightRain', 1198: 'lightRain', 1240: 'lightRain',
    1066: 'snow', 1069: 'snow', 1072: 'snow', 1114: 'snow', 1117: 'snow',
    1204: 'snow', 1207: 'snow', 1210: 'snow', 1213: 'snow', 1216: 'snow', 1219: 'snow', 1222: 'snow', 1225: 'snow',
    1237: 'snow', 1249: 'snow', 1252: 'snow', 1255: 'snow', 1258: 'snow', 1261: 'snow', 1264: 'snow',
    1030: 'fog', 1135: 'fog', 1147: 'fog',
  };
  function mapConditionCode(code) {
    return WX_CONDITION_MAP[code] || null;
  }

  function getCoords() {
    // geolocation's own `timeout` option isn't reliable when a permission prompt is left
    // unanswered rather than explicitly denied — it can hang indefinitely in that case. Race
    // it against an explicit JS-level timeout so a fetch is never blocked forever.
    return new Promise((resolve) => {
      let settled = false;
      const settle = (coords) => { if (!settled) { settled = true; resolve(coords); } };
      if (!('geolocation' in navigator)) { settle(FALLBACK_COORDS); return; }
      setTimeout(() => settle(FALLBACK_COORDS), 9000);
      navigator.geolocation.getCurrentPosition(
        (pos) => settle({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => settle(FALLBACK_COORDS),
        { timeout: 8000, maximumAge: 30 * 60 * 1000 }
      );
    });
  }

  function tzAbbreviation(tzId) {
    if (!tzId) return '';
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: tzId, timeZoneName: 'short' }).formatToParts(new Date());
      const tzPart = parts.find((p) => p.type === 'timeZoneName');
      if (tzPart && tzPart.value && !/^GMT/.test(tzPart.value)) return tzPart.value;
      const offsetParts = new Intl.DateTimeFormat('en-US', { timeZone: tzId, timeZoneName: 'shortOffset' }).formatToParts(new Date());
      const offsetPart = offsetParts.find((p) => p.type === 'timeZoneName');
      return offsetPart ? offsetPart.value.replace('GMT', 'UTC') : '';
    } catch (e) {
      return '';
    }
  }

  function applyLiveWeatherData(data) {
    const loc = data.location || {};
    const cur = data.current || {};
    const fday = (data.forecast && data.forecast.forecastday && data.forecast.forecastday[0]) || {};
    const day = fday.day || {};
    const astro = fday.astro || {};

    if (cur.temp_f !== undefined) weatherState.tempF = cur.temp_f;
    if (day.maxtemp_f !== undefined) weatherState.hiF = day.maxtemp_f;
    if (day.mintemp_f !== undefined) weatherState.loF = day.mintemp_f;
    if (cur.feelslike_f !== undefined) weatherState.feelsF = cur.feelslike_f;
    if (cur.wind_mph !== undefined) weatherState.windMph = cur.wind_mph;
    if (cur.cloud !== undefined) weatherState.cloudPct = cur.cloud;
    if (cur.humidity !== undefined) weatherState.humidity = cur.humidity;
    if (cur.dewpoint_f !== undefined) weatherState.dewPointF = cur.dewpoint_f;
    if (cur.uv !== undefined) weatherState.uv = cur.uv;
    if (cur.vis_miles !== undefined) weatherState.visibilityMi = cur.vis_miles;
    if (astro.moon_phase) weatherState.moonPhase = astro.moon_phase;
    if (cur.condition && cur.condition.code !== undefined) weatherState.conditionCode = cur.condition.code;
    if (cur.condition && cur.condition.text) weatherState.conditionText = cur.condition.text;
    const locName = [loc.name, loc.region].filter(Boolean).join(', ');
    if (locName) weatherState.locationName = locName;
    if (loc.tz_id) weatherState.tzId = loc.tz_id;
    weatherState.sunrise = astro.sunrise || null;
    weatherState.sunset = astro.sunset || null;
    weatherState.alerts = (data.alerts && data.alerts.alert) || [];
    weatherState.hourly = fday.hour || [];

    weatherLiveConditions.clear();
    const mapped = mapConditionCode(weatherState.conditionCode);
    if (mapped) weatherLiveConditions.add(mapped);

    renderWeatherTemps();
    renderWind();
    renderWeatherExtras();
    renderWeatherSkin();
    applyAlertTicker();

    if (weatherState.tzId) {
      const abbr = tzAbbreviation(weatherState.tzId);
      const tzPill = document.getElementById('clock-tz-pill');
      if (abbr && tzPill) tzPill.textContent = abbr;
    }
  }

  async function loadLiveWeather(force) {
    const key = localStorage.getItem(WEATHERAPI_KEY_STORAGE);
    if (!key) return;
    let cache = null;
    try { cache = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || 'null'); } catch (e) { cache = null; }
    const isStale = !cache || (Date.now() - cache.fetchedAt) >= WEATHER_STALE_MS;
    if (!force && cache && !isStale) {
      applyLiveWeatherData(cache.data);
      return;
    }
    const coords = await getCoords();
    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(key)}&q=${coords.lat},${coords.lon}&days=1&aqi=no&alerts=yes`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('WeatherAPI request failed: ' + res.status);
      const data = await res.json();
      localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data }));
      applyLiveWeatherData(data);
    } catch (e) {
      console.error('Weather fetch failed:', e);
      if (cache) applyLiveWeatherData(cache.data);
    }
  }

  function refreshLiveWeather(force) {
    loadLiveWeather(!!force);
  }

  refreshLiveWeather(false);

  attachLongPress(document.getElementById('weather-widget'), openWeatherOptions);
})();
