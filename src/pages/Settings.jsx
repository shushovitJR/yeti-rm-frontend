import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, AlertCircle } from 'lucide-react'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../context/ToastContext'
import { vendorAPI, deviceAPI } from '../services/api'

function Settings() {
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('categories')
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false })

  // ============= Device Category State =============
  const [categories, setCategories] = useState([])
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [editingCategoryDescription, setEditingCategoryDescription] = useState('')

  // ============= Repair Status State =============
  const [repairStatuses, setRepairStatuses] = useState([
    { id: 1, name: 'Pending', color: '#f59e0b', description: 'Awaiting repair initiation' },
    { id: 2, name: 'In Progress', color: '#3b82f6', description: 'Currently being repaired' },
    { id: 3, name: 'Completed', color: '#10b981', description: 'Repair finished' },
    { id: 4, name: 'On Hold', color: '#8b5cf6', description: 'Temporarily paused' },
  ])
  const [isAddRepairStatusModalOpen, setIsAddRepairStatusModalOpen] = useState(false)
  const [isEditRepairStatusModalOpen, setIsEditRepairStatusModalOpen] = useState(false)
  const [newRepairStatusName, setNewRepairStatusName] = useState('')
  const [newRepairStatusColor, setNewRepairStatusColor] = useState('#3b82f6')
  const [newRepairStatusDescription, setNewRepairStatusDescription] = useState('')
  const [editingRepairStatusId, setEditingRepairStatusId] = useState(null)
  const [editingRepairStatusName, setEditingRepairStatusName] = useState('')
  const [editingRepairStatusColor, setEditingRepairStatusColor] = useState('')
  const [editingRepairStatusDescription, setEditingRepairStatusDescription] = useState('')

  // ============= Device Request Status State =============
  const [deviceRequestStatuses, setDeviceRequestStatuses] = useState([
    { id: 1, name: 'Pending', color: '#f59e0b', description: 'Awaiting approval' },
    { id: 2, name: 'Received', color: '#3b82f6', description: 'Request received and being processed' },
    { id: 3, name: 'On Hold', color: '#123456', description: 'Request temporarily paused' },
    { id: 4, name: 'Canceled', color: '#000000', description: 'Request has been canceled' },
  ])
  const [isAddRequestStatusModalOpen, setIsAddRequestStatusModalOpen] = useState(false)
  const [isEditRequestStatusModalOpen, setIsEditRequestStatusModalOpen] = useState(false)
  const [newRequestStatusName, setNewRequestStatusName] = useState('')
  const [newRequestStatusColor, setNewRequestStatusColor] = useState('#3b82f6')
  const [newRequestStatusDescription, setNewRequestStatusDescription] = useState('')
  const [editingRequestStatusId, setEditingRequestStatusId] = useState(null)
  const [editingRequestStatusName, setEditingRequestStatusName] = useState('')
  const [editingRequestStatusColor, setEditingRequestStatusColor] = useState('')
  const [editingRequestStatusDescription, setEditingRequestStatusDescription] = useState('')

  // ============= Vendor State =============
  const [vendors, setVendors] = useState([])
  const [isLoadingVendors, setIsLoadingVendors] = useState(false)
  const [vendorLoadError, setVendorLoadError] = useState('')
  const [newVendorName, setNewVendorName] = useState('')
  const [vendorError, setVendorError] = useState('')
  const [editingVendorId, setEditingVendorId] = useState(null)
  const [editingVendorName, setEditingVendorName] = useState('')

  // ============= Initialize Data =============
  useEffect(() => {
    fetchVendors()
    fetchCategories()
  }, [])

  // ============= Fetch Functions =============
  const fetchVendors = async () => {
    setIsLoadingVendors(true)
    setVendorLoadError('')
    try {
      const data = await vendorAPI.getAll()
      setVendors(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to fetch vendors'
      setVendorLoadError(errorMsg)
      addToast(errorMsg, 'error')
    } finally {
      setIsLoadingVendors(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await deviceAPI.getAll()
      setCategories(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to fetch devices'
      addToast(errorMsg, 'error')
    }
  }

  // ============= Device Category Functions =============
  const openEditCategoryMode = (category) => {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
    setEditingCategoryDescription(category.description)
    setIsEditCategoryModalOpen(true)
  }

  const closeEditCategoryMode = () => {
    setEditingCategoryId(null)
    setEditingCategoryName('')
    setEditingCategoryDescription('')
    setIsEditCategoryModalOpen(false)
  }

  const saveEditedCategory = async () => {
    if (!editingCategoryName.trim()) {
      addToast('Category name cannot be empty', 'error')
      return
    }

    if (categories.some(c => c.id !== editingCategoryId && c.name.toLowerCase() === editingCategoryName.toLowerCase())) {
      addToast('A category with this name already exists', 'error')
      return
    }

    try {
      await deviceAPI.update(editingCategoryId, { name: editingCategoryName, description: editingCategoryDescription })
      addToast('Category updated successfully', 'success')
      fetchCategories()
      closeEditCategoryMode()
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to update category'
      addToast(errorMsg, 'error')
    }
  }

  const deleteCategory = (category) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deviceAPI.delete(category.id)
          addToast('Category deleted successfully', 'success')
          setConfirmDialog({ isOpen: false })
          fetchCategories()
        } catch (err) {
          const errorMsg = err.data?.message || err.message || 'Failed to delete category'
          addToast(errorMsg, 'error')
        }
      },
      isDangerous: true,
    })
  }

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      addToast('Category name cannot be empty', 'error')
      return
    }

    if (categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
      addToast('The category name already exists', 'error')
      return
    }

    try {
      await deviceAPI.create({ name: newCategoryName, description: newCategoryDescription })
      setNewCategoryName('')
      setNewCategoryDescription('')
      addToast('Category added successfully', 'success')
      setIsAddCategoryModalOpen(false)
      fetchCategories()
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to add category'
      addToast(errorMsg, 'error')
    }
  }

  // ============= Repair Status Functions =============
  const openEditRepairStatusMode = (status) => {
    setEditingRepairStatusId(status.id)
    setEditingRepairStatusName(status.name)
    setEditingRepairStatusColor(status.color)
    setEditingRepairStatusDescription(status.description)
    setIsEditRepairStatusModalOpen(true)
  }

  const closeEditRepairStatusMode = () => {
    setEditingRepairStatusId(null)
    setEditingRepairStatusName('')
    setEditingRepairStatusColor('')
    setEditingRepairStatusDescription('')
    setIsEditRepairStatusModalOpen(false)
  }

  const saveEditedRepairStatus = () => {
    if (!editingRepairStatusName.trim()) {
      addToast('Status name cannot be empty', 'error')
      return
    }

    if (repairStatuses.some(s => s.id !== editingRepairStatusId && s.name.toLowerCase() === editingRepairStatusName.toLowerCase())) {
      addToast('A status with this name already exists', 'error')
      return
    }

    const updatedStatuses = repairStatuses.map(s =>
      s.id === editingRepairStatusId
        ? { ...s, name: editingRepairStatusName, color: editingRepairStatusColor, description: editingRepairStatusDescription }
        : s
    )
    setRepairStatuses(updatedStatuses)
    addToast('Repair status updated successfully', 'success')
    closeEditRepairStatusMode()
  }

  const deleteRepairStatus = (status) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Repair Status',
      message: `Are you sure you want to delete "${status.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: () => {
        setRepairStatuses(repairStatuses.filter(s => s.id !== status.id))
        addToast('Repair status deleted successfully', 'success')
        setConfirmDialog({ isOpen: false })
      },
      isDangerous: true,
    })
  }

  const createRepairStatus = () => {
    if (!newRepairStatusName.trim()) {
      addToast('Status name cannot be empty', 'error')
      return
    }

    if (repairStatuses.some(s => s.name.toLowerCase() === newRepairStatusName.toLowerCase())) {
      addToast('A status with this name already exists', 'error')
      return
    }

    const newId = Math.max(...repairStatuses.map(s => s.id), 0) + 1
    const newStatus = {
      id: newId,
      name: newRepairStatusName,
      color: newRepairStatusColor,
      description: newRepairStatusDescription,
    }
    setRepairStatuses([...repairStatuses, newStatus])
    setNewRepairStatusName('')
    setNewRepairStatusColor('#3b82f6')
    setNewRepairStatusDescription('')
    addToast('Repair status created successfully', 'success')
    setIsAddRepairStatusModalOpen(false)
  }

  // ============= Device Request Status Functions =============
  const openEditRequestStatusMode = (status) => {
    setEditingRequestStatusId(status.id)
    setEditingRequestStatusName(status.name)
    setEditingRequestStatusColor(status.color)
    setEditingRequestStatusDescription(status.description)
    setIsEditRequestStatusModalOpen(true)
  }

  const closeEditRequestStatusMode = () => {
    setEditingRequestStatusId(null)
    setEditingRequestStatusName('')
    setEditingRequestStatusColor('')
    setEditingRequestStatusDescription('')
    setIsEditRequestStatusModalOpen(false)
  }

  const saveEditedRequestStatus = () => {
    if (!editingRequestStatusName.trim()) {
      addToast('Status name cannot be empty', 'error')
      return
    }

    if (deviceRequestStatuses.some(s => s.id !== editingRequestStatusId && s.name.toLowerCase() === editingRequestStatusName.toLowerCase())) {
      addToast('A status with this name already exists', 'error')
      return
    }

    const updatedStatuses = deviceRequestStatuses.map(s =>
      s.id === editingRequestStatusId
        ? { ...s, name: editingRequestStatusName, color: editingRequestStatusColor, description: editingRequestStatusDescription }
        : s
    )
    setDeviceRequestStatuses(updatedStatuses)
    addToast('Request status updated successfully', 'success')
    closeEditRequestStatusMode()
  }

  const deleteRequestStatus = (status) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Request Status',
      message: `Are you sure you want to delete "${status.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: () => {
        setDeviceRequestStatuses(deviceRequestStatuses.filter(s => s.id !== status.id))
        addToast('Request status deleted successfully', 'success')
        setConfirmDialog({ isOpen: false })
      },
      isDangerous: true,
    })
  }

  const createRequestStatus = () => {
    if (!newRequestStatusName.trim()) {
      addToast('Status name cannot be empty', 'error')
      return
    }

    if (deviceRequestStatuses.some(s => s.name.toLowerCase() === newRequestStatusName.toLowerCase())) {
      addToast('A status with this name already exists', 'error')
      return
    }

    const newId = Math.max(...deviceRequestStatuses.map(s => s.id), 0) + 1
    const newStatus = {
      id: newId,
      name: newRequestStatusName,
      color: newRequestStatusColor,
      description: newRequestStatusDescription,
    }
    setDeviceRequestStatuses([...deviceRequestStatuses, newStatus])
    setNewRequestStatusName('')
    setNewRequestStatusColor('#3b82f6')
    setNewRequestStatusDescription('')
    addToast('Request status created successfully', 'success')
    setIsAddRequestStatusModalOpen(false)
  }

  // ============= Vendor Functions =============
  const openEditVendorMode = (vendor) => {
    setEditingVendorId(vendor.id)
    setEditingVendorName(vendor.name)
  }

  const closeEditVendorMode = () => {
    setEditingVendorId(null)
    setEditingVendorName('')
  }

  const saveEditedVendor = async () => {
    if (!editingVendorName.trim()) {
      addToast('Vendor name cannot be empty', 'error')
      return
    }

    if (vendors.some(v => v.id !== editingVendorId && v.name.toLowerCase() === editingVendorName.toLowerCase())) {
      addToast('A vendor with this name already exists', 'error')
      return
    }

    try {
      await vendorAPI.update(editingVendorId, { name: editingVendorName })
      addToast('Vendor updated successfully', 'success')
      fetchVendors()
      closeEditVendorMode()
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to update vendor'
      addToast(errorMsg, 'error')
    }
  }

  const deleteVendor = (vendor) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Vendor',
      message: `Are you sure you want to delete "${vendor.name}"? This vendor will be removed from all repair assignments and device request forms.`,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await vendorAPI.delete(vendor.id)
          addToast('Vendor deleted successfully', 'success')
          setConfirmDialog({ isOpen: false })
          fetchVendors()
        } catch (err) {
          const errorMsg = err.data?.message || err.message || 'Failed to delete vendor'
          addToast(errorMsg, 'error')
        }
      },
      isDangerous: true,
    })
  }

  const createVendor = async () => {
    setVendorError('')

    if (!newVendorName.trim()) {
      setVendorError('Vendor name cannot be empty')
      return
    }

    if (vendors.some(v => v.name.toLowerCase() === newVendorName.toLowerCase())) {
      setVendorError('This vendor already exists')
      return
    }

    try {
      await vendorAPI.create({ name: newVendorName })
      setNewVendorName('')
      addToast('Vendor added successfully', 'success')
      fetchVendors()
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to add vendor'
      setVendorError(errorMsg)
      addToast(errorMsg, 'error')
    }
  }


  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure system settings and preferences</p>
      </div>

      <div className="card">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'categories', label: 'Device Categories' },
            { id: 'repair-status', label: 'Repair Status Types' },
            { id: 'device-request-status', label: 'Device Request Status Types' },
            { id: 'vendors', label: 'Vendor Management' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Device Categories</h2>
                <button
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Category
                </button>
              </div>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditCategoryMode(category)}
                        className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteCategory(category)}
                        className="btn-sm bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'repair-status' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Repair Status Types</h2>
                <button
                  onClick={() => setIsAddRepairStatusModalOpen(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Status
                </button>
              </div>
              <div className="space-y-2">
                {repairStatuses.map(status => (
                  <div key={status.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{status.name}</p>
                        <p className="text-sm text-gray-600">{status.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditRepairStatusMode(status)}
                        className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteRepairStatus(status)}
                        className="btn-sm bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'device-request-status' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Device Request Status Types</h2>
                <button
                  onClick={() => setIsAddRequestStatusModalOpen(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Status
                </button>
              </div>
              <div className="space-y-2">
                {deviceRequestStatuses.map(status => (
                  <div key={status.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{status.name}</p>
                        <p className="text-sm text-gray-600">{status.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditRequestStatusMode(status)}
                        className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteRequestStatus(status)}
                        className="btn-sm bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Vendor Management</h2>
              {vendorLoadError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">{vendorLoadError}</p>
                </div>
              )}
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add New Vendor</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter vendor name"
                      value={newVendorName}
                      onChange={(e) => {
                        setNewVendorName(e.target.value)
                        setVendorError('')
                      }}
                      className="flex-1 input-field"
                    />
                    <button
                      onClick={createVendor}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Add
                    </button>
                  </div>
                  {vendorError && (
                    <div className="flex items-center gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle size={16} className="text-red-600" />
                      <p className="text-sm text-red-600">{vendorError}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Vendors</h3>
                  {isLoadingVendors ? (
                    <p className="text-sm text-gray-600 p-4 text-center">Loading vendors...</p>
                  ) : vendors.length === 0 ? (
                    <p className="text-sm text-gray-600 p-4 text-center">No vendors added yet</p>
                  ) : (
                    vendors.map(vendor => (
                      <div key={vendor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        {editingVendorId === vendor.id ? (
                          <div className="flex-1 flex gap-2 items-center">
                            <input
                              type="text"
                              value={editingVendorName}
                              onChange={(e) => setEditingVendorName(e.target.value)}
                              className="flex-1 input-field"
                              autoFocus
                            />
                            <button
                              onClick={saveEditedVendor}
                              className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                              title="Save"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={closeEditVendorMode}
                              className="btn-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium text-gray-900">{vendor.name}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditVendorMode(vendor)}
                                className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => deleteVendor(vendor)}
                                className="btn-sm bg-red-100 text-red-600 hover:bg-red-200"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="Add New Category"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter category name"
              className="input-field"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Enter description"
              className="input-field h-20"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setIsAddCategoryModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={createCategory}
              className="flex-1 btn-primary"
            >
              Add Category
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      {editingCategoryId && (
        <Modal
          isOpen={isEditCategoryModalOpen}
          onClose={closeEditCategoryMode}
          title="Edit Category"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="input-field"
                value={editingCategoryName}
                onChange={(e) => setEditingCategoryName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="input-field h-20"
                value={editingCategoryDescription}
                onChange={(e) => setEditingCategoryDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeEditCategoryMode}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedCategory}
                className="flex-1 btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Repair Status Modal */}
      <Modal
        isOpen={isAddRepairStatusModalOpen}
        onClose={() => setIsAddRepairStatusModalOpen(false)}
        title="Add New Repair Status"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter status name"
              className="input-field"
              value={newRepairStatusName}
              onChange={(e) => setNewRepairStatusName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 flex-wrap">
                {['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#ec4899', '#f97316', '#06b6d4'].map(color => (
                  <button
                    key={color}
                    onClick={() => setNewRepairStatusColor(color)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      newRepairStatusColor === color ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Custom:</label>
                <input
                  type="color"
                  value={newRepairStatusColor}
                  onChange={(e) => setNewRepairStatusColor(e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <p className="text-sm text-gray-600">Preview:</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: newRepairStatusColor }}
                />
                <span className="text-sm font-mono text-gray-700">{newRepairStatusColor}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Enter description"
              className="input-field h-20"
              value={newRepairStatusDescription}
              onChange={(e) => setNewRepairStatusDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setIsAddRepairStatusModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={createRepairStatus}
              className="flex-1 btn-primary"
            >
              Add Status
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Repair Status Modal */}
      {editingRepairStatusId && (
        <Modal
          isOpen={isEditRepairStatusModalOpen}
          onClose={closeEditRepairStatusMode}
          title="Edit Repair Status"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="input-field"
                value={editingRepairStatusName}
                onChange={(e) => setEditingRepairStatusName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex items-center gap-4">
                <div className="flex gap-2 flex-wrap">
                  {['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#ec4899', '#f97316', '#06b6d4'].map(color => (
                    <button
                      key={color}
                      onClick={() => setEditingRepairStatusColor(color)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        editingRepairStatusColor === color ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Custom:</label>
                  <input
                    type="color"
                    value={editingRepairStatusColor}
                    onChange={(e) => setEditingRepairStatusColor(e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <p className="text-sm text-gray-600">Preview:</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border border-gray-300"
                    style={{ backgroundColor: editingRepairStatusColor }}
                  />
                  <span className="text-sm font-mono text-gray-700">{editingRepairStatusColor}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="input-field h-20"
                value={editingRepairStatusDescription}
                onChange={(e) => setEditingRepairStatusDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeEditRepairStatusMode}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedRepairStatus}
                className="flex-1 btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Device Request Status Modal */}
      <Modal
        isOpen={isAddRequestStatusModalOpen}
        onClose={() => setIsAddRequestStatusModalOpen(false)}
        title="Add New Request Status"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter status name"
              className="input-field"
              value={newRequestStatusName}
              onChange={(e) => setNewRequestStatusName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 flex-wrap">
                {['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#ec4899', '#f97316', '#06b6d4'].map(color => (
                  <button
                    key={color}
                    onClick={() => setNewRequestStatusColor(color)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      newRequestStatusColor === color ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Custom:</label>
                <input
                  type="color"
                  value={newRequestStatusColor}
                  onChange={(e) => setNewRequestStatusColor(e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <p className="text-sm text-gray-600">Preview:</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: newRequestStatusColor }}
                />
                <span className="text-sm font-mono text-gray-700">{newRequestStatusColor}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Enter description"
              className="input-field h-20"
              value={newRequestStatusDescription}
              onChange={(e) => setNewRequestStatusDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setIsAddRequestStatusModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={createRequestStatus}
              className="flex-1 btn-primary"
            >
              Add Status
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Device Request Status Modal */}
      {editingRequestStatusId && (
        <Modal
          isOpen={isEditRequestStatusModalOpen}
          onClose={closeEditRequestStatusMode}
          title="Edit Request Status"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="input-field"
                value={editingRequestStatusName}
                onChange={(e) => setEditingRequestStatusName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex items-center gap-4">
                <div className="flex gap-2 flex-wrap">
                  {['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#ec4899', '#f97316', '#06b6d4'].map(color => (
                    <button
                      key={color}
                      onClick={() => setEditingRequestStatusColor(color)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        editingRequestStatusColor === color ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Custom:</label>
                  <input
                    type="color"
                    value={editingRequestStatusColor}
                    onChange={(e) => setEditingRequestStatusColor(e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <p className="text-sm text-gray-600">Preview:</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border border-gray-300"
                    style={{ backgroundColor: editingRequestStatusColor }}
                  />
                  <span className="text-sm font-mono text-gray-700">{editingRequestStatusColor}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="input-field h-20"
                value={editingRequestStatusDescription}
                onChange={(e) => setEditingRequestStatusDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeEditRequestStatusMode}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedRequestStatus}
                className="flex-1 btn-primary"
              >
                Save Changes
              </button>
            </div>
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

export default Settings
