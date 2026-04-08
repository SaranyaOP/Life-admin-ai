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

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "";

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const normalizeApiDate = (dateString) => {
    if (!dateString) return null;

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
      return `${dateString}:00`;
    }

    const match = dateString.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    return match ? match[1] : dateString;
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
        due_date: normalizeApiDate(form.due_date),
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