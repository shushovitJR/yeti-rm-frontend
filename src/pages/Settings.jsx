import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, AlertCircle } from 'lucide-react'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../context/ToastContext'
import { vendorAPI, deviceAPI } from '../services/api'

function Settings() {
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('categories')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editingItemColor, setEditingItemColor] = useState('')
  const [addingItemColor, setAddingItemColor] = useState('#3b82f6')
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false })
  const [newVendorName, setNewVendorName] = useState('')
  const [vendorError, setVendorError] = useState('')
  const [vendors, setVendors] = useState([])
  const [isLoadingVendors, setIsLoadingVendors] = useState(false)
  const [vendorLoadError, setVendorLoadError] = useState('')
  const [editingVendorId, setEditingVendorId] = useState(null)
  const [editingVendorName, setEditingVendorName] = useState('')

  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('No description provided')


  const [repairStatuses] = useState([
    { id: 1, name: 'Pending', color: '#f59e0b', description: 'Awaiting repair initiation' },
    { id: 2, name: 'In Progress', color: '#3b82f6', description: 'Currently being repaired' },
    { id: 3, name: 'Completed', color: '#10b981', description: 'Repair finished' },
    { id: 4, name: 'On Hold', color: '#8b5cf6', description: 'Temporarily paused' },
  ])

  const [deviceRequestStatuses] = useState([
    { id: 1, name: 'Pending', color: '#f59e0b', description: 'Awaiting approval' },
    { id: 2, name: 'Received', color: '#3b82f6', description: 'Request received and being processed' },
    { id: 3, name: 'On Hold', color: '#123456', description: 'Request temporarily paused' },
    { id: 4, name: 'Canceled', color: '#000000', description: 'Request has been canceled' },
  ])

  // Fetch vendors on component mount
  useEffect(() => {
    fetchVendors(),
    fetchCategories()
  }, [])

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
    try{
      const data = await deviceAPI.getAll()
      setCategories(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Failed to fetch devices'
      addToast(errorMsg, 'error')
    }
  }

  const handleDeleteItem = (item, type) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${type}`,
      message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: () => {
        addToast(`${type} deleted successfully`, 'success')
        setConfirmDialog({ isOpen: false })
      },
      isDangerous: true,
    })
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()){
      addToast('Category name cannot be empty', 'error')
      return
    };
    if (categories.some(c=>c.name.toLowerCase() === newCategoryName.toLowerCase())){
      addToast('The category name already exists', 'error')
      return
    };
    try{
      await deviceAPI.create({ name:newCategoryName, description:newCategoryDescription })
      setNewCategoryName('')
      setNewCategoryDescription('')
      addToast('Successfully added category', 'success')
      fetchCategories()
    } catch (err){
      const errMsg = err.data?.message || err.message || 'Failed to add category'
      addToast(errMsg, 'error')
    }
  }

  const handleAddItem = () => {
    setIsAddModalOpen(false)
    setAddingItemColor('#3b82f6')
    addToast('Item added successfully', 'success')
  }

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setEditingItemColor(item.color || '#3b82f6')
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    setIsEditModalOpen(false)
    addToast('Item updated successfully', 'success')
  }

  const handleAddVendor = async () => {
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

  const handleDeleteVendor = (vendor) => {
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

  const handleEditVendor = (vendor) => {
    setEditingVendorId(vendor.id)
    setEditingVendorName(vendor.name)
  }

  const handleCancelEditVendor = () => {
    setEditingVendorId(null)
    setEditingVendorName('')
  }

  const handleSaveVendorEdit = async () => {
    if (!editingVendorName.trim()) {
      addToast('Vendor name cannot be empty', 'error')
      return
    }

    if (vendors.some(v => v.id !== editingVendorId && v.name.toLowerCase() === editingVendorName.toLowerCase())) {
      addToast('A vendor with this name already exists', 'error')
      return
    }
     try{
      await vendorAPI.update(editingVendorId, {name: editingVendorName})
      addToast('Vendor Edited Successfully', 'success')
      fetchVendors()
      handleCancelEditVendor()
      } catch (err){
        const errMsg = err.data?.message || err.message || 'Failed to edit vendor'
        addToast(errMsg, 'error') 
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
                  onClick={() => setIsAddModalOpen(true)}
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
                        onClick={() => handleEditItem(category)}
                        className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(category, 'Category')}
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
                  onClick={() => setIsAddModalOpen(true)}
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
                        onClick={() => handleEditItem(status)}
                        className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(status, 'Status')}
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
                  onClick={() => setIsAddModalOpen(true)}
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
                        onClick={() => handleEditItem(status)}
                        className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(status, 'Status')}
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
                      onClick={handleAddVendor}
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
                              onClick={handleSaveVendorEdit}
                              className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                              title="Save"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={handleCancelEditVendor}
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
                                onClick={() => handleEditVendor(vendor)}
                                className="btn-sm bg-green-100 text-green-600 hover:bg-green-200"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteVendor(vendor)}
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

      {activeTab !== 'vendors' && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={`Add New ${activeTab === 'categories' ? 'Category' : 'Status'}`}
          size="md"
        >
          {(activeTab === 'repair-status' || activeTab === 'device-request-status') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" placeholder="Enter name" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2 flex-wrap">
                    {['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#ec4899', '#f97316', '#06b6d4'].map(color => (
                      <button
                        key={color}
                        onClick={() => setAddingItemColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          addingItemColor === color ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'
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
                      value={addingItemColor}
                      onChange={(e) => setAddingItemColor(e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <p className="text-sm text-gray-600">Preview:</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: addingItemColor }}
                    />
                    <span className="text-sm font-mono text-gray-700">{addingItemColor}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea placeholder="Enter description" className="input-field h-20" />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="flex-1 btn-primary"
                >
                  Add
                </button>
              </div>
            </div>
          )}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" placeholder="Enter name" className="input-field" 
                  value = {newCategoryName}
                  onChange={(e)=>{
                    setNewCategoryName(e.target.value)
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea placeholder="Enter description" className="input-field h-20" 
                  value = {newCategoryDescription}
                  onChange={(e)=>{
                    setNewCategoryDescription(e.target.value)
                  }}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 btn-primary"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {selectedItem && activeTab !== 'vendors' && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Item"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" defaultValue={selectedItem.name} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea defaultValue={selectedItem.description} className="input-field h-20" />
            </div>
            {(activeTab === 'repair-status' || activeTab === 'device-request-status') && selectedItem.color && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Color</label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2 flex-wrap">
                    {['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#ec4899', '#f97316', '#06b6d4'].map(color => (
                      <button
                        key={color}
                        onClick={() => setEditingItemColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          editingItemColor === color ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'
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
                      value={editingItemColor}
                      onChange={(e) => setEditingItemColor(e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <p className="text-sm text-gray-600">Preview:</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: editingItemColor }}
                    />
                    <span className="text-sm font-mono text-gray-700">{editingItemColor}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
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
