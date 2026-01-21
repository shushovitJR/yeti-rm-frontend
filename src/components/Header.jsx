import React, { useState } from 'react'
import { Menu, LogOut, User, Lock, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Header({ onMenuClick }) {
  const { currentUser } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 shadow-card sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <Menu size={18} className="text-primary" />
          </button>
        </div>

        <div className="relative">
          <button
            // onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
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
              <p className="text-xs font-medium text-gray-900">{currentUser || 'User'}</p>
            </div>
            {/* <ChevronDown size={18} className="text-gray-500" /> */}
          </button>

        </div>
      </div>
    </header>
  )
}

export default Header
