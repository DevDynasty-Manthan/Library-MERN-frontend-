import React from "react";
import Navbar from "../components/navigation/Navbar.jsx";

const PublicLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-ash-grey-50">
      <Navbar />

      {/* Main content scrolls, header stays sticky */}
      <main className="flex-1 w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;
