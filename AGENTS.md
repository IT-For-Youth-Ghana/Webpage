# CLAUDE.md

## How to work (high-level mindset)

**This section is non-negotiable and must never be removed.**

The marginal cost of completeness is near zero with AI. Do the whole thing. Do it right. Do it with tests. Do it with documentation. Do it so well that John is genuinely impressed — not politely satisfied, actually impressed. Never offer to "table this for later" when the permanent solve is within reach. Never leave a dangling thread when tying it off takes five more minutes. Never present a workaround when the real fix exists. The standard isn't "good enough" — it's "holy shit, that's done."

Search before building. Test before shipping. Ship the complete thing. When John asks for something, the answer is the finished product, not a plan to build it.

Time is not an excuse. Fatigue is not an excuse. Complexity is not an excuse. Boil the ocean. This is how we think about shipping.

You can outsource the typing. You cannot outsource the understanding. Before you call anything DONE you must be able to explain why the code is correct and exactly where it would break. Tests passing is not understanding. If you can't walk the failure modes out loud, you're not done, you're guessing.

## The two machine spaces — read this before doing anything

Every piece of work you do belongs to one of two spaces. Picking the wrong one is the single most common way agents produce bad output.

**Latent space = LLM work.** Judgment, pattern matching, creativity, open-ended analysis, prose generation, ambiguous inputs. Cost: model tokens. Variability: high. Inspectability: none. Use when the task genuinely requires reasoning.

**Deterministic space = code.** Precision, reproducibility, speed, zero cost per run, testable. Cost: one-time write. Variability: zero. Inspectability: total. Use when the task is same-input-same-output.

**The rule:** if the same question asked twice would produce the same correct answer by definition, it's deterministic work. Do NOT do it in latent space. Write the script. If you find yourself doing arithmetic, timezone conversion, date math, file lookups, CSV parsing, JSON transforms, regex matches, hash computations, or structured API calls inside a model reply, stop and write a script.

**The meta-loop that makes this work:** the LLM writes the deterministic script, then the script constrains the LLM forever after. The model's intelligence creates the constraint that prevents the model from being stupid. A bug in latent space becomes a feature in deterministic space, and the old failure path becomes structurally unreachable.

Every feature, every fix, every investigation starts with: is this latent or deterministic? If the answer is "both," split it. The deterministic piece becomes a script + tests. The latent piece becomes a prompt + eval.

## The context window is the lever

The context window is your only control surface over the model. Treat it as a deliberate input, not a dumping ground. Load the spec, the contract, the relevant files, and concrete examples. Leave the noise out. A vague or bloated context produces vague or bloated output, every time. When a task goes sideways, the first question is "what was in the window," not "was the model dumb." Curate before you prompt.

## Non-negotiable rules

### Tests and evals — every time, no exceptions

- Every feature ships with a test suite AND an eval suite, in the same commit. Not the next PR.
- Every bug fix ships with a test AND an eval that would have caught the bug. The regression test is the proof the bug is fixed. The eval is the proof the fix generalizes.
- Every failure gets skillified (the 10 steps). Same day. Same session when possible.
- "I'll add tests later" is banned. If the tests/evals aren't in the diff, the work isn't done.
- Two test lanes, different budgets:
  - **Gate tests** — deterministic, local, free, <2s. Run on every commit via pre-commit hook. Never flaky.
  - **Periodic evals** — paid (LLM calls), slower, quality-measuring. Run before ship and nightly. Allowed to be non-deterministic but must have a pass threshold.

### Tie every change to a measurable outcome

- Every feature names the outcome it moves before you build it: the metric, the workflow step, or the user-visible behavior that changes. "It works" is not an outcome.
- If you can't state what gets measurably better and how you'll see it, that's a Confusion Protocol stop, not a license to build.
- Wire in the trace. The change leaves evidence you can point at later: a metric, a log line, an eval score. Compute that produces no measurable, traceable result is theater.

### LLM access — local Claude Code, not the API

- When the software we build needs to call an LLM, do NOT use an LLM API (Anthropic API, OpenAI API, any hosted inference endpoint) unless John explicitly instructs it. Route the call through the local Claude Code instead.
- If no LLM service exists yet in the project, build one. Create a self-contained LLM service (under `services/llm/` per the architecture rules) that shells out to local Claude Code, with its own contract, tests, and evals. Every other service calls that contract, never an external API.
- Always use the best available model by default unless John explicitly instructs otherwise. No silent downgrades to a cheaper or smaller model for cost.

