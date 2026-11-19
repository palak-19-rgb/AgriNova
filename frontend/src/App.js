
import React, { useState } from "react";
import ChatbotWidget from "./components/ChatbotWidget";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import SoilIntelligence from "./pages/SoilIntelligence";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Sensors from "./pages/Sensors";
import Auth from "./pages/Auth";
import GreenhouseSettings from "./pages/GreenhouseSettings";
import CropDoctor from "./pages/CropDoctor";
function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("agrinova_token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("agrinova_user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState("dashboard");

const handleLogin = (userData, authToken) => {
  localStorage.setItem("agrinova_token", authToken);
  localStorage.setItem(
    "agrinova_user",
    JSON.stringify(userData)
  );

  setToken(authToken);
  setUser(userData);
  setActivePage("dashboard");
};

  const handleLogout = () => {
    localStorage.removeItem("agrinova_token");
    localStorage.removeItem("agrinova_user");
    setToken(null);
    setUser(null);
    setActivePage("dashboard");
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  const pageConfig = {
    dashboard: {
      title: "Dashboard",
      subtitle: "A live overview of your smart greenhouse.",
    },
    soil: {
      title: "Soil Intelligence",
      subtitle: "Understand your soil and make smarter irrigation decisions.",
    },
    analytics: {
      title: "Greenhouse Analytics",
      subtitle: "Explore environmental trends and greenhouse performance.",
    },
    alerts: {
      title: "Alerts & Recommendations",
      subtitle: "Stay informed about important greenhouse conditions.",
    },
    sensors: {
      title: "Sensor Network",
      subtitle: "Monitor connected sensors and system health.",
    },
    cropDoctor: {
  title: "Crop Doctor",
  subtitle: "Detect possible crop diseases and pests with AI-powered image analysis.",
},
    settings: {
  title: "Greenhouse Settings",
  subtitle: "Manage your greenhouse and crop preferences.",
},

  };

  const currentPage =
    pageConfig[activePage] || pageConfig.dashboard;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "soil":
        return <SoilIntelligence />;
      case "analytics":
        return <Analytics />;
      case "alerts":
        return <Alerts />;
      case "sensors":
        return <Sensors />;
        case "cropDoctor":
  return <CropDoctor />;
        case "settings":
return <GreenhouseSettings user={user} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="app-main">
        <div className="app-content">

          <div className="app-topbar-row">
            <Topbar
              title={currentPage.title}
              subtitle={currentPage.subtitle}
            />

            <div className="user-actions">
              <span className="welcome-user">
                Welcome, {
                  user?.name ||
                  user?.fullName ||
                  user?.email ||
                  "Grower"
                }
              </span>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          </div>

          <div
            key={activePage}
            className="page-container"
          >
            {renderPage()}
          </div>

        </div>
      </main>
   <ChatbotWidget />
      <style>{`
        #root {
          min-height: 100vh;
        }

        .app {
          min-height: 100vh;
          width: 100%;
          background: var(--cream);
        }

        .app-main {
          min-height: 100vh;
          width: calc(100% - 255px);
          margin-left: 255px;
          padding: 26px 30px 40px;
        }

        .app-content {
          width: 100%;
          max-width: 1550px;
          margin: 0 auto;
        }

        .app-topbar-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .welcome-user {
          color: var(--forest);
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .logout-button {
          padding: 10px 16px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: white;
          color: var(--forest);
          font-weight: 700;
          cursor: pointer;
        }

        .logout-button:hover {
          background: var(--mint);
        }

        .page-container {
          width: 100%;
          animation: pageEnter 0.4s ease both;
        }

        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1100px) {
          .app-main {
            padding: 22px 22px 35px;
          }
        }

        @media (max-width: 900px) {
          .app-main {
            width: 100%;
            margin-left: 0;
            padding: 20px 20px 32px;
          }
        }

        @media (max-width: 600px) {
          .app-main {
            padding: 15px 15px 28px;
          }

          .app-topbar-row {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .user-actions {
            flex-wrap: wrap;
          }

          .welcome-user {
            font-size: 0.72rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .page-container {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default App;