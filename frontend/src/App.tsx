import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import { useAppSelector } from "./store/hooks";
import { Toaster, toast } from "react-hot-toast";

import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/common/Navbar";
import NotFound404 from "./pages/NotFound404";
import AuthLoader from "./components/common/AuthLoader";
import AdminRoute from "./components/admin/AdminRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NewTask = lazy(() => import("./pages/NewTask"));
const History = lazy(() => import("./pages/History"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const TasksList = lazy(() => import("./components/admin/TasksList"));

function App() {
  const token = useAppSelector((state) => state.auth.accessToken);
  const wsUrl = import.meta.env.VITE_WS_URL;
  const { messages } = useWebSocket(wsUrl, token);

  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.type === "TASK_CREATED") {
        toast.success(`Новая задача очищена! ID: ${last.task.id}`);
      }
    }
  }, [messages]);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    document.documentElement.className = theme;
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="min-h-screen text-gray-900 transition-colors duration-300 bg-neutral-100 dark:bg-gray-900 dark:text-gray-100">
        <AuthLoader>
          <Navbar />
          <div className="container px-2 pb-4 mx-auto mt-4">
            <Suspense fallback={<LoadingSpinner />}>
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
            </Suspense>
          </div>
        </AuthLoader>
      </div>
    </BrowserRouter>
  );
}

export default App;
