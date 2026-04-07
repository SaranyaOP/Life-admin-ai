from datetime import datetime, timedelta
import re


def get_next_weekday(target_day):
    today = datetime.now()
    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

    target_index = days.index(target_day)
    today_index = today.weekday()

    diff = (target_index - today_index + 7) % 7
    if diff == 0:
        diff = 7

    return today + timedelta(days=diff)


def extract_event_date(user_input: str):
    text = user_input.lower()
    today = datetime.now()

    # 🔹 tomorrow
    if "tomorrow" in text:
        return today + timedelta(days=1)

    # 🔹 in X days
    match_days = re.search(r"in (\d+) days", text)
    if match_days:
        days = int(match_days.group(1))
        return today + timedelta(days=days)

    # 🔹 next weekday
    match_weekday = re.search(
        r"next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)",
        text
    )
    if match_weekday:
        return get_next_weekday(match_weekday.group(1))

    # 🔹 exact date (April 10, Apr 10, 10 April)
    match_exact = re.search(
        r"(?:on\s)?(\d{1,2})\s?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)|"
        r"(?:on\s)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s?(\d{1,2})",
        text
    )

    if match_exact:
        months = {
            "jan": 1, "january": 1,
            "feb": 2, "february": 2,
            "mar": 3, "march": 3,
            "apr": 4, "april": 4,
            "may": 5,
            "jun": 6, "june": 6,
            "jul": 7, "july": 7,
            "aug": 8, "august": 8,
            "sep": 9, "september": 9,
            "oct": 10, "october": 10,
            "nov": 11, "november": 11,
            "dec": 12, "december": 12
        }

        # Case 1: 10 April
        if match_exact.group(1) and match_exact.group(2):
            day = int(match_exact.group(1))
            month = months[match_exact.group(2)]

        # Case 2: April 10
        else:
            month = months[match_exact.group(3)]
            day = int(match_exact.group(4))

        year = today.year

        # Handle past date → move to next year
        try:
            event_date = datetime(year, month, day)
            if event_date < today:
                event_date = datetime(year + 1, month, day)
            return event_date
        except:
            return None

    return None