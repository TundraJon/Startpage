# Startpage

Personal homepage, hosted on GitHub Pages.

Live at: https://tundrajon.github.io/Startpage/

## Working rules

- **Never build or edit code without explicit instruction.** A bug report or feature request gets logged to `## Build Queue` below — with a precise description and, where possible, a root-cause diagnosis — and nothing else. Code only gets written once the user explicitly says to build it (e.g. "Go ahead and build," "Build them sequentially"). Reporting a bug is not, by itself, a request to fix it.
- **This applies to design instructions too, not just bug reports.** A message describing what something should look like or how it should behave (e.g. "add Sort to the edit category panel, offer these three modes") is still just a design decision to log to `## Build Queue` — it is NOT build permission, even when it reads like an instruction. Only something to the effect of "build the build queue" / "go ahead and build" authorizes writing code. If there is even a 1% chance a message might not be a build instruction, ask before touching any code.

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

## Build Log 42 (completed)

_Five queued items, all built and verified together in one pass, per "Go ahead and build the build queue"._

### Category navigation: exactly one category or subcategory open anywhere at a time

- [x] `openPath` (script.js) replaces the old per-category `categoryToggles`/`setExpanded` independent-state model with a single module-level "currently open chain" (root → leaf). `openCategoryPath(id)` recomputes the full ancestor chain for whatever was tapped and re-renders every category's visibility from that one array — opening anything, anywhere, at any depth, collapses everything else that isn't on the new chain, with no per-category bookkeeping. Home stays exempt, unaffected (still always visible, no header toggle).
- [x] A category's own direct links now come before its subcategories in the static HTML (test-b, test-c, test-c-suba reordered), and the own-`.tile-grid` got a real toggle-able identity — visible whenever its category is on the path *and* is the deepest (leaf) selection, hidden the instant a subcategory becomes the active child instead. That's the default-selection behavior: opening a category with both shows its own links automatically; tapping a subcategory swaps to it; tapping that subcategory's collapse control (or re-tapping the parent's header) falls back to the parent's own links again, never to nothing.
- [x] No dedicated expand button anywhere — tapping a category header (now `.category-header-main`) opens it, unconditionally recomputing the path to that category regardless of prior state (re-tapping an already-open leaf is a harmless no-op; tapping a mid-chain ancestor while a deeper child is active correctly falls back to that ancestor's own content).
- [x] Collapse exists at two scopes: a small `.category-collapse-btn` shown only on whichever header is currently the leaf (closes just that level, falling back per the point above), and the single Home-header collapse-all button (`#collapse-all-btn`) which resets the entire open chain to nothing in one tap, at any depth. The old expand-all button is removed entirely — incompatible with "only one thing open anywhere."
- [x] **Structural change required and not fully anticipated in the original plan:** `.category-header` couldn't stay a `<button>` once it needed to hold two independently-clickable controls (the open action and the collapse button) — a `<button>` can't contain another `<button>`. It's now a plain `<div>` wrapper (matching the pattern Home's header already used for its own action buttons) containing `.category-header-main` (the real open-button, carries `aria-expanded`) and `.category-collapse-btn` as siblings.
- [x] Title-only indent, superseding Build 41's shipped `margin-left`/`margin-right` box-shrink approach: only `.category-name`'s `padding-left` indents by nesting depth: the header row itself (stripe, background, full touch target, collapse button) stays full width at every level.
- [x] **Real bug found and fixed during the build:** the originally-planned pure-CSS self-incrementing custom property (`.category-content { --depth: calc(var(--depth, 0) + 1); } `) looked correct but doesn't actually work — verified directly via computed-style inspection that Chromium resolves `--depth` to nothing at every nesting level, because a custom property referencing its own name is treated as a circular reference even when the intent is "the value inherited from the ancestor," not literal self-reference. Fixed by computing each category's true nesting depth once from the live DOM (counting `.category-content` ancestors) and setting `--depth` explicitly per `.category-name` element from script.js — the CSS side (`padding-left: calc(var(--depth, 0) * 2ch)`) is unchanged and works correctly once fed a real value.
- [x] **Real cosmetic bug found and fixed during the build:** the leaf's collapse button and the header's own rotating chevron both used `▲`, so an open leaf showed two identical up-arrows sitting side by side, looking like a duplicate rather than two distinct controls. Changed the collapse button's glyph to `✕`, visually distinct from the chevron's rotate-to-▲ "expanded" indicator.

### Move Entry reconciled with the new global-exclusive navigation

- [x] Confirmed not a regression, as anticipated in the original spec: dragging toward a different category and hovering its header now closes the source category (and whatever else was open) as a direct, correct consequence of the same global rule — the dragged tile is already detached from normal layout (floating via the drag transform, tracked independently in `dragInfo`), so its origin collapsing around it doesn't disrupt the drag.
- [x] Build 41's bespoke per-drag auto-collapse tracking (`dragInfo.autoExpandedIds`, `updateAutoCollapse`, `collapseAutoExpanded`, `isAncestorOrSelfCategory`, `categorySectionFor`) is fully removed, not just adjusted — `handleHeaderHover` now just calls the same `openCategoryPath(id)` real navigation uses, which already collapses everything else as a side effect. `finishTileDrag`/`cancelTileDrag` no longer need any post-drag collapse call at all.
- [x] Re-hovering the drag's own original source header (e.g. dragging away then back) now correctly reopens it — the old code special-cased this as a no-op because it assumed the source always stayed open; that assumption no longer holds now that the source can auto-collapse mid-drag. `finishTileDrag`'s existing `crossTargetId !== sourceCategoryId` check already prevented this from being mis-treated as a real cross-category append, so no other logic needed to change.
- [x] Auto-scroll (`updateAutoScroll`/`autoScrollTick`) carried forward completely unchanged, as expected — it never depended on how many categories were open.
- [x] Verified directly: cross-category drag-and-hover opens the destination and collapses the source; the moved tile lands correctly with no stuck `.move-grabbed`/`.move-dragging` classes; same-category reorder is unaffected.

### Clock widget: long-press no longer triggers the native browser context menu

- [x] Added the same `contextmenu` prevention already used for tiles (Build 37) directly to `#clock-widget .clock-inner`. Checked `#weather-widget` for the same gap per the queue note — it has no `<a>` element at all (only buttons/divs), so there's no equivalent native-link-context-menu risk there; nothing to fix.

### Popups now render above the pinned header

- [x] `.help-overlay`'s `z-index` raised from 10 to 200 — above `.pinned-header`'s 100, with headroom above `.hourly-panel` (20) and Move Entry's drag styling (10). Verified directly via computed style on the Settings popup.

### Multi-select: move several tiles to another category at once

- [x] Tile menu redesigned into 4 tile-style buttons (icon on top, label below, matching `.tile`'s own shape) in a grid sized for 5 columns like `.tile-grid`, in order **Rename, Move, Select, Delete** — "Remove Entry" relabeled "Delete." Tapping **Select** enters select mode for that tile's grid.
- [x] Tapping other tiles in that grid toggles their selection (red outline + checkmark badge) instead of navigating; a bottom action bar shows the live count and a "Move Selected (N)" button.
- [x] "Move Selected" hands off to the normal single-open-path category navigation (no separate picker UI, per the queue's dependency note) to choose a destination; the bar's button becomes "Move Here (N)" and shows the current destination's name, enabled once any category is open.
- [x] Confirming appends the whole batch to the end of the destination's tile list (no live reflow, matching Move Entry's own header-drop append-to-end behavior) and exits select mode.
- [x] Verified directly: single-tile drag/drop Move Entry is completely unaffected and still fully functional; a 2-tile batch move correctly removes exactly those 2 from the source and appends them to the destination, in both the DOM and localStorage.

### Regression check

- [x] Full Playwright sweep: global exclusivity at every depth (including jumping between unrelated top-level categories with a 3-level chain open), leaf-only collapse button visibility, collapse-all, path persistence across reload, re-tapping an open leaf (idempotent) and a mid-chain parent (falls back to own links), the empty-own-grid "+" tile fix from Build 41 still reachable, Home unaffected, cross-category and same-category Move Entry, multi-select end to end, popup z-index, and clock context-menu prevention — zero console/page errors throughout.

## Build Log 43 (completed)

### Multi-select: moved tiles stayed visually selected after the move

- [x] **Reported behavior:** after moving a selected group of tiles to another category, they stay showing the selected outline/checkmark in their new category instead of clearing.
- [x] **Root cause:** `exitSelectMode`'s cleanup queried `selectMode.grid.querySelectorAll('.tile-selected')` to strip the class — but `confirmMoveSelected` already reparents each moved tile element into the *destination* grid before calling `exitSelectMode`, so a query scoped to the (now smaller) *source* grid no longer finds them.
- [x] **Fix:** scope that cleanup query to the whole document instead of `selectMode.grid` — safe since select mode is always exclusive to one source category, so no tile outside it could ever have picked up `.tile-selected` in the first place. Verified directly: a 2-tile batch move now leaves zero `.tile-selected` elements anywhere afterward.

## Build Log 44 (completed)

### Weather widget: long-press blocks vertical scroll — resolved, no code change needed

- [x] **Confirmed fixed by the user on a real device.** The popup z-index fix (Build 42) was enough on its own — the original complaint was actually the weather-options popup rendering with its top behind the pinned header, not the background page's scroll gesture being mechanically blocked, matching the user's own hypothesis from when this was first logged. `touch-action: pan-y` was never applied, since it wasn't needed.

## Build Log 45 (completed)

_Five queued items, all built and verified together in one pass, per "Go ahead and build the build queue"._

### Moon-dial clock: numbers on the moon's dark side are now readable

- [x] `renderDualRingNumbers` (script.js) now looks up each label's color from `WX_MOON_DIAL_BRIGHTNESS`, keyed by `weatherState.moonPhase` — the exact table built earlier by pixel-sampling the real rendering (see Build Queue history), confirmed against the user's own real-device read of New Moon (all bright) and Full Moon (all dark). Bright-side positions keep today's black/dark-red; dark-side positions get white (outer) / light coral (inner); the four genuinely-borderline positions (6 & 12 o'clock, both rings, on the two quarter phases only) get medium grey. Only `moon-dial` is affected — the plain `dual-ring` 24-hour style (no moon background) keeps its fixed colors unchanged, since it doesn't pass a `moonPhase` argument.
- [x] Verified directly: rendered First Quarter and pixel-checked all 24 label fills against the table exactly (`#000`/`#fff`/`#888` outer, `#c0392b`/`#ff8a80`/`#888` inner) — matched perfectly.
- [x] **Caveat that still stands:** the table was derived from this sandbox's emoji font; a visually different font on the user's real device could shift exactly where the terminator falls for the in-between (crescent/gibbous) phases. New Moon and Full Moon are confirmed correct by the user already, since those two don't depend on the terminator's exact position at all.

### Moon phase no longer briefly wrong on page load

- [x] `applyLiveWeatherData` now calls `updateClock()` once the real `weatherState.moonPhase` is in, instead of leaving the analog face showing its placeholder default until the next minute-boundary tick. Verified directly: the moon-dial face shows the real phase emoji within ~1s of load, well before any minute tick.

### Per-category collapse button: one control, double-duty behavior, outdented on subcategories

- [x] The chevron no longer rotates (removed `.category-header-main[aria-expanded="true"] .chevron` transform rule) — it's a static indicator now, so `.category-collapse-btn`'s ▲ (changed back from Build 42/43's "✕") is the only thing that ever shows that glyph on an open header. No more duplicate.
- [x] Double-duty behavior implemented via a new `leafLinksCollapsed` flag alongside `openPath`: a with-subcategories leaf's first collapse-button tap hides just its own links while staying on the path (subcategory rows stay visible/tappable); a second tap (or a flat category's only tap) fully closes the level, same as before. Reset to `false` on any real navigation so own-links always show fresh per the existing fallback rule.
- [x] Outdent implemented by moving where `--depth` gets set — from directly on `.category-name` to the shared `.category-header` wrapper, so it also inherits down to `.category-collapse-btn` (a sibling, not a descendant of `.category-name`). `margin-right: calc(var(--depth, 0) * 2ch)` mirrors the title's `padding-left` indent in the opposite direction.
- [x] Verified directly: chevron computed transform is `none` on an open header; a with-subcategories category needs exactly two taps to fully close (own links hide first, subcategory rows stay reachable, then the second tap closes it); a flat category still closes in one tap; the collapse button visibly shifts left with depth in a 2-level-deep screenshot.

### Home header: collapse-all button now right-justified

- [x] `margin-left: auto` added to `.home-header-actions` — pushes just this element to the header's right edge without touching the already-correct regular category headers (whose `.category-header-main` flex: 1 was doing this incidentally). Verified directly: button sits flush against the header's right edge (14px gap, matching its own padding) instead of flush against "Home."

### Move Entry: drag-hover skip-over-categories bug — hover-settle, with a real gap found and closed during the build

- [x] Implemented the decided approach: `handleHeaderHover` now gates the actual `openCategoryPath` call behind a 220ms settle timer (`HOVER_SETTLE_MS`), mirroring `attachLongPress`'s timer pattern — cancelled immediately if the pointer moves to a different header, or if the drag ends, before it fires. The `.move-drop-target` highlight and `crossTargetId` (read at drop time) still update immediately on hover, so feedback stays instant even though the actual open/collapse waits.
- [x] **Verified the settle delay alone wasn't sufficient — found via direct testing, not assumed:** a scripted slow, continuous, one-directional drag still skipped straight past `test-c`/`test-c-suba`/`test-c-suba-1` to `test-d` even with the settle timer in place. Root cause: the settle delay only stops a *fast sweep that never truly pauses* from opening anything — once a hover does genuinely settle and open a subcategory (the whole point of this feature), the exact same collapse/expand height-asymmetry jump from the original bug still fires right after, since nothing was re-checking the pointer's position against the post-shift layout.
- [x] **Fixed by adding one more piece, not present in the original plan:** immediately after the settle timer fires and calls `openCategoryPath`, it now also re-runs `processDragPosition` against the last known pointer coordinates — the same justification `autoScrollTick` already uses for scroll-driven shifts. This re-syncs the hover state to whatever the just-completed open actually moved under the pointer, so the next real category is correctly detected instead of the app silently holding onto a stale target.
- [x] **Verified directly, and the distinction matters:** a scripted drag that deliberately pauses at each header in turn — moving to that header's live, current position and waiting, the way a real user visually tracking the changing layout would — reaches `test-c-suba-1` correctly every time. A synthetic one-directional sweep that never adjusts to what's now on-screen can still end up past where a target has moved to, since that's a genuine physical consequence of the layout shift itself (the target's on-screen position moved out of the pointer's fixed path), not something a hover-timing change alone can fully eliminate. This matches what the user described wanting (deliberate hover-to-open, no instant cascading) and is confirmed working for that interaction pattern.

