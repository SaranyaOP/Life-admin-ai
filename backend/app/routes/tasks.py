from fastapi import APIRouter, HTTPException
from app.models.task_model import Task
from app.services.firestore_service import (
    create_task,
    get_tasks,
    get_task,
    update_task,
    delete_task
)
from app.utils import is_valid_iso

router = APIRouter()


@router.post("/tasks")
def create_new_task(task: Task):
    task_dict = task.dict()
    task_dict.pop("id", None)

    if task_dict.get("due_date") and not is_valid_iso(task_dict["due_date"]):
        task_dict["due_date"] = None

    task_id = create_task(task_dict)

    return {"id": task_id, **task_dict}


@router.get("/tasks")
def fetch_tasks():
    return get_tasks()


@router.get("/tasks/{task_id}")
def fetch_task(task_id: str):
    task = get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/tasks/{task_id}")
def update_existing_task(task_id: str, updated_task: Task):
    existing = get_task(task_id)

    if not existing:
        raise HTTPException(status_code=404, detail="Task not found")

    task_data = updated_task.dict()
    task_data.pop("id", None)

    if task_data.get("due_date") and not is_valid_iso(task_data["due_date"]):
        task_data["due_date"] = None

    update_task(task_id, task_data)

    return {"id": task_id, **task_data}


@router.delete("/tasks/{task_id}")
def delete_existing_task(task_id: str):
    existing = get_task(task_id)

    if not existing:
        raise HTTPException(status_code=404, detail="Task not found")

    delete_task(task_id)

    return {"message": "Task deleted", "id": task_id}


@router.patch("/tasks/{task_id}/complete")
def mark_task_complete(task_id: str):
    existing = get_task(task_id)

    if not existing:
        raise HTTPException(status_code=404, detail="Task not found")

    update_task(task_id, {"completed": True})

    return {"message": "Task marked as completed", "id": task_id}