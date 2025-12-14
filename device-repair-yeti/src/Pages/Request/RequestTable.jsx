// import jsPDF from "jspdf";
// import "jspdf-autotable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useMemo, useRef, useEffect } from "react";


const RequestTable = ({ requests }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const displayedRequests = useMemo(() => {
    if (!startDate && !endDate) return requests;
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;
    return requests.filter((r) => {
      if (!r.requestDate) return false;
      const d = new Date(r.requestDate);
      if (s && d < s) return false;
      if (e && d > e) return false;
      return true;
    });
  }, [requests, startDate, endDate]);

  // Pagination
  const PAGE_MAX_HEIGHT = 200; // px
  const sampleRowRef = useRef(null);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const measure = () => {
      const sample = sampleRowRef.current;
      if (sample) {
        const rh = sample.getBoundingClientRect().height || 48;
        const rows = Math.max(3, Math.floor(PAGE_MAX_HEIGHT / rh));
        setRowsPerPage(rows);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(0);
  }, [startDate, endDate, requests]);

  const pageCount = Math.max(1, Math.ceil(displayedRequests.length / rowsPerPage));
  const pagedRequests = displayedRequests.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("List of Requests", 14, 15);

    autoTable(doc, {
      head: [["Name", "Device Name", "Date" , "Request From", "Description"]],
      body: displayedRequests.map((r) => [
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

    <div style={{ maxHeight: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }} className="mt-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <button
              className="bg-gray-100 bold px-4 py-3 rounded hover:bg-black/5 transition active:bg-black/10"
              onClick={() => setShowFilter((v) => !v)}
              aria-label="Toggle filter"
            >
              <i className="fa-solid fa-filter"></i>
            </button>
            {showFilter && (
              <div
                className="filter-panel"
                style={{
                  position: 'absolute',
                  top: '40px',
                  left: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  padding: '8px',
                  zIndex: 999,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px' }}>
                    From
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </label>
                  <label style={{ fontSize: '12px' }}>
                    To
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </label>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="px-2 py-1"
                    >
                      Reset
                    </button>
                    <button onClick={() => setShowFilter(false)} className="px-2 py-1">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={exportToPDF}
            className="bg-gray-100 bold text-left px-4 py-3 rounded hover:bg-black/5 transition active:bg-black/10"
          >
            Export
          </button>
        </div>
      </div>

      <div style={{ overflowY: 'auto' }}>
      {/* sample row used for measuring */}
      <table style={{ position: 'absolute', left: -9999, top: -9999 }} aria-hidden>
        <tbody>
          <tr ref={sampleRowRef} className="border-t">
            <td className="px-4 py-3">Sample</td>
            <td className="px-4 py-3">Sample Device</td>
            <td className="px-4 py-3">2020-01-01</td>
            <td className="px-4 py-3">From</td>
            <td className="px-4 py-3">Desc</td>
          </tr>
        </tbody>
      </table>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Device Name</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Request From</th>
            <th className="px-4 py-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {pagedRequests.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No requests added yet.
              </td>
            </tr>
          ) : (
            pagedRequests.map((request) => (
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div style={{ fontSize: 12, color: '#555' }}>
          Showing page {currentPage + 1} of {pageCount}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="px-3 py-1 bg-gray-100 rounded">Prev</button>
          <button onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))} disabled={currentPage >= pageCount - 1} className="px-3 py-1 bg-gray-100 rounded">Next</button>
        </div>
      </div>
    </div>
  );
};

export default RequestTable;
