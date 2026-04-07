from app.services.ai_service import extract_tasks_from_text
from app.scheduler import distribute_tasks
from app.date_parser import extract_event_date


def task_agent(user_input: str):
    tasks = extract_tasks_from_text(user_input)

    if isinstance(tasks, dict) and "error" in tasks:
        return tasks

    if not isinstance(tasks, list):
        return {"tasks": []}

    text = user_input.lower()
    is_planning = any(word in text for word in ["plan", "prepare", "schedule"])

    if is_planning and len(tasks) > 1:
        # 🔥 NEW: extract event date from user input
        event_date = extract_event_date(user_input)

        if event_date:
            tasks = distribute_tasks(tasks, event_date.isoformat())

    return {
        "tasks": tasks
    }