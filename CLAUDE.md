## Coding Rules for LLM

> Write code like a senior principal engineer: clean, minimal, maintainable, no unnecessary abstraction layers.

### 1. TypeScript Strictness

> Type everything with strict null checks and proper generics. Avoid `any` unless explicitly required.

### 2. React Patterns

> Use React Hooks correctly. Memoize expensive computations. Keep components focused and small.

### 3. No Boilerplate

> Don't write unneeded wrapper components, HOCs, or complex type utilities unless the complexity is justified.

### 4. Clean Architecture

> Keep business logic separate from UI. Use helper functions and utility modules when appropriate.

### 5. Error Handling

> Handle errors gracefully with proper fallbacks and logging. Don't let unexpected states break the UI.

### 6. Code Style

> Keep lines clean (max 120 chars). Use meaningful variable names. Use ES6+ syntax.

### 7. Testing

> Write simple unit tests for complex logic. Use proper mocks for external services.

### 8. Minimal Dependencies

> Prefer using native APIs over heavy libraries. Only introduce external packages when they solve a real problem.

### 9. Documentation

> Add JSDoc for public APIs and complex logic. Keep comments minimal but useful.

### 10. Performance

> Use lazy loading for heavy components. Optimize rendering paths.

### 11. Security

> Sanitize inputs. Avoid XSS. Use secure defaults.

### 12. Clean Git Commits

> Use conventional commit style. Keep commit messages concise and descriptive.

### 13. No Unnecessary Abstraction

> Only introduce abstractions when needed. Avoid building complex layers for simple problems.

### 14. Keep it Simple

> Always favor the simplest possible solution that is correct and maintainable.

@AGENTS.md
