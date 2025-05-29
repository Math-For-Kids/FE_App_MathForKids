// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "./authSlice";
import pupilReducer from "./pupilSlice";
import userNotificationReducer from "./userNotificationSlice";
import pupilNotificationReducer from "./pupilNotificationSlice";
import profileReducer from "./profileSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  pupil: pupilReducer,
  notifications: userNotificationReducer,
  pupilnotifications: pupilNotificationReducer,
  profile: profileReducer,
  // thêm các reducer khác nếu cần
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "pupil", "userNotification"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat((store) => (next) => (action) => {
      if (action.type === "persist/REHYDRATE") {
        console.log(" Redux rehydrated!");
      }
      return next(action);
    }),
});

export const persistor = persistStore(store);
