import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const register = async (
  fullName: string,
  email: string,
  password: string
) => {
  return axios.post(`${API_URL}/register`, {
    fullName,
    email,
    password,
  });
};

export const login = async (
  email: string,
  password: string
) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password,
  });
};