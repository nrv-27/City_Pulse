import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const statusIcons = {
  pending: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828665.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -35],
  }),
  inprogress: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3523/3523063.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -35],
  }),
  resolved: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -35],
  }),
};

const dummyReports = [
  {
    id: 1,
    title: "Pothole on Main St",
    description: "Large pothole near 5th Avenue",
    category: "Road",
    status: "pending",
    address: "5th Avenue, City Center",
    department: "Public Works",
    lat: 28.6139,
    lng: 77.209,
    date: "2025-09-19",
  },
  {
    id: 2,
    title: "Streetlight not working",
    description: "Lamp post flickering near Park Lane",
    category: "Electricity",
    status: "inprogress",
    address: "Park Lane, City Center",
    department: "Electric Department",
    lat: 28.6145,
    lng: 77.208,
    date: "2025-09-18",
  },
  {
    id: 3,
    title: "Overflowing garbage",
    description: "Garbage not collected near Market Street",
    category: "Sanitation",
    status: "resolved",
    address: "Market Street, City Center",
    department: "Sanitation",
    lat: 28.615,
    lng: 77.207,
    date: "2025-09-17",
  },
];

const MapPage = () => {
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredReports =
    filterStatus === "all"
      ? dummyReports
      : dummyReports.filter((r) => r.status === filterStatus);

  return (
    <div className="h-full w-full">
      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setFilterStatus("all")} className="bg-gray-300 px-4 py-2 rounded">All</button>
        <button onClick={() => setFilterStatus("pending")} className="bg-red-500 text-white px-4 py-2 rounded">Pending</button>
        <button onClick={() => setFilterStatus("inprogress")} className="bg-yellow-500 text-white px-4 py-2 rounded">In-Progress</button>
        <button onClick={() => setFilterStatus("resolved")} className="bg-green-500 text-white px-4 py-2 rounded">Resolved</button>
      </div>

      <MapContainer center={[28.6139, 77.209]} zoom={14} scrollWheelZoom className="h-[600px] w-full rounded shadow">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {filteredReports.map((report) => (
          <Marker key={report.id} position={[report.lat, report.lng]} icon={statusIcons[report.status]}>
            <Popup>
              <div>
                <h2 className="font-bold">{report.title}</h2>
                <p>{report.description}</p>
                <p><strong>Status:</strong> {report.status}</p>
                <p><strong>Address:</strong> {report.address}</p>
                <p><strong>Department:</strong> {report.department}</p>
                <p><strong>Date:</strong> {report.date}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
