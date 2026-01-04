import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Eye, Edit, AlertCircle, Trash2 } from 'lucide-react'
import SideDrawer from '../components/SideDrawer'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../context/ToastContext'
import { requestAPI, requestStatusAPI, deviceAPI } from '../services/api'

function DeviceRequests() {
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [addFormData, setAddFormData] = useState({
    deviceName: '',
    deviceType: '',
    reason: '',
    status: 'Pending',
  })
  const [editFormData, setEditFormData] = useState({})
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false })
  const [devices, setDevices] = useState([])
  const [statuses, setStatuses] = useState([])

  useEffect(() => {
    fetchRequests()
    fetchDevices()
    fetchStatuses()
  }, [])

  const fetchRequests = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await requestAPI.getAll()
      setRequests(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to fetch device requests'
      setError(errorMsg)
      addToast(errorMsg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDevices = async () => {
    try{
      const data = await deviceAPI.getAll;
      setDevices(Array.isArray(data) ? data : data.data || [])
    } catch(err){
      const errMsg = err.data?.message || err.message || "Failed to fetch devices"
      console.error("Failed to get devices", err);
      addToast(errMsg, 'error');
    }
  }

  const fetchStatuses = async () => {
    try{
      const data = await requestStatusAPI.getAll();
      setStatuses(Array.isArray(data)? data : data.data || []);
    } catch (err){
      const errMsg = err.data?.message || err.message || "Failed to get Statuses"
      console.error("Failed to get statuses", err)
      addToast(errMsg, 'error')
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase())
    let matchesStatus = true
    if (statusFilter !== 'all') {
      // Normalize status comparison: convert filter value to match backend response
      const filterMap = {
        'pending': 'Pending',
        'received': 'Received',
        'on-hold': 'On Hold',
        'canceled': 'Canceled'
      }
      matchesStatus = request.status === (filterMap[statusFilter] || statusFilter)
    }
    return matchesSearch && matchesStatus
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadge = (status) => {
    const statusObj = statuses.find(s=>s.name === status)
    if (statusObj && statusObj.color){
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

  const handleViewRequest = (request) => {
    setSelectedRequest(request)
    setIsViewModalOpen(true)
  }

  const handleEditRequest = (request) => {
    setSelectedRequest(request)
    setEditFormData({
      deviceName: request.deviceName,
      deviceType: request.deviceType,
      reason: request.reason,
      status: request.status,
    })
    setIsEditDrawerOpen(true)
  }

  // const handleStatusChange = async (request, newStatus) => {
  //   setConfirmDialog({
  //     isOpen: true,
  //     title: 'Update Request Status',
  //     message: `Change request ${request.id} status to ${newStatus}?`,
  //     confirmText: 'Update',
  //     onConfirm: async () => {
  //       try {
  //         await requestAPI.update(request.id, { ...request, status: newStatus })
  //         addToast(`Request status updated to ${newStatus}`, 'success')
  //         setConfirmDialog({ isOpen: false })
  //         fetchRequests()
  //       } catch (err) {
  //         const errorMsg = err.data?.message || err.message || 'Failed to update status'
  //         addToast(errorMsg, 'error')
  //       }
  //     },
  //   })
  // }

  const handleSaveRequest = async () => {
    try {
      if (selectedRequest?.id) {
        await requestAPI.update(selectedRequest.id, editFormData)
        addToast('Device request updated successfully', 'success')
        setIsEditDrawerOpen(false)
        fetchRequests()
      }
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to update request'
      addToast(errorMsg, 'error')
    }
  }

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDeleteRequest = (request) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Device Request",
      message: `Are you sure you want to delete this repair request ${request.displayId}. This action cannot be undone`,
      confirmText: "Delete",
      isDangerous: true,
      onConfirm: async () => {
        try{
          await requestAPI.delete(request.id);
          addToast("Request deleted successfully", 'success')
          setConfirmDialog({ isOpen:false })
          fetchRequests();
        } catch (err){
          const errorMsg = err.data?.message || err.message || 'Failed to delete repair'
          addToast(errorMsg, 'error')
        }
      }
    })
  }

  const handleAddRequest = async () => {
    try {
      if (!addFormData.deviceName.trim() || !addFormData.deviceType.trim() || !addFormData.reason.trim()) {
        addToast('Please fill in all required fields', 'error')
        return
      }
      await requestAPI.create(addFormData)
      addToast('Device request submitted successfully', 'success')
      setIsAddDrawerOpen(false)
      setAddFormData({
        deviceName: '',
        deviceType: '',
        reason: '',
        status: 'Pending',
      })
      fetchRequests()
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to create request'
      addToast(errorMsg, 'error')
    }
  }

  return(
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
          <h1 className="text-3xl font-bold text-gray-900">Device Requests</h1>
          <p className="text-gray-600 mt-1">Manage device request approvals and workflows</p>
        </div>
        <button
          onClick={() => setIsAddDrawerOpen(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          New Request
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by requester or request ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="input-field pl-10"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2 justify-center">
            <Filter size={20} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="input-field"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="received">Received</option>
          <option value="on-hold">On Hold</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading device requests...</p>
            </div>
          ) : paginatedRequests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No device requests found</p>
            </div>
          ) : (
            <table>
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Request ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Requested By</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Request Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Recieved Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr key={request.id} className="table-row">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.displayId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.requestedBy}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.deviceName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.deviceType}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.requestDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.recievedate}</td>
                    <td className="px-6 py-4">
                      <span 
                        className="badge text-white px-3 py-1 rounded-full text-xs font-semibold"
                        style={{backgroundColor: getStatusBadge(request.status).color }}
                      >{request.status}</span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditRequest(request)}
                        className="btn-sm bg-orange-100 text-orange-600 hover:bg-orange-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(request)}
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
            Showing {paginatedRequests.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length}
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
        title="Submit Device Request"
        width="w-96"
      >
        <div className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
            <select 
              value={addFormData.deviceType}
              onChange={(e) => setAddFormData({...addFormData, deviceType: e.target.value})}
              className="input-field"
            >
              <option value="">Select device type</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Tablet">Tablet</option>
              <option value="Phone">Phone</option>
              <option value="Printer">Printer</option>
              <option value="Monitor">Monitor</option>
              <option value="Headset">Headset</option>
              <option value="Network Device">Network Device</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Request</label>
            <textarea 
              placeholder="Explain why you need this device..." 
              value={addFormData.reason}
              onChange={(e) => setAddFormData({...addFormData, reason: e.target.value})}
              className="input-field h-24" 
            />
          </div>
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setIsAddDrawerOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRequest}
              className="flex-1 btn-primary"
            >
              Submit Request
            </button>
          </div>
        </div>
      </SideDrawer>

      <SideDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Edit Device Request"
        width="w-96"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
            <input
              type="text"
              placeholder="e.g., Dell Latitude 5520"
              value={editFormData.deviceName || ''}
              onChange={(e) => handleInputChange('deviceName', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
            <select
              value={editFormData.deviceType}
              onChange={(e) => handleInputChange('deviceType', e.target.value)}
              className="input-field"
            >
              <option>Laptop</option>
              <option>Desktop</option>
              <option>Tablet</option>
              <option>Phone</option>
              <option>Printer</option>
              <option>Monitor</option>
              <option>Headset</option>
              <option>Network Device</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Request</label>
            <textarea
              value={editFormData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className="input-field h-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={editFormData.status || 'Pending'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="input-field"
            >
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
              <option value="On Hold">On Hold</option>
              <option value="Canceled">Canceled</option>
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
              onClick={handleSaveRequest}
              className="flex-1 btn-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      </SideDrawer>

      {selectedRequest && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Request Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Request ID</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRequest.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="badge text-white px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: getStatusBadge(selectedRequest.status).color }}
                >{selectedRequest.status}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Requested By</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRequest.requestedBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRequest.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Device Name</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRequest.deviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Device Type</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRequest.deviceType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Request Date</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRequest.requestDate}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Reason</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRequest.reason}</p>
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
        confirmText={confirmDialog.confirmText}
        isDangerous={confirmDialog.isDangerous}
      />
    </div>
    </>
  )
}

export default DeviceRequests