### Regression check

- [x] Full Playwright sweep across everything from Build 42-44 plus this build's changes: global exclusivity navigation, Move Entry (single-tile cross-category and same-category), multi-select batch move (including the Build 43 stuck-selection fix), popup z-index, clock context-menu prevention, and all five items above — zero console/page errors throughout.

## Build Log 46 (completed)

_Five queued items, all built and verified together in one pass, per "Build the build queue."_

### Weather widget: lightning flash re-roll rate default changed to every 3 frames

- [x] `WX_LIGHTNING_TUNABLES.rerollFrames` default changed from `1` to `3` in script.js, and the Testing Panel's reset-to-defaults handler updated to match (`= 3` in all three places: the constant, the slider's `.value`, and the display span's `.textContent`) so hitting reset doesn't silently revert to the old every-frame flicker.
- [x] Verified directly: Testing Panel slider and its numeric display both read `3` on a fresh load with no stored override.

### Category headers: chevron removed, every open ancestor now has its own outdented collapse button

- [x] Removed the redundant `<span class="chevron">▾</span>` from all 12 category headers in index.html (tapping the header already opens it) and deleted the now-unused `.chevron` CSS rule from styles.css.
- [x] `renderOpenPath` (script.js): `entry.collapseBtn.hidden` now keys off `!openPath.includes(id)` instead of `!isPathLeaf(id)` — every category on the current chain shows its own button, not just the deepest one; each already gets the correct outdent automatically from its own `--depth`.
- [x] Generalized `collapseLeafCategory()` into `collapseFromCategory(id)`: tapping the leaf's button keeps the old double-duty behavior (first tap hides just its own links and stays open if it has subcategories; second tap, or a flat leaf's only tap, fully closes it); tapping a non-leaf ancestor's button truncates `openPath` back to just before it, closing it and everything open beneath it in one tap. Each header's `.category-collapse-btn` listener now calls `collapseFromCategory(id)` with its own closure-scoped `id`.
- [x] Verified directly via Playwright: with Category C → Sub A → Sub A-1 all open, all three show their own collapse button, correctly outdented (0px / 14.2px / 28.5px at depth 0/1/2); tapping Sub A's button closes Sub A and Sub A-1 in one tap while Category C stays open.

### Weather widget: severe-alert ticker now scrolls at a constant, readable speed

- [x] `applyAlertTicker()` (script.js) now computes `animationDuration` from the track's actual rendered width divided by a fixed `ALERT_TICKER_PX_PER_SEC` (50), instead of relying on `.weather-alert-track`'s old fixed `animation-duration: 14s` in styles.css (kept only as a pre-JS fallback, with a comment noting JS overrides it inline).
- [x] Verified directly: a short mocked alert and a much longer one both measured out to exactly 50px/s, confirming the speed no longer scales with message length.

### Tile usage statistics: creation date, last-used date, use count

- [x] Each tile object gains `createdAt`, `lastUsedAt` (`null` until first opened), and `useCount` (starts at 0). New tiles get these set in `addTileSubmit`'s click handler; existing tiles are backfilled today's date/`null`/`0` via `loadCategoryTiles`'s existing per-tile safety-net loop (same pattern as the prior `id` backfill).
- [x] New `recordTileUsage(tileEl)` function looks up the tapped tile in its category's stored array, sets `lastUsedAt = Date.now()`, and increments `useCount`. Wired into `buildTileElement`'s click listener as the final branch, after the existing `moveMode`/`selectMode` interception branches (which now each `return` so ordinary navigation and move/select handling can't double-fire).
- [x] Not surfaced anywhere yet, by design — recorded silently, no UI change this build.
- [x] Verified directly: tapping a seeded tile with a mocked-`preventDefault` click updates its stored object to `{lastUsedAt: <timestamp>, useCount: 1}`, `createdAt` present from load.
- [x] **Build Planner — future consumers of this data (not yet built, no code written for these):**
  - **Sort category by...** — a per-category display option (e.g. alphabetical / most-used / recently-used / creation date). Open question: per-category setting or one global default? Where does the control live (long-press menu? category settings)?
  - **Usage reports** — some future view surfacing the stats (e.g. "most-used tiles this month," "never opened"). Open question: dedicated page/panel, or folded into an existing settings surface?
  - **Unused-tile cleanup aid** — flag or list tiles with `useCount === 0` past some age threshold, or last used a long time ago, to help the user prune. Open question: what threshold, and is it a passive list or does it offer one-tap deletion?

### Move Entry: dragged tile no longer disappears while dragging back up over unrelated categories

- [x] Implemented the decided fix: `renderOpenPath` (script.js) now also pins open the ancestor chain of whichever category currently contains `dragInfo.currentGrid` (via the existing `categoryAncestorChain`) whenever a drag is active — on top of, not instead of, the real `openPath`. If the tile sits directly in a with-subcategories category's own grid, that grid is forced visible too, even when it isn't the real path's leaf. This is a deliberate, standing exception to the single-open-path rule while a drag is active, per the user's explicit call ("keep wherever the tile currently is open... breaks a rule, but with good intentions").
- [x] `enterGrid` now calls `renderOpenPath()` whenever `dragInfo.currentGrid` actually changes, so the pinned chain updates immediately when the tile crosses into a new grid mid-drag. `finishTileDrag` and `cancelTileDrag` both call `renderOpenPath()` right after clearing `dragInfo`, dropping the pinned exception once the drag ends.
- [x] `dragInfo`'s declaration was moved earlier in script.js (alongside `selectMode`, ahead of `renderOpenPath`'s first call during init) to avoid a temporal-dead-zone `ReferenceError` — the same reason `selectMode` was already declared early.
- [x] Verified directly via a live reproduction (re-run against this build): long-press → grab a tile in Sample Category C's own grid → hover into Sub A (cascading it open) → hover back up to an unrelated ancestor (Category A) without releasing. The tile stays `display: flex` with a non-null `offsetParent` throughout — previously this exact sequence reproduced the reported disappearance (`display: none`, `offsetParent: null`).

### Regression check

- [x] Full Playwright sweep covering all five items above plus the existing collapse/outdent, alert-ticker, and drag-disappear reproductions: zero console/page errors throughout. Confirmed `node --check script.js` passes (catches the dragInfo TDZ issue that would otherwise only surface at runtime).

## Build Log 47 (completed)

_Six queued items, all built and verified together in one pass, per "Go ahead and build everything in the build queue."_

### Category data model: categories are now persisted, ordered data instead of hand-authored HTML

- [x] Added `categoryTree` (localStorage): a flat map keyed by category id, each entry `{name, parentId, order, stripeColor, createdAt}`. A one-time `categoryTreeMigrated` flag gates seeding it from `CATEGORY_SEED_DATA` (script.js) — the exact hierarchy and `--stripe-color` values that used to be hand-typed in index.html (News/Shopping/Entertainment plus the test-a…test-e sample tree), so nobody's layout changes on upgrade. Every category keeps its own `stripeColor` in the data (not just top-level) — matches how they actually rendered before; only the *future color-picker UI* is scoped to top-level, not the underlying schema.
- [x] `renderCategoryTree()` (script.js) walks the tree parent→child, `order`-sorted, and builds each `.category` section from scratch (header, collapse button, and either a flat `.tile-grid` or a `.category-content` wrapper depending on whether it actually has children) into `<main id="categories">`, right after Home and before any of the existing category-wiring code runs. index.html's hardcoded category sections (everything except Home, which stays static/special-cased) are gone — replaced by this render pass.
- [x] Nothing else needed to change: `categoryToggles`, `openPath`/`renderOpenPath`, `categoryAncestorChain`, the collapse-button wiring, `categoryGrids`, and tile loading/rendering all already worked off live `document.querySelectorAll` passes keyed by `data-category-id` — they don't know or care whether an element was hand-typed or just rendered by JS, as long as rendering happens first.
- [x] Verified directly: all 13 categories (Home + 12 migrated) render with correct names, stripe colors, and nesting; deep navigation (3 levels), per-ancestor collapse buttons and their outdent, adding a tile into a dynamically-rendered category, and collapse-all all work identically to before. Re-ran the Build 45/46 hover-settle, drag-disappear, and stuck-selection regression tests against the new rendering — all still pass.

### Weather widget: now auto-updates every 15 minutes while the page stays open

- [x] `scheduleNextClockTick`'s existing per-minute tick (script.js) now also calls `refreshLiveWeather(false)` — cheap every time (a no-op against the cache unless genuinely stale), so it only actually re-fetches (weather *and* location) once 15 minutes have really passed. No new timer introduced; reuses the clock's own proven scheduling.

### Move Entry: up-scroll-to-Home reach fixed by enlarging the trigger zone

- [x] `AUTO_SCROLL_EDGE_PX` raised from `70` to `120` (script.js), `AUTO_SCROLL_MAX_PX_PER_FRAME` from `14` to `20` to cover the larger distance — gives real headroom past a typical phone's status bar/notch, which a one-handed thumb drag couldn't reach into before. Verified directly: the auto-scroll mechanism already reached `scrollY = 0` correctly in isolation: this is an ergonomics fix, not a logic fix, per last build's diagnosis.

### Weather widget: pre-load placeholder is now McMurdo Station, Antarctica (Blizzard)

- [x] `weatherState`'s defaults (script.js) and the matching static markup (index.html, for the very first paint before script.js runs) both changed together: location → "McMurdo Station, Antarctica"; condition → Blizzard (code `1117`); `tempF: -20, hiF: -10, loF: -30, feelsF: -35, windMph: 35, cloudPct: 100, humidity: 60, dewPointF: -25, uv: 0, visibilityMi: 1` — internally consistent (blizzard = high wind, low visibility, full overcast), per the user's confirmed call to reroll the whole placeholder, not just the location text. `moonPhase` untouched (unrelated).

### Weather widget: FALLBACK_COORDS now defaults to Orlando, FL

- [x] `FALLBACK_COORDS` (script.js) changed to `{ lat: 28.5383, lon: -81.3792 }` — real coordinates fed to a real WeatherAPI fetch when geolocation fails, so the location shown is genuinely Orlando's live weather, not placeholder text. Comment above it updated to match (no longer references the old Albuquerque placeholder text, which no longer exists after the McMurdo change above).

### Multi-select move: renamed to Cut/Paste, color-coded — plus a real CSS specificity bug found and fixed

- [x] `updateSelectActionBar()` (script.js) now shows `'Cut (N)'` while selecting and `'Paste (N)'` while picking a destination, replacing "Move Selected"/"Move Here"; Cancel unchanged. Move-only, not a real clipboard copy — same tile objects relocate, matching everything else already decided about this flow.
- [x] Added `--action-go-bg`/`fg` (light green) and `--action-stop-bg`/`fg` (light red) tokens, light/dark pairs, applied to `.select-action-move` and the newly-classed `.select-action-cancel`.
- [x] **Found and fixed a real pre-existing bug while wiring this up:** the color rules weren't rendering at all at first — `.select-action-bar button` (a class + element selector, specificity (0,1,1)) was silently beating a lone `.select-action-move`/`.select-action-cancel` class selector (0,1,0), regardless of source order. This was already true of the *original* blue background before this build, it just apparently was never visually caught. Fixed by qualifying both selectors as `.select-action-bar .select-action-move`/`.select-action-bar .select-action-cancel` (0,2,0), which now correctly wins. Verified directly in both themes: light green `#c8f2c0`/dark green text, light red `#f7c9c9`/dark red text in light mode; the matching dark-mode pairs in dark mode.
- [x] Colors used are the ones already proposed and logged — the user said they'd supply their own; these are a swap-ready placeholder (four CSS variables, styles.css `:root`/`:root[data-theme="dark"]`) until real values arrive.

### Regression check

- [x] Full Playwright sweep: category tree rendering/migration/nesting, deep navigation, per-ancestor collapse buttons, tile-add against dynamic categories, multi-select stuck-selection fix, Move Entry drag-disappear fix, hover-settle (both the deliberate-pause and fast-sweep cases, matching prior documented behavior), chevron removal, alert ticker speed, tile usage stats, lightning reroll default, McMurdo placeholder (all fields), FALLBACK_COORDS, and Cut/Paste labels + colors in both themes — zero console/page errors throughout. Also diffed an old Build 41-era test script (`test_move_entry_cross_v41.js`) against both the pre- and post-this-build code and got identical results either way, confirming its several stale failures predate this build (it doesn't account for Build 45's hover-settle timer) rather than being a regression.

## Build Log 48 (completed)

### Create UI: sticky Home header with a "+" entry point for new Tiles and new Categories

