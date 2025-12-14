// import jsPDF from "jspdf";
// import "jspdf-autotable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const RequestTable = ({ requests }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("List of Requests", 14, 15);

    autoTable(doc, {
      head: [["Name", "Device Name", "Date" , "Request From", "Description"]],
      body: requests.map((r) => [
        r.name,
        r.deviceName,
        r.requestDate,
        r.requestFrom,
        r.description,
      ]),
      startY: 25,
    });

    doc.save("requests.pdf");
  };

  return (

    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Device Name</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Request From</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th>
            <button
          onClick={exportToPDF}
          className="bg-gray-100 bold text-left px-4 py-3 rounded hover:bg-black/5 transition active:bg-black/10 transition active:bg-black/10 transition">
          Export</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No requests added yet.
              </td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr key={request.id} className="border-t">
                <td className="px-4 py-3">{request.name}</td>
                <td className="px-4 py-3">{request.deviceName}</td>
                <td className="px-4 py-3">{request.requestDate}</td>
                <td className="px-4 py-3">{request.requestFrom}</td>
                <td className="px-4 py-3">{request.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
