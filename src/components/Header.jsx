import React, { useState } from 'react'
import { Menu, LogOut, User, Lock, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Header({ onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const { currentUser } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 shadow-card sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <Menu size={24} className="text-primary" />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              {currentUser ? (
      // Split name into words, take first letter of first and last name
                (() => {
                  const names = currentUser.trim().split(' ');
                  const firstInitial = names[0]?.[0]?.toUpperCase() || '';
                  const lastInitial = names.length > 1 ? names[names.length - 1]?.[0]?.toUpperCase() : '';
                  return firstInitial + lastInitial || '??'; // fallback if no name
                })()
              ) : (
                '??' // fallback when no user
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">{currentUser || 'User'}</p>
            </div>
            <ChevronDown size={18} className="text-gray-500" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-hover border border-gray-200 animate-slide-in">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-200">
                <User size={18} className="text-gray-600" />
                <span className="text-sm text-gray-700">Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-200">
                <Lock size={18} className="text-gray-600" />
                <span className="text-sm text-gray-700">Change Password</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left text-red-600">
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
