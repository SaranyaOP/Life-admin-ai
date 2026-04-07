import { useState } from "react";
import { previewTasks } from "../api/api";
import toast from "react-hot-toast";

export default function AIInput({ setPreview }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false); // 👈 ADD THIS

  const handleGenerate = async () => {
    if (!text) return toast.error("Enter something");

    try {
      setLoading(true); 

      const res = await previewTasks(text);
      setPreview(res.data.tasks || []);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setText(""); // optional: clear input after generation
      setLoading(false); // 👈 STOP LOADING
    }
  };

  return (
    <div className="ai-input-page">
      <h2 className="title">Tell me what you want to plan?</h2>

      <div className="section">
        <div className="instructions">
          <div className="instructions-title">
            Enter tasks in natural language
          </div>

          <div className="instructions-section examples">
            <strong>Examples:</strong>
            <ul>
              <li>"Meeting tomorrow at 10am"</li>
              <li>"Call client at 5pm and send report tonight"</li>
              <li>"Prepare for interview next friday"</li>
              <li>"Buy groceries this weekend"</li>
            </ul>
          </div>

          <div className="instructions-section tips">
            <strong>Tips:</strong>
            <ul>
              <li>Mention time (10am, 5pm) for better scheduling</li>
              <li>Use words like today, tomorrow, next week</li>
              <li>You can enter multiple tasks in one sentence</li>
            </ul>
          </div>
        </div>

        <textarea
          rows={4}
          className="ai-iput-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading} // optional UX improvement
        />

        <button
          className="ai-input-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Tasks"}
        </button>
      </div>
    </div>
  );
}