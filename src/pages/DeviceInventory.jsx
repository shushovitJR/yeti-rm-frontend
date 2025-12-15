import React, { useState } from 'react'
import { Search, Filter, Download, Eye, Edit, Plus } from 'lucide-react'
import Modal from '../components/Modal'
import { useToast } from '../context/ToastContext'

function DeviceInventory() {
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)

  const [devices] = useState([
    { id: 'DEV001', name: 'Dell Latitude 5520', category: 'Laptops', serial: 'DL5520-001', assignedTo: 'John Smith', status: 'available' },
    { id: 'DEV002', name: 'HP EliteBook 840', category: 'Laptops', serial: 'HP840-002', assignedTo: 'Sarah Johnson', status: 'assigned' },
    { id: 'DEV003', name: 'Lenovo ThinkPad', category: 'Laptops', serial: 'LT-003', assignedTo: 'Unassigned', status: 'in-repair' },
    { id: 'DEV004', name: 'Dell OptiPlex 7090', category: 'Desktops', serial: 'DO7090-004', assignedTo: 'Mike Davis', status: 'assigned' },
    { id: 'DEV005', name: 'HP ProDesk 600', category: 'Desktops', serial: 'HP600-005', assignedTo: 'Unassigned', status: 'available' },
    { id: 'DEV006', name: 'iPad Air 5', category: 'Tablets', serial: 'IPAD-006', assignedTo: 'Emily Brown', status: 'assigned' },
    { id: 'DEV007', name: 'Samsung Galaxy Tab', category: 'Tablets', serial: 'SGT-007', assignedTo: 'Unassigned', status: 'available' },
    { id: 'DEV008', name: 'iPhone 14 Pro', category: 'Phones', serial: 'IP14-008', assignedTo: 'David Wilson', status: 'assigned' },
    { id: 'DEV009', name: 'Samsung Galaxy S23', category: 'Phones', serial: 'SGS23-009', assignedTo: 'Unassigned', status: 'available' },
    { id: 'DEV010', name: 'HP LaserJet Pro', category: 'Printers', serial: 'HPLJ-010', assignedTo: 'Office', status: 'available' },
  ])

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || device.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage)
  const paginatedDevices = filteredDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadge = (status) => {
    const badges = {
      available: 'badge badge-success',
      assigned: 'badge badge-info',
      'in-repair': 'badge badge-warning',
    }
    return badges[status] || 'badge badge-info'
  }

  const handleExport = (format) => {
    addToast(`Exporting to ${format.toUpperCase()}...`, 'success')
  }

  const handleAddDevice = () => {
    setIsAddModalOpen(false)
    addToast('Device added successfully', 'success')
  }

  const handleViewDevice = (device) => {
    setSelectedDevice(device)
    setIsViewModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Device Inventory</h1>
          <p className="text-gray-600 mt-1">Manage and track all devices in the system</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Add Device
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by device name or ID..."
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

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="input-field"
          >
            <option value="all">All Categories</option>
            <option value="Laptops">Laptops</option>
            <option value="Desktops">Desktops</option>
            <option value="Tablets">Tablets</option>
            <option value="Phones">Phones</option>
            <option value="Printers">Printers</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="in-repair">In Repair</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="btn-secondary flex items-center gap-2 justify-center"
            >
              <Download size={20} />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="btn-secondary flex items-center gap-2 justify-center"
            >
              <Download size={20} />
              <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Serial Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Assigned To</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDevices.map((device) => (
                <tr key={device.id} className="table-row">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{device.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{device.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{device.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{device.serial}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{device.assignedTo}</td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(device.status)}>{device.status}</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleViewDevice(device)}
                      className="btn-sm bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      <Eye size={16} />
                    </button>
                    <button className="btn-sm bg-gray-100 text-gray-600 hover:bg-gray-200">
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
            Showing {paginatedDevices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredDevices.length)} of {filteredDevices.length}
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

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Device"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
            <input type="text" placeholder="e.g., Dell Latitude 5520" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="input-field">
                <option>Laptops</option>
                <option>Desktops</option>
                <option>Tablets</option>
                <option>Phones</option>
                <option>Printers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
              <input type="text" placeholder="Serial number" className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDevice}
              className="flex-1 btn-primary"
            >
              Add Device
            </button>
          </div>
        </div>
      </Modal>

      {selectedDevice && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Device Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Device ID</p>
                <p className="text-lg font-semibold text-gray-900">{selectedDevice.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Device Name</p>
                <p className="text-lg font-semibold text-gray-900">{selectedDevice.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="text-lg font-semibold text-gray-900">{selectedDevice.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Serial Number</p>
                <p className="text-lg font-semibold text-gray-900">{selectedDevice.serial}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assigned To</p>
                <p className="text-lg font-semibold text-gray-900">{selectedDevice.assignedTo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={getStatusBadge(selectedDevice.status)}>{selectedDevice.status}</span>
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
    </div>
  )
}

export default DeviceInventory
