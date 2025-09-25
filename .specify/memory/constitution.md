# GrammatEIA Offline Registry App Constitution

<!--
Sync Impact Report

- Version change: N/A → 1.0.0
- Modified principles: (new) — introduced 5 principles
- Added sections: Core Principles; Technical Constraints; Development Workflow & Quality Gates; Governance
- Removed sections: none
- Templates requiring updates:
	- .specify/templates/plan-template.md → ✅ Aligned (Constitution Check pulls from this file)
	- .specify/templates/spec-template.md → ✅ Aligned (no constitution-specific contradictions)
	- .specify/templates/tasks-template.md → ✅ Aligned (TDD emphasis consistent)
	- .specify/templates/agent-file-template.md → ✅ Aligned (no agent-specific contradictions)
	- .specify/templates/commands/*.md → ⚠ Not present (no action)
- Follow-up TODOs:
	- TODO(README): Create a concise README summarizing these principles and runtime constraints.
-->

## Core Principles

### I. Offline-First, Windows-Portable, Single-User (NON-NEGOTIABLE)
The application MUST run entirely offline on Windows 10 Enterprise without admin rights. It MUST be
self-contained and packaged as a single portable executable (or a minimal folder) that launches the
local HTTP server and auto-opens http://127.0.0.1:8733. No external network calls are allowed.
Data MUST be stored at C:\RegistryApp\data\app.db; if not available, the current working folder
MUST be used. The app targets a single workstation and a single user.

Rationale: Operational environments may prohibit internet access and admin privileges. A portable,
offline binary ensures reliable deployment and predictable behavior.

### II. Deterministic Numbering and Immutability of Records
Protocol numbers and draft numbers MUST follow strict sequences per category:
- Protocol Number (ΑΡΙΘΜ. ΠΡΩΤΟΚ)
	- Common Incoming, Common Outgoing, Confidential Incoming, Confidential Outgoing: start at 40001
		and increment by 1 per category.
	- Signals Incoming, Signals Outgoing: start at 1 and increment by 1 per category.
	- Sequences MUST reset each year on January 1 and MUST be persisted. Deleted entries KEEP their
		numbers; gaps are allowed and MUST NOT be reused.
- Draft Number (ΑΡΙΘΜ ΣΧΕΔΙΟΥ)
	- Exists only for Outgoing categories.
	- Starts at 1, increments forever (no yearly reset).

Records MUST be immutable after creation (no edits). Only soft delete is allowed, which flags the
record as deleted while preserving the numbering and audit trail. Number generation MUST be atomic
and concurrency-safe (DB transaction level) to prevent collisions.

Rationale: Legal/administrative traceability requires stable numbering and immutable historical state.

### III. Bilingual UX and Strict Validation
All UI labels and validation messages MUST be bilingual (Greek + English) and shown side-by-side.
All form fields are mandatory and MUST enforce a maximum of 255 characters where applicable. Entry
date fields MUST auto-fill with today’s date. The home screen MUST display six large bilingual
buttons for the required categories. The UI MUST use a clean blue-gray palette with large,
click-friendly components.

Rationale: Bilingual environments and accessibility require clarity; consistent validation prevents
data quality issues.

### IV. Contracts-First API with TDD Discipline
The backend API contracts MUST be defined and tested before implementation. Required endpoints:
- POST /registrations/{category}
- GET /registrations?month=YYYY-MM&category=...
- DELETE /registrations/{id}
- GET /meta/fields
- GET /meta/offices
- POST /admin/archive/run

OpenAPI (or equivalent) MUST reflect the contract; contract and integration tests MUST be created
first and MUST fail before implementation (TDD). The app MUST listen on 127.0.0.1:8733 and auto-open
the browser on start.

Rationale: Contracts-first guarantees stable interfaces and enables reliable frontend-backend
integration under an offline constraint.

### V. Data Integrity, Auditability, and Archiving
SQLite MUST run in WAL mode. Every creation and deletion MUST be logged with timestamp and Windows
username. Edits are not allowed; therefore, edit logs are not required. Soft deletes MUST preserve
numbers and audit trail. Records MUST be retained for one year and archived monthly into
`/archive/YYYY-MM.db`; archived rows are removed from the main DB. An administrative action triggers
archiving via POST /admin/archive/run (previous month).

Rationale: WAL improves reliability on local filesystems; audit and retention satisfy accountability
and storage hygiene requirements.

## Technical Constraints

The following constraints are mandatory for this project:

- Backend: FastAPI + SQLite (WAL mode). No external services, no internet access.
- Frontend: React or simple HTML. Bilingual text for every label and validation message.
- Packaging: Portable Windows executable created via PyInstaller (or equivalent). No admin rights.
- Runtime: Auto-start local server on 127.0.0.1:8733 and auto-open the default browser.
- Data Path: Prefer `C:\\RegistryApp\\data\\app.db`; fallback to current working directory if
	the preferred path is unavailable.
- Single User: No authentication, no multi-user locking beyond DB transaction safety for numbering.
- Dataset: Provide a synthetic dataset (~500 entries) for QA.
- Security: No network egress. File access restricted to the data directory and archive folder.

## Development Workflow & Quality Gates

The development process MUST comply with these gates:

1. Constitution Check: Every plan/spec MUST verify compliance with the Core Principles and Technical
	 Constraints defined here. Violations MUST be documented with rationale and approved before
	 proceeding.
2. TDD Enforcement: Contract tests and critical integration tests MUST be written first and MUST fail
	 before implementation starts. Only then implement and make tests pass.
3. Lint/Type/Build: Linting, type checks, and build/packaging steps MUST pass on CI. A Windows
	 packaging smoke test MUST confirm the `.exe` starts, opens the browser, and serves 127.0.0.1:8733.
4. Bilingual Review: UI changes MUST include Greek + English labels and validation messages. PRs MUST
	 be rejected if bilingual completeness is missing.
5. Data Rules: Numbering, immutability, audit logging, and archiving MUST be covered by tests.
6. Retention & Archiving: A monthly archiving test MUST verify that `/admin/archive/run` moves records
	 to `/archive/YYYY-MM.db` and retains one-year history.

Outputs from the planning templates (plan/spec/tasks) MUST reference this constitution for the
Constitution Check step and reflect any mandatory constraints.

## Governance

This Constitution supersedes other practices for this repository. Amendments MUST:

- Be proposed via PR with a Sync Impact Report summarizing changes, version bump, and affected
	templates.
- Follow Semantic Versioning for the Constitution itself:
	- MAJOR: Backward incompatible removals or redefinitions of principles.
	- MINOR: Addition of new principles/sections or material expansions.
	- PATCH: Clarifications and non-semantic refinements.
- Update the “Constitution Check” expectations in planning documents as needed.
- Trigger a compliance review: PR reviewers MUST verify that plan/spec/tasks remain aligned. If
	misalignment exists, related templates and docs MUST be updated in the same PR or flagged as
	follow-ups in the Sync Impact Report.

**Version**: 1.0.0 | **Ratified**: 2025-09-24 | **Last Amended**: 2025-09-24
