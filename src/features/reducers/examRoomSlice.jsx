import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiCall from "../../utils/apiCall";

export const fetchStudentGroups = createAsyncThunk(
  "examRoom/fetchStudentGroups",
  async (thunkApi) => {
    try {
      const response = await apiCall.get("/exams/exam-rooms/");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchStudentsStudentGroups = createAsyncThunk(
  "examRoom/fetchStudentsStudentGroups",
  async (thunkApi) => {
    try {
      const response = await apiCall.get("/exams/enrollments/");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const examRoomSlice = createSlice({
  name: "examRooms",
  initialState: {
    allStudentGroups: [],
    teacherStudentGroups: [],

    allStudentStudentGroups: [],
    studentStudentGroups: [],

    hasStudentGroups: false,

    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.allStudentGroups = action.payload;
        const teacherId = 1;
        state.teacherStudentGroups = state.allStudentGroups.filter(
          (room) => room.teacher === teacherId
        );
        if (state.teacherStudentGroups.length > 0) {
          state.hasStudentGroups = true;
        }
      })
      .addCase(fetchStudentGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      .addCase(fetchStudentsStudentGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsStudentGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.allStudentStudentGroups = action.payload;
        const studentId = 1;
        state.studentStudentGroups = state.allStudentStudentGroups.filter(
          (room) => room.student === studentId
        );
      })
      .addCase(fetchStudentsStudentGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectStudentGroupById = (state, id) => {
  return state.examRooms.allStudentGroups.find(group => group.id === id) || null;
};

export default examRoomSlice.reducer;
