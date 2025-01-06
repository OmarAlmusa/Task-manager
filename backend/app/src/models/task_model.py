from typing import Optional
from pydantic import BaseModel
from datetime import datetime, timezone

class Task(BaseModel):
    title: str
    description: Optional[str] = None
    isFinished: Optional[bool] = False
    date_created: datetime = datetime.now(timezone.utc)


class add_task_schema(BaseModel):
    title: str
    description: Optional[str] = None


class update_task_schema(add_task_schema):
    title: Optional[str] = None
    description: Optional[str] = None
    isFinished: Optional[bool] = None