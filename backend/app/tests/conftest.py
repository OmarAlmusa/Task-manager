from fastapi.testclient import TestClient
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

task_patch_test_dict = [
    {
        "title": "Hamster in the park",
        "description": "Need to buy some groceries",
        "isFinished": False
    },
    {
        "title": "Wash clothes",
        "description": "Take the hamster to the park",
        "isFinished": True
    },
    {
        "title": "Meeting at 8:00pm",
        "description": "I need to attend meeting with my colleagues today",
        "isFinished": True
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


@pytest.fixture(name="get_task_ids")
def get_task_ids_test(client: TestClient):
    response = client.get("/tasks")

    all_tasks = response.json()['all tasks']

    test_tasks_ids = []

    for task in all_tasks:
        test_tasks_ids.append(task["_id"])

    return test_tasks_ids