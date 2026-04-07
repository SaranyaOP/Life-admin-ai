from google.cloud import firestore
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join(BASE_DIR, "serviceAccountKey.json")

db = firestore.Client()


def create_task(task_data):
    doc_ref = db.collection("tasks").document()
    doc_ref.set(task_data)
    return doc_ref.id


def get_tasks():
    docs = db.collection("tasks").stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in docs]


def get_task(task_id):
    doc = db.collection("tasks").document(task_id).get()
    if doc.exists:
        return {**doc.to_dict(), "id": doc.id}
    return None


def update_task(task_id, data):
    db.collection("tasks").document(task_id).update(data)


def delete_task(task_id):
    db.collection("tasks").document(task_id).delete()