# Deployment Contract

The Funding Readiness Scorecard is static-first. This document records the repository contract; it does not authorize a deployment or a change to project settings.

## Static build

- `npm run build` runs the canonical `scripts/build-static-dist.js` builder.
- The builder recreates only `dist/` and does not delete or move the source `api/` tree.
- `vercel.json` sets `buildCommand` to `npm run build` and `outputDirectory` to `dist`.

## Vercel API packaging

- `api/index.js` is the single consolidated Vercel API entry point.
- The rewrites in `vercel.json` route `/api` and `/api/:path*` through that entry point.
- `.vercelignore` excludes `api/*.js` and `api/**/*.js`, then explicitly preserves `api/index.js`.
- The individual API route files remain committed as documentation, tests, and source reference. They must not become separate Vercel Functions.

This packaging keeps the deployed Vercel function count at one and avoids reintroducing per-route function-limit pressure.

## Deployment controls

Automatic production and preview deployments must remain disabled:

```json
"deploymentEnabled": {
  "main": false,
  "*": false
}
```

Changing either value, changing Vercel settings, or deploying requires a separate and explicit release authorization.

## Other hosting support files

`_headers` and `_redirects` are copied by the canonical static builder, and `functions/api/**` contains Cloudflare Pages handlers. They are active host-specific support files, not additional Vercel Function entry points, and do not replace the consolidated `api/index.js` Vercel contract.

## Verification

Before a pull request, run:

```bash
npm run check
```

That command runs validation, tests, and the static build locally. It does not deploy or call production.

`npm run verify:production` is an explicit/manual live smoke test. It must not run on normal pull requests; the validation workflow exposes it only through `workflow_dispatch` when `run_production_smoke` is enabled.
