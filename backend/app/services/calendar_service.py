from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import os
from datetime import datetime, timedelta

SCOPES = ["https://www.googleapis.com/auth/calendar"]


def get_calendar_service():
    creds = None

    # Load existing token
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    # If no valid creds → login
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(
            "credentials.json", SCOPES
        )
        creds = flow.run_local_server(port=0)

        with open("token.json", "w") as token:
            token.write(creds.to_json())

    service = build("calendar", "v3", credentials=creds)
    return service


def create_calendar_event(title, description, due_date):
    service = get_calendar_service()

    # 🔥 Ensure end time exists (add 1 hour)
    start_dt = datetime.fromisoformat(due_date)
    end_dt = start_dt + timedelta(hours=1)

    event_body = {
        "summary": title,
        "description": description,
        "start": {
            "dateTime": start_dt.isoformat(),
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": end_dt.isoformat(),
            "timeZone": "Asia/Kolkata",
        },
    }

    event = service.events().insert(
        calendarId="primary",
        body=event_body
    ).execute()

    # ✅ RETURN BOTH
    return {
        "id": event.get("id"),
        "link": event.get("htmlLink")
    }

def update_calendar_event(event_id, title, description, due_date):
    service = get_calendar_service()

    from datetime import datetime, timedelta

    start_dt = datetime.fromisoformat(due_date)
    end_dt = start_dt + timedelta(hours=1)

    event_body = {
        "summary": title,
        "description": description,
        "start": {
            "dateTime": start_dt.isoformat(),
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": end_dt.isoformat(),
            "timeZone": "Asia/Kolkata",
        },
    }

    event = service.events().update(
        calendarId="primary",
        eventId=event_id,
        body=event_body
    ).execute()

    return {
        "id": event.get("id"),
        "link": event.get("htmlLink")
    }


def delete_calendar_event(event_id):
    service = get_calendar_service()

    service.events().delete(
        calendarId="primary",
        eventId=event_id
    ).execute()

    return True