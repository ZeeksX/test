import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiCall from "../../utils/apiCall";

export const fetchUserDetails = createAsyncThunk(
  "users/fetchUserDetails",
  async (_, thunkApi) => {
    try {
      const response = await apiCall.get("/users/me/");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "users/updateUserDetails",
  async (userData, thunkApi) => {
    try {
      const response = await apiCall.put("/users/me/", userData);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    userDetails: null,

    getDetailsLoading: false,
    getDetailsError: false,

    updateDetailsLoading: false,
    updateDetailsError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.getDetailsLoading = true;
        state.getDetailsError = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.getDetailsLoading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.getDetailsLoading = false;
        state.getDetailsError = action.payload;
      })

      .addCase(updateUserDetails.pending, (state) => {
        state.updateDetailsLoading = true;
        state.updateDetailsError = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.updateDetailsLoading = false;
        if (state.userDetails) {
          state.userDetails.last_name = action.payload.last_name;
          state.userDetails.other_names = action.payload.other_names;
        }
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.updateDetailsLoading = false;
        state.updateDetailsError = action.payload;
      });
  },
});

export default userSlice.reducer;
