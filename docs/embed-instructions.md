# Embed Instructions

The Funding Readiness Scorecard can be embedded on external sites using the provided widget files.

## Files Required

To embed the widget, you need to reference the following files:
- `widget.css`: The styling for the embed.
- `widget.js`: The logic that powers the embed.
- `widget.html`: The markup snippet to inject.

## Basic Implementation

Include the CSS in the `<head>` of your page:
```html
<link rel="stylesheet" href="https://[YOUR_VERCEL_URL]/widget.css">
```

Include the script at the end of the `<body>`:
```html
<script src="https://[YOUR_VERCEL_URL]/widget.js"></script>
```

Add the target container where you want the widget to appear:
```html
<div id="funding-scorecard-widget"></div>
```

**Note:** Replace `[YOUR_VERCEL_URL]` with your actual deployed Vercel domain.

## See Also

Review `embed-example.html` in the repository root for a complete, working example of the embed implementation. **Do not** redesign the UI; the widget is intended to use the standardized styling provided in `widget.css`.
