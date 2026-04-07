import { useEffect, useState } from "react";
import { getTasks, deleteTask, completeTask } from "../api/api";
import TaskCard from "../components/TaskCard";
import EditTaskModal from "../components/EditTaskModal";

export default function Tasks({ refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showToday, setShowToday] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // 🔥 NEW STATE
  const [sortByDate, setSortByDate] = useState(false);

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  const getTodayDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = getTodayDate();

  // 🔥 FILTER
  const filteredTasks = tasks.filter((t) => {
    const matchPriority =
      filter === "all" || t.priority === filter;

    const matchToday =
      !showToday || t.due_date?.startsWith(today);

    return matchPriority && matchToday;
  });

  // 🔥 SORT LOGIC (NEW)
  const finalTasks = sortByDate
    ? [...filteredTasks].sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      })
    : filteredTasks;

  return (
    <div className="tasks-page">
      <h2 className="title">All Tasks</h2>

      <div className="section">

        <div className="filter-buttons">

          <button
            className={`btn today ${showToday ? "active" : ""}`}
            onClick={() => setShowToday(!showToday)}
          >
            Today
          </button>

          <button
            className={`btn low ${filter === "low" ? "active" : ""}`}
            onClick={() =>
              setFilter(filter === "low" ? "all" : "low")
            }
          >
            Low
          </button>

          <button
            className={`btn medium ${filter === "medium" ? "active" : ""}`}
            onClick={() =>
              setFilter(filter === "medium" ? "all" : "medium")
            }
          >
            Medium
          </button>

          <button
            className={`btn high ${filter === "high" ? "active" : ""}`}
            onClick={() =>
              setFilter(filter === "high" ? "all" : "high")
            }
          >
            High
          </button>

          {/* 🔥 NEW SORT BUTTON */}
          <button
            className={`btn sort ${sortByDate ? "active" : ""}`}
            onClick={() => setSortByDate(!sortByDate)}
          >
            Sort by Date
          </button>

        </div>

        {editTask && (
          <EditTaskModal
            task={editTask}
            onClose={() => setEditTask(null)}
            onSave={loadTasks}
          />
        )}

        <div className="tasks-list">
          {finalTasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            finalTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onDelete={async (id) => {
                  await deleteTask(id);
                  loadTasks();
                }}
                onComplete={async (id) => {
                  await completeTask(id);
                  loadTasks();
                }}
                onEdit={(t) => setEditTask(t)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}