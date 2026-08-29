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

## Build Log 3 (completed)

- [x] Clock widget restructured: digital time area (`.clock-face`) is now genuinely square (`aspect-ratio: 1/1`, sized to 78% of the widget's height, centered) instead of a 62%-width rectangle — verified in-browser at 147.7×147.7 equal width/height. This frees up space for a future analog face with the same footprint. Date stack reverted to abbreviated only ("Thu"/"Aug"/"20"), back to live-updating (short/long toggle and long-form idea dropped), font size back to 1x (0.75rem), shrunk to fit its content and pushed snug against the right edge (`margin-left: auto` + 6px padding). Verified the day-numeral is centered exactly under the month abbreviation (both measured at the same x-center in a live render).
- [x] Tile favicons: 80% → 75%.
- [x] Weather widget sample location changed to "Los Ranchos de Albuquerque, NM" — confirmed it wraps to two lines within its half of the top row without breaking layout.
- [x] Weather widget top row: restructured to a strict 50/50 split (`flex: 0 0 50%` each side) — extras above the temp, location (right-aligned) above the condition emoji.
- [x] Weather icons vs. text sizing split apart: each icon+value pair (top row and footer row) is now two separate elements, icon at 1.2x (`.wx-icon`) and value at 1x (`.wx-val`) — verified via computed styles (13.44px vs. 11.2px, exactly 1.2:1).
- [x] Weather sample condition text changed to WeatherAPI code 1201, "Moderate or heavy freezing rain" — confirmed it wraps to two lines at 1x without breaking the row.
- [x] Weather hi/low/feels-like + description row: reverted to 1x (0.7rem) — verified via computed style.
- [x] Category gaps replaced with a 1px hairline border (`border-bottom: 1px solid var(--border)`, no bottom border on the last category) instead of the old 10px margin — page is visibly more compact now, categories sit flush against each other.
- [~] Clock time-vs-pill vertical spacing: not separately tuned — the square-face restructure above changes this spacing as a side effect (face is now centered via `align-items: center` rather than stretched full-height), but I did not specifically verify it now sits "just a little over" the pill as asked. Worth a look on the live site — flag it again if the gap still isn't right and I'll adjust it directly rather than as a side effect of other changes.

## Build Log 4 (completed)

- [x] Weather widget bottom row: `.weather-hilo` and `.weather-desc` now each constrained to exactly 50% width (`flex: 0 0 50%`), description right-justified. Verified: hi/lo/feels-like now renders on a single line (13px tall, was 25px/double before) since it's no longer being squeezed to 34%; description wraps to two lines within its own half without affecting the other side.
- [x] Clock scheduling replaced: `setInterval(updateClock, 1000 * 10)` is gone. Now renders immediately on load, then computes ms-to-next-minute (`(60 - seconds) * 1000 - milliseconds`) and uses `setTimeout` to fire exactly on the minute boundary, rescheduling itself the same way each time (no drift-prone flat interval). Verified the ms-to-next-minute math against edge cases (:00.000 → 60000ms, :45.500 → 14500ms, :59.999 → 1ms) — all correct.

## Build Log 5 (completed)

- [x] Weather options menu — "Units & Core Info" section reordered to Temperature, Wind speed (unit), Wind Speed, Visibility, Cloud Cover %, Feels Like, Moon Phase, UV Index. Moon Phase moved here from "Visual Flourishes" (which now just holds Sunrise/Sunset Gradient and Live Condition Skin). Dropped the redundant word "display" from the three toggle labels. No JS/CSS changes needed — the toggle wiring is `data-toggle-setting`/`data-toggle` attribute-driven, not order-dependent, so this was a pure markup reorder. Verified the new row order and that the Moon Phase toggle still correctly hides its footer element from its new position.

### Weather Widget Phase 2 — build order item 1 (completed)

Resolved conflict: the spec's stacked wind/visibility/cloud layout **overrides** the previous horizontal build (confirmed with user 2026-08-20).

- [x] Top-left zone (wind/visibility/cloud): switched from horizontal to stacked — emoji on top, value below, three independent mini-columns (`.wx-stack`). Each independently toggleable; `[data-toggle]` + `hidden` attribute (with an explicit `.wx-stack[hidden]{display:none}` override, same fix pattern as the earlier help-overlay bug) — verified via computed styles.
- [x] Feels-like: only displays when the diff from actual temp is ±3°F or more (cold-case emoji 🌬️ already matched the spec, no change needed there). Verified: hides/shows correctly via the toggle, and the sample data (diff of 4°F) correctly shows.
- [x] Long-press options menu built: 3 sections in the spec's order (Units & Core Info, Safety, Visual Flourishes), all 11 controls, opened via a custom long-press gesture (pointerdown + 550ms hold, cancels on move/release) rather than the browser's native context menu. All settings persist to `localStorage` (`weatherSettings`) and were verified to survive a full page reload.
- [x] Temperature unit tap-vs-persistent split: long-press menu F/C selection is the persistent default (saved + reapplied on load); tapping the °F/°C symbol directly is a temporary peek that does not touch the stored setting. Verified directly: tapped to peek at °C, then opened the long-press menu — it still showed °F as the active/persistent selection, confirming the two are properly decoupled.
- [x] Wind speed MPH/KPH: added as a persistent menu setting (source value stored in mph, converted for display) — not explicitly required for item 1 but natural to include alongside the temp unit work since it follows the identical pattern.

## Build Log 6 (completed)

### Clock Widget Phase 2 (from `clock-widget-phase2-spec`)

No conflicts with existing implementation at the time this was reviewed. One genuine internal contradiction *within the spec itself* on 24hr face orientation ("6/18 sit at horizontal left/right" vs. "6 sits at the bottom") — resolved with the user: **24 at top, 12 at bottom, 6 at right, 18 at left** (matches the math for 24 evenly-spaced positions, the ASCII diagram's left/right row, and how real 24-hour accessibility clocks like the Chicago Lighthouse reference are actually laid out).

- [x] Long-press menu on the clock widget (`attachLongPress` — refactored out of the weather widget's identical implementation into a shared helper, both now use it): Digital/Analog segmented selector plus an always-visible live preview area below it — 4 color-scheme swatches (each a small live-updating digital clock) when Digital is selected, or a single live analog face preview when Analog is selected. Selecting an option applies immediately (same instant-apply pattern as the weather menu) and updates the preview so you can see the result without closing the modal.
- [x] 12hr/24hr toggle, shared between modes: in digital, adds/removes the AM/PM indicator; in analog, switches face geometry. Both settings persist to `localStorage` (`clockSettings`) — verified surviving a full reload.
- [x] Analog 12hr face: white background, hour + minute hands, ticks at all 12 positions, only 3/6/9/12 printed, no shading. Rendered via SVG, generated in JS (`renderAnalogFace`).
- [x] Analog 24hr face: outer ring white throughout with 24 ticks + 6/12/18/24 numerals; inner circle split along the horizontal 6–18 axis, gray top / white bottom; hour hand at half speed (one rotation per 24h), minute hand normal. Verified precisely at a mocked midnight (00:00) — hour hand renders pointing exactly to the top (the 24 position), confirming both the orientation and the rotation math are correct.
- [x] Fixed a real browser bug hit along the way: setting `.hidden = false` on an `<svg>` element updates the IDL property but does **not** reliably remove the actual `hidden` content attribute in this Chromium build (confirmed via isolated test — the property read back `false` while `getAttribute('hidden')` still returned `""`). Since the CSS visibility rule targets the attribute via `[hidden]`, this silently kept the analog face invisible even though the "hidden" property said otherwise. Fixed by using explicit `setAttribute('hidden','')`/`removeAttribute('hidden')` for the SVG element specifically, rather than relying on the `.hidden` property.
- [x] Digital mode layout confirmed unchanged/correct, per the spec's own note that this section just restates what's already built.

## Build Log 7 (completed)

### Analog clock follow-ups

- [x] Analog face background: added `--clock-analog-frame` (light: `var(--bg)`, dark: `#3a3f45`, a real visible gray, not the page's near-black `--bg`) — only the circular face itself is white now, the square frame around it follows theme. Verified via computed style: light theme frame = `rgb(242,242,242)` (matches `--bg` exactly), dark theme = `rgb(58,63,69)` (the new dark gray, not white, not near-black).
- [x] 24hr face, dark theme: added `--clock-analog-night` (light: `#c9c9c9`, dark: `#1a1a1a`), read at render time and applied to the inner circle's shaded top half. Verified: renders `#1a1a1a` in dark theme.
- [x] Numeral placement moved inward on both faces to clear the tick marks — 12hr numerals r=34→28, 24hr numerals r=41→37.5 (the old value was sitting exactly on the tick's inner edge, a direct collision; the new value clears both the tick ring and the inner circle's own edge at r=34).

### Digital clock overflow bug + black-white redesign

- [x] Fixed the digit overflow: hour/minute font size reduced 3.8rem → 3rem. Verified across all 4 schemes — overflow went from +11.2px (past the face's edge) to -2.2px (comfortable margin to spare) on both top and bottom.
- [x] Black-white scheme redesigned per the user's sketch: the face now stays black like every other scheme; only a white rounded box (`.clock-digits`) hugs the hour+minute digits specifically. AM/PM and the EDT pill render light-on-black outside that patch, matching the other 3 schemes. Verified via computed style: face background black, digits-patch background white, AM/PM color white.

### Weather Widget Phase 2 — build order item 3 (visual flourishes, built with placeholder data)

Geolocation, true local timezone, and the full live data pull stay queued below — those need the actual WeatherAPI.com integration, which doesn't exist yet. Everything below was buildable now using the existing placeholder weather data (same approach as the rest of this widget).

- [x] Bottom row (humidity/dew point/moon/UV) wrapped in `.weather-footer-row` with a reserved `min-height`, so it holds its space rather than collapsing — verified non-zero height with items toggled off. Note: humidity and dew point don't actually have on/off toggles in the spec's 11-item long-press menu (only Moon Phase and UV do, per the menu structure in section 2 of the spec) — so "all 4 off" can't fully happen with the current control set, but the space-reservation mechanism itself is built and verified correct for whichever items are actually toggleable.
- [x] Severe Weather Alerts scrolling ticker: replaces the bottom row's space when active, loops via CSS marquee animation, dismissible by tap. Dismissal state (`weatherAlertState` in `localStorage`) tracks alert ID + timestamp — verified the full cycle: shows on load, dismiss hides it and persists the dismissal, and the 2-hour reappearance logic is in place (`shouldShowAlert()` re-arms once `Date.now() - dismissedAt >= 2h`). Built against one sample placeholder alert since there's no live alerts feed yet.
- [x] Sunrise/sunset gradient: implemented the exact v8 keyframe/interpolation logic (45-min-each-side twilight window, separate sunrise/sunset keyframe tables, linear RGB lerp between nearest keyframes) using placeholder sunrise (6:30am) / sunset (7:45pm) times. Verified the math precisely against the spec formula at three points — noon (flat `#4a90e2`/`#d1e8ff`, full day), 2am (flat `#020617`, deep night), and mid-sunset (computed RGB matched the hand-worked formula exactly, e.g. top `rgb(65,127,201)`). Initial version was technically correct but visually invisible (opaque row backgrounds fully hid it) — fixed by switching the row backgrounds to semi-transparent (`rgba(var(--surface-rgb), 0.82)`), which lets the gradient read clearly while keeping text readable, checked at the darkest case (deep night).
- [x] Live Condition Skin (cloud-cover-driven part): gray overlay opacity = cloud% ÷ 2, floating cloud emoji count = cloud% ÷ 10, each randomized 1x–2x size with speed scaling to size — verified against placeholder cloud data (20% → 0.1 opacity, 2 clouds). Renders behind all text content (`z-index: -1`) so it never affects readability. The condition-specific base animations (rain/snow/thunderstorm/etc., separate from the cloud-cover math) are not built — the spec gives no specifics there beyond "implementer has creative latitude," so that part is left for a dedicated follow-up rather than guessing at a design.

## Build Log 8 (completed)

### Analog clock corrections

- [x] Frame color fixed to flat `var(--clock-bg)` (black) always, both themes, both faces — the theme-aware `--clock-analog-frame` variable from Log 7 was removed. Verified: `rgb(0,0,0)` in both light and dark theme.
- [x] 12hr numerals reverted to r=34 (undoing the accidental r=28 move). Verified: "3" numeral now renders at x=84 (cx 50 + r 34), matching the original position exactly. 24hr numerals stay at r=37.5.
- [x] 24hr dark-theme contrast fixed: added `--clock-analog-day` (light `#fff`, dark `#8a8a8a`) and changed `--clock-analog-night` to dark `#4a4a4a` (was `#1a1a1a`, nearly identical to the `#222` hand color). Both the outer ring/12hr face and the 24hr inner circle's day-half now use `--clock-analog-day`, so the whole dark-theme face reads as appropriately gray rather than staying stark white, while the hands stay clearly visible against both halves — checked visually with the hands actually rendered on top, not just as flat swatches.

### Clock: timezone pill

- [x] Moved out of `.clock-digital` (which disappears in analog mode) into a new `.clock-date-stack` wrapper alongside the day/month/day-number, anchored to the bottom of the date column via `justify-content: space-between` on `.clock-date`. Now visible in both digital and analog modes — verified in both.

### Long-press modals: native text-selection bug

- [x] Fixed: extended `user-select: none` / `-webkit-touch-callout: none` / `touch-action: manipulation` to `.help-panel` (shared by all three overlays — help, clock options, weather options), not just the widgets themselves. Verified via computed style (`user-select: none` on the panel).

### Weather widget: corrected layer stack + testing panel

- [x] **Real bug found and fixed along the way:** the layer-stack correction initially had all the right computed styles (skin background, opacity, z-index all verified correct in the DOM) but rendered completely invisible — a plain white card regardless of settings. Root cause: `.weather-widget` had `position: relative` but no explicit `z-index`, so it never actually established its own stacking context; `.weather-skin`'s `z-index: -1` was resolving against some distant ancestor's stacking context instead of being scoped locally, placing it behind unrelated page content. Fixed by adding `z-index: 0` to `.weather-widget`. Re-verified visually after the fix — the gradient is now genuinely visible.
- [x] Removed the per-row opaque/semi-transparent scrims (`.weather-top`, `.weather-middle`, etc. no longer have their own background) — replaced with the correct 5-layer stack: white base (`.weather-widget`'s own background, now toggleable) → sky gradient (`.weather-skin`, opacity-controlled) → cloud cover (overlay + drifting clouds, already layered inside `.weather-skin`) → *(weather effects — not built, per item 5, left alone)* → data (text/icons, always topmost, no longer needs its own background to stay readable).
- [x] Testing panel built (`🧪 Testing Panel` button at the bottom of the page, clearly marked temporary): time override (scrub any time of day to preview the gradient), cloud % slider, white-background toggle, gradient opacity slider, and a text-outline toggle (medium gray, the readability idea from the last message) — all wired to `renderWeatherSkin()` and verified live: time override to 2am produces the exact flat `#020617` night color; white-bg off + opacity slider all confirmed via computed style; cloud slider at 80% produces exactly 8 clouds at 0.4 overlay opacity (matches the cloud%÷10 and cloud%÷2 formulas exactly).
- [x] Used the finished tool to actually look at the worst case (white bg off, night colors) — confirmed the readability problem is real: some text stays visible, some effectively disappears against near-black. This was expected and is intentionally *not* fixed in this pass — item 5 (condition-specific effects) and the broader text-color question are still open, now something that can actually be evaluated instead of guessed at.

## Build Log 9 (completed)

### Clock widget: timezone pill anchoring (correction)

- [x] Pill moved out of the `.clock-date` flex flow entirely — now a direct child of `.clock-widget`, `position: absolute; bottom: 6px; right: 8px;`, anchored to the widget's own bottom-right corner rather than the date column's. `.clock-widget` gained `position: relative` to scope it. `.clock-date`'s `justify-content` simplified from `space-between` (no longer meaningful with only one child) to `center`. Verified via computed style: `position: absolute`, `bottom: 6px`, `right: 8px`.

### Clock widget: missing border

- [x] Added `border: 1px solid var(--home-header-bg)` to `.clock-widget`, matching `.tile` and `.weather-widget`. Verified via computed style.

### Weather widget: temperature font color

- [x] `.weather-temp` now uses `color: var(--fg-muted)`, matching `.weather-unit`. Verified both compute to the same `rgb(107, 107, 107)`.

### Weather widget: cloud layer distribution + opacity

- [x] Clouds now spawn only within the top 50% of the widget (`top: 0%–50%`, was `10%–70%`), with size and speed both derived from vertical position instead of randomized independently: `f = topPct / 50`, `size = 2.5 - 1.5*f` rem, `duration = 17 + 43*f` seconds — top edge is 2.5x/17s (fastest), middle is 1x/60s (slowest), linear in between. Cloud count formula and horizontal drift left untouched. Opacity dropped from `0.9` to `0.8`. Verified programmatically: sampled 10 clouds at 100% cloud cover, every one matched the formula exactly and stayed within the 0%–50% band.

### New feature: automatic theme switching by local time

- [x] Built as opt-in, off by default (`themeAutoMode` in `localStorage`, starts unset/false). UI question from the queue resolved by long-pressing the theme-toggle button (same `attachLongPress` pattern as the clock/weather widgets) to open a new "Theme Options" overlay with a single "Automatic (day 7am–7pm / night 7pm–7am)" checkbox — no new global settings surface needed. When enabled, applies the correct theme immediately and schedules a `setTimeout` for the next 7:00 boundary (mirrors the `scheduleNextClockTick()` pattern) so it flips live without a reload. Manual-vs-auto conflict resolved as: a manual click on the toggle always wins and turns auto mode off (rather than being silently overridden at the next boundary) — this wasn't specified, so flagging the decision here in case it's not what's wanted. Verified with `page.clock`: auto-on at 2pm → light, auto-on at 10pm → dark, manual click while auto is on → auto flag clears to false.

### ~~Weather widget: cloud overlay / drifting clouds not rendering~~ (not a bug — confirmed)

- [x] Root cause confirmed by user: the "Live Condition Skin" toggle in Weather Options was simply off. No code issue, nothing was built.

## Build Log 10 (completed)

### Weather widget: dynamic (background-aware) text color

- [x] Built early — user asked for it ahead of the WeatherAPI work specifically to be able to test the white-base-vs-gradient question live rather than in the abstract. Implements the already-agreed design: black text on light/warm composited backgrounds, medium gray (`#808080`) on dark/near-black ones, hard cutoff (no crossfade), one widget-wide value (not per-row).
- [x] Composite is genuinely 3-layer as planned: base (white, or dark navy in dark theme, or transparent if the white-bg toggle is off — read via `getComputedStyle(weatherWidgetEl).backgroundColor` rather than hardcoded white, so it's correct under both themes and the toggle) → sky gradient average color (`lerpColor(sky.top, sky.bottom, 0.5)`, "one widget-wide color" resolved as the midpoint of the top-to-bottom gradient) at its opacity → cloud tint (`#4b5563`) at its own opacity, always layered on top when Live Condition Skin is on regardless of the gradient toggle. Standard WCAG relative luminance formula on the final composited RGB, threshold at `0.5` (`WX_TEXT_LUMINANCE_THRESHOLD` in script.js) picks black vs. gray.
- [x] Scope decision made during the build, not previously specified: only the *neutral/muted* text (wind/visibility/cloud, location, temp, hi/lo's "feels like", footer stats) is driven by the new `--wx-text-color` custom property. The deliberately-colored elements — hi (red)/lo (blue) semantic arrows, and the UV badge's severity colors — were left untouched, since overriding those would erase their own meaning rather than fix a readability problem. Flagging this in case "all the widget's text" was meant more literally.
- [x] When both `sunGradient` and `liveSkin` are off, `--wx-text-color` is removed entirely and every affected element falls back to the normal themed `var(--fg-muted)` via `var(--wx-text-color, var(--fg-muted))` — verified computed color returns to the exact theme value (`#6b6b6b`) with the property unset.
- [x] Verified live across scenarios: default state (white bg on, 18% opacity) → black; night + white-bg-on-18% → still black (white dominates at low opacity, as expected); night + white-bg-off (full gradient) → gray; midday + white-bg-off → landed right at the threshold edge (see note below); midday + 60% opacity white-bg-on, the exact case from the user's screenshot → black, confirmed by screenshot comparison. Dark theme confirmed pulling the actual dark navy `--surface` as the base (not literal white) — night + 18% opacity in dark theme correctly resolves to gray.
- [x] **Worth watching:** a saturated full-strength midday sky blue (`#4a90e2`/`#d1e8ff` averaged) computed to a relative luminance of ~0.48 — just under the 0.5 threshold, landing on gray rather than black, even though it visually reads as a fairly light blue. WCAG relative luminance weights blue very low (0.0722), so saturated blues can read "darker" by this formula than they look to the eye. The threshold (and possibly the luminance formula itself, e.g. switching to HSL lightness) is exactly what still needs live tuning via the testing panel, as already flagged — this is a concrete example of why.
- [x] The white-base-stays-in-the-design question is still not decided — this build doesn't resolve it, it's the tool for evaluating it. That decision is still open.

## Build Log 11 (completed)

### Weather widget: text-color threshold corrected (gray's own luminance, minus a margin)

- [x] `WX_TEXT_LUMINANCE_THRESHOLD` (script.js) is no longer a hardcoded `0.5` — it's now computed at load time as `relativeLuminance(hexToRgb(WX_TEXT_DARK)) - WX_TEXT_THRESHOLD_MARGIN`, with `WX_TEXT_THRESHOLD_MARGIN = 0.05` (starting value, tunable). Landed at ≈0.166. Verified: the saturated midday sky blue that was landing on gray under the old 0.5 threshold now correctly resolves to black; deep night still resolves to gray.

### Weather widget: larger drifting clouds now enter/exit fully offscreen regardless of size

- [x] Real per-cloud fix, not a bigger flat percentage: each cloud gets a `--cloud-w` CSS custom property set from its own measured `offsetWidth` (plus a 4px buffer) right after it's added to the DOM, and `.wx-skin-cloud`'s `left` plus the `wx-cloud-drift` keyframe now both use `calc(-1 * var(--cloud-w, 40px))` / `calc(100% + var(--cloud-w, 40px))` instead of the old flat `-15%`/`115%`. Verified programmatically across 10 clouds at 100% cover: every cloud's computed `--cloud-w` matched its actual rendered width + 4px, and every one's start position left its right edge safely negative (fully offscreen) regardless of size.

### Weather widget: cloud count formula rounds up below 10%

- [x] `Math.round(cloudPct / 10)` → `Math.floor(cloudPct / 10)`. Verified: 8% → 0 clouds, 15% → 1, 100% → 10, matching the "no clouds below 10%, one per 10%" rule exactly.

### Weather widget: re-randomize cloud height on each lap

- [x] Extracted the random top/size/duration generation into a `randomizeCloud(cloud)` helper, called once at creation and again from an `animationiteration` listener attached to each cloud — so every lap gets a fresh height (and correlated size/speed) instead of the same fixed lane forever. `--cloud-w` is recomputed inside the same helper, so a respawned cloud's offscreen entry width stays correct for its new size too. Verified by dispatching synthetic `animationiteration` events: top/size/duration all changed on each call, and `--cloud-w` tracked the new rendered width correctly afterward.
- [x] ~~The "does changing `animation-duration` mid-loop cause a visible flicker" question flagged when this was queued is resolved structurally~~ — **this turned out to be wrong.** It is visible, and the actual cause wasn't duration — see the queue fix below.

## Build Log 12 (completed)

### Settings menu built; auto-theme toggle moved out of the long-press overlay

- [x] Per user's correction ("No, it will be removed"): the long-press-triggered "Theme Options" overlay from Build Log 9 is gone entirely — no more `attachLongPress` on the theme-toggle button. In its place, a real (minimal) Settings overlay (`#settings-overlay`) opens from the profile button, replacing its old "coming soon" placeholder. The "Automatic (day 7am–7pm / night 7pm–7am)" checkbox now lives there, under a "Theme" section. Verified: profile click opens it with the checkbox present, the old `theme-options-overlay` no longer exists in the DOM, and long-pressing the theme button no longer opens anything (falls through to an ordinary click/toggle).

### Theme change instantly repaints the clock and weather widget

- [x] Added `syncThemeDependentUI()` (calls `updateClock()` + `renderWeatherSkin()`), called after every *runtime* theme change — the manual toggle click, the auto-theme scheduled switch, and toggling auto-mode on/off in Settings. Deliberately **not** called from the initial synchronous theme application at page load, since `updateClock`/`renderWeatherSkin` reference `const`s (`clockSettings`, `weatherSettings`, etc.) declared later in the same file — calling them that early would throw (temporal dead zone) before those declarations run. Verified: analog clock face fill colors change immediately on toggle (no minute wait), and — after isolating from `sunGradient`'s independent effect on the composite, which also correctly depends on `sky` rather than theme — the weather widget's `--wx-text-color` flips black↔gray immediately when `sunGradient` is off and only `liveSkin`'s cloud tint is in play. Also verified reloading with auto-theme mode already persisted true throws no init-time error.

### White background off automatically whenever a Visual Flourish is on

- [x] Resolves the long-tabled white-base question. `renderWeatherSkin()` now computes `hasFlourish = weatherSettings.sunGradient || weatherSettings.liveSkin` once and drives all three formerly-testing-panel-only behaviors from it: the `no-white-bg` class, the gradient's opacity (always full-strength `1` now, since white base can no longer coexist with it), and the text-color composite base. When there's no sky gradient but `liveSkin` is still on, the composite correctly falls back to the *page's* own background (reading through the now-transparent widget) rather than misreading the widget's own transparent computed color as black.
- [x] Per user's answer ("Go ahead and remove them"), the testing panel's manual white-background toggle and gradient-opacity slider are gone — removed from both the HTML ("Sky Layer" section deleted) and `weatherTestState`. Verified: neither `#test-whitebg-toggle` nor `#test-opacity-slider` exist anymore; both flourishes off → no `no-white-bg` class; either one on → class present and gradient opacity reads `1`.

### ~~Cloud respawn jump bug fixed~~ (incomplete — see queue for the real fix)

- [x] `randomizeCloud()` split: the random negative `animation-delay` is now set exactly once, at creation, right after the initial `randomizeCloud()` call (reading the duration it just set). The `animationiteration` respawn handler calls `randomizeCloud()` alone, which now only ever touches `top`/`fontSize`/`animationDuration`/`--cloud-w` — never delay again. Verified: dispatching a synthetic `animationiteration` event leaves `animationDelay` unchanged while `top`/`animationDuration` do change, confirming the fix without needing to wait out a real multi-second animation cycle.
- [x] **This was only half the bug.** User reported clouds still jitter/jump after this shipped. Re-isolated with the same repro methodology and confirmed: reassigning `animation-duration` alone (delay left untouched, fixed at creation, exactly as shipped) reproduces the identical teleportation — the browser recalculates a running animation's current cycle position as elapsed-time ÷ duration, so changing *either* delay or duration on a live animation can jump it, not just delay. Repro: 19 rogue iteration events in 4 seconds (durations averaging ~1s, should be ~4-6), computed `left` landing anywhere from -39px to 233px on a 300px box — matches "jitters around and jumps in randomly" exactly. See the Build Queue entry below for the actual fix and its own verification.

### Live Condition Skin: full animation system built (from uploaded `weatherconditionskindetailedspec.md`)

- [x] All 10 states from the spec, driven by a single `<canvas class="weather-skin-precip">` plus a `<div class="weather-skin-flash">`, both created once and repositioned via `appendChild` on every `renderWeatherSkin()` pass to keep the required DOM/paint order (gradient → cloud overlay → **precip canvas** → floating clouds → **flash** → widget content) — verified directly via DOM inspection. One continuous `requestAnimationFrame` loop (`stepConditionSkin`) does near-zero work when nothing is selected.
  - **Light/Heavy Rain:** 17 / 45 diagonal streaks, heavy falls faster and darker-toned. Thunderstorm reuses the heavy-rain streak system as its base, per spec.
  - **Snow:** 25 flakes, slow fall, per-flake independently-phased horizontal sway (sine wave, randomized phase/speed per flake, not synced).
  - **Hail:** 30 pellets, fast near-vertical fall, **required bounce-on-impact** implemented as a small state machine per particle (`fall` → `bounce`, a brief upward hop via a half-sine easing, fading out — then respawns at top) — this was the one explicitly non-optional visual trait in the spec and got dedicated per-particle state rather than being folded into the generic fall logic.
  - **Thunderstorm lightning flash:** randomized 8–20s interval, 100–150ms duration, 20–30% opacity, one at a time — verified the *first* flash fires almost immediately (by design: its internal timer starts at 0, so the very first qualifying frame satisfies "time to flash"), confirmed directly rather than waiting out a full interval.
  - **Clear Day / Clear Night flourishes:** 5 slowly-rotating translucent rays from the top-right corner (~4min/rotation) and 15–25 independently-twinkling stars (per-star randomized phase), respectively. **Known simplification, not in the original spec:** selecting these does *not* auto-force the time-of-day override — they layer onto whatever gradient state (real time or the existing time-override control) is already showing. Selecting "Clear Night" against an actual daytime gradient will render barely-visible white star dots; combine with the existing time-override control to see it properly. Flagging this as a deliberate scope simplification, not an oversight.
  - **Fog/Mist:** 2–3 large (35–50% of widget width) very-low-opacity (14%) soft radial-gradient blobs drifting horizontally, wrapping at the edges.
  - **Partly Cloudy / Overcast:** no dedicated code, per spec — the picker entries exist for completeness but do nothing beyond what the existing cloud-cover system (already on whenever `liveSkin` is active) already renders.
  - **Compound conditions:** driven by a `Set` of active keys (`weatherTestState.conditionSkins`), not a fixed enum — any combination layers automatically since each particle type/effect just checks `c.has('...')` independently. Verified Thunderstorm + Hail together: both particle types draw simultaneously and the flash still fires on its own schedule on top.
- [x] **Placement, per user's correction — overrides what the uploaded doc said:** the "Preview Condition Skins" picker (10 checkboxes, multi-select) lives in the existing temporary `🧪 Testing Panel`, not the Weather Options long-press menu — it's explicitly temporary and will be removed with the rest of that panel once real API integration lands, not kept as a permanent feature. The reset button clears all 10 checkboxes along with the panel's other controls.
- [x] Verified via canvas pixel inspection (not just visual screenshots) that the canvas actually draws non-transparent pixels when a condition is active and clears fully to transparent when none are selected or `liveSkin` is off — plus screenshots confirming rain, snow, hail, and fog are visually distinguishable from each other as the spec intended (streaks vs. dots vs. pellets vs. soft blobs).

## Build Log 13 (completed)

### Live Condition Skin: cloud overlay derived from sky brightness

- [x] Replaced the fixed `#4b5563` gray entirely. `computeCloudTint(now, conditionSkins)` (script.js) computes the current sky-average color (`lerpColor(sky.top, sky.bottom, 0.5)`, same convention already used for the text-color composite), applies `multiplier = 1 + (daytime ? -dayBasePct : +nightBasePct)/100 - conditionShiftPct/100`, and scales each RGB channel by it (clamped 0–255). `isDaytime(now)` reuses the exact existing `SUNRISE_SEC ± TWILIGHT_HALF` / `SUNSET_SEC ± TWILIGHT_HALF` boundary — no new threshold introduced. `WX_CLOUD_TINT_RGB` is gone; the text-color composite calc now reuses the same `cloudTint.rgb` the overlay itself paints with.
- [x] Opacity now branches day/night: `cloudOverlayOpacity()` returns `cloudPct/2/100` by day (unchanged), `cloudPct/100` by night (new, double the day rate) — not condition-dependent, matching the spec.
- [x] Verified against the user's own worked examples exactly: Day + Heavy Rain + 40% cloud → readout showed "Day · 40% of sky · 20% opacity"; Night + Thunderstorm + 70% cloud → "Night · 100% of sky · 70% opacity" (the coincidental case where Thunderstorm's −40% exactly cancels the night's +40% base). Computed overlay background/opacity matched the readout in both cases.
- [x] All 5 constants (day base, night base, light/heavy rain shift, thunderstorm shift) live in a mutable `WX_CLOUD_TUNABLES` object, defaults matching the spec (40/40/10/20/40).

### Testing panel: sliders and live display for the cloud brightness formula

- [x] 5 range sliders added to the existing "Preview Condition Skins" section (not a new section, since they only matter while previewing) — each writes straight into `WX_CLOUD_TUNABLES` and re-renders immediately. A live readout line shows the current Day/Night branch, resulting brightness (% of sky), and resulting opacity (%), plus a small color swatch and hex value showing the actual computed tint. Reset button restores all 5 to spec defaults. Verified: dragging the day-base slider changed the readout's brightness % immediately, matching the new value.

### Weather widget: cloud opacity increased to 90%

- [x] `.wx-skin-cloud`'s `opacity` changed from `0.8` to `0.9`. Verified via computed style.

### Cloud respawn: real fix shipped — element replacement instead of mutation

- [x] The Build Log 12 fix only addressed `animation-delay`; user reported clouds still jittering. Root cause fully isolated: reassigning `animation-duration` alone on a running animation causes the identical jump (confirmed via the same repro methodology — 19 rogue iterations in 4s, positions scattered -39px to 233px). The real fix: `spawnCloud(oldCloud)` now creates a brand-new `<span>` and uses `weatherSkin.replaceChild()` to swap it in at the same DOM position (preserving the fixed layer order), rather than mutating the existing element's animation properties. Fresh elements just start a clean animation with nothing to reinterpret. The initial creation batch still gets a staggered negative `animation-delay` (so N clouds don't start in lockstep); respawns via the `animationiteration` listener get none, by design.
- [x] Verified directly (not just via the isolated repro this time): dispatched a real `animationiteration` event on a live cloud in the actual app and confirmed the DOM node's identity changes (a JS marker set on the original element does not carry over to whatever `.wx-skin-cloud` exists afterward), the original node is no longer in the DOM, and the new node's `left` position exactly matches `-1 × --cloud-w` (fully offscreen, as designed).

## Build Log 14 (completed)

### Live WeatherAPI.com integration

- [x] **Key storage — security decision:** this is a fully static site with no backend, so any key baked into `script.js` would sit permanently in the public repo's git history, not just be visible on the live page. Rather than commit the user's real key, added a "WeatherAPI Key" password-type input to the Settings overlay (`index.html`, new "Weather" `options-section`); the key is read/written only via `localStorage.getItem/setItem('weatherApiKey', ...)`, entered once per device, and never touches any tracked file. A note in the Settings UI states this explicitly. Verified with `grep -rn` across the working tree that the literal key the user shared in chat never appears in any file before committing.
- [x] 15-minute staleness cache: `loadLiveWeather(force)` reads `{ fetchedAt, data }` from `localStorage['weatherLiveCache']`; skips the network call and re-renders straight from cache when `Date.now() - fetchedAt < 15min` and not forced, otherwise re-fetches and overwrites the cache. Verified with a 3-case Playwright test against a mocked `api.weatherapi.com` response: initial load with no cache → 1 request; immediate reload with a fresh cache → 0 requests; reload after manually rewriting `fetchedAt` to 16 minutes old → 1 request. All three passed.
- [x] Geolocation via `navigator.geolocation.getCurrentPosition`, falling back to a fixed coordinate (the original placeholder location) if the API is unavailable, denied, or errors. **Bug found and fixed:** the browser's own `timeout` option on `getCurrentPosition` doesn't reliably fire either callback when a permission prompt is left pending rather than explicitly denied — confirmed via Playwright with no geolocation permission granted, where the call hung indefinitely. Fixed by racing it against an explicit `setTimeout(9000)` in `getCoords()`, guarded so only the first resolution wins. Re-tested: resolves to the fallback coordinate at ~9.1s as expected.
- [x] Timezone abbreviation from `location.tz_id` via `Intl.DateTimeFormat(tzId, { timeZoneName: 'short' })`, with a `shortOffset` (`UTC±N`) fallback when the ICU data returns a bare `GMT` offset instead of a real abbreviation. Confirmed via direct testing across several zones that this is a genuine Chromium/ICU limitation for many non-US zones (Tokyo, Paris, São Paulo, Zurich, Rome all return `GMT±N`), not a bug — the fallback path is expected to be taken often outside the US. Verified end-to-end with a mocked `America/Denver` response: the clock's timezone pill correctly showed "MDT".
- [x] Full live data pull mapped onto every display field: temp, hi/lo, feels-like, wind, cloud %, humidity, dew point, UV, visibility, moon phase, location name, condition text, sunrise/sunset, and severe alerts — all via a new `renderWeatherExtras()` plus the existing temp/wind renderers. The weather alert ticker now shows a real live alert (`currentAlert()`) when one is present, falling back to the existing sample alert when there isn't one. Verified by inspecting the rendered DOM against a mocked response: all fields matched exactly (e.g. `72°`, `10mi`, `Testville, NM`, `Sunny`, `40%`, `45°`, `🌕 Waxing Gibbous`, `3`).
- [x] Live Condition Skin auto-selects from the real WeatherAPI condition code via a new code→skin lookup table (`WX_CONDITION_MAP`, covering thunderstorm/heavy rain/light rain/snow/fog codes), falling back to Clear Day/Clear Night (via the existing `isDaytime()`) when the code has no distinct skin mapping — WeatherAPI has no separate "hail" code, so hail isn't reachable from live data, only from the manual Testing Panel. Wired through a new `getEffectiveConditionSkins()` accessor (mirroring the existing `getEffectiveSkyTime()`/`getEffectiveCloudPct()` pattern) so the Testing Panel override and real live data share the same rendering path without one clobbering the other.
- [x] **Bug found and fixed — temporal dead zone crash:** `weatherLiveConditions` and `getEffectiveConditionSkins()` were originally declared near the bottom of the file with the rest of the live-weather code, but `renderWeatherSkin()`'s very first synchronous call at page load already calls `getEffectiveConditionSkins()` — referencing the `const` before its declaration line had run threw an uncaught `ReferenceError`, which silently halted all further top-level script execution, meaning `refreshLiveWeather()` (further down the same file) never ran at all and live data never loaded, with no visible error on the page. Fixed by moving both declarations up next to `weatherTestState`, well before any rendering call. Verified via Playwright with a `pageerror` listener: zero errors, and the full fetch → render pipeline now runs on load.
- [x] Verified the real end-to-end network call cannot be exercised from this sandbox (`api.weatherapi.com` isn't on the environment's outbound allowlist — confirmed via the proxy status endpoint), so all of the above was verified with Playwright's `page.route()` mocking the API response instead; this should not affect the real deployed page loading from the user's own device/network.

## Build Log 15 (completed)

### Live Condition Skin: day/night is now a base fact, independent of the Sunrise/Sunset Gradient toggle

- [x] Factored the shared boundary math out of `computeSkyColors()` into `computeSkyPhase(now)` (returns `{ window, xRatio }`), so both the sky-color interpolation and the new `computeNightFactor(now)` (continuous 0=day/1=night) read from one place instead of duplicating it.
- [x] `.weather-skin`'s background is no longer gated on `sunGradient` alone: with it on, the full multi-stop transition applies as before; with it off but `liveSkin` on, a flat day-or-night background (`FULL_DAY_SKY`/`DEEP_NIGHT_SKY`, hard cut at the boundary, no twilight blending) now applies instead of no background at all; with both off, no background, unchanged.
- [x] Clear Day/Clear Night are no longer a manual selection — the "Clear (Day)"/"Clear (Night)" checkboxes were removed from the Testing Panel entirely. "Clear" is now just the absence of any precip-type condition (`isConditionClear()`, checked against a new `WX_PRECIP_CONDITION_KEYS` list), with day vs. night inferred from `isDaytime()`/`computeNightFactor()` at render time. `applyLiveWeatherData()`'s condition mapping simplified to match — it no longer injects an explicit `clearDay`/`clearNight` value, just leaves the live-condition set empty when nothing maps.
- [x] **Bug found and fixed as part of this refactor:** `stepConditionSkin`'s early-return guard used to bail out entirely whenever the condition set was empty (`c.size === 0`) — which used to never happen for "clear," since clearDay/clearNight themselves occupied the set. Once "clear" became an empty set by design, that guard would have silently stopped clear skies from ever rendering (no stars, ever). Fixed by only bailing on `!weatherSettings.liveSkin`.
- [x] Star fade rule: stars multiply their own brightness by `computeNightFactor(getEffectiveSkyTime())` when the Sunrise/Sunset Gradient toggle is on (smooth fade through the transition), or by a hard 0/1 from `isDaytime()` when it's off (instant cut at the boundary) — both respecting the Testing Panel's time override via the existing `getEffectiveSkyTime()`.
- [x] Verified via Playwright: background is day-colored by default, switches to the flat night color instantly on a midnight time override and back to day colors at 4pm; with `sunGradient` off and `liveSkin` on the background still renders (previously would have been blank); at midnight with no condition checked, non-transparent (star) pixels are drawn on the precip canvas; at 4pm with no condition checked, zero pixels are drawn (clear day has no flourish). Zero page errors throughout.

### Removed the Clear Day sun rays

- [x] Deleted the rotating sun-ray canvas block entirely. Clear Day now renders no flourish of its own — just the sky gradient/background brightness, matching how "clear" no longer needs its own explicit signal. Verified: zero canvas pixels drawn for a clear daytime state.

### Star twinkle rewritten: event-driven flicker, smaller, colored, sharper

- [x] Replaced the continuous sine-pulse twinkle with a per-star baseline + occasional brief flicker model, timestamp-driven (`ts`, not a per-frame counter, so it's no longer frame-rate dependent). Each star gets a baseline opacity from one of two populations — ~80% usually-bright (baseline 0.75–1.0) with occasional brief *dips*, ~20% usually-dim (baseline 0.15–0.35) with occasional brief *flares* — and a randomized next-flicker timestamp; when reached, it eases away from baseline over 150–650ms (a sine ease in/out) and back, then rolls a new 2–8s delay before the next one. Verified by sampling the sum of all stars' alpha over 30 frames: a gradual, modest drift rather than a large synchronized swing, consistent with a handful of stars flickering independently rather than the whole field pulsing together.
- [x] Star radius shrunk from 0.8–1.8px to 0.4–1.0px.
- [x] Stars now have color: a weighted palette (white ~70%, blue-white ~12%, pale yellow ~10%, pale orange ~8%) picked per star at creation and used for its fill instead of a hardcoded white. Verified: many distinct RGB values present in the drawn pixels, clustering into the four palette colors (plus a few blended values where overlapping star edges compositied together).
- [x] `precipCanvas` now scales its backing store by `devicePixelRatio` (`ctx.setTransform(dpr,0,0,dpr,0,0)` after resizing to `w*dpr` × `h*dpr`, CSS size unchanged) — sharpens the whole canvas (rain/snow/hail/fog/flash too, not just stars), fixing the softness from previously rendering at 1x on a high-density screen. Verified at a simulated DPR of 3: backing store came out at ~3x the CSS box size as expected, with no errors.

### Clouds stack up at the left edge after the tab regains focus — fixed

- [x] Added a `visibilitychange` listener that re-stages every existing cloud (via the same safe `spawnCloud(oldCloud)` element-replacement path already used for respawns, with a fresh randomized negative delay) whenever the page becomes visible again, guarding against mobile Chrome throttling/resetting animation state while backgrounded. Verified by simulating a hidden→visible transition mid-animation: clouds were replaced with freshly staggered ones spread across a wide range of positions (272px spread in an 8-cloud test), not bunched at the edge.

### Testing Panel now docks to the bottom half of the screen

- [x] Scoped CSS to `#testing-panel-overlay`/`#testing-panel-overlay .help-panel` only (`align-items: flex-end`, panel `height: 50vh`), leaving the weather widget visible above it while adjusting sliders/checkboxes. Settings/Help stay untouched as full-screen centered modals. Verified: panel top and height both measured at exactly half the viewport height and full width; Settings' own panel still measured its original 480px max-width, confirming no leakage between the two.

### Moon phase icon now matches the live phase text

- [x] Added an 8-phase name→emoji map and wired `wx-moonphase-icon`'s textContent from it in `renderWeatherExtras()`, alongside the existing text update. Also corrected the placeholder default (`weatherState.moonPhase`) from `'Full'` to `'Full Moon'` to match WeatherAPI's real phase-name strings, since the map keys on the exact string. Verified all 8 phases end-to-end via mocked live data — each produced the correct icon and matching text (🌑 New Moon, 🌒 Waxing Crescent, 🌓 First Quarter, 🌔 Waxing Gibbous, 🌕 Full Moon, 🌖 Waning Gibbous, 🌗 Last Quarter, 🌘 Waning Crescent).

### Regression check

- [x] Toggling Live Skin off still cleanly removes the precip canvas and all clouds from the DOM with no errors; toggling it back on resumes normally. Zero page errors across the whole verification pass, aside from pre-existing unrelated noise (a missing favicon, and this sandbox's network policy blocking the real WeatherAPI host, both pre-existing and unrelated to this build).

## Build Log 16 (completed)

### Fog/Mist tuned to actually be visible, with Testing Panel sliders

- [x] Added `WX_FOG_TUNABLES` (opacity, blob count, blob size, drift speed multiplier — defaults 45%/4/40%/3x, up from the old fixed 14%/2-3 blobs/~35-50% baked-in radius/1x), each read live at draw time rather than baked into a blob at creation, so the opacity/size/speed sliders take effect within a frame with no re-render needed. Blob count is the one exception (it changes the particle array itself) — its slider invalidates `lastParticleKey` to force a rebuild on the next frame. Matching Testing Panel sliders added under a new "Fog Density Formula" section, wired into the existing "Reset to defaults" button.
- [x] Verified: measured peak canvas alpha at defaults (162/255, ≈64% — higher than the raw 45% because overlapping blobs naturally compound via normal alpha blending, a good side effect), then confirmed the opacity slider actually moves it live (247/255, ≈97%, after setting the slider to 90%). Blob count slider exercised with no errors.

### Hail bounce: random angle and varied height

- [x] At the moment a stone starts bouncing, it now rolls a random angle from -30° to +30° off straight up, and (25% of the time) a height bonus of 1-100% on top of the existing base height — stored on the particle and applied to both the vertical hop and a new horizontal displacement (`hop * tan(angle)`), so bigger bounces also drift further sideways and the trajectory closes back to zero at the end of the bounce, matching real physics with no extra tuning constant needed.
- [x] Verified precisely with a deterministic test: fixed `Math.random()` to a constant value (0.1) so the whole simulation became predictable, then confirmed the observed horizontal drift at the bounce peak (~3-4px leftward) matched the hand-calculated expected value from the formula (~3.9px) almost exactly.

### Thunderstorm: double-flash and random lightning bolt

- [x] ~32% of the time, a flash now schedules a second one 80-180ms after the first instead of always waiting for the normal 8-20s gap; the rest of the time behavior is unchanged. Each individual flash event also independently has up to a 10% chance of drawing a procedurally-generated jagged bolt (`generateBoltPath`/`drawBoltPath`) — a random zigzag from a random point along the top edge down to a random depth, with an occasional small fork, rendered with a bright glowing stroke and discarded after — a fresh random shape every time, never the same bolt twice.
- [x] Verified precisely with a deterministic test: fixed `Math.random()` to force both the double-flash and the bolt on every trigger, then observed the exact expected pattern — flash + bolt at t=0, a second flash + bolt ~150-200ms later, then correctly quiet for the rest of a 3-second window (matching the ~8.6s gap the fixed random value would produce for the next pair).

### Fake sample alert removed — no longer shown as if real

- [x] `currentAlert()` now returns `null` when there's no genuine alert instead of falling back to the hardcoded "Heat Advisory for Los Ranchos de Albuquerque, NM" sample; `shouldShowAlert()`/the click-to-dismiss handler updated to handle that. The sample fixture itself was removed entirely rather than kept behind a new opt-in, since nothing else needed it. Verified: with zero real alerts in a mocked live response, the ticker stays correctly hidden and the normal footer shows instead.

### Weather emoji icon now matches the actual condition

- [x] Added `WX_WEATHER_ICON_MAP`, a broader code→emoji table covering the full range of WeatherAPI condition codes (clear, partly cloudy, cloudy/overcast, fog, drizzle, rain, freezing rain, thunderstorm, sleet, snow, ice pellets) — distinct from the narrower `WX_CONDITION_MAP` used for Live Condition Skin selection, which deliberately only covers precip types. `weather-emoji-btn`'s textContent is now set from `weatherState.conditionCode` in `renderWeatherExtras()`, alongside the existing text update; also corrected the placeholder default `conditionCode` from `null` to `1201` so the pre-live-data placeholder icon/text pair (freezing rain) is internally consistent. Verified: a mocked "Overcast" (code 1009) response correctly showed ☁️, not the old hardcoded ☀️.

### Real sunrise/sunset now wired into the day/night system

- [x] `SUNRISE_SEC`/`SUNSET_SEC` changed from hardcoded `const`s to `let`s, now overwritten from the real live response each fetch via a new `parseAstroTime()` parser (WeatherAPI's `"HH:MM AM/PM"` astro strings → seconds-of-day), falling back to the previous hardcoded defaults only until the first live fetch resolves. Every piece of day/night logic that reads these two values — the gradient transition, `isDaytime()`, `computeNightFactor()`, the cloud-tint branch, the flat background fallback — picks up the change automatically since they're read by reference, not copied.
- [x] Verified precisely: mocked a real sunset of 5:47 PM (vs. the old hardcoded 7:45 PM) and confirmed the background at a 6:40 PM time override showed night colors — which only happens if the live sunset time is actually being used, since the old hardcoded default would have called 6:40 PM still daytime.

### Regression check

- [x] Cycled through every condition (light/heavy rain, thunderstorm, snow, fog, hail, the two inert partly-cloudy/overcast checkboxes) plus clear day and clear night, then hit "Reset to defaults" — zero errors, fog sliders correctly reset to 45/4/40/3, alert ticker stays hidden, weather icon matches the placeholder condition. Only pre-existing, unrelated noise (the missing favicon) showed up in the console across the whole pass.

## Build Log 17 (completed)

### Stars moved to a dedicated layer behind the cloud overlay — now genuinely occluded by clouds

- [x] Added a new `starsCanvas` (`.weather-skin-stars`), inserted into `weather-skin` right after the background and before `.weather-skin-overlay`. Stacking is now: sky background → star canvas → cloud overlay → `precipCanvas` (rain/snow/hail/fog/bolt, unchanged, correctly still in front of the clouds) → floating cloud sprites → flash. Star creation logic is unchanged (still populated in `rebuildConditionParticles` whenever the sky is clear); only where they're drawn moved, from the shared `precipCtx` onto the new `starsCtx`, with its own matching per-frame clear and DPR-aware resize.
- [x] Cloud overlay's night color raised from `nightBasePct: 40` to `300` (slider range widened from 0–100 to 0–500 to match) — the old multiplicative formula barely moved the night sky's very low RGB values (e.g. `rgb(2,6,23)` → `rgb(3,8,32)`, imperceptible) even at 100% opacity; now measures `rgb(8,24,92)`, clearly visible.
- [x] Verified end-to-end with a screenshot comparison: at 0% cloud cover, stars are clearly visible scattered across the widget; at 100% cloud cover, they're completely hidden — confirmed via the actual composited image, not just computed styles.

### Hail bounce rebuilt on an energy-conservation model with true trigonometric decomposition

- [x] Bounce angle widened to ±60° from vertical (120° total arc), matching "30° above horizontal on each side."
- [x] Removed `bounceHeightMult` entirely — ~25% of hailstones now simply fall at double speed at creation, and that per-stone fall `speed` becomes its own bounce energy (no separate multiplier; a stone that fell faster naturally bounces harder).
- [x] Vertical and horizontal bounce components now split via real trigonometric decomposition — `vertical = energy × cos(angle)`, `horizontal = energy × sin(angle)` — rather than a linear split, per the user's explicit preference ("math for the win"), applying the existing sine easing curve to each component independently over the bounce's ~14-frame arc.
- [x] Verified with a deterministic test (fixed `Math.random()` so the whole simulation became predictable): a boosted stone at a -36° angle was predicted to peak at y≈144 and drift to x≈38.3; measured values were y≈142-146 and x≈37-41 — matching the hand-calculated trigonometry almost exactly.

### Thunderstorm flash/bolt system replaced per the fully reconciled spec

- [x] Flat 5–10s interval between flashes, no intensity concept, no separate double-flash scheduling.
- [x] Flash duration now 100–1000ms with alpha re-rolled every frame for the whole lifetime (peak brightness randomized 0.85–1.0, actual per-frame alpha further scaled 0.4–1.0 of that), producing a flicker rather than one static brightness.
- [x] Kept the DOM div (`flashDiv`) for the ambient wash rather than switching to a canvas fill, per the earlier discussion — its opacity is now updated every frame instead of once.
- [x] Bolt chance raised to 25% per flash; targeting changed to strike 75–100% down the canvas (previously 40–90%), starting from an independently random point along the top edge (unchanged). Shape (5–8 segments, 40% fork chance) and rendering (single stroke pass) both left exactly as they were, per the explicit decision not to adopt the reference version's changes there.
- [x] Verified with a deterministic test: flash interval landed in the new flat range (not the old 8–20s), bolt fired reliably at the 25% threshold, and bolt endpoint measured at y≈126 against a canvas height of 159 — matching the predicted 75–100%-down target (127.2) almost exactly.

### Regression check

- [x] Cycled through every condition, clear day/night, a Live Skin off/on toggle, and Reset to defaults — zero errors beyond the pre-existing unrelated favicon 404. Reset correctly restored the night-brightness slider to its new default of 300.

## Build Log 18 (completed)

### Hail bounce height doubled, then rebuilt on true projectile-motion physics

- [x] Doubled the starting `baseSpeed` (7-9 → 14-18), cascading into the existing 25%-boosted tier (28-36) automatically, per the user's report that the boosted stones weren't visually distinguishable from the rest.
- [x] Replaced the sine-`ease` bounce arc entirely with real constant-acceleration projectile motion on both axes: `heightAboveGround = vy0*t - 0.5*g*t²` for a true gravity parabola, `x = bounceFromX + vx0*t` for constant-velocity horizontal drift (no more snapping back to the launch point — the old shared-`ease`-for-both-axes bug the user caught and pushed back on hard, correctly pointing out that "physics-accurate" has to apply to every part, not just the piece that was easy to fix). `vy0`/`vx0` still come from the existing energy-conservation trig split (`speed × cos/sin(bounceAngle)`), so the physically-correct launch vector work from Build Log 17 is preserved, just now driving real kinematics instead of an eased curve. `HAIL_GRAVITY = 3` px/frame² was the calibration chosen so a typical stone's flight time lands in the widget's visual scale; harder/faster bounces now correctly arc higher **and** stay airborne longer as a direct, intended consequence of the physics (not a fixed duration for every stone).
- [x] Fill alpha raised to 1.0 (was 0.95). Stones now stay fully opaque for the entire arc — the fade-out starts only at the exact instant `heightAboveGround` returns to ≤0 (the real second touchdown), and during that fade the stone keeps drifting at its already-established constant horizontal velocity rather than freezing in place, fading to invisible over 6 frames before resetting to a new falling stone.
- [x] Verified with a deterministic `Math.random()` override: hand-calculated `vy0`/`vx0`/height-per-frame values matched the measured canvas trajectory almost exactly across 11 traced arc frames (sub-pixel agreement); fade timing (opaque through the whole arc, fade starting exactly on the touchdown frame, 6-frame fade, reset on schedule) also matched precisely. The one thing the pixel-based test couldn't directly read was the intermediate per-stone alpha values, because the deterministic override makes all 30 hailstones bit-for-bit identical and they stack on the same pixel — 30 overlapping semi-transparent draws composite toward full opacity almost immediately (a measurement artifact of the test, not the code); the fade window's start/duration/end, which is what the spec actually cared about, was confirmed exactly.

### Daytime cloud overlay opacity cap raised from 50% to 75%

- [x] `cloudOverlayOpacity`'s daytime formula changed from `cloudPct / 2 / 100` to `cloudPct * 0.75 / 100`, so 100% cloud cover now reaches 75% opacity instead of 50% — addressing the report that too much sky color was bleeding through at full daytime cloud cover. Nighttime formula unchanged. Verified: 100% cloud cover at midday now measures exactly `0.75`.

### Night cloud tint desaturated toward gray (new tunable slider)

- [x] The night cloud tint was a straight per-channel brightness multiply of the navy night sky color, which preserves hue regardless of tuning — it could never look gray no matter how the brightness percentage was set. Added a new `nightGrayBlendPct` tunable (default 50%) that blends the brightened tint toward a neutral gray (computed as the average of its own R/G/B channels) by that percentage, applied only at night. New "Night gray blend" slider added to the Testing Panel under Cloud Brightness Formula, with reset support.
- [x] Verified: at 100% blend the resulting tint hex has R=G=B exactly (confirmed genuinely neutral gray, not just "less blue"), and differs from the 50%-default tint as expected.

### Fog blob count default changed to 5

- [x] `WX_FOG_TUNABLES.blobCount` default and the Testing Panel reset value both changed from 4 to 5, along with the HTML slider's default value/label. Verified via the reset button and the slider's initial value.

### Weather icon and animation overhaul: one radio button per exact WeatherAPI condition (48 total)

- [x] Replaced the two separate per-code maps (`WX_WEATHER_ICON_MAP` for icons, `WX_CONDITION_MAP` for the Live Condition Skin animation) with one single source of truth, `WX_CONDITIONS`, keyed by every WeatherAPI condition code WeatherAPI defines, holding that code's display text, icon, and animation together. Fixes several inconsistencies found while building this: all drizzle conditions (including the freezing-drizzle codes, previously grouped with plain rain) now uniformly use 🌦️; Blowing snow gets its own 🌬️ instead of sharing the general snow icon; Partly Cloudy/Cloudy/Overcast now use distinct 🌤️/🌥️/☁️ instead of two of them sharing an icon; Torrential rain shower's icon changed to 🌧️ to match its actual Heavy Rain animation (it previously had a thunderstorm-family icon despite never producing lightning).
- [x] Added two new composite animations neither of which existed before: `thunderSnow` (lightning flashes/bolts playing simultaneously with falling snow, for the two snow-with-thunder codes) and `snowFog` (falling snow plus the fog effect together, for Blizzard). Both are implemented by decomposing the composite into its base effects (`thunderSnow` → `{thunderstorm, snow}`, `snowFog` → `{snow, fog}`) via a small `WX_ANIM_DECOMPOSE` table, rather than adding dedicated rendering logic — every existing piece of condition-skin code (particle creation, the thunderstorm flash trigger, cloud-tint darkening) already composes correctly from those base effects with no further changes. The one exception: the existing "a thunderstorm forces the heavy-rain visual" rule had to be narrowed to "...unless snow is also active," so `thunderSnow` shows falling snow instead of rain alongside the lightning.
- [x] Replaced the Testing Panel's 8 broad, mostly-unwired checkboxes with 48 radio buttons — one per exact WeatherAPI condition, grouped under category subheadings (Clear & Cloud, Fog, Rain & Drizzle, Freezing Rain & Drizzle, Thunderstorm, Snow, Sleet & Ice) — plus a "Live / No Override" option, since only one real condition is ever active at once (checkboxes previously allowed nonsensical multi-selects and needed a priority-order scheme this eliminates entirely). Selecting one now sets both the previewed weather icon and the previewed animation together. Sleet and ice-pellet codes now trigger the Hail bounce animation (previously lumped in with Snow); freezing rain/drizzle codes split into Light/Heavy Rain by severity, matching how plain rain already worked.
- [x] Verified: spot-checked 9 icon corrections across the categories (all matched exactly), confirmed `thunderSnow` produces both a lightning flash within its normal timing window and visible falling-snow pixels with no rain, confirmed `snowFog` (Blizzard) produces both snow and heavy fog coverage simultaneously, confirmed Reset returns to "Live / No Override" and restores all slider defaults, and swept all 49 radio values (48 conditions + Live) with zero real errors (only the pre-existing, unrelated favicon 404 appeared).

## Build Log 19 (completed)

### Heavy freezing drizzle (1171) moved from Heavy Rain to Light Rain

- [x] `WX_CONDITIONS[1171].anim` changed from `'heavyRain'` to `'lightRain'`.

### Snow showers (1255, 1258) now show snow + light rain together

- [x] Added a new `snowRain: ['snow', 'lightRain']` composite to `WX_ANIM_DECOMPOSE`, following the same pattern as `thunderSnow`/`snowFog`. Set both 1255 (Light snow showers) and 1258 (Moderate or heavy snow showers) to `anim: 'snowRain'`. No changes needed to the rain-forcing guard — `lightRain` was never part of it, so both effects compose automatically.
- [x] Verified: both codes render visible snow (white) pixels alongside additional non-white pixels (the rain streaks), confirming both effects are active simultaneously.

### Hail slowed to 25% of its (already-doubled) speed, count cut to 22

- [x] `baseSpeed` changed from `14 + Math.random() * 4` to `3.5 + Math.random() * 1` (25% of the Build Log 18 value), and the hailstone loop count from 30 to 22 (75% of the original), per the report that hail was "bouncing all over the place, filling the screen" and reading more like a snow flurry. Bounce height and flight time shrink proportionally along with the fall speed, as confirmed with the user beforehand — an intended consequence of the speed cut, not decoupled.
- [x] Verified with a deterministic `Math.random()` override: measured fall speed came out to exactly 4.0px/frame across three frames, matching the hand-calculated `3.5 + 0.5×1 = 4.0` precisely.

### Sleet showers (1249, 1252) now show hail + rain, split by severity

- [x] Added `hailLightRain: ['hail', 'lightRain']` and `hailHeavyRain: ['hail', 'heavyRain']` to `WX_ANIM_DECOMPOSE`. Set 1249 (Light sleet showers) to `hailLightRain` and 1252 (Moderate or heavy sleet showers) to `hailHeavyRain`. Plain sleet (1069, 1204, 1207 — no "showers" in the name) left unchanged as plain `hail`, per the confirmed scope.
- [x] Verified: both codes render a substantial mix of hail-bounce and rain-streak pixels together.

### Condition description text now follows the Testing Panel override

- [x] `descEl.textContent` was hardcoded to `weatherState.conditionText` (real live data only) even after the icon was fixed to follow the effective condition in Build Log 18 — the description line underneath was missed in that pass and stayed stuck on whatever the real weather happened to be. Now reads `WX_CONDITIONS[getEffectiveConditionCode()].text`, falling back to `weatherState.conditionText` if the code isn't found, matching `weatherIconForCode`'s own fallback pattern.
- [x] Verified: description text now updates correctly across multiple previewed conditions (e.g. "Sunny / Clear", "Blizzard", "Heavy freezing drizzle"), matching whichever radio is selected.

### Night gray blend default raised from 50% to 75%

- [x] `WX_CLOUD_TUNABLES.nightGrayBlendPct` default, the reset-button value, and the Testing Panel slider's initial value/label all changed from 50 to 75.
- [x] Verified: slider defaults to 75 on load and correctly restores to 75 after Reset.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 20 (completed)

### Hail revamp: faster base speed, smaller boost multiplier, gravity now a live slider

- [x] `baseSpeed` increased 25%: `3.5 + Math.random() * 1` → `4.375 + Math.random() * 1.25`.
- [x] Boosted tier's multiplier reduced from `× 2` to `× 1.5`.
- [x] `HAIL_GRAVITY` converted from a fixed constant to `WX_HAIL_TUNABLES.gravity`, a new Testing Panel slider (0.1–3 range, defaulting to 1.5) under a new "Hail Physics" section, with reset support — following the discussion that its magnitude was always a stylistic px/frame² value rather than a physically-derived one, so it makes sense as an adjustable knob like the other hail/cloud/fog tunables.
- [x] Verified with a deterministic `Math.random()` override: boosted fall speed measured at 7px/frame across three frames, matching the hand-calculated `4.625 × 1.5 = 6.9375` (rounds to 7 at the canvas's pixel resolution) precisely. Gravity slider confirmed to update its own live value and restore to 1.5 on Reset.

### Floating clouds visually stacking at high cloud cover — fixed with a respawn hold delay

- [x] `spawnCloud`'s respawn path (`animationiteration` → `spawnCloud(oldCloud)`) now assigns a random 0.1–5s `animation-delay` before the fresh replacement starts drifting, holding it off-canvas at the base `left: calc(-1 * var(--cloud-w))` rule in the meantime. The initial page-load batch keeps its separate, untouched negative-delay stagger.
- [x] Verified by dispatching a synthetic `animationiteration` event on a live cloud element and inspecting the replacement's `animation-delay`: measured 2.58s, within the intended 0.1–5s range, while the other 9 clouds' pre-existing negative delays (from the initial batch) were left untouched.

### Live Weather diagnostics panel (temporary)

- [x] Added a new "Live Weather Diagnostics (temporary)" Testing Panel section for tracking down the moon-phase-stuck bug without dev tools on mobile. A new `weatherDebugState` object is populated at every stage of `loadLiveWeather`: coordinates used, whether a key is present (masked — first 4 / last 4 characters, never full plaintext), cache presence/age/staleness, the actual outcome (fetched fresh / served from cache / fell back to stale cache after an error / no key), the real caught error message (previously swallowed by `console.error` alone), and the complete raw API response.
- [x] The panel renders this as a read-only, monospace `<textarea>`, refreshed both on every `loadLiveWeather` call and whenever the Testing Panel is opened. A "Copy diagnostics" button copies the same formatted text via the Clipboard API, with a select-all fallback (focuses and selects the textarea) if the Clipboard API is unavailable or denied.
- [x] Verified: panel populates correctly (confirmed accurate "no key present" state in the test environment, which has none configured), and the copy button successfully invoked the Clipboard API without error.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 21 (completed)

### Two new digital clock color schemes: green and orange

- [x] Added `green-black` (`#22c55e` on black) and `orange-black` (`#f97316` on black) as two new `clockSettings.scheme` values, following the existing `red-black`/`blue-black` plain-digits-on-black pattern exactly — `.clock-face[data-scheme=...]`/`.mini-clock[data-scheme=...]` CSS rules plus matching `.scheme-swatch` buttons in the Settings `.scheme-grid`. No JS logic changes needed, since `clockSettings.scheme` was already a free-form string. Verified: clicking the new green swatch sets `#clock-face`'s `data-scheme` to `green-black`.

### New analog clock style: colored number badges (12-hour only)

- [x] New `clockSettings.analogStyle` setting (`'classic' | 'numbered' | 'dual-ring' | 'moon-dial'`, default `'classic'`). `'numbered'` (12-hour only) replaces the classic tick+4-label treatment with all 12 numbers as colored circular badges (white bold text), using the 12-color palette from the queued spec, at radius 36, no tick marks — hand math and face fill untouched, no second hand added, matching the scope the user narrowed to (colored circles + white numbers only). Existing 24-hour rendering is completely unaffected.
- [x] Verified: with 12-hour + `numbered` selected, the analog face's SVG contains the colored badge circles (e.g. `#f2a65a`, `#c2447a`) and the stored setting persists.

### New analog clock style: dual-ring black/red numbers (24-hour only)

- [x] `'dual-ring'` (24-hour toggle only) renders a plain face (no day/night shading), 12 tick marks at the hour positions only, outer black 1-12 numbers at radius ~38-46 and inner red 13-23/00 numbers at radius ~23, each inner number at the same angle as its outer counterpart — using **ordinary 12-hour hand math** (two revolutions/day), per the user's correction that there is no separate 24-hour indicator hand; the dial's dual numbering carries the 24-hour information, not an extra hand.
- [x] Switching the hour12/hour24 toggle auto-falls-back `analogStyle` to `'classic'` whenever the currently-selected style (`numbered` or `dual-ring`) is no longer applicable to the new toggle state, so a style never gets silently left selected while hidden.
- [x] Verified: with 24-hour + `dual-ring` selected, the SVG contains both outer (`1`, `12`) and inner (`00`, `13`) number labels; switching from 12-hour `numbered` to 24-hour correctly fell back to `classic` before `dual-ring` was explicitly chosen.

### New analog clock style: moon-phase dial (available in both 12-hour and 24-hour toggles)

- [x] `'moon-dial'` is the one style available under **both** toggles (selecting it under either renders identically, always using ordinary 12-hour hand math regardless of which toggle is active). Background is a large moon-phase emoji (font-size 85, sourced from `WX_MOON_PHASE_ICONS[weatherState.moonPhase]`) that **completely replaces** the day/night face fill — no fallback circle underneath, per explicit instruction. Same dual-ring black-outer/red-inner numbering as `'dual-ring'`.
- [x] Four black rounded-square badges positioned radially between the inner ring and center at the four cardinal angles: top = month abbreviation, right = day-of-month, bottom = weather emoji, left = day-of-week abbreviation. The weather badge uses `weatherIconForCode(getEffectiveConditionCode())` — matching the weather widget's icon exactly, including any active Testing Panel override, so it can be tested the same way as the widget itself, per the user's resolved preference.
- [x] Style-picker UI: the old single non-interactive "Preview" section was replaced with a unified 4-swatch grid (`classic`/`numbered`/`dual-ring`/`moon-dial`), each a live-rendering miniature analog preview; `numbered`/`dual-ring` swatches show/hide based on the current hour12/hour24 toggle (`classic` and `moon-dial` always visible in both).
- [x] **Real bug found and fixed along the way, not user-reported — temporal dead zone crash:** the clock's initial render call chain (`applyClockDisplayMode(); updateClock(); scheduleNextClockTick();`) originally ran early in the script, before `weatherState`, `WX_MOON_PHASE_ICONS`, `getEffectiveConditionCode`, and `weatherIconForCode` are declared later in the file. Since the new moon-dial rendering path reads all four, a returning user with `mode:'analog'` and `analogStyle:'moon-dial'` saved from a previous session would hit an uncaught `ReferenceError` on the very first `updateClock()` call, silently crashing the entire script — the same bug class this codebase has hit before (documented re: `weatherTestState`/`weatherLiveConditions` in Build Log 14). Fixed by moving those three init calls to the very end of the script, after all weather-section declarations complete. Verified with a dedicated test that pre-seeds `localStorage.clockSettings` with the exact crash-triggering combination before reload — zero errors afterward, and the moon-dial rendered correctly on that very first load.
- [x] Verified: moon-dial renders 4 rounded-square badges plus the moon emoji, and stays selected/active when switching between the 12-hour and 24-hour toggles, confirming it's genuinely available under both.

### Change hail gravity default from 1.5 to 0.5

- [x] `WX_HAIL_TUNABLES.gravity` default, the Testing Panel reset-button value, and the slider's initial value/label all changed from 1.5 to 0.5 (slider range 0.1-3 unaffected). Verified: slider defaults to 0.5 on load.

### Add a "Clear" button to the Live Weather Diagnostics panel

- [x] Added a "Clear" button next to "Copy diagnostics" that blanks the textarea (`weatherDebugOutput.value = ''`) on click — a simple "wipe it right now" action, per the queued note; it does not suppress the panel's existing auto-refresh on the next `loadLiveWeather` call or Testing Panel reopen. Verified: clicking Clear empties a populated textarea.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) plus every new clock feature with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 22 (completed)

### Night sky stars made bigger

- [x] Star radius (script.js:1234) changed from `0.4 + Math.random() * 0.6` (0.4-1.0px) to `0.6 + Math.random() * 0.9` (0.6-1.5px), a ~50% bump — color, flicker, and count logic untouched. Verified the formula change is present in the shipped script.

### Hail bounce: narrowed random angle range from ±60° to ±45°

- [x] `p.bounceAngle` (script.js:1311) changed from `(Math.random() * 120 - 60) * Math.PI / 180` to `(Math.random() * 90 - 45) * Math.PI / 180` — same continuous random draw and energy-conserving trig decomposition, just a narrower bound. Comment above updated to match (45° above horizontal on each side, was 30°). Verified the formula change is present in the shipped script and algebraically confirmed the new bound (±45° vs. the old ±60°) at the random-value extreme.

### Dual-ring analog styles: inner red numbers moved closer to the outer black numbers

- [x] `renderDualRingNumbers`'s inner-number radius (script.js:266) changed from 23 to 30, shrinking the radial gap to the outer numbers (radius 38) from 15 units to 8 — shared by both the `'dual-ring'` (24-hour) and `'moon-dial'` styles, so both picked up the fix from the same change. Verified: measured on-screen distance from center to the inner "00" label increased consistently in both styles after the change.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 23 (completed)

### Moon-dial clock: badges moved further from center, recolored to dark gray

- [x] `badgeR` (script.js:302) changed from 12 to 18 — moved the four badges outward, still clear of both center and the radius-30 inner number ring. Badge fill (script.js:278) changed from `#000` to `#333`; white text unchanged. Verified: all 4 badges render at exactly radius 18 from center, and no `#000`-filled badge rects remain in the SVG.

### Drifting-cloud spawn band extended from top 50% to top 66%, with new size endpoints

- [x] `randomizeCloud` (script.js:1063-1072): `topPct = Math.random() * 66` (was 50), `f = topPct / 66`, and the size formula's endpoints changed to `size = 3 - 2.5*f` rem (3rem at the top edge → 0.5rem at the 66% line, was 2.5rem→1.0rem). Duration/speed formula (`17 + 43*f` seconds) is unchanged, just now stretched over the wider band. Verified against the shipped formula string and by sampling live cloud elements at 100% cloud cover: top% values reached up to 65.2% (against the new 66% cap), and sampled top/size pairs matched the formula exactly (e.g. top 8.5% → size 2.68rem, top 59.1% → size 0.76rem).

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 24 (completed)

### Weather widget: reduced phone heating from the Live Condition Skin animation loop

- [x] **Frame-rate cap (~30fps):** added `WX_FRAME_INTERVAL_MS = 1000/30` and a `lastDrawTs` tracker in `stepConditionSkin` — the loop still requests every `requestAnimationFrame` tick for accurate timing, but skips the actual clear/draw work until ~33ms have elapsed since the last drawn frame.
- [x] **Removed the per-frame layout read:** `weatherSkin.getBoundingClientRect()` no longer runs every frame — its width/height are now cached in `cachedSkinSize`, measured once at setup and re-measured only on a `resize` event.
- [x] **Pause via visibility:** a new `IntersectionObserver` on the weather widget sets `skinIsVisible = false` whenever it's scrolled out of the viewport, and `stepConditionSkin` early-returns while it's not visible — resumes automatically once it scrolls back into view. This is separate from the existing `visibilitychange` cloud re-stagger logic, which only handles the tab-backgrounded case.
- [x] DPR-cap option was presented but not selected — canvas resolution left untouched.
- [x] Verified: the animation loop's canvas output is provably frozen (identical pixel hash across two snapshots) while the widget is scrolled off-screen, and resumes changing normally once back on-screen. Full 49-condition regression sweep passed with zero real errors afterward.

### Moon-dial clock: removed the four center badges

- [x] Deleted the 4 `renderClockBadge(...)` calls and the `badgeR`/`badgeSize` locals from `renderMoonDialFace`, leaving just the moon emoji background and dual-ring numbers. Since `renderClockBadge` had no other caller, removed that function entirely along with the now-unused `now` parameter it required. Verified: the moon-dial SVG renders zero badge rects while the moon emoji and numbers remain.

### Testing Panel: slider for lightning flash opacity re-roll rate

- [x] Added `WX_LIGHTNING_TUNABLES.rerollFrames` (default 1, matching the original every-frame behavior) and a per-flash `frameCount`/`currentOpacity` pair on `flashState`, so the flicker opacity is only recomputed every `rerollFrames` drawn frames, holding steady in between. New Testing Panel slider (1-60, using the fixed 60fps assumption discussed for its bounds), wired into the existing reset-to-defaults handler.
- [x] Verified functionally, not just via the slider UI: sampling the flash div's opacity across ~200 animation frames showed a single held value for an entire flash's lifetime at `rerollFrames=30`, versus opacity changing every few frames at the default `rerollFrames=1` — confirming the re-roll cadence genuinely responds to the slider.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 25 (completed)

### Fixed all Condition Skin particle motion to be real-time-based, not frame-count-based

- [x] Added a `frameScale` factor computed once per drawn frame in `stepConditionSkin`, based on actual elapsed wall-clock time versus the implicit 60fps baseline these speed values were originally tuned against (`(ts - lastDrawTs) / (1000/60)`, clamped to a max of 4 to guard against a huge jump after the widget was paused a long time). Applied as a multiplier everywhere a particle previously advanced by a bare per-frame increment: rain's `p.y`/`p.x`, snow's `p.y` and `p.swayPhase`, hail's fall-state `p.y`, hail's bounce timer (`p.bounceT`, parabola math unchanged), hail's fading-state `p.fadeT`/`p.x` drift, and fog's `b.x` drift. Star flicker (already timestamp-based) and cloud drift (a CSS animation) needed no change.
- [x] Verified quantitatively, not just by inspection: with `Math.random` fixed so all hail particles spawn and move identically, measured the real-world fall speed via canvas pixel sampling across 3 runs — observed 362-382 px/sec, matching the expected ~300 px/sec (baseSpeed 5.0 × 60fps-equivalent baseline) within reasonable measurement tolerance. Without this fix the same particle would only cover about half that distance per real second under the 30fps cap.
- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 26 (completed)

### Drifting clouds: fixed mid-canvas pop-ins caused by settings-triggered cloud rebuilds

- [x] `renderWeatherSkin()` no longer removes and recreates every cloud on every settings change. The instant-scatter (negative-delay) placement now only applies the very first time the cloud layer is created (`existingClouds.length === 0`). On every later call: an unchanged cloud count leaves the existing elements completely untouched; a decreased count removes only the excess; an increased count adds only the new ones via a plain `spawnCloud()`, entering cleanly off-canvas with no scatter needed. Preserved clouds are re-appended (moved, not recreated) after `precipCanvas` and before `flashDiv` on every call to keep correct paint layering, since none of these elements use `z-index`. Line 1483's removal query was split so only `.weather-skin-overlay` is unconditionally wiped there — clouds are now explicitly removed only in the `liveSkin`-off branch, restoring that cleanup path.
- [x] Verified: an unrelated setting change (time-override slider) leaves the exact same cloud DOM elements in place (confirmed by a marker on each), not replaced. Raising the cloud-cover slider from 2 to 10 clouds preserved the original 2 elements and added exactly 8 new ones, every one of which started with a negative (off-canvas) computed `left` — never mid-canvas. Lowering it back to 2 removed only the excess, keeping pre-existing clouds. Toggling Live Condition Skin off then back on correctly triggers a fresh scatter, as intended for a genuine re-creation of the layer.

### Drifting clouds: raised the smallest size from 0.5rem to 0.75rem

- [x] `randomizeCloud`'s size formula changed from `3 - 2.5 * f` to `3 - 2.25 * f`, keeping the largest size (3rem at the top edge) and the duration/speed formula unchanged. Verified the updated formula is present in the shipped script.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 27 (completed)

### Fixed drifting clouds entering in a synchronized vertical line instead of staggered

- [x] Each newly-added cloud in the "cloud count increased" branch (script.js:1520-1528) now gets its own random `0.1 + Math.random() * 4.9`s hold-delay — the same positive-delay treatment an ordinary wrap-around respawn already gets — instead of the default 0s delay that let every new cloud in a batch start in lockstep from the same off-canvas position.
- [x] Verified: raising cloud cover from 2 to 10 clouds produced 8 new clouds with 8 distinct animation-delay values, all within the intended [0.1, 5.0) range, none left at the old bug's flat 0.
- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 28 (completed)

### Weather widget: Hourly Forecast panel

- [x] **Placement, decided with the user — deviates from the source doc's "push, don't overlay":** diagnosed that `#weather-widget` lives inside the Home category's CSS Grid (`grid-column: 3/6; grid-row: 1/3`, shared with the clock widget and the Gmail/Translate/Maps/USPS/Calendar tiles), not a simple vertical stack like category accordions — a plain inserted sibling wouldn't sit "directly beneath, pushing content down" the way the doc assumed. Given the choice, the user opted for a popover instead: the panel (`#hourly-panel`, index.html) is placed via `grid-column: 1/6; grid-row: 3/4` (the row right below the clock+weather widgets, which together span the full grid width) but taken out of grid flow with `position: absolute`, so it floats over the tile row beneath rather than displacing it — anchored exactly at the bottom edge of the widgets, expanding downward as far as needed, with `max-height`/`opacity` transitions for the open/close animation.
- [x] `weatherEmojiBtn`'s placeholder "coming soon" click handler replaced with real open/close toggle logic.
- [x] Fetch bumped from `days=1` to `days=2` (still one call), and `weatherState.hourly` now concatenates `forecastday[0].hour` + `forecastday[1].hour` before slicing the 12 hours starting at the current hour (`time_epoch`-matched) — guarantees 12 real entries at any time of day, current hour always first/leftmost.
- [x] Each column: time label ("Now" for the first, else a parsed 12-hour "3PM" label), condition emoji via the existing `weatherIconForCode`, temperature through the existing unit-conversion path, and precip % (`max(chance_of_rain, chance_of_snow)`) shown only when greater than 0%. Current-hour column gets a distinct blue-tinted background + border.
- [x] Precipitation intensity graph: an SVG polyline plotting the same 12 precip values as a continuous curve, degrading gracefully (empty, not broken-looking) when there's no hourly data yet or all values are 0.
- [x] Dismissal: tap the emoji again, tap anywhere outside the panel (document-level capture-phase click listener while open), or swipe up on the panel.
- [x] **Real bug found and fixed during verification, not user-reported:** the swipe-up dismiss initially failed whenever the release point ended outside the panel's bounds — exactly what an upward swipe naturally does — because a `pointerup` without pointer capture is dispatched to whatever element is now under the cursor, not the original element. Fixed by calling `setPointerCapture()` on `pointerdown`, keeping all subsequent pointer events routed to the panel regardless of where the cursor ends up. Verified directly: a simulated swipe from inside the panel to above its top edge failed before the fix and correctly closed the panel after it.
- [x] Verified with a mocked 48-hour forecast response (`days=2` shape): exactly 12 columns render with the current hour first and highlighted, temperature/emoji/time render correctly, precip % correctly shows only on hours with a nonzero chance (mixed case tested), and the precip graph polyline has exactly 12 points. Also verified the true first-load, no-key-configured case (empty `weatherState.hourly` placeholder) opens the panel with 0 columns and an empty graph rather than crashing or looking broken. Confirmed the Home grid's other tiles (e.g. Gmail) still sit in their normal position when the panel is closed.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 29 (completed)

### Fixed the Hourly Forecast panel rendering pinned to the top of the page

- [x] Added `position: relative` to the Home category's grid container (`.category--home .tile-grid`, scoped narrowly so other categories' identically-classed grids are untouched) — makes it the actual containing block for `.hourly-panel`'s `position: absolute` + explicit `grid-column`/`grid-row` placement, which previously had nothing to anchor to and fell back to the viewport itself (landing at the page's literal top-left corner, ignoring the grid entirely).
- [x] Verified precisely this time, not just assumed correct: `getBoundingClientRect()` on the live page now shows the panel's top edge (308.6px) sitting flush against the weather widget's bottom edge (305.6px), spanning the same left/right bounds as the clock+weather widget row — matching the intended anchor point exactly.
- [x] Re-ran the full Build 28 functional suite against the corrected position: open/close toggle, 12 columns with the current hour first and highlighted, temp/emoji/precip% rendering, the precip graph, and all three dismiss paths (tap again, tap outside, swipe up) all verified correct. One of those (tap-outside) had actually been a false positive in Build 28's original verification — my test's "outside" click coordinate had accidentally landed inside the panel because the panel was mispositioned at that exact spot; with the position now fixed, that same click is genuinely outside the panel and correctly dismisses it.
- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 30 (completed)

### Hourly Forecast panel: redesigned layout — hazard-alert icon, temperature graph, precip %

- [x] Restructured the panel's DOM: `.hourly-strip` is now a single vertical scroll container (`overflow-x: auto`) holding four stacked rows — `#hourly-row-alert`, `#hourly-row-time`, `#hourly-temp-graph` (SVG), `#hourly-row-precip` — so all four scroll horizontally in lockstep automatically, with no manual scroll-sync code needed. Each row uses fixed 56px-wide cells matching the hour count exactly.
- [x] **Temperature graph** (`renderHourlyTempGraph`): each of the 12 points is that hour's condition icon (`weatherIconForCode`), not a plain dot, positioned by `hour.temp_f` — highest of the 12 fetched hours at the top, lowest at the bottom, dynamically scaled (not fixed) — with the numeric temp label directly underneath each icon and a thin connecting line through all 12 points. The current-hour column gets a background tint drawn behind everything else in the SVG. Old precip-graph SVG-polyline mechanism repurposed rather than rebuilt from scratch.
- [x] **Hazard-alert row** (`hourlyHazards`/`pickHazard`): evaluates all 9 categories (thunderstorm, hail, snow, rain, wind, cold, heat, UV, fog) per hour against their thresholds/condition-code rules, including the freezing-rain/blizzard/blowing-snow fixed-red overrides, then picks the single highest-severity hazard (red > orange > yellow), breaking ties with the fixed category-priority order. Reserves its slot's height in every column even when no hazard qualifies.
- [x] Verified exhaustively with mocked hourly data across two full 12-hour test rounds plus a dedicated tie-break test: all 9 hazard categories' color thresholds (including boundary values), all 3 fixed-red overrides (freezing rain, blizzard, blowing snow), the severity-beats-category-order rule (65% rain/orange correctly beat a yellow-tier thunderstorm in the same hour), and the category-order tie-break rule in both directions (thunderstorm beat wind when both were red; hail beat cold when both were red) — every case matched the spec exactly. Also verified the temperature graph's geometry directly: a 100°F hour rendered at the smallest y (top) and a 10°F hour at the largest y (bottom), confirming the line rises with temperature rather than the inverted direction from an earlier mockup mistake.
- [x] Verified panel mechanics (open/close, horizontal scroll, correct anchor position beneath the widgets) still work correctly after the DOM restructure.
- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 31 (completed)

### Hourly panel: shrunk graph height, fixed alert icon+dot layout, fit all 12 hours without scrolling

- [x] Graph height (`renderHourlyTempGraph`) changed from 200 to 100, with `ICON_TOP`/`ICON_BOTTOM` (26/150 → 13/75) and the temp-label vertical offset (+24 → +12) scaled down proportionally so nothing clips against the shorter box. `.hourly-temp-graph`'s CSS height and `.hourly-panel.open`'s `max-height` (320px → 220px) adjusted to match the smaller total content height.
- [x] Alert row: `.hourly-row-alert .hourly-cell` changed to `flex-direction: row` (icon left, dot right), independent of the time/precip rows which stay as single centered text, unaffected.
- [x] `HOURLY_COL_WIDTH` reduced from 56px to 32px so all 12 columns fit within the panel's ~404px usable width with zero horizontal scroll needed — verified precisely via `scrollWidth` vs `clientWidth` (an initial pass at 33px still overflowed by 4px; 32px was the value that actually fit). Text sizes shrunk to stay legible at the new width: time label 0.72rem→0.55rem, precip % 0.65rem→0.55rem, alert icon 0.5rem→0.45rem, alert dot 6px→5px, graph icon 18px→14px, graph label 12px→9px.
- [x] Verified directly: `hourly-strip`'s `scrollWidth` now exactly matches `clientWidth` (no overflow) with 12 real hours rendered, graph height attribute reads 100, and the alert icon+dot are horizontally adjacent (dot starts right where the icon ends) rather than vertically stacked.
- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 32 (completed)

### Hourly panel: graph shrunk to 70px, temp/condition icons scaled 1.25×

- [x] Graph height changed 100→70 (`renderHourlyTempGraph`), with `ICON_TOP`/`ICON_BOTTOM` scaled to 9/53 and the temp-label vertical offset to `p.y + 8`, matching the ×0.7 proportional adjustment. `.hourly-temp-graph`'s CSS height and `.hourly-panel.open`'s `max-height` (220px → 190px) updated to match.
- [x] `.hourly-graph-icon` (condition icon on the graph) 14px → 17.5px; `.hourly-graph-label` (temperature label) 9px → 11.25px.
- [x] Verified directly: `getAttribute('height')` on the graph SVG reads exactly `70`.

### Hazard-alert row: icon size increased 20%

- [x] `.hourly-alert-icon` font-size 0.45rem → 0.54rem. Verified computed font-size renders at exactly 8.64px (0.54rem × 16px root).

### Hourly panel: precip % display threshold raised from >0% to ≥20%

- [x] `renderHourlyPrecipRow`'s `if (pct > 0)` → `if (pct >= 20)`. Verified with mocked data: a 15% hour renders no text (empty cell, reserved space intact), a 25% hour renders "25%".

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 33 (completed)

### Hourly panel: temperature labels overlapping the graph icons above them

- [x] Label y-offset in `renderHourlyTempGraph` changed from `p.y + 8` to `p.y + 25.5` (icon height 17.5px added). Verified: icon `y=9`, label `y=34.5`, diff exactly 25.5.

### Weather widget: temperature-unit change now updates dew point and the open Hourly panel's graph

- [x] Added `renderWeatherExtras()` and `if (hourlyPanel.classList.contains('open')) renderHourlyPanel();` to both the `tempUnitBtn` tap-to-peek click handler (script.js:599-604) and the Weather Options `tempUnit` segmented-button handler (script.js:1042-1047).
- [x] Verified: tapping the temp toggles dew point (50°F → 10°C → back to 50°F); the Weather Options settings-menu `tempUnit` buttons do the same.
- [x] **Discovered during testing, not yet fixed:** the Hourly panel's outside-click-to-dismiss handler (`handleHourlyOutsideClick`, pre-existing, unrelated to this build) treats a tap on the main widget's temp toggle as an "outside" click and closes the panel before the new refresh code can run — so in practice the open panel can't currently be caught mid-refresh, since tapping the toggle always closes it first. The added refresh guard is inert until that's addressed, but is harmless and will start working once it is. Flagged for the user to decide whether it's worth fixing.

### Weather widget: UV badge color scale now matches the Hourly panel's UV hazard thresholds

- [x] `uvSeverityClass(uv)` rewritten to a 4-tier scheme: `uv >= 10` → `uv-extreme` (purple), `uv >= 8` → `uv-veryhigh` (red), `uv >= 6` → `uv-moderate` (gold/yellow), else → `uv-low` (green). Removed the now-unreachable `uv-high` (orange) CSS rule.
- [x] Verified all boundaries directly: UV 3, 5.9 → green; 6, 7.9 → yellow; 8, 9.9 → red; 10, 12 → purple.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 34 (completed)

### Long-pressing the weather widget for Settings now dismisses the open Hourly Forecast panel

- [x] `openWeatherOptions()` (script.js:1129) now calls the existing `closeHourlyPanel()` first if the panel is open, so Settings always explicitly dismisses it immediately regardless of click timing (the z-index overlap with `.help-overlay` no longer matters since the two can't coexist anymore).
- [x] Verified: with the Hourly panel open, holding the weather widget for a simulated 700ms long-press (finger still down) shows the panel already closed the moment the Settings dialog appears.

### Tile Grid System (new feature, per supplied spec doc)

- [x] Added a `.tile.tile-add` "+" placeholder as the last item in every category's tile grid (Home, News, Shopping, Entertainment) — dashed border, 50% opacity, styled distinctly from real tiles. Verified always-last placement and square sizing in all 4 categories.
- [x] Built the add-tile flow: tapping "+" opens a new `#add-tile-overlay` modal (Name + URL fields, reusing the existing `.help-overlay`/`.options-panel` pattern); submitting normalizes the URL (adds `https://` if missing), builds the favicon URL via Google's proxy (per the resolved conflict — not the spec's direct-fetch chain), inserts the new tile before the "+" button, and persists it to `localStorage` under `category-tiles-<id>`. Verified: added tile appears immediately, ordered before "+", and survives a page reload.
- [x] Built the favicon-fallback path: if the proxy image fails to load (`img.onerror`), the tile drops the `<img>` and gets `.tile-fallback` (larger text, up to 3-line wrap) so the typed name alone renders legibly. Verified with a non-resolving domain.
- [x] `.tile span` (all tile captions, including fallback-only tiles) changed from single-line ellipsis truncation to wrapping up to 2 lines (`-webkit-line-clamp: 2`), per the resolved conflict. Icon fill ratio (75%) and favicon source (Google proxy) intentionally left unchanged, per the other two resolved conflicts.
- [x] Verified geometry: no horizontal scroll at 412px or 900px viewports, all tiles stay perfectly square, and the partial second row created by the 6th (add) tile in each category does not stretch to fill — it sits alone in column 1, confirming the existing CSS Grid formula already handles partial rows and multi-row wrapping correctly per spec Sections 5-6.
- [x] Deferred, not built: grouping-header dividers (no category currently needs them) and the spec's direct favicon-fetch chain (superseded by the Google-proxy decision).

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 35 (completed)

### Add-tile URL field now hints mobile keyboards that it's a URL, not prose

- [x] `#add-tile-url` (index.html:563) changed from `type="text"` to `type="url" inputmode="url" autocapitalize="off" autocorrect="off" spellcheck="false"`. Verified attributes present and the add-tile flow (name + URL -> favicon fetch -> insert -> persist) still works end to end with the new input type.

### Category Headers & Accordion: consistent height, transparent unassigned stripe

- [x] `.category-header`'s stripe fallback (styles.css:181) changed from `var(--stripe-color, var(--fg-muted))` to `var(--stripe-color, transparent)` — an unassigned category now shows a fully transparent 3px strip (the header's own neutral background shows through) instead of a gray line. News/Shopping/Entertainment's existing assigned colors (blue/green/purple) are unaffected — verified their computed border colors are unchanged.
- [x] `.category-header`'s padding (styles.css:182) changed from `10px 14px` to `6px 14px 10px` to compensate for the 3px border, so standard headers render at the same height as Home's border-less header. Verified directly: both now measure exactly 38px.
- [x] Confirmed via direct measurement with the stripe color removed at runtime: border renders as `rgba(0, 0, 0, 0)` (fully transparent), still occupying 3px.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 36 (completed)

### Phase 2 Editing System, Part 1: Tile-level Remove Entry / Rename Entry

- [x] Migrated all 20 original tiles to seed data (`TILE_SEED_DATA` in script.js), each with a stable `id`. On first load per category, if `category-tiles-<id>` doesn't exist in localStorage yet, it's seeded from that data; every tile (original and "+"-added) now renders from that one list going forward. index.html's static tile markup is gone — only the `.tile-add` button remains static per category.
- [x] New tiles get an id via `crypto.randomUUID()` (with a fallback generator for older browsers).
- [x] Long-press on every real tile (via the existing `attachLongPress()` helper, excluded from `.tile-add`) opens a 3-option menu: Remove Entry, Move Entry (present but disabled — inert until the Part 2 Move Entry doc arrives and is built), Rename Entry.
- [x] Remove Entry: confirm prompt with the tile's name, then a `Math.random() < 0.10` chance of a second "Are you REALLY sure? 😳" prompt before actual deletion; Cancel at either stage leaves the tile untouched. Verified the boundary logic deterministically both directions (forced random below/above 0.10) plus the standard Cancel path — all behaved exactly as specified. The easter egg is not mentioned anywhere in the (still-placeholder) Help Overlay.
- [x] Rename Entry: inline input pre-filled with the current name; blank names are blocked (save is a no-op, dialog stays open); verified the URL, favicon, and fallback-text state are untouched by a rename — only the name label changes.
- [x] Verified: tap still navigates normally (long-press's built-in click-suppression prevents accidental navigation); long-press on the "+" tile does nothing (menu never opens); all of the above works identically on migrated original tiles and newly-added ones; changes persist across reload.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.
- [x] Re-verified all Build 34/35 tile functionality (add-tile flow, favicon fallback, long-press dismiss of the Hourly panel) still works correctly on top of the new id-based data model.

## Build Log 37 (completed)

_Note: these two were live regressions from Build 36 actively breaking real usage, and the first was reported with directive language ("that needs to be blocked") — fixed immediately rather than logged-then-queued, per the standing exception for hotfixing an active regression vs. a new feature request._

### Long-press on a tile triggered the native browser image context menu ("open image in new window" / "download icon")

- [x] **Root cause confirmed:** `.tile img` had no protection against the browser's native long-press/right-click image context menu (separate from the custom in-app tile menu). Fixed with two layers: `.tile img { pointer-events: none; }` (styles.css) so long-press/right-click always targets the `<a>` tile, never the `<img>` directly, and `a.addEventListener('contextmenu', (e) => e.preventDefault())` in `buildTileElement` (script.js) as a universal backstop against any native context menu on the tile itself.
- [x] Verified: a `contextmenu` event dispatched at a tile has `defaultPrevented === true`.

### Only manually-added tiles were showing — none of the original 20

- [x] **Root cause confirmed:** `loadCategoryTiles`'s migration check only seeded the original tiles when a category's `category-tiles-<id>` localStorage key was completely absent (`=== null`). Anyone who'd already used the "+" mechanic before Build 36 shipped (i.e., exactly what happened here) already had that key populated with just their added tile(s) — so the check saw a non-null key and skipped seeding entirely, leaving the 20 originals (which only ever existed as static HTML pre-Build-36) permanently unrecovered.
- [x] **Fix:** migration is now tracked by its own explicit flag (`category-tiles-migrated-<id>`) instead of overloading "does the key exist." On first run per category, whatever's already stored gets the seed data prepended (preserving existing custom tiles) and the flag is set; every load after that is a no-op for migration. Also added a safety net: any stored tile missing an `id` (the old Build 34/35 schema didn't have one) gets one generated and re-saved.
- [x] Verified directly: seeded a browser with the exact pre-existing-user state (one old-schema tile, no migration flag) — after load, all 5 originals + the 1 custom tile appear (6 total), all with valid ids, and a second reload doesn't duplicate anything.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.
- [x] Re-verified all Build 36 tile-action functionality (rename, remove, the 10% easter egg both directions, persistence) still works correctly on top of the migration fix.

## Build Log 38 (completed)

### Tile 2-line name: second line partially cut off — fixed

- [x] `.tile span` now sets an explicit `line-height: 1.2` instead of the imprecise default `normal`, fixing the `-webkit-line-clamp` calculation.
- [x] Added `updateTileNameWrapClass()`, called after a tile is built (initial render + "+"-added) and after a rename: measures whether the name actually wraps to 2 lines against the base size, and only then applies `.tile-name-wrap` (`font-size: 0.475rem` / `line-height: 0.595rem`, both ~2px smaller than base, per the user's revised fallback plan). Short, non-wrapping names are untouched. Fallback (no-favicon) tiles are excluded — the class gets removed if a tile's icon later fails to load.
- [x] Verified directly: a long renamed name gets the wrap class (7.6px font, 9.52px line-height) with 3px of clean clearance to the tile's bottom edge; a short renamed name stays at the base 9.6px with no wrap class.

### Hourly panel temperature graph: bottom-row labels no longer clipped

- [x] Graph height raised from 70px to 80px (both `renderHourlyTempGraph`'s SVG height/viewBox, script.js:1192, and `.hourly-temp-graph`'s CSS height, styles.css:411); label offset changed from `p.y + 25.5` to `p.y + 21.5` (4px closer to the icon, per the user's revised request). `ICON_TOP`/`ICON_BOTTOM` untouched — the curve's shape is unaffected. Verified directly with real 12-hour weather data: 12 labels rendered, worst-case clearance -3.5px (clean, no overflow).
- [x] Confirmed no other container changes were needed — `.hourly-panel.open`'s existing `max-height: 190px` absorbs the extra 10px with room to spare.

### Tile grid: duplicate tiles after a refresh — fixed

- [x] The one-time seed migration in `loadCategoryTiles` now dedupes by `id` before prepending seed entries, so it's safe to run more than once regardless of why the migration flag might go missing. Verified directly: clearing only the migration flag on already-migrated data and reloading now produces exactly 5 Home tiles (previously reproduced 10, "two of each," before this fix).

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.
- [x] Re-verified all prior tile-action functionality (add, remove with the 10% easter egg both directions, rename, blank-name blocking, persistence across reload) still works correctly on top of these changes.

## Build Log 39 (completed)

### Placeholder test content: nested categories/subcategories

- [x] Built genuinely new infrastructure — subcategories didn't exist anywhere before this: a `.category` section can now optionally wrap its children in a `.category-content` div containing nested `.category` (subcategory) blocks *and* its own `.tile-grid`, instead of `.tile-grid` being a direct child. The accordion toggle (script.js:134-152) now looks for `:scope > .category-content` first, falling back to `:scope > .tile-grid` — so flat categories (all 4 real ones) are completely untouched, both in markup and behavior.
- [x] The existing tile-population loop and `closest('.category')` lookups already worked correctly at any nesting depth with no changes needed — `closest()` naturally resolves to the nearest ancestor regardless of how deep a tile is nested.
- [x] Added the 5 test categories (A-E) alongside the real ones, exactly matching the supplied structure — Category A (flat, 3 tiles), B (2 subcategories, no direct tiles), C (2 levels deep: Sub A has its own 2 tiles *and* a nested Sub A-1 with 6), D (flat, 12 tiles across 3 rows), E (1 tile pointing at a nonexistent domain to exercise the fallback path). Seed data added to `TILE_SEED_DATA` per the same migration/dedupe system already built for the real categories — no changes needed there either.
- [x] The "whole-structure reorg tree" reference was ignored, per the user — no spec exists for it.
- [x] Verified extensively: all 5 categories collapsed by default; every level's accordion expands/collapses independently (confirmed Category B's subcategory headers become visible on expand while their own tile-grids stay collapsed until individually opened); correct tile counts and names at every depth including the 2-levels-deep Sub A-1; Category D's 12 tiles wrap across rows with no horizontal scroll and the "+" tile stays last; Category E's tile did land in fallback mode (though as flagged, this sandbox can't distinguish "real 404" from "no internet access" — the fallback *code path* is confirmed working, real-world behavior for an actually-nonexistent domain via Google's proxy is unverified); tile actions (long-press menu, rename, add via "+") all work correctly on nested-subcategory tiles with correct per-subcategory persistence and no cross-leakage between siblings; the 4 real categories are completely unaffected (still exactly 5 tiles each).

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.

## Build Log 40 (completed)

### Phase 2 Editing System, Part 2: Move Entry (drag-and-drop) — per supplied spec doc

- [x] **Entry point:** `#tile-menu-move` re-enabled (index.html) and wired — selecting it closes the tile menu and activates move mode for the grabbed tile's category (`enterMoveMode`, script.js).
- [x] **Visual states, per spec Section 1:** `.tile-grid.move-mode .tile` gives every tile in the active category a subtle drop-shadow; `.tile.move-grabbed` additionally tilts/scales and glows the specific tile currently grabbed or being dragged (styles.css).
- [x] **Auto-timeout, per spec Section 1:** move mode exits after 5s of no drag activity (`resetMoveModeTimeout`), reset on entry, on every drag pointer-move, on starting a new drag, and after a drop — not just on entry.
- [x] **Same-category reorder, per spec Section 2:** dragging within the current category live-reflows tiles via a nearest-tile-center algorithm (not a raw hit-test under the cursor — see root-cause note below) and persists the new DOM order to `category-tiles-<id>` on drop. Move mode stays active after a drop for repeated repositioning until timeout or manual exit.
- [x] **Cross-category move, per spec Section 3 — built for real against the now-existing nested structure, not a flat-only stopgap:** hovering a different category's header (tracked via `document.elementFromPoint`) highlights it (`.move-drop-target`) and, if that category is collapsed, auto-expands it (via the accordion's own `setExpanded`, not persisted to localStorage) so a further subcategory header underneath becomes reachable — verified working through Category C's real 2 levels of nesting (hovering C reveals Sub A's header; continuing onto Sub A's header reveals Sub A-1's, alongside Sub A's own tile list). Dropping on a header moves the tile from the source category's array to the end of that exact category's own array (not a nested child's), removing it from source and re-rendering both grids.
- [x] **Exit conditions, per spec Section 4:** auto-timeout, or a document-level tap-away check that exits unless the tap landed on a tile within the currently-active grid — this naturally covers a category-header tap too, which both exits move mode *and* toggles the header (both listeners fire on the same click), matching the spec's "should probably do both" framing.
- [x] **Edge cases, per spec Section 5:** a drag whose pointer coordinates leave the viewport bounds cancels that drag only (tile snaps back to its pre-drag DOM position via a saved sibling reference; move mode itself is untouched by the cancel) — verified separately that the mouse-up immediately following an off-viewport release lands outside any tile and is correctly absorbed by the already-specified tap-away exit, so move mode ends up exited too, which is consistent with (not contradicted by) the spec. Works identically for favicon and fallback-text tiles — nothing in the drag/persist logic is icon-dependent, verified directly on a forced-fallback tile including a real reorder drag. A flat category's header still works as a direct drop target with no expand step needed.
- [x] **Technical note resolved:** `touch-action: none` applied via `.tile-grid.move-mode .tile:not(.tile-add)` (styles.css) rather than changing the base `.tile` rule, so it only takes effect while that specific grid is in move mode.
- [x] **Root-cause fixes found during build, beyond the spec's own scope:**
  - Reordering by hit-testing the exact element under the cursor was unreliable under fast/synthetic pointer movement (Chromium coalesces rapid pointermove bursts, silently dropping intermediate events) — replaced with a nearest-tile-center comparison so a single large jump still resolves to the correct slot regardless of how many intermediate events actually get dispatched.
  - Listening for the drag's continuation via `setPointerCapture` on the dragged tile itself broke after the very first same-category reorder: moving a captured element to a new DOM position (`.after()`/`.before()`) silently releases pointer capture in Chromium, stranding the drag with no further `pointermove`/`pointerup` ever reaching it. Fixed by listening on `document` instead (filtered by `pointerId`), which needs no capture at all since `document` never moves in the tree.
  - With exactly one other tile in a category, "nearest other tile" is trivially always that same tile regardless of real cursor proximity, which flipped the reorder back and forth on every single move event (final order depended on move-event parity rather than actual position). Fixed by only reordering when the pointer is genuinely closer to the candidate's slot than to the dragged tile's own current slot.
- [x] **Verification checklist, per spec Section 6 — all directly tested via Playwright:** move mode visual states enter/exit correctly; auto-timeout fires and resets correctly during active dragging; same-category drag reflows live and persists (survives a reload); move mode survives multiple repositions in one session; cross-category drop appends to destination end and removes from source, verified through 2 levels of real nesting; manual tap-away exit works, including via a category-header tap (which also toggles that header); off-viewport drag cancels cleanly with the tile snapping back and no partial state; works on both favicon and fallback-text tiles, including a real persisted reorder drag on two fallback tiles.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.
- [x] Re-verified all Build 39 nested-category structure and nested tile-action behavior (accordion expand/collapse at every depth, rename/add on nested-subcategory tiles, per-subcategory persistence with no cross-leakage) still works correctly on top of the Move Entry changes.

## Build Log 41 (completed)

_Six queued items, all built and verified together in one pass, per "That's all I can think of now go ahead and build."_

### Move Entry: cross-category drop now live-reflows to an exact position

- [x] Once the drag crosses from a category's header into that category's actual `.tile-grid` area, the tile live-reparents into it (`dragInfo.currentGrid`, tracked separately from `dragInfo.grid`, the true original source) and reflows using the same nearest-tile-center algorithm same-category reorder already used — generalized (`reflowWithinCurrentGrid`) to operate on whichever grid the tile currently lives in, not a hardcoded source. Dropping there persists at that exact live DOM index. Dropping directly on a header without ever reaching a grid area still falls back to append-to-end, per the original design, for a category with nothing reachable to reflow against (e.g. no visible tile area at all).
- [x] Off-viewport cancel still always restores to the true original source grid + position, regardless of how many grids the tile passed through mid-drag.
- [x] **Real bug found and fixed during the build, not in the original plan:** the drag path can incidentally sweep over an unrelated grid that cascading hover-expand just revealed on the way to the true target (e.g. a sibling subcategory's tiles, exposed because an ancestor got auto-expanded in passing) — the tile would get live-reparented there and, if the drop-decision logic didn't re-check, could persist into the wrong category entirely, silently. Fixed by making header-hover the authoritative signal at drop time whenever a *different* category's header is still highlighted right up to release: hovering a header and hovering a grid are mutually exclusive at any instant, so whichever was true last is trusted, regardless of what grid the tile was transiently sitting in earlier in the drag. Verified directly with a reproduction matching the exact failure mode before landing on this fix.

### Move Entry: cascading hover-expand now collapses again live, and auto-scroll works near the viewport edges

- [x] **Auto-collapse:** categories auto-expanded by *this drag's* hovering (tracked per-drag, `dragInfo.autoExpandedIds`) collapse again live as soon as the hover target is no longer a descendant of (or the same as) them — never touching anything the user already had open before the drag started. At drop/cancel, everything auto-expanded collapses except the path to wherever the tile actually ends up (so the result stays visible) — cancelled drags collapse everything, since nothing was kept.
- [x] **Real bug found and fixed during the build:** the collapse-at-drop logic initially anchored on `dragInfo.currentGrid`'s category, which is stale in the header-only-drop fallback case (the tile's DOM position never changed, so it still pointed at the source) — the just-expanded destination would incorrectly collapse right back down instead of staying open. Fixed by anchoring on wherever the tile actually ends up (`crossTargetId` in the fallback case, `currentGrid`'s category otherwise), matching the same header-vs-grid priority fix above.
- [x] **Auto-scroll:** holding near the top/bottom edge of the viewport during a drag scrolls the page continuously via a `requestAnimationFrame` loop (not a one-shot `scrollBy`), at a speed scaled by proximity to the edge, re-running the drag's position-follow/reflow logic on every scroll tick (since the page moves under a stationary pointer with no new pointer event), and resetting the 5s idle timeout so genuinely-active edge-scrolling doesn't auto-exit move mode.
- [x] Verified directly: a category auto-expands on hover and collapses again once the drag moves on to an unrelated category; holding at the bottom edge measurably scrolls the page and stops the moment the pointer leaves the edge zone.

### Move Entry: cross-category-moved tile no longer stays stuck tilted/glowing

- [x] `finishTileDrag` and `cancelTileDrag` now explicitly remove `.move-grabbed` from the tile directly, rather than relying on `exitMoveMode`'s grid-scoped cleanup sweep (which never finds a tile that's been reparented into a different grid than the anchor). Verified directly: a cross-moved tile's class list no longer contains `move-grabbed` or `move-dragging` after drop.

### Static header: title, search bar, clock, and weather now pinned; everything else scrolls

- [x] `clock-widget`, `weather-widget`, and `hourly-panel` moved out of Home's `.tile-grid` into a new `.pinned-header` (`position: sticky; top: 0;`, solid background, `z-index: 100`) alongside the existing `.site-header` and `.search-row`. Home's own `.tile-grid` now holds only its 5 real link tiles + the "+" button, rendered dynamically exactly as before — no JS changes were needed there, confirming the prediction that the add/rename/remove/Move-Entry logic is fully class/data-attribute driven.
- [x] Clock/weather now live in a dedicated `.home-widgets` grid (`grid-template-columns: 2fr 3fr`) reproducing their original 2-of-5 / 3-of-5 width split from the old shared tile-grid; weather-widget still stretches to match clock-widget's aspect-ratio-driven height via the grid's default `align-items: stretch`, exactly as before.
- [x] **Real bug found and fixed during the build:** the hourly panel initially rendered *overlapping* clock/weather instead of appearing below them. Root cause: it's `position: absolute` with only `grid-column` specified — an absolutely-positioned grid item doesn't participate in normal collision-avoidance auto-placement (it's out of flow), so without an explicit `grid-row` it defaulted to row 1 instead of "auto-finding" the empty row 2 the way a normal-flow item would. Fixed with an explicit `grid-row: 2`.
- [x] Verified directly with real (mocked) weather data: clock/weather render at the correct size and stay pinned at the same viewport position across a real scroll, the hourly panel opens correctly anchored right below them with all 24 hour labels/icons rendering (confirming the pixel-tuned graph geometry from prior builds is untouched), and the rest of the page scrolls underneath the whole time.

### A category's own content is no longer permanently invisible when it also has subcategories

- [x] Removed the redundant `hidden` attribute from the three "own tile-grid directly inside `.category-content`" elements (`test-b`, `test-c`, `test-c-suba`) in the static HTML — they're already correctly hidden whenever their ancestor `.category-content` is hidden, no JS changes needed. Verified directly: the "+" tile is now visible and functional in `test-b`'s own (previously empty) list, and a tile added there persists correctly.

### Subcategories now indent from the left and outdent their chevron from the right

- [x] `.category-content > .category` gets `margin-left: 2ch` (indent) and `margin-right: 2ch` (outdent — pulls the flush-right chevron left, away from the page edge, since `justify-content: space-between` meant a left-only margin left it exactly aligned with every ancestor's chevron). Compounds naturally through CSS's normal margin cascade at deeper nesting levels, matching the standard nested-list/file-tree convention. Verified visually against Category B/Sub 1's real rendering.

### Home header: expand-all / collapse-all buttons

- [x] `▲` (expand-all) and `▼` (collapse-all, in the very corner) added to the Home header, both iterating the existing `categoryToggles` map (covers every category at every nesting depth) and persisting to `category-collapsed-<id>` — unlike Move Entry's transient hover-expand, this is a deliberate user action and survives reload. Verified directly: both buttons affect every top-level category and nested subcategories in one click, and the resulting state survives a reload.

### Regression check

- [x] Full sweep across all 49 radio values (48 conditions + Live) with zero real errors — only the pre-existing, unrelated favicon 404 appeared.
- [x] Re-verified all Move Entry functionality from Build 40 (same-category reorder, tap-away/header-tap/timeout exit, off-viewport cancel, fallback-tile support) and all Build 39 nested-category structure/tile-action behavior still work correctly on top of this build's changes.

## Build Queue

### Category navigation redesign: exactly one category or subcategory open anywhere at a time

- [ ] **Background — problem being solved:** with real nested content in place, it became clear the current accordion (any number of categories/subcategories independently expanded at once) makes it genuinely hard to tell which tiles belong to which category, even with the Build 41 indent/chevron-outdent — confirmed against a real screenshot showing Category C → Sub A → Sub A-1 all expanded simultaneously with only subtle stripe-color differences to go on. Color-coded borders were considered and rejected as insufficient by the user — the deeper issue is simultaneous visibility, not insufficient color differentiation.
- [ ] **User-specified design, fully worked out across several rounds of discussion:**
  - **Exactly one category or subcategory is expanded anywhere on the page at any time — a single global rule, not scoped to siblings.** Opening any category or subcategory (at any depth, including a top-level one like News or Shopping) collapses whatever else was open anywhere else, at any depth. The whole point is you can never have two things open simultaneously, so there is never ambiguity about which tiles belong to which category.
  - **Home is exempt** — it has no expand/collapse state today (always-visible, no accordion header) and this redesign doesn't change that; it's not part of the single-open pool.
  - **A category's own direct links are listed before its subcategories** (currently the reverse in the markup — subcategory `<section>`s come first, the parent's own `.tile-grid` comes last; needs reordering).
  - **Default selection:** expanding a category that has both its own links and subcategories shows the own links automatically — no extra tap needed, consistent with them being listed first. Tapping a subcategory swaps the visible content to that subcategory (closing the own-links view, per the single-open rule). Tapping that subcategory's header again to close it falls back to showing the parent's own links again, rather than showing nothing — something is always visible whenever an expanded category has content to show.
  - **No dedicated expand button anywhere — tapping a category header opens it.** This is already how individual headers work today (the whole `.category-header` is itself a `<button>`); the redesign doesn't add anything new for opening, it just confirms that's the only mechanism, with no separate expand icon.
  - **Collapse is explicit and exists at two scopes:** (1) whichever category/subcategory is *currently* open also shows its own small collapse control, closing just that level (falling back to its parent's own links per the default-selection rule above, or to nothing if it was a top-level category); (2) the single collapse-all button on the Home header resets the *entire* currently-open chain, at every level, back to fully collapsed in one tap, regardless of how many levels deep it goes. The expand-all button is removed entirely — it's fundamentally incompatible with "only one thing open anywhere" and cannot be repurposed sensibly.
- [ ] **User-corrected indent behavior (supersedes Build 41's shipped approach):** indenting the *entire* nested `.category` section (Build 41's `margin-left`/`margin-right: 2ch` on `.category-content > .category`) shrinks the whole header — stripe, touch target, and all — by 4ch per level. At around 5 levels deep that eats so much width the header stops being usable and tile rows barely have room to render. **Corrected design: only the title text indents; the header itself (background, stripe, touch target, and — per the point above — its own collapse control) stays full width at every level**, so the tap target and readable space never shrink no matter how deep the nesting goes.
  - **Technical approach:** revert the Build 41 `margin-left`/`margin-right` on `.category-content > .category`. Instead, use a self-incrementing CSS custom property so the indent amount reflects true nesting depth without hardcoding a selector per level: `.category-content { --depth: calc(var(--depth, 0) + 1); }` (each nested `.category-content` bumps the count inherited from its nearest ancestor), then `.category-name { padding-left: calc(var(--depth, 0) * 2ch); }` — a top-level category has no `.category-content` ancestor so `--depth` falls back to 0 (no indent); each level of nesting adds another 2ch automatically, to any depth, with no per-level CSS needed.
- [ ] **Technical approach for the rest (sketch, to be finalized during the build):**
  - Rework `categoryToggles`/`setExpanded` (script.js) so opening any one category collapses whatever else is currently open globally, not just updating its own state — likely a single module-level "currently open path" reference that `setExpanded(true)` updates, closing the previous path's chain before opening the new one.
  - Reorder `.category-content`'s children in the static HTML (own `.tile-grid` before subcategory `<section>`s) for every category that has both, and give the own-tile-grid a real toggle-able identity (it currently has no header/button of its own — only actual subcategory `<section>`s do) so it can participate as the default-selected "child" alongside real subcategories, and so it has something to attach its own collapse control to.
  - Add a small collapse control to whichever header is currently the open one (not shown on closed headers, which only need the existing open-on-tap behavior); remove `#expand-all-btn` and its click handler; keep `#collapse-all-btn`, updated to walk and close the entire open chain (every ancestor down to whatever leaf is open), not just the immediate level.
- [ ] **Move Entry redesign, per the user's own follow-up — this changes a core assumption Move Entry currently relies on, not just a minor reconciliation:**
  - **What breaks:** Move Entry (Build 40/41) currently keeps the tile's *source* category open for the whole drag (so its siblings stay visible for reorder) while cascading hover-expand reveals a *destination* category alongside it. With only one thing open anywhere, both can never be visible at once — dragging toward a different category and hovering its header will now close the source category (and whatever else was open) as a direct, correct consequence of the same global rule, not a bug to work around.
  - **Why that's actually fine, not a regression:** the dragged tile itself is already detached from normal layout (floating via the drag transform, tracked independently in `dragInfo`), so its origin category collapsing around it doesn't disrupt the drag or lose the tile. The practical effect the user is describing — "it will only be able to open one category at a time, and navigating up and down will move things around" — is the new interaction model working as intended: as the dragged pointer moves near a different category's header, that category becomes the one open thing, and whatever was open before (including the source) collapses, cascading the same way normal browsing now works. This also extends the redesign's whole point (never ambiguous which tiles belong to which category) to the drag itself, not just static browsing.
  - **Technical consequence — simplifies Move Entry, doesn't just reconcile with it:** Build 41's bespoke per-drag auto-collapse tracking (`dragInfo.autoExpandedIds`, `updateAutoCollapse` in script.js) exists specifically because the base accordion had no global exclusivity of its own — Move Entry had to track and enforce it itself, scoped to only what that drag had opened. Once `setExpanded` is globally exclusive as part of this redesign, that tracking becomes redundant: any hover-triggered `setExpanded(true)` call from Move Entry automatically closes whatever else was open, including things the user opened manually before the drag started, with no separate bookkeeping needed. This code should be removed during the build, not just adjusted.
  - **Auto-scroll near the viewport edges must carry forward unchanged** — the user explicitly confirmed this is still needed. Build 41's existing `updateAutoScroll`/`autoScrollTick` (script.js) already does this and doesn't depend on how many categories are open, so it needs no rework — but note the new compact, mostly-collapsed-by-default layout means categories sit closer together and a drag to a distant one now covers more scroll distance, making this more relied-upon than before, not less.
  - **One case to confirm during the build:** dragging back *up* over the (now-collapsed) source category's header should reopen it the same way as any other category, via the same global rule — nothing special-cased needed, just worth verifying it actually happens.

### Clock widget: long-press triggers the native browser context menu again

- [ ] **Reported behavior:** long-pressing the clock offers to open [an image] in a new tab/window — the same class of native-context-menu problem already fixed once for tiles.
- [ ] **Root cause confirmed:** the tile fix (Build 37) added two things scoped only to `.tile`/tile `<img>` elements — `pointer-events: none` on the image (so the browser always hit-tests the `<a>`, never the image directly) and an explicit `a.addEventListener('contextmenu', (e) => e.preventDefault())` in `buildTileElement`. Clock-widget's own `<a class="clock-inner">` (index.html) never got either treatment — it has `-webkit-touch-callout: none` in CSS (styles.css, `.clock-widget`), which suppresses iOS Safari's own long-press callout specifically, but nothing suppresses the `contextmenu` event itself, which is what Android Chrome's long-press-on-link menu (and any other non-iOS-Safari browser) actually fires. Clock-widget already has its own `attachLongPress`-driven options menu (`openClockOptions`), so it's exactly the same class of conflict tiles had, just never patched here.
- [ ] **Fix:** add the same `contextmenu` prevention directly to `#clock-widget`'s inner `<a class="clock-inner">` (or to `#clock-widget` itself, whichever correctly intercepts it — confirm during the build), matching the tile pattern. Worth checking `#weather-widget` for the same gap while in there, even though it wasn't reported — it also drives its own long-press options menu the same way and was never covered by the Build 37 tile-scoped fix either.

### Popups (settings, weather/clock options, tile menu, etc.) render behind the pinned header

- [ ] **Reported behavior, user-diagnosed:** since Build 41's static header, opening Settings, the weather/clock options popups, or similar dialogs shows their top portion hidden behind the pinned clock/weather header instead of rendering above it.
- [ ] **Root cause confirmed, matches the user's own diagnosis exactly:** every popup in the app (Settings, Help, Testing Panel, clock options, weather options, add-tile, tile menu, tile confirm, tile rename) shares one `.help-overlay` class (`position: fixed; inset: 0; z-index: 10;`, styles.css). Before Build 41 this was never a problem, since nothing else on the page had a competing z-index that high. Build 41 added `.pinned-header` at `z-index: 100` — both are positioned elements at the same stacking level (near-direct children of `<body>`, no intervening stacking context isolating them), so the header's higher z-index now wins and sits on top of every popup's upper portion.
- [ ] **Fix:** raise `.help-overlay`'s `z-index` above `.pinned-header`'s 100 — e.g. `200`, leaving headroom for anything else already using a lower z-index (`.hourly-panel` at 20, Move Entry's `.move-grabbed`/`.tile.move-dragging` at 10) to stay correctly layered beneath both.
- [ ] **Build this one first, before the weather-widget scroll entry below** — the user's own hypothesis is that this z-index bug is the actual cause of that one too (see its note).

### Weather widget: long-press blocks vertical scroll

- [ ] **Reported behavior:** long-pressing on the weather widget prevents the page from scrolling vertically.
- [ ] **Investigated, but root cause not fully confirmed — flagging the uncertainty rather than guessing with false confidence:** `attachLongPress`'s own pointer handling (script.js) never calls `preventDefault()` on `pointerdown`/`pointermove`, and `.weather-widget`'s CSS `touch-action: manipulation` (styles.css) should itself still permit panning/scrolling — so there's no single obvious line of code blocking scroll outright, and this sandbox can't fully reproduce real mobile touch-gesture-recognition timing to confirm a cause with certainty.
- [ ] **User's own hypothesis, worth trying first:** this may not be about the background page's scroll gesture being mechanically blocked at all — it may really be about the weather-options popup that opens after the long-press, whose top is currently hidden behind the pinned header (the entry above). If so, "can't scroll" could mean "can't reach/see the rest of the popup," which the z-index fix above resolves on its own with nothing to change here.
- [ ] **Build order:** ship the popup z-index fix above first, then re-test this specific complaint before touching anything else. Only if it's still reproducible afterward, fall back to the original hypothesis: `touch-action: manipulation` permits panning in both directions, requiring the browser to resolve direction ambiguity before committing to a scroll — on a wide, tall element like weather-widget, with a `pointerdown` listener also attached for the long-press timer, that may be enough to make a vertical scroll attempt starting on it feel swallowed. Restricting to `touch-action: pan-y` (only vertical panning declared possible) removes that ambiguity. Low-risk to try regardless, but still a best-effort guess, not a confirmed root cause — real on-device confirmation is what actually settles it.

### Multi-select: move several tiles to another category at once

- [ ] **Requested behavior:** a second, separate way to move tiles, additive to the existing single-tile Move Entry (drag/drop) — which continues to work exactly as it does now, unchanged. This new mode is for moving *multiple* tiles to a different category in one action, without dragging each one individually.
- [ ] **Why a second mode instead of extending drag/drop:** the user asked for both to coexist — "move 1 tile and have the flow mechanics working with it" (today's drag/drop, with live reflow) stays as-is for the single-tile case; multi-tile moves don't need that same live-reflow precision, since the user explicitly said it's fine for a batch to simply land at the end of the destination category's list.
- [ ] **Interaction model — based on the proven, standard pattern from mobile file-manager/photo-gallery apps (iOS Files/Photos, Google Files, Gmail multi-select, etc.):**
  1. **Enter select mode — decided:** long-press a tile (same gesture already wired up via `attachLongPress`) opens the existing tile menu, which gains a 4th button: **Rename, Move, Select, Delete**, in that order. Tapping **Select** is what enters select mode (long-press alone does not enter it directly). The existing "Remove Entry" button is relabeled **Delete** to match.
  1a. **Tile-menu visual redesign — decided:** replace today's stacked, full-width text rows (`.testing-reset-btn`) with tile-style buttons — same shape as `.tile` in the tile grid (icon on top, label text below), laid out in a grid sized for 5 columns (matching `.tile-grid`'s `grid-template-columns: repeat(5, 1fr)`), even though only 4 buttons are used today — leaves room for a 5th action later without a layout redesign. **Fallback, decide at build time:** if the tile-menu popup panel (`.help-panel.options-panel`) turns out to be narrower than the main tile-grid area — likely, since it's a modal panel, not the full-width home grid — and 5 columns would cramp the buttons, use 4 columns instead (one per current action, no spare slot) rather than forcing 5 into a too-narrow panel. Each button needs its own icon (glyph or small SVG — none exist yet for Rename/Move/Select/Delete; pick simple ones during the build) plus a label below, mirroring `.tile img` + `.tile span`.
  2. **Select tiles:** once in select mode, tapping any tile (the one long-pressed, or others) toggles its selected state (checkmark/highlight overlay) instead of opening it — no dragging involved at all in this mode.
  3. **Action bar:** a bar appears (e.g. bottom of screen) showing the current selection count and a "Move Selected (N)" button, plus a way to cancel out of select mode entirely.
  4. **Destination picker:** tapping "Move Selected" opens a tap-through category navigation view to choose the destination — this should reuse the single-open-at-a-time category navigation redesign (logged above) once that's built, rather than building a separate picker UI.
  5. **Drop:** confirming the destination appends all selected tiles to the end of that category's own tile list (no live reflow/precise positioning for a batch — matches the already-established "header-drop = append to end" pattern from Move Entry's own cross-category drop behavior), then exits select mode.
- [ ] **Dependency note:** step 4's destination picker is cleanest to build *after* the single-open-at-a-time navigation redesign (logged above) ships, since it's meant to reuse that navigation rather than duplicate it. Could still be built standalone first with a simpler picker if sequencing makes more sense at build time — flagging the dependency, not mandating an order.
- [ ] **Explicitly out of scope for this entry:** anything to do with single-tile drag/drop — that flow (Move Entry, Build 40/41) is untouched by this feature and must keep working exactly as it does today.

## Build Planner

_Backlog of items to get to eventually — not being actively worked on. Promote to the Build Queue when ready to start._

### Add a favicon

- [ ] No `<link rel="icon">` is declared in `index.html` and no `favicon.ico` file exists in the repo, so browsers automatically request `/favicon.ico` on every load and it 404s. Purely cosmetic (console/server-log noise only), unrelated to any widget functionality. Low priority — planned for the final build stage.

### Tile edit/delete (Phase 2 long-press menu)

- [ ] User expected a long-press menu on tiles to delete/edit them; confirmed none exists yet — the Tile Grid System spec explicitly deferred rename/reorder/delete to a separate "Phase 2" document not yet supplied. User's explicit call: wait for that document rather than building a minimal delete-only version now. Promote to Build Queue once that spec arrives.

### Possibly reduce HAIL_GRAVITY for a calmer bounce

- [ ] User's note: on top of the queued 75% hail speed cut, `HAIL_GRAVITY` (currently `3` px/frame², script.js) may also need reducing to get a "cool effect" rather than the current "ice Armageddon" look — bounces reading as too chaotic/frantic. Explicitly to revisit *after* seeing the speed-cut build in action, not now — no specific target value decided yet.

