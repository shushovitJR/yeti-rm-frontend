import React, { useState } from 'react'
import { Search, Filter, Plus, Eye, Edit } from 'lucide-react'
import SideDrawer from '../components/SideDrawer'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../context/ToastContext'

function DeviceRequests() {
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false })

  const [requests] = useState([
    { id: 'REQ001', requestedBy: 'John Smith', department: 'Sales', deviceType: 'Laptop', reason: 'New hire onboarding', requestDate: '2024-01-10', status: 'received' },
    { id: 'REQ002', requestedBy: 'Sarah Johnson', department: 'HR', deviceType: 'Desktop', reason: 'Replacement for old unit', requestDate: '2024-01-08', status: 'received' },
    { id: 'REQ003', requestedBy: 'Mike Davis', department: 'IT', deviceType: 'Tablet', reason: 'Field work support', requestDate: '2024-01-12', status: 'received' },
    { id: 'REQ004', requestedBy: 'Emily Brown', department: 'Marketing', deviceType: 'Laptop', reason: 'Video editing work', requestDate: '2024-01-05', status: 'received' },
    { id: 'REQ005', requestedBy: 'David Wilson', department: 'Finance', deviceType: 'Monitor', reason: 'Dual monitor setup', requestDate: '2024-01-11', status: 'canceled' },
    { id: 'REQ006', requestedBy: 'Lisa Chen', department: 'Engineering', deviceType: 'Laptop', reason: 'Development work', requestDate: '2024-01-09', status: 'received' },
    { id: 'REQ007', requestedBy: 'Tom Anderson', department: 'Operations', deviceType: 'Phone', reason: 'Mobile device for field', requestDate: '2024-01-06', status: 'received' },
    { id: 'REQ008', requestedBy: 'Jessica Lee', department: 'Support', deviceType: 'Headset', reason: 'Call center equipment', requestDate: '2024-01-13', status: 'received' },
  ])

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge bg-yellow-100 text-yellow-800',
      received: 'badge bg-green-100 text-green-800',
      'on-hold': 'badge bg-purple-100 text-purple-800',
      canceled: 'badge bg-red-100 text-red-800',
    }
    return badges[status] || 'badge badge-info'
  }

  const handleViewRequest = (request) => {
    setSelectedRequest(request)
    setIsViewModalOpen(true)
  }

  const handleEditRequest = (request) => {
    setSelectedRequest(request)
    setEditFormData({
      requestedBy: request.requestedBy,
      department: request.department,
      deviceType: request.deviceType,
      reason: request.reason,
      requestDate: request.requestDate,
      status: request.status,
    })
    setIsEditDrawerOpen(true)
  }

  const handleStatusChange = (request, newStatus) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Update Request Status',
      message: `Change request ${request.id} status to ${newStatus}?`,
      confirmText: 'Update',
      onConfirm: () => {
        addToast(`Request status updated to ${newStatus}`, 'success')
        setConfirmDialog({ isOpen: false })
      },
    })
  }

  const handleSaveRequest = () => {
    setIsEditDrawerOpen(false)
    addToast('Device request updated successfully', 'success')
  }

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddRequest = () => {
    setIsAddDrawerOpen(false)
    addToast('Device request submitted successfully', 'success')
  }

  return (
    <div className="p-6 space-y-6">
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
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Request ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Requested By</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Request Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((request) => (
                <tr key={request.id} className="table-row">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.requestedBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.deviceType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.requestDate}</td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(request.status)}>{request.status}</span>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Device Category</label>
            <select className="input-field">
              <option>Select category</option>
              <option>Laptop</option>
              <option>Desktop</option>
              <option>Tablet</option>
              <option>Phone</option>
              <option>Printer</option>
              <option>Network Device</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
            <input type="text" placeholder="e.g., Dell Latitude 5520" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
            <input type="date" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select className="input-field">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Request</label>
            <textarea placeholder="Explain why you need this device..." className="input-field h-24" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor (Optional)</label>
            <select className="input-field">
              <option>Select vendor</option>
              <option>TechRepair Inc</option>
              <option>QuickFix Services</option>
              <option>Apple Care</option>
              <option>Office Equipment Co</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Requested By</label>
            <input
              type="text"
              value={editFormData.requestedBy}
              onChange={(e) => handleInputChange('requestedBy', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              value={editFormData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
            <input
              type="date"
              value={editFormData.requestDate}
              onChange={(e) => handleInputChange('requestDate', e.target.value)}
              className="input-field"
            />
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
              value={editFormData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="input-field"
            >
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="on-hold">On Hold</option>
              <option value="canceled">Canceled</option>
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
                <span className={getStatusBadge(selectedRequest.status)}>{selectedRequest.status}</span>
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
  )
}

export default DeviceRequests
