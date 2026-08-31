---
name: water-ui-component-design
description: Always use when creating, modifying, or reviewing Water UI Vue 3 components, theme tokens, demos, or docs pages in this repository so they follow the water-drop visual system, Alibaba front-end code standards, and shared API conventions.
---

# Water UI Component Design

This skill defines the mandatory design contract for every Water UI component in this repository.

## When To Apply

Use this skill whenever:

- Creating a new component under `packages/water-ui/src/components`.
- Changing an existing `Wt*` component, its props, events, slots, or styles.
- Adding or changing theme tokens under `packages/theme`.
- Adding component demos or docs pages under `apps/docs`.
- Reviewing whether a component follows the shared Water UI visual and interaction language.

## Project Shape

The repository is a pnpm workspace:

```text
packages/theme/         Design tokens, themes, shared Sass mixins and keyframes
packages/water-ui/      Component library
apps/docs/              Documentation site built with the component library
```

Dependencies must stay one-directional:

```text
theme -> water-ui -> docs
```

## Naming And API Contract

Every component must follow these rules:

- Folder and file: `packages/water-ui/src/components/<kebab-name>/`.
- Component name: `WtPascalName`.
- Tag name: `<wt-kebab-name />`.
- CSS classes: `wt-<component-name>`.
- CSS custom properties: `--wt-*`.
- Props use camelCase.
- Events use kebab-case.
- `v-model` is the standard binding for form-like state.
- Named slots are preferred over complex content props.
- Export the component and its props/events/types from the package entry.

Use:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from './props'

defineOptions({ name: 'WtButton' })

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

## Code Standards

All Vue, TypeScript, Sass, and JavaScript code in Water UI must follow the [Alibaba Front-end Coding Guidelines](https://github.com/alibaba/f2e-spec).

- Use `eslint-config-ali` as the shared ESLint baseline.
- For Vue 3 + TypeScript code, use the Vue/TypeScript configuration exported by `eslint-config-ali`; do not introduce a parallel style convention.
- Keep the component API and naming rules above consistent with these guidelines.
## Water-Drop Visual System

The visual language is the core product constraint, not a per-component decoration.

### Tokens

Components must consume CSS variables from `packages/theme`. Do not hard-code colors, shadows, radii, motion durations, or highlight geometry in component styles.

Core tokens include:

```scss
--wt-bg
--wt-surface
--wt-surface-strong
--wt-text
--wt-text-secondary
--wt-text-placeholder
--wt-primary
--wt-success
--wt-warning
--wt-danger
--wt-info
--wt-radius-xs / sm / md / lg
--wt-motion-normal / slow
--wt-highlight-size / small-size
--wt-highlight-radius / small-radius
--wt-shadow-dark-alpha
--wt-shadow-dark-alpha-strong
--wt-highlight
--wt-highlight-small
--wt-shadow-dark
--wt-shadow-deeper
--wt-shadow-light
```

### Highlight Shape

All component highlights must reuse the same elliptical water-drop shape:

```scss
--wt-highlight-radius: 58% 42% 55% 45% / 48% 38% 62% 52%;
--wt-highlight-small-radius: 50% 50% 60% 40% / 45% 55% 45% 55%;
```

Use `var(--wt-highlight-radius)` and `var(--wt-highlight-small-radius)` instead of repeating hard-coded `border-radius` values.

### Highlight Elements

Interactive surface components should have two pseudo-element highlights:

- Main highlight: larger, upper-right, elliptical.
- Small highlight: smaller, further lower-right, elliptical.

Highlight size must use the shared `--wt-highlight-size` and `--wt-highlight-small-size` tokens and remain inside the component bounds.

Table components must also include the same top-right double highlight and an edge-only liquid deformation. The table should preserve horizontal scrolling, animate the four rounded edges without scaling the text area, and keep the two highlights clearly separated so they never overlap.

### Shadow Layers

The water droplet feel comes from both inner and outer shadows:

```scss
box-shadow:
  inset 3px 4px 8px rgba(0, 0, 0, 0.15),
  inset -2px -2px 5px var(--wt-shadow-light),
  3px 4px 12px rgba(0, 0, 0, 0.1),
  0 1px 4px rgba(0, 0, 0, 0.06);
```

Do not replace this with a generic flat shadow.

### Liquid Motion

Animation should express subtle water flow. Prefer `transform`, `opacity`, and `border-radius`; avoid layout-triggering properties.

- Standard components may use `wt-liquid-flow`.
- Inputs and softer surfaces should use `wt-liquid-flow-subtle` to keep amplitude small.
- Respect `prefers-reduced-motion`.
- Do not create large synchronized animation loops without pausing or randomizing phase.

## Ripple Diffusion

Ripple diffusion is a button-only interaction in the current contract.

- Only `WtButton` creates ripple diffusion.
- Non-button components such as Link, Tag, Switch, Slider, and Input must not add ripple.
- Ripple is disabled by default through `--wt-ripple-enabled: 0`.
- The button reads `--wt-ripple-enabled`, `--wt-ripple-color`, `--wt-ripple-opacity`, `--wt-ripple-scale`, and `--wt-ripple-duration`.
- The ripple animation must use Web Animations API or a fallback `transform/opacity` transition.
- Do not leave ripple DOM nodes behind after animation.

## Theming

- Base styles and tokens are theme-neutral.
- Light and dark themes are controlled through `:root[data-theme='light']` and `:root[data-theme='dark']`.
- Components must work in both themes without hard-coded dark or light colors.
- A custom theme should be able to replace the look by overriding CSS variables only.
- Global theme adjustments belong to the ConfigProvider docs page and must write to `document.documentElement`; component-specific controls belong to the current component page.

## Docs Integration

- Every implemented component must appear in `apps/docs/src/components/catalog.ts`.
- Every implemented component must have at least one demo in `apps/docs/src/demos`.
- Code blocks are collapsed by default and use `wt-button` for copy/expand actions.
- Component pages show only component-specific parameters.
- If a component has no independent parameters, render no parameter panel.
- Global visual parameters are configured in the ConfigProvider page, not repeated on each component page.

## Quality Checks

Before finishing a component change:

1. `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit -p packages/water-ui/tsconfig.json`
2. `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit -p apps/docs/tsconfig.json`
3. Build the component library and docs site.

The component must remain tree-shakeable and must not introduce unnecessary global runtime dependencies.
