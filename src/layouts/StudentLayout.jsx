import React from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/student/StudentSidebar.jsx";

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen bg-white font-['Lexend']">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-10 lg:p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;