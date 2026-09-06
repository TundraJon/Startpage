(function () {
  const root = document.documentElement;

  // Site name — not the Home category (the .category-name "Home" inside .category--home, a
  // separate element entirely), but the page's own name: the browser tab title and the visible
  // <h1 class="site-title"> in .site-header. Falls back to "Home" (the original hardcoded value)
  // whenever unset/empty, so a fresh device with no stored value renders exactly as it always has.
  const SITE_NAME_STORAGE = 'siteName';
  const SITE_NAME_DEFAULT = 'Home';
  const siteNameInput = document.getElementById('site-name-input');
  const siteTitleEl = document.querySelector('.site-title');

  function applySiteName(name) {
    const value = name || SITE_NAME_DEFAULT;
    document.title = value;
    siteTitleEl.textContent = value;
  }

  siteNameInput.value = localStorage.getItem(SITE_NAME_STORAGE) || '';
  applySiteName(siteNameInput.value.trim());
  siteNameInput.addEventListener('change', () => {
    const name = siteNameInput.value.trim();
    if (name) localStorage.setItem(SITE_NAME_STORAGE, name);
    else localStorage.removeItem(SITE_NAME_STORAGE);
    applySiteName(name);
  });

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

  // --- Global single-open category navigation ---
  // Exactly one category/subcategory chain is expanded anywhere on the page at a time (Home is
  // exempt — it has no accordion state). openPath is an ordered list of category ids from a
  // top-level category down to whichever leaf is currently selected; opening any category or
  // subcategory replaces the whole path, collapsing everything else at any depth. categoryToggles
  // maps categoryId -> { section, contentEl, ownGridEl, mainBtn, collapseBtn } and is also used by
  // Move Entry's cross-category cascading hover-to-open.
  const categoryToggles = new Map();
  const CATEGORY_OPEN_PATH_KEY = 'category-open-path';
  let openPath = [];
  // True right after a first tap on a with-subcategories leaf's collapse button hides its own
  // links while keeping it on the path (its subcategory rows stay visible/tappable) — double-duty
  // collapse: a second tap, now that nothing is shown under it, fully closes that level. Reset to
  // false whenever navigation actually changes the leaf, so own-links always show fresh again per
  // the normal "falls back to own links" rule.
  let leafLinksCollapsed = false;
  // Multi-select batch move state, and Move Entry's dragInfo, declared here, ahead of
  // renderOpenPath's first call below, since renderOpenPath (via updateSelectActionBar, and now
  // its own drag-pinning logic) reads them and function declarations alone don't save a `let`
  // from its temporal dead zone. The rest of each feature is implemented further down.
  let selectMode = null;
  let pickingDestination = false;
  let dragInfo = null;
  // Organize Mode's own inactivity auto-close timer id — reset on every meaningful interaction,
  // including live drag activity, since dragging is a capability layered on top of select mode
  // rather than a separate state. See resetSelectModeTimeout, defined further down once
  // exitSelectMode exists.
  let selectModeTimeoutId = null;
  const selectActionBar = document.getElementById('select-action-bar');
  const selectActionStatus = document.getElementById('select-action-status');
  const selectActionSelectAllBtn = document.getElementById('select-action-selectall');
  const selectActionCutBtn = document.getElementById('select-action-cut');
  const selectActionRenameBtn = document.getElementById('select-action-rename');
  const selectActionPasteBtn = document.getElementById('select-action-paste');
  const selectActionDeleteBtn = document.getElementById('select-action-delete');
  const selectActionClearBtn = document.getElementById('select-action-clear');

  // Ancestor chain (root -> id) for a category, walked via the live DOM rather than stored state,
  // so it's always correct regardless of what was previously open.
  function categoryAncestorChain(id) {
    const chain = [];
    let section = categoryToggles.has(id) ? categoryToggles.get(id).section : null;
    while (section) {
      chain.unshift(section.dataset.categoryId);
      const parentContent = section.parentElement;
      section = parentContent && parentContent.closest ? parentContent.closest('.category') : null;
    }
    return chain;
  }

  function isPathLeaf(id) {
    return openPath.length > 0 && openPath[openPath.length - 1] === id;
  }

  function renderOpenPath() {
    // The Build 46 "pinned chain" exception (keeping a dragged tile's category forced open even
    // while hovering elsewhere) is gone — Move Entry drag no longer navigates to other categories
    // at all (same-category reorder only, see dragInfo/finishTileDrag), so there's nothing left
    // for it to protect against. Plain openPath rendering only.
    categoryToggles.forEach((entry, id) => {
      const onPath = openPath.includes(id);
      entry.contentEl.hidden = !onPath;
      entry.mainBtn.setAttribute('aria-expanded', String(onPath));
      // Own direct links are the default child shown when a category-with-subcategories opens —
      // visible only while this category is the deepest (leaf) selection, hidden as soon as one
      // of its subcategories becomes the active child instead, or the leaf's collapse button has
      // hidden them via the double-duty behavior below.
      if (entry.ownGridEl) {
        entry.ownGridEl.hidden = !(onPath && isPathLeaf(id) && !leafLinksCollapsed);
      }
      // Every category on the current path gets its own collapse button now that the chevron
      // (redundant with tapping the header to open) is gone — not just the deepest leaf.
      entry.collapseBtn.hidden = !onPath;
    });
    localStorage.setItem(CATEGORY_OPEN_PATH_KEY, JSON.stringify(openPath));
    // No-op until select mode's destination-picking UI is defined further down (hoisted function
    // declaration) — keeps the "current destination" status text in sync with navigation.
    updateSelectActionBar();
  }

  function openCategoryPath(id) {
    openPath = categoryAncestorChain(id);
    leafLinksCollapsed = false;
    renderOpenPath();
  }

  // Every category on the current path has its own collapse button now, outdented to match its
  // own indent depth. Tapping a non-leaf ancestor's button truncates the path back to just before
  // it, closing it and everything open beneath it in one tap. Tapping the leaf's button keeps the
  // old double duty: a with-subcategories leaf's first tap hides just its own links, staying on
  // the path so its subcategory rows remain visible/tappable — a second tap (nothing shown under
  // it anymore) fully closes this level. A flat leaf (no subcategories) has nothing to stay open
  // for, so it keeps a single-tap full collapse.
  function collapseFromCategory(id) {
    const index = openPath.indexOf(id);
    if (index === -1) return;
    const isLeaf = index === openPath.length - 1;
    const entry = categoryToggles.get(id);
    if (isLeaf && entry && entry.ownGridEl && !leafLinksCollapsed) {
      leafLinksCollapsed = true;
    } else {
      openPath = openPath.slice(0, index);
      leafLinksCollapsed = false;
    }
    renderOpenPath();
  }

  function collapseAllCategories() {
    openPath = [];
    leafLinksCollapsed = false;
    renderOpenPath();
  }

  // Home's category header is sticky, anchored just below .pinned-header rather than at a
  // hardcoded pixel offset — .pinned-header's real height varies (alert ticker, hourly-forecast
  // content, window resize/orientation), so a ResizeObserver keeps --pinned-header-height in sync
  // with whatever it actually is at any moment, rather than drifting stale after any of those.
  const pinnedHeaderEl = document.querySelector('.pinned-header');
  if (pinnedHeaderEl && 'ResizeObserver' in window) {
    const pinnedHeaderObserver = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      document.documentElement.style.setProperty('--pinned-header-height', height + 'px');
    });
    pinnedHeaderObserver.observe(pinnedHeaderEl);
  }

  // Home's own header is now position: fixed (removed from flow — see .category-header--home's
  // CSS comment for why), so .category--home .tile-grid needs to reserve exactly its height via
  // padding-top, kept live the same way as --pinned-header-height above. Reads .offsetHeight
  // (border-box, includes the header's own 10px/14px padding) rather than the ResizeObserver
  // entry's contentRect (content-box only, would under-report by the vertical padding and leave
  // a gap the tile-grid doesn't actually need to cover).
  const homeHeaderEl = document.querySelector('.category-header--home');
  if (homeHeaderEl && 'ResizeObserver' in window) {
    const homeHeaderObserver = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--home-header-height', homeHeaderEl.offsetHeight + 'px');
    });
    homeHeaderObserver.observe(homeHeaderEl);
  }

  // --- Category data model: categories (everything except Home, which stays static/special-cased)
  // are now persisted data rendered into DOM at load, instead of hand-authored HTML being the
  // source of truth. Mirrors the tile system's own storage/migration pattern (TILE_STORAGE_PREFIX,
  // newTileId, seed-data migration) one level up the tree.
  const CATEGORY_TREE_KEY = 'categoryTree';
  const CATEGORY_TREE_MIGRATED_FLAG = 'categoryTreeMigrated';

  // One-time seed: the hierarchy that used to be hand-authored directly in index.html, captured
  // here so upgrading doesn't lose anyone's existing categories or their stripe colors. Every
  // category (not just top-level) keeps its own stripeColor in the data model, matching how they
  // actually render today — only the future color-*picker UI* is scoped to top-level categories,
  // not the underlying data.
  const CATEGORY_SEED_DATA = {
    'news': { name: 'News', parentId: null, order: 0, stripeColor: '#3B82C4' },
    'shopping': { name: 'Shopping', parentId: null, order: 1, stripeColor: '#2E8B57' },
    'entertainment': { name: 'Entertainment', parentId: null, order: 2, stripeColor: '#8E44AD' },
    'test-a': { name: 'Sample Category A', parentId: null, order: 3, stripeColor: '#E74C3C' },
    'test-b': { name: 'Sample Category B', parentId: null, order: 4, stripeColor: '#16A085' },
    'test-b-sub1': { name: 'Sample Sub 1', parentId: 'test-b', order: 0, stripeColor: '#1ABC9C' },
    'test-b-sub2': { name: 'Sample Sub 2', parentId: 'test-b', order: 1, stripeColor: '#48C9B0' },
    'test-c': { name: 'Sample Category C', parentId: null, order: 5, stripeColor: '#F39C12' },
    'test-c-suba': { name: 'Sample Sub A', parentId: 'test-c', order: 0, stripeColor: '#F5B041' },
    'test-c-suba-1': { name: 'Sample Sub A-1', parentId: 'test-c-suba', order: 0, stripeColor: '#F8C471' },
    'test-d': { name: 'Sample Category D', parentId: null, order: 6, stripeColor: '#9B59B6' },
    'test-e': { name: 'Sample Category E', parentId: null, order: 7, stripeColor: '#7F8C8D' },
  };

  function saveCategoryTree(tree) {
    localStorage.setItem(CATEGORY_TREE_KEY, JSON.stringify(tree));
  }

  function loadCategoryTree() {
    let tree;
    try {
      tree = JSON.parse(localStorage.getItem(CATEGORY_TREE_KEY) || '{}');
    } catch (e) {
      tree = {};
    }
    if (!tree || typeof tree !== 'object') tree = {};
    if (localStorage.getItem(CATEGORY_TREE_MIGRATED_FLAG) !== 'true') {
      Object.keys(CATEGORY_SEED_DATA).forEach((id) => {
        if (!tree[id]) tree[id] = Object.assign({ createdAt: Date.now() }, CATEGORY_SEED_DATA[id]);
      });
      localStorage.setItem(CATEGORY_TREE_MIGRATED_FLAG, 'true');
      saveCategoryTree(tree);
    }
    return tree;
  }

  const categoryTree = loadCategoryTree();

  // Sorted [id, node] pairs for a given parent (null = top-level) — order determines both render
  // order and, via presence/absence, whether a category renders as flat (a plain .tile-grid) or as
  // a .category-content wrapper (own links + nested subcategories). Deriving this from the data at
  // render time, rather than baking the flat-vs-nested shape into hand-authored markup, is what
  // lets a future "add subcategory under a currently-flat category" op just work automatically.
  function categoryChildren(parentId) {
    return Object.keys(categoryTree)
      .filter((id) => categoryTree[id].parentId === parentId)
      .sort((a, b) => categoryTree[a].order - categoryTree[b].order)
      .map((id) => [id, categoryTree[id]]);
  }

  function buildCategorySection(id, node) {
    const section = document.createElement('section');
    section.className = 'category';
    section.dataset.categoryId = id;
    if (node.stripeColor) section.style.setProperty('--stripe-color', node.stripeColor);

    const header = document.createElement('div');
    header.className = 'category-header';
    const mainBtn = document.createElement('button');
    mainBtn.type = 'button';
    mainBtn.className = 'category-header-main';
    mainBtn.setAttribute('aria-expanded', 'false');
    const checkSpan = document.createElement('span');
    checkSpan.className = 'category-select-check';
    checkSpan.textContent = '✓';
    checkSpan.hidden = true;
    mainBtn.appendChild(checkSpan);
    const nameSpan = document.createElement('span');
    nameSpan.className = 'category-name';
    nameSpan.textContent = node.name;
    mainBtn.appendChild(nameSpan);
    header.appendChild(mainBtn);
    const collapseBtn = document.createElement('button');
    collapseBtn.type = 'button';
    collapseBtn.className = 'category-collapse-btn';
    collapseBtn.setAttribute('aria-label', 'Collapse ' + node.name);
    collapseBtn.hidden = true;
    collapseBtn.textContent = '▲';
    header.appendChild(collapseBtn);
    section.appendChild(header);

    const children = categoryChildren(id);
    if (children.length > 0) {
      const contentEl = document.createElement('div');
      contentEl.className = 'category-content';
      contentEl.hidden = true;
      const ownGrid = document.createElement('div');
      ownGrid.className = 'tile-grid';
      ownGrid.hidden = true;
      contentEl.appendChild(ownGrid);
      children.forEach(([childId, childNode]) => contentEl.appendChild(buildCategorySection(childId, childNode)));
      section.appendChild(contentEl);
    } else {
      const grid = document.createElement('div');
      grid.className = 'tile-grid';
      grid.hidden = true;
      section.appendChild(grid);
    }
    return section;
  }

  function renderCategoryTree() {
    const main = document.getElementById('categories');
    categoryChildren(null).forEach(([id, node]) => main.appendChild(buildCategorySection(id, node)));
  }

  renderCategoryTree();

  // Wires categoryToggles/depth/click-listeners for a set of category headers — factored out so
  // it can run again against freshly-rendered headers after a category is added later, not just
  // once at initial load.
  function wireCategoryHeaders(headers) {
    headers.forEach((header) => {
      const section = header.closest('.category');
      const id = section.dataset.categoryId;
      const contentEl = section.querySelector(':scope > .category-content') || section.querySelector(':scope > .tile-grid');
      // Only categories with subcategories (.category-content) have a separate own-grid that needs
      // its own visibility toggle; a flat category's tile-grid IS its content, already handled above.
      const ownGridEl = contentEl.classList.contains('category-content')
        ? contentEl.querySelector(':scope > .tile-grid')
        : null;
      const mainBtn = header.querySelector('.category-header-main');
      const collapseBtn = header.querySelector('.category-collapse-btn');

      // Title-only indent by true nesting depth. A pure-CSS self-incrementing custom property
      // (`.category-content { --depth: calc(var(--depth, 0) + 1); } `) looks like it should work but
      // doesn't — Chromium treats a custom property that references its own name, even meaning "the
      // inherited value", as a circular reference and resolves it to nothing at every level. Setting
      // --depth explicitly per element from the real DOM ancestor count sidesteps that entirely.
      let depth = 0;
      let ancestor = section.parentElement;
      while (ancestor) {
        if (ancestor.classList && ancestor.classList.contains('category-content')) depth++;
        ancestor = ancestor.parentElement;
      }
      // Set on the header wrapper (not directly on .category-name) so it inherits down to both
      // .category-name (nested inside .category-header-main) and .category-collapse-btn (its
      // sibling) — the collapse button outdents by the same depth, in the opposite direction.
      header.style.setProperty('--depth', String(depth));

      categoryToggles.set(id, { section, contentEl, ownGridEl, mainBtn, collapseBtn });

      // Long-press either enters category-select mode (first press) or, if already in it, range-
      // selects from the original anchor to this category (subsequent press) — mirrors tiles'
      // handleTileLongPress exactly, just against the visible-category-header order instead of a
      // grid. No drag-arming here — categories don't have a Move-Entry-style drag, only tiles do.
      attachLongPress(mainBtn, () => handleCategoryLongPress(id), () => dragInfo !== null);
      mainBtn.addEventListener('click', () => {
        if (selectMode && selectMode.kind === 'category') {
          toggleCategorySelected(id);
          return;
        }
        openCategoryPath(id);
      });
      collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        collapseFromCategory(id);
      });
    });
  }

  wireCategoryHeaders(document.querySelectorAll('.category:not(.category--home) > .category-header'));

  // Restore the persisted open path, but only if it's still a real, unbroken ancestor chain —
  // categories can be removed/reordered between sessions, so re-derive and compare rather than
  // trusting the stored array outright.
  try {
    const stored = JSON.parse(localStorage.getItem(CATEGORY_OPEN_PATH_KEY) || '[]');
    if (Array.isArray(stored) && stored.length > 0 && categoryToggles.has(stored[stored.length - 1])) {
      const recomputed = categoryAncestorChain(stored[stored.length - 1]);
      if (recomputed.length === stored.length && recomputed.every((v, i) => v === stored[i])) {
        openPath = recomputed;
      }
    }
  } catch (e) {
    openPath = [];
  }
  renderOpenPath();

  document.getElementById('collapse-all-btn').addEventListener('click', () => collapseAllCategories());

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
    // Same treatment for usage-stats fields added later — createdAt backfills to today (the best
    // available proxy; there's no real history for tiles that already existed), lastUsedAt starts
    // unset, useCount starts at 0. Naturally covers both old and newly-added tiles alike.
    tiles.forEach((t) => {
      if (!t.id) {
        t.id = newTileId();
        changed = true;
      }
      if (t.createdAt === undefined) {
        t.createdAt = Date.now();
        changed = true;
      }
      if (t.lastUsedAt === undefined) {
        t.lastUsedAt = null;
        changed = true;
      }
      if (t.useCount === undefined) {
        t.useCount = 0;
        changed = true;
      }
    });

    if (changed) saveCategoryTiles(categoryId, tiles);
    return tiles;
  }

  function saveCategoryTiles(categoryId, tiles) {
    localStorage.setItem(TILE_STORAGE_PREFIX + categoryId, JSON.stringify(tiles));
  }

  // Usage stats recorded silently — nothing surfaces this yet, it's collected for later features
  // (sort-by-usage, reports, flagging unused tiles for cleanup).
  function recordTileUsage(tileEl) {
    const categoryId = tileEl.closest('.category').dataset.categoryId;
    const tileId = tileEl.dataset.tileId;
    const tiles = loadCategoryTiles(categoryId);
    const entry = tiles.find((t) => t.id === tileId);
    if (!entry) return;
    entry.lastUsedAt = Date.now();
    entry.useCount = (entry.useCount || 0) + 1;
    saveCategoryTiles(categoryId, tiles);
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
    // Long-press either enters Organize Mode (first press) or, if this tile's grid is already in
    // it, extends the selection as a range from the original anchor (subsequent press) — see
    // handleTileLongPress. Suppressed only while this specific tile is actively being dragged
    // right now (dragging takes priority; a long-press mid-drag shouldn't also try to range-select).
    attachLongPress(a, () => handleTileLongPress(a), () => dragInfo && dragInfo.grid === a.parentElement);

    // While this tile's grid is in Organize Mode, a tap toggles this tile's selected state
    // instead of navigating (dragging is handled separately, by pointerdown below). The one
    // exception is the click that's the tail end of a gesture that just finished a drag — that's
    // not a genuine new tap, so it's swallowed rather than un-checking the tile it was just
    // dropped as. A real, separate tap right after still toggles selection normally, since the
    // user may want to rename/delete/etc. it via the bar rather than drag it again.
    a.addEventListener('click', (e) => {
      if (justFinishedDrag) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (selectMode && selectMode.kind === 'tile' && selectMode.grid === a.parentElement) {
        e.preventDefault();
        e.stopPropagation();
        toggleTileSelected(a);
        return;
      }
      // Ordinary tap — a real navigation (opens in a new tab via target="_blank", so the current
      // page never unloads and this write always completes normally).
      recordTileUsage(a);
    }, true);

    a.addEventListener('pointerdown', (e) => {
      if (selectMode && selectMode.kind === 'tile' && selectMode.grid === a.parentElement) {
        // Drag/drop only ever moves one tile at a time, so it's disabled entirely whenever 2+
        // tiles are selected — a plain tap still falls through untouched and toggles selection.
        if (selectMode.selectedIds.size > 1) return;
        // Same reasoning as attachLongPress's own pointerdown handler: without an early
        // preventDefault here, Chromium's native link-dragging (tiles are real <a href>
        // elements) can hijack this touch-and-drag the instant it crosses
        // armTileDragFromSelectMode's threshold, silently swallowing the rest of the gesture.
        e.preventDefault();
        armTileDragFromSelectMode(a, e);
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
    addTileTargetGrid.appendChild(tile);
    updateTileNameWrapClass(tile);
    const tiles = loadCategoryTiles(addTileTargetCategoryId);
    tiles.push({ id, name, url, createdAt: Date.now(), lastUsedAt: null, useCount: 0 });
    saveCategoryTiles(addTileTargetCategoryId, tiles);
    closeAddTile();
  });

  // categoryId -> its own .tile-grid element — used by Move Entry to resolve a cross-category
  // drop target's grid directly, without re-querying the DOM on every drag.
  const categoryGrids = new Map();

  // Wires categoryGrids + loads/renders each grid's tiles + wires its own "+" button — factored
  // out (like wireCategoryHeaders above) so it can run again against freshly-rendered grids after
  // a category is added, not just once at initial load.
  function wireTileGrids(grids) {
    grids.forEach((grid) => {
      const categoryId = grid.closest('.category').dataset.categoryId;
      categoryGrids.set(categoryId, grid);
      loadCategoryTiles(categoryId).forEach((t) => {
        const tile = buildTileElement(t.id, t.name, t.url);
        grid.appendChild(tile);
        updateTileNameWrapClass(tile);
      });
    });
  }

  wireTileGrids(document.querySelectorAll('.tile-grid'));

  // Adding a category can't just insert one new element — a category gaining its very first
  // subcategory needs its own DOM to switch shape (a flat .tile-grid becomes a .category-content
  // wrapper instead; buildCategorySection already renders either shape correctly, but only ever
  // did so once, at initial load). Rather than hand-writing that flat-to-nested transition as
  // surgical DOM patching, this just tears down and re-renders everything under #categories except
  // Home (untouched — it's not part of categoryTree at all) and re-wires it the same way initial
  // load does. Trivial overhead for a personal homepage's category count; correct with no special
  // cases. Scoped to :not(.category--home) throughout so Home's own header/grid (never destroyed)
  // isn't re-wired a second time, which would duplicate its already-rendered tiles.
  function rebuildCategoriesAndTiles() {
    exitSelectMode();
    document.querySelectorAll('#categories > .category:not(.category--home)').forEach((el) => el.remove());
    renderCategoryTree();
    wireCategoryHeaders(document.querySelectorAll('.category:not(.category--home) > .category-header'));
    wireTileGrids(document.querySelectorAll('.category:not(.category--home) .tile-grid'));
    renderOpenPath();
  }

  function newCategoryId() {
    return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'cat-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  }

  // Wherever "+ Tile" / "+ Category" should add to: the deepest currently-open category, or Home
  // if nothing is open. Shared by both the tile and category creation flows below.
  function currentLocationId() {
    return openPath.length > 0 ? openPath[openPath.length - 1] : 'home';
  }

  // --- Create UI: a "+" on Home's (now-sticky) header, opening a small "+ Tile" / "+ Category"
  // menu targeting currentLocationId(). "+ Tile" reuses the existing add-tile overlay as-is;
  // "+ Category" is new.
  const createBtn = document.getElementById('create-btn');
  const createMenuOverlay = document.getElementById('create-menu-overlay');
  const createMenuClose = document.getElementById('create-menu-close');
  const createMenuTileBtn = document.getElementById('create-menu-tile');
  const createMenuCategoryBtn = document.getElementById('create-menu-category');

  function openCreateMenu() {
    createMenuOverlay.hidden = false;
  }
  function closeCreateMenu() {
    createMenuOverlay.hidden = true;
  }
  createBtn.addEventListener('click', openCreateMenu);
  createMenuClose.addEventListener('click', closeCreateMenu);
  createMenuOverlay.addEventListener('click', (e) => {
    if (e.target === createMenuOverlay) closeCreateMenu();
  });

  createMenuTileBtn.addEventListener('click', () => {
    closeCreateMenu();
    const destId = currentLocationId();
    const grid = categoryGrids.get(destId);
    if (grid) openAddTile(grid, destId);
  });

  // Popups now anchor near the top of the page (styles.css's .help-overlay) instead of vertical
  // centering, so an on-screen keyboard never covers them. For a popup acting on one specific
  // existing thing (a tile, a category header), this scrolls the underlying page — not the popup
  // itself, which is position: fixed and unaffected by page scroll — so that thing ends up
  // visible immediately below the popup, the same way the popup's own position is now fixed
  // relative to the search bar. No-ops when there's no single target to show (targetEl omitted,
  // e.g. Add Tile/Add Category/Settings/Help, or a multi-select delete confirm).
  function scrollTargetBelowPopup(panelEl, targetEl) {
    if (!targetEl) return;
    requestAnimationFrame(() => {
      const panelBottom = panelEl.getBoundingClientRect().bottom;
      const targetTop = targetEl.getBoundingClientRect().top;
      const gap = 12;
      window.scrollBy({ top: targetTop - panelBottom - gap, behavior: 'auto' });
    });
  }

  const addCategoryOverlay = document.getElementById('add-category-overlay');
  const addCategoryClose = document.getElementById('add-category-close');
  const addCategoryTitleEl = document.getElementById('add-category-title');
  const addCategoryNameInput = document.getElementById('add-category-name');
  const addCategoryError = document.getElementById('add-category-error');
  const addCategorySubmit = document.getElementById('add-category-submit');
  const editCategorySortSection = document.getElementById('edit-category-sort-section');
  const sortCategoryAlphaBtn = document.getElementById('sort-category-alpha');
  const sortCategoryMostUsedBtn = document.getElementById('sort-category-most-used');
  const sortCategoryLastUsedBtn = document.getElementById('sort-category-last-used');
  // null while creating a new category; set to an existing category's id while editing one
  // (opened from the select-action-bar's 🔧 Edit button) — same dialog either way, per the
  // decision that Edit reuses the create-category overlay rather than being a separate one.
  let addCategoryTargetId = null;

  // Sort is a *preview*, not an instant apply: sortPreviewOriginalTiles snapshots the category's
  // tile order at the moment the Edit dialog opens (this, not whatever order a prior preview left
  // behind, is what Cancel restores to and what each new sort mode re-previews from — per the
  // user's decisions). sortPreviewDirty tracks whether a preview has actually been applied, so
  // Save only rewrites storage when there's something to commit, and closing without Save reverts
  // the live DOM back to the original order rather than silently leaving a preview on screen with
  // nothing saved.
  let sortPreviewOriginalTiles = null;
  let sortPreviewDirty = false;

  function openAddCategory() {
    addCategoryTargetId = null;
    sortPreviewOriginalTiles = null;
    sortPreviewDirty = false;
    addCategoryTitleEl.textContent = 'Add Category';
    addCategorySubmit.textContent = 'Add Category';
    addCategoryNameInput.value = '';
    addCategoryError.hidden = true;
    editCategorySortSection.hidden = true; // a brand-new category has no tiles yet to sort
    addCategoryOverlay.hidden = false;
    addCategoryNameInput.focus();
  }
  // Called from the select-action-bar's Edit button (further down) — targets whichever single
  // category is currently selected. Color editing isn't wired up here: the dialog is name-only
  // until the category color picker itself exists (Build Planner item 4).
  function openEditCategory(id) {
    const node = categoryTree[id];
    if (!node) return;
    addCategoryTargetId = id;
    sortPreviewOriginalTiles = loadCategoryTiles(id).slice();
    sortPreviewDirty = false;
    addCategoryTitleEl.textContent = 'Edit Category';
    addCategorySubmit.textContent = 'Save';
    addCategoryNameInput.value = node.name;
    addCategoryError.hidden = true;
    editCategorySortSection.hidden = false;
    addCategoryOverlay.hidden = false;
    addCategoryNameInput.focus();
    const entry = categoryToggles.get(id);
    scrollTargetBelowPopup(addCategoryOverlay.querySelector('.help-panel'), entry && entry.mainBtn);
  }

  // Reorders categoryId's grid DOM (not storage) to the given order — used by both the sort
  // preview and its eventual commit, which just persists whatever order the DOM ends up in.
  function reorderGridDom(categoryId, tiles) {
    const grid = categoryGrids.get(categoryId);
    if (!grid) return;
    tiles.forEach((t) => {
      const el = grid.querySelector('[data-tile-id="' + CSS.escape(t.id) + '"]');
      if (el) grid.appendChild(el);
    });
  }

  // Previews categoryId's own direct tiles in the given order — never cascades into nested
  // subcategories, each level sorts independently if the user wants more than one sorted. Always
  // re-previews from the original pre-sort snapshot (not stacked on top of a prior preview), so
  // switching between sort modes freely is safe. Nothing is saved until Save commits it.
  function applySortPreview(categoryId, comparator) {
    if (!sortPreviewOriginalTiles) return;
    reorderGridDom(categoryId, sortPreviewOriginalTiles.slice().sort(comparator));
    sortPreviewDirty = true;
  }
  sortCategoryAlphaBtn.addEventListener('click', () => {
    if (!addCategoryTargetId) return;
    applySortPreview(addCategoryTargetId, (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  });
  sortCategoryMostUsedBtn.addEventListener('click', () => {
    if (!addCategoryTargetId) return;
    applySortPreview(addCategoryTargetId, (a, b) => (b.useCount || 0) - (a.useCount || 0));
  });
  sortCategoryLastUsedBtn.addEventListener('click', () => {
    if (!addCategoryTargetId) return;
    // Never-used tiles (lastUsedAt still null) sort to the end, behind anything with a real timestamp.
    applySortPreview(addCategoryTargetId, (a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0));
  });

  // Persists whatever order the preview left the grid's DOM in — same read-DOM-order-back-to-
  // storage pattern finishTileDrag already uses for Move Entry. A no-op when no preview was ever
  // applied (sortPreviewDirty stays false, e.g. the user only renamed and never touched Sort).
  function commitSortPreview(categoryId) {
    if (sortPreviewDirty) {
      const grid = categoryGrids.get(categoryId);
      if (grid) {
        const orderedIds = Array.from(grid.children).filter((c) => c.classList.contains('tile')).map((c) => c.dataset.tileId);
        const tiles = loadCategoryTiles(categoryId);
        const byId = new Map(tiles.map((t) => [t.id, t]));
        saveCategoryTiles(categoryId, orderedIds.map((id) => byId.get(id)).filter(Boolean));
      }
    }
    sortPreviewOriginalTiles = null;
    sortPreviewDirty = false;
  }

  // Reverts the live grid DOM back to the order captured when the Edit dialog opened — called
  // whenever the dialog closes WITHOUT going through commitSortPreview first (× close,
  // outside-tap), so an un-saved preview never lingers on screen looking applied. A no-op once
  // commitSortPreview has already cleared sortPreviewOriginalTiles (the normal Save path).
  function revertSortPreview() {
    if (sortPreviewOriginalTiles && sortPreviewDirty && addCategoryTargetId) {
      reorderGridDom(addCategoryTargetId, sortPreviewOriginalTiles);
    }
    sortPreviewOriginalTiles = null;
    sortPreviewDirty = false;
  }

  function closeAddCategory() {
    revertSortPreview();
    addCategoryOverlay.hidden = true;
    addCategoryTargetId = null;
  }
  function showAddCategoryError(text) {
    addCategoryError.textContent = text;
    addCategoryError.hidden = false;
  }

  createMenuCategoryBtn.addEventListener('click', () => {
    closeCreateMenu();
    openAddCategory();
  });
  addCategoryClose.addEventListener('click', closeAddCategory);
  addCategoryOverlay.addEventListener('click', (e) => {
    if (e.target === addCategoryOverlay) closeAddCategory();
  });

  addCategorySubmit.addEventListener('click', () => {
    const name = addCategoryNameInput.value.trim();
    if (!name) {
      showAddCategoryError('Name required.');
      return;
    }
    if (addCategoryTargetId) {
      const targetId = addCategoryTargetId;
      const node = categoryTree[targetId];
      const isDuplicate = Object.values(categoryTree).some(
        (n) => n !== node && n.parentId === node.parentId && n.name.trim().toLowerCase() === name.toLowerCase()
      );
      if (isDuplicate) {
        showAddCategoryError('A category named "' + name + '" already exists here.');
        return;
      }
      node.name = name;
      saveCategoryTree(categoryTree);
      commitSortPreview(targetId);
      rebuildCategoriesAndTiles();
      closeAddCategory();
      return;
    }
    const currentId = currentLocationId();
    const parentId = currentId === 'home' ? null : currentId;
    const isDuplicate = Object.values(categoryTree).some(
      (n) => n.parentId === parentId && n.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) {
      showAddCategoryError('A category named "' + name + '" already exists here.');
      return;
    }
    const siblingOrders = Object.values(categoryTree)
      .filter((n) => n.parentId === parentId)
      .map((n) => n.order);
    const order = siblingOrders.length > 0 ? Math.max(...siblingOrders) + 1 : 0;
    const id = newCategoryId();
    categoryTree[id] = { name, parentId, order, stripeColor: null, createdAt: Date.now() };
    saveCategoryTree(categoryTree);
    rebuildCategoriesAndTiles();
    closeAddCategory();
  });

  // --- Phase 2 Part 1: tile Rename/Delete — the tile-menu popup that used to trigger these is
  // retired (long-press now goes straight into select mode and its bottom bar, see below); the
  // underlying rename/delete dialogs and logic stay exactly as built, just triggered from the new
  // bottom-bar buttons instead. ---
  const tileConfirmOverlay = document.getElementById('tile-confirm-overlay');
  const tileConfirmClose = document.getElementById('tile-confirm-close');
  const tileConfirmText = document.getElementById('tile-confirm-text');
  const tileConfirmCounts = document.getElementById('tile-confirm-counts');
  const tileConfirmTypeInput = document.getElementById('tile-confirm-type-input');
  const tileConfirmYes = document.getElementById('tile-confirm-yes');
  const tileConfirmNo = document.getElementById('tile-confirm-no');
  let tileConfirmOnYes = null;
  let tileConfirmRequireTypedYes = false;

  // opts.counts: impact-summary text shown near the bottom of the dialog (e.g. Remove Category's
  // tile/subcategory/combined total) — informational, shown independent of the friction tier
  // below it. opts.requireTypedYes: gates Confirm behind typing "yes" (case-insensitive) instead
  // of it being immediately clickable — used for Remove Category once there's at least one tile
  // anywhere in the subtree; omitted (falsy) elsewhere, which is every other use of this dialog
  // today (plain tile delete, the delete easter egg, an empty-subtree category delete).
  function openTileConfirm(text, onYes, opts) {
    opts = opts || {};
    tileConfirmText.textContent = text;
    tileConfirmOnYes = onYes;
    if (opts.counts) {
      tileConfirmCounts.textContent = opts.counts;
      tileConfirmCounts.hidden = false;
    } else {
      tileConfirmCounts.hidden = true;
    }
    tileConfirmRequireTypedYes = !!opts.requireTypedYes;
    tileConfirmTypeInput.value = '';
    tileConfirmTypeInput.hidden = !tileConfirmRequireTypedYes;
    tileConfirmYes.disabled = tileConfirmRequireTypedYes;
    tileConfirmOverlay.hidden = false;
    if (tileConfirmRequireTypedYes) tileConfirmTypeInput.focus();
    scrollTargetBelowPopup(tileConfirmOverlay.querySelector('.help-panel'), opts.targetEl);
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
  tileConfirmTypeInput.addEventListener('input', () => {
    if (!tileConfirmRequireTypedYes) return;
    tileConfirmYes.disabled = tileConfirmTypeInput.value.trim().toLowerCase() !== 'yes';
  });
  tileConfirmYes.addEventListener('click', () => {
    const cb = tileConfirmOnYes;
    closeTileConfirm();
    if (cb) cb();
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

  // Called from the select-action-bar's Rename button (script.js further down) instead of the
  // now-retired tile-menu popup — same dialog, just a new trigger.
  function openTileRenameFor(tileEl) {
    tileRenameTargetEl = tileEl;
    tileRenameInput.value = tileEl.querySelector('span').textContent;
    tileRenameOverlay.hidden = false;
    tileRenameInput.focus();
    scrollTargetBelowPopup(tileRenameOverlay.querySelector('.help-panel'), tileEl);
  }

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
      // Suppresses the browser's own native drag-initiation (relevant for tiles, real <a> links)
      // and text-selection/focus-on-mousedown — without this, a would-be long-press that instead
      // turns into quick movement (or the separate touch-and-drag that arms Move Entry, see
      // armTileDragFromSelectMode, which has this same preventDefault on its own pointerdown too)
      // could get hijacked by native link-dragging the instant the pointer crosses a threshold,
      // silently swallowing every further pointer event for that gesture (confirmed directly:
      // only the one threshold-crossing pointermove ever arrived, no pointerup at all). Harmless
      // here regardless of element type — preventDefault on pointerdown doesn't cancel the
      // eventual click's own default action (e.g. navigation), only these specific native
      // gestures.
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      cancelPress();
      pressTimer = setTimeout(() => {
        pressTimer = null;
        suppressNextClick = true;
        // The originating pointerdown event is passed through in case a caller needs it (e.g.
        // its coordinates); most callers, including tiles' own handleTileLongPress, just ignore
        // the argument.
        callback(e);
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
        // stopImmediatePropagation, not just stopPropagation — the tile's own click listener is
        // registered on this same element in this same (capture) phase, so a plain
        // stopPropagation doesn't stop it from also firing right after this one. That was
        // harmless with the old tile-menu-popup callback (its own click handler's fallback path
        // was a no-op the instant after a long-press), but it's a real bug now that a fresh
        // long-press enters select mode directly — the tile's click handler seeing select mode
        // already active would immediately toggle the just-made selection right back off.
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);
  }

  // --- Phase 2 Editing System, Part 2: Organize Mode's drag-and-drop capability ---
  // Dragging is a capability layered on top of tile-kind selectMode (see armTileDragFromSelectMode
  // below), not a separate state — the grid's own .select-mode class (added at enterSelectMode)
  // already covers the resting drop-shadow/touch-action styling for the whole session. dragInfo
  // is state for the tile actively being dragged, or null when idle (select mode can be active
  // with no active drag — e.g. right after entry, before the first pointerdown that arms one).
  //   dragInfo.grid — the source grid, fixed for the whole drag. Drag/drop is same-category
  //     reorder only (cross-category moves go through Select/Cut+Paste instead), so there's only
  //     ever one grid in play — no live-reparenting into a different grid mid-drag.
  // dragInfo itself is declared earlier, alongside selectMode, so renderOpenPath's drag-pinning
  // logic can read it — see the comment there.
  let justFinishedDrag = false;

  function setGrabbedTile(tileEl) {
    if (!selectMode || selectMode.kind !== 'tile') return;
    selectMode.grid.querySelectorAll('.tile.move-grabbed').forEach((t) => {
      if (t !== tileEl) t.classList.remove('move-grabbed');
    });
    tileEl.classList.add('move-grabbed');
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
      originalNextSibling: tileEl.nextSibling,
      lastClientX: e.clientX,
      lastClientY: e.clientY,
      autoScrollDir: 0,
      autoScrollSpeed: 0,
      autoScrollRAF: null,
    };
    setGrabbedTile(tileEl);
    tileEl.classList.add('move-dragging');
    tileEl.style.zIndex = '50';
    tileEl.style.pointerEvents = 'none';
    resetSelectModeTimeout();

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
      (c) => c.classList.contains('tile') && c !== excludeEl
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

  // Reorders dragInfo.grid around the dragged tile based on cursor position. Nearest-tile-center
  // (rather than exact hit-test under the cursor) so a fast or coalesced drag still resolves to
  // the correct slot even if intermediate pointermove events over specific sibling tiles never
  // actually get dispatched.
  function reflowWithinCurrentGrid(x, y) {
    const grid = dragInfo.grid;
    const nearest = findNearestTile(grid, dragInfo.tileEl, x, y);
    if (!nearest) return;
    dragInfo.tileEl.style.transform = 'none';
    const ownRect = dragInfo.tileEl.getBoundingClientRect();
    const ownCx = ownRect.left + ownRect.width / 2;
    const ownCy = ownRect.top + ownRect.height / 2;
    const distToOwnSq = (ownCx - x) * (ownCx - x) + (ownCy - y) * (ownCy - y);
    const nr = nearest.getBoundingClientRect();
    const ncx = nr.left + nr.width / 2;
    const ncy = nr.top + nr.height / 2;
    const distToNearestSq = (ncx - x) * (ncx - x) + (ncy - y) * (ncy - y);
    // Only reorder when the pointer is genuinely closer to the candidate's slot than to the
    // dragged tile's own current slot. With very few siblings (e.g. exactly one other tile in
    // the category), "nearest" is otherwise trivially always that same tile regardless of real
    // proximity, which would flip the order back and forth on every single move event.
    if (distToNearestSq < distToOwnSq) {
      const siblings = Array.from(grid.children).filter(
        (c) => c.classList.contains('tile')
      );
      const draggedIndex = siblings.indexOf(dragInfo.tileEl);
      const targetIndex = siblings.indexOf(nearest);
      if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
        if (draggedIndex < targetIndex) nearest.after(dragInfo.tileEl);
        else nearest.before(dragInfo.tileEl);
      }
    }
  }

  function followPointer(x, y) {
    dragInfo.tileEl.style.transform = 'none';
    const rect = dragInfo.tileEl.getBoundingClientRect();
    const dx = x - dragInfo.grabDX - rect.left;
    const dy = y - dragInfo.grabDY - rect.top;
    dragInfo.tileEl.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) rotate(-3deg) scale(1.05)';
  }

  function processDragPosition(clientX, clientY) {
    if (!dragInfo) return;
    // No more header-hover/cross-category detection — drag is same-category reorder only, so
    // this always just reflows within the drag's own source grid regardless of what's under the
    // pointer (cross-category moves go through Select/Cut+Paste instead).
    reflowWithinCurrentGrid(clientX, clientY);
    followPointer(clientX, clientY);
  }

  // 120px (not the original 70px) gives real headroom past a typical phone's status bar/notch —
  // a real thumb dragging a tile one-handed generally can't push into a zone that small, which
  // made the top edge effectively unreachable in practice even though the scroll mechanism itself
  // was never broken. Speed raised to match, since a larger zone means covering more distance.
  const AUTO_SCROLL_EDGE_PX = 120;
  const AUTO_SCROLL_MAX_PX_PER_FRAME = 20;

  function updateAutoScroll(clientY) {
    if (!dragInfo) return;
    const h = window.innerHeight;
    let dir = 0;
    let speed = 0;
    if (clientY < AUTO_SCROLL_EDGE_PX) {
      dir = -1;
      speed = (AUTO_SCROLL_EDGE_PX - clientY) / AUTO_SCROLL_EDGE_PX;
    } else if (clientY > h - AUTO_SCROLL_EDGE_PX) {
      dir = 1;
      speed = (clientY - (h - AUTO_SCROLL_EDGE_PX)) / AUTO_SCROLL_EDGE_PX;
    }
    dragInfo.autoScrollDir = dir;
    dragInfo.autoScrollSpeed = Math.min(1, speed);
    if (dir !== 0 && !dragInfo.autoScrollRAF) {
      dragInfo.autoScrollRAF = requestAnimationFrame(autoScrollTick);
    }
  }

  function autoScrollTick() {
    if (!dragInfo || dragInfo.autoScrollDir === 0) {
      if (dragInfo) dragInfo.autoScrollRAF = null;
      return;
    }
    window.scrollBy(0, dragInfo.autoScrollDir * AUTO_SCROLL_MAX_PX_PER_FRAME * dragInfo.autoScrollSpeed);
    resetSelectModeTimeout();
    // The page moved under a stationary pointer — re-run reflow/hover-detection against the
    // last known pointer position, since no new pointermove event fires from scrolling alone.
    processDragPosition(dragInfo.lastClientX, dragInfo.lastClientY);
    dragInfo.autoScrollRAF = requestAnimationFrame(autoScrollTick);
  }

  function stopAutoScroll() {
    if (dragInfo && dragInfo.autoScrollRAF) {
      cancelAnimationFrame(dragInfo.autoScrollRAF);
      dragInfo.autoScrollRAF = null;
    }
    if (dragInfo) dragInfo.autoScrollDir = 0;
  }

  function handleTileDragMove(e) {
    if (!dragInfo) return;
    resetSelectModeTimeout();
    dragInfo.lastClientX = e.clientX;
    dragInfo.lastClientY = e.clientY;

    if (e.clientX < 0 || e.clientY < 0 || e.clientX > window.innerWidth || e.clientY > window.innerHeight) {
      cancelTileDrag();
      return;
    }

    updateAutoScroll(e.clientY);
    processDragPosition(e.clientX, e.clientY);
  }

  function markDragJustFinished() {
    justFinishedDrag = true;
    setTimeout(() => { justFinishedDrag = false; }, 0);
  }

  function finishTileDrag() {
    if (!dragInfo) return;
    const info = dragInfo;
    info.cleanup();
    stopAutoScroll();
    info.tileEl.style.transform = '';
    info.tileEl.style.zIndex = '';
    info.tileEl.style.pointerEvents = '';
    info.tileEl.classList.remove('move-dragging', 'move-grabbed');

    // Same-category reorder only — cross-category moves go through Select/Cut+Paste instead, so
    // this is always just persisting the live DOM order back to storage.
    const sourceCategoryId = info.grid.closest('.category').dataset.categoryId;
    const orderedIds = Array.from(info.grid.children)
      .filter((c) => c.classList.contains('tile'))
      .map((c) => c.dataset.tileId);
    const tiles = loadCategoryTiles(sourceCategoryId);
    const byId = new Map(tiles.map((t) => [t.id, t]));
    const reordered = orderedIds.map((id) => byId.get(id)).filter(Boolean);
    saveCategoryTiles(sourceCategoryId, reordered);

    // Dropping un-checks the dragged tile — drag/drop only ever moves one tile at a time, so
    // dropping can only ever apply to that single tile. A cancelled drag (cancelTileDrag) isn't a
    // real drop, so it leaves selection untouched.
    if (selectMode && selectMode.kind === 'tile' && selectMode.selectedIds.has(info.tileEl.dataset.tileId)) {
      toggleTileSelected(info.tileEl);
    }

    dragInfo = null;
    renderOpenPath();
    markDragJustFinished();
    resetSelectModeTimeout();
  }

  function cancelTileDrag() {
    if (!dragInfo) return;
    const info = dragInfo;
    info.cleanup();
    stopAutoScroll();
    info.tileEl.style.transform = '';
    info.tileEl.style.zIndex = '';
    info.tileEl.style.pointerEvents = '';
    info.tileEl.classList.remove('move-dragging', 'move-grabbed');
    info.grid.insertBefore(info.tileEl, info.originalNextSibling);
    dragInfo = null;
    renderOpenPath();
    markDragJustFinished();
  }

  // --- Multi-select (tiles and categories) — long-press goes straight into select mode now (the
  // tile-menu popup is retired); the bottom bar it shows covers Select All, Cut/Paste (move,
  // between categories or, for tiles, now also within one via re-navigating to it), Rename/Edit,
  // and Delete. Single-tile Move Entry (drag-to-reorder) is unaffected — see
  // armDragFromLongPress: dragging the same touch that triggered the long-press, without lifting
  // first, transitions straight into it instead of staying in select mode. ---

  function toggleTileSelected(tileEl) {
    if (!selectMode || selectMode.kind !== 'tile') return;
    const id = tileEl.dataset.tileId;
    if (selectMode.selectedIds.has(id)) {
      selectMode.selectedIds.delete(id);
      tileEl.classList.remove('tile-selected');
    } else {
      selectMode.selectedIds.add(id);
      tileEl.classList.add('tile-selected');
    }
    updateSelectActionBar();
  }

  // Range-select: a long-press on a *second* tile while already in tile-select mode selects
  // everything positionally between the original anchor (the first tile long-pressed, fixed for
  // the whole select-mode session — not the most recently pressed one) and this new tile.
  function rangeSelectTiles(newTileEl) {
    if (!selectMode || selectMode.kind !== 'tile') return;
    const grid = selectMode.grid;
    const tiles = Array.from(grid.children).filter((c) => c.classList.contains('tile'));
    const anchorEl = grid.querySelector('[data-tile-id="' + CSS.escape(selectMode.rangeAnchorId) + '"]');
    const anchorIdx = anchorEl ? tiles.indexOf(anchorEl) : -1;
    const newIdx = tiles.indexOf(newTileEl);
    if (anchorIdx === -1 || newIdx === -1) {
      toggleTileSelected(newTileEl);
      return;
    }
    const lo = Math.min(anchorIdx, newIdx);
    const hi = Math.max(anchorIdx, newIdx);
    for (let i = lo; i <= hi; i++) {
      const t = tiles[i];
      if (!selectMode.selectedIds.has(t.dataset.tileId)) {
        selectMode.selectedIds.add(t.dataset.tileId);
        t.classList.add('tile-selected');
      }
    }
    updateSelectActionBar();
  }

  // Two separate touches, per the user: this long-press only ever selects (or range-selects) —
  // it never arms a drag itself. A drag starts from its own fresh touch instead, see
  // armTileDragFromSelectMode below (wired from buildTileElement's pointerdown handler), and
  // doesn't require a long-press at all once select mode is already open.
  function handleTileLongPress(tileEl) {
    if (selectMode && selectMode.kind === 'tile' && selectMode.grid === tileEl.parentElement) {
      rangeSelectTiles(tileEl);
    } else {
      enterSelectMode(tileEl);
    }
  }

  // While tile Organize Mode is open, a plain touch-and-drag on ANY tile in that same grid — a
  // fresh touch, not continuous with whatever long-press opened it — drags/reorders it, without
  // ever hiding the bar or exiting select mode: the two coexist for as long as select mode itself
  // stays open. Gated on movement past a threshold first so an ordinary tap still falls through to
  // the tile's own click handler and toggles its selection normally. Only ever wired (see
  // buildTileElement's pointerdown handler) while at most one tile is selected — drag/drop only
  // ever moves one tile at a time, so it's disabled entirely once 2+ are selected.
  function armTileDragFromSelectMode(tileEl, e) {
    const pointerId = e.pointerId;
    const startX = e.clientX;
    const startY = e.clientY;
    const DRAG_ARM_PX = 20; // matches attachLongPress's own MOVE_CANCEL_PX, for consistency
    function onMove(ev) {
      if (ev.pointerId !== pointerId) return;
      if (Math.abs(ev.clientX - startX) > DRAG_ARM_PX || Math.abs(ev.clientY - startY) > DRAG_ARM_PX) {
        cleanup();
        startTileDrag(tileEl, ev);
      }
    }
    function onUp(ev) {
      if (ev.pointerId !== pointerId) return;
      cleanup();
    }
    function cleanup() {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
  }

  // --- Category selection: selecting a category selects its whole subtree (subcategories + their
  // tiles) by default; deselecting works the same way in reverse. selectMode.selectedIds holds
  // the explicitly-pressed roots (may include redundant entries already covered by an ancestor —
  // harmless, see prunedSelectedCategoryRoots); the visible checkmarks reflect the full expanded
  // set via refreshCategorySelectionVisuals. ---

  function categorySubtreeIds(rootId) {
    const out = [rootId];
    categoryChildren(rootId).forEach(([childId]) => out.push(...categorySubtreeIds(childId)));
    return out;
  }

  // "Topmost" selected categories only — prunes any selected id that has an ancestor also
  // selected, since that id's selection is already implied by the ancestor's subtree. This is
  // what Edit/Cut/Delete actually operate on, and what Edit's exactly-one-selected check counts.
  function prunedSelectedCategoryRoots() {
    if (!selectMode || selectMode.kind !== 'category') return [];
    return Array.from(selectMode.selectedIds).filter((id) => {
      const ancestors = categoryAncestorChain(id).slice(0, -1);
      return !ancestors.some((a) => selectMode.selectedIds.has(a));
    });
  }

  function refreshCategorySelectionVisuals() {
    const effective = new Set();
    if (selectMode && selectMode.kind === 'category') {
      selectMode.selectedIds.forEach((rootId) => categorySubtreeIds(rootId).forEach((id) => effective.add(id)));
    }
    categoryToggles.forEach((entry, id) => {
      const selected = effective.has(id);
      const check = entry.mainBtn.querySelector('.category-select-check');
      if (check) check.hidden = !selected;
    });
  }

  function toggleCategorySelected(id) {
    if (!selectMode || selectMode.kind !== 'category') return;
    if (selectMode.selectedIds.has(id)) selectMode.selectedIds.delete(id);
    else selectMode.selectedIds.add(id);
    refreshCategorySelectionVisuals();
    updateSelectActionBar();
  }

  // Currently-visible category headers, top-to-bottom in real render order — a collapsed
  // subcategory's header is hidden along with the rest of its parent's content, so this
  // naturally excludes anything not actually reachable/tappable right now.
  function visibleCategoryHeaderIds() {
    return Array.from(categoryToggles.entries())
      .filter(([, entry]) => entry.mainBtn.offsetParent !== null)
      .map(([id]) => id);
  }

  function rangeSelectCategories(targetId) {
    if (!selectMode || selectMode.kind !== 'category') return;
    const order = visibleCategoryHeaderIds();
    const anchorIdx = order.indexOf(selectMode.rangeAnchorId);
    const targetIdx = order.indexOf(targetId);
    if (anchorIdx === -1 || targetIdx === -1) {
      toggleCategorySelected(targetId);
      return;
    }
    const lo = Math.min(anchorIdx, targetIdx);
    const hi = Math.max(anchorIdx, targetIdx);
    for (let i = lo; i <= hi; i++) selectMode.selectedIds.add(order[i]);
    refreshCategorySelectionVisuals();
    updateSelectActionBar();
  }

  function handleCategoryLongPress(id) {
    if (selectMode && selectMode.kind === 'category') {
      rangeSelectCategories(id);
    } else {
      enterCategorySelectMode(id);
    }
  }

  function enterSelectMode(tileEl) {
    if (selectMode) exitSelectMode();
    const grid = tileEl.parentElement;
    selectMode = {
      kind: 'tile',
      grid,
      categoryId: grid.closest('.category').dataset.categoryId,
      selectedIds: new Set(),
      rangeAnchorId: tileEl.dataset.tileId,
    };
    pickingDestination = false;
    grid.classList.add('select-mode');
    toggleTileSelected(tileEl);
  }

  function enterCategorySelectMode(id) {
    if (selectMode) exitSelectMode();
    selectMode = { kind: 'category', selectedIds: new Set(), rangeAnchorId: id };
    pickingDestination = false;
    toggleCategorySelected(id);
  }

  // Organize Mode's own inactivity auto-close — only while idle with nothing selected. The
  // instant something is selected, it's actively being used and waits indefinitely for the user
  // to act (Cut/Paste, Rename/Edit, Delete, or a drag) rather than closing out from under them; a
  // fresh long-press restarts the same rule from wherever selection ends up. No-ops if select
  // mode isn't actually open.
  function resetSelectModeTimeout() {
    if (!selectMode) return;
    clearTimeout(selectModeTimeoutId);
    selectModeTimeoutId = selectedCount() === 0 ? setTimeout(exitSelectMode, 5000) : null;
  }

  function exitSelectMode() {
    const wasSelectMode = selectMode;
    selectMode = null;
    pickingDestination = false;
    clearTimeout(selectModeTimeoutId);
    selectModeTimeoutId = null;
    if (dragInfo) cancelTileDrag();
    if (wasSelectMode) {
      if (wasSelectMode.kind === 'tile') {
        wasSelectMode.grid.classList.remove('select-mode');
        // Query the whole document, not just wasSelectMode.grid — confirmMoveSelected already
        // reparents moved tiles into the destination grid before calling this, so scoping the
        // cleanup to the (now smaller) source grid missed them and left the moved tiles stuck
        // showing the selected outline/checkmark in their new category.
        document.querySelectorAll('.tile-selected').forEach((t) => t.classList.remove('tile-selected'));
      } else if (wasSelectMode.kind === 'category') {
        categoryToggles.forEach((entry) => {
          const check = entry.mainBtn.querySelector('.category-select-check');
          if (check) check.hidden = true;
        });
      }
    }
    updateSelectActionBar();
  }

  function moveCategorySubtree(rootId, newParentId) {
    const parentIdForOrder = newParentId === 'home' ? null : newParentId;
    // Refuse a move into itself or into one of its own descendants — either would orphan the
    // subtree into an unreachable cycle.
    if (parentIdForOrder === rootId || categorySubtreeIds(rootId).includes(parentIdForOrder)) return;
    const node = categoryTree[rootId];
    if (!node) return;
    const siblingOrders = Object.values(categoryTree)
      .filter((n) => n.parentId === parentIdForOrder)
      .map((n) => n.order);
    node.parentId = parentIdForOrder;
    node.order = siblingOrders.length > 0 ? Math.max(...siblingOrders) + 1 : 0;
  }

  function confirmMoveSelected() {
    if (!selectMode) return;
    const destId = currentLocationId();
    if (selectMode.kind === 'tile') {
      const sourceId = selectMode.categoryId;
      if (destId !== sourceId) {
        const sourceTiles = loadCategoryTiles(sourceId);
        const moving = sourceTiles.filter((t) => selectMode.selectedIds.has(t.id));
        const remaining = sourceTiles.filter((t) => !selectMode.selectedIds.has(t.id));
        saveCategoryTiles(sourceId, remaining);
        const destTiles = loadCategoryTiles(destId).concat(moving);
        saveCategoryTiles(destId, destTiles);
        const destGrid = categoryGrids.get(destId);
        moving.forEach((t) => {
          const el = selectMode.grid.querySelector('[data-tile-id="' + t.id + '"]');
          if (el && destGrid) destGrid.appendChild(el);
        });
      }
    } else {
      prunedSelectedCategoryRoots().forEach((rootId) => moveCategorySubtree(rootId, destId));
      saveCategoryTree(categoryTree);
      // Reset the open path rather than leave it referencing whatever was just moved — a moved
      // category may no longer be nested where openPath still says it is (e.g. moving the very
      // category the user is currently inside of, which selecting-then-cutting makes possible for
      // the first time). Back to Home is the one state guaranteed to still be valid afterward.
      openPath = [];
      rebuildCategoriesAndTiles();
    }
    exitSelectMode();
  }

  function deleteSelected() {
    if (!selectMode) return;
    if (selectMode.kind === 'tile') {
      const grid = selectMode.grid;
      const categoryId = selectMode.categoryId;
      const remaining = loadCategoryTiles(categoryId).filter((t) => !selectMode.selectedIds.has(t.id));
      saveCategoryTiles(categoryId, remaining);
      selectMode.selectedIds.forEach((tileId) => {
        const el = grid.querySelector('[data-tile-id="' + CSS.escape(tileId) + '"]');
        if (el) el.remove();
      });
    } else {
      prunedSelectedCategoryRoots().forEach((rootId) => {
        categorySubtreeIds(rootId).forEach((id) => {
          delete categoryTree[id];
          localStorage.removeItem(TILE_STORAGE_PREFIX + id);
        });
      });
      saveCategoryTree(categoryTree);
      // Same reasoning as confirmMoveSelected's category branch — the deleted category (or one of
      // its ancestors on the current path) may no longer exist; Home is the one guaranteed-valid
      // state to fall back to.
      openPath = [];
      rebuildCategoriesAndTiles();
    }
    exitSelectMode();
  }

  function selectedCount() {
    if (!selectMode) return 0;
    return selectMode.kind === 'category' ? prunedSelectedCategoryRoots().length : selectMode.selectedIds.size;
  }

  function updateSelectActionBar() {
    if (!selectMode) {
      selectActionBar.hidden = true;
      return;
    }
    // Virtually every meaningful select-mode interaction (toggling, range-select, Select All,
    // Cut, navigating while picking a destination) already ends by calling this — resetting the
    // 5-second-inactivity timer here covers all of them at once, on top of the explicit resets
    // during live drag activity (resetMoveModeTimeout).
    resetSelectModeTimeout();
    selectActionBar.hidden = false;
    const isCategory = selectMode.kind === 'category';
    const n = selectedCount();

    selectActionSelectAllBtn.hidden = isCategory; // Select All is tiles-only, per the decision
    selectActionSelectAllBtn.disabled = pickingDestination;
    selectActionRenameBtn.textContent = isCategory ? '🔧' : '✏️';
    selectActionRenameBtn.setAttribute('aria-label', isCategory ? 'Edit category' : 'Rename');
    selectActionRenameBtn.disabled = n !== 1 || pickingDestination;
    selectActionCutBtn.disabled = n === 0 || pickingDestination;
    selectActionDeleteBtn.disabled = n === 0 || pickingDestination;

    if (!pickingDestination) {
      selectActionStatus.textContent = n + ' selected';
      selectActionPasteBtn.disabled = true;
    } else {
      // Same convention as currentLocationId() (used by Create) — "nothing open" now resolves to
      // Home rather than leaving Paste disabled with no destination. Home isn't part of openPath
      // (it's special-cased, always visible, no "open" state), so without this fallback Select
      // could never target Home at all — the only way to reach it used to be cross-category drag,
      // which no longer exists now that drag is same-category reorder only.
      const destId = currentLocationId();
      const nameEl = document.querySelector('.category[data-category-id="' + CSS.escape(destId) + '"] > .category-header .category-name');
      selectActionStatus.textContent = 'Destination: ' + (nameEl ? nameEl.textContent : destId);
      selectActionPasteBtn.disabled = false;
    }
  }

  selectActionClearBtn.addEventListener('click', () => exitSelectMode());

  selectActionSelectAllBtn.addEventListener('click', () => {
    if (!selectMode || selectMode.kind !== 'tile' || pickingDestination) return;
    Array.from(selectMode.grid.children).filter((c) => c.classList.contains('tile')).forEach((t) => {
      if (!selectMode.selectedIds.has(t.dataset.tileId)) {
        selectMode.selectedIds.add(t.dataset.tileId);
        t.classList.add('tile-selected');
      }
    });
    updateSelectActionBar();
  });

  selectActionCutBtn.addEventListener('click', () => {
    if (!selectMode || pickingDestination || selectedCount() === 0) return;
    pickingDestination = true;
    updateSelectActionBar();
  });

  selectActionPasteBtn.addEventListener('click', () => {
    if (!selectMode || !pickingDestination) return;
    confirmMoveSelected();
  });

  selectActionRenameBtn.addEventListener('click', () => {
    if (!selectMode || selectedCount() !== 1) return;
    if (selectMode.kind === 'tile') {
      const tileId = Array.from(selectMode.selectedIds)[0];
      const tileEl = selectMode.grid.querySelector('[data-tile-id="' + CSS.escape(tileId) + '"]');
      if (tileEl) openTileRenameFor(tileEl);
    } else {
      openEditCategory(prunedSelectedCategoryRoots()[0]);
    }
  });

  selectActionDeleteBtn.addEventListener('click', () => {
    if (!selectMode) return;
    const n = selectedCount();
    if (n === 0) return;

    if (selectMode.kind === 'tile') {
      const label = n === 1 ? 'this tile' : n + ' tiles';
      // Only a single-tile delete has one unambiguous element to show below the popup; a batch
      // delete has no one specific target, so it just top-anchors like any other no-target popup.
      const targetEl = n === 1
        ? selectMode.grid.querySelector('[data-tile-id="' + CSS.escape(Array.from(selectMode.selectedIds)[0]) + '"]')
        : null;
      openTileConfirm('Are you sure you want to remove ' + label + '?', () => {
        // Intentional, permanent easter egg — a 10% chance of a second "really sure?" prompt.
        // Never document or hint at this in user-facing help text. Tile-delete only — categories
        // get their own, non-random friction below, scaled to what's actually being deleted.
        if (Math.random() < 0.10) {
          openTileConfirm('Are you REALLY sure? 😳', deleteSelected, { targetEl });
        } else {
          deleteSelected();
        }
      }, { targetEl });
      return;
    }

    // Category branch: impact is computed recursively across every selected (pruned) root, since
    // deleting a category also deletes its full nested subtree.
    const roots = prunedSelectedCategoryRoots();
    let tileCount = 0;
    let subcategoryCount = 0;
    roots.forEach((rootId) => {
      const subtreeIds = categorySubtreeIds(rootId);
      subcategoryCount += subtreeIds.length - 1; // exclude the root itself
      subtreeIds.forEach((id) => { tileCount += loadCategoryTiles(id).length; });
    });
    const combinedTotal = tileCount + subcategoryCount;
    const label = n === 1 ? 'this category (and everything in it)' : n + ' categories (and everything in them)';
    const counts = 'You are about to delete ' + tileCount + (tileCount === 1 ? ' item' : ' items')
      + ' and ' + subcategoryCount + (subcategoryCount === 1 ? ' subcategory' : ' subcategories')
      + ', for a combined total of ' + combinedTotal + (combinedTotal === 1 ? ' entry.' : ' entries.');
    // Friction scales by whether there are any tiles anywhere in the subtree — zero tiles (even
    // with subcategories nested underneath) stays a plain Yes/No; the impact count itself is
    // shown independent of that, whenever there's anything nested at all. No random easter egg
    // for categories, ever — that's tile-delete-only.
    // Same single-target rule as tile delete: only show something below the popup when exactly
    // one category is targeted, not for a multi-select batch.
    const targetEntry = n === 1 ? categoryToggles.get(roots[0]) : null;
    openTileConfirm('Are you sure you want to remove ' + label + '?', deleteSelected, {
      counts: combinedTotal > 0 ? counts : null,
      requireTypedYes: tileCount > 0,
      targetEl: targetEntry && targetEntry.mainBtn,
    });
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

  // 'moon-dial' only: which of the 12 outer/inner label positions sit over the moon emoji's lit
  // vs. unlit side, per phase — derived by pixel-sampling the actual rendered emoji at each
  // position (not guessed), since the moon face has no accessible pixel data at render time and
  // the real shading depends on the viewer's own emoji font. 1 = lit (today's dark number color
  // stays readable), 0 = unlit (needs a light number instead), 'g' = sits almost exactly on the
  // terminator line on the two quarter phases — gets a medium grey that reads fine either way.
  // Index 0 is hour 1 (or 13, on the inner ring), index 11 is hour 12 (or 00).
  const WX_MOON_DIAL_BRIGHTNESS = {
    'New Moon': { outer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], inner: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    'Waxing Crescent': { outer: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], inner: [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
    'First Quarter': { outer: [1, 1, 1, 1, 1, 'g', 0, 0, 0, 0, 0, 'g'], inner: [1, 1, 1, 1, 1, 'g', 0, 0, 0, 0, 0, 'g'] },
    'Waxing Gibbous': { outer: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1], inner: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1] },
    'Full Moon': { outer: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], inner: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    'Waning Gibbous': { outer: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], inner: [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1] },
    'Last Quarter': { outer: [0, 0, 0, 0, 0, 'g', 1, 1, 1, 1, 1, 'g'], inner: [0, 0, 0, 0, 0, 'g', 1, 1, 1, 1, 1, 'g'] },
    'Waning Crescent': { outer: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0], inner: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0] },
  };

  function moonDialNumberColor(brightness, ring) {
    if (brightness === 'g') return '#888';
    if (brightness === 1) return ring === 'outer' ? '#000' : '#c0392b';
    return ring === 'outer' ? '#fff' : '#ff8a80';
  }

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
  // positions (no minute ticks). moonPhase is only passed by 'moon-dial' — 'dual-ring' has no
  // moon background, so its numbers always keep the fixed default colors.
  function renderDualRingNumbers(svg, cx, cy, moonPhase) {
    const brightness = moonPhase && WX_MOON_DIAL_BRIGHTNESS[moonPhase];
    for (let i = 1; i <= 12; i++) {
      const angle = i * 30;
      const outer = polarPoint(cx, cy, 46, angle);
      const inner = polarPoint(cx, cy, 41, angle);
      svg.appendChild(svgEl('line', {
        x1: outer.x, y1: outer.y, x2: inner.x, y2: inner.y, stroke: '#333', 'stroke-width': 1.2,
      }));
      const outerFill = brightness ? moonDialNumberColor(brightness.outer[i - 1], 'outer') : '#000';
      const op = polarPoint(cx, cy, 38, angle);
      const ot = svgEl('text', { x: op.x, y: op.y + 3.5, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 'bold', fill: outerFill });
      ot.textContent = String(i);
      svg.appendChild(ot);
      const innerFill = brightness ? moonDialNumberColor(brightness.inner[i - 1], 'inner') : '#c0392b';
      const ip = polarPoint(cx, cy, 30, angle);
      const it = svgEl('text', { x: ip.x, y: ip.y + 2.5, 'text-anchor': 'middle', 'font-size': 7, fill: innerFill });
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

    renderDualRingNumbers(svg, cx, cy, weatherState.moonPhase);
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
      // Piggybacks on the clock's own once-a-minute tick rather than a second timer.
      // refreshLiveWeather(false) is now a genuine no-op against fresh cached data (see
      // lastAppliedFetchedAt/applyLiveWeatherDataIfNew) — it only actually re-fetches and
      // re-renders the widget's data once WEATHER_STALE_MS (15 minutes) has genuinely passed.
      refreshLiveWeather(false);
      // renderWeatherSkin() is called directly here, every minute, independent of the above —
      // the sunrise/sunset gradient and star/cloud-tint math are driven by wall-clock time, not
      // by weather data, so they still need to progress every minute even on the many ticks
      // where refreshLiveWeather is a no-op. Safe to call this early (function declaration,
      // hoisted) even though it's defined later in the file — this only ever runs from inside a
      // setTimeout callback, well after the whole script has finished executing.
      renderWeatherSkin();
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

  // Same class of native-context-menu conflict already fixed for tiles (Build 37) — the clock's
  // own long-press options menu needs contextmenu suppressed on its link, or Android Chrome (and
  // any other non-iOS-Safari browser) offers to open the image in a new tab on long-press instead.
  document.querySelector('#clock-widget .clock-inner').addEventListener('contextmenu', (e) => e.preventDefault());
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
    tempF: -20, hiF: -10, loF: -30, feelsF: -35, windMph: 35, cloudPct: 100,
    humidity: 60, dewPointF: -25, uv: 0, visibilityMi: 1, moonPhase: 'Full Moon',
    conditionCode: 1117, conditionText: 'Blizzard',
    locationName: 'McMurdo Station, Antarctica', tzId: null,
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

  // How many rendered frames pass between re-rolling a thunderstorm flash's opacity. Default 3
  // holds each flash's opacity steady for 3 frames between re-rolls, calmer than the original
  // every-frame flicker; a Testing Panel slider (1-60, a fixed 60fps assumption rather than a
  // live per-device measurement, since real frame rate varies by display) can adjust it live.
  const WX_LIGHTNING_TUNABLES = {
    rerollFrames: 3,
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
      // Layer order (stars -> cloud overlay -> precipitation (rain/snow/hail/fog/bolt) ->
      // floating clouds -> lightning flash) is now established by each layer's own z-index in
      // CSS, not DOM order — so an already-connected layer is left alone here instead of being
      // re-appended just to keep it visually on top. Re-appending an existing node turned out to
      // reset its running CSS animation's effective position (confirmed via the clouds below,
      // which visibly snapped every time this function ran) — canvases have no CSS animation to
      // disturb, but they're left alone too now on the same principle, for consistency.
      if (!starsCanvas.parentNode) weatherSkin.appendChild(starsCanvas);
      const overlay = document.createElement('div');
      overlay.className = 'weather-skin-overlay';
      overlay.style.background = rgbToHex(cloudTint.rgb);
      overlay.style.opacity = String(cloudOverlayOpacity(cloudPct, cloudTint.daytime));
      weatherSkin.appendChild(overlay);
      if (!precipCanvas.parentNode) weatherSkin.appendChild(precipCanvas);

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
        // Preserved clouds are left exactly where they are in the DOM — z-index (not DOM order)
        // keeps them stacked above the overlay/precip layers now, so there's no longer any need
        // to move them at all just to stay visually on top.
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

      if (!flashDiv.parentNode) weatherSkin.appendChild(flashDiv);
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
      WX_LIGHTNING_TUNABLES.rerollFrames = 3;
      lightningRerollSlider.value = 3; lightningRerollValue.textContent = '3';
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
  // The scroll animation's CSS translateX(-100%) is relative to the track's own (text-driven)
  // width, not the container's — with a fixed animation-duration, a longer message covers a
  // proportionally larger pixel distance in the same time, so its on-screen speed scales directly
  // with message length. Computing the duration from the track's actual rendered width instead
  // keeps every alert scrolling at this same constant, readable pace regardless of length.
  const ALERT_TICKER_PX_PER_SEC = 50;
  function applyAlertTicker() {
    const show = shouldShowAlert();
    alertTicker.hidden = !show;
    weatherFooter.hidden = show;
    if (show) {
      alertTrack.textContent = currentAlert().text;
      const trackWidth = alertTrack.getBoundingClientRect().width;
      alertTrack.style.animationDuration = (trackWidth / ALERT_TICKER_PX_PER_SEC) + 's';
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
  // Fallback location (Orlando, FL) — used only if real geolocation is unavailable, declined, or
  // times out. Fed to the real WeatherAPI fetch, so the location shown is Orlando's actual live
  // weather, not placeholder text.
  const FALLBACK_COORDS = { lat: 28.5383, lon: -81.3792 };

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

    // The analog clock only otherwise redraws once at load (before this data exists) and again
    // on each real minute-boundary tick — without this, the moon-dial style would keep showing
    // weatherState.moonPhase's placeholder default (always a full moon) for however long the
    // fetch took, correcting itself only once the next minute ticked over.
    updateClock();
  }

  // Tracks the fetchedAt of whatever cache snapshot applyLiveWeatherData was last actually run
  // against, so the once-a-minute clock tick's refreshLiveWeather(false) call (below) can be a
  // genuine no-op when nothing changed, instead of re-running the full render pipeline (temps,
  // wind, extras, alert ticker, weatherLiveConditions clear+rebuild) every single minute against
  // identical data — which is what was reading as the widget "clearing and resetting" every
  // minute rather than every 15. null initially so the very first real apply always runs.
  let lastAppliedFetchedAt = null;
  function applyLiveWeatherDataIfNew(data, fetchedAt) {
    if (lastAppliedFetchedAt === fetchedAt) return;
    applyLiveWeatherData(data);
    lastAppliedFetchedAt = fetchedAt;
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
      applyLiveWeatherDataIfNew(cache.data, cache.fetchedAt);
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
      const fetchedAt = Date.now();
      localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ fetchedAt, data }));
      weatherDebugState.outcome = 'fetched-fresh';
      weatherDebugState.errorMessage = null;
      weatherDebugState.rawData = data;
      applyLiveWeatherDataIfNew(data, fetchedAt);
    } catch (e) {
      console.error('Weather fetch failed:', e);
      weatherDebugState.errorMessage = e.message || String(e);
      if (cache) {
        weatherDebugState.outcome = 'fallback-stale-cache';
        weatherDebugState.rawData = cache.data;
        applyLiveWeatherDataIfNew(cache.data, cache.fetchedAt);
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
