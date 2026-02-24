import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Wrench, FileText, Headphones, BarChart3, Settings, LogOut, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation()
  const { logout, currentUser } = useAuth()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/repairs', label: 'Repair Management', icon: Wrench },
    { path: '/requests', label: 'Device Requests', icon: FileText },
    { path: '/support', label: 'Support Ticket', icon: Headphones },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-56 bg-white border-r border-gray-200 transform transition-transform duration-300 z-40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img src="/images/mini-logo.png" alt="Yeti Logo" className="h-9" />
            <h1 className="text-lg font-bold text-gray-900">RepairMS</h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? 'bg-green-600 text-white shadow-card'
                    : 'text-gray-700 hover:bg-green-100'
                }`}
              >
                <Icon size={16} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-3 right-3 space-y-2">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs font-semibold text-primary mb-1">LOGGED IN AS</p>
            <p className="text-xs font-medium text-gray-900">{currentUser || 'User'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
