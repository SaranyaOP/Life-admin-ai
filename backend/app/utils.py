from datetime import datetime

def is_valid_iso(date_str):
    try:
        datetime.fromisoformat(date_str)
        return True
    except:
        return False