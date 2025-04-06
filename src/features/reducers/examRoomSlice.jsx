import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiCall from "../../utils/apiCall";

export const fetchStudentGroups = createAsyncThunk(
  "examRoom/fetchStudentGroups",
  async (_, thunkApi) => {
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
  async (_, thunkApi) => {
    try {
      const response = await apiCall.get("/exams/exam-rooms/my_exam_rooms/");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchStudentGroupDetails = createAsyncThunk(
  "examRoom/fetchStudentGroupDetails",
  async ({ id }, thunkApi) => {
    try {
      const response = await apiCall.get(`/exams/exam-rooms/${id}/`);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllTeachersWithTheirExamRooms = createAsyncThunk(
  "examRoom/fetchAllTeachersWithTheirExamRooms",
  async (_, thunkApi) => {
    try {
      const response = await apiCall.get(`/exams/teachers/examrooms/`);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllStudents = createAsyncThunk(
  "examRoom/fetchAllStudents",
  async (_, thunkApi) => {
    try {
      const response = await apiCall.get(`/users/students/`);
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
    // Remove allStudentStudentGroups if no longer needed
    studentStudentGroups: [],
    studentGroup: {
      id: 0,
      enrolled_students: [],
      name: "",
      description: "",
      created_at: "",
      updated_at: "",
      teacher: 0,
      course: 0,
      students: [],
    },
    allTeachersAndExamRooms: [],
    allStudents: [],

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
        const user = JSON.parse(localStorage.getItem("user"));
        const teacherId = user.teacherId;
        state.teacherStudentGroups = state.allStudentGroups.filter(
          (room) => room.teacher.id == teacherId
        );
        if (state.teacherStudentGroups.length > 0) {
          state.hasStudentGroups = true;
        }
      })
      .addCase(fetchStudentGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Updated reducer for fetching student's exam rooms.
      .addCase(fetchStudentsStudentGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsStudentGroups.fulfilled, (state, action) => {
        state.loading = false;
        // Directly set the student's groups from the API response.
        state.studentStudentGroups = action.payload;
      })
      .addCase(fetchStudentsStudentGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchStudentGroupDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentGroupDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.studentGroup = action.payload;
      })
      .addCase(fetchStudentGroupDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllTeachersWithTheirExamRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllTeachersWithTheirExamRooms.fulfilled,
        (state, action) => {
          state.loading = false;
          state.allTeachersAndExamRooms = action.payload;
        }
      )
      .addCase(fetchAllTeachersWithTheirExamRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      .addCase(fetchAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.allStudents = action.payload;
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectStudentGroupById = (state, id) => {
  return (
    state.examRooms.allStudentGroups.find((group) => group.id === id) || null
  );
};

export default examRoomSlice.reducer;
