import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./reducers/courseSlice";
import examRoomReducer from "./reducers/examRoomSlice";
import uiReducer from "./reducers/uiSlice";
import examReducer from "./reducers/examSlice";
import examinationReducer from "./reducers/examinationSlice";
import userReducer from "./reducers/userSlice";
import draftReducer from "./reducers/draftSlice";

const store = configureStore({
  reducer: {
    examinations: examinationReducer,
    courses: courseReducer,
    examRooms: examRoomReducer,
    ui: uiReducer,
    exams: examReducer,
    users: userReducer,
    drafts: draftReducer,
  },
});

export default store;
