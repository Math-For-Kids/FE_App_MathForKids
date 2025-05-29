import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../api/api";

// Lấy thông tin người
export const getAllUser = createAsyncThunk(
  "profile/fetchAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/user");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
// Đăng ký user mới
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await Api.post("/user", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Cập nhật user
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/user/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Gửi OTP qua số điện thoại
export const sendOTPByPhone = createAsyncThunk(
  "auth/sendOTPByPhone",
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const res = await Api.post(`/auth/sendOTPByPhoneNumber/${phoneNumber}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Gửi OTP qua email
export const sendOTPByEmail = createAsyncThunk(
  "auth/sendOTPByEmail",
  async (email, { rejectWithValue }) => {
    try {
      const res = await Api.post(`/auth/sendOTPByEmail/${email}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Sửa verifyOTP để lấy fullname và image
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ userId, otpCode }, { rejectWithValue }) => {
    try {
      const res = await Api.post(`/auth/verify/${userId}`, { otpCode });
      const { id, role, token, fullName, image } = res.data; // lấy thêm fullname, image
      return { id, role, token, fullName, image };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice chính
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    list: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = {
        id: action.payload.id,
        role: action.payload.role,
        token: action.payload.token || null,
        fullName: action.payload.fullName || "",
        image: action.payload.image || "",
      };
    },
    logout: (state) => {
      state.user = null;
      AsyncStorage.removeItem("userId");
      AsyncStorage.removeItem("userRole");
    },
  },
  extraReducers: (builder) => {
    builder
      // User list
      .addCase(getAllUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Gửi OTP Phone
      .addCase(sendOTPByPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTPByPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          id: action.payload.userId,
        };
      })
      .addCase(sendOTPByPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Gửi OTP Email
      .addCase(sendOTPByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTPByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          id: action.payload.userId,
        };
      })
      .addCase(sendOTPByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Xác minh OTP (đã fix fullname/image)
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.id,
          role: action.payload.role,
          token: action.payload.token,
          fullName: action.payload.fullName || "",
          image: action.payload.image || "",
        };
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
