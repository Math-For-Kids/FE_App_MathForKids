import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

//getAll
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
// Get user by userId
export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/user/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Tạo người dùng mới
export const createUser = createAsyncThunk(
  "auth/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await Api.post("/user", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Gửi OTP qua số điện thoại
export const sendOTPByPhone = createAsyncThunk(
  "auth/sendOTPByPhone",
  async ({ userId, phoneNumber, role = "user" }, { rejectWithValue }) => {
    try {
      const res = await Api.post(
        `/auth/sendOtpByPhone/${phoneNumber}/${role}`,
        {},
        {
          headers: { Authorization: userId },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Gửi OTP qua email
export const sendOTPByEmail = createAsyncThunk(
  "auth/sendOTPByEmail",
  async ({ userId, email, role = "user" }, { rejectWithValue }) => {
    try {
      const res = await Api.post(
        `/auth/sendOtpByEmail/${email}/${role}`,
        {},
        {
          headers: { Authorization: userId },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Xác minh OTP
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ userId, otpCode }, { rejectWithValue }) => {
    try {
      const res = await Api.post(`/auth/verifyAndAuthentication/${userId}`, {
        otpCode,
      });

      const {
        token,
        id,
        fullName,
        role,
        image,
        volume,
        language,
        mode,
        pin,
        pupilId, // nếu có
      } = res.data;

      return {
        token,
        id,
        fullName,
        role,
        image,
        volume,
        language,
        mode,
        pin,
        pupilId,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Cập nhật thông tin người dùng
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await Api.patch(`/user/updateProfile/${id}`, data);
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    pupilId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setPupilId: (state, action) => {
      if (state.user) {
        state.user.pupilId = action.payload;
      }
    },

    logout: (state) => {
      state.user = null;
      state.pupilId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          ...action.payload,
        };
        if (action.payload.pupilId) {
          state.pupilId = action.payload.pupilId;
        }
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.id,
          phoneNumber: action.payload.phoneNumber,
          role: action.payload.role,
        };
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
          fullName: action.payload.fullName,
          image: action.payload.image || "",
          volume: action.payload.volume,
          language: action.payload.language,
          mode: action.payload.mode,
          pin: action.payload.pin,
          pupilId: action.payload.pupilId,
        };
        if (action.payload.pupilId) {
          state.pupilId = action.payload.pupilId;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && state.user.id === action.payload.id) {
          state.user = {
            ...state.user,
            ...action.payload,
          };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUser, setPupilId } = authSlice.actions;
export default authSlice.reducer;
