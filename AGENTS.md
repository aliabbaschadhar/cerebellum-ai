<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- BEGIN:skills-rules -->

# Skills

Always check the skills directory (located at `~/.gemini/antigravity/skills`) for a folder matching the domain of the current query or task. If a matching skill folder is found:

1. Locate and read its `SKILL.md` file using the `view_file` tool to understand the skill's specific guidelines and instructions.
2. Follow the detailed instructions outlined in that skill file to answer the query or execute the task.
3. Also list which skills you used to answer the query.
<!-- END:skills-rules -->

## Bun is the package manager. Always use bun for running any commands in the terminal.

User wants to install dependencies.

Use `bun add` to install dependencies.
Use `bun remove` to remove dependencies.
Use `bun install -d` to install dev dependencies and regular dependencies.
Use `bun update` to update dependencies.
Use `bun` to run scripts defined in `package.json` (e.g. `bun dev`, `bun build`).

# Prisma

The user wants to use Prisma.

Prisma setup:

- `bun prisma init` to initialize
- Run migrations with `bun prisma migrate dev`
- The user has already run `bun prisma migrate dev` and initialized Prisma.

<!-- END:nextjs-agent-rules -->
