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

export const updateExamRoom = createAsyncThunk(
  "examRooms/updateExamRoom",
  async ({ id, examRoomData }, thunkApi) => {
    try {
      const response = await apiCall.put(
        `/exams/exam-rooms/${id}/`,
        examRoomData
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const removeStudentFromExamRoom = createAsyncThunk(
  "examRooms/removeStudentFromExamRoom",
  async ({ groupId, studentId }, thunkApi) => {
    try {
      await apiCall.delete(
        `/exams/exam-rooms/${groupId}/remove-student/${studentId}/`
      );
      return { groupId, studentId };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const leaveExamRoom = createAsyncThunk(
  "examRooms/leaveExamRoom",
  async ({ room_id }, thunkApi) => {
    try {
      await apiCall.post(`/exams/exam-rooms/${room_id}/leave_room/`);
      return { groupId: room_id };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const deleteExamRoom = createAsyncThunk(
  "examRooms/deleteExamRoom",
  async ({ id }, thunkApi) => {
    try {
      await apiCall.delete(`/exams/exam-rooms/${id}/`);
      return { id };
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

    deleteStudentGroupLoading: false,
    deleteStudentGroupError: null,

    updateStudentGroupLoading: false,
    updateStudentGroupError: null,

    removeStudentLoading: false,
    removeStudentError: null,
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
      })

      //
      .addCase(updateExamRoom.pending, (state) => {
        state.updateStudentGroupLoading = true;
        state.updateStudentGroupError = null;
      })
      .addCase(updateExamRoom.fulfilled, (state, action) => {
        state.updateStudentGroupLoading = false;
        const updatedGroup = action.payload;

        // Update in allStudentGroups array
        state.allStudentGroups = state.allStudentGroups.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        );

        // Update in teacherStudentGroups array
        state.teacherStudentGroups = state.teacherStudentGroups.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        );

        // Update in studentStudentGroups array
        state.studentStudentGroups = state.studentStudentGroups.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        );

        // Update studentGroup if it's the currently selected one
        if (state.studentGroup.id === updatedGroup.id) {
          state.studentGroup = updatedGroup;
        }
      })
      .addCase(updateExamRoom.rejected, (state, action) => {
        state.updateStudentGroupLoading = false;
        state.updateStudentGroupError = action.payload;
      })

      //
      .addCase(deleteExamRoom.pending, (state) => {
        state.deleteStudentGroupLoading = true;
        state.deleteStudentGroupError = null;
      })
      .addCase(deleteExamRoom.fulfilled, (state, action) => {
        state.deleteStudentGroupLoading = false;
        const { id } = action.payload;
        state.allStudentGroups = state.allStudentGroups.filter(
          (group) => group.id !== id
        );
        state.teacherStudentGroups = state.teacherStudentGroups.filter(
          (group) => group.id !== id
        );
        state.studentStudentGroups = state.studentStudentGroups.filter(
          (group) => group.id !== id
        );
      })
      .addCase(deleteExamRoom.rejected, (state, action) => {
        state.deleteStudentGroupLoading = false;
        state.deleteStudentGroupError = action.payload;
      })

      .addCase(removeStudentFromExamRoom.pending, (state) => {
        state.removeStudentLoading = true;
        state.removeStudentError = null;
      })
      .addCase(removeStudentFromExamRoom.fulfilled, (state, action) => {
        state.removeStudentLoading = false;
        const { groupId, studentId } = action.payload;
        const updateGroup = (group) => ({
          ...group,
          students: group.students.filter(
            (student) => student.id !== studentId
          ),
        });

        state.allStudentGroups = state.allStudentGroups.map((g) =>
          g.id === groupId ? updateGroup(g) : g
        );
        state.teacherStudentGroups = state.teacherStudentGroups.map((g) =>
          g.id === groupId ? updateGroup(g) : g
        );
        state.studentStudentGroups = state.studentStudentGroups.map((g) =>
          g.id === groupId ? updateGroup(g) : g
        );
        if (state.studentGroup.id === groupId) {
          state.studentGroup = updateGroup(state.studentGroup);
        }
      })
      .addCase(removeStudentFromExamRoom.rejected, (state, action) => {
        state.removeStudentLoading = false;
        state.removeStudentError = action.payload;
      })

      .addCase(leaveExamRoom.pending, (state) => {
        state.removeStudentLoading = true;
        state.removeStudentError = null;
      })
      .addCase(leaveExamRoom.fulfilled, (state, action) => {
        state.removeStudentLoading = false;
        const user = JSON.parse(localStorage.getItem("user"));
        const studentId = user.studentId;
        
        const { groupId } = action.payload;
        const updateGroup = (group) => ({
          ...group,
          students: group.students.filter(
            (student) => student.id !== studentId
          ),
        });

        state.allStudentGroups = state.allStudentGroups.map((g) =>
          g.id === groupId ? updateGroup(g) : g
        );
        state.teacherStudentGroups = state.teacherStudentGroups.map((g) =>
          g.id === groupId ? updateGroup(g) : g
        );
        state.studentStudentGroups = state.studentStudentGroups.map((g) =>
          g.id === groupId ? updateGroup(g) : g
        );
        if (state.studentGroup.id === groupId) {
          state.studentGroup = updateGroup(state.studentGroup);
        }
      })
      .addCase(leaveExamRoom.rejected, (state, action) => {
        state.removeStudentLoading = false;
        state.removeStudentError = action.payload;
      });
  },
});

export const selectStudentGroupById = (state, id) => {
  return (
    state.examRooms.allStudentGroups.find((group) => group.id === id) || null
  );
};

export default examRoomSlice.reducer;
