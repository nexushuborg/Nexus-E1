import React from "react";

export default function LandingPage() {
  return (
    <main className="flex-grow p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white">
      <div className="rounded-lg p-6 h-64 flex items-center justify-center bg-gray-50">
        <img
          src="/images/Nexus_Logo.jpg"
          alt="Valuable concept"
          className="h-full object-contain"
        />
      </div>
      <div className="rounded-lg p-6 h-64 flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700 leading-relaxed text-left">
          Welcome to <strong>AlgoLog</strong>, your personal algorithm learning
          companion. Explore intuitive visualizations, track your progress, and
          master data structures and algorithms the smart way.
        </p>
      </div>
    </main>
  );
}
