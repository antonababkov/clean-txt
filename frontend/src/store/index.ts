import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import taskReducer from "./slices/taskSlice";
import statsReducer from "./slices/statsSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    stats: statsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
