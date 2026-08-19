(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) root.setAttribute('data-theme', storedTheme);

  function syncThemeIcon() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.querySelector('.theme-toggle-thumb').textContent = isDark ? '☀️' : '🌙';
  }
  syncThemeIcon();

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncThemeIcon();
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
    const collapsed = localStorage.getItem('category-collapsed-' + id) === 'true';
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

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    document.getElementById('clock-hour').textContent = String(hours).padStart(2, '0');
    document.getElementById('clock-minute').textContent = minutes;
    document.getElementById('clock-ampm').textContent = ampm;
  }
  updateClock();
  setInterval(updateClock, 1000 * 10);

  const helpBtn = document.getElementById('help-btn');
  const helpOverlay = document.getElementById('help-overlay');
  const helpClose = document.getElementById('help-close');
  helpBtn.addEventListener('click', () => { helpOverlay.hidden = false; });
  helpClose.addEventListener('click', () => { helpOverlay.hidden = true; });
  helpOverlay.addEventListener('click', (e) => {
    if (e.target === helpOverlay) helpOverlay.hidden = true;
  });

  document.getElementById('profile-btn').addEventListener('click', () => {
    helpOverlay.hidden = false;
    helpOverlay.querySelector('h2').textContent = 'Settings';
    helpOverlay.querySelector('p').textContent = 'Profile photo and settings are coming in a later pass.';
  });
})();
