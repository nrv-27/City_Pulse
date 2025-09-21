import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../services/api";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    campaignName: "",
    campaignStatus: "upcoming",
    campaignDate: new Date(),
    pointsAddedAfterJoining: 0,
  });

  useEffect(() => {
    api.get("/campaign").then((response) => {
      setCampaigns(response.data.data);
    });
  }, []);

  const handleAddCampaign = () => {
    api.post("/campaign", newCampaign).then((response) => {
      setCampaigns([...campaigns, response.data.data]);
      setNewCampaign({
        campaignName: "",
        campaignStatus: "upcoming",
        campaignDate: new Date(),
        pointsAddedAfterJoining: 0,
      });
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Campaigns</h2>

      <div className="mb-6 p-4 bg-white rounded shadow flex flex-col md:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Campaign Name"
          value={newCampaign.campaignName}
          onChange={(e) =>
            setNewCampaign({ ...newCampaign, campaignName: e.target.value })
          }
          className="border p-2 rounded flex-1"
        />
        <DatePicker
          selected={newCampaign.campaignDate}
          onChange={(date) => setNewCampaign({ ...newCampaign, campaignDate: date })}
          className="border p-2 rounded flex-1"
        />
        <select
          value={newCampaign.campaignStatus}
          onChange={(e) =>
            setNewCampaign({ ...newCampaign, campaignStatus: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="number"
          placeholder="Points"
          value={newCampaign.pointsAddedAfterJoining}
          onChange={(e) =>
            setNewCampaign({
              ...newCampaign,
              pointsAddedAfterJoining: parseInt(e.target.value),
            })
          }
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddCampaign}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Campaign
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Participants</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp) => (
              <tr key={camp._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{camp.campaignName}</td>
                <td className="p-2">{camp.campaignStatus}</td>
                <td className="p-2">
                  {new Date(camp.campaignDate).toLocaleDateString()}
                </td>
                <td className="p-2">{camp.participants.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Campaigns;