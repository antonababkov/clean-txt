import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

interface Task {
  id: number;
  original_text: string;
  cleaned_text: string;
  created_at: string;
}

interface TasksState {
  tasks: Task[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  total: 0,
  loading: false,
  error: null,
};

export const createTask = createAsyncThunk(
  "tasks/create",
  async (originalText: string) => {
    const res = await api.post("/tasks", { originalText });
    return res.data;
  },
);

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async ({ limit = 10, offset = 0 }: { limit: number; offset: number }) => {
    const res = await api.get(`/tasks?limit=${limit}&offset=${offset}`);
    return res.data;
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: number) => {
    await api.delete(`/tasks/${id}`);
    return id;
  },
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, originalText }: { id: number; originalText: string }) => {
    const res = await api.put(`/tasks/${id}`, { originalText });
    return res.data;
  },
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка создания";
      })
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.total = action.payload.total;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.total -= 1;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      });
  },
});

export default taskSlice.reducer;
