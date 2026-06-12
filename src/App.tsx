import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// 1. Import trang Tasks mới vào đây
import Tasks from "./pages/Tasks"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* 2. Thêm Route cho trang quản lý Task */}
        <Route
          path="/tasks"
          element={<Tasks />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;