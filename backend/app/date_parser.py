from datetime import datetime, timedelta
import re

def get_next_weekday(target_day):
    # Fixed to use the current date (April 7, 2026)
    today = datetime.now()
    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    
    target_index = days.index(target_day.lower())
    today_index = today.weekday()

    # Calculate difference to the next occurrence of that day
    diff = (target_index - today_index + 7) % 7
    
    # If the day is today, we assume "next [day]" refers to next week
    if diff == 0:
        diff = 7

    return today + timedelta(days=diff)

def extract_event_date(user_input: str):
    text = user_input.lower()
    today = datetime.now()

    # 1. Check for "tomorrow"
    if "tomorrow" in text:
        return today + timedelta(days=1)

    # 2. Check for "in X days"
    match_days = re.search(r"in (\d+) days", text)
    if match_days:
        days = int(match_days.group(1))
        return today + timedelta(days=days)

    # 3. Check for "next [weekday]"
    match_weekday = re.search(
        r"next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)",
        text
    )
    if match_weekday:
        return get_next_weekday(match_weekday.group(1))

    # 4. Check for exact dates (e.g., April 10)
    match_exact = re.search(
        r"(?:on\s)?(\d{1,2})\s?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)|"
        r"(?:on\s)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s?(\d{1,2})",
        text
    )

    if match_exact:
        months = {
            "jan": 1, "january": 1, "feb": 2, "february": 2, "mar": 3, "march": 3,
            "apr": 4, "april": 4, "may": 5, "jun": 6, "june": 6, "jul": 7, "july": 7,
            "aug": 8, "august": 8, "sep": 9, "september": 9, "oct": 10, "october": 10,
            "nov": 11, "november": 11, "dec": 12, "december": 12
        }

        if match_exact.group(1) and match_exact.group(2):
            day, month = int(match_exact.group(1)), months[match_exact.group(2)]
        else:
            month, day = months[match_exact.group(3)], int(match_exact.group(4))

        year = today.year
        try:
            event_date = datetime(year, month, day)
            if event_date.date() < today.date():
                event_date = datetime(year + 1, month, day)
            return event_date
        except ValueError:
            pass

    # 5. Requirement: Default to tomorrow if no date is mentioned
    return today + timedelta(days=1)