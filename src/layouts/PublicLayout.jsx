import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/public/Navbar.jsx";
import Footer from "../components/public/Footer.jsx";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
