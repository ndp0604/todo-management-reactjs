import axios from "axios";

export const getDashboard =
(userId:number) => {

  return axios.get(
    `http://localhost:5000/api/dashboard/${userId}`
  );

};