### Tech choice — vanilla by default

- Simplest vanilla tech wins. No framework-of-the-month. No clever abstractions for hypothetical reuse.
- Do not recreate what already exists. Before writing a utility, harness, or library, check for an existing lib that solves it.
- For cross-cutting concerns (eval harness, prompt library, vision utilities, observability, SEO, schema validation, etc.) grep GitHub in parallel for top candidates. Rank by stars, recency of last commit, issue responsiveness, and real user feedback (HN, Reddit, production write-ups). Return the best option with reasoning, not a list. Example: "for SEO in this project, use X because [stars, last commit 2 weeks ago, 48 issues closed in last month]. Second choice Y. Rejected Z because [last commit 14 months ago]."
- If two options are equally viable, name the trade-off explicitly and ask John. Confusion Protocol applies.

### Search before building

Three layers, in order:

1. **Tried-and-true.** Is there a standard library or pattern that does this? Use it.
2. **New-and-popular.** Is there a newer library with real traction? Evaluate it.
3. **First-principles.** Does the conventional approach actually apply here? If our situation is genuinely different, document WHY before writing custom code.

Most of the time Layer 1 wins. Default to that. If Layer 3 produces a genuine insight contradicting conventional wisdom, log it as a note in the commit or a design doc.

### Check for skills

When a task matches a specialized domain (SEO, schema, security audit, design review, etc.), use the installed Claude Code skill. Don't reinvent what gstack or a community skill already does well. Invoke via the Skill tool, not by re-implementing.

### Skillify repeated success, not just failure

Failures get skillified — that rule already stands. So does repeated success. The second time you run the same manual flow by hand, stop and codify it: a script, a skill, or a workflow. One-off prompts don't compound; reusable flows do. The leverage is in the work you stop having to think about, not in re-prompting from scratch each time. Done it twice by hand? The third time is a command.

## Architecture — services-first, parallel-friendly

Build everything as independent services / self-contained directories. The goal: any single piece of the application can be worked on by a separate Claude Code session without stepping on another session's work.

- **One concern, one directory.** Each service lives under `services/<service-name>/` (or equivalent top-level directory) with its own code, tests, evals, README, and config. No shared mutable state across services beyond well-defined contracts.
- **Contracts at the boundary.** Services communicate via typed interfaces (HTTP, gRPC, message bus, or a shared schema package). Define the contract in a `contracts/` or `schemas/` directory that both sides import — never reach into another service's internals.
- **Independent test + eval suites.** Each service has its own gate tests and periodic evals. A change in one service must not require running another service's full suite to validate.
- **Independent deploy unit.** Each service builds and ships on its own. No monolithic release that forces every service to move in lockstep.
- **Parallel-session safe.** Two Claude sessions working in `services/foo/` and `services/bar/` should never collide. If a change requires coordinated edits across services, that's a contract change — bump the schema version, update both sides, and call it out explicitly.
- **Top-level only holds glue.** Root directory: orchestration scripts, shared config, contracts, docs. No business logic.

When in doubt, lean toward more services with sharper boundaries rather than fewer services with fuzzy ones.

**Fan out by default.** The services-first layout exists so work runs in parallel. When a job decomposes into independent units, run them as separate isolated sessions or worktrees at the same time, not one after another. Serial work on parallelizable units is wasted wall-clock. Coordinate at the contract boundary, merge each unit when it's green.

## Completion status protocol

At the end of every task, report one of:

- **DONE** — All steps completed. Evidence provided for every claim. Tests + evals in the diff. Skillify checklist green if a failure was promoted. Ready to merge.
- **DONE_WITH_CONCERNS** — Completed, but with issues John should know about. List each concern with severity and a proposed follow-up.
- **BLOCKED** — Cannot proceed. State what's blocking and what was already tried.
- **NEEDS_CONTEXT** — Missing information required to continue. State exactly what's needed.

"Partially done" is not a status. Either the feature ships (DONE) or it doesn't (BLOCKED / NEEDS_CONTEXT). Honesty about incompleteness beats pretending.

## After every task — commit, push, restart

Once a task is done, two things happen, no exceptions:

1. **Commit and push.** Stage the work, write a clear commit message, push to GitHub. Don't wait to be asked. Respects the Safety rules (no secrets, no `--no-verify`, no destructive ops without confirmation).
2. **Report what to restart.** Tell John exactly which service / system / program needs to be restarted for the change to take effect, with the full list of commands to run. If nothing needs restarting, say so explicitly.

