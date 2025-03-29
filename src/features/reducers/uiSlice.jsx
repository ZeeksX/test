import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showCreateExaminationRoom: false,
    showCreateNewExamination: false,
    showStudentGroupWarnDialog: false,
    showCreateStudentGroup: false,
    showShareStudentGroupLinkDialog: false,
    showJoinStudentGroupDialog: false,
    showLeaveStudentGroupDialog: false,
  },
  reducers: {
    setShowCreateExaminationRoom: (state, action) => {
      state.showCreateExaminationRoom = action.payload;
    },
    setShowCreateNewExamination: (state, action) => {
      state.showCreateNewExamination = action.payload;
    },
    setShowStudentGroupWarnDialog: (state, action) => {
      state.showStudentGroupWarnDialog = action.payload;
    },
    setShowCreateStudentGroup: (state, action) => {
      state.showCreateStudentGroup = action.payload;
    },
    setShowShareStudentGroupLinkDialog: (state, action) => {
      state.showShareStudentGroupLinkDialog = action.payload;
    },
    setShowJoinStudentGroupDialog: (state, action) => {
      state.showJoinStudentGroupDialog = action.payload;
    },
    setShowLeaveStudentGroupDialog: (state, action) => {
      state.showLeaveStudentGroupDialog = action.payload;
    },
  },
});

export const {
  setShowCreateExaminationRoom,
  setShowCreateNewExamination,
  setShowStudentGroupWarnDialog,
  setShowCreateStudentGroup,
  setShowShareStudentGroupLinkDialog,
  setShowJoinStudentGroupDialog,
  setShowLeaveStudentGroupDialog,
} = uiSlice.actions;
export default uiSlice.reducer;
