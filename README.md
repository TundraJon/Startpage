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

## Build Log (completed)

Reported after reviewing the v8 pass live, built in the following pass.

- [x] Home category header bar: was rendering ~2x too tall — root cause was the `<h2>` tag's browser-default margin (not padding); normalized `.category-name` margin/font-size so it now matches the thin header height of every other category.
- [x] Clock widget: hour and minute digits doubled in size (1.9rem → 3.8rem).
- [x] Weather widget: current temperature number and condition emoji doubled in size (1.8rem → 3.6rem).
- [x] Weather widget: high temp shown in red, low temp shown in blue.
- [x] Weather widget: feels-like icon now switches direction — 🌡️ when feels-like is warmer than actual temp, 🌬️ when cooler.
- [x] Weather widget: the four bottom-row icon+number items (humidity, dew point, moon phase, UV) sized up 1.2x (0.7rem → 0.84rem).
- [x] Tiles: background switched from the off-white page background to pure white (`--surface`).
- [x] Tiles: added a border matching the Home header banner color (`--home-header-bg`) — same CSS variable as the banner, so it'll track automatically once Home color personalization is built.
- [x] Weather widget: background switched to pure white (`--surface`), same fix as the tiles.

## Build Log 2 (completed)

- [x] Clock widget: date stack (day-of-week, month, day-numeral) font size increased 1.3x (0.75rem → 0.975rem).
- [x] Weather widget: high, low, and feels-like text increased 1.2x, sharing a rule with the description text so both land at the same size (0.7rem → 0.84rem).
- [x] Weather widget: condition description text increased 1.2x, same rule as above.
- [x] Weather widget: sample condition text changed to "Light Thunderstorm".
- [x] Sample category tiles (News/Shopping/Entertainment): added a 5th tile to each — AP News, Costco, Hulu.
- [x] Home category's row-3 tiles: added a 5th tile (Google Calendar) alongside Gmail/Translate/Maps/USPS.
- [x] Weather widget: added a border matching the Home banner color (`--home-header-bg`), same treatment as the regular tiles.
- [x] Tile favicons: increased from 60% to 80% fill; tightened tile padding/gap (4px → 2px) so the label text still has room at the larger icon size.
- [x] Weather widget: top row (wind/visibility/cloud extras + location text) increased 1.2x (0.7rem → 0.84rem).
- [x] Clock widget: date stack swapped to static test values "Wednesday" / "September" / "20" (no longer live — the day/month were live-updating fields tied to `updateClock()`, now hardcoded so the long-form test values persist). **Result: it doesn't fit.** At the new 1.3x size, "Wednesday" and "September" both overflow the date column's width and wrap/clip against the widget's height — see screenshot state, this will need either an abbreviated form, a smaller font, or a wider date column once you've had a look.
- [x] Timezone pill: removed from the weather widget's top row; moved to the clock widget, centered under the displayed time (inside `.clock-face`, so it inherits the active color scheme via `currentColor`), font size matched to the AM/PM indicator (0.7rem).

## Build Queue

Empty — nothing queued right now.