- [x] **Home's category header is now sticky**, anchored just below `.pinned-header` rather than scrolling away with the rest of the page — `.category-header--home` (styles.css) got `position: sticky; top: var(--pinned-header-height, 0px); z-index: 90`. Home's tile-grid stays in normal flow underneath it, unchanged.
- [x] `--pinned-header-height` is kept live by a `ResizeObserver` on `.pinned-header` (script.js), rather than a hardcoded pixel value — it updates automatically whenever the pinned header's real height changes (alert ticker, hourly-forecast content, window resize), so Home's header never drifts out of alignment.
- [x] **"+"** now sits inside `.home-header-actions`, to the left of the collapse-all button — `+  ▲`. Tapping it opens a small "+ Tile" / "+ Category" menu (index.html's `#create-menu-overlay`), reusing the same small-popup pattern as everything else in the app.
- [x] **"+ Tile"** resolves "current location" (`currentLocationId()`: the deepest entry in `openPath`, or `'home'` when nothing's open) to a grid via `categoryGrids.get(destId)` and opens the existing add-tile overlay unchanged — no new tile-creation logic needed.
- [x] **"+ Category"** is new: a name-only overlay with sibling-name conflict detection (case-insensitive, scoped to the same `parentId`) and empty-name rejection, both shown as an inline error without closing the overlay. On success, writes a new `categoryTree` entry (`newCategoryId()`, mirroring `newTileId()`'s pattern; `parentId` = current location, or `null` if that's Home; `order` = one past the current max sibling; `stripeColor: null`, deferred to the still-unbuilt color-picker item) and calls `saveCategoryTree`.
- [x] **The flat-to-nested transition (a category gaining its first subcategory) works via full re-render, exactly as planned — no DOM surgery.** `wireCategoryHeaders()` and `wireTileGrids()` (script.js) were extracted from their original one-time `forEach` calls into reusable functions; `rebuildCategoriesAndTiles()` tears down everything under `#categories` except Home, re-renders from the updated `categoryTree`, and re-wires both, then calls `renderOpenPath()` to restore whatever was open. Also defensively exits move/select mode first, since either would otherwise hold stale references to about-to-be-destroyed DOM.
- [x] Verified directly via Playwright: Home's header sticks exactly at the pinned header's live-measured height, both scrolled to top and scrolled down; `+ Tile` correctly targets Home when nothing's open and the currently-open category otherwise; `+ Category` creates both a new top-level category and a new subcategory of an already-open (previously flat) category — confirmed the target category's own tiles (including one added earlier in the same test) survived the flat→nested rebuild intact, the new subcategory rendered correctly nested, and `openPath` survived the rebuild unchanged; duplicate and empty category names both correctly rejected with an inline message, overlay staying open; dark-mode error styling picks up the right tokens. Full regression sweep (drag-disappear fix, hover-settle, stuck-selection, collapse outdent, lightning/alert-ticker/usage-stats from prior builds) still passes — zero console errors throughout.

## Build Log 49 (completed)

All five queued items, built in order and verified together at the end.

### Home header: sticky-position bug fixed via `position: fixed`

- [x] `.category-header--home` switched from `position: sticky` to `position: fixed` (styles.css), exactly per the root-cause: sticky's containing block (`.category--home`, only the header's own height plus Home's short grid tall) ran out of room the moment News's section touched it. Fixed has no such containing-block edge case. `left: 50%; transform: translateX(-50%); width: 100%; max-width: 900px;` added on top of the queue's original `left/right: 0` proposal — mirrors `main`'s own centered 900px column (`main { max-width: 900px; margin: 0 auto }`) instead of stretching edge-to-edge on wide screens; on phone widths (this is mobile-first) that column is the full viewport anyway, so it's a no-op there and only actually matters on desktop.
- [x] A second `ResizeObserver` (script.js, alongside the existing `.pinned-header` one) measures `.category-header--home` and writes `--home-header-height`; `.category--home .tile-grid` picks it up via `padding-top` to reserve exactly the space the header used to occupy in normal flow. Reads `.offsetHeight` rather than the observer entry's `contentRect` — `contentRect` is content-box only and would have under-reported by the header's own 10px/14px padding, leaving a gap.
- [x] Verified via Playwright: `.category-header--home`'s `getBoundingClientRect().top` is bit-for-bit identical before and after scrolling 5000px down (screenshot-confirmed too — News, Shopping, etc. scroll fully out of view while the header and its "+"/collapse-all buttons stay pinned exactly in place).

### Per-category "+" tile removed

- [x] `buildTileAddButton()` and its two call sites in `buildCategorySection()` deleted; Home's hand-authored `.tile-add` button removed from index.html. The three `insertBefore(x, grid.querySelector('.tile-add'))` anchor sites (`addTileSubmit`, `wireTileGrids`, `confirmMoveSelected`) all switched to plain `appendChild` — actually simpler, since there's no longer a reference node to look up. `wireTileGrids()` lost its per-grid add-button click wiring entirely (nothing left to wire — the global "+ Tile" flow from Build 48 already supersedes it). The `:not(.tile-add)` filters (`findNearestTile`, `reflowWithinCurrentGrid`'s siblings array, the click-tile check) simplified to drop the now-always-true clause. Dead `.tile-add`/`.tile-add:hover`/`.tile-add:focus-visible` CSS rules removed; `.tile-grid.move-mode .tile:not(.tile-add)` simplified to `.tile-grid.move-mode .tile`.
- [x] The remaining four `.tile-add` references inside `finishTileDrag`'s cross-category branches and `enterGrid` were deliberately left alone here (they'd have degraded harmlessly to `insertBefore(x, null)` = `appendChild` anyway) — those branches get deleted wholesale by the Move Entry item below, not touched twice.
- [x] Verified via Playwright: zero `.tile-add` elements anywhere in the rendered DOM.

### Home header "+": 2x size, green tile chip

- [x] New `#create-btn` ID-selector rule (styles.css) — `font-size: 1.6rem` (2x the shared `.home-header-action-btn`'s `0.8rem`), `background`/`color` from the existing `--action-go-bg`/`--action-go-fg` tokens (Build 47's Cut/Paste green, reused rather than adding a third green), `border-radius: 8px` matching real `.tile`s. ID specificity beats the shared class rules (including its `:hover`) with no `!important` needed; `#collapse-all-btn` keeps the plain `.home-header-action-btn` look, untouched.
- [x] Verified via Playwright computed styles: `font-size` 25.6px (= 1.6rem at the 16px root), `background-color` `rgb(200, 242, 192)` (exactly `--action-go-bg`'s `#c8f2c0`), `border-radius` 8px. Screenshot-confirmed it reads as a clean green square chip next to the collapse-all button.

### Move Entry: drag restricted to same-category reorder; Select fixed to reach Home

- [x] Removed entirely: `handleHeaderHover`/`clearHeaderHover`, `HOVER_SETTLE_MS`, `dragInfo.crossTargetId`/`lastHeaderEl`/`hoverSettleTimer`, `enterGrid`, the `dragInfo.currentGrid` vs. `dragInfo.grid` distinction (now just `dragInfo.grid` throughout), `finishTileDrag`'s `crossTargetId`/`liveCategoryId` branches (collapsed to the one same-category reorder-and-save path), and the Build 46 "pinned chain" block in `renderOpenPath` (`pinnedGrid`/`pinnedCategoryId`/`pinnedChain`/`pinnedOwnGrid`). `processDragPosition` now just calls `reflowWithinCurrentGrid` + `followPointer` unconditionally — no more under-pointer header/grid detection. Dead `.category-header.move-drop-target` CSS rule removed alongside it.
- [x] **Select fixed to reach Home**, per the gap this surfaced: `updateSelectActionBar` and `confirmMoveSelected` (script.js) both switched from `openPath.length > 0 ? openPath[...] : null` (Paste disabled with nothing open) to calling the existing `currentLocationId()` helper (Build 48's same "nothing open = Home" convention already used by Create) — Paste is now always enabled and Home is a reachable destination for the first time. The "choose a destination" placeholder message is gone since a destination is now always resolvable.
- [x] What stayed exactly as planned: same-grid reorder (`reflowWithinCurrentGrid`, nearest-tile-center detection), auto-scroll, the tile-menu's "Move" entry point, Select's tap-to-toggle/Cut-Paste labels/colors, and Build 47's `AUTO_SCROLL_EDGE_PX` 120 value (now serving only same-category scrolling, its original Home-reaching purpose moot but harmless).
- [x] Verified via Playwright: same-category drag reorder still works exactly as before (dragged tile 1 to position 3 in a 5-tile grid, confirmed new order `[2, 3, 1, 4, 5]`, zero page errors, zero regressions in the long-press→tile-menu→Move flow). Separately: long-press a tile → tile menu → Select → collapse all categories (nothing open) → action bar correctly reads "Destination: Home" with Paste enabled (previously would've read the disabled placeholder) → confirmed Paste actually appended the tile into Home's own `.tile-grid`.

### Settings: site title rename

- [x] New "Site Name" `options-section` added to `#settings-overlay` (index.html) with a `#site-name-input` text field, following the `weatherApiKeyInput` pattern exactly. `script.js`: `applySiteName()` reads `localStorage['siteName']` (falling back to `'Home'` when unset/empty) and writes both `document.title` and `.site-title`'s `textContent`; a `change` listener updates storage and re-applies live. Explicitly scoped to the `<h1 class="site-title">` — the separate `<h2 class="category-name">Home</h2>` inside `.category--home` (the Home *category's* name) is untouched.
- [x] Verified via Playwright: setting the field to "My Custom Home" updates both the tab title and the visible header immediately; a full page reload preserves it (`localStorage` round-trip); clearing the field back to empty reverts both to the original "Home" default.

### Regression check

- [x] Full Playwright pass across all five items plus a same-category drag-reorder sanity check: zero page errors throughout except the two pre-existing, unrelated ones already tracked separately (missing favicon 404 in the Build Planner; `api.weatherapi.com` blocked by this sandbox's network policy, as noted since Build 44 — not a regression, the real deployed page reaches it fine from the user's own device).

## Build Log 50 (completed)

Both queued items, built together.

### Weather widget: fixed the every-minute reset

- [x] `loadLiveWeather`'s fresh-cache branch (script.js) is now a genuine no-op, not just a skipped network call: a new `lastAppliedFetchedAt` guard (compared against `cache.fetchedAt`) skips re-running `applyLiveWeatherData` — the full temps/wind/extras/alert-ticker/condition-rebuild pipeline — when it's already been applied for that exact cached fetch. `applyLiveWeatherDataIfNew(data, fetchedAt)` wraps all three call sites (fresh-cache serve, a real fetch landing, and the fetch-failed-fall-back-to-stale-cache path) so none of them re-render redundantly.
- [x] The one piece that *does* need to keep progressing every minute regardless — the sunrise/sunset gradient and star/cloud-tint math, driven by wall-clock time rather than weather data — is now called directly: `renderWeatherSkin()` runs every minute from `scheduleNextClockTick()`'s own tick, independent of whether `refreshLiveWeather` actually did anything.
- [x] Verified conceptually via code (this specific 15-minute-vs-1-minute timing isn't practically observable in a single Playwright run) — confirmed no page errors from the change across every other test in this session's full regression pass below.

### Tile + category long-press multi-select, bottom-bar action menu, tile-menu popup retired

All of it landed exactly as speced in the Build Queue (range-select, Select All/Clear, scale/lift, category subtree select/deselect, the checkmark, the six-icon bottom bar, category Edit) — see prior README entries above for the full design. What's below is what happened during the build itself.

- [x] **`selectMode` now carries a `kind: 'tile' | 'category'`.** Tile selection is unchanged in shape (`grid`, `categoryId`, `selectedIds`); category selection is new (`selectedIds` holds the explicitly-pressed *roots* — may contain redundant entries already covered by an ancestor, which is fine, see `prunedSelectedCategoryRoots()`). Both carry a `rangeAnchorId`, set once at entry and fixed for the session (per the earlier decision: range-select is always anchor-to-newest-press, not chained between presses).
- [x] **Category subtree select/deselect:** `categorySubtreeIds(rootId)` (recursive via the existing `categoryChildren()`) plus `refreshCategorySelectionVisuals()` (unions every selected root's subtree, toggles each category's `.category-select-check` visibility) do the cascade both ways — selecting a root shows checkmarks all the way down, deselecting it (tap it again) hides them all the way down, exactly per the user's own worked examples.
- [x] **Range-select** (`rangeSelectTiles`/`rangeSelectCategories`): a long-press on tiles indexes `Array.from(grid.children)`; for categories, `visibleCategoryHeaderIds()` walks `categoryToggles` filtered to `offsetParent !== null` (a collapsed subcategory's header is hidden along with the rest of its parent's content, so this naturally only ever ranges over what's actually visible/tappable). Both select everything positionally between the fixed anchor and the newly-pressed item.
- [x] **Scale/lift**: `.tile-selected` (styles.css) gained `transform: scale(1.05)` plus `.tile.move-grabbed`'s own drop-shadow, minus its rotate — verified via computed style, `matrix(1.05, 0, 0, 1.05, 0, 0)`.
- [x] **The bottom bar** (`#select-action-bar`, index.html) rebuilt from a 2-button bar into six icon buttons — 🅰️ Select All, ✂️ Cut, ✏️/🔧 Rename-or-Edit, 📋 Paste, 🗑️ Delete, 🆑 Clear — reusing the existing green/red action-color tokens for Cut+Paste and Delete respectively. `updateSelectActionBar()` now branches on `selectMode.kind`: hides 🅰️ for categories, swaps the Rename button's icon/label/aria-label to 🔧/"Edit category", and disables it whenever the (pruned) selected count isn't exactly 1.
- [x] **`#tile-menu-overlay` is gone** — deleted from index.html along with `openTileMenu`/`closeTileMenu`/its consts in script.js. Long-press now calls `handleTileLongPress`/`handleCategoryLongPress` directly, which either enters select mode or (if already in it) range-selects. The now-orphaned `.tile-menu-actions`/`.tile-menu-action`/etc. CSS was **not** deleted, though — a mid-build check caught that those classes are still live, shared with the unrelated "+" Create menu (`#create-menu-overlay`'s "+ Tile"/"+ Category" buttons, Build 48); only the popup's own markup and script.js wiring were dead.
- [x] **Category Edit** reuses the create-category dialog (`#add-category-overlay`) rather than being new: an `addCategoryTargetId` (null while creating) switches the submit handler between insert and rename-in-place, with the dialog's title/button text swapped to "Edit Category"/"Save" via `openEditCategory(id)`. Per the user: Edit always targets the *topmost* selected category (the one actually pressed, never an auto-included descendant) and disables outright once more than one root is selected — both confirmed directly against the user's own two examples (selecting a top-level category vs. a mid-tree "Subcategory B").
- [x] **Category Cut+Paste** (`moveCategorySubtree`) reparents a whole subtree by changing its root's `parentId`/`order` in `categoryTree` — guarded against moving a category into itself or one of its own descendants (would orphan it into an unreachable cycle), which silently no-ops rather than erroring. Category Delete removes every id in the subtree from both `categoryTree` and its own `category-tiles-<id>` storage. Both reset `openPath = []` before rebuilding — a moved-or-deleted category can invalidate whatever `openPath` was pointing at (including, now that categories are selectable, the possibility of cutting the very category you're currently navigated inside of), and Home is the one state guaranteed to still be valid afterward.
- [x] **Move Entry's trigger changed, per the user, its mechanics didn't:** there's no more "tap Move in the popup" step — long-press now goes straight into select mode, and *continuing the same touch into a drag* (without lifting first) is what starts Move Entry instead. `armDragFromLongPress` keeps listening on the pointer that triggered the long-press; if it moves past a small threshold before lifting, it exits select mode and hands off into the existing `enterMoveMode`/`startTileDrag` (Build Log 49's same-category drag-reorder, completely unchanged). Lifting without moving just leaves the tile selected, same as any other long-press.
- [x] **Two real bugs found and fixed while wiring the above up, not by design:**
  - `attachLongPress`'s click-suppression used `e.stopPropagation()`, which does not stop *other* listeners on the same element in the same phase from also firing — harmless with the old tile-menu-popup callback (nothing selected yet, so the tile's own click handler's fallback path was a no-op), but a real bug now that a long-press enters select mode directly: the leftover `click` event right after was reaching the tile's own click handler, which saw select mode already active and immediately toggled the just-made selection back off. Fixed with `e.stopImmediatePropagation()` instead — confirmed via Playwright, a fresh long-press now reliably leaves the tile selected.
  - `armDragFromLongPress` silently stopped receiving pointer events partway through a drag — confirmed directly via a raw pointer-event logger: only one `pointermove` ever arrived after crossing the arm threshold, then nothing, not even `pointerup`. Root cause: tiles are real `<a href>` elements, and nothing had ever called `preventDefault()` on the *original* long-press's `pointerdown` — so once the same held pointer moved far enough, Chromium's own native link-dragging kicked in and hijacked the rest of the gesture. Fixed by adding `e.preventDefault()` to `attachLongPress`'s pointerdown handler itself (suppresses native drag-initiation and text-selection/focus-on-mousedown; does not affect the eventual click's own default navigation) — re-verified with the same raw logger, all 10 drag-motion steps plus the final pointerup now arrive correctly.
- [x] **Full Playwright regression pass**, one browser session per scenario group, zero page errors throughout except the two pre-existing unrelated ones (missing favicon, sandboxed network blocking the live WeatherAPI host):
  - Tile long-press selects (not un-selects); range-select via a second long-press picks the correct positional span; Select All selects every tile in the grid and correctly disables Rename; Clear empties the selection and hides the bar.
  - Cut → navigate → Paste correctly moved a tile into Home, with the bar's status text and Paste's enabled state both correct throughout.
  - Selecting a top-level category checked it and both of its nested subcategories (colored to match its own stripe — computed color matched the stripe hex exactly); deselecting it unchecked all three again.
  - Category range-select across three top-level categories selected exactly those three and correctly excluded a fourth outside the range; Edit correctly disabled with more than one root selected.
  - The Edit dialog opened prefilled with the selected category's real name, titled "Edit Category," and the rename persisted to the DOM and `localStorage` correctly.
  - Category Cut+Paste correctly reparented a category in `categoryTree`; the cycle guard correctly refused pasting a category into its own subcategory (parent left unchanged, subtree left intact) when tested by actually navigating inside that subcategory first and attempting the paste from there.
  - Category Delete removed a flat category entirely; tile Delete removed exactly the selected tile (including the existing double-confirm easter egg still firing correctly).
  - Move Entry still works end-to-end via the new long-press-then-drag gesture — confirmed the grid enters `move-mode`, select mode correctly exits the moment the drag arms, and the drop actually reordered the tiles; also confirmed `moveMode`'s existing few-seconds-of-inactivity window (Build 49, lets you pick up another tile without re-long-pressing) is unaffected.
  - A plain, quick tap on a tile still navigates normally (opens in a new tab) — confirms the new pointerdown-level `preventDefault()` didn't break ordinary taps.
  - Screenshots confirmed the bar's visual design in both light and dark themes: tile mode shows all six icons; category mode correctly hides 🅰️ and shows 🔧 instead of ✏️; the category checkmark renders to the left of the title in the right color.

## Build Log 51 (completed)

### Move Entry fix: two separate touches, not one continuous gesture — and the bar never hides for it

- [x] **Reported:** Move Entry wasn't working. Build 50's design (a continuous long-press-then-drag, without lifting, that exits select mode the moment the drag arms) was wrong. **Corrected design, per user:** long-press to initiate (bar opens, tile checked/floating) → **let go** → a *separate*, fresh touch-and-drag on that tile (or any other tile in the same category) is what actually moves it. The bar stays visible the entire time select mode is active — dragging doesn't hide it. While a tile is grabbed this way, any other single tile in the category can also be picked up and dropped without re-long-pressing. The whole session — not a separate "move mode" concept — auto-closes after 5 seconds of inactivity.
- [x] **`enterMoveMode` no longer exits select mode.** The `if (selectMode) exitSelectMode();` line from Build 50 is gone — the two now coexist for as long as select mode itself stays open. `exitSelectMode` is what tears both down together: it now also calls `exitMoveMode()` (captures `selectMode`'s data into a local first, since `exitMoveMode`'s own cleanup — cancelling any in-progress drag — can indirectly call back into `updateSelectActionBar`, which would otherwise re-arm the very timer being torn down if it read `selectMode` still non-null at that point).
- [x] **The 5-second timeout moved from Move Entry onto select mode itself.** A new `selectModeTimeoutId`/`resetSelectModeTimeout()` pair (mirroring the existing `moveModeTimeoutId`/`resetMoveModeTimeout()` shape exactly) closes the whole session — bar included — after 5s of inactivity. `resetMoveModeTimeout()` now also calls `resetSelectModeTimeout()` (so live drag activity keeps both alive), and `updateSelectActionBar()` calls it too at its own top — since nearly every select-mode interaction (toggling, range-select, Select All, Cut, navigating while picking a destination) already ends by calling that function, this covers all of them for free without needing resets sprinkled at every call site individually.
- [x] **`armDragFromLongPress` (Build 50, watched the same continuous pointer past the long-press) is gone, replaced by `armTileDragFromSelectMode` (script.js) — triggered from each tile's own `pointerdown`, not tied to whatever pointer opened select mode.** Gated the same way as before (movement past a 20px threshold before committing to `enterMoveMode`+`startTileDrag`, so a plain tap still falls through and toggles selection normally) — just decoupled from the long-press's specific touch, since the second touch is now genuinely separate. Carries the same `e.preventDefault()` fix from Build 50 (tiles are real `<a href>` links; without it, Chromium's native link-dragging can hijack the gesture) on its own triggering `pointerdown`, not just inside `startTileDrag`.
- [x] `handleTileLongPress` simplified back down to just select/range-select — it no longer arms anything itself.
- [x] Verified via Playwright, the full corrected flow: long-press a tile → release → bar visible, tile checked, `moveMode` *not* yet active → a separate touch-and-drag on that same tile → bar stays visible throughout, `moveMode` active, drop reorders correctly, tile stays checked afterward → a second separate drag on a *different*, never-explicitly-selected tile also reorders correctly, bar still visible the whole time. Confirmed idle select mode (no drag at all) still auto-closes after 5s, category select mode gets the same 5s auto-close, and a slower Cut+Paste flow (two 3-second pauses with an interaction — a category navigation tap — in between) survives past 5s total elapsed and completes correctly, since each interaction resets the timer rather than a hard 5-second ceiling from entry. Full regression re-run of every other Build 50 scenario (tile/category select, range-select, Select All, Clear, Cut+Paste both kinds, category Edit, the cycle guard, single and batch delete) still passes unchanged — zero page errors throughout.

## Build Log 52 (completed)

### Organize Mode: moveMode merged into selectMode, drop/tap corrected, idle-only timeout, weather clouds fixed via z-index layering

- [x] **Redesign, per the user: `moveMode` and tile-kind `selectMode` are now one state ("Organize Mode"), not two coexisting ones.** Long-press on a tile enters it; a fresh touch-and-drag on any tile in that grid (`armTileDragFromSelectMode`, script.js) drags/reorders it directly — no separate `enterMoveMode()`/`exitMoveMode()` step, no `moveMode` variable, no second timeout, no tap-away-exit document listener. The grid's own `.select-mode` class (added at `enterSelectMode()`) now carries everything the old `.move-mode` class did (styles.css: resting drop-shadow + `touch-action: none`) for the *entire* select-mode session, not just once a drag has already started. Category select mode is untouched — the two kinds still never combine, per the user's explicit "may NOT be combined."
- [x] **This directly fixes the real-device drag failure (root-caused last session).** `touch-action: none` used to only apply once `moveMode` was already active — i.e. *after* a drag's 20px arm-threshold had already been crossed — leaving a window where a real touchscreen's native scroll could claim the gesture first, silently starving `armTileDragFromSelectMode`'s pointermove watcher. Now that `.select-mode` alone carries `touch-action: none`, it's in effect from the moment long-press fires, closing that window entirely. (Playwright can't directly prove this — it only simulates mouse input, not real touch-action gesture-claiming — but the CSS gap that caused it is now structurally gone.)
- [x] **Dropping a dragged tile un-checks just that one tile** (`finishTileDrag`, script.js) — drag/drop only ever moves one tile at a time, so dropping can only ever apply to that single tile. A *cancelled* drag (`cancelTileDrag`, e.g. pointer leaving the viewport) isn't a real drop and leaves selection untouched.
- [x] **Drag/drop disables entirely whenever 2+ tiles are selected**, per the user — a new rule. Guarded at the single remaining trigger point, `buildTileElement`'s pointerdown handler: `armTileDragFromSelectMode` is never even called while `selectMode.selectedIds.size > 1`. A plain tap still works normally regardless of how many are selected.
- [x] **A plain tap on a tile right after a drag now toggles its selection again**, instead of being swallowed. The old `moveMode`-branch that unconditionally ate every click for a dragging grid is gone; the only click still swallowed is the one that's the direct tail end of the very gesture that just finished a drag (tracked via the pre-existing `justFinishedDrag` one-tick flag) — a genuinely separate, later tap falls straight through to select mode's own toggle branch.
- [x] **Timeout redesign: Organize Mode only auto-closes after 5s while idle with *nothing* selected.** The instant anything is selected, it waits indefinitely for the user to act (Cut/Paste, Rename/Edit, Delete, or a drag) instead of closing out from under them — `resetSelectModeTimeout()` now only arms the 5s timer when `selectedCount() === 0`, and clears it (no timer at all) otherwise. Applies identically to category select mode.
- [x] **Weather widget: clouds no longer reset every minute.** Root-caused last session: `renderWeatherSkin()`'s "preserve existing clouds" path re-appended every existing `.wx-skin-cloud` element on every call just to keep it stacked above the overlay/precip layers, and re-appending an already-connected node turned out to reset its running CSS animation's effective position (its negative `animation-delay` gets re-evaluated from the new connection moment). Fixed by switching the sky-layer stack to explicit `z-index` values (stars: 1, cloud tint overlay: 2, precipitation: 3, floating clouds: 4, lightning flash: 5 — styles.css) instead of relying on DOM append order, so `renderWeatherSkin()` now leaves stars/precip/flash alone once already connected and never touches existing clouds' DOM position at all. Snow/fog/hail (canvas+JS-driven) were never affected by this and remain unaffected by the fix.
- [x] **Verified via Playwright**, the full merged flow: long-press → `.select-mode` present + `touch-action: none` in effect immediately + tile checked + bar visible → a separate touch-and-drag reorders correctly, bar stays visible throughout, tile ends up **unchecked** after drop → a genuinely separate plain tap on that same tile re-selects it normally → a second drag on a different, never-explicitly-selected tile still works → selecting a second tile disables drag entirely (position unchanged after an attempted drag) while plain taps keep working → idle Organize Mode with nothing selected auto-closes at 5s (tile and category alike) → Organize Mode with something selected stays open past 6s, closing only on explicit Clear → Cut+Paste still completes correctly. Separately verified the weather fix: triggering `renderWeatherSkin()` twice in a row (via the sunrise-gradient toggle, the same code path Build 50's per-minute tick uses) leaves every existing cloud's DOM node identity and `animation-delay` unchanged, and its drift position progresses forward smoothly with no snap-back. Full regression re-run of Select All, batch Delete (including the 10%-chance second confirm), and category Edit all still pass unchanged. Zero page errors throughout.

## Build Log 53 (completed)

### Category Sort (Alphabetical / Most Used / Last Used), added to the Edit Category dialog

- [x] **Context:** compared the Phase 2 Part 3 spec (category-level actions: Remove, Rename, Reassign Stripe Color, Sort Alphabetically, Merge Into..., Add Subcategory Here, plus top-level Create) against what's actually built. Several conflicts against that doc, per its own precedence rule, were flagged to the user rather than silently resolved — see Build Queue below. **Decision made this round:** keep the existing select-mode + bottom-bar paradigm (not the doc's popup-menu design), and generalize the doc's single "Sort Alphabetically" action into three sort modes living in the existing Edit Category dialog.
- [x] **`sortCategoryTiles(categoryId, comparator)`** (script.js) — sorts that category's own direct tiles only (`loadCategoryTiles`/`saveCategoryTiles`), never cascading into nested subcategories, matching the original spec's non-cascade rule generalized across all three modes. Non-destructive reorder, so it applies immediately with no confirmation prompt, and calls `rebuildCategoriesAndTiles()` the same way the dialog's existing Rename path already does.
- [x] **Three buttons — Alphabetical, Most Used, Last Used** — added to a new "Sort Tiles" section in the Add/Edit Category overlay (index.html), shown only in Edit mode (`editCategorySortSection.hidden` toggled in `openEditCategory`/`openAddCategory`) since a brand-new category has no tiles yet to sort. Alphabetical uses `localeCompare`; Most Used sorts by `useCount` descending; Last Used sorts by `lastUsedAt` descending, with never-used tiles (`lastUsedAt` still `null`) sorting to the end. The dialog stays open after sorting (unlike Rename, which closes) so the user can try a different order without reopening it.
- [x] **Verified via Playwright:** sort section hidden when creating a new category, visible when editing an existing one; all three sort modes produce the correct order against a 4-tile fixture engineered to differ under each mode; the dialog remains open after each sort; zero page errors.

## Build Log 54 (completed)

### Category Sort made a cancellable preview, Remove Category friction/count, popups top-anchored with target visible below

- [x] **Category Sort (Build 53) is now a preview, not an instant apply.** `sortPreviewOriginalTiles` snapshots the category's tile order the moment the Edit dialog opens; each of the three Sort buttons (`applySortPreview`, script.js) reorders the live grid DOM only — never storage — always re-previewing from that same original snapshot, so switching between sort modes freely never stacks. **Save** (`commitSortPreview`) persists whatever order the DOM ends up in, mirroring `finishTileDrag`'s own read-DOM-order-back-to-storage pattern; closing any other way (× / outside-tap, via `revertSortPreview`) reverts the live DOM back to the original snapshot so an unsaved preview never lingers looking applied.
- [x] **Remove Category now shows its impact and scales its confirmation friction.** The shared `tile-confirm-overlay` (index.html) gained two new, conditionally-shown pieces: a counts line and a typed-confirmation input, both driven through a new `opts` param on `openTileConfirm(text, onYes, opts)`.
  - **Impact count** (`opts.counts`) — computed recursively across every selected (pruned) category root via `categorySubtreeIds`: tile count + subcategory count + combined total, in the exact wording from the original spec doc. Shown whenever there's anything nested at all, independent of the friction tier below — even a category with 0 tiles anywhere but a subcategory nested under it still shows that subcategory count.
  - **Friction** (`opts.requireTypedYes`) — scales on whether there's at least one tile anywhere in the subtree (recursive). Zero tiles anywhere (subcategories allowed) stays a plain Yes/No. One or more tiles anywhere requires typing **"yes"** (case-insensitive, via a live `input` listener toggling the Confirm button's `disabled` state) — deliberately not "DELETE"/all-caps, to avoid fighting mobile autocapitalize.
  - **No easter egg for categories** — the category branch of `selectActionDeleteBtn`'s handler no longer shares the tile-delete 10%-chance "really sure?" prompt; that's tile-delete only now, unconditionally.
- [x] **Popups anchor near the top instead of centering, and keep their one specific target visible immediately below.** `.help-overlay`'s flex alignment changed from `center` to `flex-start` with `padding-top: calc(var(--pinned-header-height, 0px) + 16px)` — the same live-tracked variable the sticky Home header already anchors to — so every popup now sits just below the search bar instead of getting hidden behind an open on-screen keyboard. A new `scrollTargetBelowPopup(panelEl, targetEl)` helper scrolls the underlying page (the popup itself is `position: fixed`, unaffected) so a popup's one specific existing target — the tile being renamed, the category being edited, the single item in a delete confirm — ends up right below the popup's bottom edge. No-ops (and the popup just top-anchors with nothing special below) when there's no single target: Add Tile, Add Category, Settings, Help, or a multi-select delete confirm. Wired into `openTileRenameFor`, `openEditCategory`, and both branches of the delete-confirm call site.
- [x] **Verified via Playwright:** Sort preview/switch/cancel/save all behave exactly as decided (DOM-only preview, storage untouched until Save, full revert on cancel); Remove Category's three fixtures (fully empty, zero-tiles-with-a-subcategory, tiles-somewhere-in-subtree) each produced the correct counts text and friction tier, including the wrong-word-stays-disabled / case-insensitive-"YES"-enables-it check, and confirmed no second "really sure?" prompt ever appears for a category delete; popup positioning confirmed both for a no-target popup (anchored near the pinned-header height, not viewport-centered) and a target popup (using a short 600px viewport with several categories expanded to guarantee real scroll room — a target already at the very top or bottom edge of all scrollable content is a known, physically-inherent limit of a scroll-based approach, not a defect). Full regression re-run of single-tile delete, Select All + batch delete, Cut+Paste, and plain category rename all still pass unchanged. Zero page errors throughout.

## Build Log 55 (completed)

### Popups flush to top, Collapse-All scrolls to top, category Cut+Paste fixed, Home gets destination-select + its own Settings dialog, and a checkmark/name layout regression

- [x] **Checkmark/name layout bug (caught mid-round, not previously logged):** long-pressing a category pushed its name to the far right instead of sitting it just after the checkmark. Root cause: `.category-header-main` (styles.css) still had `justify-content: space-between`, a leftover from when that button held a chevron icon on its right edge (removed long ago); with the button's only two possible children now being the checkmark and the name, `space-between` shoved them to opposite far edges the instant the checkmark became visible. Fixed by changing it to `justify-content: flex-start`.
- [x] **Popups now anchor flush to the very top of the screen**, not just below the search bar. `.help-overlay`'s `padding-top: calc(var(--pinned-header-height, 0px) + 16px)` is gone — it falls back to the same flat 20px as every other edge, since the dimmed backdrop already makes everything behind a popup unusable, so there's no reason to reserve space above it. `scrollTargetBelowPopup` (Build 54) needed no changes — it already measures the panel's live position at scroll time, so it adapted automatically.
- [x] **"▲ Collapse all categories" now also scrolls back to the top of the page** (`window.scrollTo({ top: 0 })` added to `collapseAllCategories()`), so Home's first entry is back in view instead of the viewport staying wherever it happened to be scrolled.
- [x] **Category Cut+Paste destination-picking fixed.** The category header click handler now checks `pickingDestination` *before* the category-toggle branch — while picking a Cut's destination, every header tap navigates there (`openCategoryPath(id)`) regardless of `selectMode.kind`, instead of falling into `toggleCategorySelected(id)` and leaving the destination stuck on wherever the Cut started.
- [x] **Home can now be selected as a Cut/Paste destination by tapping it**, and — per the user, confirmed this session — is a no-op otherwise (no other behavior added outside destination-picking). Home's header (`.category-name`, a plain `<h2>` with no prior click handler at all) now has one: while `pickingDestination` is true, tapping it calls `collapseAllCategories()` (since "nothing open" is exactly what makes Home the current destination via `currentLocationId()`, and reusing it means Home's tap also gets the new scroll-to-top behavior above for free). Confirmed pasting a *category* into Home promotes it to top-level exactly as expected — `moveCategorySubtree` already converted `newParentId === 'home'` to `parentId: null`; nothing else was blocking it.
- [x] **Home Settings dialog**, opened by long-pressing Home's header — per the user, no reason to run Home through the full select-mode/bottom-bar flow when Sort (and eventually a Home-only background color picker) is all it needs. Reuses the existing Add/Edit Category overlay purely for its Sort section (`openHomeSettings()`, script.js): the Name field section is hidden (nothing there for it to edit — Home isn't a `categoryTree` entry), and Save (`addCategorySubmit`) special-cases `addCategoryTargetId === 'home'` to just commit the Sort preview and close, skipping the name/duplicate-check logic entirely. The existing preview/commit/revert Sort machinery needed zero changes — it was already generic over `categoryId`, `'home'` included, since `categoryGrids`/`loadCategoryTiles`/`saveCategoryTiles` already treat Home like any other category under the hood.
- [x] **Verified via Playwright:** the checkmark/name layout fix; popups landing within the flat 20px top edge instead of below the header; a real, previously-scrolled position resetting to `scrollY === 0` after Collapse All; the exact reported category Cut+Paste flow (navigate into a subcategory → long-press → Cut → destination starts as itself → tapping a different category now correctly changes the destination and leaves no stray checkmark → Paste correctly reparents it); Home's tap-when-idle no-op, tap-while-picking-a-destination selecting it (both for a tile Cut and confirming the resulting category promotion to top-level), and long-press opening Home Settings with the Name section hidden and Sort visible, previewing and committing correctly to `category-tiles-home`. Also confirmed the target-visible-below-popup mechanism (Build 54) is unaffected by the flush-to-top move — with realistic scroll room it still lands within rounding error; a tight test fixture can clip it against the document's actual bottom edge, the same already-documented physical limit as before, now just reached a bit sooner given how much closer to the top the target must land. Full regression re-run of tile Cut+Paste, category Sort preview/cancel for a non-Home category, and Remove Category's friction/count all still pass unchanged. Zero page errors throughout.

## Build Log 56 (completed)

### Delete confirmations name the item, Home's tap target widened, and the Phase 2 Part 4 Whole-Structure Reorg Tree Tool

- [x] **Delete confirmations now name the specific item.** A single-tile delete reads "Are you sure you want to remove the [Name] tile?"; a single-category delete reads "Are you sure you want to remove the [Name] category (and everything in it)?" — both pulled from the actual tile `<span>` text / `categoryTree[id].name` rather than the old generic "this tile"/"this category" wording. A multi-select delete still reads "N tiles"/"N categories," per scope. The impact-count wording (Build 54/55) now says "N **tiles**" instead of "N items," matching what's actually being counted.
- [x] **Home's destination-select tap target is now the whole title bar**, not just the "Home" text. The click/long-press listeners moved from the name `<h2>` onto `.category-header--home` itself; the +/▲ buttons keep working normally via an early bail (`.home-header-actions.contains(e.target)` on click) and a `pointerdown` `stopPropagation()` on the actions wrapper (so pressing either button never arms the header's own long-press timer in the first place).
- [x] **Phase 2 Part 4: Whole-Structure Reorg Tree Tool**, a genuinely new full-screen view (`#reorg-view` — opaque, not a `.help-overlay` modal, sits above everything at z-index 300), accessible from a new "Reorganize Categories" button in Settings:
  - Shows every category/subcategory site-wide as a flat, depth-indented list (tiles never shown). Home appears pinned first, greyed out (`opacity: 0.5`) and non-interactive for every function the tool offers — it can't be dragged, renamed, or nested under, matching the decision that every real top-level category is effectively Home's child.
  - **Nothing touches real storage until Save.** `reorgWorkingTree` is a full deep clone (`JSON.parse(JSON.stringify(categoryTree))`) made the moment the tool opens; every drag, reorder, re-nest, and new-category creation during the session mutates only that clone. Cancel just discards it. Save replaces `categoryTree`'s own contents with the clone's, persists it, and rebuilds the live page from there.
  - **Drag mechanics**, pointer-based and live-reflowing (same drag-feel as Move Entry): vertical position picks the nearest other row (live DOM move via `insertBefore`/`after`, dragged row excluded along with its own current descendants — a branch can never be dropped inside its own subtree, closing off invalid drops structurally rather than needing a separate "is this valid" check after the fact); horizontal drag distance from the press's own start point controls depth (indent to nest, outdent to promote up the hierarchy), clamped to at most one level deeper than whatever row now immediately precedes it. On drop, the dragged item's `parentId` is set from the resolved position and every sibling under that parent gets a fresh `order` read back from final DOM order — the same convention Move Entry's own `finishTileDrag` already uses to persist a live-reflowed order.
  - **"+ New Category"** is its own small dedicated dialog (`#reorg-new-category-overlay`, z-index 310 to sit above the reorg view) rather than reusing the live-site Add/Edit Category dialog, since it needs to write into the working-copy tree instead of real storage without entangling with that dialog's Rename/Sort/Home-Settings branches. The new entry appears immediately, draggable within the same session, exactly like any other row.
  - **Reuses the existing category data layer wholesale** — `categoryChildren`, `categorySubtreeIds`, `categoryAncestorChain`, `newCategoryId`, `saveCategoryTree` all already did exactly what a flat indented tree with drag-reparenting needs; the tool's own `reorgChildren`/`reorgSubtreeIds`/`reorgFlattenTree` mirror those exactly, just parameterized over the working-copy tree instead of the live one.
- [x] **Bug caught mid-build (not previously logged):** `#reorg-view`'s base CSS rule set `display: flex` unconditionally, which — being an ID selector — outranked the browser's own default `[hidden] { display: none }`, so the view stayed visible and eating clicks even while `hidden`. Fixed by moving `display: flex` into the existing `#reorg-view:not([hidden])` rule instead, the same pattern `.help-overlay` already uses correctly.
- [x] **Verified via Playwright:** delete confirmations correctly name a single tile/category and use "tiles" in the count; Home's tap-target widening confirmed by tapping empty space on the title bar (not the name, not the buttons) and having it select Home as a Cut destination, with the +/▲ buttons still working afterward. Reorg tool: opens from Settings (which closes first); Home renders first, greyed, and a drag attempt on it is a no-op; a sibling reorder (dragging one top-level category above another) persists correctly; a re-nest (dragging one top-level category to become another's child, via horizontal drag distance) correctly deepens it and updates `parentId`; dragging a category toward its own descendant's position snaps back with zero change to the tree (the structural exclusion prevents ever resolving onto an invalid target, confirmed by an unchanged `parentId` and an unchanged row order); "+ New Category" creates a row that exists only in the working copy until Save; Cancel discards a reorder, a re-nest, and a new category all at once, leaving real storage completely untouched; Save commits a re-nest to real storage and the change is immediately visible in the live category tree afterward. Full regression re-run of tile Cut+Paste, category Cut+Paste destination-picking (Build 55's fix), category Sort preview/cancel, and Home Settings (long-press) all still pass unchanged. Zero page errors throughout.