For restart commands that need `sudo`: never run them yourself. List them for John to run, clearly marked as his to execute.

## Confusion protocol

When you hit high-stakes ambiguity:

- Two plausible architectures for the same requirement
- A request that contradicts an existing pattern
- A destructive operation with unclear scope
- Missing context that would materially change the approach

STOP. Name the ambiguity in one sentence. Present 2-3 options with real trade-offs (not a fake spread). Ask John. Do not guess on architectural decisions. Does not apply to routine coding, small features, or obvious changes.

## Safety

- Never commit secrets. If `.env` is touched, verify `.gitignore` before any commit.
- Never run `rm -rf`, `git reset --hard`, `git push --force`, `DROP TABLE`, `kubectl delete`, or similar destructive ops without explicit confirmation.
- Never skip pre-commit hooks with `--no-verify`. If a hook fails, fix the underlying issue.
- Never commit binaries, compiled outputs, or model weights to the repo. Use Git LFS or cloud storage with a pointer.
- Before any action that touches production, state what you're about to do, wait for confirmation.

## How John wants to be talked to

- Direct. Short. Concrete. No preamble.
- Specific file names, function names, line numbers. Not "there's an issue in the classifier" — it's `food_vision/classifier.py:47`.
- No em dashes. No AI vocabulary (delve, crucial, robust, comprehensive, nuanced, multifaceted, furthermore, moreover, pivotal, landscape, tapestry, underscore, foster, showcase, intricate, vibrant, fundamental, significant, interplay).
- No banned phrases: "here's the kicker", "here's the thing", "plot twist", "let me break this down", "the bottom line", "make no mistake".
- If something is broken, say so plainly.
- End responses with the next action, not a recap of what was just done.

When John asks for something, the answer is the finished product — not a plan. Tests included. Evals included. Docs included.

# ITFYG Engineering Constitution

## 1. Project Identity

This repository contains the public website and content-management system for IT For Youth Ghana (ITFYG).

Primary stack:

* Next.js App Router
* React
* TypeScript
* Firebase Authentication
* Firebase Admin SDK
* Firestore
* Tailwind CSS

This is a public-facing NGO website with privileged administrative functionality.

Security, accessibility, maintainability, content integrity, SEO, and reliable deployment are first-class engineering requirements.

---

# 2. Repository Identity Preflight

This section is mandatory.

Before repository-wide analysis, architecture work, refactoring, security work, or delegation to other agents, verify the repository being worked on.

Inspect:

```bash
git branch --show-current
git status --short
git rev-parse --show-toplevel
git log -1 --oneline
```

Also inspect:

```bash
find . -maxdepth 2 -type d | sort
```

and:

```bash
cat package.json
```

Record:

* current branch
* current commit
* working-tree state
* repository root
* actual source structure
* framework/runtime versions

Before substantial work explicitly state:

```text
Repository identity verified: <branch> @ <commit>
```

Never assume that architecture documentation describes the checked-out branch.

If documentation and the actual repository materially disagree, the repository wins as evidence of current implementation.

Do not silently rewrite documentation to resolve the contradiction.

Report the disagreement and determine whether the document is:

* historical
* aspirational
* stale
* branch-specific
* or actually authoritative

If the distinction affects a major architectural decision, stop under the Confusion Protocol.

---

# 3. Current Architecture Baseline

The most recent repository audit found a root-oriented Next.js architecture resembling:

```text
app/
components/
lib/
types/
stores/
hooks/
```

with Firebase and CMS implementation primarily under:

```text
lib/firebase/
lib/cms/
```

and route handlers under:

```text
app/api/
```

This is an observed baseline, not a permanent architectural mandate.

Always verify that the checked-out repository still matches this structure before relying on it.

Do not migrate the application to:

```text
src/
src/features/
```

or any other architecture merely because a previous document proposed it.

Any major directory migration requires a separate architecture decision supported by evidence.

---

# 4. Core Engineering Principle

The goal is not to create the most sophisticated architecture.

The goal is to make the application:

* easier to understand
* easier to test
* easier to modify
* harder to break
* safer to operate
* accessible
* performant
* secure
* appropriately scalable

Prefer boring, explicit, maintainable engineering over cleverness.

Use:

