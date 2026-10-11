# Web access and landing polish — October 11, 2026

## Changes

- Distinguish the available browser app from the upcoming native iOS/Android apps, with direct `/app/` links in the hero, navigation and mobile waitlist section.
- Replace the oversized final waitlist headline with an available-Web card and a separate mobile notification form; stack the cards below 1100px.
- Remove the animated custom cursor, the native-cursor suppression rule and the hero mouse-follow glow.
- Remove an unlayered universal `margin: 0` declaration that overrode Tailwind's authored centering and spacing. Tailwind preflight still supplies the baseline reset.
- Fix the sidebar's duplicate vertical translation, increase inactive navigation contrast and keep its background readable over the light FAQ section.
- Preserve navigation requests while lazy sections load; enlarge mobile header targets and fit the seven-item menu on small phones.
- Remove the prominent analytics control from public footers and account access. Keep optional data preferences under Privacy and Web Settings, labeled “Privacy settings.” Analytics reports remain private.
- Center the preferences dialog, constrain its height, allow internal scrolling and exclude it from Lenis scroll handling. Preserve default opt-out, the replay/events dependency, cancellation and persisted preferences.

## Verification

- Root and Web lint pass; root and Web production builds pass.
- Web tests: 47 pass, 3 emulator-dependent tests skipped locally. GitHub CI runs the required emulator checks before production promotion.
- Browser checks cover desktop, 900px tablet, 390px phone and 320px phone: no horizontal document overflow on the tested landing layouts; invalid email stays local; the privacy dialog fits the small viewport, Cancel discards changes and Save preserves the disabled preferences.
- Verified the lazy-section navigation request eventually reaches the requested mobile section after a fresh page load.
- No valid waitlist submission or email was sent during browser checks.

## Existing limitations

- Native mobile apps remain upcoming; this release does not publish them or enable Founder checkout.
- Optional PostHog collection still requires a configured project and visitor opt-in. The dialog reports its actual configured state.
- Existing legal notices are still drafts pending operator and other publication details. This release does not certify legal compliance.
