import React from "react";
import PrayerRequestForm from "@/components/PrayerRequestForm";

const Prayer = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Prayer Request</h1>
        <PrayerRequestForm />
      </div>
    </div>
  );
};

export default Prayer;
