from fastapi import APIRouter

router = APIRouter(prefix="/meta", tags=["meta"])


@router.get("/fields")
def get_fields():
    # Minimal bilingual field labels
    return {
        "issuer": {"el": "Αποστολέας", "en": "Issuer"},
        "referenceNumber": {"el": "Αρ. Αναφοράς", "en": "Reference Number"},
        "subject": {"el": "Θέμα", "en": "Subject"},
        "recipient": {"el": "Παραλήπτης", "en": "Recipient"},
        "offices": {"el": "Γραφεία", "en": "Offices"},
        "entryDate": {"el": "Ημερομηνία Καταχώρησης", "en": "Entry Date"},
    }


@router.get("/offices")
def get_offices():
    # Placeholder list; in real app this could be configurable
    return [
        {"code": "OFF-1", "label": "Office 1"},
        {"code": "OFF-2", "label": "Office 2"},
    ]
