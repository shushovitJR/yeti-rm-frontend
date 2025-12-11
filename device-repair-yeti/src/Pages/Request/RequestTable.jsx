const RequestTable = ({ requests }) => {


  return (

    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Device Name</th>
            <th className="px-4 py-2 text-left">Request From</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="py-2"><button
          // onClick={exportToCSV}
          className="bg-gray-100 text-black px-4 py-2 rounded hover:bg-black/5 transition">
          Export</button></th>
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
