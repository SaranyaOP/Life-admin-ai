import { useState } from "react";
import "./dashboard.css";
import "./App.css";
import { Toaster } from "react-hot-toast";

import Sidebar from "./components/Sidebar";
import Banner from "./components/Banner";

import Overview from "./pages/Overview";
import Generate from "./pages/Generate";
import Tasks from "./pages/Tasks";
import CalendarView from "./pages/CalendarView";

function App() {
  const [activePage, setActivePage] = useState("overview");
  const [refresh, setRefresh] = useState(0);

  const refreshTasks = () => {
    setRefresh((prev) => prev + 1);
  };

  const renderPage = () => {
    switch (activePage) {
      case "generate":
        return <Generate refreshTasks={refreshTasks} />;
      case "tasks":
        return <Tasks refreshTrigger={refresh} />;
      case "calendar":
        return <CalendarView />;
      default:
        return <Overview refreshTrigger={refresh} />;
    }
  };

  return (
    <div className="dashboard">
       <Toaster position="top-right" />
      <Sidebar setActivePage={setActivePage} />
      
      <div className="main">
        <Banner />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;