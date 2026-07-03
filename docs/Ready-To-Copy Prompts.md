Below are the **ready-to-copy prompts** to use by phase/batch. I’d run these in order. 🧨

Site: [https://am-i-fundable.vercel.app/](https://am-i-fundable.vercel.app/)  
Github: [https://github.com/JFeimster/am-i-fundable](https://github.com/JFeimster/am-i-fundable)  
Vercel: [https://vercel.com/jason-feimsters-projects/am-i-fundable](https://vercel.com/jason-feimsters-projects/am-i-fundable)   
ChatGPT: [https://chatgpt.com/c/69ff4311-e218-83ea-8b99-9cfe59ede115?mweb\_fallback=1](https://chatgpt.com/c/69ff4311-e218-83ea-8b99-9cfe59ede115?mweb_fallback=1) 

---

# **Phase 1 — ChatGPT ZIP Seed Pack**

## **Prompt 1 — Generate Batch 1–3 Foundation ZIP**

Generate Batch 1–3 for the Funding Readiness Scorecard tool as a downloadable ZIP seed pack.

**Project**:  
[Funding Readiness Scorecard](https://am-i-fundable.vercel.app/)

**Goal**:  
Create the foundation files only. Do not generate the full landing page again. Do not overwrite existing index.html, styles.css, script.js, widget.html, widget.css, or widget.js yet.

Use the previously defined tool architecture and file table.

**Create these files:**

Batch 1 — Data Boundaries \+ Compliance  
\- /docs/data-boundaries.md  
\- /config/registry-visibility.json  
\- /config/registry-manifest.json  
\- /docs/compliance-rules.md  
\- /data/compliance-copy.public.json

Batch 2 — Core Scoring Contract  
\- /config/funding-readiness-scorecard.config.json  
\- /internal/scoring/lead-scoring-model.registry.json  
\- /config/borrower-qualification-stack.registry.json  
\- /schemas/scorecard-data-contract.schema.json  
\- /schemas/scorecard-submission.schema.json  
\- /schemas/scorecard-result.schema.json

Batch 3 — Shared Score Engine  
\- /lib/scorecard-engine.js  
\- /lib/validation.js  
\- /lib/result-copy.js  
\- /lib/recommendation-engine.js

**Rules**:  
\- Use plain JavaScript modules.  
\- Use valid JSON with two-space indentation.  
\- Keep public files browser-safe.  
\- Keep internal scoring/routing concepts out of public JSON unless they are safe labels.  
\- Use compliance-safe funding language.  
\- Do not use “approved,” “guaranteed,” “you qualify,” or “instant approval.”  
\- Include comments where helpful, but do not over-comment.  
\- Make the scoring engine reusable by widget, landing page, and API routes.  
\- Include a README in the ZIP explaining how these files fit into the current repo.

**Output**:  
\- Create a downloadable ZIP named funding-readiness-foundation-batch-1-3.zip  
\- Also include a concise file tree and summary after generating the ZIP.

---

# **Phase 2 — ChatGPT ZIP Seed Pack**

## **Prompt 2 — Generate Batch 4–7 Data/API ZIP**

Generate Batch 4–7 for the Funding Readiness Scorecard tool as a downloadable ZIP seed pack.

Project:  
Funding Readiness Scorecard

Goal:  
Create the internal product/provider structure, public-safe data transforms, lead capture schemas, CRM mappings, and API scaffolding.

Do not regenerate the landing page or widget UI files yet.

Create these files:

Batch 4 — Internal Product/Provider Data  
\- /internal/products/funding-products.registry.json  
\- /internal/providers/funding-providers.registry.json  
\- /internal/routing/funding-provider-rules.registry.json  
\- /internal/routing/funding-routing-rules.json  
\- /internal/routing/product-fit-rules.json  
\- /internal/routing/provider-fit-rules.json  
\- /internal/routing/disqualifier-rules.json  
\- /internal/routing/lead-priority-rules.json  
\- /internal/routing/manual-review-rules.json

Batch 5 — Public-Safe Product Data  
\- /lib/public-transform.js  
\- /scripts/build-public-data.js  
\- /data/products.public.json  
\- /data/product-families.public.json  
\- /data/provider-categories.public.json  
\- /data/public-funding-directory.public.json  
\- /config/directories/public-funding-directory.registry.json

Batch 6 — Lead Capture \+ Intake Schema  
\- /config/forms/funding-lead-fields.registry.json  
\- /config/lead-field-map.public.json  
\- /schemas/funding-applicant.schema.json  
\- /schemas/funding-pipeline-lead.schema.json  
\- /internal/intake/intake-verification-paths.registry.json  
\- /internal/crm/funding-pipeline-field-map.json  
\- /internal/crm/hubspot-field-map.json  
\- /internal/crm/notion-field-map.json  
\- /internal/crm/webhook-targets.example.json

Batch 7 — API Routes  
\- /api/submit-score.js  
\- /api/match-partners.js  
\- /api/lender-match-review.js  
\- /api/health.js  
\- /lib/partner-match-engine.js  
\- /schemas/partner-match-result.schema.json  
\- /schemas/webhook-event.schema.json

Rules:  
\- Do not expose provider names, affiliate URLs, apply URLs, commissions, contact emails, private notes, or internal routing rules in browser-safe data files.  
\- Public data should use white-labeled labels such as “Working Capital Network,” “Marketplace Seller Capital,” and “Business Credit Builder.”  
\- API files should be Vercel-compatible serverless functions.  
\- API files should include safe placeholder webhook behavior, not real secrets.  
\- Use environment variable placeholders where needed.  
\- Include human-review-first language.  
\- Do not claim approval, underwriting, rates, or final eligibility.  
\- Include clear comments marking where HubSpot, Notion, Airtable, Google Sheets, or n8n can be connected later.  
\- Include a README in the ZIP explaining the API/data architecture.

Output:  
\- Create a downloadable ZIP named funding-readiness-data-api-batch-4-7.zip  
\- Include a concise file tree and summary after generating the ZIP.

---

# **Phase 3 — Codex Repo Integration**

## **Prompt 3 — Codex Apply Foundation \+ API Packs**

You are working in the Funding Readiness Scorecard repo.

Goal:  
Apply the generated Batch 1–7 seed files to the repo, wire the shared logic, and preserve the existing widget and landing page behavior.

Inputs:  
\- funding-readiness-foundation-batch-1-3.zip  
\- funding-readiness-data-api-batch-4-7.zip  
\- Existing static files:  
  \- index.html  
  \- styles.css  
  \- script.js  
  \- widget.html  
  \- widget.css  
  \- widget.js  
  \- embed-example.html

Tasks:  
1\. Add all new files from both ZIP packs into the repo using their intended paths.  
2\. Refactor duplicated scoring logic out of script.js and widget.js into /lib/scorecard-engine.js where practical.  
3\. Keep the current landing page and widget working.  
4\. Update script.js and widget.js to use the shared scoring model/config when possible.  
5\. Ensure public-facing files only consume browser-safe data from /data and /config.  
6\. Ensure /internal files are not imported into browser code.  
7\. Ensure API routes use internal data only server-side.  
8\. Add or update package/config only if required.  
9\. Do not introduce React, Next.js, npm dependencies, or build tooling unless the repo already uses them.  
10\. Keep the static-first architecture.

Validation:  
\- Check JSON validity.  
\- Check JS syntax.  
\- Confirm widget still calculates score.  
\- Confirm landing page still calculates score.  
\- Confirm API routes do not expose internal provider data.  
\- Confirm no real secrets, API keys, or private credentials are committed.  
\- Confirm no public file includes affiliate URLs, commission rates, contact emails, or raw provider routing rules.

Output:  
\- Commit-ready changes.  
\- Summary of files added.  
\- Summary of files modified.  
\- Any warnings or follow-up tasks.

---

## **Prompt 4 — Codex Refactor Frontend to Shared Engine**

Refactor the Funding Readiness Scorecard frontend to use the shared scoring engine.

Goal:  
Make index.html/script.js and widget.html/widget.js use the same core scoring and recommendation logic from /lib/scorecard-engine.js and /lib/recommendation-engine.js.

Tasks:  
1\. Review current script.js and widget.js.  
2\. Identify duplicate scoring, tiering, result-copy, and recommendation logic.  
3\. Move shared logic into:  
   \- /lib/scorecard-engine.js  
   \- /lib/recommendation-engine.js  
   \- /lib/result-copy.js  
   \- /lib/validation.js  
4\. Update script.js and widget.js to call the shared functions.  
5\. Keep browser compatibility.  
6\. Do not break iframe/embed usage.  
7\. Do not expose /internal data to browser code.  
8\. Keep the existing visual UI intact unless a small markup adjustment is necessary.  
9\. Preserve current event hooks:  
   \- window.fundingReadinessResult  
   \- fundingReadinessCalculated

Validation:  
\- Run a manual test using at least four fixture profiles:  
  \- hot lead  
  \- warm lead  
  \- nurture lead  
  \- not-ready lead  
\- Confirm score tiers and recommendations are consistent between landing page and widget.  
\- Confirm lead capture gate still works.  
\- Confirm retake/reset still works.  
\- Confirm no console errors.

Output:  
\- Summary of refactor.  
\- Files changed.  
\- Any remaining duplication.  
\- Recommended next improvements.

---

# **Phase 4 — Jules Parallel Docs/Support Expansion**

## **Prompt 5 — Jules Generate Docs \+ Knowledge Files**

Create the documentation and knowledge-support files for the Funding Readiness Scorecard repo.

Do not change core app logic.  
Do not modify index.html, widget.html, script.js, or widget.js unless needed for links to docs.

Create these files:

Batch 13 — Knowledge Base Support  
\- /knowledge/README.md  
\- /knowledge/funding/README.md  
\- /knowledge/funding/index.json  
\- /knowledge/funding/examples.md  
\- /knowledge/automation/README.md  
\- /knowledge/automation/index.json  
\- /knowledge/crm/README.md  
\- /knowledge/engineering-as-marketing/README.md  
\- /knowledge/engineering-as-marketing/index.json  
\- /knowledge/engineering-as-marketing/examples.md

Batch 14 — Docs \+ Deployment  
\- /docs/README.md  
\- /docs/embed-instructions.md  
\- /docs/compliance-guardrails.md  
\- /docs/testing-checklist.md  
\- /docs/deployment.md  
\- /docs/vercel-env.md  
\- /docs/naming-conventions.md  
\- /docs/merge-readiness-checklist.md

Rules:  
\- Keep documentation concise and operational.  
\- Include copy/paste embed instructions.  
\- Include public-vs-internal data rules.  
\- Include compliance-safe funding language.  
\- Include no-guarantee disclaimers.  
\- Include deployment instructions for Vercel/static hosting.  
\- Include testing checklist for widget, landing page, API routes, and data boundaries.  
\- Do not include secrets.  
\- Do not include private provider URLs, commissions, or contacts.

Validation:  
\- Markdown should be clean and readable.  
\- JSON files must be valid JSON with two-space indentation.  
\- Confirm all referenced paths exist or are clearly marked as planned.

Output:  
\- Add files in the requested paths.  
\- Provide a summary of files created.  
\- Note any assumptions.

---

## **Prompt 6 — Jules Generate Workflow \+ Template Files**

Create workflow and template files for the Funding Readiness Scorecard repo.

Do not modify core scoring logic.  
Do not modify public frontend files unless needed for documented integration points.

Create these files:

Batch 12 — Workflow Automations  
\- /workflows/n8n/funding-readiness-scorecard.n8n.json  
\- /workflows/make/funding-readiness-scorecard-make.md  
\- /workflows/zapier/funding-readiness-scorecard-zapier.md  
\- /templates/internal-score-alert.md  
\- /templates/human-review-task.md

Batch 11 — Result/Nurture Templates  
\- /templates/applicant-result-email.md  
\- /templates/funding-prep-checklist.md

Rules:  
\- n8n workflow can be a safe starter JSON template, not production secrets.  
\- Use placeholder webhook URLs.  
\- Include fields from scorecard submission:  
  \- name  
  \- email  
  \- phone  
  \- businessName  
  \- state  
  \- monthlyRevenue  
  \- timeInBusiness  
  \- creditScore  
  \- fundingPurpose  
  \- desiredFundingAmount  
  \- redFlags  
  \- fundingReadinessScore  
  \- scoreTier  
  \- primaryFundingFamily  
  \- leadPriority  
\- Internal alert should be human-review-first.  
\- Applicant email must not say approved, guaranteed, or qualified.  
\- Prep checklist should be useful for low and mid-score users.

Validation:  
\- Markdown files are readable.  
\- JSON files are valid.  
\- No real secrets.  
\- No private affiliate/apply URLs.  
\- No approval language.

Output:  
\- Files created.  
\- Summary of intended workflow.  
\- Remaining setup steps for production.

---

# **Phase 5 — GitHub Review**

## **Prompt 7 — GitHub Connector PR Review**

Use the GitHub connector to review the Funding Readiness Scorecard repo/PR.

Goal:  
Review the generated files and confirm the implementation is safe, complete, and merge-ready.

Review areas:  
1\. File structure matches the recommended batch plan.  
2\. Public files do not expose internal/provider data.  
3\. Internal data stays under /internal or API-only paths.  
4\. Browser files only import from browser-safe /data, /config, or /lib files.  
5\. API routes do not leak:  
   \- provider names unless explicitly public  
   \- affiliate URLs  
   \- apply URLs  
   \- commission rates  
   \- contact emails  
   \- private routing notes  
6\. Score logic is centralized as much as practical.  
7\. Widget and landing page use consistent scoring.  
8\. JSON files are valid.  
9\. JS files are syntactically valid.  
10\. Docs include embed, deployment, compliance, and testing guidance.  
11\. No secrets or credentials are committed.  
12\. No approval/guarantee language is present.

Output:  
\- Merge readiness status:  
  \- Ready to merge  
  \- Needs minor fixes  
  \- Needs major fixes  
\- List of blocking issues, if any.  
\- List of non-blocking improvements.  
\- Suggested PR comment.  
\- Suggested next task batch.

---

# **Phase 6 — Deployment / Vercel Check**

## **Prompt 8 — Vercel Deployment Review**

Use the Vercel connector to review the Funding Readiness Scorecard deployment.

Goal:  
Confirm the landing page, widget, embed example, and API routes deploy correctly.

Check:  
1\. Production/preview deployment status.  
2\. Build logs.  
3\. Static page availability:  
   \- /  
   \- /index.html  
   \- /widget.html  
   \- /embed-example.html  
4\. API route availability:  
   \- /api/health  
   \- /api/submit-score  
   \- /api/match-partners  
   \- /api/lender-match-review  
5\. Environment variables required by API routes.  
6\. Any 404s, build errors, or runtime errors.  
7\. Whether auto-deploy behavior matches the repo preference.  
8\. Whether public files expose internal JSON.

Output:  
\- Deployment status.  
\- Any errors found.  
\- Exact file or route causing the issue.  
\- Recommended fix.  
\- Next action.

---

# **Optional Phase — Full Support/Ecosystem Files**

## **Prompt 9 — Generate Optional Ecosystem Batch**

Generate the optional support/ecosystem files for the Funding Readiness Scorecard repo.

These files are not required for MVP launch, but useful for indexing, future assistants, repo consistency, and portfolio packaging.

Create:

\- /schemas/public-product.schema.json  
\- /schemas/funding-product.schema.json  
\- /schemas/vercel-project.schema.json  
\- /schemas/agent.schema.json  
\- /schemas/custom-gpt.schema.json  
\- /config/eam-tools.registry.json  
\- /internal/tools/funding-tools.registry.json  
\- /internal/partners/embed-partners.json  
\- /site-data/tags.json  
\- /site-data/categories.json  
\- /site-data/agents.fallback.json  
\- /skills/funding-language-safety-review/SKILL.md  
\- /skills/schema-starter-builder/SKILL.md  
\- /skills/automation-workflow-spec-writer/SKILL.md  
\- /examples/funding/README.md  
\- /examples/funding/funding-kb.html  
\- /portfolio/gemini-gems/funding-readiness-helper.md

Rules:  
\- Keep files useful, not decorative.  
\- Mark optional/experimental files clearly.  
\- Do not expose private partner/provider details.  
\- Keep schemas valid.  
\- Keep skill files operational with purpose, when to use, procedure, guardrails, and validation checklist.  
\- Keep examples safe and public-facing.

Output:  
\- Add files in requested paths.  
\- Summary of what each optional group enables.  
\- Any files that should remain internal-only.

---

# **Fastest Practical Execution Prompt**

Use this when you want to start immediately in this thread:

Proceed with Prompt 1\. Generate Batch 1–3 for the Funding Readiness Scorecard as a downloadable ZIP seed pack. Do not generate the full landing page again. Do not modify the existing widget or landing page files yet.

