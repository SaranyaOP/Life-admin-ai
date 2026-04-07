import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect, use } from "react";
import { getTasks } from "../api/api";

export default function CalendarView() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };


 const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const selected = formatLocalDate(date);

const filtered = tasks.filter((t) =>
  t.due_date?.startsWith(selected)
);


  return (
    <div className="calender-page">
       <h2 className="title">Calendar</h2>
      <div className="section">
 
  <div className="calender-content">
      <div className="calendar-wrapper">
    <Calendar onChange={setDate} value={date} />
  </div>

  <div className="calender-tasks">
    <h3 className="subtitle">Tasks on {selected}</h3>

  {filtered.length === 0 ? (
    <p className="no-tasks">No tasks for this date</p>
  ) : (
    <ol className="task-list">
      {filtered.map((t) => (
        <li key={t.id} className="task-item">
          <div className="task-header">
            <span className="task-title">{t.title}</span>

            <span className={`priority ${t.priority}`}>
              {t.priority}
            </span>
          </div>

          <div className="task-meta">
            {t.completed ? "✅ Completed" : "❌ Pending"}
          </div>
        </li>
      ))}
    </ol>
  )}
  </div>
  </div>


</div>
    </div>

  );
}