# Contributing to AWCR

Thank you for improving the project. Keep changes focused, accessible, and grounded in clearly labelled prototype assumptions.

## Workflow

1. Create a branch from `develop` using the `feature/` prefix.
2. Make one logical change set and run `npm run check`.
3. Check desktop and mobile layouts, keyboard navigation, and reduced-motion behaviour.
4. Open a pull request with a concise explanation, screenshots for visual changes, and any relevant research sources.

## Code conventions

- Use native semantic HTML, CSS custom properties, and ES modules.
- Keep data in `src/data/` and UI behaviour in `src/js/`.
- Do not introduce a framework or large runtime library without discussion.
- Use relative asset paths to preserve GitHub Pages compatibility.
- State whether any measurements are simulated, estimated, or observed.

## Commit messages

Use imperative messages such as `Add coil alignment annotation` or `Improve mobile road controls`.
