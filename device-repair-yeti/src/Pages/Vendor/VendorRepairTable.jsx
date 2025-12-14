import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useMemo, useRef, useEffect } from "react";

const VendorRepairTable = ({ repairs }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const displayedRepairs = useMemo(() => {
    if (!startDate && !endDate) return repairs;
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;
    return repairs.filter((r) => {
      if (!r.inDate) return false;
      const d = new Date(r.inDate);
      if (s && d < s) return false;
      if (e && d > e) return false;
      return true;
    });
  }, [repairs, startDate, endDate]);

  // Pagination based on max container height
  const PAGE_MAX_HEIGHT = 250; // px
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
  }, [startDate, endDate, repairs]);

  const pageCount = Math.max(1, Math.ceil(displayedRepairs.length / rowsPerPage));
  const pagedRepairs = displayedRepairs.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("List of Vendor Repairs",14,15);

    autoTable(doc, {
      head: [["Vendor Name","Device Name","In Date","Problem","End Date","Remarks"]],
      body: displayedRepairs.map((r)=>[
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
      {/* sample row for measuring */}
      {/* <table style={{ position: 'absolute', left: -9999, top: -9999 }} aria-hidden>
        <tbody>
          <tr ref={sampleRowRef} className="border-t">
            <td className="px-4 py-3">Sample</td>
            <td className="px-4 py-3">Sample Device</td>
            <td className="px-4 py-3">2020-01-01</td>
            <td className="px-4 py-3">Problem</td>
            <td className="px-4 py-3">-</td>
            <td className="px-4 py-3">-</td>
          </tr>
        </tbody>
      </table> */}

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
              <div style={{ position: "relative" }}>
                <button 
                className="bg-gray-100 bold px-4 py-3 rounded hover:bg-black/5 transition active:bg-black/10 transition active:bg-black/10 transition"
                onClick={() => setShowFilter((v) => !v)} aria-label="Toggle filter">
                  <i className="fa-solid fa-filter"></i>
                </button>
                {showFilter && (
                  <div
                    className="filter-panel"
                    style={{
                      position: "absolute",
                      top: "30px",
                      left: 0,
                      background: "white",
                      border: "1px solid #ddd",
                      padding: "8px",
                      zIndex: 20,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "12px" }}>
                        From
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                      </label>
                      <label style={{ fontSize: "12px" }}>
                        To
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                      </label>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => {
                            setStartDate("");
                            setEndDate("");
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
            </th>
            <th>
            <button
          onClick={exportToPDF}
          className="bg-gray-100 bold text-left px-4 py-3 rounded hover:bg-black/5 transition active:bg-black/10 transition active:bg-black/10 transition">
          Export</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {pagedRepairs.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No repairs added yet.
              </td>
            </tr>
          ) : (
            pagedRepairs.map((repair) => (
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

export default VendorRepairTable;
