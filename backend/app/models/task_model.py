from pydantic import BaseModel
from typing import Optional

class Task(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = ""
    completed: bool = False
    due_date: Optional[str] = None
    priority: Optional[str] = "medium" 