import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showCreateExaminationRoom: false,
    showCreateNewExamination: false,
    showStudentGroupWarnDialog: false,
    showCreateStudentGroup: false,
    showShareStudentGroupLinkDialog: {
      willShow: false,
      link: "llwqfennfw",
      code: "m39s10g",
    },
    showJoinStudentGroupDialog: false,
    showLeaveStudentGroupDialog: {
      isOpen: false,
      groupName: "",
      groupId: null,
    },
    showAddStudentToStudentGroupDialog: {
      isOpen: false,
      groupId: null,
    },
    showSendmeUpdatesDialog: false,
    showForgotPasswordDialog: false,
    showCheckEmailDialog: {
      willShow: false,
      email: "demoEmail@gmail.com",
    },
    showResetPasswordDialog: {
      willShow: false,
      email: "demoEmail@gmail.com",
    },
    showPasswordUpdatedDialog: false,
    showExamConcludedDialog: false,
    showPostExamWarningDialog: {
      willShow: false,
      exam: null,
    },
    showDeleteExamDialog: false,

    showDeleteStudentGroupDialog: false,
    showEditStudentGroupDialog: false,

    showDeleteCourseDialog: false,
    showEditCourseDialog: false,

    showDeleteSavedExamDialog: false,
    showSaveExamToDraftDialog: {
      willShow: false,
      exam: null,
    },

    showPurchaseCreditDialog: false,

    showSubmitExamWarningDialog: {
      willShow: false,
      result: null,
    },

    showDemoDialog: {
      willShow: false,
      result: null,
    },
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
      state.showShareStudentGroupLinkDialog.willShow =
        action.payload.willShow || false;
      state.showShareStudentGroupLinkDialog.link = action.payload.link;
      state.showShareStudentGroupLinkDialog.code = action.payload.code;
    },
    setShowJoinStudentGroupDialog: (state, action) => {
      state.showJoinStudentGroupDialog = action.payload;
    },
    setShowLeaveStudentGroupDialog: (state, action) => {
      state.showLeaveStudentGroupDialog.isOpen = action.payload.isOpen || false;
      state.showLeaveStudentGroupDialog.groupName =
        action.payload.groupName || "";
      state.showLeaveStudentGroupDialog.groupId =
        action.payload.groupId || null;
    },
    setShowAddStudentToStudentGroupDialog: (state, action) => {
      state.showAddStudentToStudentGroupDialog.isOpen =
        action.payload.isOpen || false;
      state.showAddStudentToStudentGroupDialog.groupId = action.payload.groupId;
    },
    setShowSendmeUpdatesDialog: (state, action) => {
      state.showSendmeUpdatesDialog = action.payload;
    },
    setShowForgotPasswordDialog: (state, action) => {
      state.showForgotPasswordDialog = action.payload;
    },
    setShowCheckEmailDialog: (state, action) => {
      state.showCheckEmailDialog.willShow = action.payload.willShow || false;
      state.showCheckEmailDialog.email = action.payload.email;
    },
    setShowResetPasswordDialog: (state, action) => {
      state.showResetPasswordDialog = action.payload;
    },
    setShowPasswordUpdatedDialog: (state, action) => {
      state.showPasswordUpdatedDialog = action.payload;
    },
    setShowExamConcludedDialog: (state, action) => {
      state.showExamConcludedDialog = action.payload;
    },
    setShowPostExamWarningDialog: (state, action) => {
      state.showPostExamWarningDialog.willShow =
        action.payload.willShow || false;
      state.showPostExamWarningDialog.exam = action.payload.exam;
    },
    setShowDeleteExamDialog: (state, action) => {
      state.showDeleteExamDialog = action.payload;
    },

    setShowDeleteStudentGroupDialog: (state, action) => {
      state.showDeleteStudentGroupDialog = action.payload;
    },
    setShowEditStudentGroupDialog: (state, action) => {
      state.showEditStudentGroupDialog = action.payload;
    },

    setShowDeleteCourseDialog: (state, action) => {
      state.showDeleteCourseDialog = action.payload;
    },
    setShowEditCourseDialog: (state, action) => {
      state.showEditCourseDialog = action.payload;
    },

    setShowDeleteSavedExamDialog: (state, action) => {
      state.showDeleteSavedExamDialog = action.payload;
    },
    setShowSaveExamToDraftDialog: (state, action) => {
      state.showSaveExamToDraftDialog.willShow =
        action.payload.willShow || false;
      state.showSaveExamToDraftDialog.exam = action.payload.exam;
    },

    setShowPurchaseCreditDialog: (state, action) => {
      state.showPurchaseCreditDialog = action.payload;
    },

    setShowSubmitExamWarningDialog: (state, action) => {
      state.showSubmitExamWarningDialog.willShow =
        action.payload.willShow || false;
      state.showSubmitExamWarningDialog.result = action.payload.result;
    },

    setShowDemoDialog: (state, action) => {
      state.setShowDemoDialog.willShow = action.payload.willShow || false;
      state.setShowDemoDialog.result = action.payload.result;
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
  setShowAddStudentToStudentGroupDialog,
  setShowSendmeUpdatesDialog,
  setShowForgotPasswordDialog,
  setShowCheckEmailDialog,
  setShowResetPasswordDialog,
  setShowPasswordUpdatedDialog,
  setShowExamConcludedDialog,
  setShowPostExamWarningDialog,
  setShowDeleteExamDialog,
  setShowDeleteStudentGroupDialog,
  setShowEditStudentGroupDialog,
  setShowDeleteCourseDialog,
  setShowEditCourseDialog,
  setShowDeleteSavedExamDialog,
  setShowSaveExamToDraftDialog,
  setShowPurchaseCreditDialog,
  setShowSubmitExamWarningDialog,
  setShowDemoDialog,
} = uiSlice.actions;
export default uiSlice.reducer;
