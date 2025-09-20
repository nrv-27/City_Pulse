import React, { useState } from "react";
import { ClipboardList, Loader2, CheckCircle2 } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");

  // Sample data arrays
  const pendingIssues = [
    "Pothole reported at Sector 21",
    "Garbage not collected in Zone 4",
  ];
  const inProgressIssues = [
    "Streetlight repair ongoing in Sector 12",
    "Drainage work started in Zone 2",
  ];
  const resolvedIssues = [
    "Water leakage fixed in Sector 18",
    "Road repaired in Zone 7",
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "pending":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-yellow-600">
              <ClipboardList className="mr-2" /> Pending Issues (
              {pendingIssues.length})
            </h2>
            <ul className="space-y-3">
              {pendingIssues.map((issue, idx) => (
                <li
                  key={idx}
                  className="p-3 bg-yellow-50 rounded shadow flex items-center"
                >
                  🕑 {issue}
                </li>
              ))}
            </ul>
          </div>
        );
      case "progress":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-600">
              <Loader2 className="mr-2 animate-spin" /> In-Progress Issues (
              {inProgressIssues.length})
            </h2>
            <ul className="space-y-3">
              {inProgressIssues.map((issue, idx) => (
                <li
                  key={idx}
                  className="p-3 bg-blue-50 rounded shadow flex items-center"
                >
                  🔧 {issue}
                </li>
              ))}
            </ul>
          </div>
        );
      case "resolved":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-green-600">
              <CheckCircle2 className="mr-2" /> Resolved Issues (
              {resolvedIssues.length})
            </h2>
            <ul className="space-y-3">
              {resolvedIssues.map((issue, idx) => (
                <li
                  key={idx}
                  className="p-3 bg-green-50 rounded shadow flex items-center"
                >
                  ✅ {issue}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        CityPulse Admin Dashboard
      </h1>

      {/* Total summary */}
      <div className="flex space-x-6 mb-6">
        <div className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded shadow font-semibold">
          Pending: {pendingIssues.length}
        </div>
        <div className="bg-blue-200 text-blue-800 px-4 py-2 rounded shadow font-semibold">
          In-Progress: {inProgressIssues.length}
        </div>
        <div className="bg-green-200 text-green-800 px-4 py-2 rounded shadow font-semibold">
          Resolved: {resolvedIssues.length}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center px-4 py-2 rounded-t-lg ${
            activeTab === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <ClipboardList className="mr-2" /> Pending ({pendingIssues.length})
        </button>

        <button
          onClick={() => setActiveTab("progress")}
          className={`flex items-center px-4 py-2 rounded-t-lg ${
            activeTab === "progress"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <Loader2 className="mr-2" /> In-Progress ({inProgressIssues.length})
        </button>

        <button
          onClick={() => setActiveTab("resolved")}
          className={`flex items-center px-4 py-2 rounded-t-lg ${
            activeTab === "resolved"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <CheckCircle2 className="mr-2" /> Resolved ({resolvedIssues.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
