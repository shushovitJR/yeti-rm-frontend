import React, { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Package, Wrench, FileText, CheckCircle, IndianRupeeIcon } from 'lucide-react'
import { dashboardAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

function Dashboard() {

  const [monthlyData] = useState([
    { month: 'Jan', repairs: 45, completed: 38 },
    { month: 'Feb', repairs: 52, completed: 48 },
    { month: 'Mar', repairs: 48, completed: 42 },
    { month: 'Apr', repairs: 61, completed: 55 },
    { month: 'May', repairs: 55, completed: 50 },
    { month: 'Jun', repairs: 67, completed: 62 },
  ])
  
  const [categoryData, setCategoryData] = useState([])
  const [requestMetricData, setRequestMetricData] = useState([])
  const [repairMetricData, setRepairMetricData] = useState([])
  
  const [recentActivity] = useState([
    { id: 1, type: 'Repair Completed', device: 'Dell Latitude 5520', date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'Device Assigned', device: 'HP EliteBook 840', date: '2024-01-14', status: 'assigned' },
    { id: 3, type: 'Request Approved', device: 'MacBook Pro 14"', date: '2024-01-13', status: 'approved' },
    { id: 4, type: 'Repair Started', device: 'Lenovo ThinkPad', date: '2024-01-12', status: 'in-progress' },
    { id: 5, type: 'New Request', device: 'iPad Air', date: '2024-01-11', status: 'pending' },
  ])
  
  const metrics = [
    { label: 'Monthly Cost', value: "₹"+repairMetricData.cost, icon: IndianRupeeIcon, color: 'bg-green-100', textColor: 'text-green-600' },
    { label: 'Under Repair', value: repairMetricData.underrepair, icon: Wrench, color: 'bg-orange-100', textColor: 'text-orange-600' },
    { label: 'Pending Requests', value: requestMetricData.pending, icon: FileText, color: 'bg-purple-100', textColor: 'text-purple-600' },
    { label: 'Recieved Requests', value: requestMetricData.recieved, icon: CheckCircle, color: 'bg-green-100', textColor: 'text-green-600' },
  ]
  
  useEffect(()=>{
    fetchCategoryChart()
    fetchRequestMetric()
    fetchRepairMetric()
  },[])
  
  const getActivityBadge = (status) => {
    const badges = {
      completed: 'badge badge-success',
      assigned: 'badge badge-info',
      approved: 'badge badge-success',
      'in-progress': 'badge badge-warning',
      pending: 'badge badge-warning',
    }
    return badges[status] || 'badge badge-info'
  }
  
  const fetchRequestMetric = async () => {
    try{
      const data = await dashboardAPI.getRequestMetric()
      setRequestMetricData(data || { recieved: 0, pending: 0 })
    } catch (err){
      const errMsg = err.data?.message || err.message || "Failed to fetch request metrics"
      addToast(errMsg, 'error')
    }
  }

  const fetchRepairMetric = async () => {
    try{
      const data = await dashboardAPI.getRepairMetric()
      setRepairMetricData(data)
    } catch (err){
      const errMsg = err.data?.message || err.message || "Failed to fetch repair metrics"
      addToast(errMsg, 'error')
    }
  }
  
  const fetchCategoryChart = async () => {
    try
    {const data = await dashboardAPI.getCategoryChart()
    setCategoryData(Array.isArray(data) ? data : data.data || [])
    } catch (err){
      const errMsg = err.data?.message || err.message || "Failed to get device category count"
      addToast(errMsg, 'error');
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your system overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <Icon size={24} className={metric.textColor} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Repairs Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
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
              <Line
                type="monotone"
                dataKey="repairs"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Device Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
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
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Activity Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="table-row">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{activity.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.device}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.date}</td>
                  <td className="px-6 py-4">
                    <span className={getActivityBadge(activity.status)}>{activity.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
