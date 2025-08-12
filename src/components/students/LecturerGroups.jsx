import React, { useEffect } from "react";
import { MdPeopleOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsStudentGroups } from "../../features/reducers/examRoomSlice";
import { useLocation } from "react-router";
import { useAuth } from "../Auth";
import GroupCard from "./GroupCard";
import CustomButton from "../ui/Button";

const LecturerGroups = () => {
  const location = useLocation();
  const lecturer = location.state.lecturer;
  const {
    studentStudentGroups: groups,
    loading,
    error,
  } = useSelector((state) => state.examRooms);
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchStudentsStudentGroups());
  }, [dispatch]);

  const filteredGroups = groups.filter(
    (group) => group.teacher.id === lecturer.id
  );

  // Get groups where the current student is enrolled
  const studentEnrolledGroups = filteredGroups.filter((group) =>
    group.students.some((student) => student.user_id === user.id)
  );

  return (
    <div className="">
      <div className="p-6 pb-4 max-md:flex-col-reverse flex w-full items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] leading-8 font-medium">
            {lecturer.title} {lecturer.last_name} {lecturer.other_names}
          </h1>
          <p className="text-sm text-[#222222] font-normal">
            See all the student groups enrolled for
          </p>
        </div>
        <CustomButton className="max-md:w-full max-md:mb-4 py-3" as="link" to="/lecturers">
          Back to Teachers
        </CustomButton>
      </div>
      <hr className="text-[#D0D5DD]" />

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : studentEnrolledGroups.length > 0 ? (
          studentEnrolledGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))
        ) : (
          <div>No groups found for this lecturer where you're enrolled</div>
        )}
      </div>
    </div>
  );
};

export default LecturerGroups;
