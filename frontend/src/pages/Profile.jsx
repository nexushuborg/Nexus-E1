import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  return (
    <>
      <Navbar />
      <p className="text-2xl font-bold p-5 text-center">
        Welcome To Profile Page
      </p>
      <Footer />
    </>
  );
}
