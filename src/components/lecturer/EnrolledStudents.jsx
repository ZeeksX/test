import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import { FiCopy, FiHelpCircle, FiMoreVertical, FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowDeleteStudentGroupDialog,
  setShowEditStudentGroupDialog,
  setShowShareStudentGroupLinkDialog,
} from "../../features/reducers/uiSlice";
import CustomButton from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/Dropdown";
import Toast from "../modals/Toast";
import { IoChevronBack } from "react-icons/io5";
import {
  DeleteStudentGroupDialog,
  EditStudentGroup,
} from "./StudentGroupDialogs";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/Tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { copyToClipboard } from "../../utils/minorUtilities";
import { fetchStudentGroupDetails } from "../../features/reducers/examRoomSlice";
import { Loader } from "../ui/Loader";

const EnrolledStudents = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const dispatch = useDispatch();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { studentGroup: group, loading } = useSelector(
    (state) => state.examRooms
  );

  useEffect(() => {
    if (groupId) {
      dispatch(fetchStudentGroupDetails({ id: groupId }));
    }
  }, [groupId, dispatch]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const copyItem = async (text) => {
    try {
      const success = await copyToClipboard(text);
      if (success) {
        showToast("Copied to clipboard", "success");
      } else {
        showToast("Failed to copy to clipboard. Please try again.", "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", severity: "info" });
  };

  if (loading) {
    return <Loader />;
  }

  if (!group && !loading) {
    navigate(-1);
    return <div>No group data available</div>;
  }

  return (
    <div className="p-4 bg-[#F9F9F9] min-h-[calc(100dvh_-_64px)]">
      <div className="flex flex-wrap gap-4 justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex gap-4">
            <Link
              to={-1}
              className="rounded-full w-8 hover:bg-[#EAECF0] bg-transparent flex items-center justify-center hover:text-primary-main"
            >
              <IoChevronBack size={24} />
            </Link>
            <h1 className="text-[32px] font-inter font-normal leading-8">
              {group.name}
            </h1>
          </div>
          <p className="text-[#667085] max-w-xl font-inter text-sm opacity-80 font-normal leading-8">
            {group.description}
          </p>
        </div>
        <div className="flex flex-1 gap-4 items-start justify-end">
          <div className="flex flex-wrap gap-4 max-md:mr-2">
            <TooltipProvider>
              <div
                disabled
                className="px-4 flex-1 min-w-[250px] py-2 rounded flex items-center justify-between gap-2 border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <div className="flex font-medium text-sm">
                  Invite Code: {group.invite_code}
                </div>
                <button onClick={() => copyItem(group.invite_code)}>
                  <FiCopy color="#155EEF" />
                </button>
                <Tooltip>
                  <TooltipTrigger>
                    <FiHelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-gray-900 text-white text-left p-3 rounded-lg max-w-xs"
                  >
                    <p className="font-semibold mb-1 mr-auto">Invite Code</p>
                    <p className="text-sm mb-2">
                      This is the unique code that allows students to join your
                      group.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <CustomButton
              variant="clear"
              onClick={() =>
                dispatch(
                  setShowShareStudentGroupLinkDialog({
                    willShow: true,
                    link: `${window.location.hostname}/exams/groups/join/${group.invite_code}`,
                    code: group.invite_code,
                  })
                )
              }
              className="bg-[#FFFFFF] gap-2 border shadow-[0_1px_2px_rgba(16,24,40,0.05)] text-[black] h-[44px] flex items-center justify-center font-inter font-medium text-sm rounded-lg px-4 flex-1"
            >
              Share
              <FiUpload />
            </CustomButton>
            {/* <CustomButton
              as="link"
              to="results"
              className="min-w-[150px] flex-1"
            >
              View Results
            </CustomButton> */}
          </div>
          <div className="flex items-end justify-end gap-4 max-md:mr-2">
            <DropdownMenu>
              <button
                onClick={toggleDropdown}
                className="rounded-lg hover:bg-[#EAECF0] bg-transparent flex items-center justify-center !p-3"
              >
                <FiMoreVertical className="text-[#667085]" />
              </button>
              <DropdownMenuContent
                className="!w-[200px]"
                open={isOpen}
                setOpen={setIsOpen}
                align="start"
              >
                <DropdownMenuItem>
                  <button
                    className="w-full h-full px-4 py-2 flex items-center justify-start"
                    onClick={() => {
                      dispatch(setShowEditStudentGroupDialog(true));
                    }}
                  >
                    Update Student Group
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button
                    className="w-full h-full px-4 py-2 flex items-center justify-start"
                    onClick={() => {
                      dispatch(setShowDeleteStudentGroupDialog(true));
                    }}
                  >
                    Delete Student Group
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <hr className="text-[#0d0d0e] border-1 my-4" />

      {/*Enrolled Students */}
      <Outlet />

      <DeleteStudentGroupDialog title={group.name} id={group.id} />
      <EditStudentGroup group={group} />
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </div>
  );
};

export default EnrolledStudents;
