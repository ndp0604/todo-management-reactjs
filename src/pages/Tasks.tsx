import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import type { Task, UserMinimal } from "../types/task";
import { useNavigate } from "react-router-dom"; // Import để dùng menu chuyển trang
import '../styles/tasks.css';
import '../styles/dashboard.css'; // Import đè style của sidebar để đồng bộ giao diện

export default function Tasks() {
  const navigate = useNavigate();
  const currentProjectId = 1; 

  const [members] = useState<UserMinimal[]>([
    { UserId: 1, Username: 'Nguyen Phuong Nam' },
    { UserId: 2, Username: 'Nguyen Van A' },
    { UserId: 3, Username: 'Tran Thi B' }
  ]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<number>(1);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasksByProject(currentProjectId);
      // Đảm bảo data trả về là mảng thì mới set vào state
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Vui lòng nhập tiêu đề công việc!");

    try {
      await taskService.createTask({
        Title: title,
        Description: description || null,
        ProjectId: currentProjectId,
        AssignedTo: Number(assignedTo)
      });
      setTitle('');
      setDescription('');
      fetchTasks(); 
    } catch (error) {
      alert("Tạo công việc thất bại!");
    }
  };

  const handleUpdateStatus = async (taskId: number, task: Task, nextStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    try {
      await taskService.updateTask(taskId, {
        Title: task.Title,
        Description: task.Description,
        AssignedTo: task.AssignedTo,
        Status: nextStatus
      });
      fetchTasks();
    } catch (error) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa công việc này không?")) {
      try {
        await taskService.deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        alert("Xóa công việc thất bại!");
      }
    }
  };

  return (
    <div className="dashboard"> {/* Đồng bộ wrapper giống Dashboard */}
      {/* Sidebar đồng bộ giữ nguyên menu bên trái */}
      <aside className="sidebar">
        <div className="logo" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          🚀 TaskFlow
        </div>
        <ul className="menu">
          <li onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            📊 Dashboard
          </li>
          <li style={{ cursor: "pointer" }}>📁 Projects</li>
          <li className="active" onClick={() => navigate("/tasks")} style={{ cursor: "pointer" }}>
            ✅ Tasks
          </li>
          <li style={{ cursor: "pointer" }}>👥 Team</li>
          <li style={{ cursor: "pointer" }}>📅 Calendar</li>
          <li style={{ cursor: "pointer" }}>⚙ Settings</li>
        </ul>
        <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = "/"; }}>
          Logout
        </button>
      </aside>

      {/* Main Content của trang Tasks */}
      <main className="content" style={{ padding: '20px', overflowY: 'auto' }}>
        <div className="tasks-page-container">
          <div className="tasks-header">
            <div>
              <h2>📋 Quản Lý Công Việc (Task Management)</h2>
              <p className="subtitle">Tạo, phân công và theo dõi tiến độ các công việc trong dự án.</p>
            </div>
          </div>

          {/* FORM TẠO VÀ PHÂN CÔNG CÔNG VIỆC */}
          <div className="task-creation-card">
            <h3>➕ Thêm Công Việc & Giao Việc</h3>
            <form onSubmit={handleCreateTask} className="task-creation-form">
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Tiêu đề công việc..." 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Mô tả ngắn..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>
              <div className="form-group select-group">
                <label>Giao cho:</label>
                <select value={assignedTo} onChange={(e) => setAssignedTo(Number(e.target.value))}>
                  {members.map(member => (
                    <option key={member.UserId} value={member.UserId}>{member.Username}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-submit-task">Tạo & Phân Công</button>
            </form>
          </div>

          {/* KANBAN BOARD THEO DÕI TIẾN ĐỘ */}
          <div className="kanban-view">
            {/* CỘT TODO */}
            <div className="kanban-col todo-col">
              <div className="col-title">📌 CẦN LÀM ({tasks.filter(t => t.Status === 'TODO').length})</div>
              <div className="cards-holder">
                {tasks.filter(t => t.Status === 'TODO').map(task => (
                  <div key={task.TaskId} className="kanban-card">
                    <h4>{task.Title}</h4>
                    <p>{task.Description || 'Không có mô tả.'}</p>
                    <div className="assignee">👤 Người làm: <b>{task.AssignedUserName || 'Chưa gán'}</b></div>
                    <div className="card-actions">
                      <button className="btn-status-next" onClick={() => handleUpdateStatus(task.TaskId, task, 'IN_PROGRESS')}>Bắt đầu ➡️</button>
                      <button className="btn-task-delete" onClick={() => handleDeleteTask(task.TaskId)}>Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CỘT IN PROGRESS */}
            <div className="kanban-col progress-col">
              <div className="col-title">⚡ ĐANG THỰC HIỆN ({tasks.filter(t => t.Status === 'IN_PROGRESS').length})</div>
              <div className="cards-holder">
                {tasks.filter(t => t.Status === 'IN_PROGRESS').map(task => (
                  <div key={task.TaskId} className="kanban-card">
                    <h4>{task.Title}</h4>
                    <p>{task.Description || 'Không có mô tả.'}</p>
                    <div className="assignee">👤 Người làm: <b>{task.AssignedUserName || 'Chưa gán'}</b></div>
                    <div className="card-actions">
                      <button className="btn-status-back" onClick={() => handleUpdateStatus(task.TaskId, task, 'TODO')}>⬅️ Hoãn</button>
                      <button className="btn-status-next" onClick={() => handleUpdateStatus(task.TaskId, task, 'DONE')}>Xong ➡️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CỘT DONE */}
            <div className="kanban-col done-col">
              <div className="col-title">✅ HOÀN THÀNH ({tasks.filter(t => t.Status === 'DONE').length})</div>
              <div className="cards-holder">
                {tasks.filter(t => t.Status === 'DONE').map(task => (
                  <div key={task.TaskId} className="kanban-card done-state">
                    <h4>{task.Title}</h4>
                    <p>{task.Description || 'Không có mô tả.'}</p>
                    <div className="assignee">👤 Người làm: <b>{task.AssignedUserName || 'Chưa gán'}</b></div>
                    <div className="card-actions">
                      <button className="btn-status-back" onClick={() => handleUpdateStatus(task.TaskId, task, 'IN_PROGRESS')}>⬅️ Sửa lại</button>
                      <button className="btn-task-delete" onClick={() => handleDeleteTask(task.TaskId)}>Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}