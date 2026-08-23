# NAQLA Platform Visual QA

## Mobile RTL baseline

The `/` and `/naqla` routes were captured at a 390×844 viewport after a production rebuild. The home route presents the three engines and a direct operating-workspace entry without unsubstantiated numerical claims, partner logos, or external-integration claims. The workspace route maintains a single-column flow, visible active-context controls, visible deterministic actions, and readable journey stages without horizontal overflow.

## Follow-up checks

The final acceptance pass will repeat screenshots after the full test suite and validate the English LTR state as part of the browser smoke tests.

## Desktop follow-up

The current desktop captures of `/` and `/naqla` load successfully after the production build. The home route uses Arabic RTL hierarchy, exposes the three engines and a clear workspace call-to-action, and does not display unsupported partner, integration, or numerical claims. The workspace retains a visible Synthetic Demo label, explicit deterministic controls, a separated Commercial Asset/Commercial Transaction treatment, readable NAQLA1–3 progress, and no exposed identifiers or diagnostic text.

## Mobile follow-up

The latest 390×844 capture of `/naqla` remains a readable single-column RTL layout. The synthetic-data label, active-context panel, progress indicators, deterministic control, and complete journey map remain visible without horizontal overflow or exposed technical identifiers.

## Public smoke observation

The public `uplink5.xyz` root route returned the expected NAQLA landing page. Navigation to `/naqla` reached the operating-workspace route; the browser initially displayed its loading treatment while the route bundle resolved. The final publish checkpoint must include the latest invitation-context UI before recording the final public smoke result.

## Public smoke follow-up

After the latest checkpoint, the public `/naqla` route still rendered the older localized invitation wording (`دعوة عضوية اصطناعية`) rather than the new server-only invitation copy. The route itself is reachable and operational, but this content mismatch is recorded as a deployment/cache verification gap. It must not be reported as a successful final smoke verification until the current checkpoint is visibly served.

Browser diagnostics found no registered service worker. The public browser received `NaqlaJourneyWorkspace-CqwXndjV.js`, while the local acceptance build produced a different current bundle filename. This indicates that the remaining smoke gap is serving-version propagation rather than a browser service-worker cache.

A second public smoke retry after a follow-up checkpoint produced the same older invitation copy. The public root and `/naqla` routes remain reachable, but the latest bundle propagation has not yet been independently verified; final smoke remains **not passed**.

## Final public smoke result

The latest comparison passed: both the preview route and `https://uplink5.xyz/naqla` now render the current server-only invitation wording and the updated server-role evidence guidance. The custom-domain bundle propagation gap cleared without enabling any external-AI provider. Public smoke is **passed** for `/` and `/naqla`.

## Latest mobile verification

The 390×844 full-page capture after adding the server synthetic-record action retained a readable single-column layout. The context panel, engine progress, NAQLA1 controls, commercial separation cards, and full journey map remain within the viewport width with no horizontal overflow.
