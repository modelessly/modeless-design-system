# Release Process

Modeless Design System is pre-1.0. Treat public releases as intentionally conservative: keep the package boring to install, clear to import, and honest about component maturity.

## Versioning

- Patch versions are for bug fixes, docs corrections, accessibility fixes, and package metadata fixes that do not change public APIs.
- Minor versions may add components, tokens, props, exports, or experimental surfaces.
- Breaking changes may happen before 1.0, but they must be called out in `CHANGELOG.md`.
- Experimental visualization and commerce components may change faster than stable primitives.

## Prereleases

Use prereleases when testing npm distribution or larger API changes with early adopters:

```bash
npm version prerelease --preid beta
```

Publish prereleases under a matching npm tag, for example:

```bash
npm publish --tag beta
```

## Pre-Publish Checklist

- [x] Final package name is confirmed as `@modeless/design-system`.
- [ ] `package.json` metadata, repository, files, exports, and peer dependencies are current.
- [ ] `CHANGELOG.md` includes the release notes.
- [ ] `npm run verify` passes locally.
- [ ] GitHub Actions CI is green on `main`.
- [ ] `npm pack --dry-run --cache ./.npm-pack-cache` contents are reviewed.
- [ ] `npm publish --dry-run` succeeds.
- [ ] README install instructions match the package name being published.

## GitHub Soft Launch Checklist

- [ ] Release-readiness docs are current.
- [ ] CI is active and green.
- [ ] Public templates and security policy are present.
- [ ] Known beta and experimental areas are labeled clearly.
- [ ] Private planning notes remain outside git.
