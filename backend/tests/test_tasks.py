from fastapi.testclient import TestClient
from fastapi import status
from ..src.main import app
from ..src.python_mongodb import get_database
from ..src.routes.tasks import get_collection
from datetime import datetime, timezone
import pytest

tasks_for_testing = [
    {
        "title": "Go to shop",
        "description": "Need to buy some groceries",
        "isFinished": False,
        "date_created": datetime.now(timezone.utc)
    },
    {
        "title": "Wash clothes",
        "description": "",
        "isFinished": True,
        "date_created": datetime.now(timezone.utc)
    },
    {
        "title": "Meeting at 8:00pm",
        "description": "I need to attend meeting with my colleagues today",
        "isFinished": False,
        "date_created": datetime.now(timezone.utc)
    }
]

@pytest.fixture(name="session")
def session_fixture():
    db = get_database()

    collection_test = db["tasks-collection-test"]

    collection_test.delete_many({})

    collection_test.insert_many(tasks_for_testing)

    yield collection_test

@pytest.fixture(name="client")
def client_fixture(session):

    def get_collection_override():
        return session
    
    app.dependency_overrides[get_collection] = get_collection_override

    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()



def test_get_all_tasks(client: TestClient):
    response = client.get("/tasks")

    all_tasks = response.json()['all tasks']
    
    assert response.status_code == status.HTTP_200_OK
    assert all_tasks[0]['title'] == tasks_for_testing[0]['title']
    assert all_tasks[0]['description'] == tasks_for_testing[0]['description']
    assert all_tasks[0]['isFinished'] == tasks_for_testing[0]['isFinished']


