import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExamDetails,
  fetchExamSubmissions,
} from "../features/reducers/examSlice";
import apiCall from "../utils/apiCall";

export function useExamDetails(examId) {
  const dispatch = useDispatch();
  const { exam, examSubmissions, loading } = useSelector(
    (state) => state.exams
  );

  const [publishing, setPublishing] = useState(false);
  const [activeStudentGroup, setActiveStudentGroup] = useState("");
  const [studentGroupResults, setStudentGroupResults] = useState([]);
  const [currentExamId, setCurrentExamId] = useState(null);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (examId !== currentExamId) {
      // Clear previous exam data immediately
      setActiveStudentGroup("");
      setStudentGroupResults([]);
      setPublishing(false);
      setCurrentExamId(examId);

      // Fetch new exam data
      if (examId) {
        dispatch(fetchExamDetails({ id: examId }));
        dispatch(fetchExamSubmissions({ examid: examId }));
      }
    }
  }, [dispatch, examId, currentExamId]);

  useEffect(() => {
    // Only process if this data belongs to the current exam
    if (examSubmissions?.exam_rooms?.length > 0 && examId === currentExamId) {
      const firstGroupId = examSubmissions.exam_rooms[0].id;
      setActiveStudentGroup(firstGroupId);
      const firstGroupResults = examSubmissions.results.filter(
        (result) => result.student.exam_room.id === firstGroupId
      );
      setStudentGroupResults(firstGroupResults);
    }
  }, [examSubmissions, examId, currentExamId]);

  const showToast = useCallback((message, severity) => {
    setToast({ open: true, message, severity });
  }, []);

  const closeToast = useCallback(() => {
    setToast({ open: false, message: "", severity: "info" });
  }, []);

  const handleStudentGroupChange = useCallback(
    (groupId) => {
      setActiveStudentGroup(groupId);
      setStudentGroupResults(
        examSubmissions.results.filter(
          (result) => result.student.exam_room.id === groupId
        )
      );
    },
    [examSubmissions]
  );

  const handlePublish = useCallback(async () => {
    if (!exam?.due_time) return;

    const isPastDue = new Date() > new Date(exam.due_time);

    if (!isPastDue) {
      showToast(
        "You can only publish the results of an exam after the due time",
        "error"
      );
      return;
    }

    setPublishing(true);
    try {
      const response = await apiCall.patch(`/exams/results/approve/${examId}/`);
      if (response.status === 201 || response.status === 200) {
        showToast("Exam approved successfully", "success");
      }
    } catch (error) {
      showToast("Failed to publish exam. Please try again.", "error");
      console.error("Error publishing exam:", error);
    } finally {
      setPublishing(false);
    }
  }, [exam?.due_time, examId, showToast]);

  // Return loading state if we're switching exams or if data doesn't match current exam
  const isLoadingOrSwitching =
    loading || (exam?.id && exam.id.toString() !== examId);

  return {
    exam: isLoadingOrSwitching ? null : exam,
    examSubmissions: isLoadingOrSwitching ? null : examSubmissions,
    loading: isLoadingOrSwitching,
    publishing,
    activeStudentGroup,
    studentGroupResults,
    toast,
    showToast,
    closeToast,
    handleStudentGroupChange,
    handlePublish,
  };
}
