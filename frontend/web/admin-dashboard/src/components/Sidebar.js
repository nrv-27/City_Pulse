import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8 text-center">CityPulse Admin</h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="hover:bg-gray-700 p-2 rounded">🏠 Dashboard</Link>
        <Link to="/reports" className="hover:bg-gray-700 p-2 rounded">📊 Reports</Link>
        <Link to="/map" className="hover:bg-gray-700 p-2 rounded">🗺️ Map</Link>
        <Link to="/campaigns" className="hover:bg-gray-700 p-2 rounded">📢 Campaigns</Link>
        <Link to="/analytics" className="hover:bg-gray-700 p-2 rounded">📈 Analytics</Link>
        <Link to="/profile" className="hover:bg-gray-700 p-2 rounded">👤 Profile</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
