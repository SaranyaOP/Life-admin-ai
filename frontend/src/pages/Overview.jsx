import { useEffect, useState } from "react";
import { getTasks } from "../api/api";
import { formatDate } from "../utils/utils";

export default function Overview() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(null); // 👈 MAIN CONTROL

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  const getTodayDate = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const today = getTodayDate();

  // 🔢 stats
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const high = tasks.filter(t => t.priority === "high").length;

  // 🔥 FILTER LOGIC
  const getFilteredTasks = () => {
    switch (filter) {
      case "completed":
        return tasks.filter(t => t.completed);
      case "pending":
        return tasks.filter(t => !t.completed);
      case "high priority":
        return tasks.filter(t => t.priority === "high");
      case "today":
        return tasks.filter(t => t.due_date?.startsWith(today));
      case "total":
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="overview-page">
      <h2 className="title">Dashboard Overview</h2>

      {/* 🔥 STATS */}
      <div className="stats-grid">

        <div className="card total" onClick={() => setFilter("total")}>
          <h3>Total</h3>
          <p>{total}</p>
        </div>

        <div className="card pending" onClick={() => setFilter("pending")}>
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>

        <div className="card completed" onClick={() => setFilter("completed")}>
          <h3>Completed</h3>
          <p>{completed}</p>
        </div>

        <div className="card high" onClick={() => setFilter("high priority")}>
          <h3>High Priority</h3>
          <p>{high}</p>
        </div>

        <div className="card today" onClick={() => setFilter("today")}>
          <h3>Today Tasks</h3>
          <p>{tasks.filter(t => t.due_date?.startsWith(today)).length}</p>
        </div>

      </div>

      {/* 🔥 REUSABLE TASK LIST */}
      {filter && (
        <div className="task-list-container">
          <h3 className="list-title">
            {filter.toUpperCase()} TASKS
          </h3>

          {filteredTasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            <div className="task-lists">
              {filteredTasks.map((t) => (
                <div key={t.id} className="task-card-small">
                  <h4  className="task-title">{t.title}</h4>
                  < p className="task-desc">{t.description}</p>
                  < span className="task-date">{formatDate(t.due_date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}