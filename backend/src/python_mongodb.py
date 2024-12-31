from pymongo import MongoClient

def get_database():

    CONNECTION_STRING = "mongodb://localhost:27017"

    client = MongoClient(CONNECTION_STRING)

    try:
        databases = client.list_database_names()
        print("Connected to the MongoDB!")
        print("Databases:", databases)

    except Exception as e:
        print("Failed to connect to the MongoDB", e)

    return client["tasks-database"]