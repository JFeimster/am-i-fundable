# API Versioning

This repo uses lightweight static-first API versioning.

## Current version

```txt
1.0.0
```

## Version surfaces

Version metadata appears in:

```txt
/api/version
/config/api/api-routes.registry.json
/config/api/public-api.registry.json
/config/api/internal-api.registry.json
/schemas/openapi/*.yaml
/schemas/api/*.schema.json
```

## Semantic versioning rules

Use:

```txt
MAJOR.MINOR.PATCH
```

### Patch

Use patch changes for:

- copy clarification
- docs updates
- example payload additions
- non-breaking schema descriptions
- validation script improvements

### Minor

Use minor changes for:

- new optional fields
- new routes
- new examples
- new public funding path categories
- new webhook event types that do not break existing consumers

### Major

Use major changes for:

- required field changes
- removed routes
- renamed operation IDs
- incompatible response shape changes
- changed auth requirements for public routes

## Route deprecation

When deprecating a route:

1. Keep the route available during transition.
2. Mark it deprecated in OpenAPI.
3. Add replacement route in docs.
4. Add test coverage for both old and new behavior.
5. Remove only in a major version.

## Backward compatibility

Public GPT Actions are sensitive to operation IDs and schema shape.

Avoid changing operation IDs unless there is a strong reason.
