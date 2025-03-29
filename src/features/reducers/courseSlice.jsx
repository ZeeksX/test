import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiCall from "../../utils/apiCall";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (thunkApi) => {
    try {
      const response = await apiCall.get("/exams/courses");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const fetchCourseDetails = createAsyncThunk(
  "courses/fetchCourseDetails",
  async ({ id }, thunkApi) => {
    try {
      const response = await apiCall.get(`/exams/courses/${id}`);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async ({ body }, thunkApi) => {
    try {
      const response = await apiCall.post(`/exams/courses/`, body);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    loading: false,
    error: null,

    course: {
      id: 0,
      course_title: "",
      course_code: "",
      created_at: "",
      updated_at: "",
    },
    courseLoading: false,
    courseError: null,

    createLoading: false,
    createError: null,
  },
  reducers: {
    createLocalCourse: (state, action) => {
      console.log("body:", action.payload);

      state.courses.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      //
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      .addCase(fetchCourseDetails.pending, (state) => {
        state.courseLoading = true;
        state.courseError = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.courseLoading = false;
        state.course = action.payload;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.courseLoading = false;
        state.courseError = action.payload;
      })

      //
      .addCase(createCourse.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.createLoading = false;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      });
  },
});

export const { createLocalCourse } = courseSlice.actions;
export default courseSlice.reducer;
