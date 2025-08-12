import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiCall from "../../utils/apiCall";

export const fetchSavedExams = createAsyncThunk(
  "draft/fetchSavedExams",
  async ({ courseId }, thunkApi) => {
    try {
      const response = await apiCall.get("/exams/draft-exams/all/");
      const allDrafts = response.data;

      const courseDrafts = allDrafts.filter(
        (draft) => draft.course == courseId
      );

      // console.log({ allDrafts, courseDrafts });
      return courseDrafts;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchSavedExam = createAsyncThunk(
  "draft/fetchSavedExam",
  async ({ id }, thunkApi) => {
    try {
      const response = await apiCall.get(`/exams/draft-exams/${id}/`);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const deleteSavedExam = createAsyncThunk(
  "draft/deleteSavedExam",
  async ({ id }, thunkApi) => {
    try {
      await apiCall.delete(`/exams/draft-exams/${id}/`);
      return { id };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  savedExams: [],
  savedExam: null,

  loading: {
    savedExams: false,
    savedExam: false,
    deleteSavedExam: false,
  },

  error: {
    savedExams: null,
    savedExam: null,
    deleteSavedExam: null,
  },
};

const draftSlice = createSlice({
  name: "drafts",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = { ...initialState.error };
      //   state.success = { ...initialState.success };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedExams.pending, (state) => {
        state.loading.savedExams = true;
        state.error.savedExams = null;
      })
      .addCase(fetchSavedExams.fulfilled, (state, action) => {
        state.loading.savedExams = false;
        state.savedExams = action.payload;
      })
      .addCase(fetchSavedExams.rejected, (state, action) => {
        state.loading.savedExams = false;
        state.error.savedExams = action.payload;
      })

      .addCase(deleteSavedExam.pending, (state) => {
        state.deleteSavedExamLoading = true;
        state.deleteSavedExamError = null;
      })
      .addCase(deleteSavedExam.fulfilled, (state, action) => {
        state.deleteSavedExamLoading = false;
        const { id } = action.payload;
        state.savedExams = state.savedExams.filter((exam) => exam.id !== id);
      })
      .addCase(deleteSavedExam.rejected, (state, action) => {
        state.deleteSavedExamLoading = false;
        state.deleteSavedExamError = action.payload;
      })

      .addCase(fetchSavedExam.pending, (state) => {
        state.loading.savedExam = true;
        state.error.savedExam = null;
      })
      .addCase(fetchSavedExam.fulfilled, (state, action) => {
        state.loading.savedExam = false;
        state.savedExam = action.payload;
      })
      .addCase(fetchSavedExam.rejected, (state, action) => {
        state.loading.savedExam = false;
        state.error.savedExam = action.payload;
      });
  },
});

export const { clearMessages } = draftSlice.actions;

export default draftSlice.reducer;
