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

## Build Queue

Not yet implemented — queued for whenever it's relevant. All blocked on the same thing: the live WeatherAPI.com integration doesn't exist yet, this widget is still entirely placeholder data.

- [ ] 15-minute staleness-based weather refresh (cache fetch + timestamp in `localStorage`, refetch only when ≥15 min stale).
- [ ] Geolocation: `navigator.geolocation` for real coordinates (must work globally, not US-only), with a sensible fallback if access is declined.
- [ ] Timezone abbreviation: true local timezone of the detected location via WeatherAPI's `location.tz_id`, never UTC/device-home, UTC-offset fallback only if no standard abbreviation applies.
- [ ] Full live data pull: feels-like, wind, visibility, cloud cover, humidity, dew point, UV, moon phase (all 8 phases), sunrise/sunset, severe alerts, hourly forecast via `/forecast.json?days=1&alerts=yes`.
- [ ] Condition-specific base animations for Live Condition Skin (rain/snow/thunderstorm/clear day/cloudy/clear night) — the cloud-cover math is built, per-condition visual treatments aren't. Blocked on two separate things, not just the API: (1) the API connection to know which condition is even active, and (2) an actual design spec for what each condition should look like (rain, snow, thunderstorm, etc. each have their own open questions — intensity levels, motion style, how they layer with the existing cloud/sky system) — nothing like the weather/clock phase-2 docs exists for this yet. When it's tackled, each condition type needs its own way to preview/test it live (the same role the testing panel's cloud slider and time override play for the sky gradient and cloud layer today), not just be guessed at from real weather eventually rolling through.

### Weather widget: fix text-color threshold (should be gray's own luminance, not 0.5)

- [ ] Follow-up to the "worth watching" note in Build Log 10: user's rule, stated plainly — during the day the text should be black; it should convert to gray once the background gets darker than gray itself. That's a principled threshold, not the arbitrary `0.5` currently in `WX_TEXT_LUMINANCE_THRESHOLD` (script.js): use the relative luminance of `#808080` (the medium gray text color) as the cutoff instead. Computed: `relativeLuminance(#808080) ≈ 0.216`. Change the constant from `0.5` to `~0.216` (compute it via the existing `relativeLuminance(hexToRgb('#808080'))` at load time rather than hardcoding the decimal, so it stays correct if the gray value ever changes).
- [ ] This directly fixes the edge case flagged in Build Log 10: the saturated midday sky blue composite (~0.48 luminance) was landing on gray under the old 0.5 threshold despite reading as a light blue — under the corrected ~0.216 threshold it correctly resolves to black.
- [ ] **Refinement from user, on top of the above:** an exact crossover at gray's own luminance isn't quite right either — right at that boundary, gray text would have almost zero contrast against a background that's only barely below it (they'd be nearly the same tone, "basically invisible while it's close"). Needs a margin: don't switch to gray until the background is *meaningfully* darker than gray's luminance, not just technically past it — e.g. `bgLum > (grayLum - MARGIN) ? black : gray` instead of comparing directly against `grayLum`. No exact margin value specified — start with something like `0.05` (so the switch point lands around bg luminance ≈0.166 rather than ≈0.216) and tune it live via the testing panel until the transition is obviously readable on both sides, not guessed at as a fixed number up front.

### Weather widget: larger drifting clouds pop in instead of entering fully offscreen

- [ ] Reported: bigger clouds are sometimes visibly "popping" onto the left edge instead of sliding in from offscreen. Measured and confirmed: `.wx-skin-cloud`'s offscreen buffer is a flat `left: -15%` of the widget's width (~247px wide in testing → ~37px buffer), but cloud width is a fixed rem value from the Build Log 9 height-correlated sizing (1x–2.5x, i.e. 1rem–2.5rem) that doesn't scale with the widget — and emoji glyphs render noticeably wider than their font-size (a measured 2.39rem cloud was ~48px wide, about 1.25× its nominal size). At `left: -15%`, that cloud's right edge lands at roughly `-37px + 48px ≈ +11px` — already inside the widget when the animation starts. Smaller clouds (~20px wide) stay fully hidden at the same offset; only the larger end of the 1x–2.5x range is affected, matching what was reported.
- [ ] A bigger flat percentage (e.g. `-25%` instead of `-15%`) would mask the symptom at the current widget width but isn't a real fix: cloud width is fixed in rem/px while the buffer is a percentage of container width, so the two don't scale together — the same bug would resurface on a narrower widget or if the largest-cloud size ever changes. The correct fix computes each cloud's actual offscreen offset from its own rendered width (e.g. `left: calc(-1 * var(--cloud-w))` / `calc(100% + var(--cloud-w))` in the keyframe, with `--cloud-w` set per-cloud as a CSS custom property from its measured width, or the animation driven by JS instead of a single shared `@keyframes` used by every cloud regardless of size) — guaranteeing full concealment at both ends of the drift regardless of cloud size or widget width.

### Weather widget: cloud count formula rounds up below 10%

- [ ] Reported: at 8% cloud cover, one cloud is still showing, but the spec is "no clouds below 10%, one cloud per 10%, up to 10 at 100%." Root cause confirmed: `cloudCount = Math.round(cloudPct / 10)` (script.js:655) uses `Math.round`, not `Math.floor` — at 8%, `Math.round(0.8) = 1`. This is wrong for any value 1%–9% (all round up to 1 cloud instead of 0), and also affects the rest of the range: e.g. 15% rounds to 2 instead of staying at 1. Fix: change `Math.round` to `Math.floor`, giving `floor(8/10)=0`, `floor(10/10)=1`, `floor(15/10)=1`, `floor(100/10)=10` — exactly matching the stated rule.

### Weather widget: re-randomize cloud height on each lap (simplified scope)

- [ ] Simplified from an earlier, larger version of this idea (full lifecycle tracking, no despawn on redraw) — user opted for the smaller compromise: keep the existing behavior where any settings/redraw change (`renderWeatherSkin()`) tears down and rebuilds all clouds as it does today, no change there. The only new behavior: every time an individual cloud completes a lap and wraps back around to re-enter from the left, it gets a freshly randomized height for that new lap (and, per the existing height-correlated formula from Build Log 9, a size/speed recalculated from that new height — `f = topPct / 50`, `size = 2.5 - 1.5*f`, `duration = 17 + 43*f`) instead of keeping the same fixed lane forever.
- [ ] Implementation shape (small, self-contained): extract the existing random top/size/duration generation (currently inline in the creation loop, script.js:656-668) into a small helper function. Call it once at creation as now, and add one `animationiteration` listener per cloud (the DOM event that fires each time a looping CSS animation completes an iteration — exactly the "wraps back around" moment) that calls the same helper again and updates that cloud's inline `top`/`fontSize`/`animationDuration` for its next lap. No persistent cross-call state needed, no diffing cloud counts, no removal logic beyond what already exists.
- [ ] Worth verifying once built: whether updating `animation-duration` inline from inside the cloud's own `animationiteration` handler causes any visible restart/flicker versus a clean continuation into the next lap — needs an actual on-device/visual check.
- [ ] Interacts with the offscreen-entry-width item directly above this one: a respawned cloud re-enters the same way a freshly created one does, so whatever fix that item lands on (per-cloud pixel-width-based offscreen offset) needs to apply equally to respawns, not just initial creation.

