import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Eye, Edit, Trash2, AlertCircle, Download } from 'lucide-react'
import SideDrawer from '../components/SideDrawer'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../context/ToastContext'
import { repairAPI, vendorAPI, deviceAPI, repairStatusAPI, departmentAPI } from '../services/api'
import { formatCurrency } from '../utils/formatters'

function RepairManagement() {
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vendorFilter, setVendorFilter] = useState('all')
  const [costFilter, setCostFilter] = useState({ min: '', max: '' })
  const [issueDateFilter, setIssueDateFilter] = useState({ from: '', to: '' })
  const [returnedDateFilter, setReturnedDateFilter] = useState({ from: '', to: '' })
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedRepair, setSelectedRepair] = useState(null)
  const [repairs, setRepairs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [vendors, setVendors] = useState([])
  const [isLoadingVendors, setIsLoadingVendors] = useState(false)
  const [vendorError, setVendorError] = useState('')
  const [devices, setDevices] = useState([])
  const [isLoadingDevices, setIsLoadingDevices] = useState(false)
  const [deviceError, setDeviceError] = useState('')
  const [statuses, setStatuses] = useState([])
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(false)
  const [statusError, setStatusError] = useState('')
  const [departments, setDepartments] = useState([])
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false)
  const [departmentError, setDepartmentError] = useState('')
  const [addFormData, setAddFormData] = useState({
    deviceCategory: '',
    deviceName: '',
    issueDate: '',
    returnedDate: '',
    issue: '',
    vendor: '',
    cost: '',
    department: '',
  })
  const [editFormData, setEditFormData] = useState({
    issueDate: '',
    returnedDate: '',
    issue: '',
    vendor: '',
    status: 'Pending',
    cost: '',
    department: '',
  })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false })


  // Fetch repairs and vendors on component mount
  useEffect(() => {
    fetchRepairs()
    fetchVendors()
    fetchDevices()
    fetchStatuses()
    fetchDepartments()
  }, [])

  const fetchRepairs = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await repairAPI.getAll()
      setRepairs(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to fetch repairs'
      setError(errorMsg)
      addToast(errorMsg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVendors = async () => {
    setIsLoadingVendors(true)
    setVendorError('')
    try {
      const data = await vendorAPI.getAll()
      setVendors(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to fetch vendors'
      setVendorError(errorMsg)
      console.error('Vendor fetch error:', err)
    } finally {
      setIsLoadingVendors(false)
    }
  }

  const fetchDevices = async () => {
    setIsLoadingDevices(true)
    setDeviceError('')
    try {
      const data = await deviceAPI.getAll()
      setDevices(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to fetch devices'
      setDeviceError(errorMsg)
      console.error('Device fetch error:', err)
    } finally {
      setIsLoadingDevices(false)
    }
  }

  const fetchStatuses = async () => {
    setIsLoadingStatuses(true)
    setStatusError('')
    try {
      const data = await repairStatusAPI.getAll()
      setStatuses(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to fetch statuses'
      setStatusError(errorMsg)
      console.error('Status fetch error:', err)
    } finally {
      setIsLoadingStatuses(false)
    }
  }

  const fetchDepartments = async () => {
    setIsLoadingDepartments(true)
    setDepartmentError('')
    try {
      const data = await departmentAPI.getAll()
      setDepartments(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to fetch departments'
      setDepartmentError(errorMsg)
      console.error('Department fetch error:', err)
    } finally {
      setIsLoadingDepartments(false)
    }
  }

  const filteredRepairs = repairs.filter((repair) => {
    // Search filter
    const matchesSearch = repair.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.displayId.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || repair.status === statusFilter
    
    // Vendor filter
    const matchesVendor = vendorFilter === 'all' || repair.vendor === vendorFilter
    
    // Cost filter
    let matchesCost = true
    if (costFilter.min || costFilter.max) {
      const cost = repair.cost ? Number(repair.cost) : 0
      if (costFilter.min) {
        matchesCost = matchesCost && cost >= Number(costFilter.min)
      }
      if (costFilter.max) {
        matchesCost = matchesCost && cost <= Number(costFilter.max)
      }
    }
    
    // Issue date filter
    let matchesIssueDate = true
    if (issueDateFilter.from || issueDateFilter.to) {
      const issueDate = repair.issueDate ? new Date(repair.issueDate) : null
      if (issueDate) {
        if (issueDateFilter.from) {
          const fromDate = new Date(issueDateFilter.from)
          matchesIssueDate = matchesIssueDate && issueDate >= fromDate
        }
        if (issueDateFilter.to) {
          const toDate = new Date(issueDateFilter.to)
          matchesIssueDate = matchesIssueDate && issueDate <= toDate
        }
      } else {
        matchesIssueDate = false
      }
    }
    
    // Returned date filter
    let matchesReturnedDate = true
    if (returnedDateFilter.from || returnedDateFilter.to) {
      const returnedDate = repair.returnedDate ? new Date(repair.returnedDate) : null
      if (returnedDate) {
        if (returnedDateFilter.from) {
          const fromDate = new Date(returnedDateFilter.from)
          matchesReturnedDate = matchesReturnedDate && returnedDate >= fromDate
        }
        if (returnedDateFilter.to) {
          const toDate = new Date(returnedDateFilter.to)
          matchesReturnedDate = matchesReturnedDate && returnedDate <= toDate
        }
      } else {
        matchesReturnedDate = false
      }
    }
    
    return matchesSearch && matchesStatus && matchesVendor && matchesCost && matchesIssueDate && matchesReturnedDate
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredRepairs.length / itemsPerPage)
  const paginatedRepairs = filteredRepairs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadge = (status) => {
    const statusObj = statuses.find(s => s.name === status)
    if (statusObj && statusObj.color) {
      return { color: statusObj.color }
    }
    // Fallback colors if status not found
    const colorMap = {
      Pending: '#FCD34D',
      'In Progress': '#60A5FA',
      Completed: '#34D399',
    }
    return { color: colorMap[status] || '#E5E7EB' }
  }

  const handleViewRepair = (repair) => {
    setSelectedRepair(repair)
    setIsViewModalOpen(true)
  }

  const handleEditRepair = (repair) => {
    setSelectedRepair(repair)
    setEditFormData({
      issueDate: repair.issueDate || '',
      returnedDate: repair.returnedDate || '',
      issue: repair.issue,
      vendor: repair.vendor,
      status: repair.status,
      cost: repair.cost || '',
      department: repair.department || '',
    })
    setIsEditDrawerOpen(true)
  }

  const handleDeleteRepair = (repair) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Repair Ticket',
      message: `Are you sure you want to delete repair ${repair.displayId}? This action cannot be undone.`,
      confirmText: 'Delete',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await repairAPI.delete(repair.id)
          addToast('Repair ticket deleted successfully', 'success')
          setConfirmDialog({ isOpen: false })
          fetchRepairs()
        } catch (err) {
          const errorMsg = err.data?.message || err.message || 'Failed to delete repair'
          addToast(errorMsg, 'error')
        }
      },
    })
  }

  const handleSaveRepair = async () => {
    try {
      if (selectedRepair?.id) {
        // Prepare data, converting empty dates to null
        const dataToSend = {
          ...editFormData,
          issueDate: editFormData.issueDate || null,
          returnedDate: editFormData.returnedDate || null,
        }
        await repairAPI.update(selectedRepair.id, dataToSend)
        addToast('Repair ticket updated successfully', 'success')
        setIsEditDrawerOpen(false)
        fetchRepairs()
      }
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to update repair'
      addToast(errorMsg, 'error')
    }
  }

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  const handleAddRepair = async () => {
    try {
      if (!addFormData.deviceName.trim()) {
        addToast('Please fill in all required fields', 'error')
        return
      }
      // Prepare data, converting empty dates to null
      const dataToSend = {
        ...addFormData,
        issueDate: addFormData.issueDate || null,
        returnedDate: addFormData.returnedDate || null,
      }
      await repairAPI.create(dataToSend)
      addToast('Repair ticket created successfully', 'success')
      setIsAddDrawerOpen(false)
      setAddFormData({
        deviceCategory: '',
        deviceName: '',
        issueDate: '',
        returnedDate: '',
        issue: '',
        vendor: '',
        cost: '',
      })
      fetchRepairs()
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to create repair'
      addToast(errorMsg, 'error')
    }
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setVendorFilter('all')
    setCostFilter({ min: '', max: '' })
    setIssueDateFilter({ from: '', to: '' })
    setReturnedDateFilter({ from: '', to: '' })
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || vendorFilter !== 'all' || costFilter.min || costFilter.max || issueDateFilter.from || issueDateFilter.to || returnedDateFilter.from || returnedDateFilter.to

  const exportToPDF = () => {
    try {
      const printWindow = window.open('', '', 'width=1400,height=800')
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Repair Management Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1f2937; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
            th { background-color: #f3f4f6; padding: 10px; text-align: left; border-bottom: 2px solid #d1d5db; font-weight: 600; }
            td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .status-badge { color: white; padding: 3px 6px; border-radius: 3px; display: inline-block; font-size: 11px; }
            .footer { margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <h1>Repair Management Report</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Records:</strong> ${filteredRepairs.length}</p>
          <table>
            <thead>
              <tr>
                <th>Repair ID</th>
                <th>Device Name</th>
                <th>Issue</th>
                <th>Issue Date</th>
                <th>Returned Date</th>
                <th>Cost</th>
                <th>Vendor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRepairs.map(repair => `
                <tr>
                  <td>${repair.displayId}</td>
                  <td>${repair.deviceName}</td>
                  <td>${repair.issue}</td>
                  <td>${repair.issueDate || '-'}</td>
                  <td>${repair.returnedDate || '-'}</td>
                  <td>${formatCurrency(repair.cost)}</td>
                  <td>${repair.vendor}</td>
                  <td><span class="status-badge" style="background-color: ${getStatusBadge(repair.status).color}">${repair.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>This is an automatically generated report from RepairMS</p>
          </div>
        </body>
        </html>
      `
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.print()
    } catch (error) {
      addToast('Failed to export to PDF', 'error')
    }
  }

  return (
    <>
    <div className="p-6 space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Repair Management</h1>
          <p className="text-gray-600 mt-1">Track and manage device repair requests</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={exportToPDF}
            className="btn-secondary flex items-center gap-2 justify-center flex-1 sm:flex-none"
            disabled={filteredRepairs.length === 0}
          >
            <Download size={20} />
            Export PDF
          </button>
          <button
            onClick={() => setIsAddDrawerOpen(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center flex-1 sm:flex-none"
          >
            <Plus size={20} />
            New Repair
          </button>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by device name or repair ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="input-field pl-10"
            />
          </div>
          <button 
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="btn-secondary flex items-center gap-2 justify-center"
          >
            <Filter size={20} />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && <span className="w-2 h-2 bg-orange-500 rounded-full"></span>}
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="btn-secondary"
            >
              Reset
            </button>
          )}
        </div>

        {isFilterPanelOpen && (
          <div className="border-t pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="input-field"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status.id} value={status.name}>{status.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
              <select
                value={vendorFilter}
                onChange={(e) => {
                  setVendorFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="input-field"
              >
                <option value="all">All Vendors</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Min (NPR)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={costFilter.min}
                  onChange={(e) => {
                    setCostFilter({ ...costFilter, min: e.target.value })
                    setCurrentPage(1)
                  }}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Max (NPR)</label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={costFilter.max}
                  onChange={(e) => {
                    setCostFilter({ ...costFilter, max: e.target.value })
                    setCurrentPage(1)
                  }}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date From</label>
                <input
                  type="date"
                  value={issueDateFilter.from}
                  onChange={(e) => {
                    setIssueDateFilter({ ...issueDateFilter, from: e.target.value })
                    setCurrentPage(1)
                  }}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date To</label>
                <input
                  type="date"
                  value={issueDateFilter.to}
                  onChange={(e) => {
                    setIssueDateFilter({ ...issueDateFilter, to: e.target.value })
                    setCurrentPage(1)
                  }}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Returned Date From</label>
                <input
                  type="date"
                  value={returnedDateFilter.from}
                  onChange={(e) => {
                    setReturnedDateFilter({ ...returnedDateFilter, from: e.target.value })
                    setCurrentPage(1)
                  }}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Returned Date To</label>
                <input
                  type="date"
                  value={returnedDateFilter.to}
                  onChange={(e) => {
                    setReturnedDateFilter({ ...returnedDateFilter, to: e.target.value })
                    setCurrentPage(1)
                  }}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading repair requests...</p>
            </div>
          ) : paginatedRepairs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No repair requests found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Repair ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Issue</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Returned Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cost</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRepairs.map((repair) => (
                  <tr key={repair.id} className="table-row">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{repair.displayId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{repair.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{repair.deviceName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{repair.issue}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{repair.issueDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{repair.returnedDate}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(repair.cost)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{repair.vendor}</td>
                    <td className="px-6 py-4">
                      <span 
                        className="badge text-white px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: getStatusBadge(repair.status).color,
                        }}
                      >
                        {repair.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleViewRepair(repair)}
                        className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditRepair(repair)}
                        className="btn-sm bg-orange-100 text-orange-600 hover:bg-orange-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteRepair(repair)}
                        className="btn-sm bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {paginatedRepairs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredRepairs.length)} of {filteredRepairs.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <SideDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Create New Repair Ticket"
        width="w-96"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Device Category</label>
            {deviceError && (
              <p className="text-sm text-red-600 mb-2">{deviceError}</p>
            )}
            <select 
              value={addFormData.deviceCategory}
              onChange={(e) => setAddFormData({...addFormData, deviceCategory: e.target.value})}
              className="input-field"
              disabled={isLoadingDevices || devices.length === 0}
            >
              <option value="">{isLoadingDevices ? 'Loading categories...' : devices.length === 0 ? 'No categories available' : 'Select category'}</option>
              {devices.map(device => (
                <option key={device.name} value={device.name}>{device.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
            <input 
              type="text" 
              placeholder="e.g., Dell Latitude 5520" 
              value={addFormData.deviceName}
              onChange={(e) => setAddFormData({...addFormData, deviceName: e.target.value})}
              className="input-field" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
            <input 
              type="date" 
              value={addFormData.issueDate}
              onChange={(e) => setAddFormData({...addFormData, issueDate: e.target.value})}
              className="input-field" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Returned Date</label>
            <input 
              type="date" 
              value={addFormData.returnedDate}
              onChange={(e) => setAddFormData({...addFormData, returnedDate: e.target.value})}
              className="input-field" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
            <textarea 
              placeholder="Describe the issue..." 
              value={addFormData.issue}
              onChange={(e) => setAddFormData({...addFormData, issue: e.target.value})}
              className="input-field h-24" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Repair Cost (NPR)</label>
            <input 
              type="number" 
              placeholder="e.g., 5000" 
              value={addFormData.cost}
              onChange={(e) => setAddFormData({...addFormData, cost: e.target.value})}
              className="input-field" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Assignment *</label>
            {vendorError && (
              <p className="text-sm text-red-600 mb-2">{vendorError}</p>
            )}
            <select 
              value={addFormData.vendor}
              onChange={(e) => setAddFormData({...addFormData, vendor: e.target.value})}
              className="input-field"
              disabled={isLoadingVendors || vendors.length === 0}
            >
              <option value="">{isLoadingVendors ? 'Loading vendors...' : vendors.length === 0 ? 'No vendors available' : 'Select vendor'}</option>
              {vendors.map(vendor => (
                <option key={vendor.name} value={vendor.name}>{vendor.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            {departmentError && (
              <p className="text-sm text-red-600 mb-2">{departmentError}</p>
            )}
            <select 
              value={addFormData.department}
              onChange={(e) => setAddFormData({...addFormData, department: e.target.value})}
              className="input-field"
              disabled={isLoadingDepartments || departments.length === 0}
            >
              <option value="">{isLoadingDepartments ? 'Loading departments...' : departments.length === 0 ? 'No departments available' : 'Select department'}</option>
              {departments.map(dept => (
                <option key={dept.name} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setIsAddDrawerOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRepair}
              className="flex-1 btn-primary"
            >
              Create Ticket
            </button>
          </div>
        </div>
      </SideDrawer>

      <SideDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Edit Repair Ticket"
        width="w-96"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
            <input
              type="date"
              value={editFormData.issueDate}
              onChange={(e) => handleInputChange('issueDate', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Returned Date</label>
            <input
              type="date"
              value={editFormData.returnedDate}
              onChange={(e) => handleInputChange('returnedDate', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
            <textarea
              value={editFormData.issue}
              onChange={(e) => handleInputChange('issue', e.target.value)}
              className="input-field h-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Repair Cost (NPR)</label>
            <input
              type="number"
              placeholder="e.g., 5000"
              value={editFormData.cost || ''}
              onChange={(e) => handleInputChange('cost', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Assignment *</label>
            {vendorError && (
              <p className="text-sm text-red-600 mb-2">{vendorError}</p>
            )}
            <select
              value={editFormData.vendor || ''}
              onChange={(e) => handleInputChange('vendor', e.target.value)}
              className="input-field"
              disabled={isLoadingVendors || vendors.length === 0}
            >
              <option value="">{isLoadingVendors ? 'Loading vendors...' : vendors.length === 0 ? 'No vendors available' : 'Select vendor'}</option>
              {vendors.map(vendor => (
                <option key={vendor.name} value={vendor.name}>{vendor.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            {departmentError && (
              <p className="text-sm text-red-600 mb-2">{departmentError}</p>
            )}
            <select
              value={editFormData.department || ''}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="input-field"
              disabled={isLoadingDepartments || departments.length === 0}
            >
              <option value="">{isLoadingDepartments ? 'Loading departments...' : departments.length === 0 ? 'No departments available' : 'Select department'}</option>
              {departments.map(dept => (
                <option key={dept.name} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            {statusError && (
              <p className="text-sm text-red-600 mb-2">{statusError}</p>
            )}
            <select
              value={editFormData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="input-field"
              disabled={isLoadingStatuses || statuses.length === 0}
            >
              <option value="">{isLoadingStatuses ? 'Loading statuses...' : statuses.length === 0 ? 'No statuses available' : 'Select status'}</option>
              {statuses.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setIsEditDrawerOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRepair}
              className="flex-1 btn-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      </SideDrawer>

      {selectedRepair && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Repair Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Repair ID</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.displayId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Device Name</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.deviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Device Category</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.deviceCategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span 
                  className="badge text-white px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: getStatusBadge(selectedRepair.status).color,
                  }}
                >
                  {selectedRepair.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.issueDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Returned Date</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.returnedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vendor</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.vendor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Repair Cost</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedRepair.cost)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Issue Description</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.issue}</p>
              </div>
            </div>
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="w-full btn-primary mt-6"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDangerous={confirmDialog.isDangerous}
      />
    </div>
    </>
  );
}

export default RepairManagement
