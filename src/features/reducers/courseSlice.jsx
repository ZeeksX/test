import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiCall from "../../utils/apiCall";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (thunkApi) => {
    try {
      const response = await apiCall.get("/exams/courses/my-courses/");
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
      const response = await apiCall.get(`/exams/courses/${id}/`);
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

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, body }, thunkApi) => {
    try {
      const response = await apiCall.put(`/exams/courses/${id}/`, body);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async ({ id }, thunkApi) => {
    try {
      await apiCall.delete(`/exams/courses/${id}/`);
      return { id };
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

    updateLoading: false,
    updateError: null,

    deleteLoading: false,
    deleteError: null,
  },
  reducers: {
    createLocalCourse: (state, action) => {
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
      })

      //
      .addCase(updateCourse.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedCourse = action.payload;

        state.courses = state.courses.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        );

        if (state.course.id === updatedCourse.id) {
          state.course = updatedCourse;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      //
      .addCase(deleteCourse.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const { id } = action.payload;
        state.courses = state.courses.filter((course) => course.id !== id);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const { createLocalCourse } = courseSlice.actions;
export default courseSlice.reducer;
