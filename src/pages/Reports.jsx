import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { reportAPI } from "../services/api";

function Reports() {
  const { addToast } = useToast();

  const [monthlyData, setMonthlyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [deviceCategoryData, setDeviceCategoryData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    repairs: { total: 0, repairtime: 0, percentchange: "0" },
    requests: { total: 0, percentchange: "0" },
  });

  // Detailed Report Tables State
  const [repairTableData, setRepairTableData] = useState([]);
  const [requestTableData, setRequestTableData] = useState([]);
  const [repairCurrentPage, setRepairCurrentPage] = useState(1);
  const [requestCurrentPage, setRequestCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      // console.log('Starting data fetch...');
      
      const [
        repairsMonthly,
        requestsMonthly,
        departmentReqs,
        repairSummary,
        requestSummary,
        repairTableResp,
        requestTableResp,
      ] = await Promise.all([
        reportAPI.getMonthlyRepairs().catch(err => {
          console.error('Monthly repairs error:', err);
          return [];
        }),
        reportAPI.getMonthlyRequests().catch(err => {
          console.error('Monthly requests error:', err);
          return [];
        }),
        reportAPI.getDepartmentRequests().catch(err => {
          console.error('Department requests error:', err);
          return [];
        }),
        reportAPI.getRepairSummary().catch(err => {
          console.error('Repair summary error:', err);
          return {};
        }),
        reportAPI.getRequestSummary().catch(err => {
          console.error('Request summary error:', err);
          return {};
        }),
        reportAPI.getDetailedRepairReport().catch(err => {
          console.error('Detailed repair report error:', err);
          return [];
        }),
        reportAPI.getDetailedRequestReport().catch(err => {
          console.error('Detailed request report error:', err);
          return [];
        }),
      ]);

      // console.log('Data received:', {
      //   repairsMonthly,
      //   requestsMonthly,
      //   departmentReqs,
      //   repairSummary,
      //   requestSummary,
      //   repairTableResp,
      //   requestTableResp,
      // });

      // Process monthly data
      const mergedData = Array.isArray(repairsMonthly) && repairsMonthly.length > 0 
        ? repairsMonthly.map((repairItem) => {
            const requestItem = Array.isArray(requestsMonthly) 
              ? requestsMonthly.find((req) => req.month === repairItem.month)
              : null;

            return {
              month: repairItem.month,
              repairs: repairItem.repairs,
              completed: repairItem.completed + (requestItem?.completed || 0),
              requests: requestItem ? requestItem.requests : 0,
            };
          })
        : [];
      setMonthlyData(mergedData);

      // Process department data with colors
      if (departmentReqs && departmentReqs.length > 0) {
        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];
        const deptDataWithColors = departmentReqs.map((item, index) => ({
          name: item.department || item.name,
          value: item.total || item.value,
          color: colors[index % colors.length],
        }));
        setDepartmentData(deptDataWithColors);
      }

      // Process device category data - separate counts for repairs and requests
      const categoryMap = {};
      if (repairTableResp && repairTableResp.length > 0) {
        repairTableResp.forEach((item) => {
          const category = item.category || "Unknown";
          if (!categoryMap[category]) {
            categoryMap[category] = { category, repairs: 0, requests: 0 };
          }
          categoryMap[category].repairs += item.total || 0;
        });
      }
      if (requestTableResp && requestTableResp.length > 0) {
        requestTableResp.forEach((item) => {
          const category = item.category || item.catgory || "Unknown";
          if (!categoryMap[category]) {
            categoryMap[category] = { category, repairs: 0, requests: 0 };
          }
          categoryMap[category].requests += item.total || 0;
        });
      }
      setDeviceCategoryData(Object.values(categoryMap));

      // Process summary data
      setSummaryData({
        repairs: repairSummary && typeof repairSummary === 'object' 
          ? repairSummary 
          : { total: 0, repairtime: 0, percentchange: "0" },
        requests: requestSummary && typeof requestSummary === 'object' 
          ? requestSummary 
          : { total: 0, percentchange: "0" },
      });

      // Set table data
      setRepairTableData(Array.isArray(repairTableResp) ? repairTableResp : []);
      setRequestTableData(Array.isArray(requestTableResp) ? requestTableResp : []);
      
      // console.log('Data processing complete');
    } catch (error) {
      console.error('Fetch error:', error);
      const errMsg =
        error?.data?.message || error?.message || "Failed to fetch reports data";
      addToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">
          Generate and view system reports and analytics
        </p>
      </div>

      {isLoading && (
        <div className="card p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports data...</p>
          </div>
        </div>
      )}

      {!isLoading && (
        <>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Monthly Summary
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              <XAxis dataKey="month" stroke="#64748b" />

              {/* Main Y Axis */}
              <YAxis yAxisId="left" stroke="#64748b" />

              {/* Scaled Y Axis for completed */}
              <YAxis
                yAxisId="right"
                orientation="right"
                hide
                domain={[0, (dataMax) => dataMax * 2]}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />

              <Legend />

              <Bar
                yAxisId="left"
                dataKey="repairs"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />

              <Bar
                yAxisId="right"
                dataKey="completed"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
              />

              <Bar
                yAxisId="left"
                dataKey="requests"
                fill="#f59e0b"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Department-wise Device Requests
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Device Category Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceCategoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="repairs" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="requests" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Report Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Total Repairs</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {summaryData.repairs.total || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {summaryData.repairs.percentchange || "0"}% from last month
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Repair Time (Days)</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {summaryData.repairs.repairtime || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Average days to repair
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600">Total Requests</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {summaryData.requests.total || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {summaryData.requests.percentchange || "0"}% from last month
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Repair Report Table */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Detailed Repair Report
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Total Count
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Completion %
                </th>
              </tr>
            </thead>
            <tbody>
              {repairTableData
                .slice(
                  (repairCurrentPage - 1) * itemsPerPage,
                  repairCurrentPage * itemsPerPage
                )
                .map((repair, index) => (
                  <tr key={index} className="table-row">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {repair.category || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {repair.total || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {repair.completed || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {repair.pending || 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      {repair.completionpercent || "0%"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Page {repairCurrentPage} of{" "}
            {Math.ceil(repairTableData.length / itemsPerPage || 1)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setRepairCurrentPage((prev) => Math.max(1, prev - 1))
              }
              disabled={repairCurrentPage === 1}
              className="btn-secondary flex items-center gap-1 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button
              onClick={() =>
                setRepairCurrentPage((prev) =>
                  Math.min(Math.ceil(repairTableData.length / itemsPerPage || 1), prev + 1)
                )
              }
              disabled={
                repairCurrentPage ===
                Math.ceil(repairTableData.length / itemsPerPage || 1)
              }
              className="btn-secondary flex items-center gap-1 disabled:opacity-50"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Request Report Table */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Detailed Request Report
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Total Count
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Completion %
                </th>
              </tr>
            </thead>
            <tbody>
              {requestTableData
                .slice(
                  (requestCurrentPage - 1) * itemsPerPage,
                  requestCurrentPage * itemsPerPage
                )
                .map((request, index) => (
                  <tr key={index} className="table-row">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {request.category || request.catgory || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.total || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.completed || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.pending || 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      {request.completionpercent || "0%"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Page {requestCurrentPage} of{" "}
            {Math.ceil(requestTableData.length / itemsPerPage || 1)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setRequestCurrentPage((prev) => Math.max(1, prev - 1))
              }
              disabled={requestCurrentPage === 1}
              className="btn-secondary flex items-center gap-1 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button
              onClick={() =>
                setRequestCurrentPage((prev) =>
                  Math.min(Math.ceil(requestTableData.length / itemsPerPage || 1), prev + 1)
                )
              }
              disabled={
                requestCurrentPage ===
                Math.ceil(requestTableData.length / itemsPerPage || 1)
              }
              className="btn-secondary flex items-center gap-1 disabled:opacity-50"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

export default Reports;
