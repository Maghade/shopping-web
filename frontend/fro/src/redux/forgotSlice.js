import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const forgotPassword = createAsyncThunk(
    "forgot/forgotPassword",
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.VITE_BACKEND_URL}/api/user/forgot-password`,
                { email }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
            
        }   
    }
);

const forgotSlice = createSlice({
    name: "forgot",
    initialState: {
        message: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default forgotSlice.reducer;