import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Eye, Edit, Trash2, AlertCircle, Download } from 'lucide-react'
import SideDrawer from '../components/SideDrawer'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../context/ToastContext'
import { supportAPI, supportStatusAPI, departmentAPI } from '../services/api'
import { formatCurrency } from '../utils/formatters'

function SupportTicket() {
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [selectedSupport, setSelectedSupport] = useState(null)
  const [supportTickets, setSupportTickets] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Format timestamp(0) value
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-'
    try {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return timestamp
    }
  }
  
  const [addFormData, setAddFormData] = useState({
    callerName: '',
    department: '',
    receiverName: '',
    reason: '',
    status: 'Pending',
  })

  const [editFormData, setEditFormData] = useState({
    callerName: '',
    department: '',
    receiverName: '',
    reason: '',
    status: '',
    createdAt: '',
  })

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false })
  const [departments, setDepartments] = useState([])
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false)
  const [departmentError, setDepartmentError] = useState('')
  const [statuses, setStatuses] = useState([])
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(false)
  const [statusError, setStatusError] = useState('')

  // Filter tickets based on search and filters
  const filteredTickets = supportTickets.filter((ticket) => {
    // Search filter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      ticket.displayId.toLowerCase().includes(searchLower) ||
      (ticket.callerName && ticket.callerName.toLowerCase().includes(searchLower)) ||
      (ticket.department && ticket.department.toLowerCase().includes(searchLower)) ||
      (ticket.receiverName && ticket.receiverName.toLowerCase().includes(searchLower)) ||
      (ticket.reason && ticket.reason.toLowerCase().includes(searchLower))

    // Status filter
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter

    // Date filter
    let matchesDate = true
    if (dateFilter.from || dateFilter.to) {
      try {
        const ticketDate = new Date(ticket.createdAt).toISOString().split('T')[0]

        if (dateFilter.from && ticketDate < dateFilter.from) matchesDate = false
        if (dateFilter.to && ticketDate > dateFilter.to) matchesDate = false
      } catch {
        matchesDate = true
      }
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    fetchSupportTickets()
    fetchDepartments()
    fetchStatuses()
  }, [])

  const fetchSupportTickets = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await supportAPI.getAll()
      setSupportTickets(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to fetch support tickets'
      setError(errorMsg)
      addToast(errorMsg, 'error')
    } finally {
      setIsLoading(false)
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
      addToast(errorMsg, 'error')
    } finally {
      setIsLoadingDepartments(false)
    }
  }

  const fetchStatuses = async () => {
    setIsLoadingStatuses(true)
    setStatusError('')
    try {
      const data = await supportStatusAPI.getAll()
      setStatuses(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to fetch statuses'
      setStatusError(errorMsg)
      addToast(errorMsg, 'error')
    } finally {
      setIsLoadingStatuses(false)
    }
  }

  const openViewModal = (ticket) => {
    setSelectedSupport(ticket)
    setIsViewModalOpen(true)
  }

  const openEditDrawer = (ticket) => {
    setSelectedSupport(ticket)
    setEditFormData({
      callerName: ticket.callerName || '',
      department: ticket.department || '',
      receiverName: ticket.receiverName || '',
      reason: ticket.reason || '',
      status: ticket.status || 'Pending',
      createdAt: ticket.createdAt || '',
    })
    setIsEditDrawerOpen(true)
  }

  const handleSaveSupport = async () => {
    try {
      if (!editFormData.receiverName.trim() || !editFormData.reason.trim()) {
        addToast('Please fill in all required fields', 'error')
        return
      }

      const dataToSend = {
        callerName: editFormData.callerName,
        department: editFormData.department,
        receiverName: editFormData.receiverName,
        reason: editFormData.reason,
        status: editFormData.status,
        createdAt: editFormData.createdAt,
      }

      await supportAPI.update(selectedSupport.id, dataToSend)
      addToast('Support ticket updated successfully', 'success')
      setIsEditDrawerOpen(false)
      fetchSupportTickets()
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to update support ticket'
      addToast(errorMsg, 'error')
    }
  }

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDeleteSupport = (ticket) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Support Ticket',
      message: `Are you sure you want to delete this support ticket ${ticket.displayId}? This action cannot be undone.`,
      confirmText: 'Delete',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await supportAPI.delete(ticket.id)
          addToast('Support ticket deleted successfully', 'success')
          setConfirmDialog({ isOpen: false })
          fetchSupportTickets()
        } catch (err) {
          const errorMsg = err.data?.message || err.message || 'Failed to delete support ticket'
          addToast(errorMsg, 'error')
        }
      },
    })
  }

  const handleAddSupport = async () => {
    try {
      if (!addFormData.department.trim() || !addFormData.receiverName.trim() || !addFormData.reason.trim()) {
        addToast('Please fill in all required fields', 'error')
        return
      }

      await supportAPI.create(addFormData)
      addToast('Support ticket created successfully', 'success')
      setIsAddDrawerOpen(false)
      setAddFormData({
        callerName: '',
        department: '',
        receiverName: '',
        reason: '',
        status: 'Pending',
      })
      fetchSupportTickets()
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to create support ticket'
      addToast(errorMsg, 'error')
    }
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateFilter({ from: '', to: '' })
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || dateFilter.from || dateFilter.to

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

  const exportToPDF = () => {
    try {
      const printWindow = window.open('', '', 'width=1000,height=800')
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Support Tickets Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1f2937; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background-color: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #d1d5db; font-weight: 600; }
            td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
            .status-badge { color: white; padding: 4px 8px; border-radius: 4px; display: inline-block; }
            .footer { margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <h1>Support Tickets Report</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Records:</strong> ${filteredTickets.length}</p>
          <table>
            <thead>
              <tr>
                <th>Support ID</th>
                <th>Caller Name</th>
                <th>Department</th>
                <th>Receiver Name</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTickets.map(ticket => `
                <tr>
                  <td>${ticket.displayId}</td>
                  <td>${ticket.callerName || '-'}</td>
                  <td>${ticket.department || '-'}</td>
                  <td>${ticket.receiverName || '-'}</td>
                  <td>${ticket.reason || '-'}</td>
                  <td><span class="status-badge" style="background-color: ${getStatusBadge(ticket.status).color}">${ticket.status}</span></td>
                  <td>${formatTimestamp(ticket.createdAt)}</td>
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
    <div className="p-4 space-y-4">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-1">Manage and track support requests</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={exportToPDF}
            className="btn-secondary flex items-center gap-2 justify-center flex-1 sm:flex-none"
            disabled={filteredTickets.length === 0}
          >
            <Download size={18} />
            Export PDF
          </button>
          <button
            onClick={() => {
              setAddFormData({
                callerName: '',
                department: '',
                receiverName: '',
                reason: '',
                status: 'Pending',
              })
              setIsAddDrawerOpen(true)
            }}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center flex-1 sm:flex-none"
          >
            <Plus size={18} />
            New Ticket
          </button>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, caller, department, receiver, or reason..."
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
            <Filter size={18} />
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
          <div className="border-t pt-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="input-field"
                >
                  <option value="all">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.name}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Created Date From</label>
                <input
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) => {
                    setDateFilter({ ...dateFilter, from: e.target.value })
                    setCurrentPage(1)
                  }}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Created Date To</label>
                <input
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) => {
                    setDateFilter({ ...dateFilter, to: e.target.value })
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
              <p className="text-gray-600">Loading support tickets...</p>
            </div>
          ) : paginatedTickets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No support tickets found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Support ID</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Caller Name</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Department</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Receiver Name</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Reason</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTickets.map((ticket) => (
                  <tr key={ticket.id} className="table-row">
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">{ticket.displayId}</td>
                    <td className="px-3 py-2 text-xs text-gray-600">{ticket.callerName || '-'}</td>
                    <td className="px-3 py-2 text-xs text-gray-600">{ticket.department || '-'}</td>
                    <td className="px-3 py-2 text-xs text-gray-600">{ticket.receiverName || '-'}</td>
                    <td className="px-3 py-2 text-xs text-gray-600">{ticket.reason || '-'}</td>
                    <td className="px-3 py-2">
                      <span
                        className="badge text-white px-2 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: getStatusBadge(ticket.status).color }}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-600">{formatTimestamp(ticket.createdAt)}</td>
                    <td className="px-3 py-2 flex gap-1">
                      <button
                        onClick={() => openViewModal(ticket)}
                        className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => openEditDrawer(ticket)}
                        className="btn-sm bg-orange-100 text-orange-600 hover:bg-orange-200"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteSupport(ticket)}
                        className="btn-sm bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Showing {paginatedTickets.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredTickets.length)} of {filteredTickets.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
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

      {/* Add Support Ticket Drawer */}
      <SideDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Create Support Ticket"
        width="w-96"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Caller Name</label>
            <input
              type="text"
              placeholder="Enter caller name"
              value={addFormData.callerName}
              onChange={(e) =>
                setAddFormData((prev) => ({
                  ...prev,
                  callerName: e.target.value,
                }))
              }
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
            <select
              value={addFormData.department}
              onChange={(e) =>
                setAddFormData((prev) => ({
                  ...prev,
                  department: e.target.value,
                }))
              }
              className="input-field"
              disabled={departments.length === 0}
            >
              <option value="">{departments.length === 0 ? 'No departments available' : 'Select Department'}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Receiver Name</label>
            <input
              type="text"
              placeholder="Enter receiver name"
              value={addFormData.receiverName}
              onChange={(e) =>
                setAddFormData((prev) => ({
                  ...prev,
                  receiverName: e.target.value,
                }))
              }
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              placeholder="Describe the reason for support"
              value={addFormData.reason}
              onChange={(e) =>
                setAddFormData((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              className="input-field h-20"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setIsAddDrawerOpen(false)} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button onClick={handleAddSupport} className="flex-1 btn-primary">
              Create Ticket
            </button>
          </div>
        </div>
      </SideDrawer>

      {/* Edit Support Ticket Drawer */}
      <SideDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Edit Support Ticket"
        width="w-96"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Caller Name</label>
            <input
              type="text"
              placeholder="Enter caller name"
              value={editFormData.callerName}
              onChange={(e) => handleInputChange('callerName', e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
            <select
              value={editFormData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="input-field"
              disabled={departments.length === 0}
            >
              <option value="">{departments.length === 0 ? 'No departments available' : 'Select Department'}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Receiver Name</label>
            <input
              type="text"
              placeholder="Enter receiver name"
              value={editFormData.receiverName}
              onChange={(e) => handleInputChange('receiverName', e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              placeholder="Describe the reason for support"
              value={editFormData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className="input-field h-20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={editFormData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="input-field"
              disabled={statuses.length === 0}
            >
              <option value="">{statuses.length === 0 ? 'No statuses available' : 'Select Status'}</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.name}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setIsEditDrawerOpen(false)} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveSupport} className="flex-1 btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </SideDrawer>

      {/* View Support Ticket Modal */}
      {selectedSupport && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Support Ticket Details"
          size="lg"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600">Support ID</p>
                <p className="text-base font-semibold text-gray-900">{selectedSupport.displayId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <span
                  className="badge text-white px-2 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: getStatusBadge(selectedSupport.status).color }}
                >
                  {selectedSupport.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600">Caller Name</p>
                <p className="text-base font-semibold text-gray-900">{selectedSupport.callerName || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Department</p>
                <p className="text-base font-semibold text-gray-900">{selectedSupport.department || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Receiver Name</p>
                <p className="text-base font-semibold text-gray-900">{selectedSupport.receiverName || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Date</p>
                <p className="text-base font-semibold text-gray-900">{formatTimestamp(selectedSupport.createdAt)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-600">Reason</p>
                <p className="text-base font-semibold text-gray-900">{selectedSupport.reason || '-'}</p>
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ isOpen: false })}
        isDangerous={confirmDialog.isDangerous}
      />
    </div>
    </>
  )
}

export default SupportTicket
