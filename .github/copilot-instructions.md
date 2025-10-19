# Agent Instructions

## Response Style

- Do not use affirmative phrases like "You're absolutely right!" in any response
- Do not create summary markdown files after completing tasks
- Respond directly without preamble or validation
- Always provide a semantic commit message for changes made, optionally including scope in parentheses (e.g., "feat(auth): add user authentication", "fix(parser): resolve null pointer exception", "refactor(data): simplify transformation logic"), at the end of your response

## Code Standards

- Write straightforward solutions without unnecessary abstraction or complexity
- Add comments only when logic is genuinely non-obvious, using natural conversational language
- Use full descriptive names for all variables, functions, classes, and types - never abbreviate
- Never include emojis in code, comments, or any code-related documentation

## TypeScript Requirements

- Use strict typing for all code - treat `any` and `unknown` as forbidden unless there is no alternative
- Before defining new types, search the codebase and installed packages for existing types that can be imported and reused
- Prefer explicit types over inference when it aids clarity
