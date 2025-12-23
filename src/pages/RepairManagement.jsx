import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Eye, Edit, AlertCircle } from 'lucide-react'
import SideDrawer from '../components/SideDrawer'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../context/ToastContext'
import { repairAPI, vendorAPI } from '../services/api'

function RepairManagement() {
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
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
  const [addFormData, setAddFormData] = useState({
    deviceCategory: '',
    deviceName: '',
    issueDate: '',
    returnedDate: '',
    issue: '',
    vendor: '',
  })
  const [editFormData, setEditFormData] = useState({
    deviceName: '',
    deviceCategory: '',
    issueDate: '',
    returnedDate: '',
    issue: '',
    vendor: '',
    status: 'pending',
  })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false })


  // Fetch repairs and vendors on component mount
  useEffect(() => {
    fetchRepairs()
    fetchVendors()
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

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch = repair.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.displayId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || repair.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredRepairs.length / itemsPerPage)
  const paginatedRepairs = filteredRepairs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'badge badge-warning',
      'In Progress': 'badge badge-info',
      Completed: 'badge badge-success',
    }
    return badges[status] || 'badge badge-info'
  }

  const deviceCategories = ['Laptop', 'Desktop', 'Tablet', 'Phone', 'Printer', 'Network Device', 'Other']
  const statuses = ['Pending', 'In Progress', 'Completed']

  const handleViewRepair = (repair) => {
    setSelectedRepair(repair)
    setIsViewModalOpen(true)
  }

  const handleEditRepair = (repair) => {
    setSelectedRepair(repair)
    setEditFormData({
      deviceName: repair.deviceName,
      deviceCategory: repair.deviceCategory,
      issueDate: repair.issueDate,
      returnedDate: repair.returnedDate === '-' ? '' : repair.returnedDate,
      issue: repair.issue,
      vendor: repair.vendor,
      status: repair.status,
    })
    setIsEditDrawerOpen(true)
  }

  const handleSaveRepair = async () => {
    try {
      if (selectedRepair?.id) {
        await repairAPI.update(selectedRepair.id, editFormData)
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
      await repairAPI.create(addFormData)
      addToast('Repair ticket created successfully', 'success')
      setIsAddDrawerOpen(false)
      setAddFormData({
        deviceCategory: '',
        deviceName: '',
        issueDate: '',
        returnedDate: '',
        issue: '',
        vendor: '',
      })
      fetchRepairs()
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to create repair'
      addToast(errorMsg, 'error')
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
        <button
          onClick={() => setIsAddDrawerOpen(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          New Repair
        </button>
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
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
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
            <table>
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Repair ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Issue</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Returned Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRepairs.map((repair) => (
                  <tr key={repair.id} className="table-row">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{repair.displayId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{repair.deviceName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{repair.issue}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{repair.issueDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{repair.returnedDate || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{repair.vendor}</td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(repair.status)}>{repair.status}</span>
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
            <select 
              value={addFormData.deviceCategory}
              onChange={(e) => setAddFormData({...addFormData, deviceCategory: e.target.value})}
              className="input-field"
            >
              <option value="">Select category</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Tablet">Tablet</option>
              <option value="Phone">Phone</option>
              <option value="Printer">Printer</option>
              <option value="Network Device">Network Device</option>
              <option value="Other">Other</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Device Category</label>
            <select
              value={editFormData.deviceCategory}
              onChange={(e) => handleInputChange('deviceCategory', e.target.value)}
              className="input-field"
            >
              {deviceCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
            <input
              type="text"
              value={editFormData.deviceName}
              onChange={(e) => handleInputChange('deviceName', e.target.value)}
              className="input-field"
            />
          </div>
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
              value={editFormData.returnedDate || ''}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={editFormData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="input-field"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
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
                <span className={getStatusBadge(selectedRepair.status)}>{selectedRepair.status}</span>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Issue Description</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.issue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.issueDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Returned Date</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.returnedDate || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vendor</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.vendor}</p>
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
