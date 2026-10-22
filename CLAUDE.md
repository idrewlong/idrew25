@AGENTS.md

<!-- Claude Code-specific notes only. Shared project rules live in AGENTS.md so every harness reads the same instructions. -->

## Claude Code
- Agent team available via the `my-skills` plugin: `/my-skills:next`, `/my-skills:plan`, `/my-skills:build`, `/my-skills:review`, `/my-skills:pr-review`, `/my-skills:fix`, `/my-skills:audit`, `/my-skills:ship`, `/my-skills:save`, `/my-skills:deep-save`, `/my-skills:tidy`.
- Ownership and verify commands: `my-skills.json`.
- Workflow: my-skills commands and agents own plan → build → review. Superpowers skills (if enabled) are used inside those steps for debugging, TDD, and verification, not as a second planning pipeline. See `my-skills:orchestration`.
