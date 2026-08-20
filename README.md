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

## Build Queue

Not yet implemented — queued for the next build session.

- [ ] Clock widget: day-of-week, month, and day-numeral (the stacked date stack) should be 1.3x their current font size.
- [ ] Weather widget: high, low, and feels-like text should be 1.2x their current font size.
- [ ] Weather widget: condition description text (currently "Sunny") should also be 1.2x its current font size, to match the hi/lo/feels-like line size since it sits on the same visual row.
- [ ] Weather widget: change the sample/placeholder condition text to "Light Thunderstorm" (to check how it wraps/fits under the condition emoji at the new size).
- [ ] Sample category tiles (News/Shopping/Entertainment): add a 5th sample link to each so all 5 grid columns are filled per row, instead of 4 tiles leaving an empty 5th slot.
- [ ] Home category's row-3 tiles (Gmail, Translate, Maps, USPS): add a 5th sample link so that row is also filled to 5, same as the other categories.
- [ ] Weather widget: since it's a tile in its own right, give it the same outline treatment as the regular tiles — border color matching the selected Home banner color (`--home-header-bg`), same as what the tile border fix already does.
- [ ] Tile favicons: confirmed currently rendering at `width/height: 60%` of the tile (not the spec's ~80%), and that 60% is measured against the whole tile square rather than the interior space left after padding/gap/label — so the real fill is even smaller than 60% suggests. Needs to be resized up to match the spec's ~80% interior fill.
- [ ] Weather widget: top row (wind/visibility/cloud extras, and location text) should be 1.2x its current font size, to match the sizing of the other small text/icon rows.
- [ ] Clock widget: swap the date stack's sample values to the longest-possible day-of-week and month names — "Wednesday" and "September" — to see how the long-form text fits next to the time (currently showing live short-form date; this is a one-off test value, not the short/long toggle itself).
- [ ] Timezone pill (currently "EDT"): remove from next to the city/state on the weather widget's top row, and instead move it to the clock widget — centered underneath the displayed time — using the clock's currently-selected color scheme (e.g. red-on-black) instead of the weather widget's neutral pill styling. Pill's font size should match the AM/PM indicator's font size.
