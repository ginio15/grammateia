# Data Model — Offline Registry App

Entities reflect the spec and constitution. All text fields are required and limited to 255 chars unless noted. Dates are stored as ISO strings (YYYY-MM-DD or ISO 8601), with Entry Date including local time in presentation.

## Registration
- id: integer PK
- category: enum { common_incoming, common_outgoing, confidential_incoming, confidential_outgoing, signals_incoming, signals_outgoing }
- issuer: text (<=255)
- referenceNumber: text (<=255)
- subject: text (<=255)
- recipient: text (<=255) — required only for outgoing categories; still stored and validated as <=255
- offices: json array of office codes (non-empty for incoming categories)
- protocolNumber: integer (required)
- draftNumber: integer nullable (only for outgoing)
- entryDate: date (auto-filled to today; display with local time)
- createdAt: datetime
- deletedFlag: boolean (default false)
- deletedAt: datetime nullable

Constraints:
- All fields required except `draftNumber` (null for non-outgoing), `deletedAt`.
- Enforce 255-char limit in API validation.
- No updates after creation; only soft-delete toggles `deletedFlag` and sets `deletedAt`.

## NumberingSequence
- id: integer PK
- type: enum { protocol, draft }
- category: enum (for protocol) or outgoing enum (for draft)
- year: integer nullable (null for draft)
- nextNumber: integer
- lastUpdated: datetime

Seeds:
- Protocol: {category, year, nextNumber} where nextNumber = 40001 for Common/Confidential (in/out), 1 for Signals (in/out)
- Draft (outgoing only): per outgoing category with nextNumber = 1 (never resets)

## AuditEvent
- id: integer PK
- action: enum { create, delete }
- registrationId: integer FK -> Registration.id
- timestamp: datetime
- username: text (<=255)

## ArchiveBatch
- id: integer PK
- month: text (YYYY-MM)
- createdAt: datetime
- itemsMoved: integer

## Offices (Static)
Provide a static list in the API under `GET /meta/offices` with code+label (GR+EN combined or separate fields). Greek-only labels acceptable per spec.

## Validation Rules Summary
- Required fields: issuer, referenceNumber, subject, recipient (outgoing only), offices (incoming only)
- Max length: 255 on all text inputs
- Offices must be at least one item for incoming categories
- Category-specific rules enforced server-side

## Pagination
- Pagination is server-driven at 100 items per page for `GET /registrations`.
