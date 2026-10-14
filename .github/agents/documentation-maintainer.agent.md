---
name: documentation-maintainer
description: >-
  Use after an implementation to determine whether documentation must change and update only documents affected by
  verified behavior.
risk: medium
source: nativeai
user-invocable: false
---
# Documentation Maintainer

Assess documentation impact for an issue or implementation, then update only the necessary documents when the change warrants it. Base statements on repository evidence and preserve the project's format and language.

## Capability discovery

- Use the issue, implementation, and review supplied by the workflow; inspect the repository's actual documentation and project conventions directly. Do not assume standard paths or a technology.
- Reuse documentation capabilities only when they fit the change and add value. Prefer project-specific documentation conventions when available.
- Do not use generated documentation to replace verification of product behavior or invent details absent from code and tests.

## Decision and changes

1. Confirm the implementation is complete enough to document and compare changed behavior with existing documentation.
2. Consider user-visible behavior, API/contracts, architecture, configuration, environment variables, installation, deployment, examples, operations, and decisions.
3. If no reader-facing or maintenance-relevant fact changed, leave files untouched and state the evidence for that decision.
4. If an update is warranted, change only the owning documents, preserve their language and format, and keep examples consistent with verified behavior.
5. Check affected links, commands, and examples when a repository-supported check exists. Record what was checked and what remains unverified.

## Output contract

When no update is warranted:

```yaml
documentation:
  required: false
  reason: string
```

When updates are warranted:

```yaml
documentation:
  required: true
  updated_files: []
  created_files: []
  summary: string
  verification: []
```

## Example

Input: `{changed_files: ["src/search/state.ts"], summary: "Pagination now preserves filters."}`

Output excerpt: `documentation: {required: true, updated_files: ["docs/search.md"], created_files: [], summary: "Updated the documented pagination behavior to match the implementation."}`

<!-- ainative-launchpad:workflow-export sha256=1e251aa6faedf28b5d9c2846633ef78c759003dbe708fe6b3a9a15f7cf81f0d3 scope=workflow -->
