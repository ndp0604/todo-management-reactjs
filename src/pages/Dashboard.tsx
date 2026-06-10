import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { getDashboard } from "../services/dashboardService";

function Dashboard() {
  const [dashboardData, setDashboardData] =
    useState<any>(null);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getDashboard(
        user.UserId || user.userId || 1
      );

      setDashboardData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          🚀 TaskFlow
        </div>

        <ul className="menu">
          <li className="active">
            📊 Dashboard
          </li>

          <li>📁 Projects</li>

          <li>✅ Tasks</li>

          <li>👥 Team</li>

          <li>📅 Calendar</li>

          <li>⚙ Settings</li>
        </ul>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="content">
        <header className="topbar">
          <input
            className="search"
            placeholder="Search..."
          />

          <div className="user-box">
            👤 {user.fullName || "User"}
          </div>
        </header>

        <section className="welcome">
          <h1>
            Welcome back 👋
          </h1>

          <p>
            Manage your projects and tasks
            efficiently.
          </p>
        </section>

        {/* Stats */}
        <section className="stats">
          <div className="card">
            <h2>
              {dashboardData?.totalTasks || 0}
            </h2>
            <p>Total Tasks</p>
          </div>

          <div className="card">
            <h2>
              {dashboardData?.completedTasks ||
                0}
            </h2>
            <p>Completed</p>
          </div>

          <div className="card">
            <h2>
              {dashboardData?.totalProjects ||
                0}
            </h2>
            <p>Projects</p>
          </div>

          <div className="card">
            <h2>
              {dashboardData?.inProgressTasks ||
                0}
            </h2>
            <p>In Progress</p>
          </div>
        </section>

        {/* Grid */}
        <section className="grid">
          <div className="panel">
            <h3>
              📁 Recent Projects
            </h3>

            {dashboardData?.recentProjects
              ?.length > 0 ? (
              dashboardData.recentProjects.map(
                (project: any) => (
                  <div
                    key={project.ProjectId}
                    className="project"
                  >
                    {project.ProjectName}
                  </div>
                )
              )
            ) : (
              <p>
                Chưa có dự án nào
              </p>
            )}
          </div>

          <div className="panel">
            <h3>
              ✅ Recent Tasks
            </h3>

            {dashboardData?.recentTasks
              ?.length > 0 ? (
              dashboardData.recentTasks.map(
                (task: any) => (
                  <div
                    key={task.TaskId}
                    className="task"
                  >
                    {task.Title}
                  </div>
                )
              )
            ) : (
              <p>
                Chưa có công việc nào
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;