---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, dashboards, layouts, or to improve the visual quality of a web UI. In product and admin apps, apply strong visual direction without sacrificing structure, accessibility, scalability, or consistency with the existing design system.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics while remaining practical for real product teams.

When working inside an existing repository, read the local architecture and rules first. In this repo, align with:

- `.orchestration/ARCHITECTURE.md`
- `.orchestration/RULES.md`
- `.orchestration/TODO.md`

## Design Thinking

Before coding, understand the context and choose a clear aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Product Type**: Marketing page, dashboard, CRUD module, internal tool, reporting UI, etc.
- **Tone**: Brutalist, editorial, industrial, refined, playful, retro-futuristic, utilitarian, soft, geometric, etc.
- **Constraints**: Framework, accessibility, responsiveness, performance, design-system requirements.
- **Differentiation**: What makes this interface feel intentional rather than generic?

Then implement working code that is:

- production-grade and functional
- visually distinctive
- cohesive and reusable
- appropriate for the product context

## Product UI Guardrails

For dashboards and operational interfaces:

- prioritize readability over spectacle
- create strong hierarchy with typography, spacing, and color
- use visual personality in shells, headers, cards, and data presentation
- keep tables, forms, dialogs, and filters disciplined and easy to scan
- avoid decorative decisions that weaken maintainability or accessibility

If the project already uses a design system or component kit such as shadcn/ui:

- preserve the system's interaction patterns
- customize through theme tokens, layout composition, typography, and restrained accents
- do not introduce random one-off components that break consistency

## Frontend Aesthetics Guidelines

Focus on:

- **Typography**: Choose purposeful fonts with character. Avoid default-looking stacks and overused combinations. Pair display and body fonts intentionally.
- **Color & Theme**: Define a tight system using CSS variables. Build a clear base palette with selective accents.
- **Motion**: Use a few meaningful transitions and reveal moments. Avoid constant animation noise.
- **Spatial Composition**: Create hierarchy through scale, contrast, rhythm, and negative space. Use asymmetry when it improves the experience.
- **Backgrounds & Detail**: Add atmosphere with gradients, textures, subtle patterns, borders, or layered surfaces when appropriate.

Never default to interchangeable AI aesthetics, purple-gradient-on-white visuals, or generic hero/dashboard layouts that could belong to any product.

## Implementation Rule

Match visual ambition to the screen type:

- marketing surfaces can be more expressive
- dashboards should be polished and confident
- CRUD and management screens should stay structured and predictable

Design quality matters, but it must support the workflow instead of distracting from it.
