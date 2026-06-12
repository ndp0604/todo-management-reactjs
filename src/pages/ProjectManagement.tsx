import React, { useState } from "react";
import Board from "../components/Board";
import "../styles/project.css";

const ProjectManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="pm-page">
      <header className="pm-header">
        <div className="pm-header-left">
          <h1>Project Management</h1>
          <p className="subtitle">Board view — lightweight Jira-like experience</p>
        </div>

        <div className="pm-header-actions">
          <input
            className="pm-search"
            placeholder="Search board"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="pm-main">
        <Board searchTerm={searchTerm} />
      </main>
    </div>
  );
};

export default ProjectManagement;