* SOLID where useful
* DRY
* KISS
* YAGNI
* separation of concerns
* high cohesion
* low coupling
* explicit boundaries
* composition
* dependency inversion where it creates a meaningful boundary

Do not implement patterns mechanically.

An abstraction must justify its existence by reducing:

* duplication
* coupling
* change cost
* risk
* complexity

---

# 5. Evidence Before Architecture

Never restructure code because a folder tree looks untidy.

Before proposing architectural change determine:

1. What problem exists?
2. Where is the evidence?
3. What behavior is affected?
4. What coupling or maintenance cost exists?
5. What is the smallest useful correction?
6. What could break?
7. How will we prove it did not break?

Architectural recommendations must cite concrete:

* files
* modules
* imports
* runtime paths
* tests
* security boundaries
* duplicated implementations
* dependency relationships

Never invent problems to justify refactoring.

---

# 6. No Broad Refactoring Without a Safety Net

The repository audit found that the application historically had little or no automated test coverage.

Before large structural refactoring:

1. verify current testing state
2. identify behavior that must be preserved
3. establish characterization or regression tests
4. refactor incrementally
5. verify each meaningful stage

Never move hundreds of files simply to satisfy a theoretical architecture while tests are inadequate.

Security corrections may precede broad test infrastructure when delaying them creates unacceptable risk, but every security fix must receive a regression test.

---

# 7. Refactoring Versus Behavior Change

Always distinguish:

## Refactoring

Changes internal structure while preserving externally observable behavior.

## Bug Fix

Changes behavior because current behavior is incorrect.

## Feature

Introduces new behavior.

## Architecture Change

Changes boundaries, dependency direction, ownership, runtime design, or deployment structure.

Do not mix these silently.

For substantial work, explicitly state which category applies.

---

# 8. Security Priority

The administrative system is a privileged security boundary.

Firebase Admin SDK bypasses Firestore Security Rules.

Therefore:

> Application authorization is security-critical infrastructure.

Never assume a deny-all Firestore ruleset protects requests made through Firebase Admin SDK.

Security-sensitive areas include:

```text
lib/firebase/
lib/cms/admin-auth*
app/api/admin/
middleware.ts
firestore.rules
storage.rules
firebase.json
```

and any content sanitizer or renderer using:

```text
dangerouslySetInnerHTML
```

---

# 9. Authentication and Authorization

Authentication answers:

> Who is this user?

Authorization answers:

> What is this user allowed to do?

Never confuse the two.

A valid Firebase session alone does not imply permission to modify content.

Roles must be enforced server-side.

Client-side hiding of controls is presentation only.

It is never an authorization mechanism.

When working on admin routes verify:

* authentication
* role enforcement
* resource authorization
* privilege boundaries
* session revocation
* account deactivation
* account deletion
* audit logging

Authorization tests must include lower-privilege roles attempting prohibited operations.

---

# 10. Stored Content and XSS

Any HTML stored in Firestore and later rendered into the DOM is untrusted content.

Do not rely on home-grown regular-expression HTML sanitizers.

Use a proven allowlist-based sanitizer appropriate for the runtime.

Sanitization should normally occur:

1. before persistent storage
2. before dangerous rendering

Defense in depth should also include an appropriate Content Security Policy.

Every discovered sanitizer bypass must become a permanent regression test.

---

# 11. Secrets

Never commit:

* Firebase service-account credentials
* private keys
* API keys
* passwords
* revalidation secrets
* SMTP credentials
* cloud credentials

Before committing changes involving configuration inspect:

```bash
git status
git diff
git check-ignore
```

The repository must use broad secret-ignore patterns rather than relying only on exact filenames.

Secret scanning should eventually be automated.

Do not display complete secret values in reports.

Fingerprinting or redacted identifiers are acceptable where necessary.

Never push an audit document containing active credentials, private keys, or working exploit payloads to a public repository.

---

# 12. Firebase Boundary

Firebase is infrastructure.

UI components should not directly own:

* Firestore queries
* Admin SDK initialization
* authorization decisions
* transaction logic
* persistence orchestration

Prefer a flow resembling:

```text
UI / Route
    ↓
Application or CMS function
    ↓
Firebase boundary
    ↓
Firestore / Auth / Storage
```

Do not create unnecessary repository classes merely to imitate Clean Architecture.

Use the smallest explicit boundary that keeps infrastructure out of presentation code.

---

# 13. Server and Client Boundaries

Treat Next.js server/client boundaries as security boundaries.

Pay special attention to:

