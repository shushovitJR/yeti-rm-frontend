import { useEffect, useState } from "react";
import { Header } from "../../Components/Header";
import { SidePanel } from "./SidePanel";
import { getRepairs } from "../../data/vendorDummyData";
// import repairs from '../../data/vendorDummyData';
import './Vendor.css';

export function Vendor(){
        const [repairs, setRepairs] = useState([]);
        const [isPanelOpen, setIsPanelOpen] = useState(false);

        const loadData = () =>{
            setRepairs(getRepairs());
        };

        useEffect(() => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadData();
        },[]);

    return(
        <>
            <Header />
            <div className="vendor-header">
                <h1 className="text-3xl font-bold text-gray-800">Vendor Repair Page</h1>
                <button
                onClick={() => setIsPanelOpen(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <span className="text-xl">+</span>Add
                </button>
            </div>

            <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSuccess={loadData}
        title="Add New Repair"
      >
        
      </SidePanel>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Device Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">In Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Problem</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Remarks</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vendor Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {repairs.map((repair) =>(
                            <tr key={repair.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-800">{repair.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{repair.deviceName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{repair.inDate || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{repair.problem}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {repair.endDate || "Pending"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{repair.remarks || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{repair.vendorName}</td>
                </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    );
}