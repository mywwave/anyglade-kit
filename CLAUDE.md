# @anyglade/kit

UI kit monorepo. The package lives in `packages/kit`, the showcase and reference blocks in `apps/playground`.

- Every interface is built with the `anyglade-design-system` skill.
- Showcase blocks and references are created with the `block-reference` skill.
- After any change to the kit, and after every user correction of look, animation or UX, run the `design-system-sync` skill. Without it the `design-skill` test and the pre-commit hook fail.
