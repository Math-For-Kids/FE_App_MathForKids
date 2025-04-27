// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./homeSlice";

export const store = configureStore({
  reducer: {
    homeData: homeSlice,
  },
});
