import { useState } from "react";
import { CustomButton } from "../components/ui/Button";
import { logoMobile } from "../utils/images";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { useNavigate } from "react-router";
import { MdOutlineArrowBack } from "react-icons/md";

const ProfilleCustomization = () => {
  const [role, setRole] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [form, setForm] = useState({
    course: "",
    code: "",
  });

  const [isRoleSelected, setIsRoleSelected] = useState(false);
  const [isSchoolSelected, setIsSchoolSelected] = useState(false);
  const [isSubmitted, setIsSubitted] = useState(false)

  const handleSubmit = () => {
    const body = {
      role: role,
      schoolName: schoolName,
      matricNumber: studentNumber,
      form: form,
    };

    console.log(body);
  };

  return (
    <div className="landing flex flex-col items-center lg:justify-center justify-center gap-4 md:gap-2 lg:gap-0 w-full min-h-screen">
      <div className="sign-in flex flex-row w-[80%] md:w-auto lg:w-3/5 max-lg:h-[90vh] lg:h-[93vh]">
        <div className="login relative flex flex-col lg:max-w-screen-lg w-full md:rounded-2xl bg-[white] text-black px-2 md:px-4 lg:px-3 border gap-4 py-2 items-center justify-center">
          {isRoleSelected ? (
            isSchoolSelected ? (
              role == "teacher" ? (
                <CourseCreation
                  onReturn={() => setIsSchoolSelected(false)}
                  form={form}
                  setForm={(form) => setForm(form)}
                  onSubmit={() => handleSubmit()}
                />
              ) : (
                <StudentNumberSelection
                  onReturn={() => setIsSchoolSelected(false)}
                  studentNumber={studentNumber}
                  setStudentNumber={(studentNumber) =>
                    setStudentNumber(studentNumber)
                  }
                  onSubmit={() => handleSubmit()}
                />
              )
            ) : (
              <SchoolSelection
                onSubmit={() => setIsSchoolSelected(true)}
                onReturn={() => setIsRoleSelected(false)}
                schoolName={schoolName}
                setSchoolName={(schoolName) => setSchoolName(schoolName)}
              />
            )
          ) : (
            <RoleSelection
              onSubmit={() => setIsRoleSelected(true)}
              role={role}
              setRole={(role) => setRole(role)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const RoleSelection = ({ onSubmit, role, setRole }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleRoleSelection = () => {
    if (!role || role === "") {
      setErrorMessage("Please select a role");
      return;
    }

    onSubmit();
  };

  return (
    <div className="flex flex-col items-center space-y-5 p-6">
      <img src={logoMobile} className="w-12" alt="" />
      <h2 className="text-xl font-semibold">What is your role?</h2>
      <p className="text-gray-600 text-center text-sm !mt-1">
        How would you be using ACAD AI?
      </p>
      <div className="flex gap-5">
        <button
          className={`px-6 py-2.5 border rounded-md hover:border-primary-main hover:bg-secondary-bg hover:text-primary-main ${
            role === "teacher"
              ? "border-primary-main text-primary-main bg-secondary-bg"
              : ""
          }`}
          onClick={() => {
            setRole("teacher");
            setErrorMessage("");
          }}
        >
          Teacher
        </button>
        <button
          className={`px-6 py-2.5 border rounded-md hover:border-primary-main hover:bg-secondary-bg hover:text-primary-main ${
            role === "student"
              ? "border-primary-main text-primary-main bg-secondary-bg"
              : ""
          }`}
          onClick={() => {
            setRole("student");
            setErrorMessage("");
          }}
        >
          Student
        </button>
      </div>
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      <CustomButton
        type="button"
        size="lg"
        onClick={() => handleRoleSelection()}
        className="w-full bg-gray-400 text-white !mt-6"
      >
        Continue
      </CustomButton>
    </div>
  );
};

const SchoolSelection = ({ onSubmit, onReturn, schoolName, setSchoolName }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSchoolSelection = () => {
    if (!schoolName) {
      setErrorMessage("Please fill in your school’s name");
      return;
    }

    onSubmit();
  };

  return (
    <div className="flex flex-col items-center space-y-5 p-6">
      <button className="absolute top-4 left-4" onClick={() => onReturn()}>
        <MdOutlineArrowBack size={24} />
      </button>
      <img src={logoMobile} className="w-12" alt="" />
      <h2 className="text-xl font-semibold">
        What is the name of your school/institution?
      </h2>
      <p className="text-gray-600 text-center text-sm !mt-1">
        Please fill in your school/institution name
      </p>
      <div className="w-full">
        <Label htmlFor="school_name" className="text-[#666666]">
          Name*
        </Label>
        <Input
          name="school_name"
          id="school_name"
          value={schoolName}
          placeholder="Enter your school’s name"
          autoComplete="school_name"
          error={errorMessage}
          onChange={(event) => {
            setSchoolName(event.target.value);
            setErrorMessage("");
          }}
        />
      </div>
      <CustomButton
        type="button"
        size="lg"
        onClick={() => handleSchoolSelection()}
        className="w-full bg-gray-400 text-white !mt-6"
      >
        Continue
      </CustomButton>
    </div>
  );
};

const CourseCreation = ({ onReturn, form, setForm, onSubmit }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // setTimeout(() => {
    //   navigate("/dashboard");
    // }, 3000);
    onSubmit();
  };

  return (
    <div className="flex flex-col items-center space-y-5 p-6">
      <button className="absolute top-4 left-4" onClick={() => onReturn()}>
        <MdOutlineArrowBack size={24} />
      </button>
      <img src={logoMobile} className="w-12" alt="" />
      <h2 className="text-xl font-semibold">You’re almost there!</h2>
      <p className="text-gray-600 text-center text-sm !mt-1">
        Please complete the form with your title and subject
      </p>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="">
          <Label htmlFor="course" className="text-[#666666]">
            Course
          </Label>
          <Input
            name="course"
            id="course"
            value={form.course}
            placeholder="English Language"
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            required
          />
        </div>
        <div className="">
          <Label htmlFor="course_code" className="text-[#666666]">
            Course code
          </Label>
          <Input
            name="course_code"
            id="course_code"
            value={form.code}
            placeholder="ENG101"
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />
        </div>
        <CustomButton
          type="submit"
          className="w-full bg-gray-400 text-white "
          size="lg"
        >
          Done
        </CustomButton>
      </form>
    </div>
  );
};

const StudentNumberSelection = ({
  onReturn,
  studentNumber,
  setStudentNumber,
  onSubmit,
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSchoolSelection = () => {
    if (!studentNumber) {
      setErrorMessage("Please fill in your school’s name");
      return;
    }

    onSubmit();
  };

  return (
    <div className="flex flex-col items-center space-y-5 p-6">
      <button className="absolute top-4 left-4" onClick={() => onReturn()}>
        <MdOutlineArrowBack size={24} />
      </button>
      <img src={logoMobile} className="w-12" alt="" />
      <h2 className="text-xl font-semibold">Student information</h2>
      <p className="text-gray-600 text-center text-sm !mt-1">
        Please fill in your student/matriculation number
      </p>
      <div className="w-full">
        <Label htmlFor="student_number" className="text-[#666666]">
          Student Number*
        </Label>
        <Input
          name="student_number"
          id="student_number"
          value={studentNumber}
          placeholder="Enter your student number"
          autoComplete="student_number"
          error={errorMessage}
          onChange={(event) => {
            setStudentNumber(event.target.value);
            setErrorMessage("");
          }}
        />
      </div>
      <CustomButton
        type="button"
        size="lg"
        onClick={() => handleSchoolSelection()}
        className="w-full bg-gray-400 text-white !mt-6"
      >
        Done
      </CustomButton>
    </div>
  );
};

export default ProfilleCustomization;