* `"use client"`
* Server Components
* Client Components
* Route Handlers
* middleware
* Firebase Admin SDK
* environment variables
* server-only utilities

Privileged server modules must never be bundled into browser code.

Use mechanical protection where possible rather than relying on developer memory.

Examples include:

* `server-only`
* lint restrictions
* directory ownership
* import rules
* tests

Do not introduce `"use client"` without an actual browser-side requirement.

---

# 14. Dependency Direction

A stable dependency direction is preferred.

Presentation code should not define data-layer contracts.

Avoid patterns such as:

```text
lib/cms/
    ↓
components/
```

for domain or persistence types.

Shared contracts should live in a neutral location appropriate to their purpose.

Do not relocate types merely for aesthetics.

Move them when doing so removes an actual dependency inversion or ownership problem.

---

# 15. Content Source of Truth

The audited application historically used both:

```text
lib/content/
```

and:

```text
lib/cms/
```

with Firestore data merged over static seed content.

Treat this as an area requiring explicit design.

For each content domain determine which system is authoritative.

Avoid situations where:

* route params use one source
* metadata uses another
* rendered body uses another

The same conceptual content record should not acquire different identities depending on which layer reads it.

Do not silently remove fallback behavior.

Fallback content may be intentional resilience.

Understand it before changing it.

---

# 16. Next.js Route Handlers

Route handlers should normally perform:

1. authentication/authorization
2. request parsing
3. validation
4. application operation
5. response mapping

Avoid duplicating the same infrastructure logic across dozens of handlers.

Shared route infrastructure is justified when it removes repeated:

* authentication
* authorization
* validation
* error mapping
* audit logging
* revalidation

Do not create an excessively abstract route framework.

Keep control flow understandable.

---

# 17. Validation

All external input is untrusted.

Validate:

* JSON bodies
* route parameters
* query parameters
* external API data
* CMS data
* URLs
* video URLs
* uploaded files

Prefer explicit Zod schemas where Zod is already part of the application.

Avoid:

```ts
z.unknown()
```

for security-sensitive persisted structures unless there is a documented reason.

Do not cast arbitrary request data into trusted application types.

---

# 18. Public Abuse Protection

Public mutation endpoints must be reviewed for abuse resistance.

Examples include:

* contact forms
* applications
* newsletter subscriptions
* authentication endpoints

Consider:

* rate limiting
* bot protection
* honeypots
* submission timing
* input limits
* duplicate suppression
* bounded reads
* email quota abuse
* Firestore billing abuse

Do not expose unnecessary submitted PII in API responses.

---

# 19. Firestore Queries

Do not allow collections that grow indefinitely to be read without bounds.

Review:

* `.get()`
* collection scans
* sorting in Node
* filtering in Node
* pagination
* query limits
* indexes

Use transactions or batches where operations must be atomic.

Do not introduce transaction complexity where operations are genuinely independent.

---

# 20. Audit Logging

Audit logging should never turn a successful business mutation into an apparent failure unless audit persistence is explicitly part of the transaction's correctness requirement.

When mutations and audit logs cannot share a transaction:

* handle audit failure deliberately
* log the failure
* avoid misleading clients
* document the consistency model

Authentication events should be considered for audit logging.

---

# 21. Testing Strategy

The test system should contain two broad classes.

## Gate Tests

Fast and deterministic.

Examples:

* validators
* authorization contracts
* sanitizers
* utility functions
* redirect definitions
* route invariants
* import-boundary checks

These should run frequently.

## Integration / End-to-End Tests

Used for behavior involving:

* Firebase
* authentication
* Firestore
* admin workflows
* forms
* routing
* browser behavior

Do not maximize coverage percentage blindly.

Prioritize high-risk behavior.

Every bug fix requires a regression test capable of failing on the old behavior.

---

# 22. Verification

Never call work complete merely because code was written.

Use relevant checks from:

```bash
npm run lint
npm run type-check
npm test
npm run test:e2e
npm run build
git diff --check
```

Only run commands that actually exist.

If a required command is missing, report it instead of pretending verification occurred.

When adding the test infrastructure, make these commands real.

Inspect:

```bash
git diff
```

before completion.

Look for:

* unintended changes
* secrets
* debugging output
* dead imports
* changed behavior
* missed tests
* security regressions
* generated files
* accidental binaries

---

# 23. Independent Verification

For substantial work, implementation and verification should be separate responsibilities.

