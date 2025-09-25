# Tasks — Offline Registry App (Feature: 001-an-offline-registry)

This tasks list is dependency-ordered and TDD-first. Parallelizable tasks are marked [P]. Use absolute paths and keep artifacts under the feature directory unless noted.

Artifacts referenced:
- Plan: /Users/ginio/projects/grammateia3/specs/001-an-offline-registry/plan.md
- Research: /Users/ginio/projects/grammateia3/specs/001-an-offline-registry/research.md
- Data model: /Users/ginio/projects/grammateia3/specs/001-an-offline-registry/data-model.md
- OpenAPI: /Users/ginio/projects/grammateia3/specs/001-an-offline-registry/contracts/openapi.yaml
- Quickstart: /Users/ginio/projects/grammateia3/specs/001-an-offline-registry/quickstart.md

## Setup

[X] T001. Initialize backend project structure [backend/]
- Create `backend/` with FastAPI app skeleton: `backend/src/app.py`, `backend/src/api/`, `backend/src/models/`, `backend/src/services/`, `backend/tests/`.
- Add `pyproject.toml` or `requirements.txt` with fastapi, uvicorn, pydantic, httpx, pytest.
- Ensure Windows-friendly settings; no external network.
- Output: runnable dev server on 127.0.0.1:8733.

[X] T002. Add SQLite initialization with WAL and data path resolution
- Implement utility to resolve DB path preferring `C:\\RegistryApp\\data\\app.db` with cwd fallback and directory creation.
- Ensure `PRAGMA journal_mode=WAL;` at connection.
- Output: module `backend/src/services/db.py` with get_connection() and init_db().

[X] T003. Define DDL for core tables [P]
- Create SQL/ORM setup for Registration, NumberingSequence, AuditEvent, ArchiveBatch based on data-model.md.
- Output: `backend/src/models/schema.sql` or ORM models; executed during startup.

## Contracts-first tests (TDD)

[X] T004. Contract test: GET /meta/fields [P]
- Created in `backend/tests/contract/test_contract_meta.py` and asserts 200.

[X] T005. Contract test: GET /meta/offices [P]
- Created in `backend/tests/contract/test_contract_meta.py` and asserts 200.

[X] T006. Contract test: POST /registrations/{category} [P]
- Created in `backend/tests/contract/test_contract_registrations.py` covering validation shape and 201.

[X] T007. Contract test: GET /registrations [P]
- Created in `backend/tests/contract/test_contract_registrations.py` asserting 200 and page size semantics.

[X] T008. Contract test: DELETE /registrations/{id} [P]
- Created in `backend/tests/contract/test_contract_registrations.py` asserting 204 and soft delete.

[X] T009. Contract test: POST /admin/archive/run [P]
- Created in `backend/tests/contract/test_contract_registrations.py` asserting 200 response shape.

## Core implementation

[X] T010. Implement meta endpoints
- Implemented in `backend/src/api/meta.py`.

[X] T011. Implement numbering service and sequences
- Implemented in `backend/src/services/numbering.py`; used transactionally.

[X] T012. Implement create registration endpoint
- Implemented in `backend/src/api/registrations.py` with validation and audit on create.

[X] T013. Implement list registrations with pagination and filters
- Implemented in `backend/src/api/registrations.py` with fixed pageSize=100.

[X] T014. Implement soft delete endpoint
- Implemented in `backend/src/api/registrations.py` with audit on delete.

[X] T015. Implement archiving service and endpoint
- Implemented `backend/src/services/archive.py` with ATTACH-based move; wired in `backend/src/api/admin.py`.

## Integration and seed data

[X] T016. Seed ~500 synthetic entries for QA [P]
- Implemented `backend/src/cli/seed.py`.

## Packaging and startup

[X] T018. Add entry-point launcher that starts server and opens browser
- Pending `backend/src/cli/run.py`.
[X] T018. Add entry-point launcher that starts server and opens browser
- Implemented `backend/src/cli/run.py` to start uvicorn on 127.0.0.1:8733 and auto-open browser.

[X] T019. PyInstaller packaging
- Added `backend/packaging/GrammatEIARegistry.spec` and CI workflow `.github/workflows/windows-packaging.yml` to build and run smoke test.

## Polish and validation

[X] T020. Unit tests for services [P]
- Pending edge-case tests for numbering and archive.
[X] T020. Unit tests for services [P]
- Numbering unit tests and archive unit test added under `backend/tests/unit/`.

[X] T021. Docs and quickstart alignment [P]
- Updated packaging steps in `quickstart.md`.

## Additional tests and gates

[X] T022. Contract/Integration test: Audit events on create/delete [P]
- Implemented in `backend/tests/contract/test_audit_events.py` using USERNAME fallback.

[X] T023. Integration tests for acceptance scenarios [P]
- Pending coverage of flows across categories and pagination.
[X] T023. Integration tests for acceptance scenarios [P]
- Implemented in `backend/tests/integration/test_acceptance_flows.py`.

[X] T024. Bilingual UI review gate [P]
- Added bilingual subtitles and test `frontend/tests/homepanel.test.tsx`.

[X] T025. Packaging smoke test (Windows .exe)
- Implemented via `.github/workflows/windows-packaging.yml` and placeholder test consuming `REGISTRY_APP_EXE`.

[X] T026. POST default entryDate test [P]
- Covered as part of creation tests (`test_create_registration_minimal_and_entry_date_default`).

[X] T027. Home panel UI test: six large bilingual buttons [P]
- Implemented `frontend/tests/homepanel.test.tsx` verifying six Greek labels plus English subtitles.

[X] T028. No network egress guard [P]
- Implemented in `tests/policy/test_no_network_egress.py`.
