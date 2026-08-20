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

Not yet implemented — queued for the next build session.

- [ ] **Design decision — expanded/long-form date struck entirely** (supersedes the earlier "short vs. long date font size" queue item). Reasoning: the digital time display's footprint needs to become a *square* region, because when analog mode is added later, a circular clock face needs to occupy that exact same square footprint with no wasted space. A square time region leaves much less width for a date column beside it, so there isn't room for full "Wednesday"/"September"-style text — only abbreviated fits. Concrete changes:
  - Clock date stack goes back to abbreviated form only (e.g. "Wed" / "Aug" / "18") — the long-form test values and the short/long toggle idea for this stack are dropped.
  - **Update:** font size for the date stack (day-of-week, month, day-numeral) should be 1x (0.75rem) across the board, not 1.3x as previously queued — reverting all of the font-size increases made to this element, abbreviated or not.
  - Abbreviated date stack should sit tight against the right edge of the time card — just a few pixels of margin, not the wider gap it has now.
  - The day-numeral (bottom line of the date stack) should be horizontally centered specifically under the 3-character month abbreviation.
  - Broader layout note for whenever this is built: reshape the clock widget so the digital time area (currently a 62%-width rectangle) becomes square, shrinking the date column down to just fit the abbreviated text snugly against the right edge — this frees up the space the future analog circular face will need.
- [ ] Tile favicons: reduce from 80% down to 75% of the tile size (80% reads as a bit too big).
- [ ] Weather widget: change the sample location text from "Groveland, FL" to "Los Ranchos de Albuquerque, NM" — a long-location fit test, similar in spirit to the clock date-length test (expected to be a tight fit).
- [ ] Weather widget top row layout: restructure to a strict 50/50 split — left half (wind/visibility/cloud extras) sits directly above the temperature, right half (city/state) sits directly above the condition emoji, each half exactly 50% of the card width (not just space-between as it is now).
- [ ] **Update, overrides the flat "revert to 1x" language above and in the footer-row item from Build Log 2:** on both the weather widget's top row (wind/visibility/cloud icons) and bottom footer row (humidity/dew point/moon phase/UV icons), the *icons* should be 1.2x size — the icons aren't the problem and read well bigger. Only the *text/numbers* next to each icon (mph, mi, %, humidity %, dew point °, moon phase abbreviation, UV number) should be 1x. This means each icon+value pair needs to be split into separate icon/text elements so they can be sized independently — currently they're single text strings (e.g. "💨8mph" as one span), which doesn't allow different sizes for the emoji vs. the number.
- [ ] Clock widget: the hour/minute time display is touching the AM/PM indicator at the top but sits with noticeably more gap (~1/4") above the timezone pill at the bottom. Shift the time display down slightly so it sits closer to the pill, evening out the spacing on both sides.
- [ ] Weather widget: set the sample condition text to WeatherAPI condition code 1201 ("Moderate or heavy freezing rain" — 31 characters) to stress-test wrapping, replacing "Light Thunderstorm".
- [ ] Weather widget: revert the hi/low/feels-like + condition description row's font size from the 1.2x bump back down to 1x (0.84rem → 0.7rem) — at 31 characters, the condition text is likely to wrap to two lines at the larger size.
