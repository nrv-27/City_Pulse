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
import api from "../services/api";

const Analytics = () => {
  const [issuesByCategory, setIssuesByCategory] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/dashboard/issues-by-category").then((response) => {
      setIssuesByCategory(response.data.data);
    });
    api.get("/dashboard/stats").then((response) => {
      setStats(response.data.data);
    });
  }, []);

  const pieData = [
    { name: "Pending", value: stats.pendingIssues },
    { name: "In Progress", value: stats.inProgress },
    { name: "Resolved", value: stats.resolvedIssues },
  ];

  const COLORS = ["#FFBB28", "#0088FE", "#00C49F"];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics & Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Issues by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issuesByCategory}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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