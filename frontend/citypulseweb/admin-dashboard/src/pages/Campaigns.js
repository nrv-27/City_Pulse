import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Sample reports (replace with API or DB in real use)
const initialReports = [
  { id: 1, title: "Pothole on Main St", assignedCampaign: null, points: 10 },
  { id: 2, title: "Broken streetlight", assignedCampaign: null, points: 5 },
  { id: 3, title: "Garbage pile near park", assignedCampaign: null, points: 15 },
];

// Initial campaigns
const initialCampaigns = [
  { id: 1, name: "Sanitation Awareness", status: "Active", participants: 0, points: 0, date: null, area: "" },
  { id: 2, name: "Road Safety", status: "Active", participants: 0, points: 0, date: null, area: "" },
];

function Campaigns() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [reports, setReports] = useState(initialReports);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    status: "Active",
    date: new Date(),
    area: "",
  });

  // Add a new campaign
  const handleAddCampaign = () => {
    if (!newCampaign.name || !newCampaign.area) return;
    setCampaigns([
      ...campaigns,
      {
        ...newCampaign,
        id: campaigns.length + 1,
        participants: 0,
        points: 0,
      },
    ]);
    setNewCampaign({ name: "", status: "Active", date: new Date(), area: "" });
  };

  // Assign report to a campaign
  const handleAssignReport = (reportId, campaignId) => {
    const updatedReports = reports.map((r) =>
      r.id === reportId ? { ...r, assignedCampaign: campaignId } : r
    );

    const updatedCampaigns = campaigns.map((c) => {
      const reportsInCampaign = updatedReports.filter((r) => r.assignedCampaign === c.id);
      return {
        ...c,
        participants: reportsInCampaign.length,
        points: reportsInCampaign.reduce((sum, r) => sum + r.points, 0),
      };
    });

    setReports(updatedReports);
    setCampaigns(updatedCampaigns);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Campaigns</h2>

      {/* Add New Campaign */}
      <div className="mb-6 p-4 bg-white rounded shadow flex flex-col md:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Campaign Name"
          value={newCampaign.name}
          onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
          className="border p-2 rounded flex-1"
        />

        <input
          type="text"
          placeholder="Campaign Area / Address"
          value={newCampaign.area}
          onChange={(e) => setNewCampaign({ ...newCampaign, area: e.target.value })}
          className="border p-2 rounded flex-1"
        />

        <DatePicker
          selected={newCampaign.date}
          onChange={(date) => setNewCampaign({ ...newCampaign, date })}
          className="border p-2 rounded flex-1"
        />

        <select
          value={newCampaign.status}
          onChange={(e) => setNewCampaign({ ...newCampaign, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
        </select>

        <button
          onClick={handleAddCampaign}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Campaign
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded shadow overflow-x-auto mb-6">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Area</th>
              <th className="p-2">Participants</th>
              <th className="p-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp) => (
              <tr key={camp.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{camp.name}</td>
                <td className="p-2">{camp.status}</td>
                <td className="p-2">{camp.date ? camp.date.toLocaleDateString() : "-"}</td>
                <td className="p-2">{camp.area}</td>
                <td className="p-2">{camp.participants}</td>
                <td className="p-2">{camp.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reports Assignment */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-xl font-semibold mb-2">Assign Reports to Campaigns</h3>
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center gap-2 mb-2 p-2 border rounded hover:bg-gray-50"
          >
            <span className="flex-1">{report.title} ({report.points} pts)</span>
            <select
              value={report.assignedCampaign || ""}
              onChange={(e) => handleAssignReport(report.id, parseInt(e.target.value))}
              className="border p-1 rounded"
            >
              <option value="">Select Campaign</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Campaigns;
