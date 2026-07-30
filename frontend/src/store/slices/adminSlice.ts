import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

interface AdminTask {
  id: number;
  user_id: number;
  email: string;
  original_text: string;
  cleaned_text: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  email: string;
  role: string;
}

interface AdminState {
  tasks: AdminTask[];
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  tasks: [],
  users: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchAdminTasks = createAsyncThunk(
  "admin/fetchTasks",
  async (filters: {
    userId?: string | undefined;
    days?: string | undefined;
    limit?: number;
    offset?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.days) params.append("days", filters.days);
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.offset) params.append("offset", String(filters.offset));
    const res = await api.get(`/admin/tasks?${params.toString()}`);
    return res.data; // { tasks, total, limit, offset }
  },
);

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const res = await api.get("/admin/users");
  return res.data; // User[]
});

export const deleteTask = createAsyncThunk(
  "admin/deleteTask",
  async (id: number) => {
    await api.delete(`/tasks/${id}`);
    return id;
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.total = action.payload.total;
      })
      .addCase(fetchAdminTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки задач";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.total -= 1;
      });
  },
});

export default adminSlice.reducer;
