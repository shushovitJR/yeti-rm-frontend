import React, { useState } from 'react'
import { Search, Filter, Plus, Eye, Edit } from 'lucide-react'
import SideDrawer from '../components/SideDrawer'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../context/ToastContext'

function RepairManagement() {
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedRepair, setSelectedRepair] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false })

  const [repairs] = useState([
    { id: 'REP001', deviceName: 'Dell Latitude 5520', deviceCategory: 'Laptop', issue: 'Screen flickering', issueDate: '2024-01-10', vendor: 'TechRepair Inc', status: 'pending' },
    { id: 'REP002', deviceName: 'HP EliteBook 840', deviceCategory: 'Laptop', issue: 'Battery not charging', issueDate: '2024-01-08', vendor: 'QuickFix Services', status: 'in-progress' },
    { id: 'REP003', deviceName: 'Lenovo ThinkPad', deviceCategory: 'Laptop', issue: 'Keyboard malfunction', issueDate: '2024-01-05', vendor: 'TechRepair Inc', status: 'completed' },
    { id: 'REP004', deviceName: 'iPad Air 5', deviceCategory: 'Tablet', issue: 'Touch screen not responding', issueDate: '2024-01-12', vendor: 'Apple Care', status: 'pending' },
    { id: 'REP005', deviceName: 'iPhone 14 Pro', deviceCategory: 'Phone', issue: 'Cracked screen', issueDate: '2024-01-09', vendor: 'Apple Care', status: 'in-progress' },
    { id: 'REP006', deviceName: 'Dell OptiPlex 7090', deviceCategory: 'Desktop', issue: 'Hard drive failure', issueDate: '2024-01-06', vendor: 'TechRepair Inc', status: 'in-progress' },
    { id: 'REP007', deviceName: 'Samsung Galaxy Tab', deviceCategory: 'Tablet', issue: 'Software crash', issueDate: '2024-01-11', vendor: 'QuickFix Services', status: 'pending' },
    { id: 'REP008', deviceName: 'HP LaserJet Pro', deviceCategory: 'Printer', issue: 'Paper jam error', issueDate: '2024-01-07', vendor: 'Office Equipment Co', status: 'completed' },
  ])

  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = repair.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.id.toLowerCase().includes(searchTerm.toLowerCase())
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
      pending: 'badge badge-warning',
      'in-progress': 'badge badge-info',
      completed: 'badge badge-success',
    }
    return badges[status] || 'badge badge-info'
  }

  const vendors = ['TechRepair Inc', 'QuickFix Services', 'Apple Care', 'Office Equipment Co']
  const deviceCategories = ['Laptop', 'Desktop', 'Tablet', 'Phone', 'Printer', 'Network Device', 'Other']
  const statuses = ['pending', 'in-progress', 'completed']

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
      issue: repair.issue,
      vendor: repair.vendor,
      status: repair.status,
    })
    setIsEditDrawerOpen(true)
  }

  const handleSaveRepair = () => {
    setIsEditDrawerOpen(false)
    addToast('Repair ticket updated successfully', 'success')
  }

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddRepair = () => {
    setIsAddDrawerOpen(false)
    addToast('Repair ticket created successfully', 'success')
  }

  return (
    <div className="p-6 space-y-6">
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
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Repair ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Issue</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRepairs.map((repair) => (
                <tr key={repair.id} className="table-row">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{repair.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{repair.deviceName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{repair.issue}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{repair.issueDate}</td>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
            <input type="date" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
            <textarea placeholder="Describe the issue..." className="input-field h-24" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Assignment *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
            <textarea
              value={editFormData.issue}
              onChange={(e) => handleInputChange('issue', e.target.value)}
              className="input-field h-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Assignment *</label>
            <select
              value={editFormData.vendor}
              onChange={(e) => handleInputChange('vendor', e.target.value)}
              className="input-field"
            >
              {vendors.map(v => (
                <option key={v} value={v}>{v}</option>
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
                <p className="text-lg font-semibold text-gray-900">{selectedRepair.id}</p>
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
  )
}

export default RepairManagement
