import { useState } from "react";
import AIInput from "./AIInput";
import Preview from "./Preview";

export default function Generate({ refreshTasks }) {
  const [previewTasks, setPreviewTasks] = useState([]);

  return (
    <div className="generate-page">
      <AIInput setPreview={setPreviewTasks} />

      {previewTasks.length > 0 && (
        <Preview
          tasks={previewTasks}
          setTasks={setPreviewTasks}
          refreshTasks={refreshTasks}
        />
      )}
    </div>
  );
}