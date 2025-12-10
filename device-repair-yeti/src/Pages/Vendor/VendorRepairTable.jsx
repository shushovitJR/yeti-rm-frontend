// import React from 'react';

const VendorRepairTable = ({ repairs }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Device Name</th>
            <th className="px-4 py-2 text-left">In Date</th>
            <th className="px-4 py-2 text-left">Problem</th>
            <th className="px-4 py-2 text-left">End Date</th>
            <th className="px-4 py-2 text-left">Remarks</th>
            <th className="px-4 py-2 text-left">Vendor Name</th>
          </tr>
        </thead>
        <tbody>
          {repairs.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No repairs added yet.
              </td>
            </tr>
          ) : (
            repairs.map((repair) => (
              <tr key={repair.id} className="border-t">
                <td className="px-4 py-3">{repair.deviceName}</td>
                <td className="px-4 py-3">{repair.inDate || "-"}</td>
                <td className="px-4 py-3">{repair.problem}</td>
                <td className="px-4 py-3">{repair.endDate || "Pending"}</td>
                <td className="px-4 py-3">{repair.remarks || "-"}</td>
                <td className="px-4 py-3">{repair.vendorName || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VendorRepairTable;
