import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiCall from "../../utils/apiCall";

export const fetchExaminations = createAsyncThunk(
    "examinations/fetchExaminations",
    async (thunkApi) => {
        try {
            const response = await apiCall.get("/exams/examinations");
            return response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

export const fetchExaminationDetails = createAsyncThunk(
    "examinations/fetchExaminationDetails",
    async ({ id }, thunkApi) => {
        try {
            const response = await apiCall.get(`/exams/examinations/${id}`);
            return response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

export const createExamination = createAsyncThunk(
    "examinations/createExamination",
    async ({ body }, thunkApi) => {
        try {
            const response = await apiCall.post(`/exams/examinations/`, body);
            return response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

const examinationSlice = createSlice({
    name: "examinations",
    initialState: {
        examinations: [],
        loading: false,
        error: null,

        examination: {
            id: 0,
            exam_name: "",
            course_code: "",
            lecturer: "",
            date: "",
            duration: 0,
            created_at: "",
            updated_at: "",
        },
        examinationLoading: false,
        examinationError: null,

        createLoading: false,
        createError: null,
    },
    reducers: {
        createLocalExamination: (state, action) => {
            state.examinations.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all examinations
            .addCase(fetchExaminations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExaminations.fulfilled, (state, action) => {
                state.loading = false;
                state.examinations = action.payload;
            })
            .addCase(fetchExaminations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch single examination details
            .addCase(fetchExaminationDetails.pending, (state) => {
                state.examinationLoading = true;
                state.examinationError = null;
            })
            .addCase(fetchExaminationDetails.fulfilled, (state, action) => {
                state.examinationLoading = false;
                state.examination = action.payload;
            })
            .addCase(fetchExaminationDetails.rejected, (state, action) => {
                state.examinationLoading = false;
                state.examinationError = action.payload;
            })

            // Create new examination
            .addCase(createExamination.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createExamination.fulfilled, (state, action) => {
                state.createLoading = false;
            })
            .addCase(createExamination.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            });
    },
});

export const { createLocalExamination } = examinationSlice.actions;
export default examinationSlice.reducer;