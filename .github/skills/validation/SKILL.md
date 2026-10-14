---
name: validation
description: Use when configured build, test, lint, formatting, type-check, or static-analysis checks must be run and reported.
license: MIT
compatibility: [claude-code, cursor, copilot, codex, gemini, cline, opencode]
---

# Validation

Run only checks configured for the project and relevant to the requested scope, then normalize the results. Compose `project-context` to resolve the validation strategy. Reuse specialized build, test, lint, or analysis Skills when they own a configured check.

## Input

```yaml
scope:
  type: project | changed-files | module
  path: optional string
implementation: optional object
checks: optional [compilation, build, unit-tests, integration-tests, lint, formatting, type-checking, static-analysis]
project_context: optional object
```

If `checks` is omitted, run the configured checks applicable to the scope. Use only commands verified in project configuration, documentation, or an available specialized Skill; record the source of each command. Do not guess commands, install dependencies, change configuration, or edit source. Run independent applicable checks even if another fails, unless continuing would be unsafe. If a check cannot be scoped or run, report `not-run` with a specific reason. Preserve failure evidence and distinguish test failures from infrastructure or setup failures.

## Output

```yaml
validation:
  status: success | failed | partial
  checks:
    - name: string
      status: success | failed | not-run
      command: string|null
        configuration_source: string|null
      summary: string
      errors: []
  failed_checks: []
      not_run_checks: []
  summary: string
```

Overall status is `success` only if every configured applicable check succeeds; `failed` if any executed check fails; otherwise `partial` when a required check is unavailable or not run. Include concise, actionable error evidence without proposing fixes. Never call a partial result green, and never infer that an unreported check passed.

## Example

Input: `{scope: {type: module, path: "services/catalog"}, checks: [unit-tests, lint]}`

Output excerpt:

```yaml
validation:
  status: partial
  checks:
    - {name: unit-tests, status: success, command: "configured test command", configuration_source: "project configuration", summary: "Passed", errors: []}
    - {name: lint, status: not-run, command: null, configuration_source: null, summary: "No module lint command configured", errors: []}
  failed_checks: []
  not_run_checks: [lint]
  summary: "Unit tests passed; lint was not configured for this module."
```