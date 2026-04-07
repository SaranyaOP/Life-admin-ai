import { FaTrash, FaCheck, FaEdit } from "react-icons/fa";
import { formatDate } from "../utils/utils";

export default function TaskCard({ task, onDelete, onComplete, onEdit }) {

  const getPriorityClass = (priority) => {
    return `priority ${priority || ""}`;
  };

  return (
    <div className={`task-card ${task.completed ? "completed" : "pending"}`}>

      {/* HEADER */}
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>

        <span className={getPriorityClass(task.priority)}>
          {task.priority}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="task-desc">{task.description}</p>

      {/* DATE */}
      <p className="task-date">{formatDate(task.due_date)}</p>

      {/* ACTIONS */}
      <div className="task-actions">
        <button onClick={() => onComplete(task.id)} disabled={task.completed}>
          <FaCheck />
        </button>

        <button onClick={() => onEdit(task)} title="Edit" disabled={task.completed}>
          <FaEdit />
        </button>

        <button onClick={() => onDelete(task.id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
}