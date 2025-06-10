import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import apiCall from "../utils/apiCall";
import Toast from "../components/modals/Toast";
import { Loader } from "../components/ui/Loader";
import { sleep } from "../utils/minorUtilities";

const JoinStudentGroup = () => {
  const { invite_code } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const joinStudentGroup = async () => {
      setJoining(true);

      try {
        const response = await apiCall.post(
          `/exams/groups/join/${invite_code}/`
        );

        if (response.status === 201 || response.status === 200) {
          showToast(`You have joined the student group`, "success");
          await sleep(1000);
          navigate("/dashboard");
        }
      } catch (error) {
        showToast("Failed to join group. Please try again.", "error");
        console.error("Error sending code:", error);
        await sleep(1000);
        navigate("/dashboard");
      } finally {
        setJoining(false);
      }
    };

    joinStudentGroup();
  }, [invite_code, navigate]);

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  return (
    <div className="w-screen h-screen">
      {joining && <Loader />}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </div>
  );
};

export default JoinStudentGroup;
