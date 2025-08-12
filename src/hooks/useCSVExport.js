import { useCallback } from "react";

export function useCsvExport() {
  const exportToCSV = useCallback((exam, examSubmissions) => {
    if (!exam || !examSubmissions?.results) return;

    // CSV headers
    const headers = ["Name", "Matric Number", `${exam.exam_type}_Score`];

    // CSV rows
    const csvData = examSubmissions.results.map((student) => [
      `${student.student.last_name}, ${student.student.other_names}`,
      student.student.matric_number,
      student.score === null ? "Not Graded" : student.score,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${exam.title}_student_results_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, []);

  return { exportToCSV };
}