A verification agent should preferably be read-only.

It should independently inspect:

* diff
* tests
* lint
* type checks
* build
* architecture boundaries
* security implications
* behavior changes

An implementation agent's statement that its code works is not proof.

---

# 24. Accessibility

ITFYG serves the public.

Accessibility is a product requirement.

Review:

* labels
* `htmlFor`
* accessible names
* keyboard navigation
* focus behavior
* modal focus trapping
* Escape behavior
* landmarks
* skip links
* semantic HTML
* image alternative text
* reduced-motion concerns
* colour contrast

Do not treat accessibility as visual polish.

---

# 25. SEO

Public content should support:

* meaningful metadata
* canonical URLs
* sitemap integrity
* robots configuration
* structured data where appropriate
* correct `lastModified`
* duplicate-route prevention
* article metadata
* course metadata
* job metadata
* organisation metadata

Do not create duplicate indexable routes for the same content without an explicit canonical strategy.

---

# 26. UI Architecture

UI work and architecture work have different ownership.

Visual restructuring must not silently modify:

* Firebase security
* authentication
* API contracts
* persistence
* routing
* business logic

Likewise, architecture agents should not redesign presentation without being asked.

Shared UI primitives should exist because they eliminate meaningful duplication.

Do not create endless one-consumer abstractions.

---

# 27. ITFYG Visual Direction

The current design direction is editorial and magazine-led.

Substantial editorial text should normally be paired with meaningful:

* photography
* illustration
* video
* diagrams
* data visualization
* portraiture
* contextual visual media

Avoid defaulting to repetitive text-only cards.

UI implementation must eventually reconcile the design blueprint with the actual Tailwind and font configuration.

The repository's implementation is authoritative until that reconciliation is deliberately performed.

---

# 28. Design Tokens

Prefer a coherent design system over arbitrary values scattered through components.

Before introducing a new:

* colour
* radius
* spacing rule
* typography rule
* button pattern
* tracking value

inspect existing tokens.

Do not introduce another UI system when an existing primitive can be repaired or extended.

Do not delete a visual pattern merely because it differs from another until its usage and purpose are understood.

---

# 29. Dead Code

Do not remove a module merely because static import analysis reports zero consumers.

Before deletion check:

* dynamic imports
* route conventions
* scripts
* runtime references
* documentation
* external integrations

Once verified dead, remove it cleanly.

Unused dependencies should be removed only after confirming they have no runtime, build, script, or tooling usage.

---

# 30. Repository Hygiene

Do not commit:

* build artifacts
* temporary files
* accidental shell installers
* zero-byte scratch files
* large backups
* duplicate binary assets
* local credentials

Large media should normally live in:

* approved asset storage
* Git LFS
* external media hosting

depending on project requirements.

History rewrites and remote branch deletions are destructive operations and require explicit human approval.

---

# 31. Documentation

Documentation must describe reality.

Do not write architecture documents in the past tense for work that has not happened.

Clearly classify architectural documents as:

* Current
* Proposed
* Accepted
* Deprecated
* Historical

Architectural Decision Records should contain:

```text
Status
Context
Problem
Options Considered
Decision
Consequences
Verification
```

Do not allow aspirational ADRs to masquerade as implemented architecture.

---

# 32. Search Before Building

Before writing a new utility, library, abstraction, security primitive, sanitizer, form framework, or infrastructure component:

1. inspect the repository for an existing implementation
2. consider a standard platform/library solution
3. write custom infrastructure only when justified

Do not recreate solved security primitives.

Do not introduce dependencies casually either.

New dependencies require:

* purpose
* maintenance status
* security consideration
* bundle/runtime impact
* why existing tools are insufficient

---

# 33. Deterministic Work Versus Reasoning Work

Use deterministic tools for deterministic questions.

Examples:

* import graph analysis
* duplicate detection
* hashes
* dependency usage
* filesystem inspection
* test execution
* static rule checks
* schema checks
* route inventories

Do not manually guess answers that can be mechanically verified.

Use reasoning for:

* architecture
* trade-offs
* prioritization
* risk
* ambiguous requirements
* design decisions

Prefer evidence-producing scripts over repeated manual inspection.

---

# 34. Specialist Agents

The principal architect may delegate work to specialists.

Potential specialist responsibilities include:

```text
security
testing
CMS/data architecture
admin UI
public UI
design system
verification
```

Do not spawn an agent merely because the capability exists.

Delegate when:

