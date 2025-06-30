import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../api/api";

// Thunk: Lấy danh sách bài tập theo khối và loại
export const getRandomTests = createAsyncThunk(
    "exercise/randomTests",
    async ({ lessonId }, { rejectWithValue }) => {
        try {
            const res = await Api.get(`/exercise/randomTests/${lessonId}`);
            // console.log("API response:", res.data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


const testsSlice = createSlice({
    name: "test",
    initialState: {
        tests: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRandomTests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRandomTests.fulfilled, (state, action) => {
                state.loading = false;
                state.tests = action.payload;
            })
            .addCase(getRandomTests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default testsSlice.reducer;