import { useParams } from "react-router";

const CourseExamRoom = () => {
  const { roomId } = useParams();

  return <div>{roomId}</div>;
};

export default CourseExamRoom;
