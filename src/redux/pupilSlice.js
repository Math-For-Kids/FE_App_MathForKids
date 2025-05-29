import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

// Thunk: Tạo học sinh
export const createPupil = createAsyncThunk(
  "pupil/create",
  async (pupilData, { rejectWithValue }) => {
    try {
      const res = await Api.post("/pupil", pupilData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunk: Lấy danh sách tất cả học sinh
export const getAllPupils = createAsyncThunk(
  "pupil/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/pupil");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const pupilById = createAsyncThunk(
  "pupil/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/pupil/${id}`);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
const pupilSlice = createSlice({
  name: "pupil",
  initialState: {
    loading: false,
    error: null,
    pupils: [],
    pupil: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createPupil
      .addCase(createPupil.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPupil.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPupil.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAllPupils
      .addCase(getAllPupils.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPupils.fulfilled, (state, action) => {
        state.loading = false;
        state.pupils = action.payload;
      })
      .addCase(getAllPupils.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getbyid
      .addCase(pupilById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pupilById.fulfilled, (state, action) => {
        state.loading = false;
        state.pupil = action.payload;
      })
      .addCase(pupilById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pupilSlice.reducer;
