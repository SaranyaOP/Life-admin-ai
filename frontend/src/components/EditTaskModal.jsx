import { useState, useEffect } from "react";
import { updateTask } from "../api/api";
import toast from "react-hot-toast";

export default function EditTaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState(task);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(task);
  }, [task]);

  if (!task) return null;

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };


  const formatDateTimeLocal = (date) => {
  if (!date) return "";
  return date.slice(0, 16);
};
  // 🔥 VALIDATION
  const validate = () => {
    if (!form.title || form.title.trim() === "") {
      toast.error("Title is required");
      return false;
    }

    if (form.due_date && isNaN(new Date(form.due_date))) {
      toast.error("Invalid date");
      return false;
    }

    return true;
  };

const handleSave = async () => {
  if (!validate()) return;

  try {
    setLoading(true);

    const formattedData = {
      ...form,
      due_date: form.due_date
        ? new Date(form.due_date).toISOString()
        : null,
    };

    await updateTask(task.id, formattedData);

    toast.success("Task updated successfully");
    onSave();
    onClose();
  } catch (err) {
    toast.error("Update failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>Edit Task</h2>

        <input
          value={form.title}
          onChange={(e) =>
            handleChange("title", e.target.value)
          }
          placeholder="Title"
          className="modal-input"
        />

        <textarea
          value={form.description || ""}
          onChange={(e) =>
            handleChange("description", e.target.value)
          }
          placeholder="Description"
           className="modal-input"
        />

        <input
          type="datetime-local"
            value={formatDateTimeLocal(form.due_date)}
          onChange={(e) =>
            handleChange("due_date", e.target.value)
             
          }
          className="modal-input"
        />

        <select
          value={form.priority}
          onChange={(e) =>
            handleChange("priority", e.target.value)
          }
          className="modal-input"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="modal-actions">
          <button onClick={handleSave} disabled={loading} className="preview-save-btn">
            {loading ? "Saving..." : "Save"}
          </button>

          <button onClick={onClose} className="preview-remove-btn">Cancel</button>
        </div>

      </div>
    </div>
  );
}