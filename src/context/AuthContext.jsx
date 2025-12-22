import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    const role = localStorage.getItem('userRole')
    
    if (token && user) {
      setCurrentUser(user)
      setUserRole(role)
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (username, password) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(username, password)
      
      // Store token and user info
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', response.user || username)
      if (response.role) {
        localStorage.setItem('userRole', response.role)
        setUserRole(response.role)
      }
      
      setCurrentUser(response.user || username)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Login failed'
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    setCurrentUser(null)
    setUserRole(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, userRole, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