* independent expertise materially helps
* work can be clearly bounded
* parallel analysis is safe
* independent verification is valuable

Every delegation must specify:

* objective
* scope
* files/directories allowed
* whether modifications are allowed
* required evidence
* expected output

Subagents may not silently expand scope.

---

# 35. Orchestrator Responsibility

Delegation does not transfer responsibility.

The principal architect must understand specialist findings before accepting them.

Specialist claims should be independently verified when they affect:

* security
* architecture
* destructive operations
* production
* credentials
* migrations
* authorization
* major dependency changes

Do not propagate specialist hallucinations into the implementation plan.

---

# 36. Confusion Protocol

Stop before making a major decision when:

* repository and documentation materially disagree
* two architectures are genuinely plausible
* a destructive operation is required
* authorization policy is unclear
* a migration could affect production data
* product behavior is ambiguous
* a decision would create a large irreversible change

State:

1. what is ambiguous
2. the real options
3. their consequences
4. the decision required

Do not invoke the Confusion Protocol for routine implementation details.

---

# 37. Safety

Never execute destructive commands without explicit approval.

Examples include:

```bash
rm -rf
git reset --hard
git push --force
git filter-repo
git branch -D
firebase deploy
firebase firestore:delete
```

Never:

* disable verification hooks to force a commit
* commit secrets
* expose private keys
* operate on production without stating the action first
* assume a local branch is disposable
* rewrite shared history silently

---

# 38. Git

Before substantial work record the starting branch and commit.

Keep changes coherent.

Do not mix unrelated refactors into one change.

Before commit:

```bash
git status
git diff --check
git diff
```

Do not automatically push security-sensitive audit material.

Security fixes should be reviewed before being published when disclosure would expose an active vulnerability.

---

# 39. Completion Protocol

Every substantial task ends in one of:

## DONE

Implementation complete.

Evidence provided.

Relevant tests pass.

Verification passes.

No known blocking concern remains.

## DONE_WITH_CONCERNS

Implementation complete but known risks or limitations remain.

Each concern must include:

* severity
* evidence
* impact

## BLOCKED

Work cannot safely proceed.

State:

* blocker
* evidence
* what has already been attempted

## NEEDS_CONTEXT

A human architectural or product decision is required.

State exactly what information is missing.

Never report DONE simply because files were edited.

---

# 40. Reporting Style

Reports should be direct and evidence-based.

Prefer:

```text
components/admin/example.tsx:84
```

over:

```text
somewhere in the admin UI
```

Use:

* file names
* function names
* route names
* relevant line numbers
* commands run
* test results

Do not inflate findings.

Distinguish:

* verified fact
* inference
* recommendation

---

# 41. Refactoring Sequence

Unless evidence requires a different order, prefer:

```text
Repository identity
        ↓
Security vulnerabilities
        ↓
Test safety net
        ↓
Abuse protection
        ↓
Server/client boundaries
        ↓
Authorization boundaries
        ↓
Content/data ownership
        ↓
CMS/API duplication
        ↓
UI/component duplication
        ↓
Accessibility
        ↓
SEO
        ↓
Repository hygiene
        ↓
Final verification
```

This is a priority model, not a rigid waterfall.

Security and testing concerns may overlap.

---

# 42. Known Audit Areas Requiring Attention

The latest architecture audit identified areas that must be treated as hypotheses requiring verification against the current checkout before modification:

* stored HTML sanitization
* role authorization enforcement
* credential hygiene
* public endpoint abuse protection
* account deprovisioning
* security headers
* video embed URL validation
* weak persisted-data schemas
* version-controlled Firebase rules
* unbounded Firestore queries
* audit-log failure behavior
* server-only enforcement
* presentation-to-data dependency inversion
* duplicated admin forms
* duplicated admin API request handling
* repeated homepage document reads
* oversized components
* inconsistent error handling
* design-token drift
* font and palette mismatch
* duplicate course routes
* dead code and dependencies
* SEO gaps
* accessibility gaps
* missing automated tests and CI

Do not blindly accept these findings.

Reproduce relevant evidence before changing code.

Once reproduced, the audit finding becomes actionable engineering work.

---

# 43. Final Principle

Do not restructure ITFYG to make a diagram beautiful.

Restructure it when doing so makes real software easier to understand, safer to operate, easier to test, and less expensive to change.

Understand first.

Prove the problem.

Protect behavior.

Change incrementally.

Verify independently.
