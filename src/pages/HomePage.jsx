import React, { useEffect, useState } from "react";
import SidebarWithRoleControl from "../components/SidebarWithRoleControl";
import { AuthProvider, useAuth } from "../components/Auth";
import DynamicTopNav from "../components/topnav/DynamicTopNav";
import { Outlet } from "react-router";
import {
  AddNewStudentToStudentGroupDialog,
  CreateExaminationRoom,
  CreateStudentGroup,
  JoinStudentGroupDialog,
  LeaveStudentGroupDialog,
  ShareStudentGroupLinkDialog,
} from "../components/courses/CourseComponents";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const role = user?.role || "guest";

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="w-full h-full sm:overflow-hidden">
      <AuthProvider>
        <DynamicTopNav sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="home-page mt-[64px] flex sm:flex-row flex-col w-full h-[calc(100%_-_64px)]">
          {/* Sidebar for larger screens - no logo */}
          <div className="hidden md:flex w-[264px]">
            <SidebarWithRoleControl role={role} showLogo={false} />
          </div>

          {/* Mobile sidebar overlay - with logo */}
          {sidebarOpen && (
            <div
              className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
              onClick={toggleSidebar}
            >
              <div
                className="w-[264px] h-full bg-white"
                onClick={(e) => e.stopPropagation()}
              >
                <SidebarWithRoleControl role={role} showLogo={true} toggleSidebar={toggleSidebar}/>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 h-[calc(100dvh_-_64px)] overflow-auto w-full">
            <Outlet />
          </div>
        </div>

        {/* Dialogs */}
        <CreateExaminationRoom />
        <CreateStudentGroup />
        <JoinStudentGroupDialog />
        <LeaveStudentGroupDialog />
        <ShareStudentGroupLinkDialog />
        <AddNewStudentToStudentGroupDialog />
      </AuthProvider>
    </div>
  );
};

export default HomePage;
