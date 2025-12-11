import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const VendorRepairTable = ({ repairs }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("List of Vendor Repairs",14,15);

    autoTable(doc, {
      head: [["Vendor Name","Device Name","In Date","Problem","End Date","Remarks"]],
      body: repairs.map((r)=>[
        r.vendorName,
        r.deviceName,
        r.inDate,
        r.problem,
        r.endDate || "Pending",
        r.remarks || "-",
      ]),
      startY:25,
    });

    doc.save("vendor_repairs.pdf");
  }


  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Vendor Name</th>
            <th className="px-4 py-2 text-left">Device Name</th>
            <th className="px-4 py-2 text-left">In Date</th>
            <th className="px-4 py-2 text-left">Problem</th>
            <th className="px-4 py-2 text-left">End Date</th>
            <th className="px-4 py-2 text-left">Remarks</th>
            <th>
            <button
          onClick={exportToPDF}
          className="bg-gray-100 bold text-left px-4 py-3 rounded hover:bg-black/5 transition active:bg-black/10 transition active:bg-black/10 transition">
          Export</button>
            </th>
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
                <td className="px-4 py-3">{repair.vendorName || "-"}</td>
                <td className="px-4 py-3">{repair.deviceName}</td>
                <td className="px-4 py-3">{repair.inDate || "-"}</td>
                <td className="px-4 py-3">{repair.problem}</td>
                <td className="px-4 py-3">{repair.endDate || "Pending"}</td>
                <td className="px-4 py-3">{repair.remarks || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VendorRepairTable;
