from google.cloud import firestore

db = None

def get_db():
    global db
    if db is None:
        db = firestore.Client()
    return db


def create_task(task_data):
    doc_ref = get_db().collection("tasks").document()
    doc_ref.set(task_data)
    return doc_ref.id


def get_tasks():
    docs = get_db().collection("tasks").stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in docs]


def get_task(task_id):
    doc = get_db().collection("tasks").document(task_id).get()
    if doc.exists:
        return {**doc.to_dict(), "id": doc.id}
    return None


def update_task(task_id, data):
    get_db().collection("tasks").document(task_id).update(data)


def delete_task(task_id):
    get_db().collection("tasks").document(task_id).delete()