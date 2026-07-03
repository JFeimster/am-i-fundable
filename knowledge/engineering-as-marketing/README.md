# Engineering as Marketing

This document explains how the Funding Readiness Scorecard operates as a growth and lead-capture tool.

## Overview

"Engineering as marketing" involves building useful tools (like calculators or scorecards) to generate leads and provide value upfront. The Funding Readiness Scorecard is designed to do this safely, providing educational pre-screening guidance in exchange for contact information.

## Lead Capture

The scorecard functions as an interactive lead magnet. Instead of a static PDF, users receive personalized recommendations based on their inputs.
- The form is optimized to capture essential qualification data without being overly burdensome.
- Data is securely passed to the backend for scoring and routing.

## Embedded Widgets

The scorecard can be embedded directly into partner websites or landing pages using the provided widget files (`widget.html`, `widget.js`).
- This allows for decentralized lead capture across multiple digital properties.
- The widget maintains the core scoring logic and compliance guardrails regardless of where it is hosted.

## GPT Actions and Automation

The underlying API routes (`/api/match-partners.js`, `/api/submit-score.js`) can be exposed to Custom GPTs or other automated workflows.
- A Custom GPT could act as a "Funding Assistant", guiding a user through questions and hitting the API to retrieve a readiness score.
- This creates alternative interactive paths to the same standardized lead capture and scoring system.

## Follow-up Workflows

Once a lead is captured, it can trigger automated follow-up workflows based on their specific funding readiness path.
- "Ready" profiles might receive information on next steps and document preparation.
- "Not Ready" profiles can be placed into nurture sequences focused on building credit or establishing revenue.
- These workflows are triggered via webhook and managed in an external automation platform or CRM.
