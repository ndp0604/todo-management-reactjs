import axios from "axios";
import type { Task } from "../types/task";

const API_URL = "http://localhost:5000/api/tasks";

export const taskService = {
  // Lấy danh sách task theo project
  getTasksByProject: async (projectId: number): Promise<Task[]> => {
    const response = await axios.get(`${API_URL}/project/${projectId}`);
    return response.data;
  },

  // Tạo task mới
  createTask: async (task: {
    Title: string;
    Description?: string | null;
    ProjectId: number;
    AssignedTo?: number;
  }): Promise<Task> => {
    const response = await axios.post(API_URL, task);
    return response.data;
  },

  // Cập nhật task
  updateTask: async (
    taskId: number,
    task: Partial<Task>
  ): Promise<Task> => {
    const response = await axios.put(`${API_URL}/${taskId}`, task);
    return response.data;
  },

  // Xóa task
  deleteTask: async (taskId: number): Promise<void> => {
    await axios.delete(`${API_URL}/${taskId}`);
  },
};