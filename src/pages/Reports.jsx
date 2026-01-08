import React, { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download, Calendar } from 'lucide-react'
import { useToast } from '../context/ToastContext'

function Reports() {
  const { addToast } = useToast()
  const [reportType, setReportType] = useState('daily')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-01-31')

  const [monthlyData] = useState([
    { month: 'January', repairs: 45, completed: 38, requests: 12 },
    { month: 'February', repairs: 52, completed: 48, requests: 15 },
    { month: 'March', repairs: 48, completed: 42, requests: 10 },
    { month: 'April', repairs: 61, completed: 55, requests: 18 },
    { month: 'May', repairs: 55, completed: 50, requests: 14 },
    { month: 'June', repairs: 67, completed: 62, requests: 20 },
    { month: 'July', repairs: 67, completed: 62, requests: 20 },
    { month: 'August', repairs: 67, completed: 62, requests: 20 },
    { month: 'September', repairs: 67, completed: 62, requests: 20 },
    { month: 'October', repairs: 67, completed: 62, requests: 20 },
    { month: 'November', repairs: 67, completed: 62, requests: 20 },
    { month: 'December', repairs: 67, completed: 62, requests: 20 },
  ])

  const [departmentData] = useState([
    { name: 'Sales', value: 45, color: '#3b82f6' },
    { name: 'IT', value: 38, color: '#10b981' },
    { name: 'HR', value: 28, color: '#f59e0b' },
    { name: 'Marketing', value: 32, color: '#ef4444' },
    { name: 'Finance', value: 22, color: '#8b5cf6' },
  ])

  const [deviceCategoryData] = useState([
    { category: 'Laptops', requests: 35, repairs: 28 },
    { category: 'Desktops', requests: 18, repairs: 15 },
    { category: 'Tablets', requests: 22, repairs: 18 },
    { category: 'Phones', requests: 28, repairs: 24 },
    { category: 'Printers', requests: 12, repairs: 10 },
  ])

  const handleGenerateReport = () => {
    addToast(`${reportType} report generated successfully`, 'success')
  }

  const handleExport = (format) => {
    addToast(`Report exported to ${format.toUpperCase()}`, 'success')
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and view system reports and analytics</p>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Report Configuration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input-field"
            >
              <option value="daily">Daily Repair Report</option>
              <option value="monthly">Monthly Summary</option>
              <option value="device-request">Device Request Report</option>
              <option value="department">Department-wise Usage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleGenerateReport}
              className="btn-primary flex-1"
            >
              Generate Report
            </button>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleExport('pdf')}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Export PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  

        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Summary</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="repairs" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="requests" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Department-wise Device Requests</h2>
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">Device Category Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceCategoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="requests" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="repairs" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Report Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Total Repairs</p>
            <p className="text-2xl font-bold text-green-600 mt-2">328</p>
            <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Completed Repairs</p>
            <p className="text-2xl font-bold text-green-600 mt-2">287</p>
            <p className="text-xs text-gray-500 mt-1">87.5% completion rate</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600">Total Requests</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">89</p>
            <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600">Avg. Repair Time</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">4.2 days</p>
            <p className="text-xs text-gray-500 mt-1">-0.8 days improvement</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Detailed Report Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Count</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Completed</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pending</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Completion %</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Laptop Repairs</td>
                <td className="px-6 py-4 text-sm text-gray-600">125</td>
                <td className="px-6 py-4 text-sm text-gray-600">110</td>
                <td className="px-6 py-4 text-sm text-gray-600">15</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">88%</td>
              </tr>
              <tr className="table-row">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Desktop Repairs</td>
                <td className="px-6 py-4 text-sm text-gray-600">85</td>
                <td className="px-6 py-4 text-sm text-gray-600">78</td>
                <td className="px-6 py-4 text-sm text-gray-600">7</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">92%</td>
              </tr>
              <tr className="table-row">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Mobile Device Repairs</td>
                <td className="px-6 py-4 text-sm text-gray-600">98</td>
                <td className="px-6 py-4 text-sm text-gray-600">85</td>
                <td className="px-6 py-4 text-sm text-gray-600">13</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">87%</td>
              </tr>
              <tr className="table-row">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Peripheral Repairs</td>
                <td className="px-6 py-4 text-sm text-gray-600">20</td>
                <td className="px-6 py-4 text-sm text-gray-600">14</td>
                <td className="px-6 py-4 text-sm text-gray-600">6</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">70%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reports
