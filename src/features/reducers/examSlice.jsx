import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiCall from "../../utils/apiCall";
import axios from "axios";
import { PETTY_SERVER_URL, sampleStudentResult } from "../../utils/constants";

// ... keep your existing async thunks (fetchExams, fetchExamDetails, etc.)

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

export const newFetchExamSubmissions = createAsyncThunk(
  "exams/newFetchExamSubmissions",
  async ({ examid }, thunkApi) => {
    try {
      const response = await axios.get(
        `${PETTY_SERVER_URL}/api/exams/${examid}/results/`
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const newFetchStudentResult = createAsyncThunk(
  "exams/newFetchStudentResult",
  async ({ examId, studentId }, thunkApi) => {
    try {
      const response = await axios.get(
        `${PETTY_SERVER_URL}/api/exams/${examId}/students/${studentId}/result`
      );
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// NEW: Add the updateStudentScores async thunk for API call
export const updateStudentScores = createAsyncThunk(
  "exams/updateStudentScores",
  async ({ examId, studentId, questionScores, totalScore }, thunkApi) => {
    try {
      const body = {
        examId,
        studentId,
        questionScores,
        totalScore,
      };

      const response = await axios.put(
        `${PETTY_SERVER_URL}/api/exams/update-scores`,
        body
      );

      if (response.status === 200) {
        return { questionScores, totalScore };
      } else {
        throw new Error("Failed to update scores");
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error.message);
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

    studentResult: null,
    hasUnsavedChanges: false, // Changed to false initially

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

    // Add loading state for score updates
    updateScoreLoading: false,
    updateScoreError: null,
  },
  reducers: {
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

    // FIXED: Better score update logic
    updateQuestionScore: (state, action) => {
      const { questionIndex, newScore } = action.payload;

      if (
        state.studentResult &&
        state.studentResult.results.details[questionIndex]
      ) {
        const score = parseFloat(newScore) || 0;

        // Update score in the correct location based on grading status
        if (state.studentResult.submissionInfo.grading_status === "completed") {
          // For completed grading, update the nested score
          if (state.studentResult.results.details[questionIndex][1]) {
            state.studentResult.results.details[questionIndex][1].score = score;
          }
        } else {
          // For manual grading, update both locations
          if (state.studentResult.results.details[questionIndex][1]) {
            state.studentResult.results.details[questionIndex][1].score = score;
          }
          // Also update question_scores if it exists
          if (state.studentResult.results.details.question_scores) {
            state.studentResult.results.details.question_scores[questionIndex] =
              score;
          }
        }

        // Mark as having unsaved changes
        state.hasUnsavedChanges = true;
      }
    },

    clearUnsavedChanges: (state) => {
      state.hasUnsavedChanges = false;
    },

    resetStudentResult: (state) => {
      state.studentResult = null;
      state.hasUnsavedChanges = false;
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
      })

      .addCase(newFetchExamSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(newFetchExamSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.exam = action.payload;
      })
      .addCase(newFetchExamSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(newFetchStudentResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(newFetchStudentResult.fulfilled, (state, action) => {
        state.loading = false;
        state.studentResult = action.payload;
        state.hasUnsavedChanges = false; // Reset unsaved changes when loading fresh data
      })
      .addCase(newFetchStudentResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // NEW: Handle the updateStudentScores async thunk
      .addCase(updateStudentScores.pending, (state) => {
        state.updateScoreLoading = true;
        state.updateScoreError = null;
      })

      .addCase(updateStudentScores.fulfilled, (state, action) => {
        state.updateScoreLoading = false;
        const { questionScores, totalScore } = action.payload;

        if (state.studentResult) {
          // Update individual question scores - FIXED LOGIC
          Object.entries(questionScores).forEach(([questionIndex, score]) => {
            const index = parseInt(questionIndex);
            if (state.studentResult.results.details[index]) {
              const scoreValue = parseFloat(score) || 0;

              // Check the structure and update accordingly
              if (
                state.studentResult.submissionInfo.grading_status ===
                "completed"
              ) {
                // For completed grading, update the nested score object
                if (
                  state.studentResult.results.details[index][1] &&
                  typeof state.studentResult.results.details[index][1] ===
                    "object"
                ) {
                  state.studentResult.results.details[index][1].score =
                    scoreValue;
                }
              } else {
                // For manual grading, update both locations
                if (
                  state.studentResult.results.details[index][1] &&
                  typeof state.studentResult.results.details[index][1] ===
                    "object"
                ) {
                  state.studentResult.results.details[index][1].score =
                    scoreValue;
                }
                // Also update question_scores if it exists
                if (state.studentResult.results.details.question_scores) {
                  state.studentResult.results.details.question_scores[index] =
                    scoreValue;
                }
              }
            }
          });

          // Update total score
          state.studentResult.results.total_scores = {
            ...state.studentResult.results.total_scores,
            1: totalScore,
          };

          // Update submission info score
          state.studentResult.submissionInfo.score = totalScore;

          // Clear unsaved changes flag
          state.hasUnsavedChanges = false;
        }
      })
      .addCase(updateStudentScores.rejected, (state, action) => {
        state.updateScoreLoading = false;
        state.updateScoreError = action.payload;
      });
  },
});

export const {
  removeExam,
  updateQuestionScore,
  clearUnsavedChanges,
  resetStudentResult,
} = examSlice.actions;

export default examSlice.reducer;
