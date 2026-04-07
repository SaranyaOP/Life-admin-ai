export default function Sidebar({ setActivePage }) {
  return (
    <div className="sidebar">
      <h2>Menu</h2>

      <button onClick={() => setActivePage("overview")}>
        Overview
      </button>

      <button onClick={() => setActivePage("generate")}>
        Generate Tasks
      </button>

      <button onClick={() => setActivePage("tasks")}>
        All Tasks
      </button>

      <button onClick={() => setActivePage("calendar")}>
        Calendar
      </button>
    </div>
  );
}