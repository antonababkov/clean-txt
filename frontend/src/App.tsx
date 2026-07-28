import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchMe } from "./store/slices/authSlice";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import NewTask from "./pages/NewTask";
import History from "./pages/History";

import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/common/Navbar";
import NotFound404 from "./pages/NotFound404";

import TasksList from "./components/admin/TasksList";
import AdminRoute from "./components/admin/AdminRoute";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    document.documentElement.className = theme;
  }, []);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchMe());
    }
  }, [accessToken, dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mx-auto mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/new"
            element={
              <PrivateRoute>
                <NewTask />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/tasks"
            element={
              <AdminRoute>
                <TasksList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
