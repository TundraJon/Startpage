# Startpage

Personal homepage, hosted on GitHub Pages.

Live at: https://tundrajon.github.io/Startpage/

## Status

Foundation in progress, per `homepage-build-spec-v7`:

- [x] Header (theme toggle, title, help/profile icons)
- [x] Search bar (Google/Bing toggle)
- [x] Home category (always-expanded bento layout, clock + weather widgets, core tiles)
- [x] Accordion category system (collapsible, multi-open, stripe-colored headers) with a few sample sections
- [ ] Weather widget wired to a live data source (currently placeholder data)
- [ ] Clock/weather long-press customization menus
- [ ] Add/edit tiles and categories (help walkthrough, drag/reorg, etc.)
- [ ] Personalization (colors, profile photo, per-device local storage of layout)

Theme and category expand/collapse state already persist per-device via `localStorage`.

## Build Queue

Reported after reviewing the v8 pass live. Not yet implemented — queued for the next build session.

- [ ] Home category header bar: currently renders ~2x too tall. Should match the thin header height of every other category (News/Shopping/Entertainment); reduce the vertical padding above/below the "Home" title. Font size itself is approximately correct.
- [ ] Clock widget: hour and minute digits should be ~2x their current size.
- [ ] Weather widget: current temperature number and condition emoji should be ~2x their current size.
- [ ] Weather widget: high temp shown in red, low temp shown in blue (currently both muted/gray).
- [ ] Weather widget: feels-like indicator should switch icon based on direction — 🌡️ when feels-like is warmer than actual temp (current behavior), 🌬️ when feels-like is cooler than actual temp.
- [ ] Weather widget: the four bottom-row icon+number items (humidity, dew point, moon phase, UV) should be 1.2x their current size.
- [ ] Tiles: background should be pure white, not off-white (currently using the page's off-white `--bg` behind each tile).
- [ ] Tiles: add a border/outline whose color matches the currently-selected Home header banner color, so it updates dynamically if the user picks a different Home color (e.g. dark green banner → dark green tile borders).
