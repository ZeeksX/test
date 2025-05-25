import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiCall from "../../utils/apiCall";

export const fetchExams = createAsyncThunk(
  "exams/fetchExams",
  async (_, thunkApi) => {
    try {
      const response = await apiCall.get("/exams/get-exams/");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchExamDetails = createAsyncThunk(
  "exams/fetchExamDetails",
  async ({ id }, thunkApi) => {
    console.log("response");
    try {
      const response = await apiCall.get(`/exams/exams/${id}/`);
      console.log("dddresponse", response.data);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchExamsforACourse = createAsyncThunk(
  "exams/fetchExamsforACourse",
  async ({ courseId }, thunkApi) => {
    try {
      const response = await apiCall.get(`/exams/get-exam_course/${courseId}/`);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchStudentExams = createAsyncThunk(
  "exams/fetchStudentExams",
  async ({ id }, thunkApi) => {
    try {
      const examRoomsResponse = await apiCall.get(`/exams/exam-rooms/`);
      const examRooms = examRoomsResponse.data;

      const examResponse = await apiCall.get("/exams/get-exams/");
      const exams = examResponse.data;
      return getStudentExams(id, examRooms, exams);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const getStudentExams = (studentId, examRooms, exams) => {
  const studentExamRooms = examRooms.filter((room) =>
    room.students.some((student) => student.student_id === studentId)
  );

  const studentExamRoomIds = studentExamRooms.map((room) => room.id);

  const availableExams = exams.filter((exam) =>
    exam.exam_rooms.some((roomId) => studentExamRoomIds.includes(roomId))
  );

  return availableExams;
};

export const fetchExamSubmissions = createAsyncThunk(
  "exams/fetchExamSubmissions",
  async ({ examid }, thunkApi) => {
    try {
      const response = await apiCall.get(`/exams/${examid}/results/`);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const deleteExam = createAsyncThunk(
  "exams/deleteExam",
  async ({ id }, thunkApi) => {
    try {
      await apiCall.delete(`/exams/exams/${id}/`);
      return { id };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const examSlice = createSlice({
  name: "exams",
  initialState: {
    allExams: [],
    teacherExams: [],
    studentExams: [],

    courseExams: [],

    exam: {
      id: 1,
      title: "fhhffhfh",
      exam_type: "",
      description: "",
      schedule_time: "",
      status: "Scheduled",
      due_time: "",
      questions: [],
      source_file: "",
      strict: true,
      created_at: "",
      updated_at: "",
      teacher: 0,
      course: 0,
      exam_rooms: [],
    },

    examSubmissions: [],

    loading: false,
    error: null,

    deleteExamLoading: false,
    deleteExamError: null,
  },
  reducers: {
    // filterExamByCourse: (state, action) => {
    //   const courseId = action.payload;
    //   state.courseExams = state.allExams.filter(
    //     (exam) => exam.course === Number(courseId)
    //   );
    // },
    removeExam: (state, action) => {
      const examId = action.payload;
      state.allExams = state.allExams.filter((exam) => exam.id !== examId);
      state.teacherExams = state.teacherExams.filter(
        (exam) => exam.id !== examId
      );
      state.courseExams = state.courseExams.filter(
        (exam) => exam.id !== examId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.allExams = action.payload;
        const user = JSON.parse(localStorage.getItem("user"));
        const teacherId = user.teacherId;
        state.teacherExams = state.allExams.filter(
          (exam) => exam.teacher === teacherId
        );
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      .addCase(fetchExamDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.exam = action.payload;
      })
      .addCase(fetchExamDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      .addCase(fetchExamsforACourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamsforACourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courseExams = action.payload;
      })
      .addCase(fetchExamsforACourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      .addCase(fetchStudentExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentExams.fulfilled, (state, action) => {
        state.loading = false;
        state.studentExams = action.payload;
      })
      .addCase(fetchStudentExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      .addCase(fetchExamSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        const filteredSubmissions = action.payload.reduce((acc, submission) => {
          const studentId = submission.student.student_id;
          const existingSubmission = acc.find(
            (sub) => sub.student.student_id === studentId
          );

          if (!existingSubmission) {
            acc.push(submission);
          } else {
            if (
              submission.answers !== null &&
              existingSubmission.answers === null
            ) {
              const index = acc.findIndex(
                (sub) => sub.student.student_id === studentId
              );
              acc[index] = submission;
            }
          }

          return acc;
        }, []);

        state.examSubmissions = filteredSubmissions;
      })
      .addCase(fetchExamSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      .addCase(deleteExam.pending, (state) => {
        state.deleteExamLoading = true;
        state.deleteExamError = null;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.deleteExamLoading = false;
        const { id } = action.payload;
        state.allExams = state.allExams.filter((exam) => exam.id !== id);
        state.teacherExams = state.teacherExams.filter(
          (exam) => exam.id !== id
        );
        state.courseExams = state.courseExams.filter((exam) => exam.id !== id);
        state.studentExams = state.studentExams.filter(
          (exam) => exam.id !== id
        );
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.deleteExamLoading = false;
        state.deleteExamError = action.payload;
      });
  },
});

export const { removeExam } = examSlice.actions;
export default examSlice.reducer;
