from datetime import datetime, timedelta
import random

def distribute_tasks(tasks, final_date_str):
    try:
        if final_date_str.endswith("Z"):
            final_date_str = final_date_str.replace("Z", "+00:00")
        final_date = datetime.fromisoformat(final_date_str)
    except Exception:
        return tasks

    total_tasks = len(tasks)
    if total_tasks == 0:
        return []

    # Current time is our absolute start floor
    today = datetime.now()
    
    # Calculate difference in seconds for more granular distribution
    total_seconds = (final_date - today).total_seconds()
    
    # If the date is in the past, default to a 24-hour window from now
    if total_seconds <= 0:
        total_seconds = 86400 

    scheduled_tasks = []

    for i, task in enumerate(tasks):
        # Evenly spread tasks across the available time window
        # First task starts near now, last task ends near the event date
        seconds_offset = (i * total_seconds) / max(1, total_tasks - 1)
        task_date = today + timedelta(seconds=seconds_offset)

        # Apply realistic working hours (9 AM to 7 PM)
        if task_date.hour < 9:
            task_date = task_date.replace(hour=9, minute=random.choice([0, 15, 30]))
        elif task_date.hour > 19:
            # If offset lands late at night, move to next morning 9 AM
            task_date = (task_date + timedelta(days=1)).replace(hour=9, minute=0)

        task["due_date"] = task_date.strftime("%Y-%m-%dT%H:%M:%S")
        scheduled_tasks.append(task)

    return scheduled_tasks