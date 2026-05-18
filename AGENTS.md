<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

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
