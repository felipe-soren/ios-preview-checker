---
description: "Analyzes the repository and generates a project status summary"

on:
  workflow_dispatch:

permissions:
  contents: read
  issues: read
  pull-requests: read
  actions: read
  copilot-requests: write

safe-outputs:
  create-issue:
    title-prefix: "[project-status] "
    labels: [project-status]
    close-older-issues: true
    max: 1

---

# Project Status Analyzer

Analyze the current repository and generate a concise but useful description
of the current state of the project.

The goal is to help a developer quickly understand:

- What the project does
- How the project is structured
- What has already been implemented
- What appears to be under development
- What areas may require attention
- What the most reasonable next steps are

## Repository Analysis

Inspect the repository before producing the report.

Review relevant files when available, including:

- README files
- Source code
- Project structure and directories
- Dependency files
- Configuration files
- Tests
- GitHub Actions workflows
- Documentation
- TODO and FIXME comments
- Recent implementation patterns
- Pull requests and issues when they provide useful context

Do not modify repository files.

Do not assume that a feature exists unless there is evidence for it in the
repository.

If something cannot be determined, explicitly mark it as unknown.

## Output

Create a GitHub issue containing the project status report.

Use the following structure:

# Project Status

## Overview

Explain what the project appears to do.

Include:

- Main purpose
- Main technologies
- General architecture
- Current development stage

Keep this section concise.

## Architecture

Describe the current architecture of the application.

Include when identifiable:

- Main modules
- Main layers
- Important directories
- Architectural patterns
- External services
- Important dependencies

Focus on the architecture that currently exists rather than suggesting a
future architecture.

## Current Features

List the main features found in the repository.

For each feature, classify its apparent status as one of:

- ✅ Implemented
- 🚧 Partially implemented
- 🧪 Experimental
- ❓ Unclear

Only classify a feature when enough evidence exists.

## Work in Progress

Identify evidence of unfinished work.

Look for:

- TODO comments
- FIXME comments
- Placeholder implementations
- Empty methods
- Mock implementations used in production paths
- Commented-out features
- Partially implemented screens or flows
- Missing integrations
- Incomplete tests

## Testing

Describe the current testing situation.

Include:

- Test frameworks
- Unit tests
- Integration tests
- UI tests
- Areas that appear well tested
- Important areas that appear to lack tests

Do not invent code coverage percentages.

## Technical Debt

Identify concrete technical debt found in the repository.

Examples include:

- Large or overly complex files
- Duplicated logic
- Tight coupling
- Deprecated APIs
- Inconsistent architecture
- Missing abstractions
- Weak error handling
- Missing documentation
- Unused code

Do not include generic recommendations without repository evidence.

## Risks

Describe important risks to the project.

Focus on:

- Stability
- Maintainability
- Security
- Scalability
- Testability
- Developer productivity

Prioritize the most relevant risks.

## Recommended Next Steps

Provide between 3 and 7 concrete next steps.

Order them by priority.

Recommendations should be actionable and directly related to evidence found
during the repository analysis.

## Project Health

Finish with:

**Overall status:** Healthy / Stable / Needs attention / High risk

**Development stage:** Prototype / MVP / Active development / Mature / Maintenance

**Confidence:** High / Medium / Low

Then provide a short explanation for the assessment.

## Important Rules

- Base conclusions on repository evidence.
- Do not hallucinate features, architecture, or problems.
- Prefer concrete examples over generic observations.
- Mention relevant filenames when they help explain a finding.
- Keep the report readable and useful for developers.
- Do not modify source code.
- Do not create pull requests.
- Create exactly one project-status issue with the final report.