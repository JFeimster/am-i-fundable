# Funding Readiness Scorecard — Foundation Seed Pack

This ZIP contains Batch 1–3 foundation files for the Funding Readiness Scorecard.

It does **not** replace existing frontend files:

```txt
index.html
styles.css
script.js
widget.html
widget.css
widget.js
embed-example.html
```

## Batches included

1. **Data Boundaries + Compliance** — public/internal data rules and safe copy.
2. **Core Scoring Contract** — shared quiz config, scoring model, and schemas.
3. **Shared Score Engine** — reusable JavaScript modules for the widget, landing page, and future API routes.

## Next step

Add this folder structure to the repo, then refactor `script.js` and `widget.js` to call `/lib/scorecard-engine.js` instead of maintaining separate scoring logic.

Do not import `/internal` files into browser code.
