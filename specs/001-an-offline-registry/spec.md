# Feature Specification: Offline Registry App (Windows Portable, Bilingual)

**Feature Branch**: `001-an-offline-registry`  
**Created**: 2025-09-24  
**Status**: Draft  
**Input**: User description: "An offline registry application that runs locally on a Windows 10 Enterprise PC (no admin rights). Self-contained, production-ready, single .exe if possible. Bilingual (Greek+English). Functional flows for six categories with forms, deterministic numbering, soft delete, audit log, archiving, and a total registrations page. Offline-only, single user."

## Execution Flow (main)
```
1. Parse user description from Input
   → Clear: offline Windows app with bilingual UI and registry flows
2. Extract key concepts from description
   → Actors: Single workstation user (operator)
   → Actions: Create registration by category, select offices, view total registrations, soft delete, run monthly archiving
   → Data: Registration, Protocol Number, Draft Number, Offices, Category, Audit Log, Archive
   → Constraints: Offline, Windows portable, single user, no admin rights, bilingual UI, strict validation
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION] below
4. Fill User Scenarios & Testing section
   → Provided below
5. Generate Functional Requirements
   → Provided below (testable, numbered)
6. Identify Key Entities (if data involved)
   → Provided below
7. Run Review Checklist
   → Included at the end
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no low-level tech details)
- 👥 Written for business stakeholders

### Section Requirements
 **FR-005**: For Outgoing categories only, System MUST generate a Draft Number that starts at 1 and
   increments forever without reset, with a separate sequence per outgoing category (Common Outgoing,
   Confidential Outgoing, Signals Outgoing).
## Clarifications
- Q: How should the Draft Number sequence be scoped across outgoing categories? → A: Per outgoing category; no reset.
- Q: How should we capture the Windows username for audit logs? → A: Use Windows environment variable (e.g., USERNAME); if unavailable, record "unknown".
- Q: How should Entry Date display? → A: Show date with local time (auto-filled date).

### Acceptance Scenarios
1. Given the home screen, when I click "ΚΟΙΝΑ ΕΙΣΕΡΧΟΜΕΝΑ / Common Incoming", then I should see a
   bilingual form with all required fields and validation; upon Continue, I select offices and then
   see a confirmation with an auto-generated protocol number.
2. Given "ΚΟΙΝΑ ΕΞΕΡΧΟΜΕΝΑ / Common Outgoing", when I submit the bilingual form (including
   Recipient), then I should see a confirmation with both protocol and draft numbers.
3. Given "ΣΗΜΑΤΑ ΕΙΣΕΡΧΟΜΕΝΑ / Signals Incoming", when I submit the form and select offices, then a
   protocol number is generated according to its own sequence (resets yearly starting at 1).
4. Given the Total Registrations page, when I filter by a given month and category, then I should see
   up to 100 registrations per page with columns: Category, Protocol Number, Draft Number (if any),
   Entry Date, Offices, Deleted flag.
5. Given a registration, when I soft delete it, then it should be marked deleted and remain in the
   list; the protocol number remains reserved and visible.
6. Given the end of a month, when the archive process runs for the previous month, then those rows are
   moved to `/archive/YYYY-MM.db` and removed from the main list; a summary confirms archival.

### Edge Cases
- Attempt to submit with any missing field or >255 chars → form shows bilingual inline errors.
- Deleting an already deleted record → no-op with confirmation it was already deleted.
- Yearly reset: On Jan 1, protocol sequences per category start at the defined seeds (40001 or 1),
  while draft numbers for outgoing continue incrementing without reset.
- Office selection required for incoming types; if none chosen → bilingual error prompting selection.
- Data path unavailable at `C:\RegistryApp\data\app.db` → fallback to current working directory.
- Pagination boundary: exactly 100 items per page and correct navigation.

---

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST present a home panel with six bilingual buttons for the categories:
  Common Incoming/Outgoing, Signals Incoming/Outgoing, Confidential Incoming/Outgoing.
- **FR-002**: For each category, System MUST show a bilingual form with all required fields and
  bilingual inline validation messages; all fields are mandatory and limited to 255 characters.
- **FR-003**: For Incoming categories, System MUST allow multi-select of offices from a fixed list and
  require at least one selection before completion.
- **FR-004**: System MUST generate Protocol Numbers per category using deterministic sequences:
  - Common Incoming, Common Outgoing, Confidential Incoming, Confidential Outgoing: start 40001,
    increment by 1, reset yearly on Jan 1.
  - Signals Incoming, Signals Outgoing: start 1, increment by 1, reset yearly on Jan 1.
  - Deleted entries keep their numbers; numbers are never reused.
- **FR-005**: For Outgoing categories only, System MUST generate a Draft Number that starts at 1 and
   increments forever without reset, with a separate sequence per outgoing category (Common Outgoing,
   Confidential Outgoing, Signals Outgoing).
- **FR-006**: System MUST prevent editing of existing registrations and support soft delete (flag only)
  while preserving numbering and history.
- **FR-007**: System MUST maintain an audit log of creations and deletions including timestamp and
  Windows username.
- **FR-008**: System MUST provide a Total Registrations page with bilingual UI, filter by month and
  category, columns (Category, Protocol Number, Draft Number if any, Entry Date (date and local time),
  Offices, Deleted), and pagination of 100 per page.
- **FR-009**: System MUST retain records for one year and support archiving of the previous month into
  `/archive/YYYY-MM.db`, removing archived rows from the main database.
- **FR-010**: System MUST expose an administrative action to execute archiving for the previous month.
- **FR-011**: System MUST run entirely offline on a Windows 10 Enterprise PC without admin rights and
  be distributable as a single portable application that is easy to run.
- **FR-012**: System MUST auto-fill entry date with today’s date in forms.

### Ambiguities 
- **NC-001**: Office labels are fixed as listed;  Greek-only is acceptable for office names.
- **NC-002**: Windows username capture: confirm method for obtaining the operator’s username in the
  target environment (e.g., standard environment variable availability).

### Key Entities
- **Registration**: id, category, fields (issuer, ref no, dates, subject, recipient), offices (list),
  protocolNumber, draftNumber (optional), entryDate, createdAt, deletedFlag, deletedAt.
- **NumberingSequence**: category, year, nextProtocolNumber, nextDraftNumber (for outgoing only),
  lastUpdated.
- **AuditEvent**: id, action (create/delete), registrationId, timestamp, username.
- **ArchiveBatch**: month (YYYY-MM), createdAt, itemsMoved.

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details
- [x] Focused on user value
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed
