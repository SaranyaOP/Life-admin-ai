import { saveTasks } from "../api/api";
import { formatDate } from '../utils/utils';
import { convertToIsoFormat } from '../utils/utils';
import toast from "react-hot-toast";

export default function Preview({ tasks, setTasks, refreshTasks }) {
  const handleSave = async () => {
    await saveTasks(tasks);
    toast.success("Tasks saved successfully!");
    setTasks([]);
    refreshTasks();
  };

  const updateTask = (i, field, value) => {
    const updated = [...tasks];
    updated[i][field] = value;
    setTasks(updated);
  };

  const removeTask = (i) => {
    setTasks(tasks.filter((_, index) => index !== i));
  };

  return (
    <div className="preview-page">
      <h2 className="title">Preview Tasks</h2>

   <div className="section">
    <div className="preview-task-list">
       {tasks.map((t, i) => (
        <div key={i} className="task">
          <input
            value={t.title}
            onChange={(e) =>
              updateTask(i, "title", e.target.value)
            }
            placeholder="enter title"
            className="preview-input"
          />

          <input
            value={t.description || ""}
            onChange={(e) =>
              updateTask(i, "description", e.target.value)
            }
            placeholder="enter description"
             className="preview-input"
          />

          <input
            value={formatDate(t.due_date) || ""}
            onChange={(e) =>
              updateTask(i, "due_date", convertToIsoFormat(e.target.value))
            }
            placeholder="enter due date (YYYY-MM-DDTHH:mm:ss)"
             className="preview-input"
          />

          
          <button
            className="preview-remove-btn"
            onClick={() => removeTask(i)}
          >
            Remove
          </button>
        </div>
      ))}
</div>
      <button
        className="preview-save-btn"
        onClick={handleSave}
      >
        Save All
      </button>
   </div>
    </div>
  );
}