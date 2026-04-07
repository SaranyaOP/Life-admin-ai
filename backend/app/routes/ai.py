from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.agents.orchestrator import orchestrator
from app.models.task_model import Task
from app.services.firestore_service import create_task
from app.utils import is_valid_iso

router = APIRouter()


# ✅ Request models
class AIRequest(BaseModel):
    input_text: str


class TaskList(BaseModel):
    tasks: List[Task]


# ✅ PREVIEW (AI ONLY)
@router.post("/ai/preview-tasks")
def preview_tasks(request: AIRequest):
    result = orchestrator(request.input_text)

    if isinstance(result, dict) and "error" in result:
        return result

    tasks = result.get("tasks", [])

    valid_tasks = []

    for task in tasks:
        if not isinstance(task, dict):
            continue

        if not task.get("title"):
            continue

        # Defaults
        task.setdefault("description", "")
        task.setdefault("completed", False)
        task.setdefault("due_date", None)

        # ✅ Validate due_date
        if task.get("due_date") and not is_valid_iso(task["due_date"]):
            task["due_date"] = None

        # ✅ Priority handling
        task.setdefault("priority", "medium")

        if not isinstance(task.get("priority"), str):
            task["priority"] = "medium"

        task["priority"] = task["priority"].lower()

        if task["priority"] not in ["low", "medium", "high"]:
            task["priority"] = "medium"

        valid_tasks.append(task)

    return {"tasks": valid_tasks}


# ✅ SAVE (ONLY DB — NO CALENDAR)
@router.post("/ai/save-tasks")
def save_tasks(payload: TaskList):
    tasks = payload.tasks
    created_tasks = []

    for task in tasks:
        task_dict = task.dict()
        task_dict.pop("id", None)

      

        # Save to DB
        task_id = create_task(task_dict)

        created_tasks.append({
            "id": task_id,
            **task_dict
        })

    return {"tasks": created_tasks}