## Build Log 57 (completed)

### Reorg Tree Tool: dragging gated behind the ☰ handle instead of the whole row

- [x] **Fixed:** dragging in the Reorg Tree Tool is now gated behind the ☰ handle specifically, not the whole row — the `pointerdown` listener that arms a drag (`buildReorgRow`, script.js) moved from the row to just `.reorg-row-handle`, and `touch-action: none` (styles.css) moved with it, so the rest of the row (including the name text) keeps its default touch-action and scrolls normally. Full drag control is unchanged, just behind the handle now, mirroring how tile drag is already gated behind Organize Mode rather than every tap. The handle also picked up a small negative-margin/padding trick (same pattern used elsewhere in the app) to enlarge its actual touch target without shifting the row's layout.
- [x] **Verified via Playwright:** a pointerdown-and-move starting on a row's name area no longer arms a drag at all (no `reorg-row-dragging` class, no reorder) and leaves the list order untouched; the same gesture starting on the handle still arms and completes a drag exactly as before, correctly reordering the row. Zero page errors.

## Build Log 58 (completed)

### Info Blurb Management and Visual Grouping Headers — both built from the Build Queue

- [x] **Info Blurb Management, per the addendum:** tiles can now carry an optional `blurb` field (backfilled to `null` on load, same pattern as `lastUsedAt`/`useCount`). Add Tile and Edit Tile (formerly "Rename Tile" — retitled since it now edits more than the name) both got a Blurb field. A tile with a blurb shows a small ℹ️ icon (bottom-left corner of the tile — bottom-right is reserved for the still-unbuilt Brazil-flag badge from the Build Planner, so the two never collide); tapping the icon opens a small popup with the tile's name and blurb instead of navigating, via the same `.help-overlay` pattern every other popup in the app already uses. Designed against Organize Mode (not the old tile-menu popup the addendum assumed, which was retired in Build 51) — the icon tap is intercepted inside the tile's existing capturing click listener, alongside its existing selectMode-toggle and justFinishedDrag branches.
- [x] **Visual Grouping Headers, per the full spec:** a grouping is a cosmetic divider — just a label line with a bottom border under it — stored inline in the same per-category tiles array as a `{ id, type: 'divider', name }` entry, not a real structural subcategory. Long-pressing empty space in a category's tile grid opens a "New Grouping" dialog; long-pressing an existing divider opens "Edit Grouping" (rename or delete, with a confirmation on delete — "won't delete the tiles in it"). Grouping management also lives in the Edit Category dialog, in a new "Groupings" section right next to Sort Tiles, per the user's decision — listing existing groupings with a ✏️ to rename/delete each, plus its own "+ New Grouping" button.
- [x] **Sort now respects grouping boundaries.** A new `sortWithinGroups` helper sorts each run of real tiles between dividers independently rather than across the whole category, so Alphabetical/Most Used/Last Used never mixes two groupings together. A category with no dividers is just one run covering everything — unchanged from before this existed.
- [x] **Real bug found and fixed during this build, not part of either spec:** both `commitSortPreview` (Sort's Save) and `finishTileDrag` (Move Entry's drop) persist a category's tile order by reading the live grid DOM back into storage — both filtered on `classList.contains('tile')`, which would have silently deleted every grouping from storage the very next time a category with dividers was sorted or drag-reordered, even by a user who's never touched groupings. Fixed by filtering on the presence of `data-tile-id` instead (which dividers also carry), covering every write path, not just the two directly exercised by grouping creation.
- [x] **`attachLongPress` (script.js) now passes the originating pointerdown event through to `shouldSuppress`** — needed so the new grid-level "long-press empty space" listener can tell whether the press actually started on the grid's own background versus bubbling up from a child tile/divider's own long-press (which already has its own separate handler). Backward-compatible: every existing caller's `shouldSuppress` ignores the new argument.
- [x] **Verified via Playwright:** creating a tile with a blurb shows the ℹ️ icon; tapping it reveals the correct name/text and does not navigate (no new page opened); Edit Tile prefills the blurb and clearing it removes the icon; long-pressing empty grid space opens New Grouping, long-pressing the created divider opens Edit Grouping prefilled with its name and a Delete button; renaming updates the DOM label live; the divider and its position both survive a full page reload; Sort Alphabetical with a grouping present sorts each side of the divider independently while the divider itself stays at the same index; the Edit Category dialog's Groupings section lists the existing grouping and its ✏️ opens the same edit dialog; deleting a grouping shows a confirmation naming it, and removes only the divider (tile count unaffected) after confirming. A separate regression pass confirmed ordinary Move Entry tile drag-reorder still works correctly with a grouping present, the grouping survives a drag-triggered save, and a blurb-less tile still navigates normally with no icon. Zero page errors in either run.

