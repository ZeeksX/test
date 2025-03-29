import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./reducers/courseSlice";
import examRoomReducer from "./reducers/examRoomSlice";
import uiReducer from "./reducers/uiSlice";

const store = configureStore({
  reducer: {
    courses: courseReducer,
    examRooms: examRoomReducer,
    ui: uiReducer,
  },
});

export default store;
