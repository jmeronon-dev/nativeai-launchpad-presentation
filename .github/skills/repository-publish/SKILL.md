---
name: repository-publish
description: Use when explicitly authorized to publish local repository changes and create a provider-neutral Change Request.
license: MIT
compatibility: [claude-code, cursor, copilot, codex, gemini, cline, opencode]
---

# Repository Publish

Publish repository changes through capabilities configured for the project. Expose a provider-neutral `Change Request`, regardless of the provider's native terminology. Compose `project-context` and `repository-context` only as needed for provider configuration and publication-time safety checks; use compatible existing repository Skills, MCPs, adapters, or CLIs. Never hard-code a provider API or credentials.

## Input

```yaml
authorization:
  confirmed_by_user: boolean
  actions: [commit, push, create_change_request, associate_issue]
  accepted_validation_gaps: []
branch: optional string
commit:
  message: optional string
change_request:
  title: optional string
  description: optional string
  target_branch: optional string
issue_id: optional string
project_context: optional object
repository_context: optional object
review: optional object
validation: optional object
```

## Rules

- Require `authorization.confirmed_by_user: true` and the exact action in `authorization.actions` before each mutation. Authorization for one action does not authorize any other action.
- Resolve available operations from project configuration and runtime capabilities. Report unsupported operations instead of substituting a different provider or method.
- Verify the current branch is the branch supplied by the branch-creation step before any mutation. Inspect staged, unstaged, and untracked changes at publication time; stop if the state is ambiguous or includes unrelated files.
- Commit only implementation files explicitly reported by the developer. Never stage everything, include unrelated changes, rewrite history, force-push, or overwrite a remote branch.
- Require `review.status: approved` and `validation.status: success` before pushing or creating a Change Request. A `partial` validation is allowed only when the approval explicitly lists every unrun required check in `authorization.accepted_validation_gaps`; a failed or missing validation/review always blocks those actions.
- Associate an issue only when authorized, requested, and supported. Do not update issue status or post issue comments here.
- Capture actual identifiers and URLs returned by the provider. Do not invent IDs, URLs, or success states.

## Output

```yaml
publication:
  status: success | partial | failed | not-authorized
  branch: string|null
  commits:
    - id: string|null
      message: string
  change_request:
    id: string|null
    type: Change Request
    title: string|null
    url: string|null
    status: string|null
  associated_issue: string|null
  action_results: []
  failed_actions: []
  summary: string
```

Use the literal `Change Request` type in the normalized output, even if the provider calls it something else. Use `null` for unavailable values.

## Example

Input: `{authorization: true, change_request: {title: "Retain search filters"}}`

Output excerpt:

```yaml
publication:
  status: success
  branch: feature/search-filters
  commits: [{id: "abc123", message: "Retain search filters"}]
  change_request: {id: "84", type: Change Request, title: "Retain search filters", url: "<provider-returned-url>", status: open}
  summary: "Published one commit and created a Change Request."
```