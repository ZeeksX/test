import { createSlice } from "@reduxjs/toolkit";

const examRoomSlice = createSlice({
  name: "examRooms",
  initialState: {
    examRooms: [],

    hasStudentGroups: false,

    loading: false,
    error: null,
  },
  reducers: {},
});

export default examRoomSlice.reducer;
