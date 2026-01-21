import React, { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Package, Wrench, FileText, CheckCircle, IndianRupeeIcon } from 'lucide-react'
import { dashboardAPI, reportAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import { formatCurrency } from '../utils/formatters'

function Dashboard() {
  const { addToast } = useToast()
  const [monthlyData, setMonthlyData] = useState([])
  
  const [categoryData, setCategoryData] = useState([])
  const [requestMetricData, setRequestMetricData] = useState([])
  const [repairMetricData, setRepairMetricData] = useState([])

  
  const metrics = [
    { label: 'Repair Cost This Month', value: formatCurrency(repairMetricData.cost), icon: IndianRupeeIcon, color: 'bg-green-100', textColor: 'text-green-600' },
    { label: 'Under Repair', value: repairMetricData.underrepair, icon: Wrench, color: 'bg-orange-100', textColor: 'text-orange-600' },
    { label: 'Pending Requests', value: requestMetricData.pending, icon: FileText, color: 'bg-purple-100', textColor: 'text-purple-600' },
    { label: 'Request Cost This Month', value: formatCurrency(requestMetricData.cost), icon: IndianRupeeIcon, color: 'bg-green-100', textColor: 'text-green-600' },
  ]
  
  useEffect(()=>{
    fetchCategoryChart()
    fetchRequestMetric()
    fetchRepairMetric()
    fetchMonthlyData()
  },[])

  
  const fetchRequestMetric = async () => {
    try{
      const data = await dashboardAPI.getRequestMetric()
      setRequestMetricData(data || { cost: 0, pending: 0 })
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

  const fetchMonthlyData = async () => {
    try{
      const data = await reportAPI.getMonthlyRepairs();
      setMonthlyData(Array.isArray(data) ? data : data.data || [])
    } catch (err){
      const errMsg = err.data?.message || err.message || "Failed to get monthly data"
      addToast(errMsg, 'error');
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">Welcome back! Here's your system overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="card p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium">{metric.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <Icon size={18} className={metric.textColor} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">Monthly Repairs Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '11px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="repairs"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">Device Categories</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" stroke="#64748b" style={{ fontSize: '11px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

