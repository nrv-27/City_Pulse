import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = ({ reports }) => {
  // State for filters
  const [selectedDept, setSelectedDept] = useState("All");
  const [filteredReports, setFilteredReports] = useState(reports);

  // Calculate counts
  const pendingCount = filteredReports.filter(r => r.status === "pending").length;
  const inProgressCount = filteredReports.filter(r => r.status === "in_progress").length;
  const resolvedCount = filteredReports.filter(r => r.status === "resolved").length;
  const totalCount = filteredReports.length;

  // Prepare chart data
  const departments = [...new Set(reports.map(r => r.department))];
  
  const barData = departments.map(dept => {
    const deptReports = filteredReports.filter(r => r.department === dept);
    return {
      name: dept,
      Pending: deptReports.filter(r => r.status === "pending").length,
      InProgress: deptReports.filter(r => r.status === "in_progress").length,
      Resolved: deptReports.filter(r => r.status === "resolved").length,
    };
  });

  const pieData = [
    { name: "Pending", value: pendingCount },
    { name: "In Progress", value: inProgressCount },
    { name: "Resolved", value: resolvedCount },
  ];

  const COLORS = ["#FFBB28", "#0088FE", "#00C49F"];

  // Filter by department
  useEffect(() => {
    if (selectedDept === "All") setFilteredReports(reports);
    else setFilteredReports(reports.filter(r => r.department === selectedDept));
  }, [selectedDept, reports]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics & Insights</h1>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="font-semibold">Department:</label>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <p className="font-bold text-lg">Pending</p>
          <p className="text-2xl">{pendingCount}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="font-bold text-lg">In Progress</p>
          <p className="text-2xl">{inProgressCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <p className="font-bold text-lg">Resolved</p>
          <p className="text-2xl">{resolvedCount}</p>
        </div>
        <div className="bg-gray-200 p-4 rounded shadow text-center">
          <p className="font-bold text-lg">Total Reports</p>
          <p className="text-2xl">{totalCount}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Issues by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Pending" fill="#FFBB28" />
              <Bar dataKey="InProgress" fill="#0088FE" />
              <Bar dataKey="Resolved" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Issues Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
