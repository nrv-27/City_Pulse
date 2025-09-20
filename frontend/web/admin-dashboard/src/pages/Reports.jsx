import React, { useState } from "react";

const Reports = () => {
  const initialReports = [
    { id: 1, title: "Pothole on Main Street", address: "Sector 21, Block A", department: "Road Maintenance", status: "Pending" },
    { id: 2, title: "Broken streetlight", address: "Zone 4, Street 12", department: "Electricity", status: "In-Progress" },
    { id: 3, title: "Garbage accumulation", address: "Sector 18, Block B", department: "Sanitation", status: "Resolved" },
  ];

  const departments = ["Road Maintenance", "Electricity", "Sanitation", "Water Supply", "Parks & Gardens"];
  const statuses = ["All", "Pending", "In-Progress", "Resolved"];

  const [reports, setReports] = useState(initialReports);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const updateDepartment = (id, newDept) => {
    setReports(reports.map(r => r.id === id ? { ...r, department: newDept } : r));
  };

  const updateStatus = (id, newStatus) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  // Filtered and searched reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                          r.address.toLowerCase().includes(search.toLowerCase()) ||
                          r.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Reports</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by title, address, or department"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/2"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/4"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left px-4 py-2">ID</th>
            <th className="text-left px-4 py-2">Title</th>
            <th className="text-left px-4 py-2">Address</th>
            <th className="text-left px-4 py-2">Department</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.id} className="hover:bg-gray-100 transition-colors duration-200">
              <td className="px-4 py-2">{report.id}</td>
              <td className="px-4 py-2">{report.title}</td>
              <td className="px-4 py-2">{report.address}</td>
              <td className="px-4 py-2">
                <select
                  value={report.department}
                  onChange={(e) => updateDepartment(report.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2 font-semibold">{report.status}</td>
              <td className="px-4 py-2">
                <select
                  value={report.status}
                  onChange={(e) => updateStatus(report.id, e.target.value)}
                  className="border px-2 py-1 rounded bg-white"
                >
                  {statuses.slice(1).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {filteredReports.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
