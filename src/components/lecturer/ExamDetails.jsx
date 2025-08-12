import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { EmptyState } from "../ui/States";
import {
  ExamHeader,
  ExamInfoGrid,
  StudentGroupTabs,
} from "./ExamDisplayComponents";
import { useCsvExport } from "../../hooks/useCSVExport";
import { useExamDetails } from "../../hooks/useExamDetails";
import {
  calculateTotalScore,
  formatScheduleTime,
  mapQuestions,
} from "../modals/UIUtilities";
import { Loader } from "../ui/Loader";
import Toast from "../modals/Toast";
import StudentResultsTable from "./StudentResultTable";
import { Card } from "../ui/Card";

const ExamDetails = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { exportToCSV } = useCsvExport();

  const {
    exam,
    examSubmissions,
    loading,
    publishing,
    activeStudentGroup,
    studentGroupResults,
    toast,
    closeToast,
    handleStudentGroupChange,
    handlePublish,
  } = useExamDetails(examId);

  // Memoized calculations to prevent unnecessary re-renders [^3]
  const questions = useMemo(
    () => mapQuestions(exam?.questions),
    [exam?.questions]
  );
  const totalScore = useMemo(() => calculateTotalScore(questions), [questions]);
  const startDateTime = useMemo(
    () => formatScheduleTime(exam?.schedule_time),
    [exam?.schedule_time]
  );
  const endDateTime = useMemo(
    () => formatScheduleTime(exam?.due_time),
    [exam?.due_time]
  );

  const handleExport = () => {
    exportToCSV(exam, examSubmissions);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loader />;
  }

  if (!exam) {
    return (
      <EmptyState
        title="Exam not found"
        description="The exam you're looking for doesn't exist or has been removed."
      />
    );
  }

  const renderStudentResults = () => {
    if (!activeStudentGroup) {
      return (
        <EmptyState
          title="You have not selected any student groups"
          description="Select a student group to view the results for that student group"
        />
      );
    }

    if (studentGroupResults.length === 0) {
      return (
        <EmptyState
          title="There are no submissions for this student group"
          description="You will see the submissions once the students turns it in"
        />
      );
    }

    return (
      <StudentResultsTable studentResults={studentGroupResults} exam={exam} />
    );
  };

  return (
    <div className="bg-[#F9F9F9] h-max p-4">
      <Card className="w-full bg-white rounded-xl">
        <ExamHeader
          title={exam.title}
          onBack={handleBack}
          onExport={handleExport}
          onPublish={handlePublish}
          publishing={publishing}
        />

        <ExamInfoGrid
          exam={exam}
          questions={questions}
          totalScore={totalScore}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
        />
      </Card>

      <StudentGroupTabs
        examRooms={examSubmissions?.exam_rooms}
        activeStudentGroup={activeStudentGroup}
        onGroupChange={handleStudentGroupChange}
      />

      <div className="h-[calc(100%_-_168px)]">{renderStudentResults()}</div>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </div>
  );
};

export default ExamDetails;
