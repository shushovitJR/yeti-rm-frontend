import React, { useState } from 'react'
import { Search, Filter, Plus, Eye, Edit, Trash2, ToggleRight, ToggleLeft } from 'lucide-react'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../context/ToastContext'

function UserManagement() {
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false })

  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@company.com', role: 'admin', status: 'active', department: 'IT', joinDate: '2023-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'staff', status: 'active', department: 'HR', joinDate: '2023-03-20' },
    { id: 3, name: 'Mike Davis', email: 'mike.davis@company.com', role: 'staff', status: 'active', department: 'IT', joinDate: '2023-05-10' },
    { id: 4, name: 'Emily Brown', email: 'emily.brown@company.com', role: 'employee', status: 'active', department: 'Marketing', joinDate: '2023-07-01' },
    { id: 5, name: 'David Wilson', email: 'david.wilson@company.com', role: 'employee', status: 'inactive', department: 'Finance', joinDate: '2023-02-14' },
    { id: 6, name: 'Lisa Chen', email: 'lisa.chen@company.com', role: 'staff', status: 'active', department: 'IT', joinDate: '2023-04-25' },
    { id: 7, name: 'Tom Anderson', email: 'tom.anderson@company.com', role: 'staff', status: 'active', department: 'Operations', joinDate: '2023-06-18' },
    { id: 8, name: 'Jessica Lee', email: 'jessica.lee@company.com', role: 'employee', status: 'active', department: 'Support', joinDate: '2023-08-05' },
  ])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )


  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge badge-success',
      inactive: 'badge badge-danger',
    }
    return badges[status] || 'badge badge-info'
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }


  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    setConfirmDialog({
      isOpen: true,
      title: `${newStatus === 'active' ? 'Activate' : 'Deactivate'} User`,
      message: `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} ${user.name}?`,
      confirmText: newStatus === 'active' ? 'Activate' : 'Deactivate',
      onConfirm: () => {
        addToast(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success')
        setConfirmDialog({ isOpen: false })
      },
    })
  }

  const handleDeleteUser = (user) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: () => {
        addToast('User deleted successfully', 'success')
        setConfirmDialog({ isOpen: false })
      },
      isDangerous: true,
    })
  }

  const handleAddUser = () => {
    setIsAddModalOpen(false)
    addToast('User created successfully', 'success')
  }


  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users & Roles</h1>
          <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
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

      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.department}</td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(user.status)}>{user.status}</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="btn-sm bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className="btn-sm bg-orange-100 text-orange-600 hover:bg-orange-200"
                    >
                      {user.status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="btn-sm bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
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
        title="Add New User"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" placeholder="First name" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" placeholder="Last name" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" placeholder="user@company.com" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select className="input-field">
              <option>IT</option>
              <option>HR</option>
              <option>Sales</option>
              <option>Marketing</option>
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="flex-1 btn-primary"
            >
              Create User
            </button>
          </div>
        </div>
      </Modal>

      {selectedUser && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="User Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-semibold text-gray-900">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-lg font-semibold text-gray-900">{selectedUser.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={getStatusBadge(selectedUser.status)}>{selectedUser.status}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Join Date</p>
                <p className="text-lg font-semibold text-gray-900">{selectedUser.joinDate}</p>
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

export default UserManagement
