import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const previewTasks = (text) =>
  API.post("/ai/preview-tasks", { input_text: text });

export const saveTasks = (tasks) =>
  API.post("/ai/save-tasks", { tasks }); 

export const getTasks = () => API.get("/tasks");

export const deleteTask = (id) =>
  API.delete(`/tasks/${id}`);

export const completeTask = (id) =>
  API.patch(`/tasks/${id}/complete`);

export const updateTask = (id, data) =>
  API.put(`/tasks/${id}`, data);