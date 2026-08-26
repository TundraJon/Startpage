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

## Build Queue

_Empty — nothing currently queued._

## Build Planner

_Backlog of items to get to eventually — not being actively worked on. Promote to the Build Queue when ready to start._

### Add a favicon

- [ ] No `<link rel="icon">` is declared in `index.html` and no `favicon.ico` file exists in the repo, so browsers automatically request `/favicon.ico` on every load and it 404s. Purely cosmetic (console/server-log noise only), unrelated to any widget functionality. Low priority — planned for the final build stage.

### Possibly reduce HAIL_GRAVITY for a calmer bounce

- [ ] User's note: on top of the queued 75% hail speed cut, `HAIL_GRAVITY` (currently `3` px/frame², script.js) may also need reducing to get a "cool effect" rather than the current "ice Armageddon" look — bounces reading as too chaotic/frantic. Explicitly to revisit *after* seeing the speed-cut build in action, not now — no specific target value decided yet.

