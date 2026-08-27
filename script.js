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

  // categoryId -> { setExpanded(bool), get expanded() } — used by the accordion itself and, later,
  // by Move Entry's cross-category cascading hover-to-expand (which needs to open a subcategory's
  // header on hover without going through a real click / without persisting that as the user's choice).
  const categoryToggles = new Map();

  document.querySelectorAll('.category:not(.category--home) .category-header').forEach((btn) => {
    const section = btn.closest('.category');
    const id = section.dataset.categoryId;
    // A category with subcategories wraps them + its own tile-grid in .category-content;
    // a flat category (no subcategories) has .tile-grid as its direct child instead.
    const content = section.querySelector(':scope > .category-content') || section.querySelector(':scope > .tile-grid');
    const stored = localStorage.getItem('category-collapsed-' + id);
    const collapsed = stored === null ? true : stored === 'true';
    setExpanded(!collapsed);

    function setExpanded(expanded) {
      content.hidden = !expanded;
      btn.setAttribute('aria-expanded', String(expanded));
    }

    categoryToggles.set(id, {
      setExpanded,
      get expanded() {
        return btn.getAttribute('aria-expanded') === 'true';
      },
    });

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      setExpanded(!expanded);
      localStorage.setItem('category-collapsed-' + id, String(expanded));
    });
  });

  // --- Tile Grid: "+" add-tile mechanic, persisted tiles, and Phase 2 Part 1 tile actions ---
  const TILE_STORAGE_PREFIX = 'category-tiles-';

  const TILE_SEED_DATA = {
    home: [
      { id: 'seed-home-1', name: 'Gmail', url: 'https://mail.google.com' },
      { id: 'seed-home-2', name: 'Translate', url: 'https://translate.google.com' },
      { id: 'seed-home-3', name: 'Maps', url: 'https://maps.google.com' },
      { id: 'seed-home-4', name: 'USPS', url: 'https://informeddelivery.usps.com' },
      { id: 'seed-home-5', name: 'Calendar', url: 'https://calendar.google.com' },
    ],
    news: [
      { id: 'seed-news-1', name: 'Google News', url: 'https://news.google.com' },
      { id: 'seed-news-2', name: 'Sentinel', url: 'https://www.orlandosentinel.com' },
      { id: 'seed-news-3', name: 'NWS', url: 'https://www.weather.gov' },
      { id: 'seed-news-4', name: 'r/florida', url: 'https://www.reddit.com/r/florida' },
      { id: 'seed-news-5', name: 'AP News', url: 'https://apnews.com' },
    ],
    shopping: [
      { id: 'seed-shopping-1', name: 'Amazon', url: 'https://www.amazon.com' },
      { id: 'seed-shopping-2', name: 'Target', url: 'https://www.target.com' },
      { id: 'seed-shopping-3', name: 'Walmart', url: 'https://www.walmart.com' },
      { id: 'seed-shopping-4', name: 'Home Depot', url: 'https://www.homedepot.com' },
      { id: 'seed-shopping-5', name: 'Costco', url: 'https://www.costco.com' },
    ],
    entertainment: [
      { id: 'seed-entertainment-1', name: 'YouTube', url: 'https://www.youtube.com' },
      { id: 'seed-entertainment-2', name: 'Netflix', url: 'https://www.netflix.com' },
      { id: 'seed-entertainment-3', name: 'Spotify', url: 'https://www.spotify.com' },
      { id: 'seed-entertainment-4', name: 'Disney+', url: 'https://www.disneyplus.com' },
      { id: 'seed-entertainment-5', name: 'Hulu', url: 'https://www.hulu.com' },
    ],
    // --- Placeholder test content (disposable): nested categories/subcategories for building and
    // testing the Tile Grid, Accordion, and Move Entry systems. Remove once real content replaces it.
    'test-a': [
      { id: 'seed-test-a-1', name: 'Google', url: 'https://google.com' },
      { id: 'seed-test-a-2', name: 'Wikipedia', url: 'https://wikipedia.org' },
      { id: 'seed-test-a-3', name: 'GitHub', url: 'https://github.com' },
    ],
    'test-b-sub1': [
      { id: 'seed-test-b-sub1-1', name: 'YouTube', url: 'https://youtube.com' },
      { id: 'seed-test-b-sub1-2', name: 'Reddit', url: 'https://reddit.com' },
      { id: 'seed-test-b-sub1-3', name: 'Amazon', url: 'https://amazon.com' },
      { id: 'seed-test-b-sub1-4', name: 'Netflix', url: 'https://netflix.com' },
    ],
    'test-b-sub2': [
      { id: 'seed-test-b-sub2-1', name: 'Spotify', url: 'https://spotify.com' },
      { id: 'seed-test-b-sub2-2', name: 'Apple', url: 'https://apple.com' },
    ],
    'test-c-suba': [
      { id: 'seed-test-c-suba-1', name: 'Microsoft', url: 'https://microsoft.com' },
      { id: 'seed-test-c-suba-2', name: 'Yahoo', url: 'https://yahoo.com' },
    ],
    'test-c-suba-1': [
      { id: 'seed-test-c-suba-1-1', name: 'Twitch', url: 'https://twitch.tv' },
      { id: 'seed-test-c-suba-1-2', name: 'Discord', url: 'https://discord.com' },
      { id: 'seed-test-c-suba-1-3', name: 'Steam', url: 'https://store.steampowered.com' },
      { id: 'seed-test-c-suba-1-4', name: 'LinkedIn', url: 'https://linkedin.com' },
      { id: 'seed-test-c-suba-1-5', name: 'Pinterest', url: 'https://pinterest.com' },
      { id: 'seed-test-c-suba-1-6', name: 'eBay', url: 'https://ebay.com' },
    ],
    'test-d': [
      { id: 'seed-test-d-1', name: 'Bing', url: 'https://bing.com' },
      { id: 'seed-test-d-2', name: 'DuckDuckGo', url: 'https://duckduckgo.com' },
      { id: 'seed-test-d-3', name: 'Firefox', url: 'https://mozilla.org' },
      { id: 'seed-test-d-4', name: 'Chrome', url: 'https://google.com/chrome' },
      { id: 'seed-test-d-5', name: 'Edge', url: 'https://microsoft.com/edge' },
      { id: 'seed-test-d-6', name: 'Wikipedia', url: 'https://wikipedia.org' },
      { id: 'seed-test-d-7', name: 'Archive.org', url: 'https://archive.org' },
      { id: 'seed-test-d-8', name: 'Wayback Machine', url: 'https://web.archive.org' },
      { id: 'seed-test-d-9', name: 'W3Schools', url: 'https://w3schools.com' },
      { id: 'seed-test-d-10', name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
      { id: 'seed-test-d-11', name: 'Stack Overflow', url: 'https://stackoverflow.com' },
      { id: 'seed-test-d-12', name: 'CodePen', url: 'https://codepen.io' },
    ],
    'test-e': [
      { id: 'seed-test-e-1', name: 'Fallback Test', url: 'https://thisdoesnotexistasarealsite12345.com' },
    ],
  };

  function newTileId() {
    return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  }

  const TILE_MIGRATION_FLAG_PREFIX = 'category-tiles-migrated-';

  function loadCategoryTiles(categoryId) {
    let tiles;
    try {
      tiles = JSON.parse(localStorage.getItem(TILE_STORAGE_PREFIX + categoryId) || '[]');
    } catch (e) {
      tiles = [];
    }
    if (!Array.isArray(tiles)) tiles = [];

    let changed = false;

    // One-time merge of the original seed tiles into whatever's already stored — tracked by its
    // own flag rather than "does the key exist", since anyone who used the "+" mechanic before
    // this migration shipped already had a (seed-less) key, which would otherwise skip seeding
    // entirely and leave only their added tiles visible.
    if (localStorage.getItem(TILE_MIGRATION_FLAG_PREFIX + categoryId) !== 'true') {
      const existingIds = new Set(tiles.map((t) => t.id));
      const seed = (TILE_SEED_DATA[categoryId] || [])
        .filter((t) => !existingIds.has(t.id))
        .map((t) => Object.assign({}, t));
      tiles = seed.concat(tiles);
      localStorage.setItem(TILE_MIGRATION_FLAG_PREFIX + categoryId, 'true');
      changed = true;
    }

    // Safety net: any pre-migration tile saved without an id (old {name,url}-only schema) gets one now.
    tiles.forEach((t) => {
      if (!t.id) {
        t.id = newTileId();
        changed = true;
      }
    });

    if (changed) saveCategoryTiles(categoryId, tiles);
    return tiles;
  }

  function saveCategoryTiles(categoryId, tiles) {
    localStorage.setItem(TILE_STORAGE_PREFIX + categoryId, JSON.stringify(tiles));
  }

  function faviconUrlForDomain(domain) {
    return 'https://www.google.com/s2/favicons?sz=64&domain=' + encodeURIComponent(domain);
  }

  function normalizeTileUrl(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : 'https://' + trimmed;
    try {
      return new URL(withProtocol);
    } catch (e) {
      return null;
    }
  }

  function buildTileElement(id, name, url) {
    const a = document.createElement('a');
    a.className = 'tile';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.dataset.tileId = id;

    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.src = faviconUrlForDomain(new URL(url).hostname);
    img.addEventListener('error', () => {
      img.remove();
      a.classList.add('tile-fallback');
      span.classList.remove('tile-name-wrap');
    });
    a.appendChild(img);

    const span = document.createElement('span');
    span.textContent = name;
    a.appendChild(span);

    a.addEventListener('contextmenu', (e) => e.preventDefault());
    attachLongPress(a, () => openTileMenu(a), () => moveMode && moveMode.grid === a.parentElement);

    // While this tile's grid is in move mode, a plain tap must not navigate away — pointerdown
    // (below, wired once move mode is entered) already handles grabbing/dragging it.
    a.addEventListener('click', (e) => {
      if (moveMode && moveMode.grid === a.parentElement) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    a.addEventListener('pointerdown', (e) => {
      if (moveMode && moveMode.grid === a.parentElement) {
        startTileDrag(a, e);
      }
    });

    return a;
  }

  function updateTileNameWrapClass(tileEl) {
    const span = tileEl.querySelector('span');
    if (!span || tileEl.classList.contains('tile-fallback')) return;
    span.classList.remove('tile-name-wrap');
    const singleLineHeight = parseFloat(getComputedStyle(span).lineHeight);
    if (span.scrollHeight > singleLineHeight * 1.4) {
      span.classList.add('tile-name-wrap');
    }
  }

  const addTileOverlay = document.getElementById('add-tile-overlay');
  const addTileClose = document.getElementById('add-tile-close');
  const addTileNameInput = document.getElementById('add-tile-name');
  const addTileUrlInput = document.getElementById('add-tile-url');
  const addTileSubmit = document.getElementById('add-tile-submit');
  let addTileTargetGrid = null;
  let addTileTargetCategoryId = null;

  function openAddTile(grid, categoryId) {
    addTileTargetGrid = grid;
    addTileTargetCategoryId = categoryId;
    addTileNameInput.value = '';
    addTileUrlInput.value = '';
    addTileOverlay.hidden = false;
    addTileNameInput.focus();
  }

  function closeAddTile() {
    addTileOverlay.hidden = true;
    addTileTargetGrid = null;
    addTileTargetCategoryId = null;
  }

  addTileClose.addEventListener('click', closeAddTile);
  addTileOverlay.addEventListener('click', (e) => {
    if (e.target === addTileOverlay) closeAddTile();
  });

  addTileSubmit.addEventListener('click', () => {
    const name = addTileNameInput.value.trim();
    const parsedUrl = normalizeTileUrl(addTileUrlInput.value);
    if (!name || !parsedUrl || !addTileTargetGrid) return;
    const url = parsedUrl.href;
    const id = newTileId();
    const tile = buildTileElement(id, name, url);
    addTileTargetGrid.insertBefore(tile, addTileTargetGrid.querySelector('.tile-add'));
    updateTileNameWrapClass(tile);
    const tiles = loadCategoryTiles(addTileTargetCategoryId);
    tiles.push({ id, name, url });
    saveCategoryTiles(addTileTargetCategoryId, tiles);
    closeAddTile();
  });

  // categoryId -> its own .tile-grid element — used by Move Entry to resolve a cross-category
  // drop target's grid directly, without re-querying the DOM on every drag.
  const categoryGrids = new Map();

  document.querySelectorAll('.tile-grid').forEach((grid) => {
    const categoryId = grid.closest('.category').dataset.categoryId;
    categoryGrids.set(categoryId, grid);
    const addBtn = grid.querySelector('.tile-add');
    loadCategoryTiles(categoryId).forEach((t) => {
      const tile = buildTileElement(t.id, t.name, t.url);
      grid.insertBefore(tile, addBtn);
      updateTileNameWrapClass(tile);
    });
    if (addBtn) {
      addBtn.addEventListener('click', () => openAddTile(grid, categoryId));
    }
  });

  // --- Phase 2 Part 1: tile long-press action menu (Remove Entry / Move Entry / Rename Entry) ---
  const tileMenuOverlay = document.getElementById('tile-menu-overlay');
  const tileMenuClose = document.getElementById('tile-menu-close');
  const tileMenuTitle = document.getElementById('tile-menu-title');
  const tileMenuRemoveBtn = document.getElementById('tile-menu-remove');
  const tileMenuRenameBtn = document.getElementById('tile-menu-rename');
  let tileMenuTargetEl = null;

  function closeTileMenu() {
    tileMenuOverlay.hidden = true;
    tileMenuTargetEl = null;
  }
  function openTileMenu(tileEl) {
    tileMenuTargetEl = tileEl;
    tileMenuTitle.textContent = tileEl.querySelector('span').textContent;
    tileMenuOverlay.hidden = false;
  }
  tileMenuClose.addEventListener('click', closeTileMenu);
  tileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === tileMenuOverlay) closeTileMenu();
  });

  const tileConfirmOverlay = document.getElementById('tile-confirm-overlay');
  const tileConfirmClose = document.getElementById('tile-confirm-close');
  const tileConfirmText = document.getElementById('tile-confirm-text');
  const tileConfirmYes = document.getElementById('tile-confirm-yes');
  const tileConfirmNo = document.getElementById('tile-confirm-no');
  let tileConfirmOnYes = null;

  function openTileConfirm(text, onYes) {
    tileConfirmText.textContent = text;
    tileConfirmOnYes = onYes;
    tileConfirmOverlay.hidden = false;
  }
  function closeTileConfirm() {
    tileConfirmOverlay.hidden = true;
    tileConfirmOnYes = null;
  }
  tileConfirmClose.addEventListener('click', closeTileConfirm);
  tileConfirmNo.addEventListener('click', closeTileConfirm);
  tileConfirmOverlay.addEventListener('click', (e) => {
    if (e.target === tileConfirmOverlay) closeTileConfirm();
  });
  tileConfirmYes.addEventListener('click', () => {
    const cb = tileConfirmOnYes;
    closeTileConfirm();
    if (cb) cb();
  });

  function removeTile(tileEl) {
    const categoryId = tileEl.closest('.category').dataset.categoryId;
    const tileId = tileEl.dataset.tileId;
    const tiles = loadCategoryTiles(categoryId).filter((t) => t.id !== tileId);
    saveCategoryTiles(categoryId, tiles);
    tileEl.remove();
  }

  tileMenuRemoveBtn.addEventListener('click', () => {
    const tileEl = tileMenuTargetEl;
    closeTileMenu();
    const name = tileEl.querySelector('span').textContent;
    openTileConfirm('Are you sure you want to remove ' + name + '?', () => {
      // Intentional, permanent easter egg — a 10% chance of a second "really sure?" prompt.
      // Never document or hint at this in user-facing help text.
      if (Math.random() < 0.10) {
        openTileConfirm('Are you REALLY sure? 😳', () => removeTile(tileEl));
      } else {
        removeTile(tileEl);
      }
    });
  });

  const tileRenameOverlay = document.getElementById('tile-rename-overlay');
  const tileRenameClose = document.getElementById('tile-rename-close');
  const tileRenameInput = document.getElementById('tile-rename-input');
  const tileRenameSave = document.getElementById('tile-rename-save');
  let tileRenameTargetEl = null;

  function closeTileRename() {
    tileRenameOverlay.hidden = true;
    tileRenameTargetEl = null;
  }
  tileRenameClose.addEventListener('click', closeTileRename);
  tileRenameOverlay.addEventListener('click', (e) => {
    if (e.target === tileRenameOverlay) closeTileRename();
  });

  tileMenuRenameBtn.addEventListener('click', () => {
    const tileEl = tileMenuTargetEl;
    closeTileMenu();
    tileRenameTargetEl = tileEl;
    tileRenameInput.value = tileEl.querySelector('span').textContent;
    tileRenameOverlay.hidden = false;
    tileRenameInput.focus();
  });

  tileRenameSave.addEventListener('click', () => {
    const tileEl = tileRenameTargetEl;
    if (!tileEl) return;
    const newName = tileRenameInput.value.trim();
    if (!newName) return;
    const categoryId = tileEl.closest('.category').dataset.categoryId;
    const tileId = tileEl.dataset.tileId;
    const tiles = loadCategoryTiles(categoryId);
    const entry = tiles.find((t) => t.id === tileId);
    if (entry) {
      entry.name = newName;
      saveCategoryTiles(categoryId, tiles);
    }
    tileEl.querySelector('span').textContent = newName;
    updateTileNameWrapClass(tileEl);
    closeTileRename();
  });

  function attachLongPress(el, callback, shouldSuppress) {
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
      if (shouldSuppress && shouldSuppress()) return;
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

  // --- Phase 2 Editing System, Part 2: Move Entry (drag-and-drop) ---
  // moveMode: { grid } — the single .tile-grid currently in move mode, or null.
  // dragInfo: state for the tile actively being dragged within moveMode.grid, or null when idle
  // (move mode can be active with no active drag — e.g. right after entry, before the first pointerdown).
  let moveMode = null;
  let moveModeTimeoutId = null;
  let dragInfo = null;
  let justFinishedDrag = false;

  function resetMoveModeTimeout() {
    if (!moveMode) return;
    clearTimeout(moveModeTimeoutId);
    moveModeTimeoutId = setTimeout(exitMoveMode, 5000);
  }

  function setGrabbedTile(tileEl) {
    if (!moveMode) return;
    moveMode.grid.querySelectorAll('.tile.move-grabbed').forEach((t) => {
      if (t !== tileEl) t.classList.remove('move-grabbed');
    });
    tileEl.classList.add('move-grabbed');
  }

  function onDocumentClickDuringMoveMode(e) {
    if (!moveMode || justFinishedDrag) return;
    const tile = e.target.closest && e.target.closest('.tile:not(.tile-add)');
    if (tile && tile.parentElement === moveMode.grid) return;
    exitMoveMode();
  }

  function enterMoveMode(tileEl) {
    const grid = tileEl.parentElement;
    if (moveMode && moveMode.grid !== grid) exitMoveMode();
    if (!moveMode) {
      moveMode = { grid };
      grid.classList.add('move-mode');
      // Deferred so the click that opened Move Entry (still bubbling to document right now)
      // doesn't immediately trip the tap-away exit check above.
      setTimeout(() => document.addEventListener('click', onDocumentClickDuringMoveMode), 0);
    }
    setGrabbedTile(tileEl);
    resetMoveModeTimeout();
  }

  function exitMoveMode() {
    if (!moveMode) return;
    if (dragInfo) cancelTileDrag();
    clearTimeout(moveModeTimeoutId);
    moveModeTimeoutId = null;
    moveMode.grid.classList.remove('move-mode');
    moveMode.grid.querySelectorAll('.tile.move-grabbed').forEach((t) => t.classList.remove('move-grabbed'));
    document.removeEventListener('click', onDocumentClickDuringMoveMode);
    moveMode = null;
  }

  function handleHeaderHover(headerEl) {
    if (dragInfo.lastHeaderEl === headerEl) return;
    if (dragInfo.lastHeaderEl) dragInfo.lastHeaderEl.classList.remove('move-drop-target');
    dragInfo.lastHeaderEl = null;
    dragInfo.crossTargetId = null;
    const section = headerEl.closest('.category');
    if (!section) return;
    const id = section.dataset.categoryId;
    const sourceCategoryId = dragInfo.grid.closest('.category').dataset.categoryId;
    if (id === sourceCategoryId) return; // hovering the tile's own category header: no-op
    const toggle = categoryToggles.get(id);
    if (toggle && !toggle.expanded) toggle.setExpanded(true);
    headerEl.classList.add('move-drop-target');
    dragInfo.lastHeaderEl = headerEl;
    dragInfo.crossTargetId = id;
  }

  function clearHeaderHover() {
    if (dragInfo.lastHeaderEl) dragInfo.lastHeaderEl.classList.remove('move-drop-target');
    dragInfo.lastHeaderEl = null;
    dragInfo.crossTargetId = null;
  }

  function startTileDrag(tileEl, e) {
    if (dragInfo) return;
    e.preventDefault();
    const grid = tileEl.parentElement;
    const rect = tileEl.getBoundingClientRect();
    dragInfo = {
      tileEl,
      grid,
      pointerId: e.pointerId,
      grabDX: e.clientX - rect.left,
      grabDY: e.clientY - rect.top,
      crossTargetId: null,
      lastHeaderEl: null,
      originalNextSibling: tileEl.nextSibling,
    };
    setGrabbedTile(tileEl);
    tileEl.classList.add('move-dragging');
    tileEl.style.zIndex = '50';
    tileEl.style.pointerEvents = 'none';
    resetMoveModeTimeout();

    // Listening on document (filtered by pointerId) rather than using setPointerCapture on the
    // tile itself: same-category reorder reparents the tile mid-drag (.after()/.before()), and
    // moving a captured element in the DOM silently releases its pointer capture in Chromium —
    // which would otherwise strand the drag with no pointerup ever reaching it.
    document.addEventListener('pointermove', onTileDragMove);
    document.addEventListener('pointerup', onTileDragUp);
    document.addEventListener('pointercancel', onTileDragUp);
    dragInfo.cleanup = () => {
      document.removeEventListener('pointermove', onTileDragMove);
      document.removeEventListener('pointerup', onTileDragUp);
      document.removeEventListener('pointercancel', onTileDragUp);
    };
  }

  function onTileDragMove(e) {
    if (!dragInfo || e.pointerId !== dragInfo.pointerId) return;
    handleTileDragMove(e);
  }

  function onTileDragUp(e) {
    if (!dragInfo || e.pointerId !== dragInfo.pointerId) return;
    finishTileDrag();
  }

  function findNearestTile(grid, excludeEl, x, y) {
    const tiles = Array.from(grid.children).filter(
      (c) => c.classList.contains('tile') && !c.classList.contains('tile-add') && c !== excludeEl
    );
    let nearest = null;
    let nearestDist = Infinity;
    tiles.forEach((t) => {
      const r = t.getBoundingClientRect();
      const dx = r.left + r.width / 2 - x;
      const dy = r.top + r.height / 2 - y;
      const dist = dx * dx + dy * dy;
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = t;
      }
    });
    return nearest;
  }

  function handleTileDragMove(e) {
    if (!dragInfo) return;
    resetMoveModeTimeout();

    if (e.clientX < 0 || e.clientY < 0 || e.clientX > window.innerWidth || e.clientY > window.innerHeight) {
      cancelTileDrag();
      return;
    }

    const under = document.elementFromPoint(e.clientX, e.clientY);
    const headerUnder = under && under.closest && under.closest('.category-header');

    if (headerUnder) {
      handleHeaderHover(headerUnder);
    } else {
      clearHeaderHover();
      // Nearest-tile-center (rather than exact hit-test under the cursor) so a fast or
      // coalesced drag still resolves to the correct slot even if intermediate pointermove
      // events over specific sibling tiles never actually get dispatched.
      const nearest = findNearestTile(dragInfo.grid, dragInfo.tileEl, e.clientX, e.clientY);
      if (nearest) {
        dragInfo.tileEl.style.transform = 'none';
        const ownRect = dragInfo.tileEl.getBoundingClientRect();
        const ownCx = ownRect.left + ownRect.width / 2;
        const ownCy = ownRect.top + ownRect.height / 2;
        const distToOwnSq = (ownCx - e.clientX) * (ownCx - e.clientX) + (ownCy - e.clientY) * (ownCy - e.clientY);
        const nr = nearest.getBoundingClientRect();
        const ncx = nr.left + nr.width / 2;
        const ncy = nr.top + nr.height / 2;
        const distToNearestSq = (ncx - e.clientX) * (ncx - e.clientX) + (ncy - e.clientY) * (ncy - e.clientY);
        // Only reorder when the pointer is genuinely closer to the candidate's slot than to the
        // dragged tile's own current slot. With very few siblings (e.g. exactly one other tile in
        // the category), "nearest" is otherwise trivially always that same tile regardless of real
        // proximity, which would flip the order back and forth on every single move event.
        if (distToNearestSq < distToOwnSq) {
          const siblings = Array.from(dragInfo.grid.children).filter(
            (c) => c.classList.contains('tile') && !c.classList.contains('tile-add')
          );
          const draggedIndex = siblings.indexOf(dragInfo.tileEl);
          const targetIndex = siblings.indexOf(nearest);
          if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
            if (draggedIndex < targetIndex) nearest.after(dragInfo.tileEl);
            else nearest.before(dragInfo.tileEl);
          }
        }
      }
    }

    dragInfo.tileEl.style.transform = 'none';
    const rect = dragInfo.tileEl.getBoundingClientRect();
    const dx = e.clientX - dragInfo.grabDX - rect.left;
    const dy = e.clientY - dragInfo.grabDY - rect.top;
    dragInfo.tileEl.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) rotate(-3deg) scale(1.05)';
  }

  function markDragJustFinished() {
    justFinishedDrag = true;
    setTimeout(() => { justFinishedDrag = false; }, 0);
  }

  function finishTileDrag() {
    if (!dragInfo) return;
    const info = dragInfo;
    const crossTargetId = info.crossTargetId;
    info.cleanup();
    info.tileEl.style.transform = '';
    info.tileEl.style.zIndex = '';
    info.tileEl.style.pointerEvents = '';
    info.tileEl.classList.remove('move-dragging');
    if (info.lastHeaderEl) info.lastHeaderEl.classList.remove('move-drop-target');

    const sourceCategoryId = info.grid.closest('.category').dataset.categoryId;
    const tileId = info.tileEl.dataset.tileId;

    if (crossTargetId && crossTargetId !== sourceCategoryId) {
      const destGrid = categoryGrids.get(crossTargetId);
      if (destGrid) {
        const sourceTiles = loadCategoryTiles(sourceCategoryId);
        const idx = sourceTiles.findIndex((t) => t.id === tileId);
        if (idx !== -1) {
          const [moved] = sourceTiles.splice(idx, 1);
          saveCategoryTiles(sourceCategoryId, sourceTiles);
          const destTiles = loadCategoryTiles(crossTargetId);
          destTiles.push(moved);
          saveCategoryTiles(crossTargetId, destTiles);
          const destAddBtn = destGrid.querySelector('.tile-add');
          destGrid.insertBefore(info.tileEl, destAddBtn);
        }
      }
    } else {
      const orderedIds = Array.from(info.grid.children)
        .filter((c) => c.classList.contains('tile') && !c.classList.contains('tile-add'))
        .map((c) => c.dataset.tileId);
      const tiles = loadCategoryTiles(sourceCategoryId);
      const byId = new Map(tiles.map((t) => [t.id, t]));
      const reordered = orderedIds.map((id) => byId.get(id)).filter(Boolean);
      saveCategoryTiles(sourceCategoryId, reordered);
    }

    dragInfo = null;
    markDragJustFinished();
    resetMoveModeTimeout();
  }

  function cancelTileDrag() {
    if (!dragInfo) return;
    const info = dragInfo;
    info.cleanup();
    info.tileEl.style.transform = '';
    info.tileEl.style.zIndex = '';
    info.tileEl.style.pointerEvents = '';
    info.tileEl.classList.remove('move-dragging');
    if (info.lastHeaderEl) info.lastHeaderEl.classList.remove('move-drop-target');
    info.grid.insertBefore(info.tileEl, info.originalNextSibling);
    dragInfo = null;
    markDragJustFinished();
  }

  const tileMenuMoveBtn = document.getElementById('tile-menu-move');
  tileMenuMoveBtn.addEventListener('click', () => {
    const tileEl = tileMenuTargetEl;
    closeTileMenu();
    if (!tileEl) return;
    enterMoveMode(tileEl);
  });

  const CLOCK_SETTINGS_KEY = 'clockSettings';
  const defaultClockSettings = { mode: 'digital', scheme: 'red-black', hour12: true, analogStyle: 'classic' };
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

  // Colored number-badge palette for the 'numbered' 12-hour style, approximated from the
  // reference photo (kids'-style wall clock, each hour in its own colored circle badge).
  const WX_CLOCK_BADGE_COLORS = {
    1: '#f2a65a', 2: '#6a7fdb', 3: '#4fa8a8', 4: '#a83250', 5: '#5b9bd5', 6: '#d9a520',
    7: '#5c3a21', 8: '#a78bd9', 9: '#7a9a3c', 10: '#e08a3c', 11: '#4a7fc1', 12: '#c2447a',
  };
  // Dual-ring 24-hour numbers ('dual-ring' and 'moon-dial' styles): each outer 1-12 position
  // also carries the matching 24-hour number at the same angle, closer to center.
  const WX_DUAL_RING_INNER = { 1: '13', 2: '14', 3: '15', 4: '16', 5: '17', 6: '18', 7: '19', 8: '20', 9: '21', 10: '22', 11: '23', 12: '00' };

  function renderNumberedBadgeNumbers(svg, cx, cy) {
    for (let i = 1; i <= 12; i++) {
      const p = polarPoint(cx, cy, 36, i * 30);
      svg.appendChild(svgEl('circle', { cx: p.x, cy: p.y, r: 7, fill: WX_CLOCK_BADGE_COLORS[i] }));
      const t = svgEl('text', { x: p.x, y: p.y + 2.5, 'text-anchor': 'middle', 'font-size': 7, 'font-weight': 'bold', fill: '#fff' });
      t.textContent = String(i);
      svg.appendChild(t);
    }
  }

  // Shared by 'dual-ring' (24-hour) and 'moon-dial' (both): outer black 1-12, inner red 13-23/00
  // at the same angle as their outer counterpart, plus a tick mark only at each of the 12
  // positions (no minute ticks).
  function renderDualRingNumbers(svg, cx, cy) {
    for (let i = 1; i <= 12; i++) {
      const angle = i * 30;
      const outer = polarPoint(cx, cy, 46, angle);
      const inner = polarPoint(cx, cy, 41, angle);
      svg.appendChild(svgEl('line', {
        x1: outer.x, y1: outer.y, x2: inner.x, y2: inner.y, stroke: '#333', 'stroke-width': 1.2,
      }));
      const op = polarPoint(cx, cy, 38, angle);
      const ot = svgEl('text', { x: op.x, y: op.y + 3.5, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 'bold', fill: '#000' });
      ot.textContent = String(i);
      svg.appendChild(ot);
      const ip = polarPoint(cx, cy, 30, angle);
      const it = svgEl('text', { x: ip.x, y: ip.y + 2.5, 'text-anchor': 'middle', 'font-size': 7, fill: '#c0392b' });
      it.textContent = WX_DUAL_RING_INNER[i];
      svg.appendChild(it);
    }
  }

  // Background is a large moon-phase emoji (accurate to the real current phase) instead of the
  // usual day/night face fill — it fully replaces that fill, no fallback circle underneath.
  // Dual-ring numbers same as 'dual-ring'. Hands (added by the caller) always use ordinary
  // 12-hour math regardless of the hour12 setting, since this style is offered under both toggles.
  function renderMoonDialFace(svg, cx, cy) {
    const moonEmoji = WX_MOON_PHASE_ICONS[weatherState.moonPhase] || '🌕';
    const moonText = svgEl('text', {
      x: cx, y: cy, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 85,
    });
    moonText.textContent = moonEmoji;
    svg.appendChild(moonText);

    renderDualRingNumbers(svg, cx, cy);
  }

  function renderAnalogFace(svg, hour12, analogStyle) {
    svg.innerHTML = '';
    const cx = 50;
    const cy = 50;
    const now = new Date();

    if (analogStyle === 'moon-dial') {
      renderMoonDialFace(svg, cx, cy);
      const totalMin12 = (now.getHours() % 12) * 60 + now.getMinutes();
      addHand(svg, cx, cy, (totalMin12 / 720) * 360, 24, 2.5, '#222');
      addHand(svg, cx, cy, (now.getMinutes() / 60) * 360, 36, 1.5, '#222');
      svg.appendChild(svgEl('circle', { cx, cy, r: 2, fill: '#222' }));
      return;
    }

    const rootStyle = getComputedStyle(document.documentElement);
    const dayFill = rootStyle.getPropertyValue('--clock-analog-day').trim() || '#fff';
    const nightFill = rootStyle.getPropertyValue('--clock-analog-night').trim() || '#c9c9c9';

    svg.appendChild(svgEl('circle', { cx, cy, r: 48, fill: dayFill, stroke: '#333', 'stroke-width': 1 }));

    if (hour12) {
      if (analogStyle === 'numbered') {
        renderNumberedBadgeNumbers(svg, cx, cy);
      } else {
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
      }
      const totalMin = (now.getHours() % 12) * 60 + now.getMinutes();
      addHand(svg, cx, cy, (totalMin / 720) * 360, 24, 2.5, '#222');
      addHand(svg, cx, cy, (now.getMinutes() / 60) * 360, 36, 1.5, '#222');
    } else if (analogStyle === 'dual-ring') {
      // Plain face fill only (no half-circle night shading — the reference has none), ticks only
      // at the 12 hour positions, and ordinary 12-hour hand math even though this is the 24-hour
      // toggle: the dial's dual black/red numbers carry the 24-hour reading, not the hands.
      renderDualRingNumbers(svg, cx, cy);
      const totalMin12 = (now.getHours() % 12) * 60 + now.getMinutes();
      addHand(svg, cx, cy, (totalMin12 / 720) * 360, 24, 2.5, '#222');
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
      renderAnalogFace(document.getElementById('clock-analog-svg'), clockSettings.hour12, clockSettings.analogStyle);
    }
    updateMiniClocks();
    const analogPreviewGroup = document.getElementById('clock-analog-preview-group');
    if (analogPreviewGroup && !analogPreviewGroup.hidden) {
      renderAnalogStylePreviews();
    }
  }
  // Each swatch in the "Analog Style" picker live-renders its own style, using the current
  // hour12 setting (not the swatch's own — a swatch always previews how its style would look
  // right now, since 'numbered'/'dual-ring' are each only ever shown for one hour12 value anyway).
  function renderAnalogStylePreviews() {
    document.querySelectorAll('.analog-style-preview-svg').forEach((svg) => {
      renderAnalogFace(svg, clockSettings.hour12, svg.dataset.analogStyle);
    });
  }
  function scheduleNextClockTick() {
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    setTimeout(() => {
      updateClock();
      scheduleNextClockTick();
    }, msToNextMinute);
  }

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
    clockOptionsOverlay.querySelectorAll('.analog-style-swatch').forEach((sw) => {
      const style = sw.dataset.analogStyle;
      // 'numbered' only makes sense for a 12-hour dial, 'dual-ring' only for 24-hour — 'classic'
      // and 'moon-dial' are offered under both.
      const applicable = style === 'numbered' ? clockSettings.hour12
        : style === 'dual-ring' ? !clockSettings.hour12
        : true;
      sw.hidden = !applicable;
      sw.classList.toggle('active', style === clockSettings.analogStyle);
    });
    clockDigitalPreviewGroup.hidden = clockSettings.mode !== 'digital';
    clockAnalogPreviewGroup.hidden = clockSettings.mode !== 'analog';
    if (clockSettings.mode === 'analog') {
      renderAnalogStylePreviews();
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
        // 'numbered' only applies to 12-hour, 'dual-ring' only to 24-hour — if the newly
        // inapplicable style was selected, fall back to 'classic' so the style grid always has
        // a visible active swatch matching what's actually rendering.
        if (clockSettings.analogStyle === 'numbered' && !clockSettings.hour12) clockSettings.analogStyle = 'classic';
        if (clockSettings.analogStyle === 'dual-ring' && clockSettings.hour12) clockSettings.analogStyle = 'classic';
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

  clockOptionsOverlay.querySelectorAll('.analog-style-swatch').forEach((btn) => {
    btn.addEventListener('click', () => {
      clockSettings.analogStyle = btn.dataset.analogStyle;
      saveClockSettings();
      updateClock();
      syncClockOptionsUI();
    });
  });

  attachLongPress(document.getElementById('clock-widget'), openClockOptions);

  const uvBadge = document.querySelector('.uv-badge');
  function uvSeverityClass(uv) {
    if (uv >= 10) return 'uv-extreme';
    if (uv >= 8) return 'uv-veryhigh';
    if (uv >= 6) return 'uv-moderate';
    return 'uv-low';
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
    conditionCode: 1201, conditionText: 'Moderate or heavy freezing rain',
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
    renderWeatherExtras();
    if (hourlyPanel.classList.contains('open')) renderHourlyPanel();
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

  // --- Testing panel state (temporary dev tool, not part of the real app) ---
  // Declared here (early, before renderWeatherExtras()'s first synchronous call just below needs
  // getEffectiveConditionCode()) rather than down by the rest of the testing-panel code — the
  // same temporal-dead-zone hazard noted below for weatherLiveConditions applies here too.
  const weatherTestState = {
    timeOverrideSec: null,
    cloudOverridePct: null,
    textStroke: false,
    conditionSkins: new Set(),
    conditionCodeOverride: null,
  };
  function getEffectiveConditionCode() {
    return weatherTestState.conditionCodeOverride !== null ? weatherTestState.conditionCodeOverride : weatherState.conditionCode;
  }

  // Single source of truth for every WeatherAPI condition code: its display text, its icon, and
  // which Live Condition Skin animation it triggers. `anim` is null for the clear/cloud-only
  // states (no precipitation effect, cloud-tint only) or one of 'lightRain'/'heavyRain'/
  // 'thunderstorm'/'snow'/'hail'/'fog', plus five composites — 'thunderSnow' (thunderstorm +
  // snow), 'snowFog' (snow + fog), 'snowRain' (snow + light rain), 'hailLightRain' and
  // 'hailHeavyRain' (hail + light/heavy rain) — that WX_ANIM_DECOMPOSE expands into their base
  // effects rather than needing dedicated rendering logic of their own.
  const WX_CONDITIONS = {
    1000: { text: 'Sunny / Clear', icon: '☀️', anim: null },
    1003: { text: 'Partly cloudy', icon: '🌤️', anim: null },
    1006: { text: 'Cloudy', icon: '🌥️', anim: null },
    1009: { text: 'Overcast', icon: '☁️', anim: null },
    1030: { text: 'Mist', icon: '🌫️', anim: 'fog' },
    1135: { text: 'Fog', icon: '🌫️', anim: 'fog' },
    1147: { text: 'Freezing fog', icon: '🌫️', anim: 'fog' },
    1063: { text: 'Patchy rain possible', icon: '🌦️', anim: 'lightRain' },
    1150: { text: 'Patchy light drizzle', icon: '🌦️', anim: 'lightRain' },
    1153: { text: 'Light drizzle', icon: '🌦️', anim: 'lightRain' },
    1180: { text: 'Patchy light rain', icon: '🌦️', anim: 'lightRain' },
    1240: { text: 'Light rain shower', icon: '🌦️', anim: 'lightRain' },
    1183: { text: 'Light rain', icon: '🌧️', anim: 'lightRain' },
    1186: { text: 'Moderate rain at times', icon: '🌧️', anim: 'lightRain' },
    1189: { text: 'Moderate rain', icon: '🌧️', anim: 'lightRain' },
    1192: { text: 'Heavy rain at times', icon: '🌧️', anim: 'heavyRain' },
    1195: { text: 'Heavy rain', icon: '🌧️', anim: 'heavyRain' },
    1198: { text: 'Light freezing rain', icon: '🌧️', anim: 'lightRain' },
    1201: { text: 'Moderate or heavy freezing rain', icon: '🌧️', anim: 'heavyRain' },
    1243: { text: 'Moderate or heavy rain shower', icon: '🌧️', anim: 'heavyRain' },
    1072: { text: 'Patchy freezing drizzle possible', icon: '🌦️', anim: 'lightRain' },
    1168: { text: 'Freezing drizzle', icon: '🌦️', anim: 'lightRain' },
    1171: { text: 'Heavy freezing drizzle', icon: '🌦️', anim: 'lightRain' },
    1246: { text: 'Torrential rain shower', icon: '🌧️', anim: 'heavyRain' },
    1087: { text: 'Thundery outbreaks possible', icon: '⛈️', anim: 'thunderstorm' },
    1273: { text: 'Patchy light rain with thunder', icon: '⛈️', anim: 'thunderstorm' },
    1276: { text: 'Moderate or heavy rain with thunder', icon: '⛈️', anim: 'thunderstorm' },
    1279: { text: 'Patchy light snow with thunder', icon: '⛈️', anim: 'thunderSnow' },
    1282: { text: 'Moderate or heavy snow with thunder', icon: '⛈️', anim: 'thunderSnow' },
    1066: { text: 'Patchy snow possible', icon: '🌨️', anim: 'snow' },
    1069: { text: 'Patchy sleet possible', icon: '🌨️', anim: 'hail' },
    1114: { text: 'Blowing snow', icon: '🌬️', anim: 'snow' },
    1204: { text: 'Light sleet', icon: '🌨️', anim: 'hail' },
    1207: { text: 'Moderate or heavy sleet', icon: '🌨️', anim: 'hail' },
    1210: { text: 'Patchy light snow', icon: '🌨️', anim: 'snow' },
    1213: { text: 'Light snow', icon: '🌨️', anim: 'snow' },
    1216: { text: 'Patchy moderate snow', icon: '🌨️', anim: 'snow' },
    1249: { text: 'Light sleet showers', icon: '🌨️', anim: 'hailLightRain' },
    1252: { text: 'Moderate or heavy sleet showers', icon: '🌨️', anim: 'hailHeavyRain' },
    1255: { text: 'Light snow showers', icon: '🌨️', anim: 'snowRain' },
    1117: { text: 'Blizzard', icon: '❄️', anim: 'snowFog' },
    1219: { text: 'Moderate snow', icon: '❄️', anim: 'snow' },
    1222: { text: 'Patchy heavy snow', icon: '❄️', anim: 'snow' },
    1225: { text: 'Heavy snow', icon: '❄️', anim: 'snow' },
    1258: { text: 'Moderate or heavy snow showers', icon: '❄️', anim: 'snowRain' },
    1237: { text: 'Ice pellets', icon: '🧊', anim: 'hail' },
    1261: { text: 'Light showers of ice pellets', icon: '🧊', anim: 'hail' },
    1264: { text: 'Moderate or heavy showers of ice pellets', icon: '🧊', anim: 'hail' },
  };
  // Composite animations aren't rendered directly — they expand into the base effects that
  // already exist, so every other piece of condition-skin logic (rain/snow/hail/fog particle
  // creation, the thunderstorm flash trigger, cloud-tint darkening) keeps working unchanged.
  const WX_ANIM_DECOMPOSE = {
    thunderSnow: ['thunderstorm', 'snow'],
    snowFog: ['snow', 'fog'],
    snowRain: ['snow', 'lightRain'],
    hailLightRain: ['hail', 'lightRain'],
    hailHeavyRain: ['hail', 'heavyRain'],
  };
  function animKeysFor(anim) {
    if (!anim) return [];
    return WX_ANIM_DECOMPOSE[anim] || [anim];
  }
  function weatherIconForCode(code) {
    const entry = WX_CONDITIONS[code];
    return entry ? entry.icon : '🌡️';
  }
  const weatherEmojiBtn = document.getElementById('weather-emoji-btn');

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
    const effectiveEntry = WX_CONDITIONS[getEffectiveConditionCode()];
    descEl.textContent = effectiveEntry ? effectiveEntry.text : weatherState.conditionText;
    weatherEmojiBtn.textContent = weatherIconForCode(getEffectiveConditionCode());
  }
  renderWeatherExtras();

  // --- Hourly Forecast panel: a popover anchored to the row directly below the clock+weather
  // widgets (see .hourly-panel in styles.css), not a pushed-down block — floats over the tile
  // row beneath it rather than displacing it, per explicit user direction.
  const hourlyPanel = document.getElementById('hourly-panel');
  const hourlyStrip = document.getElementById('hourly-strip');
  const hourlyRowAlert = document.getElementById('hourly-row-alert');
  const hourlyRowTime = document.getElementById('hourly-row-time');
  const hourlyTempGraph = document.getElementById('hourly-temp-graph');
  const hourlyRowPrecip = document.getElementById('hourly-row-precip');
  const HOURLY_COL_WIDTH = 32;

  // WeatherAPI's hour.time is "YYYY-MM-DD HH:MM" in 24-hour format.
  function formatHourLabel(timeStr) {
    const hh = parseInt(timeStr.slice(11, 13), 10);
    const ap = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return h12 + ap;
  }

  function hourlyPrecipPct(hour) {
    return Math.max(hour.chance_of_rain || 0, hour.chance_of_snow || 0);
  }

  function currentHourEpochNow() {
    return Math.floor(Date.now() / 1000 / 3600) * 3600;
  }

  // Hazard-alert row: at most one icon+dot per hour, covering anything that might cause
  // discomfort or injury (not just precipitation) — condition-code-based hazards (thunderstorm,
  // hail, fog) have no percentage field in WeatherAPI's hourly data, so they're presence-only;
  // rain/snow use their existing chance_of_rain/chance_of_snow percentage tiers, with a handful
  // of condition codes (freezing rain, blizzard, blowing snow) forced to red regardless of %
  // since they're hazardous independent of how likely they are that hour.
  const WX_HAZARD_ICONS = {
    thunder: '⚡', hail: '🪨', snow: '❄️', rain: '💧',
    wind: '💨', cold: '🥶', heat: '🥵', uv: '☀️', fog: '🌫️',
  };
  // Tie-break order when multiple hazards land on the exact same color tier in the same hour —
  // severity (red > orange > yellow) is always checked first; this only decides ties.
  const WX_HAZARD_PRIORITY = ['thunder', 'hail', 'snow', 'rain', 'wind', 'cold', 'heat', 'uv', 'fog'];
  const WX_TIER_RANK = { red: 3, orange: 2, yellow: 1 };
  const WX_THUNDER_RED_CODES = new Set([1276, 1282]);
  const WX_THUNDER_YELLOW_CODES = new Set([1087, 1273, 1279]);
  const WX_HAIL_RED_CODES = new Set([1237, 1261, 1264]);
  const WX_HAIL_YELLOW_CODES = new Set([1069, 1204, 1207, 1249, 1252]);
  const WX_SNOW_RED_OVERRIDE_CODES = new Set([1117, 1114]); // Blizzard, blowing snow
  const WX_RAIN_RED_OVERRIDE_CODES = new Set([1198, 1201, 1072, 1168, 1171]); // Freezing rain/drizzle

  function hourlyHazards(hour) {
    const code = hour.condition && hour.condition.code;
    const hazards = [];

    if (WX_THUNDER_RED_CODES.has(code)) hazards.push({ type: 'thunder', color: 'red' });
    else if (WX_THUNDER_YELLOW_CODES.has(code)) hazards.push({ type: 'thunder', color: 'yellow' });

    if (WX_HAIL_RED_CODES.has(code)) hazards.push({ type: 'hail', color: 'red' });
    else if (WX_HAIL_YELLOW_CODES.has(code)) hazards.push({ type: 'hail', color: 'yellow' });

    if (WX_SNOW_RED_OVERRIDE_CODES.has(code)) {
      hazards.push({ type: 'snow', color: 'red' });
    } else {
      const snowPct = hour.chance_of_snow || 0;
      if (snowPct >= 80) hazards.push({ type: 'snow', color: 'red' });
      else if (snowPct >= 60) hazards.push({ type: 'snow', color: 'orange' });
      else if (snowPct >= 30) hazards.push({ type: 'snow', color: 'yellow' });
    }

    if (WX_RAIN_RED_OVERRIDE_CODES.has(code)) {
      hazards.push({ type: 'rain', color: 'red' });
    } else {
      const rainPct = hour.chance_of_rain || 0;
      if (rainPct >= 80) hazards.push({ type: 'rain', color: 'red' });
      else if (rainPct >= 60) hazards.push({ type: 'rain', color: 'orange' });
      else if (rainPct >= 30) hazards.push({ type: 'rain', color: 'yellow' });
    }

    const wind = hour.wind_mph || 0;
    const gust = hour.gust_mph || 0;
    if (wind >= 40 || gust >= 50) hazards.push({ type: 'wind', color: 'red' });
    else if (wind >= 30 || gust >= 40) hazards.push({ type: 'wind', color: 'yellow' });

    if (hour.feelslike_f !== undefined) {
      if (hour.feelslike_f <= 0) hazards.push({ type: 'cold', color: 'red' });
      else if (hour.feelslike_f <= 20) hazards.push({ type: 'cold', color: 'yellow' });

      if (hour.feelslike_f >= 110) hazards.push({ type: 'heat', color: 'red' });
      else if (hour.feelslike_f >= 95) hazards.push({ type: 'heat', color: 'yellow' });
    }

    if (hour.uv !== undefined) {
      if (hour.uv >= 8) hazards.push({ type: 'uv', color: 'red' });
      else if (hour.uv >= 6) hazards.push({ type: 'uv', color: 'yellow' });
    }

    if (WX_CONDITIONS[code] && WX_CONDITIONS[code].anim === 'fog') hazards.push({ type: 'fog', color: 'yellow' });

    return hazards;
  }

  // Severity first (red beats orange beats yellow); ties broken by WX_HAZARD_PRIORITY order.
  function pickHazard(hour) {
    const hazards = hourlyHazards(hour);
    if (!hazards.length) return null;
    hazards.sort((a, b) => {
      const rankDiff = WX_TIER_RANK[b.color] - WX_TIER_RANK[a.color];
      if (rankDiff !== 0) return rankDiff;
      return WX_HAZARD_PRIORITY.indexOf(a.type) - WX_HAZARD_PRIORITY.indexOf(b.type);
    });
    return hazards[0];
  }

  function makeHourlyCell(isNow) {
    const cell = document.createElement('div');
    cell.className = 'hourly-cell' + (isNow ? ' now' : '');
    return cell;
  }

  function renderHourlyAlertRow(hours, nowEpoch) {
    hourlyRowAlert.innerHTML = '';
    hours.forEach((hour) => {
      const cell = makeHourlyCell(hour.time_epoch === nowEpoch);
      const hazard = pickHazard(hour);
      if (hazard) {
        const icon = document.createElement('span');
        icon.className = 'hourly-alert-icon';
        icon.textContent = WX_HAZARD_ICONS[hazard.type];
        cell.appendChild(icon);
        const dot = document.createElement('span');
        dot.className = 'hourly-alert-dot ' + hazard.color;
        cell.appendChild(dot);
      }
      hourlyRowAlert.appendChild(cell);
    });
  }

  function renderHourlyTimeRow(hours, nowEpoch) {
    hourlyRowTime.innerHTML = '';
    hours.forEach((hour) => {
      const isNow = hour.time_epoch === nowEpoch;
      const cell = makeHourlyCell(isNow);
      cell.textContent = isNow ? 'Now' : formatHourLabel(hour.time);
      hourlyRowTime.appendChild(cell);
    });
  }

  function renderHourlyPrecipRow(hours, nowEpoch) {
    hourlyRowPrecip.innerHTML = '';
    hours.forEach((hour) => {
      const cell = makeHourlyCell(hour.time_epoch === nowEpoch);
      const pct = hourlyPrecipPct(hour);
      if (pct >= 20) cell.textContent = pct + '%';
      hourlyRowPrecip.appendChild(cell);
    });
  }

  // Temperature graph: each point IS that hour's condition icon (not a plain dot marker),
  // positioned by temperature — highest of the 12 fetched hours at the top, lowest at the
  // bottom — with the numeric temp label directly underneath each icon.
  function renderHourlyTempGraph(hours, nowEpoch) {
    const svgNS = 'http://www.w3.org/2000/svg';
    hourlyTempGraph.innerHTML = '';
    if (!hours.length) return;
    const width = hours.length * HOURLY_COL_WIDTH;
    const height = 80;
    hourlyTempGraph.setAttribute('width', width);
    hourlyTempGraph.setAttribute('height', height);
    hourlyTempGraph.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const temps = hours.map((h) => h.temp_f);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const range = Math.max(maxTemp - minTemp, 1); // avoid divide-by-zero when all 12 hours match
    const ICON_TOP = 9;
    const ICON_BOTTOM = 53;
    const conv = displayTempUnit === 'F' ? toF : toC;

    const points = hours.map((hour, i) => {
      const x = i * HOURLY_COL_WIDTH + HOURLY_COL_WIDTH / 2;
      const frac = (hour.temp_f - minTemp) / range;
      const y = ICON_BOTTOM - frac * (ICON_BOTTOM - ICON_TOP);
      return { x, y, hour };
    });

    const nowIdx = hours.findIndex((h) => h.time_epoch === nowEpoch);
    if (nowIdx >= 0) {
      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('x', nowIdx * HOURLY_COL_WIDTH);
      rect.setAttribute('y', 0);
      rect.setAttribute('width', HOURLY_COL_WIDTH);
      rect.setAttribute('height', height);
      rect.setAttribute('class', 'hourly-graph-now-bg');
      hourlyTempGraph.appendChild(rect);
    }

    const line = document.createElementNS(svgNS, 'polyline');
    line.setAttribute('points', points.map((p) => p.x + ',' + p.y).join(' '));
    line.setAttribute('class', 'hourly-graph-line');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    hourlyTempGraph.appendChild(line);

    points.forEach((p) => {
      const icon = document.createElementNS(svgNS, 'text');
      icon.setAttribute('x', p.x);
      icon.setAttribute('y', p.y);
      icon.setAttribute('class', 'hourly-graph-icon');
      icon.textContent = weatherIconForCode(p.hour.condition && p.hour.condition.code);
      hourlyTempGraph.appendChild(icon);

      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', p.x);
      label.setAttribute('y', p.y + 21.5);
      label.setAttribute('class', 'hourly-graph-label');
      label.textContent = conv(p.hour.temp_f) + '°';
      hourlyTempGraph.appendChild(label);
    });
  }

  function renderHourlyPanel() {
    const hours = weatherState.hourly;
    const nowEpoch = currentHourEpochNow();
    renderHourlyAlertRow(hours, nowEpoch);
    renderHourlyTimeRow(hours, nowEpoch);
    renderHourlyTempGraph(hours, nowEpoch);
    renderHourlyPrecipRow(hours, nowEpoch);
    hourlyStrip.scrollLeft = 0;
  }

  function closeHourlyPanel() {
    hourlyPanel.classList.remove('open');
    document.removeEventListener('click', handleHourlyOutsideClick, true);
  }
  function handleHourlyOutsideClick(e) {
    if (hourlyPanel.contains(e.target) || e.target === weatherEmojiBtn) return;
    closeHourlyPanel();
  }
  function openHourlyPanel() {
    renderHourlyPanel();
    hourlyPanel.classList.add('open');
    document.addEventListener('click', handleHourlyOutsideClick, true);
  }

  weatherEmojiBtn.addEventListener('click', () => {
    if (hourlyPanel.classList.contains('open')) closeHourlyPanel();
    else openHourlyPanel();
  });

  // Swipe-up dismiss on the panel itself (distinct from the strip's own horizontal scroll).
  let hourlySwipeStartY = null;
  hourlyPanel.addEventListener('pointerdown', (e) => {
    hourlySwipeStartY = e.clientY;
    // Without capture, a pointerup after the cursor has moved outside the panel's bounds
    // (exactly what an upward swipe does) would never reach this element's own listener.
    hourlyPanel.setPointerCapture(e.pointerId);
  });
  hourlyPanel.addEventListener('pointerup', (e) => {
    if (hourlySwipeStartY === null) return;
    const deltaUp = hourlySwipeStartY - e.clientY;
    hourlySwipeStartY = null;
    if (deltaUp > 40) closeHourlyPanel();
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
    if (hourlyPanel.classList.contains('open')) closeHourlyPanel();
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
        renderWeatherExtras();
        if (hourlyPanel.classList.contains('open')) renderHourlyPanel();
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
  // Defaults until live data arrives (no key configured yet, or before the first fetch resolves);
  // overwritten with the real location's actual sunrise/sunset once WeatherAPI data lands.
  let SUNRISE_SEC = 6 * 3600 + 30 * 60;
  let SUNSET_SEC = 19 * 3600 + 45 * 60;
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
    // Multiplicative brightening barely moves a night sky's very low RGB values (e.g. rgb(2,6,23))
    // even at large percentages, which is why the cloud tint used to be nearly invisible at night —
    // raised well past 100% so the night cloud tint is actually visible against the real widget.
    nightBasePct: 300,
    lightRainPct: 10,
    heavyRainPct: 20,
    thunderstormPct: 40,
    // The brightened night tint is a straight per-channel multiply of a navy sky color, which
    // preserves hue regardless of brightness — it reads as blue no matter how nightBasePct is
    // tuned. This blends the result toward a neutral gray (computed from its own channels) by a
    // separate, tunable percentage so brightness and "grayness" aren't conflated. Day tint isn't
    // affected — only reported as too blue at night.
    nightGrayBlendPct: 75,
  };

  // Hail bounce physics: gravity (px/frame^2) sets the parabola's steepness. Its magnitude was
  // always an empirically-chosen stylistic value, not a physically-derived one (no pixel-to-real
  // -world or frame-to-real-time conversion is ever established) — the *shape* of the motion
  // (true parabola, trig decomposition) is what's physics-accurate, not this specific number —
  // so it's a Testing Panel tunable like the cloud/fog constants rather than a fixed value.
  // Harder bounces correctly arc higher and longer as a real consequence of the physics, not a
  // bug. HAIL_FADE_FRAMES is the rapid fade-out duration once the stone hits the ground the
  // second time (not currently tunable).
  const WX_HAIL_TUNABLES = {
    gravity: 0.5,
  };
  const HAIL_FADE_FRAMES = 6;

  // How many rendered frames pass between re-rolling a thunderstorm flash's opacity. Default 1
  // matches the original every-frame flicker exactly; a Testing Panel slider (1-60, a fixed
  // 60fps assumption rather than a live per-device measurement, since real frame rate varies by
  // display) can slow it down to see the flash hold steady longer between re-rolls.
  const WX_LIGHTNING_TUNABLES = {
    rerollFrames: 1,
  };

  // Fog: previously a fixed 0.14 peak opacity at a baked-in pixel radius — too faint to notice.
  // Opacity/size/speed are read live at draw time (not baked into each blob at creation) so their
  // sliders take effect immediately; only blob count needs a rebuild, forced via lastParticleKey.
  const WX_FOG_TUNABLES = {
    opacityPct: 45,
    blobCount: 5,
    sizePct: 40,
    speedMult: 3,
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
    let rgb = skyRgb.map((v) => Math.max(0, Math.min(255, v * multiplier)));
    if (!daytime) {
      const gray = (rgb[0] + rgb[1] + rgb[2]) / 3;
      rgb = lerpRgb(rgb, [gray, gray, gray], WX_CLOUD_TUNABLES.nightGrayBlendPct / 100);
    }
    return { rgb, multiplier, daytime };
  }

  function cloudOverlayOpacity(cloudPct, daytime) {
    return daytime ? cloudPct * 0.75 / 100 : cloudPct / 100;
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
    const topPct = Math.random() * 66;
    const f = topPct / 66;
    const size = 3 - 2.25 * f;
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
    if (oldCloud) {
      // Independent clouds have no coordination — without this, a faster cloud's respawn cadence
      // can stay in a persistent, repeating phase relationship with a slower one, producing a
      // recurring visual cluster. Re-rolling a random hold delay on every respawn (held off-canvas
      // at the base `left: calc(-1 * var(--cloud-w))` rule, since no animation-fill-mode is set)
      // makes each cloud's effective loop period vary cycle to cycle, so they can't stay locked
      // together. The initial batch keeps its own separate negative-delay stagger in
      // renderWeatherSkin() instead — this only applies to ongoing respawns.
      cloud.style.animationDelay = (0.1 + Math.random() * 4.9) + 's';
    }
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
  // Stars live on their own canvas, behind the cloud overlay (unlike rain/snow/hail/fog/bolt,
  // which correctly sit in front of it) — so cloud opacity naturally occludes stars via ordinary
  // alpha compositing, with no separate formula needed.
  const starsCanvas = document.createElement('canvas');
  starsCanvas.className = 'weather-skin-stars';
  const starsCtx = starsCanvas.getContext('2d');
  const flashDiv = document.createElement('div');
  flashDiv.className = 'weather-skin-flash';

  let conditionParticles = [];
  let conditionStars = [];
  let conditionFog = [];
  let flashState = {
    active: false, nextFlash: 0, flashUntil: 0, flashAlpha: 0, boltPath: null,
    frameCount: 0, currentOpacity: 0,
  };

  // Cache the widget's rendered size instead of calling getBoundingClientRect() every animation
  // frame — a forced synchronous layout read, one of the more expensive things a browser can do
  // per frame. Only re-measure on an actual resize/orientation change, not on every frame.
  let cachedSkinSize = { w: 1, h: 1 };
  function measureSkinSize() {
    const rect = weatherSkin.getBoundingClientRect();
    cachedSkinSize = { w: Math.max(1, Math.round(rect.width)), h: Math.max(1, Math.round(rect.height)) };
  }
  measureSkinSize();
  window.addEventListener('resize', measureSkinSize);

  // Pause the per-frame animation loop entirely whenever the weather widget scrolls out of the
  // viewport. Tab-hidden is already handled for free by the browser's own rAF throttling; this
  // covers the separate case of the widget merely being scrolled off-screen in a visible tab.
  let skinIsVisible = true;
  new IntersectionObserver((entries) => {
    skinIsVisible = entries[entries.length - 1].isIntersecting;
  }).observe(weatherSkin);

  // Frame-rate cap: the loop's real per-frame cost (canvas clears, particle math) doesn't need to
  // run at a phone's full display refresh rate (up to 90Hz+) to look smooth. Capped to ~30fps by
  // skipping the draw work (but still rescheduling the next rAF for accurate timing) until enough
  // wall-clock time has passed, cutting sustained CPU/GPU work roughly in half on a 60Hz screen.
  const WX_FRAME_INTERVAL_MS = 1000 / 30;
  let lastDrawTs = 0;

  // Procedurally generate a jagged bolt each time it fires — never the same shape twice — as a
  // zigzag random-walk from a random point along the top edge down to a strike point biased
  // toward the bottom of the widget, with an occasional small fork partway down.
  function generateBoltPath(w, h) {
    const startX = w * (0.15 + Math.random() * 0.7);
    const endY = h * (0.75 + Math.random() * 0.25);
    const segments = 5 + Math.floor(Math.random() * 4);
    const main = [{ x: startX, y: 0 }];
    let x = startX;
    for (let i = 1; i <= segments; i++) {
      x += (Math.random() - 0.5) * w * 0.12;
      main.push({ x, y: (endY / segments) * i });
    }
    let fork = null;
    if (Math.random() < 0.4) {
      const forkStart = main[Math.floor(main.length / 2)];
      fork = [forkStart];
      let fx = forkStart.x;
      let fy = forkStart.y;
      const forkSegs = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < forkSegs; i++) {
        fx += (Math.random() - 0.3) * w * 0.1;
        fy += (h - forkStart.y) * 0.15;
        fork.push({ x: fx, y: fy });
      }
    }
    return { main, fork };
  }
  function drawBoltPath(path) {
    precipCtx.save();
    precipCtx.strokeStyle = 'rgba(255,250,220,0.95)';
    precipCtx.shadowColor = 'rgba(255,250,220,0.8)';
    precipCtx.shadowBlur = 8;
    precipCtx.lineWidth = 2;
    precipCtx.beginPath();
    precipCtx.moveTo(path.main[0].x, path.main[0].y);
    for (let i = 1; i < path.main.length; i++) precipCtx.lineTo(path.main[i].x, path.main[i].y);
    precipCtx.stroke();
    if (path.fork) {
      precipCtx.lineWidth = 1.2;
      precipCtx.beginPath();
      precipCtx.moveTo(path.fork[0].x, path.fork[0].y);
      for (let i = 1; i < path.fork.length; i++) precipCtx.lineTo(path.fork[i].x, path.fork[i].y);
      precipCtx.stroke();
    }
    precipCtx.restore();
  }
  let lastParticleKey = '';

  function rebuildConditionParticles(c, w, h, ts) {
    conditionParticles = [];
    // A plain thunderstorm still forces the heavy-rain visual, but thunderSnow (decomposed to
    // thunderstorm+snow) should show falling snow instead of rain alongside the lightning — so
    // the rain-forcing is suppressed whenever snow is also active.
    const heavy = c.has('heavyRain') || (c.has('thunderstorm') && !c.has('snow'));
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
      for (let i = 0; i < 22; i++) {
        // ~25% of stones fall 1.5x as fast; that same fall speed becomes their own bounce
        // "energy" later — no separate height multiplier, a stone that fell faster just
        // naturally bounces harder since energy in equals energy out.
        const baseSpeed = 4.375 + Math.random() * 1.25;
        conditionParticles.push({
          type: 'hail', x: Math.random() * w, y: Math.random() * h,
          speed: Math.random() < 0.25 ? baseSpeed * 1.5 : baseSpeed,
          r: 2 + Math.random() * 1.2, state: 'fall', bounceT: 0,
        });
      }
    }
    conditionFog = c.has('fog')
      ? Array.from({ length: WX_FOG_TUNABLES.blobCount }, () => ({
          x: Math.random() * w, y: h * (0.2 + Math.random() * 0.6), sizeFactor: 0.8 + Math.random() * 0.4,
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
            x: Math.random() * w, y: Math.random() * h * 0.8, r: 0.6 + Math.random() * 0.9,
            color: pickStarColor(), isDim, baseline,
            flickerStart: -1, flickerDur: 0, flickerDelta: 0,
            nextFlickerAt: ts + 500 + Math.random() * 6000,
          };
        })
      : [];
  }

  function stepConditionSkin(ts) {
    requestAnimationFrame(stepConditionSkin);
    if (!skinIsVisible) return;
    if (ts - lastDrawTs < WX_FRAME_INTERVAL_MS) return;
    // Real-time-scaled motion: particle speeds below are all tuned as a "per drawn frame"
    // increment against an implicit 60fps baseline. Capping the draw rate (above) changes how
    // often those increments happen without changing their size, which would otherwise slow
    // every particle's real-world speed down to match the new draw rate. frameScale corrects for
    // that using actual elapsed wall-clock time, so motion speed stays constant regardless of the
    // draw-rate cap — clamped to guard against one huge jump after being paused a long time.
    const frameScale = lastDrawTs ? Math.min(4, (ts - lastDrawTs) / (1000 / 60)) : 1;
    lastDrawTs = ts;
    const c = getEffectiveConditionSkins();
    if (!weatherSettings.liveSkin) {
      if (precipCanvas.width) precipCtx.clearRect(0, 0, precipCanvas.width, precipCanvas.height);
      if (starsCanvas.width) starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      flashDiv.style.opacity = '0';
      return;
    }
    const w = cachedSkinSize.w;
    const h = cachedSkinSize.h;
    const dpr = window.devicePixelRatio || 1;
    const key = [...c].sort().join(',') + '|' + w + 'x' + h + '@' + dpr;
    if (key !== lastParticleKey) {
      precipCanvas.width = Math.round(w * dpr);
      precipCanvas.height = Math.round(h * dpr);
      precipCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsCanvas.width = Math.round(w * dpr);
      starsCanvas.height = Math.round(h * dpr);
      starsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildConditionParticles(c, w, h, ts);
      lastParticleKey = key;
    }
    starsCtx.clearRect(0, 0, w, h);
    precipCtx.clearRect(0, 0, w, h);

    precipCtx.strokeStyle = (c.has('heavyRain') || c.has('thunderstorm')) ? 'rgba(120,140,170,0.55)' : 'rgba(160,180,200,0.45)';
    precipCtx.lineWidth = 1.2;
    for (const p of conditionParticles) {
      if (p.type !== 'rain') continue;
      p.y += p.speed * frameScale;
      p.x += p.speed * 0.25 * frameScale;
      if (p.y > h) { p.y = -p.len; p.x = Math.random() * w; }
      precipCtx.beginPath();
      precipCtx.moveTo(p.x, p.y);
      precipCtx.lineTo(p.x - p.len * 0.3, p.y - p.len);
      precipCtx.stroke();
    }

    precipCtx.fillStyle = 'rgba(255,255,255,0.9)';
    for (const p of conditionParticles) {
      if (p.type !== 'snow') continue;
      p.y += p.speed * frameScale;
      p.swayPhase += 0.02 * p.swaySpeed * frameScale;
      if (p.y > h) { p.y = -4; p.x = Math.random() * w; }
      const x = p.x + Math.sin(p.swayPhase) * p.swayAmp;
      precipCtx.beginPath();
      precipCtx.arc(x, p.y, p.r, 0, Math.PI * 2);
      precipCtx.fill();
    }

    precipCtx.fillStyle = 'rgba(230,235,240,1)';
    for (const p of conditionParticles) {
      if (p.type !== 'hail') continue;
      if (p.state === 'fall') {
        p.y += p.speed * frameScale;
        if (p.y > h - p.r) {
          p.state = 'arc';
          p.bounceT = 0;
          p.bounceFromY = h - p.r;
          p.bounceFromX = p.x;
          // -45..+45 degrees off straight-up (45 degrees above horizontal on each side), so a
          // stone can shoot off to either side or bounce straight back. Energy conservation, not
          // a separate height multiplier: a stone's own fall speed is its bounce energy, split
          // into vertical/horizontal launch velocity components via true trigonometric
          // decomposition (satisfying vertical^2 + horizontal^2 = energy^2), so a wide angle
          // trades height for reach rather than getting both at once.
          p.bounceAngle = (Math.random() * 90 - 45) * Math.PI / 180;
          p.vy0 = p.speed * Math.cos(p.bounceAngle);
          p.vx0 = p.speed * Math.sin(p.bounceAngle);
        }
      } else if (p.state === 'arc') {
        // True constant-acceleration projectile motion: a real gravity parabola for height
        // (not an eased curve), constant velocity horizontally (no reversal, no snapping back
        // to the launch point). Gravity is a live Testing Panel tunable (WX_HAIL_TUNABLES.gravity)
        // rather than a fixed constant — verified against hand-calculated positions with a
        // deterministic Math.random() override.
        p.bounceT += frameScale;
        const t = p.bounceT;
        const heightAboveGround = p.vy0 * t - 0.5 * WX_HAIL_TUNABLES.gravity * t * t;
        if (heightAboveGround <= 0) {
          // Real second touchdown (flight time derived from physics, not a fixed frame count).
          // Stays fully opaque up to this exact instant; the fade-out starts only now.
          p.state = 'fading';
          p.fadeT = 0;
          p.y = p.bounceFromY;
          p.x = p.bounceFromX + p.vx0 * t;
        } else {
          p.y = p.bounceFromY - heightAboveGround;
          p.x = p.bounceFromX + p.vx0 * t;
        }
      } else {
        // Fading: keeps drifting at the same constant horizontal rate it already had, rather
        // than freezing in place, while fading out.
        p.fadeT += frameScale;
        p.x += p.vx0 * frameScale;
        if (p.fadeT > HAIL_FADE_FRAMES) {
          p.state = 'fall';
          p.y = -4;
          p.x = Math.random() * w;
        }
      }
      precipCtx.globalAlpha = p.state === 'fading' ? Math.max(0, 1 - p.fadeT / HAIL_FADE_FRAMES) : 1;
      precipCtx.beginPath();
      precipCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      precipCtx.fill();
      precipCtx.globalAlpha = 1;
    }

    for (const b of conditionFog) {
      const r = w * (WX_FOG_TUNABLES.sizePct / 100) * b.sizeFactor;
      b.x += b.speed * 0.02 * b.dir * WX_FOG_TUNABLES.speedMult * frameScale;
      if (b.x - r > w) b.x = -r;
      if (b.x + r < 0) b.x = w + r;
      const grad = precipCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
      grad.addColorStop(0, `rgba(220,220,225,${WX_FOG_TUNABLES.opacityPct / 100})`);
      grad.addColorStop(1, 'rgba(220,220,225,0)');
      precipCtx.fillStyle = grad;
      precipCtx.beginPath();
      precipCtx.arc(b.x, b.y, r, 0, Math.PI * 2);
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
        starsCtx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${opacity.toFixed(2)})`;
        starsCtx.beginPath();
        starsCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        starsCtx.fill();
      }
    }

    if (c.has('thunderstorm')) {
      // Flat 5-10s between flashes — no intensity concept, no separate double-flash roll. Each
      // flash lasts 100-1000ms with its alpha re-rolled every frame for the whole lifetime, so it
      // flickers throughout rather than holding one steady brightness (this alone reads as
      // multiple quick pulses when a flash runs long, without needing extra scheduling state).
      if (!flashState.active && ts >= flashState.nextFlash) {
        flashState.active = true;
        flashState.flashUntil = ts + 100 + Math.random() * 900;
        flashState.flashAlpha = 0.85 + Math.random() * 0.15;
        flashState.frameCount = 0;
        // Most flashes are ambient-only (a distant/off-screen strike); 25% also show a bolt.
        flashState.boltPath = Math.random() < 0.25 ? generateBoltPath(w, h) : null;
      }
      if (flashState.active) {
        if (ts >= flashState.flashUntil) {
          flashState.active = false;
          flashState.nextFlash = ts + 5000 + Math.random() * 5000;
          flashDiv.style.opacity = '0';
        } else {
          // Re-roll the flicker only every WX_LIGHTNING_TUNABLES.rerollFrames frames, holding
          // the last value steady in between (default 1 = every frame, the original behavior).
          if (flashState.frameCount % WX_LIGHTNING_TUNABLES.rerollFrames === 0) {
            flashState.currentOpacity = flashState.flashAlpha * (0.4 + Math.random() * 0.6);
          }
          flashState.frameCount++;
          flashDiv.style.opacity = String(flashState.currentOpacity);
          if (flashState.boltPath) drawBoltPath(flashState.boltPath);
        }
      }
    } else {
      flashState.active = false;
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

    weatherSkin.querySelectorAll('.weather-skin-overlay').forEach((el) => el.remove());
    const cloudPct = getEffectiveCloudPct();
    let cloudTint = null;
    if (weatherSettings.liveSkin) {
      cloudTint = computeCloudTint(getEffectiveSkyTime(), getEffectiveConditionSkins());
      // Fixed layer order: gradient -> stars -> cloud overlay -> precipitation (rain/snow/hail/
      // fog/bolt) -> floating clouds -> lightning flash. Stars sit behind the cloud overlay so
      // cloud opacity occludes them for free; everything else correctly stays in front of it.
      weatherSkin.appendChild(starsCanvas);
      const overlay = document.createElement('div');
      overlay.className = 'weather-skin-overlay';
      overlay.style.background = rgbToHex(cloudTint.rgb);
      overlay.style.opacity = String(cloudOverlayOpacity(cloudPct, cloudTint.daytime));
      weatherSkin.appendChild(overlay);
      weatherSkin.appendChild(precipCanvas);

      // Every call here used to wipe and recreate every cloud from scratch, each one instantly
      // scattered mid-drift via a negative animation-delay. That's the right move only for the
      // cloud layer's true first appearance (so a fresh batch doesn't visually clump at the left
      // edge all starting together) — but this function runs on every settings change (theme,
      // cloud slider, condition pick, time override, etc.), so it was re-scattering existing
      // clouds mid-canvas on every one of those, not just page load. Now: leave an unchanged
      // cloud count alone entirely, only add/remove the difference when cloudPct actually changes.
      const existingClouds = Array.from(weatherSkin.querySelectorAll('.wx-skin-cloud'));
      const cloudCount = Math.floor(cloudPct / 10);
      if (existingClouds.length === 0) {
        for (let i = 0; i < cloudCount; i++) {
          const cloud = spawnCloud();
          cloud.style.animationDelay = (-Math.random() * parseFloat(cloud.style.animationDuration)) + 's';
        }
      } else {
        // Re-append (move, not recreate) the preserved clouds so they stay correctly layered
        // above the overlay/precip canvas just re-appended above — moving an existing node via
        // appendChild doesn't restart or otherwise disturb its running CSS animation.
        existingClouds.forEach((cloud) => weatherSkin.appendChild(cloud));
        if (existingClouds.length > cloudCount) {
          for (let i = existingClouds.length - 1; i >= cloudCount; i--) existingClouds[i].remove();
        } else if (existingClouds.length < cloudCount) {
          // New clouds only. Each needs its own random hold-delay (same as an ordinary
          // respawn) — without one, every cloud added in this batch starts its animation at
          // the exact same instant from the exact same off-canvas position, which visually
          // looks like a vertical line of clouds at the left edge until their differing speeds
          // spread them out.
          for (let i = existingClouds.length; i < cloudCount; i++) {
            const cloud = spawnCloud();
            cloud.style.animationDelay = (0.1 + Math.random() * 4.9) + 's';
          }
        }
      }

      weatherSkin.appendChild(flashDiv);
      updateCloudTestingReadout(cloudTint, cloudOverlayOpacity(cloudPct, cloudTint.daytime));
    } else {
      starsCanvas.remove();
      precipCanvas.remove();
      flashDiv.remove();
      weatherSkin.querySelectorAll('.wx-skin-cloud').forEach((el) => el.remove());
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
    const conditionSkinRadios = document.querySelectorAll('.test-condition-skin');
    const conditionSkinLiveRadio = document.querySelector('.test-condition-skin[value="live"]');
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
    const nightGraySlider = document.getElementById('test-cloud-nightgray-slider');
    const nightGrayValue = document.getElementById('test-cloud-nightgray-value');
    const fogOpacitySlider = document.getElementById('test-fog-opacity-slider');
    const fogOpacityValue = document.getElementById('test-fog-opacity-value');
    const fogCountSlider = document.getElementById('test-fog-count-slider');
    const fogCountValue = document.getElementById('test-fog-count-value');
    const fogSizeSlider = document.getElementById('test-fog-size-slider');
    const fogSizeValue = document.getElementById('test-fog-size-value');
    const fogSpeedSlider = document.getElementById('test-fog-speed-slider');
    const fogSpeedValue = document.getElementById('test-fog-speed-value');
    const hailGravitySlider = document.getElementById('test-hail-gravity-slider');
    const hailGravityValue = document.getElementById('test-hail-gravity-value');
    const lightningRerollSlider = document.getElementById('test-lightning-reroll-slider');
    const lightningRerollValue = document.getElementById('test-lightning-reroll-value');
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

    trigger.addEventListener('click', () => { overlay.hidden = false; renderWeatherDebugPanel(); });
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

    conditionSkinRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (!radio.checked) return;
        if (radio.value === 'live') {
          weatherTestState.conditionCodeOverride = null;
          weatherTestState.conditionSkins = new Set();
        } else {
          const code = Number(radio.value);
          const entry = WX_CONDITIONS[code];
          weatherTestState.conditionCodeOverride = code;
          weatherTestState.conditionSkins = new Set(entry ? animKeysFor(entry.anim) : []);
        }
        renderWeatherExtras();
        renderWeatherSkin();
        updateClock(); // moon-dial clock's weather badge should reflect the override immediately
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
    bindCloudTunable(nightGraySlider, nightGrayValue, 'nightGrayBlendPct');

    fogOpacitySlider.addEventListener('input', () => {
      WX_FOG_TUNABLES.opacityPct = Number(fogOpacitySlider.value);
      fogOpacityValue.textContent = fogOpacitySlider.value + '%';
    });
    fogCountSlider.addEventListener('input', () => {
      WX_FOG_TUNABLES.blobCount = Number(fogCountSlider.value);
      fogCountValue.textContent = fogCountSlider.value;
      lastParticleKey = ''; // force a rebuild so the new blob count actually takes effect
    });
    fogSizeSlider.addEventListener('input', () => {
      WX_FOG_TUNABLES.sizePct = Number(fogSizeSlider.value);
      fogSizeValue.textContent = fogSizeSlider.value + '%';
    });
    fogSpeedSlider.addEventListener('input', () => {
      WX_FOG_TUNABLES.speedMult = Number(fogSpeedSlider.value);
      fogSpeedValue.textContent = fogSpeedSlider.value + 'x';
    });
    hailGravitySlider.addEventListener('input', () => {
      WX_HAIL_TUNABLES.gravity = Number(hailGravitySlider.value);
      hailGravityValue.textContent = hailGravitySlider.value;
    });
    lightningRerollSlider.addEventListener('input', () => {
      WX_LIGHTNING_TUNABLES.rerollFrames = Number(lightningRerollSlider.value);
      lightningRerollValue.textContent = lightningRerollSlider.value;
    });

    const weatherDebugOutput = document.getElementById('test-weather-debug-output');
    const weatherDebugCopyBtn = document.getElementById('test-weather-debug-copy-btn');
    weatherDebugCopyBtn.addEventListener('click', async () => {
      const text = formatWeatherDebugText();
      try {
        await navigator.clipboard.writeText(text);
        weatherDebugCopyBtn.textContent = 'Copied!';
      } catch (e) {
        // Clipboard API unavailable/denied — fall back to selecting the textarea for a manual
        // long-press-select-all-copy.
        weatherDebugOutput.focus();
        weatherDebugOutput.select();
        weatherDebugCopyBtn.textContent = 'Select the text above to copy';
      }
      setTimeout(() => { weatherDebugCopyBtn.textContent = 'Copy diagnostics'; }, 2000);
    });

    const weatherDebugClearBtn = document.getElementById('test-weather-debug-clear-btn');
    weatherDebugClearBtn.addEventListener('click', () => {
      weatherDebugOutput.value = '';
    });

    resetBtn.addEventListener('click', () => {
      weatherTestState.timeOverrideSec = null;
      weatherTestState.cloudOverridePct = null;
      weatherTestState.textStroke = false;
      weatherTestState.conditionSkins = new Set();
      weatherTestState.conditionCodeOverride = null;
      timeEnabled.checked = false;
      timeInput.value = secondsToTimeString(SUNSET_SEC);
      cloudSlider.value = 20;
      cloudValue.textContent = '20%';
      textStrokeToggle.checked = false;
      conditionSkinLiveRadio.checked = true;
      WX_CLOUD_TUNABLES.dayBasePct = 40;
      WX_CLOUD_TUNABLES.nightBasePct = 300;
      WX_CLOUD_TUNABLES.lightRainPct = 10;
      WX_CLOUD_TUNABLES.heavyRainPct = 20;
      WX_CLOUD_TUNABLES.thunderstormPct = 40;
      WX_CLOUD_TUNABLES.nightGrayBlendPct = 75;
      dayBaseSlider.value = 40; dayBaseValue.textContent = '40%';
      nightBaseSlider.value = 300; nightBaseValue.textContent = '300%';
      lightRainSlider.value = 10; lightRainValue.textContent = '10%';
      heavyRainSlider.value = 20; heavyRainValue.textContent = '20%';
      thunderstormSlider.value = 40; thunderstormValue.textContent = '40%';
      nightGraySlider.value = 75; nightGrayValue.textContent = '75%';
      WX_FOG_TUNABLES.opacityPct = 45;
      WX_FOG_TUNABLES.blobCount = 5;
      WX_FOG_TUNABLES.sizePct = 40;
      WX_FOG_TUNABLES.speedMult = 3;
      fogOpacitySlider.value = 45; fogOpacityValue.textContent = '45%';
      fogCountSlider.value = 5; fogCountValue.textContent = '5';
      fogSizeSlider.value = 40; fogSizeValue.textContent = '40%';
      fogSpeedSlider.value = 3; fogSpeedValue.textContent = '3x';
      WX_HAIL_TUNABLES.gravity = 0.5;
      hailGravitySlider.value = 0.5; hailGravityValue.textContent = '0.5';
      WX_LIGHTNING_TUNABLES.rerollFrames = 1;
      lightningRerollSlider.value = 1; lightningRerollValue.textContent = '1';
      lastParticleKey = '';
      renderWeatherExtras();
      renderWeatherSkin();
      updateClock();
    });
  })();

  // --- Severe weather alert ticker ---
  const WEATHER_ALERT_KEY = 'weatherAlertState';
  let alertState = {};
  try {
    alertState = JSON.parse(localStorage.getItem(WEATHER_ALERT_KEY) || '{}');
  } catch (e) {
    alertState = {};
  }
  function saveAlertState() {
    localStorage.setItem(WEATHER_ALERT_KEY, JSON.stringify(alertState));
  }
  // No real alert is the normal, common case — returns null rather than a placeholder, so
  // nothing gets shown as if it were real when it isn't (previously fell back to a hardcoded
  // sample alert here, which displayed unconditionally whenever there was no genuine one).
  function currentAlert() {
    if (weatherState.alerts && weatherState.alerts.length > 0) {
      const a = weatherState.alerts[0];
      const headline = a.headline || a.event || 'Weather Alert';
      return { id: headline, text: `⚠️ ${headline}${a.desc ? ' — ' + a.desc : ''} (Tap to dismiss.)` };
    }
    return null;
  }
  function shouldShowAlert() {
    if (!weatherSettings.severeAlerts) return false;
    const alert = currentAlert();
    if (!alert) return false;
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
    if (!alert) return;
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

  // --- Temporary Live Weather diagnostics (Testing Panel) ---
  // Tracks what actually happened on the last loadLiveWeather() call, since real live-data bugs
  // (e.g. moon phase silently never updating) have no visible error anywhere otherwise, and the
  // user has no dev tools access on mobile to inspect this directly. Remove once resolved.
  const weatherDebugState = {
    coords: null,
    keyPresent: false,
    keyMasked: '(none)',
    cachePresent: false,
    cacheAgeMin: null,
    cacheStale: null,
    outcome: 'not-yet-loaded',
    errorMessage: null,
    rawData: null,
  };
  function maskApiKey(key) {
    if (!key) return '(none)';
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.slice(0, 4) + '...' + key.slice(-4);
  }
  function formatWeatherDebugText() {
    const d = weatherDebugState;
    const fday = d.rawData && d.rawData.forecast && d.rawData.forecast.forecastday && d.rawData.forecast.forecastday[0];
    const astro = fday && fday.astro;
    const condition = d.rawData && d.rawData.current && d.rawData.current.condition;
    return [
      '--- Live Weather Diagnostics ---',
      'Key present: ' + (d.keyPresent ? 'yes (' + d.keyMasked + ')' : 'no'),
      'Coords used: ' + (d.coords ? `${d.coords.lat}, ${d.coords.lon}` : '(not yet fetched)'),
      'Cache present: ' + (d.cachePresent ? 'yes' : 'no'),
      d.cachePresent ? 'Cache age: ' + d.cacheAgeMin + ' min (' + (d.cacheStale ? 'stale' : 'fresh') + ')' : null,
      'Last outcome: ' + d.outcome,
      'Last error: ' + (d.errorMessage || '(none)'),
      '',
      '--- Raw astro ---',
      astro ? JSON.stringify(astro, null, 2) : '(none)',
      '',
      '--- Raw condition ---',
      condition ? JSON.stringify(condition, null, 2) : '(none)',
      '',
      '--- Full raw response ---',
      d.rawData ? JSON.stringify(d.rawData, null, 2) : '(none)',
    ].filter((line) => line !== null).join('\n');
  }
  function renderWeatherDebugPanel() {
    const out = document.getElementById('test-weather-debug-output');
    if (out) out.value = formatWeatherDebugText();
  }

  // Live Condition Skin animation for a WeatherAPI code now comes straight from WX_CONDITIONS
  // (the single source of truth declared earlier, alongside the icon map) instead of a separate
  // parallel map — see WX_CONDITIONS and animKeysFor for the full per-code table and how the two
  // composite animations (thunderSnow, snowFog) expand into their base effects.
  function mapConditionCode(code) {
    const entry = WX_CONDITIONS[code];
    return entry ? entry.anim : null;
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

  // WeatherAPI's astro.sunrise/astro.sunset are "HH:MM AM/PM" strings (e.g. "06:32 AM") — parse
  // into seconds-of-day so SUNRISE_SEC/SUNSET_SEC can be derived from the real location instead
  // of staying on their hardcoded defaults.
  function parseAstroTime(str) {
    const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec((str || '').trim());
    if (!m) return null;
    let h = parseInt(m[1], 10) % 12;
    if (/pm/i.test(m[3])) h += 12;
    return h * 3600 + parseInt(m[2], 10) * 60;
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
    const fday2 = (data.forecast && data.forecast.forecastday && data.forecast.forecastday[1]) || {};
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
    const parsedSunrise = parseAstroTime(astro.sunrise);
    const parsedSunset = parseAstroTime(astro.sunset);
    if (parsedSunrise !== null) SUNRISE_SEC = parsedSunrise;
    if (parsedSunset !== null) SUNSET_SEC = parsedSunset;
    weatherState.alerts = (data.alerts && data.alerts.alert) || [];
    // Next 12 hours starting at the current hour, spanning into tomorrow's data (fday2) when
    // needed so this always has 12 entries regardless of what time of day it is.
    const allHours = [].concat(fday.hour || [], fday2.hour || []);
    const currentHourEpoch = Math.floor(Date.now() / 1000 / 3600) * 3600;
    const startIdx = allHours.findIndex((h) => h.time_epoch >= currentHourEpoch);
    weatherState.hourly = startIdx >= 0 ? allHours.slice(startIdx, startIdx + 12) : [];

    weatherLiveConditions.clear();
    animKeysFor(mapConditionCode(weatherState.conditionCode)).forEach((k) => weatherLiveConditions.add(k));

    renderWeatherTemps();
    renderWind();
    renderWeatherExtras();
    renderWeatherSkin();
    applyAlertTicker();
    if (hourlyPanel.classList.contains('open')) renderHourlyPanel();

    if (weatherState.tzId) {
      const abbr = tzAbbreviation(weatherState.tzId);
      const tzPill = document.getElementById('clock-tz-pill');
      if (abbr && tzPill) tzPill.textContent = abbr;
    }
  }

  async function loadLiveWeather(force) {
    const key = localStorage.getItem(WEATHERAPI_KEY_STORAGE);
    weatherDebugState.keyPresent = !!key;
    weatherDebugState.keyMasked = maskApiKey(key);
    if (!key) {
      weatherDebugState.outcome = 'no-key';
      renderWeatherDebugPanel();
      return;
    }
    let cache = null;
    try { cache = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || 'null'); } catch (e) { cache = null; }
    const isStale = !cache || (Date.now() - cache.fetchedAt) >= WEATHER_STALE_MS;
    weatherDebugState.cachePresent = !!cache;
    weatherDebugState.cacheAgeMin = cache ? Math.round((Date.now() - cache.fetchedAt) / 60000) : null;
    weatherDebugState.cacheStale = cache ? isStale : null;
    if (!force && cache && !isStale) {
      weatherDebugState.outcome = 'served-cache-fresh';
      weatherDebugState.errorMessage = null;
      weatherDebugState.rawData = cache.data;
      applyLiveWeatherData(cache.data);
      renderWeatherDebugPanel();
      return;
    }
    const coords = await getCoords();
    weatherDebugState.coords = coords;
    try {
      // days=2 (not 1): the Hourly Forecast panel needs the next 12 hours from "now" at any time
      // of day — with only today's 24 hours, fewer than 12 would remain late in the day.
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(key)}&q=${coords.lat},${coords.lon}&days=2&aqi=no&alerts=yes`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('WeatherAPI request failed: ' + res.status);
      const data = await res.json();
      localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data }));
      weatherDebugState.outcome = 'fetched-fresh';
      weatherDebugState.errorMessage = null;
      weatherDebugState.rawData = data;
      applyLiveWeatherData(data);
    } catch (e) {
      console.error('Weather fetch failed:', e);
      weatherDebugState.errorMessage = e.message || String(e);
      if (cache) {
        weatherDebugState.outcome = 'fallback-stale-cache';
        weatherDebugState.rawData = cache.data;
        applyLiveWeatherData(cache.data);
      } else {
        weatherDebugState.outcome = 'error-no-cache';
        weatherDebugState.rawData = null;
      }
    }
    renderWeatherDebugPanel();
  }

  function refreshLiveWeather(force) {
    loadLiveWeather(!!force);
  }

  refreshLiveWeather(false);

  attachLongPress(document.getElementById('weather-widget'), openWeatherOptions);

  // Deferred to here (not immediately after the clock section is defined above) because the
  // 'moon-dial' analog style's rendering reads weatherState/WX_MOON_PHASE_ICONS/WX_CONDITIONS,
  // all declared later in the weather section — calling this any earlier would throw a
  // temporal-dead-zone error the moment a returning user had that style saved from a previous
  // session with mode:'analog', crashing the whole script silently (the same class of bug this
  // codebase has hit before with weatherTestState/weatherLiveConditions).
  applyClockDisplayMode();
  updateClock();
  scheduleNextClockTick();
})();
