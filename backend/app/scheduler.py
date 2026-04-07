from datetime import datetime, timedelta
import random


def distribute_tasks(tasks, final_date_str):
    """
    Distribute tasks between today and the final event date.
    """

    try:
        # Handle 'Z' timezone
        if final_date_str.endswith("Z"):
            final_date_str = final_date_str.replace("Z", "+00:00")

        final_date = datetime.fromisoformat(final_date_str)

    except Exception as e:
        print("Scheduler error:", e)
        return tasks  # fallback

    total_tasks = len(tasks)

    if total_tasks <= 1:
        return tasks

    today = datetime.now()

    # 🔥 Calculate actual available days
    total_days = (final_date.date() - today.date()).days

    # If event date is in past → fallback (don’t break system)
    if total_days < 0:
        total_days = 0

    # 🔥 Adjust span based on real window
    days_span = min(total_tasks, max(1, total_days + 1))

    # 🔥 FIX: start from today (never go into past)
    start_date = today

    scheduled_tasks = []

    for i, task in enumerate(tasks):
        # Better distribution across available days
        day_offset = int(i * days_span / total_tasks)

        task_date = start_date + timedelta(days=day_offset)

        # Random realistic time (8AM–8PM)
        hour = random.randint(8, 20)
        minute = random.choice([0, 15, 30, 45])

        task_date = task_date.replace(hour=hour, minute=minute, second=0, microsecond=0)

        task["due_date"] = task_date.isoformat()

        scheduled_tasks.append(task)

    return scheduled_tasks