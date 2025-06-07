import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

// Thunk: Lấy danh sách bài tập theo khối và loại
export const getExercisesByGradeAndType = createAsyncThunk(
  "exercise/getByGradeAndType",
  async ({ grade, type }, { rejectWithValue }) => {
    try {
      const res = await Api.get("/exercise/getByGradeAndType", {
        params: { grade, type },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const exerciseSlice = createSlice({
  name: "exercise",
  initialState: {
    exercises: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExercisesByGradeAndType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExercisesByGradeAndType.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload;
      })
      .addCase(getExercisesByGradeAndType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default exerciseSlice.reducer;
