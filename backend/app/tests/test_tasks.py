from fastapi import status
from bson import ObjectId
from fastapi.testclient import TestClient
from .conftest import tasks_for_testing, task_patch_test_dict
import pytest


def test_get_all_tasks(client: TestClient):
    response = client.get("/tasks")

    all_tasks = response.json()['all tasks']
    
    assert response.status_code == status.HTTP_200_OK
    assert all_tasks[0]['title'] == tasks_for_testing[0]['title']
    assert all_tasks[0]['description'] == tasks_for_testing[0]['description']
    assert all_tasks[0]['isFinished'] == tasks_for_testing[0]['isFinished']


@pytest.mark.parametrize("idx", [0, 1, 2])
def test_get_single_task(client: TestClient, get_task_ids, idx):
    test_tasks_ids = get_task_ids

    response = client.get(f"/tasks/{test_tasks_ids[idx]}")

    single_task = response.json()["found task"]

    assert response.status_code == status.HTTP_200_OK
    assert single_task["_id"] == test_tasks_ids[idx]


@pytest.mark.parametrize("idx", [0, 1, 2])
def test_add_task(session, client: TestClient, idx):
    session.delete_many({})

    test_dic = {
                    "title": tasks_for_testing[idx]["title"],
                    "description": tasks_for_testing[idx]["description"]
                }

    response = client.post("/tasks",
                           json=test_dic)
    
    added_task = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert added_task["msg"] == True
    assert added_task["new_added_data"]["title"] == tasks_for_testing[idx]["title"]
    assert added_task["new_added_data"]["description"] == tasks_for_testing[idx]["description"]
    assert added_task["new_added_data"]["isFinished"] == False


@pytest.mark.parametrize("idx", [0, 1, 2])
def test_delete_task(client: TestClient, get_task_ids, idx):
    test_tasks_ids = get_task_ids

    response = client.delete(f"/tasks/{test_tasks_ids[idx]}")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["msg"] == "Task deleted successfully"


@pytest.mark.parametrize("idx", [0, 1, 2])
def test_update_task(client: TestClient, get_task_ids, idx):
    test_tasks_ids = get_task_ids

    response = client.patch(f"/tasks/{test_tasks_ids[idx]}",
                            json=task_patch_test_dict[idx])

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["updated_task"]["_id"] == test_tasks_ids[idx]
    assert response.json()["updated_task"]["title"] == task_patch_test_dict[idx]["title"]
    assert response.json()["updated_task"]["description"] == task_patch_test_dict[idx]["description"]
    assert response.json()["updated_task"]["isFinished"] == task_patch_test_dict[idx]["isFinished"]





@pytest.mark.parametrize("test_dic", [{}, {"description": "random description"}])
def test_add_task_missing_property(session, client: TestClient, test_dic):
    session.delete_many({})

    response = client.post("/tasks", json=test_dic)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    assert response.json()["detail"][0]["type"] == "missing"


def test_delete_non_existing_task(session, client: TestClient):

    session.delete_many({})

    random_generated_task_id = ObjectId()

    response = client.delete(f"/tasks/{random_generated_task_id}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == f"No task with id: {random_generated_task_id}"


def test_update_non_existing_task(session, client: TestClient):

    session.delete_many({})

    random_generated_task_id = ObjectId()

    response = client.patch(f"/tasks/{random_generated_task_id}",
                            json={"title":""})

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == f"No task with id: {random_generated_task_id}"


def test_get_single_non_existing_task(session, client: TestClient):

    session.delete_many({})

    random_generated_task_id = ObjectId()

    response = client.get(f"/tasks/{random_generated_task_id}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == f"no task with id: {random_generated_task_id}"


@pytest.mark.parametrize("idx", [0, 1, 2])
def test_update_task_missing_property(client: TestClient, get_task_ids, idx):
    test_tasks_ids = get_task_ids

    response = client.patch(f"/tasks/{test_tasks_ids[idx]}", json={})

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "No valid fields provided for update"