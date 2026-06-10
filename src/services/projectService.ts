import axios from "axios";

const API =
  "http://localhost:5000/api/projects";

export const getProjects = (
  userId: number
) => {
  return axios.get(`${API}/${userId}`);
};