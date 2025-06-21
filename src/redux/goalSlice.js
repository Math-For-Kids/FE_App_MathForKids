import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

// Thunk: Tạo goal mới
export const createGoal = createAsyncThunk(
  "goal/create",
  async (goalData, { rejectWithValue }) => {
    try {
      const res = await Api.post("/goal", goalData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk: Lấy tất cả goal của học sinh trong vòng 30 ngày
export const getGoalsWithin30Days = createAsyncThunk(
  "goal/getWithin30Days",
  async (pupilId, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/goal/getWithin30Days/${pupilId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk: Lấy goal theo ID
export const getGoalById = createAsyncThunk(
  "goal/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/goal/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk: Cập nhật goal
export const updateGoal = createAsyncThunk(
  "goal/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await Api.patch(`/goal/${id}`, data);
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const goalSlice = createSlice({
  name: "goal",
  initialState: {
    loading: false,
    error: null,
    goals: [],
    goal: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Goal
      .addCase(createGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.goals.push(action.payload); // optional: if backend returns the created goal
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get goals within 30 days
      .addCase(getGoalsWithin30Days.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGoalsWithin30Days.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload || [];
      })
      .addCase(getGoalsWithin30Days.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get goal by ID
      .addCase(getGoalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGoalById.fulfilled, (state, action) => {
        state.loading = false;
        state.goal = action.payload;
      })
      .addCase(getGoalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update goal
      .addCase(updateGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.goal = { ...state.goal, ...action.payload };
        state.goals = state.goals.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload } : g
        );
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default goalSlice.reducer;
