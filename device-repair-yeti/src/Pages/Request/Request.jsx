import React, { useState } from "react";
import { Header } from "../../Components/Header";
import { SideNav } from "../../Components/SideNav";
import RequestTable from "./RequestTable";
import RequestAddPanel from "./RequestAddPanel";
import { getRequests, addRequest } from "../../data/requestDummyData";
import "./Request.css";

export function Request() {
  const [requests, setRequests] = useState(getRequests());
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddRequest = (newRequest) => {
    addRequest(newRequest);
    setRequests(getRequests());
  };

  return (
    <>
      <Header />
      <div className="page-container">
        <SideNav />
        <div className="main-content">
          <div className="p-6 relative">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Device Requests</h1>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <span className="text-xl">+</span> Add Request
                </button>
              </div>

              <RequestTable requests={requests} />
            </div>

            <RequestAddPanel
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onAdd={handleAddRequest}
            />
          </div>
        </div>
      </div>
    </>
  );
}
