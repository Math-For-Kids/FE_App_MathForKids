import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

// Thunk: Lấy danh sách bài học theo khối và loại
export const getLessonsByGradeAndType = createAsyncThunk(
  "lesson/getByGradeAndType",
  async ({ grade, type }, { rejectWithValue }) => {
    try {
      const res = await Api.get("/lesson/getByGradeAndType", {
        params: { grade, type },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const getLessonById = createAsyncThunk(
  "lesson/getById",
  async (lessonId, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/lesson/${lessonId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
const lessonSlice = createSlice({
  name: "lesson",
  initialState: {
    lessons: [],
    lessonDetail: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLessonsByGradeAndType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLessonsByGradeAndType.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(getLessonsByGradeAndType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLessonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLessonById.fulfilled, (state, action) => {
        state.loading = false;
        state.lessonDetail = action.payload;
      })
      .addCase(getLessonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default lessonSlice.reducer;
