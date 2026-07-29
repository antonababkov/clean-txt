import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

interface StatsState {
  daily: Array<{ date: string; count: number; day: string }>;
  hourly: Array<{ hour: number; count: number }>;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  daily: [],
  hourly: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchDailyStats = createAsyncThunk(
  "stats/fetchDaily",
  async (days: number = 7) => {
    const res = await api.get(`/stats/daily?days=${days}`);
    return res.data;
  },
);

export const fetchHourlyStats = createAsyncThunk(
  "stats/fetchHourly",
  async (date?: string) => {
    const url = date ? `/stats/hourly?date=${date}` : "/stats/hourly";
    const res = await api.get(url);
    return res.data;
  },
);

export const fetchTotalCount = createAsyncThunk(
  "stats/fetchTotal",
  async () => {
    const res = await api.get("/stats/total");
    return res.data.total;
  },
);

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDailyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.daily = action.payload;
      })
      .addCase(fetchDailyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки статистики";
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
        state.error =
          action.error.message || "Ошибка загрузки почасовой статистики";
      })
      .addCase(fetchTotalCount.fulfilled, (state, action) => {
        state.total = action.payload;
      });
  },
});

export default statsSlice.reducer;