## Build Log 59 (completed)

### Reorg Tree Tool redesign, tile badge corner swap, and the empty-grouping drag bug — all three queued items

- [x] **Reorg Tree Tool redesign, per the user's mock-up.** New toolbar (replacing the plain header text) with **Properties**, **New Category**, **New Subcategory**, **Remove Category** — every "Section" in the mock-up read as "Category," per the user. New tap-to-select model (single-select, highlighted row, toggles off on a second tap) that all four toolbar buttons plus the new **Category Up / Category Down** row act on; dragging via the ☰ handle is unchanged and still coexists with it. New expand/collapse arrows (▼/▶) on any row with children — starts fully expanded, per the user — with an invisible same-width spacer on leaf rows and Home so every name still lines up at the same column. The old in-list "+ New Category" row is gone, folded into the toolbar's New Category button.
  - **Properties edits the live category right away**, per the user's decision — reuses the existing Edit Category dialog as-is rather than adapting it to the tool's own draft. Disabled when nothing's selected *or* when the selection was created this session and doesn't exist in the live tree yet (nothing real for it to edit until Save). Renaming via Properties now also patches the Reorg tool's own working-copy clone's name (`addCategorySubmit`, script.js) so the list reflects it immediately instead of only after Save/reopen.
  - **New Subcategory** creates a category as a child of the selected row (auto-expanding it so the new child is actually visible); **New Category** is unchanged, always top-level. Both now share one dialog (title switches between "New Category"/"New Subcategory" based on whether a parent id was passed in).
  - **Remove Category** deletes the selected category and its subtree from the tool's own working copy only — matches the same named-item + impact-count confirmation (`openTileConfirm`) the live Organize Mode category delete already uses. **Real correctness issue found and fixed during this build:** live tile storage for a removed category can't be deleted at remove-time, since the whole point of the tool's draft model is that Cancel can still fully back out — deleting the tiles immediately would make that removal permanent even on Cancel. Tile-storage cleanup is now deferred to the moment Save actually commits (`reorgSaveBtn`), by diffing the final working tree against the original live tree for anything that no longer exists.
  - **Category Up / Category Down** swap `order` with the adjacent sibling (same parent only, never reparenting) — disabled at either end of the sibling group.
  - **Stacking fix required for Properties to even be reachable:** the Reorg Tree Tool is a full-screen view above every other popup (z-index 300); Edit Category, Groupings, and the delete confirmation were never previously opened while something else was on top, so their z-indices (200/210) would have rendered them invisible underneath it. `#add-category-overlay` is now 320, `#grouping-overlay` 330, and `#tile-confirm-overlay` is now an explicit 340 (previously implicit DOM-order luck) — the confirmation always sits on top of everything, at any nesting depth.
