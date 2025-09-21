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
import Register from "./pages/Register"; // Import Register
import Profile from "./pages/Profile";   // Import Profile
import IssueDetail from "./pages/IssueDetail"; // Import IssueDetail
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="p-6 overflow-y-auto flex-1">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/issue/:id" element={<IssueDetail />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/profile" element={<Profile />} />
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