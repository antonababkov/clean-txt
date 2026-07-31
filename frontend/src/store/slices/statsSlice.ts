import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

interface StatsState {
  daily: { day: string; count: number }[];
  hourly: { hour: number; count: number }[];
  adminDaily: { day: string; count: number }[];
  adminHourly: { hour: number; count: number }[];
  loading: boolean;
  adminLoading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  daily: [],
  hourly: [],
  adminDaily: [],
  adminHourly: [],
  loading: false,
  adminLoading: false,
  error: null,
};

export const fetchDailyStats = createAsyncThunk(
  "stats/fetchDaily",
  async (days: number) => {
    const res = await api.get(`/stats/daily?days=${days}`);
    return res.data;
  },
);

export const fetchHourlyStats = createAsyncThunk(
  "stats/fetchHourly",
  async () => {
    const res = await api.get("/stats/hourly");
    return res.data;
  },
);

// Административные thunk'и
export const fetchAdminDailyStats = createAsyncThunk(
  "stats/fetchAdminDaily",
  async (days: number) => {
    const res = await api.get(`/admin/stats/daily?days=${days}`);
    return res.data;
  },
);

export const fetchAdminHourlyStats = createAsyncThunk(
  "stats/fetchAdminHourly",
  async () => {
    const res = await api.get("/admin/stats/hourly");
    return res.data;
  },
);

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Пользовательская статистика
      .addCase(fetchDailyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.daily = action.payload;
      })
      .addCase(fetchDailyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки";
      })
      .addCase(fetchHourlyStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHourlyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.hourly = action.payload;
      })
      .addCase(fetchHourlyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки";
      })
      // Административная статистика
      .addCase(fetchAdminDailyStats.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(fetchAdminDailyStats.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminDaily = action.payload;
      })
      .addCase(fetchAdminDailyStats.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.error.message || "Ошибка загрузки";
      })
      .addCase(fetchAdminHourlyStats.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(fetchAdminHourlyStats.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminHourly = action.payload;
      })
      .addCase(fetchAdminHourlyStats.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.error.message || "Ошибка загрузки";
      });
  },
});

export default statsSlice.reducer;
