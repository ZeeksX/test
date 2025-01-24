import React, { useEffect, useState } from "react";
import SidebarWithRoleControl from "../components/SidebarWithRoleControl";
import Container from "../components/Container";
import { AuthProvider } from "../components/Auth";
import TopNav from "../components/topnav/TopNav";
import DynamicTopNav from "../components/topnav/DynamicTopNav";

const HomePage = ({ sidebarOpen, toggleSidebar }) => {
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    setScrolling(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full h-full sm:overflow-hidden">
      <AuthProvider>
        {/* Top navbar for small screens */}
        <DynamicTopNav
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="home-page flex sm:flex-row flex-col w-full h-[calc(100%_-_64px)]">
          {/* Sidebar for larger screens */}
          <div className="hidden sm:flex w-[264px] border-r-[4px] border-r-border-main">
            <SidebarWithRoleControl />
          </div>

          {/* Main content container */}
          {!sidebarOpen && (
            <div
              className={`flex-1 w-full ${
                scrolling ? "pt-14" : ""
              } transition-padding duration-100`}
            >
              <Container />
            </div>
          )}
        </div>
      </AuthProvider>
    </div>
  );
};

export default HomePage;