- [x] **Tile badge corners swapped:** `.tile-info-icon` now sits bottom-right instead of bottom-left (one-line CSS change); the Brazil-flag badge's decided position (Build Planner) was already updated to bottom-left in an earlier log-only pass.
- [x] **Bug fixed: dragging a tile into a grouping with nothing under it.** `findNearestTile` (now `findNearestDropTarget`) considered only `.tile` elements — a divider with no tile after it had nothing for the algorithm to snap against, so a dragged tile could never cross into an empty group. Tiles still use the original center-to-center distance, unchanged; a divider (which spans the grid's full width, so its own center is meaningless) now competes using distance to the closest point on its own box instead, which collapses to a vertical-only distance since the pointer's x is always within the grid — a drag anywhere across the row now finds a nearby divider once vertically close. `reflowWithinCurrentGrid`'s insertion logic already generalized correctly to a divider "nearest" with no changes needed there.
- [x] **Verified via Playwright**, two passes:
  - Reorg redesign: toolbar buttons start correctly disabled/enabled and flip with selection; tap-to-select and deselect; collapse/expand hides/reveals a subtree correctly and a leaf shows no real arrow; New Category and New Subcategory both create at the right depth (with the dialog title switching correctly) and a subcategory's new parent auto-expands; Category Up moved a category earlier among its top-level siblings and the selection survived the re-render; Properties opened above the Reorg view (z-index confirmed higher), renamed a live category, and the Reorg row updated immediately without needing Save; Remove Category's confirmation named the category and appeared above the Reorg view, and removing it also removed its row; after Save, the live tree had the rename and the removal (no orphaned entry), and the tool closed. Zero page errors.
  - Regression + bug-fix pass: Reorg's own ☰ handle drag-to-reorder still works correctly with the new arrow column present; dragging a tile past a previously-empty grouping's divider now correctly lands it below the divider (confirmed via bounding-box math against the actual rendered layout, plus a settled real-drag simulation — an abrupt synthetic jump needed a few trailing pointer-move events to let the grid's own layout-shift-from-removal settle before the final distance check, same as any drag that removes an item from deep in a multi-row grid would need), and that new order survives a full page reload. Zero page errors in either run.

## Build Log 60 (completed)

### Category long-press → Reorg Tree Tool, Category/Home Color pickers, and the grouping-editing redesign — all three queued items

- [x] **Category long-press now opens the Reorg Tree Tool directly**, pre-selected and scrolled to that category, instead of entering Organize Mode's category-select state. Category select mode is fully removed — `handleCategoryLongPress`, `enterCategorySelectMode`, `rangeSelectCategories`, `toggleCategorySelected`, `refreshCategorySelectionVisuals`, `prunedSelectedCategoryRoots`, `categorySubtreeIds`, `moveCategorySubtree`, and the checkmark element/CSS it drove are all deleted, not just unreachable — along with the category branches of `confirmMoveSelected`, `deleteSelected`, `selectedCount`, `updateSelectActionBar`, and the select-action-bar's Rename/Delete handlers. Batch category Cut+Paste is gone with it (accepted tradeoff, per the user); a single category's move is still fully covered by the Reorg Tool's own drag.
- [x] **Category Color picker**, in the Edit Category dialog below Groupings, top-level categories only — 8 default swatches, a native `<input type="color">` for a wider palette, and a synced hex field. Subcategories are never individually colored; they automatically render a progressively lighter shade of their top-level ancestor's color (`lightenForDepth`, +12% HSL lightness per nesting level, clamped at 92%) via `primaryAncestorAndDepth`, which walks `parentId` links in `categoryTree` directly rather than the DOM so it works correctly during initial tree construction. Color is staged locally and only committed (to `categoryTree`, then `rebuildCategoriesAndTiles()`) when the dialog's own Save is pressed, same as Name.
- [x] **Home Header Color**, in Home Settings (a new third section, after Sort Tiles and Groupings) — the same picker shape, but for the whole header background, plus an *independent* text-color picker per the user's own correct read of the contrast problem (a dark background needs light text and vice versa; picking them separately sidesteps needing any auto-contrast logic). Stored under a new `homeColor` localStorage key, applied live via new `--home-color-bg`/`--home-color-fg` CSS custom properties set on `:root`. Deliberately distinct from the existing `--home-header-bg`/`--home-header-fg`, which stay as fixed defaults other unrelated UI (button borders, etc.) still borrows as a generic accent — the new variables only ever drive Home's own header (background, name text, and the +/▲ action icons), falling back to the old defaults via `var(--home-color-bg, var(--home-header-bg))` until the user actually picks something.
- [x] **Grouping editing redesign**, fully replacing Build 58's popup dialog. Long-pressing a divider (or empty grid space, or the global "+" menu's new "+ Grouping" option, or the Groupings list's ✏️ inside Edit Category) now enters a third `selectMode` kind, `'grouping'` — always exactly one selected, no multi-select, no Cut/Paste (a grouping is purely positional within its own category). The bottom bar shows ✏️ (turns the divider's label into a focused, pre-selected inline text input — Enter or blur commits a trimmed non-empty name, or reverts if left empty), 🗑️ (the same named-confirmation dialog as any other delete, no impact count since nothing gets deleted but the divider itself), and a new ➕ that inserts another grouping right after the selected one and drops straight into that same inline-rename state — Select All/Cut/Paste stay hidden for this kind. Long-pressing empty grid space and the global "+" menu's "+ Grouping" do the same insert-and-inline-rename, just appended at the end instead of after a specific divider. The old `#grouping-overlay` popup and every function that opened it are deleted entirely, not just unused.
- [x] **Real bugs found and fixed while building the redesign, not part of any spec:**
  - The Edit Category dialog is now *only* ever reachable via the Reorg Tree Tool's Properties button (category select mode, its other entry point, is gone) — meaning the Reorg Tool's full-screen view is always open underneath it. The Groupings list's ✏️ needs the live grid visible to scroll to and edit a divider in, which Reorg's opaque overlay blocks. Simply closing/cancelling the Reorg Tool to reveal the page would discard whatever unsaved drag moves were pending in that session — instead, `revealLiveGridForGrouping` just *hides* it (`reorgView.hidden = true`, working-copy state untouched) and `exitSelectMode`'s grouping branch restores it exactly as left, once the grouping edit is done.
  - Discovered via that same flow: opening the Reorg Tree Tool while a tile or grouping was still selected from an earlier, never-cleared Organize Mode session (nothing auto-times it out while something's selected) left stale state that actively fought the tool — a lingering `'grouping'` selectMode's own exit path would immediately un-hide the just-hidden Reorg view again the next time anything called `exitSelectMode()`. Fixed generically: `openReorgTool()` now exits any active select mode before opening, not scoped to just the grouping case.
- [x] **Verified via Playwright, four passes:** category long-press opens Reorg pre-selected/scrolled with the old select bar never shown, tile long-press unaffected; the Category Color picker (default swatches, hex sync, top-level-only visibility, save-to-live-tree, and three levels of correctly-diverging progressively-lighter subcategory shades) and Home's independent background/text colors (applied live to `:root`, correct computed header style, survives a full reload); the grouping redesign end-to-end (no popup dialog exists in the DOM at all anymore, inline input appears immediately on creation, bar shows the right icon set for the `'grouping'` kind, ➕ inserts and inline-renames, 🗑️'s confirmation is correctly un-impact-counted, and the global "+" menu's new "+ Grouping" option); and the Groupings-list-while-Reorg-is-open interaction specifically — confirming an unsaved pending drag move survives the whole detour and still commits correctly on the Reorg Tool's own eventual Save. A final broad regression pass confirmed a fresh load has zero console errors, ordinary navigation/Settings/Help still work, and plain tile drag-reorder is unaffected by the divider-aware distance changes from Build 59. Zero page errors across every run.

## Build Log 61 (completed)

### Add panel 3-line layout, Category Color "None" bug fix, Reorg toolbar label trim, and the groupings-centralization redesign — all four queued items

- [x] **Add panel: 3 stacked lines.** `#create-menu-tile`/`-category`/`-grouping` (index.html) each gained a standalone `.tile-menu-action-plus` span between the icon and the name, and the name span dropped its baked-in "+ " prefix — icon / "+" / name, one per line, for all three buttons.
- [x] **Category Color "None" bug — fixed per the primary remedy already logged as the leading theory:** `createColorPicker`'s None handler (script.js) now also resets the native `<input type="color">` to a neutral `#000000` alongside clearing the hex field, so it has nothing stale left to re-fire. The "and/or guard against override" alternative also logged wasn't added on top of it — it would block a genuinely legitimate flow (None, then deliberately reopening the native picker to pick something new), and the underlying cause was always an unconfirmed, best-effort theory, not a confirmed root cause; the minimal, directly-stated fix is what shipped. Verified two ways: a clean None → Save now correctly stores `stripeColor: null` (this alone was never actually reproducible even before the fix, per Build Queue history — but there's now a real fix in place either way), and a synthetic re-fire of the native input's own `input` event after None no longer resurrects the *old* color, which is the specific risk the theory described.
- [x] **Reorg toolbar labels trimmed:** `#reorg-new-category-btn` "➕ New Category" → "➕ Category", `#reorg-new-subcategory-btn` "➕ New Subcategory" → "➕ Subcategory". Per the flagged, unconfirmed related question: the New Category/Subcategory dialog's own `<h2>` heading was left as-is ("New Category"/"New Subcategory") — the user only named the toolbar buttons, and a modal's own title repeating the action is normal, unlike a button label doing it.
- [x] **Groupings fully centralized in the Edit Category / Home Settings dialog — Build 60's grid-based grouping select mode is gone entirely, not left alongside.** Sort Tiles is icon-only now (🔤/📈/⏱️). The Groupings section is the list (unchanged visually) plus one shared row of 🔺 🔻 ➕ ✏️ 🗑️ underneath it — tap a row to select (single-select, toggles off on a second tap), which enables the row of buttons exactly like the Reorg Tree Tool's own toolbar (🔺 disabled when first in the list, 🔻 disabled when last). ➕ inserts a new grouping right after whichever one's selected (or appends at the end with nothing selected — also how Home's "+ Grouping" and a fresh ➕ both behave) and drops straight into inline-rename in that new row. ✏️ renames the selected row inline, right there in the dialog's own list — no jumping to the live grid to edit it, satisfying the user's later "only one place to edit a grouping" rule. 🗑️ shows the same named confirmation as before (no impact count, tiles under it are never touched). Up/Down move the grouping's *whole block* — its divider plus every tile under it, as one unit — past the adjacent block, mirroring a top-level category's own subtree move in the Reorg Tool; not a single-slot swap. Long-pressing a divider in the grid now opens Edit Category directly (for that divider's category), with that grouping pre-selected and scrolled to in the list — exactly mirroring how a category header's own long-press opens the Reorg Tree Tool pre-selected. Long-pressing empty grid space is gone outright, not rerouted. Home's "+ Grouping" opens Home Settings (or Edit Category, for `currentLocationId()`) with a new grouping already inserted and inline-renaming, same as the dialog's own ➕ with nothing selected.
- [x] **Deleted entirely, not left unreachable:** the `'grouping'` `selectMode` kind and every branch of the select-action-bar that handled it (`selectActionAddBtn`/`#select-action-add`, the Rename/Delete handlers' grouping branches, `isGrouping` visibility toggling in `updateSelectActionBar`); `enterGroupingSelectMode`, `groupingDividerEl`, the in-grid `startGroupingInlineRename`, `insertGrouping`; `revealLiveGridForGrouping`/`focusGroupingInLiveGrid`/`reorgHiddenForGroupingFocus` (no longer needed — grouping editing never reveals or touches the live grid anymore); the old bottom-of-dialog `#add-grouping-btn` "+ New Grouping" button; and the `.tile-divider-selected`/`.tile-divider-input` CSS that styled the now-gone in-grid select/rename state. The select-action-bar is tile-only again, same shape it had before Build 60's grouping work.
- [x] **Verified via Playwright, two passes covering all four items plus a broad regression:** the Add panel's 3-line shape; the color-None fix (clean Save→null, and the synthetic stale-refire case); the trimmed toolbar labels; the full groupings flow end-to-end on a category seeded with two real groupings and their tiles — list rendering, toolbar enable/disable at both list ends, whole-block Move Down/Up (verified against both localStorage and the live grid's DOM order, confirming `reorderGridDom` stays in sync), ➕ add + inline-rename, ✏️ rename (and confirming the grid's own divider label text stays in sync even though it's no longer editable there), 🗑️ delete (named confirm, removed from both the list and the grid), divider long-press opening Edit Category pre-selected with the old select bar never shown, empty-grid-space long-press now doing nothing, Home's "+ Grouping" landing in Home Settings mid-inline-rename, and every grouping change surviving a full page reload. A separate regression pass confirmed `#select-action-add`/`#add-grouping-btn` no longer exist in the DOM, Settings/Help still open normally, tile select-mode's bottom bar (Rename → Edit Tile, Delete) is unaffected by the bar's simplification back to tile-only, and ordinary tile drag-reorder still works. Zero page errors across every run. (One test-harness quirk hit and worked around, not an app bug: Chromium doesn't synthesize a `click` event after a long *simulated* raw mouse hold-and-release, which also silently swallows the very next click on that same element — confirmed by instrumenting a click counter directly; a `page.reload()` between a long-press gesture and a later plain click on the same element sidesteps it.)

## Build Log 62 (completed)

### Three small Edit Category / Add panel tweaks — all queued items

- [x] **Add panel: Grouping icon → 🔣.** `#create-menu-grouping`'s icon span (index.html) changed from ➕ to 🔣 — icon line only, the 3-line icon/+/name layout from Build 61 is untouched (🔣 / + / Grouping).
- [x] **Sort Tiles: abbreviated text labels back next to the icons.** `#sort-category-alpha`/`-most-used`/`-last-used` now read "🔤 Alpha", "📈 Used", "⏱️ Recent" instead of bare icons — no CSS changes needed, the existing `.category-sort-btn` sizing/flex layout already accommodates the extra text.
- [x] **Groupings toolbar: ➕ → styled "+".** `#grouping-add-btn` swaps the ➕ emoji for a plain "+" character via a new `.grouping-toolbar-btn-plus` modifier class — bold (`font-weight: 700`), colored with the existing `--action-go-bg`/`--action-go-fg` green tokens (Build 47's Cut/Paste action-bar green, reused rather than introducing a third), and sized up to `1.3rem` against the row's normal `0.95rem` per the user's own follow-up ("maybe make the font a bit bigger, too") — a judgment call on the exact size since none was given, aiming for "modestly larger," not drastic.
- [x] **Verified via Playwright, light and dark:** the Add panel's 🔣 renders correctly with the +/Grouping lines untouched; all three Sort Tiles buttons show the correct icon+abbreviation text; the Groupings toolbar's Add button renders literal "+" (not an emoji), computed `font-weight: 700`, and a font-size measurably larger than its sibling buttons (20.8px vs. 15.2px) — confirmed correctly theme-aware too, resolving to the light-theme `--action-go-fg` (`rgb(20, 83, 31)`) and dark-theme value (`rgb(163, 232, 163)`) respectively via a live theme-toggle check, plus a visual screenshot to confirm it reads clearly against the row's other emoji in dark mode. Zero page errors.

## Build Log 63 (completed)

### Settings goes full-screen with a profile photo picker and reordered Weather, plus three grouping bugs/design changes — all five queued items

- [x] **Settings converted to a dedicated full-screen view, matching the Reorg Tree Tool.** `#settings-overlay` (a `.help-overlay` popup) is gone; `#settings-view` is now a genuine full-page view (`position: fixed; inset:0; z-index:300`, `.reorg-header`/`.reorg-list` reused for its own header/scrollable body) with no dimmed backdrop — closing is only ever the explicit × button, same as it always effectively was (every field here still applies immediately on change, no Cancel/Save was ever needed). Section order is now Site Name → Theme → Profile Photo → Organize → Weather.
- [x] **Weather API Key moved to the very bottom**, per the user's reasoning that it's a one-time-setup field. Confirmed last in the section order above.
- [x] **Profile photo picker, built to the resolved design:** a new "Profile Photo" section in Settings with a circular preview, a "Choose Photo" button (`<input type="file" accept="image/*">`), and a "Remove" button that only shows once a photo's set. On pick, the source image is drawn into an offscreen `<canvas>`, center-cropped to a square, downscaled to 64×64 (the canvas's own `drawImage` resampling — no custom pixel-sampling code needed), and exported as a JPEG data URL stored directly in `localStorage` under a new `profilePhoto` key — small enough that no IndexedDB was needed, as anticipated. `#profile-btn` (top-right header icon) and the Settings preview both reflect it live; the original person-silhouette SVG stays the default until a photo's actually set, and reappears on Remove. Tapping `#profile-btn` still just opens Settings, unchanged — the picker lives inside as its own entry, not a direct action on the icon.
- [x] **Bug fixed: creating a new grouping no longer lands inside the selected grouping's own tiles.** `addGroupingToCategory`'s insertion point (script.js) now uses a new `groupingBlockEndIndex` helper — the same "walk to the next divider, or the end of the array" block-boundary concept `moveGroupingBlock` already used for Up/Down — instead of just `afterDividerId`'s own index. A new grouping now lands after the *entire* selected block, in both the storage splice and the live-grid DOM insertion (which now inserts *before* whatever originally followed that block, rather than *after* the selected divider itself).
- [x] **Design change built: deleting a grouping now un-groups its tiles to the top instead of leaving them to be silently absorbed by the previous grouping.** `groupingDeleteBtn`'s handler now computes the deleted divider's own block (same `groupingBlockEndIndex` helper), removes only the divider, and splices that block's *tiles* (not the divider) into the category's ungrouped run at the top — after any tiles that were genuinely never in a grouping, before the first remaining divider — in both storage and the live grid.
- [x] **Bug fixed: dragging a tile no longer vibrates a neighboring tile across a divider boundary — root cause confirmed live, not just theorized.** Reproduced exactly as reported via Playwright first: instrumenting the actual DOM order during a drag near a divider showed the dragged tile's own real position (distinct from its cursor-following visual position) flipping between "just before the divider" and "just after it" on every single pointermove, which is what shoves whichever real tile sits on the far side back and forth. The cause: `reflowWithinCurrentGrid`'s reorder decision compared the pointer's distance to a candidate against the dragged tile's own *current* position — self-referential right next to a divider, since that "current position" is itself the result of the previous call's decision, so it can swing the comparison back the other way every time. A first attempt at a fixed-pixel hysteresis margin didn't hold (the swings measured 40–100+ px between calls, not a marginal tie). The fix that actually worked, confirmed by rerunning the same instrumented reproduction until it stayed flat: skip the reorder decision entirely whenever the dragged tile is *already* immediately adjacent to its nearest candidate (either side) — there's nothing left worth re-deciding once already touching it, so the flip-flop has nothing to flip between. Verified separately that genuine drag-to-a-different-slot (dragging a tile past several others into a new position) still works correctly, storage and DOM in sync.
- [x] **Verified via Playwright, one comprehensive pass plus the standalone drag-jitter reproduction above:** Settings renders full-screen with the correct section order and no `#settings-overlay` left in the DOM; the photo picker's full lifecycle (default icon → pick → shrunk-to-64×64 JPEG stored and applied to both the header icon and Settings preview → survives a reload → Remove reverts to default and clears storage); the new-grouping fix (seeded a category with an existing 3-tile "Free" group, added "Paid" while Free was selected, confirmed storage and grid both place Paid after all of Free's tiles); the delete-un-groups-to-top fix (seeded "always ungrouped" + "Free" + "Paid" tiles, deleted Paid, confirmed its tile landed right after the always-ungrouped one and before Free, in both storage and the grid); and the drag-jitter fix holding under a fresh sweep across the same boundary. Help still opens. Zero page errors across every run.

## Build Log 64 (completed)

### Drag-adjacency regression fixed with a full decision rewrite, and the profile photo padding bug turned out to be three layered bugs — both queued items

- [x] **Drag reorder rewritten to decide by pointer side, not the dragged tile's own position — fixes both the Build 63 regression and re-verified the original jitter bug stays fixed.** `reflowWithinCurrentGrid` (script.js) no longer measures the dragged tile's own rect (`distToOwn`/`ownRect`) at all — that self-reference was the root cause of *two* real bugs now, not just one. New `pointerSideOf(candidate, x, y)` decides purely from where the pointer is relative to the nearest candidate: above/below its row (always decisive for a divider, which spans the grid's full width), else left/right of its own center. The tile moves to that side only if it isn't already there (`tileEl.previousElementSibling !== nearest` / `nextElementSibling !== nearest` — an idempotency check, not a decision gate, so it can't reintroduce either bug). Verified against **every** drag scenario built up across this session and the last: the original divider-jitter reproduction (zero flips, still), a genuine long cross-grid drag past several tiles (still lands correctly), dropping into a brand-new empty group at the bottom (simple 2-tile case, a multi-group case, and a long 20-tile case requiring the drag's own auto-scroll to reach it — all still correct), and — the two scenarios this bug was actually about — a tile starting out *already adjacent* to a divider now correctly crosses to the other side on the very first drag, in both directions (`[tileA, div-new]` → drag tileA past it → `[div-new, tileA]`; `[div-free, tileX]` → drag tileX above it → `[tileX, div-free]`).
- [x] **Profile photo padding — turned out to be three separate, layered bugs, not one.** Fixed all three:
  1. `SVGElement.hidden = true` doesn't reflect to the `hidden` attribute the way `HTMLElement`'s does (confirmed directly) — replaced with a new `setElementHidden(el, hidden)` helper using explicit `setAttribute('hidden', '')`/`removeAttribute('hidden')`, used uniformly for all four toggles in `applyProfilePhoto()` (not just the two SVGs) so this can't happen again from a future edit that mixes approaches.
  2. Even with the attribute now correctly present, nothing actually hid the SVG — this codebase never relies on the browser's own default `[hidden]{display:none}` styling, every other hideable element has its own explicit rule, and none existed for a bare `<svg>`. Added `#profile-btn-default-icon[hidden], #profile-photo-default-preview[hidden] { display: none; }`.
  3. Even with the SVG *genuinely* hidden and out of the flex layout, the photo `<img>` still didn't fill the 32×32 button — traced to `.icon-btn` never resetting the browser's default `<button>` padding; combined with this app's global `box-sizing: border-box`, that default padding was eating into the button's content box, leaving only ~20×32px of real space for whatever's inside. The old SVG was small enough nobody ever noticed; a photo meant to fill the whole circle made it obvious. Fixed with a plain `padding: 0` on `.icon-btn`. Reproduced and confirmed all three layers in complete isolation (a bare standalone HTML page, no other app code involved) before fixing each, and confirmed the header "?" help button — the only other `.icon-btn` user — still renders correctly centered afterward.
- [x] **Verified via Playwright, full regression pass plus a visual screenshot:** the whole drag-fix test suite (listed above) all green; the photo picker's full lifecycle still correct end-to-end; a rectangular test photo now fills the header circle completely edge-to-edge with no gap on any side (screenshot confirmed); new-grouping and delete-un-groups fixes from Build 63 unaffected; Settings/Help still open normally. Zero page errors across every run.

## Build Log 65 (completed)

### Drag-reorder rewritten row-first to fix the Build 64 directional bug — the gap-based direction flagged in the Build Queue, now designed and built

- [x] **`reflowWithinCurrentGrid` (script.js) rewritten to decide by row first, then position within that row — removes `findNearestDropTarget`, `nearestPointDistSq`, and `pointerSideOf` entirely.** Two steps: (1) group every sibling (excluding the dragged tile) into its on-screen row by matching `getBoundingClientRect().top`, then pick the row whose vertical band the pointer's y is nearest to (0 distance whenever y is already inside a row — the overwhelmingly common case while dragging); (2) place the dragged tile within that row. This directly fixes both reported symptoms:
  1. **Cross-group "always leftmost, ignores x."** The old code found one single nearest candidate by mixing tile-center distance and divider-box distance into one Euclidean metric, and a divider (spanning the grid's full width) very often won that comparison even when the pointer's y was genuinely inside a tile row below it — and once it won, x was never even consulted. Picking the row by a y-band first means a tile row now correctly outscores its own divider whenever the pointer is actually in it, so placement is decided by the tiles really in that row, not by which side of a full-width divider's box happened to measure closer.
  2. **Same-row left/right asymmetry ("left-to-right works, right-to-left is a coin flip").** Row placement now scans every item in the row left-to-right rather than picking one nearest candidate first, and the tie exactly at an item's own center — not a rare edge case here, since a reorder shifts every later item by exactly one uniform track width, so a pointer easing toward a neighboring tile keeps landing on that same exact boundary — is broken toward the direction the pointer is *actually moving* (tracked via `dragInfo.lastReflowX`, compared only against the pointer's own prior position, never the dragged tile's). A fixed tie-break is invisible in the direction it agrees with and fights the other; a direction-aware one is symmetric both ways.
  3. Along the way, found and fixed a related tie in the divider-row branch: it defaulted to "before" the divider on an exact y-center tie, which could undo an already-correct in-progress placement the moment a drag (e.g. into a brand-new, auto-scrolled-to empty group) settled on the divider's own dead-center band. Flipped to default "after" — a group's own label reads as belonging to the section that follows it, not the one before.
- [x] **Verified via Playwright, full regression pass:** the original divider-jitter reproduction (one clean flip, stable after — still fixed); all three empty-group-drop scenarios from Build 64 (simple, multi-group, and the long auto-scroll case) still land inside the new group, and the auto-scroll case's remaining flakiness (landing just *before* the new divider instead of inside it) is the one this build's divider-tie fix directly resolved; both Build 64 already-adjacent-to-a-divider scenarios still cross correctly in both directions; a same-row left-to-right and right-to-left drag across 5 tiles now produce mirror-image correct results end to end; a cross-group drag descending into a different group's row and sliding across it tracks the pointer correctly tile-by-tile, landing wherever it's released rather than always leftmost. Zero page errors across every run.

## Build Log 66 (completed)

### Brazil-flagged item badge — the marking mechanism Planner 1 was missing, built end to end

- [x] **Manual per-tile checkbox, in both Add Tile and Edit Tile — resolves Planner 1's open question.** A `🇧🇷 Brazil` checkbox now sits in both dialogs (`index.html`'s `#add-tile-overlay` and `#tile-rename-overlay`), styled with the existing `.option-row input[type="checkbox"]` pattern already used everywhere else (weather toggles, theme auto-mode). Add Tile always resets it unchecked on open; Edit Tile prefills it from the tile's current status. New tile data field: `brazil` (boolean), alongside `blurb` in the same per-category `tiles` array — no migration needed, a missing/undefined value on old tiles is simply falsy.
- [x] **The actual 🇧🇷 badge — decided in the planner but never actually rendered anywhere, built now.** `buildTileElement` takes a new `brazil` param and appends a `.tile-brazil-badge` span when true; a new `updateTileBrazilBadge()` (mirroring the existing `updateTileInfoIcon()`) adds/removes it live from Edit Tile's save handler. Bottom-left corner, mirroring the ℹ️ info icon's own bottom-right rule in CSS — the two now visibly coexist on the same tile without colliding, exactly as Planner 1's already-decided visual treatment called for. Also caught and fixed a stale CSS comment while touching this rule: it described the info icon as bottom-left/Brazil as bottom-right-reserved, backwards from both the actual `right/bottom` values already in place and Planner 1's own description — corrected to match reality.
- [x] **Verified via Playwright:** adding a tile with the checkbox checked renders the badge immediately and persists `brazil: true` to storage; a plain tile gets no badge; editing an existing tile to check the box adds the badge live and persists it; re-opening Edit Tile shows the checkbox still checked; unchecking it removes the badge live; the flag survives a full page reload. Zero page errors. Screenshot-confirmed placement: badge and info icon sit in opposite corners with no visual overlap, checkbox reads cleanly in both dialogs.

## Build Log 67 (completed)

### Add Tile and Edit Tile consolidated into one dialog — Edit Tile gains real URL editing

- [x] **One dialog now serves both, per the user.** `#add-tile-overlay` and `#tile-rename-overlay` (two near-identical `.help-overlay` panels) are now a single `#tile-dialog-overlay`, switched by a `tileDialogMode` ('add'/'edit') flag. `openAddTile`/`openTileRenameFor` stay as the two named entry points the rest of the code already calls (create-menu's "+ Tile", select-action-bar's ✏️ Rename) — both now just configure and open the same dialog + one shared submit handler, instead of each driving its own separate overlay/handler pair. Title and submit-button text switch with mode ("Add Tile"/"Add Tile" vs. "Edit Tile"/"Save").
- [x] **Edit Tile can change a tile's URL now — genuinely new capability, not just merged plumbing.** Before this, there was no way to fix a broken link or point a tile at a more specific page after creation, full stop. New `updateTileUrl(tileEl, url)` sets the live `<a>`'s `href` and re-derives its favicon for the new domain via a new shared `createTileFaviconImg()` helper (factored out of `buildTileElement`, which now calls it too) — always recreates the `<img>` rather than trying to reuse one, so a tile that had fallen back to `.tile-fallback` gets a fresh shot at a real favicon if the edited URL points somewhere new.
- [x] **Verified via Playwright:** Add mode shows "Add Tile"/"Add Tile"; a new tile's href/badge/info-icon all render correctly. Edit mode shows "Edit Tile"/"Save" and correctly prefills Name, URL, Blurb, and Brazil from the live tile. Editing URL + Name + unchecking Brazil all apply live to the DOM and persist to storage; the new URL survives a full reload. Re-ran the drag-jitter and horizontal-drag regression suites since `buildTileElement` was touched — both still pass clean. Zero page errors.

## Build Log 68 (completed)

### Export / Import backup (Two-Instance Mechanism — Per-Device Storage spec, Section 6)

- [x] **Export:** new "Backup" section at the bottom of Settings, right after Weather (as planned). "Export My Data" serializes the category tree, every category's tiles, site name, theme + auto-mode, WeatherAPI key, profile photo, search engine, Home colors, and clock/weather widget settings into one JSON file and triggers a browser download — no account or server involved. Deliberately excluded: the internal `*Migrated` bookkeeping flags (not user data, and re-applying them to an imported tree that already has real content would be wrong), `category-open-path` (just "what was scrolled to last," not customization), and the weather widget's live-condition cache/alert-state (ephemeral, re-fetched on next load regardless).
- [x] **Import:** "Import My Data" opens a file picker; the selected file is parsed and sanity-checked (must be JSON with `app: "startpage-backup"` and a `data` object) — anything else shows a warning via the existing generic confirm dialog and imports nothing. A valid file goes through the same dialog as a real Yes/No confirmation, gated behind typing "yes" (the same `requireTypedYes` friction tier Remove Category uses for a non-empty subtree, matching the spec's own comparison) with the exact warning text the spec specified. On confirm: every relevant existing key is cleared first, then every key from the backup is written — a genuine full replacement, not a merge, so a tile deleted before the backup was made doesn't linger after importing it — then the page reloads to re-render everything from the new stored state, the simplest correct way to re-init every independent subsystem (categories, tiles, theme, clock, weather, profile photo) at once.
- [x] **Caught and fixed a real bug during verification, before it ever ran for real:** `BACKUP_SIMPLE_KEYS` was originally a top-level `const` array referencing `CLOCK_SETTINGS_KEY`/`WEATHER_SETTINGS_KEY`, both declared much later in the file — a Temporal Dead Zone violation, since an array literal evaluates its elements immediately at its own declaration point, not lazily. Fixed by making it a function (`backupSimpleKeys()`) called only from click handlers that fire long after the whole script has finished evaluating, which is safe regardless of declaration order.
- [x] **Verified via Playwright:** export produces the correct JSON envelope and content (confirmed by intercepting the Blob passed to `URL.createObjectURL`, since headless-Chromium's real download flow was unreliable in this sandbox — the export button was still exercised for real, a `download` event did fire). An invalid file is correctly rejected with the warning, nothing imported. A valid (modified) backup correctly shows the confirm dialog with Confirm disabled until "yes" is typed, and on confirming, both `siteName` and a category's tiles are fully replaced — the pre-import tile is confirmed gone, not merged. Zero page errors.

## Build Log 69 (completed)

### Tile search — 🔎 popup with live autocomplete, category-chain nav, and a landing glow

- [x] **Entry point + UI, exactly as decided.** A 🔎 button now sits in `.home-header-actions`, left of `#create-btn` (`🔎 + ▲`), opening a `.help-overlay` popup (`#tile-search-overlay`) — a text input plus a live results list that re-renders on every keystroke, no separate submit step. Kept fully separate from `#search-form` (the external Google/Bing bar), so there's no shared input that could send a tile name to the web or a web query into tile navigation.
- [x] **Index, built fresh every time the popup opens.** `document.querySelectorAll('.tile')` directly, rather than iterating categories first — simpler than the originally-logged approach and DOM-driven all the same, for the same reason: `wireTileGrids` renders every tile eagerly at load regardless of collapse state, and every mutation already patches the live DOM alongside storage, so nothing here can be stale or point at an orphaned category. A new `tileGroupingName(tileEl)` walks a tile's previous siblings within its own flat `.tile-grid` back to the nearest `.tile-divider`, if any, to find its grouping.
- [x] **Row format, exactly as decided:** category chain joined with `>`, then `_ <grouping>` if the tile sits under one, then `~ <tile name>` — e.g. `Games > Computer > Role Play _ Free ~ Wolfenstein`, or without a grouping, `Games > Computer > Role Play ~ Wolfenstein`. A Home tile (not part of `categoryTree` or the openPath system at all) reads just `Home ~ <tile name>`.
- [x] **Selection: category-chain nav + scrollIntoView + the glow, all built.** Reuses `openCategoryPath` (skipped for a Home tile, which is always visible) and the same `requestAnimationFrame`-after-visibility-change pattern `scrollTargetBelowPopup` already uses elsewhere, so the tile's position is measured only after the browser has laid out the now-visible category. New `@keyframes tile-search-glow` (light blue `box-shadow` ring, 1.8s ease-out fade) — a real new animation, nothing existing to reuse, exactly as flagged. A forced reflow before re-adding the class lets the same tile glow again if searched for twice in a row.
- [x] **Caught a real bug before it ever ran, from the same class as Build 68's:** the search code sits earlier in the file than `categoryTree`'s own `const` declaration — every reference to it is safely inside functions only called from click/input handlers (never evaluated at the declaring `const`'s own line), so this is fine as written, but worth naming since it's exactly the shape of mistake `backupSimpleKeys()` had to fix moments earlier in this same build session.
- [x] **Verified via Playwright:** button order confirmed (🔎 left of +); empty query shows nothing; a match with no grouping omits the `_` segment while one under a grouping includes it correctly (tested both on the same category); a query matching nothing shows "No matching tiles."; selecting a result closes the popup, opens the right category, and the tile gets the glow class immediately, which is gone again after the animation completes; a Home tile searches and displays correctly. Re-ran the drag-jitter, horizontal-drag, tile-dialog, and backup regression scripts together — all still pass. Zero page errors throughout.

## Build Queue

### Settings cleanup — compact layout, way less vertical space

Per the user, with an ASCII mockup of the target layout. Root cause investigated, not just described: every button-only row (Reorganize Categories, Choose Photo, Export My Data, Import My Data) uses `.testing-reset-btn` — `width: 100%; margin-top: 20px` — a full-width block button style shared across the whole app for real primary actions (Add Tile submit, dialog Save, etc.). Combined with every section's `<h3>` label sitting on its own line above its row, that's the entire source of the excess space.

- [ ] **Site Name / Theme:** collapse `<h3>` + row into one line each — the section label lives directly in the row (styled like the current small-caps `<h3>`) instead of a heading above a separate row. Theme's label shortens to match the user's mockup ("Auto 7a-day/7p-night") — flagging this as a wording change, not just layout, in case the longer current text ("Automatic (day 7am–7pm / night 7pm–7am)") was meant to stay.
- [ ] **Profile Photo:** keeps its own heading line (a real subsection with three pieces — avatar, Choose, Remove), but the row itself becomes one compact inline line: avatar + a small "➕ Choose" button + a small "➖ Remove" button, instead of Choose Photo as a full-width block below the avatar.
- [ ] **Organize:** "Reorganize Categories" becomes a small inline button next to the label, not full-width.
- [ ] **Backup:** Export/Import become small inline buttons ("📤 Export" / "📥 Import") next to the label; the existing note paragraph stays below in its current small muted style.
- [ ] **Weather:** the API key input moves onto the same line as the label; the existing note paragraph stays below.
- [ ] **Icons — adopting the user's exact choices:** ➕ Choose, ➖ Remove, 📤 Export, 📥 Import. Matches the emoji-heavy style already used everywhere else in the app (🔎, 🇧🇷, ☀️🌙, weather icons).
- [ ] **Scope — Settings only, new dedicated classes.** `.option-row`, `.options-section`, and `.testing-reset-btn` are shared by Add Tile, Weather Options, Clock Options, and other `.help-overlay` dialogs — this build adds new Settings-specific compact classes rather than shrinking those shared ones, so nothing outside `#settings-view` changes as a side effect. The user's own framing ("let's start with Settings") suggests more of these cleanups may follow for other dialogs later, as separate items.

Not yet authorized to build.

## Build Planner

_Backlog of active items to get to eventually — not being actively worked on. Promote to the Build Queue when ready to start. Resolved/built/dropped/superseded items are not kept here — see Build Log entries for that history._

### Planner 1. Add a favicon

- [ ] No `<link rel="icon">` is declared in `index.html` and no `favicon.ico` file exists in the repo, so browsers automatically request `/favicon.ico` on every load and it 404s. Purely cosmetic (console/server-log noise only), unrelated to any widget functionality. Low priority — planned for the final build stage.

### Planner 2. Consumers of tile usage statistics: sort-by, reports, unused-tile cleanup

Usage data (`createdAt`/`lastUsedAt`/`useCount` per tile) already exists and is live in the Sort Tiles feature — nothing here is blocked on data, each item is just undesigned.

- [ ] **"Sort category by..."** — a way to reorder a single category's tiles by something other than manual drag order: by name (A–Z), most recently used, most used (`useCount` descending), or newest (`createdAt` descending). **Open question to settle before promoting:** is this a one-time re-sort that permanently rewrites the stored order (same array Move Entry/multi-select already reorder), or a live view toggle that displays sorted without touching the stored order (would need its own per-category preference, e.g. `category-sort-<id>` in localStorage, and a render-time sort pass instead of a storage rewrite)? These behave very differently once the user manually drags a tile afterward. Also undecided: where the control lives — a small menu near each category header, akin to `.category-collapse-btn`'s spot, is the leading candidate but not settled.
- [ ] **"Reports"** — a summary view across *all* categories, not just one: candidates include most-used tiles overall, least/never-used tiles, and recently-added tiles. **Index source — decided: DOM-driven, not storage-driven** (`document.querySelectorAll('.category[data-category-id]')` + the tiles inside each): `wireTileGrids` renders every category's tiles into the DOM eagerly at load — collapsed categories are just `[hidden]`, their tiles are still there — and every mutation already patches the live DOM element alongside its storage write, so the DOM is never stale. Storage-driven (scanning `category-tiles-*` keys) was rejected: it would surface orphaned tiles left behind under a since-deleted category, which a report should never include. Where this renders is still completely open — a new popup reusing the `.help-overlay` pattern every other popup already uses is the natural fit structurally, but the actual layout/content of a "report" hasn't been designed at all yet.
- [ ] **Aid in removal of unused tiles** — surface tiles that are stale (e.g. `useCount === 0`, or `lastUsedAt` older than some threshold) so they're easy to find and clean up, rather than requiring the user to notice them on their own. Likely pairs naturally with the "Reports" view above (a "never used" or "not used in N days" list) as the entry point. **Open question:** does removal reuse the existing single-tile Delete (tile menu) one at a time from that list, or does this need batch delete added to multi-select (which today only supports Move, not Delete, for a selected group)? Not decided — worth revisiting once the reports view itself has a shape.
