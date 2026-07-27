import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data; // { user, accessToken }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await api.post("/auth/register", { email, password });
    return res.data;
  },
);

export const fetchMe = createAsyncThunk("auth/me", async (_, { getState }) => {
  const res = await api.get("/auth/me");
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("accessToken");
      // опционально: вызвать api.post('/auth/logout') для очистки cookie
      api.post("/auth/logout").catch(() => {});
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка входа";
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка регистрации";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      });
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
