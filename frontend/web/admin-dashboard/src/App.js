import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import MapPage from "./pages/Map";
import Campaigns from "./pages/Campaigns";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Sample reports data
const reports = [
  { id: 1, status: "pending", department: "Sanitation" },
  { id: 2, status: "resolved", department: "Traffic" },
  { id: 3, status: "inprogress", department: "Electricity" },
  { id: 4, status: "pending", department: "Sanitation" },
  { id: 5, status: "resolved", department: "Health" },
];

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              {/* Sidebar */}
              <Sidebar />
              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="p-6 overflow-y-auto flex-1">
                  <Routes>
                    <Route path="/" element={<Dashboard reports={reports} />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/analytics" element={<Analytics reports={reports} />} />
                  </Routes>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
