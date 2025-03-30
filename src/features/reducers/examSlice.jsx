import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiCall from "../../utils/apiCall";

export const fetchExams = createAsyncThunk(
  "exams/fetchExams",
  async (thunkApi) => {
    try {
      const response = await apiCall.get("/exams/exams/");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const examSlice = createSlice({
  name: "exams",
  initialState: {
    allExams: [
      {
        id: 1,
        title: "Mid-Semester Exam",
        exam_type: "Quiz",
        description:
          "This is a mid-semester quiz covering the first half of the course.",
        schedule_time: "2025-04-10T10:00:00Z",
        status: "Scheduled",
        due_time: "2025-04-10T11:30:00Z",
        questions: [
          {
            id: 101,
            text: "What is the main purpose of a database index?",
            type: "multiple-choice",
            options: [
              "Speed up queries",
              "Store more data",
              "Encrypt data",
              "None of the above",
            ],
            answer: "Speed up queries",
          },
          {
            id: 102,
            text: "Explain the concept of normalization in databases.",
            type: "essay",
          },
        ],
        source_file: "exam_guidelines.pdf",
        strict: true,
        created_at: "2025-03-30T08:00:00Z",
        updated_at: "2025-03-30T08:30:00Z",
        teacher: 5,
        course: 12,
        studentGroups: [
          {
            id: 1,
            name: "Test Exam Room",
            description: "Test Exam Description",
            created_at: "2025-03-29T22:31:25.286956Z",
            updated_at: "2025-03-29T22:31:25.286970Z",
            teacher: 1,
            course: 1,
          },
          {
            id: 2,
            name: "New Exam Room",
            description: "New Exam Description",
            created_at: "2025-03-29T22:46:21.261249Z",
            updated_at: "2025-03-29T22:46:21.261263Z",
            teacher: 1,
            course: 2,
          },
          {
            id: 3,
            name: "Another Student Group",
            description: "Just another student group",
            created_at: "2025-03-30T01:13:23.300530Z",
            updated_at: "2025-03-30T01:13:23.300545Z",
            teacher: 1,
            course: 3,
          },
          {
            id: 4,
            name: "New Exam Room",
            description: "New Exam Description",
            created_at: "2025-03-29T22:46:21.261249Z",
            updated_at: "2025-03-29T22:46:21.261263Z",
            teacher: 1,
            course: 2,
          },
          {
            id: 5,
            name: "Another Student Group",
            description: "Just another student group",
            created_at: "2025-03-30T01:13:23.300530Z",
            updated_at: "2025-03-30T01:13:23.300545Z",
            teacher: 1,
            course: 3,
          },
          {
            id: 6,
            name: "New Exam Room",
            description: "New Exam Description",
            created_at: "2025-03-29T22:46:21.261249Z",
            updated_at: "2025-03-29T22:46:21.261263Z",
            teacher: 1,
            course: 2,
          },
          {
            id: 7,
            name: "Another Student Group",
            description: "Just another student group",
            created_at: "2025-03-30T01:13:23.300530Z",
            updated_at: "2025-03-30T01:13:23.300545Z",
            teacher: 1,
            course: 3,
          },
        ],
      },
      {
        id: 2,
        title: "Mid-Semester Exam",
        exam_type: "Quiz",
        description:
          "This is a mid-semester quiz covering the first half of the course.",
        schedule_time: "2025-04-10T10:00:00Z",
        status: "Scheduled",
        due_time: "2025-04-10T11:30:00Z",
        questions: [
          {
            id: 101,
            text: "What is the main purpose of a database index?",
            type: "multiple-choice",
            options: [
              "Speed up queries",
              "Store more data",
              "Encrypt data",
              "None of the above",
            ],
            answer: "Speed up queries",
          },
          {
            id: 102,
            text: "Explain the concept of normalization in databases.",
            type: "essay",
          },
        ],
        strict: true,
        created_at: "2025-03-30T08:00:00Z",
        updated_at: "2025-03-30T08:30:00Z",
        teacher: 5,
        course: 12,
        studentGroups: [
          {
            id: 1,
            name: "Test Exam Room",
            description: "Test Exam Description",
            created_at: "2025-03-29T22:31:25.286956Z",
            updated_at: "2025-03-29T22:31:25.286970Z",
            teacher: 1,
            course: 1,
          },
          {
            id: 2,
            name: "New Exam Room",
            description: "New Exam Description",
            created_at: "2025-03-29T22:46:21.261249Z",
            updated_at: "2025-03-29T22:46:21.261263Z",
            teacher: 1,
            course: 2,
          },
          {
            id: 3,
            name: "Another Student Group",
            description: "Just another student group",
            created_at: "2025-03-30T01:13:23.300530Z",
            updated_at: "2025-03-30T01:13:23.300545Z",
            teacher: 1,
            course: 3,
          },
        ],
      },
    ],

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
      studentGroups: [],
    },

    allResults: [],

    studentResult: {
      id: 2,
      totalScore: 50,
      student: {
        id: 4,
        matric_number: "21/1134",
        last_name: "Bassey",
        other_names: "Imoh Imoh",
      },
      exam: {
        id: 1,
        title: "fhhffhfh",
        questions: [
          {
            id: 25,
            text: "Which of the following best describes reverse engineering?",
            score: 2,
            type: "multiple-choice",
            options: [
              {
                id: 77,
                text: "Creating new software from scratch",
                isCorrect: true,
              },
              {
                id: 78,
                text: "Disassembling and analyzing software or hardware to understand its design",
                isCorrect: false,
              },
              {
                id: 79,
                text: "Writing malware to exploit vulnerabilities",
                isCorrect: false,
              },
              {
                id: 80,
                text: "Encrypting data for security",
                isCorrect: false,
              },
            ],
            studentAnswers: [
              {
                id: 20,
                answerText: "",
                selectedOption: {
                  id: 78,
                  text: "Disassembling and analyzing software or hardware to understand its design",
                  isCorrect: false,
                },
                score: 0,
                AIFeedback: "",
              },
            ],
          },
          {
            id: 26,
            text: "Which of the following best describes reverse engineering?",
            score: 2,
            type: "multiple-choice",
            options: [
              {
                id: 77,
                text: "Creating new software from scratch",
                isCorrect: false,
              },
              {
                id: 78,
                text: "Disassembling and analyzing software or hardware to understand its design",
                isCorrect: true,
              },
              {
                id: 79,
                text: "Writing malware to exploit vulnerabilities",
                isCorrect: false,
              },
              {
                id: 80,
                text: "Encrypting data for security",
                isCorrect: false,
              },
            ],
            studentAnswers: [
              {
                id: 20,
                answerText: "",
                selectedOption: {
                  id: 78,
                  text: "Disassembling and analyzing software or hardware to understand its design",
                  isCorrect: true,
                },
                score: 2,
                AIFeedback: "",
              },
            ],
          },
          {
            id: 27,
            text: "Which of the following best describes reverse engineering?",
            score: 2,
            type: "multiple-choice",
            options: [
              {
                id: 77,
                text: "Creating new software from scratch",
                isCorrect: false,
              },
              {
                id: 78,
                text: "Disassembling and analyzing software or hardware to understand its design",
                isCorrect: true,
              },
              {
                id: 79,
                text: "Writing malware to exploit vulnerabilities",
                isCorrect: false,
              },
              {
                id: 80,
                text: "Encrypting data for security",
                isCorrect: false,
              },
            ],
            studentAnswers: [
              {
                id: 20,
                answerText: "",
                selectedOption: {
                  id: 78,
                  text: "Disassembling and analyzing software or hardware to understand its design",
                  isCorrect: true,
                },
                score: 2,
                AIFeedback: "",
              },
            ],
          },
          {
            id: 40,
            text: "Explain the difference between static and dynamic malware analysis. Give examples of tools used for each approach.",
            score: 2,
            type: "theory",
            options: [],
            modelAnswer:
              "Static analysis involves examining malware code without executing it. Tools like IDA Pro, Ghidra, and strings help analyze the binary structure, assembly instructions, and embedded text.\n\nDynamic analysis involves executing the malware in a controlled environment to observe its behavior. Tools like Cuckoo Sandbox, Wireshark, and Process Monitor are used for this purpose.",
            studentAnswers: [
              {
                id: 35,
                answerText:
                  "Static is when you analyse it without running it, dynamic is when you analyse it while running it in an isolated environment ",
                selectedOption: null,
                score: 2,
                AIFeedback: "This question has been regraded by the lecturer",
              },
            ],
          },
          {
            id: 41,
            text: "Explain the difference between static and dynamic malware analysis. Give examples of tools used for each approach.",
            score: 2,
            type: "theory",
            options: [],
            modelAnswer:
              "Static analysis involves examining malware code without executing it. Tools like IDA Pro, Ghidra, and strings help analyze the binary structure, assembly instructions, and embedded text.\n\nDynamic analysis involves executing the malware in a controlled environment to observe its behavior. Tools like Cuckoo Sandbox, Wireshark, and Process Monitor are used for this purpose.",
            studentAnswers: [
              {
                id: 35,
                answerText:
                  "Static is when you analyse it without running it, dynamic is when you analyse it while running it in an isolated environment ",
                selectedOption: null,
                score: 2,
                AIFeedback: "This question has been regraded by the lecturer",
              },
            ],
          },
          {
            id: "q3",
            type: "cloze",
            score: 2,
            text: "_____________ is a way of life",
            options: [],
            modelAnswer: "sdbsbdnsdnbdsnsdn",
            studentAnswers: [
              {
                id: 35,
                answerText: "hvifiyhf ",
                selectedOption: null,
                score: 2,
                AIFeedback: "This question has been regraded by the lecturer",
              },
            ],
          },
        ],
      },
    },

    loading: false,
    error: null,
  },
  reducers: {
    getExamById: (state, action) => {
      const examId = action.payload;
      state.exam = state.allExams.find((exam) => exam.id === examId) || null;
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
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { getExamById } = examSlice.actions;
export default examSlice.reducer;
