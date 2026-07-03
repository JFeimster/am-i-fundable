# Deployment

The Funding Readiness Scorecard is designed to be deployed to Vercel.

## Vercel Setup

The repository includes a `vercel.json` file that configures deployments.

- **Do not alter `vercel.json` unless explicitly required.** It is configured to handle API routes and static assets correctly based on the current architecture.
- The `/api` directory is automatically treated as Serverless Functions by Vercel.

## Deployment Steps

1.  Connect your GitHub repository to a new Vercel project.
2.  Leave the Build Command empty (or use `npm run validate` if you want builds to fail on validation errors).
3.  Set the Output Directory to the root (default) as static files are served from the root.
4.  Configure required Environment Variables in the Vercel dashboard (see `vercel-env.md`).
5.  Deploy.

## Post-Deployment

After deployment, test the live URL to ensure:
- The static HTML/CSS/JS loads correctly.
- The API endpoints (e.g., `/api/health`) are responsive.
- The embedded widget works when hosted on an external domain (if CORS is configured).
