from email.policy import HTTP
from fastapi import APIRouter, HTTPException, status
from ..python_mongodb import get_database
from ..models.task_model import Task, add_task_schema, update_task_schema
from datetime import datetime, timezone
from bson import ObjectId

db = get_database()

collection = db["tasks-collection"]

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)



@router.post("/")
def add_task(task: add_task_schema):
    if not task.title.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Task title cannot be empty or contain only spaces")
    new_task = Task(
        **task.model_dump(),
        isFinished=False,
        date_created=datetime.now(timezone.utc)
    )
    res = collection.insert_one(new_task.model_dump())
    return {"msg": res.acknowledged, "new_added_data": {**new_task.model_dump(), "_id": str(res.inserted_id)}}



@router.get("/")
def get_all_tasks():
    all_tasks = collection.find({})
    res = [{**task, "_id": str(task["_id"])} for task in all_tasks]
    return {"all tasks": res}



@router.get("/{task_id}")
def get_single_task(task_id: str):
    try:
        object_id = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task_id format")
    
    query_filter = {"_id": object_id}

    result = collection.find_one(query_filter)

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"no task with id: {task_id}")
    
    found_task = {**result, "_id":str(result["_id"])}

    return {"found task": found_task}



@router.patch("/{task_id}")
def update_task(task_id: str, task: update_task_schema):

    try:
        object_id = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task_id format")
    
    update_fields = {k: v for k, v in task.model_dump().items() if v is not None}

    if not update_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No valid fields provided for update"
        )
    
    query_filter = {"_id": object_id}
    update_operation = {"$set": update_fields}

    result = collection.find_one_and_update(query_filter, update_operation, return_document=True)

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No task with id: {task_id}")

    return {"updated_task": {**result, "_id":str(result["_id"])}}



@router.delete("/{task_id}")
def delete_task(task_id: str):

    try:
        object_id = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task_id format")
    
    query_filter = {"_id": object_id}
    
    result = collection.delete_one(query_filter)

    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No task with id: {task_id}")
    
    return {"msg": "Task deleted successfully"}