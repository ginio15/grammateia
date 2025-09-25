
# Implementation Plan: Offline Registry App (Windows Portable, Bilingual)

**Branch**: `001-an-offline-registry` | **Date**: 2025-09-24 | **Spec**: /Users/ginio/projects/grammateia3/specs/001-an-offline-registry/spec.md
**Input**: Feature specification from `/specs/001-an-offline-registry/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Build a single-user, offline registry app for Windows 10 Enterprise that runs a local HTTP server at 127.0.0.1:8733 and opens the browser automatically. The app records registrations across six categories with deterministic numbering (protocol per category with yearly reset; draft numbers for outgoing with no reset and per-outgoing-category scope), supports soft delete and audit logging (timestamp + Windows USERNAME with fallback to "unknown"), and performs monthly archiving to `/archive/YYYY-MM.db`. Technical approach: FastAPI backend with SQLite (WAL) for persistence, React frontend (reuse existing `frontend/`), contracts-first via OpenAPI, TDD, and packaging into a portable Windows `.exe` using PyInstaller. Data path prefers `C:\RegistryApp\data\app.db` with fallback to current working directory.

## Technical Context
**Language/Version**: Python 3.11+, TypeScript/React (existing frontend)  
**Primary Dependencies**: FastAPI, Pydantic, Uvicorn (dev), SQLite (builtin), PyInstaller (packaging)  
**Storage**: SQLite in WAL mode at `C:\\RegistryApp\\data\\app.db` (fallback: cwd)  
**Testing**: pytest + httpx for API, Playwright/Cypress optional later for UI  
**Target Platform**: Windows 10 Enterprise (no admin)  
**Project Type**: web (frontend + backend)  
**Performance Goals**: Snappy local use; <100ms typical API latency; dataset ~few thousand rows  
**Constraints**: Offline-only, no network egress; single-user; bilingual UI; immutable records; TDD/contracts-first  
**Scale/Scope**: Single workstation; ~500 seeded entries for QA; 6 categories; 1 Total Registrations page

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Compliance against Constitution v1.0.0:
- Offline-First, Windows-Portable: Plan uses FastAPI + SQLite, no external calls, PyInstaller `.exe`, runs on 127.0.0.1:8733 and auto-opens browser. Data path and cwd fallback defined. PASS
- Deterministic Numbering & Immutability: Protocol sequences per category with yearly reset; draft sequences per outgoing category with no reset; atomic generation within DB transactions; soft delete only. PASS
- Bilingual UX & Validation: All labels/messages bilingual; all fields required; 255-char max; entry date auto-fill; large, accessible UI. PASS
   - Tests will include a bilingual UI review gate before merges.
- Contracts-First & TDD: OpenAPI contract generated in Phase 1; tests to be created before implementation in tasks phase; backend listens on 127.0.0.1:8733. PASS
- Data Integrity, Audit & Archiving: SQLite WAL; audit with timestamp + Windows USERNAME (fallback "unknown"); monthly archive via POST /admin/archive/run to `/archive/YYYY-MM.db`. PASS
   - Tests will cover AuditEvent creation on create/delete with username fallback.

Initial Constitution Check: PASS

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 2 (Web application: existing `frontend/` + new `backend/`)
Note: Current repo's frontend root is `frontend/` (no `frontend/src`); we will add `frontend/services/` alongside existing components for API calls.

## Phase 0: Outline & Research
Outputs written to `/Users/ginio/projects/grammateia3/specs/001-an-offline-registry/research.md`.

Key unknowns resolved and best practices captured:
- Packaging: PyInstaller one-file vs one-folder; approach chosen and auto-open browser pattern.
- SQLite WAL + path guarantees for `C:\\RegistryApp\\data\\app.db` with fallback to cwd; directory creation strategy.
- Numbering atomicity: DB transactions and sequence tables design.
- Audit username source: Windows USERNAME env var with safe fallback.
- Archiving strategy: ATTACH DATABASE and move rows to `/archive/YYYY-MM.db` safely.
- Seeding ~500 synthetic entries for QA.

All NEEDS CLARIFICATION resolved here. See research.md for details.

## Phase 1: Design & Contracts
Prerequisite met: research.md complete.

Artifacts generated:
- Data Model: `/Users/ginio/projects/grammateia3/specs/001-an-offline-registry/data-model.md`
- API Contract: `/Users/ginio/projects/grammateia3/specs/001-an-offline-registry/contracts/openapi.yaml`
- Quickstart: `/Users/ginio/projects/grammateia3/specs/001-an-offline-registry/quickstart.md`

Notes:
- Contract tests and integration scenarios will be generated during the /tasks phase per TDD, based on these contracts and data model.

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
