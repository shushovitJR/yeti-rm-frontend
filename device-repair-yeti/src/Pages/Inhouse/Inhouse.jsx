// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import RepairTable from './RepairTable';
import AddRepairForm from './AddRepairForm';
import { getRepairs, addRepair } from '../../data/dummyData';
import { Header } from "../../Components/Header";
import { SideNav } from '../../Components/SideNav';
import './Inhouse.css';

export function Inhouse(){
   
     const [repairs, setRepairs] = useState(getRepairs());
  const [isFormOpen, setIsFormOpen] = useState(false);



const handleAddRepair = (newRepair) => {
  addRepair(newRepair);
  setRepairs(getRepairs()); 
};


    return(
        <>
            <Header />
            <div className="page-container">
                <SideNav />
                <div className="main-content">
                    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">In-House Repairs</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add Device
          </button>
        </div>

        <RepairTable repairs={repairs} />
      </div>

      <AddRepairForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAdd={handleAddRepair}
      />
                    </div>
                </div>
            </div>
        </>
    );
}