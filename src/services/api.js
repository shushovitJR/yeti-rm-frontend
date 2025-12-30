// API service utility for handling all HTTP requests
const API_BASE_URL = 'http://localhost:5000'

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

// Make API request with proper error handling
const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
  } = options

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Add JWT token to protected routes
  const token = getToken()
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  const requestConfig = {
    method,
    headers: requestHeaders,
  }

  if (body) {
    requestConfig.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestConfig)
    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || `API Error: ${response.status}`)
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  } catch (error) {
    console.error(`API Request Error [${method} ${endpoint}]:`, error)
    throw error
  }
}

// Authentication API
export const authAPI = {
  login: (username, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),
}

// Repair Management API
export const repairAPI = {
  getAll: async () => {
    const response = await apiRequest('/api/repair')
    // Transform backend response to frontend format
    return response.map(item => ({
      id: Number(item.RepairId.replace(/\D/g, '')), // Extract numeric part from "REP001"
      displayId: item.RepairId, // Keep formatted ID for display
      deviceName: item.DeviceName,
      deviceCategory: item.Category,
      issue: item.Issue,
      issueDate: item.IssueDate,
      returnedDate: item.ReturnDate,
      status: item.Status,
      vendor: item.Vendor,
    }))
  },
  getById: async (id) => {
    const response = await apiRequest(`/api/repair/${id}`)
    return {
      id: Number(response.RepairId.replace(/\D/g, '')), // Extract numeric part from "REP001"
      displayId: response.RepairId,
      deviceName: response.DeviceName,
      deviceCategory: response.Category,
      issue: response.Issue,
      issueDate: response.IssueDate,
      returnedDate: response.ReturnDate,
      status: response.Status,
      vendor: response.Vendor,
    }
  },
  create: (data) => {
    // Transform frontend data to backend format
    const transformedData = {
      DeviceCategory: data.deviceCategory,
      DeviceName: data.deviceName,
      IssueDescription: data.issue,
      IssueDate: data.issueDate,
      ReturnDate: data.returnedDate || null,
      VendorName: data.vendor,
      RepairStatus: data.status || 'Pending',
    }
    return apiRequest('/api/repair', {
      method: 'POST',
      body: transformedData,
    })
  },
  update: (id, data) => {
    // Ensure ID is a number
    const repairId = Number(id)
    console.log('Updating repair with ID:', id, 'Converted to:', repairId, 'Type:', typeof repairId)
    
    if (isNaN(repairId) || repairId <= 0) {
      const error = new Error('Invalid repair ID: ' + id)
      console.error(error)
      throw error
    }
    
    // Transform frontend data to backend format
    const transformedData = {
      IssueDescription: data.issue,
      IssueDate: data.issueDate,
      ReturnDate: data.returnedDate && data.returnedDate !== '-' ? data.returnedDate : null,
      VendorName: data.vendor,
      RepairStatus: data.status || 'Pending',
    }
    console.log('Sending to backend:', `/api/repair/${repairId}`, transformedData)
    return apiRequest(`/api/repair/${repairId}`, {
      method: 'PUT',
      body: transformedData,
    })
  },
}

// Device Requests API
export const requestAPI = {
  getAll: async () => {
    const response = await apiRequest('/api/request')
    // Transform backend response to frontend format
    return response.map(item => ({
      id: item.RequestId,
      requestedBy: item.RequestedBy,
      department: item.Department,
      deviceName: item.DeviceName,
      deviceType: item.Category,
      reason: item.Reason,
      requestDate: item.RequestDate,
      status: item.Status,
    }))
  },
  getById: async (id) => {
    // Extract numeric ID from formatted ID (e.g., "REQ001" -> 1)
    const numericId = Number(id.replace(/\D/g, ''))
    const response = await apiRequest(`/api/request/${numericId}`)
    return {
      id: response.RequestId,
      requestedBy: response.RequestedBy,
      department: response.Department,
      deviceName: response.DeviceName,
      deviceType: response.category,
      reason: response.Reason,
      requestDate: response.RequestDate,
      status: response.Status,
    }
  },
  create: (data) => {
    // Transform frontend data to backend format
    const transformedData = {
      DeviceCategory: data.deviceType,
      DeviceName: data.deviceName,
      Reason: data.reason,
      RequestStatus: data.status || 'Pending',
    }
    return apiRequest('/api/request', {
      method: 'POST',
      body: transformedData,
    })
  },
  update: (id, data) => {
    // Extract numeric ID from formatted ID (e.g., "REQ001" -> 1)
    const numericId = Number(id.replace(/\D/g, ''))
    
    if (isNaN(numericId) || numericId <= 0) {
      const error = new Error('Invalid request ID: ' + id)
      console.error(error)
      throw error
    }
    
    // Transform frontend data to backend format
    const transformedData = {
      Reason: data.reason,
      RequestStatus: data.status || 'Pending',
    }
    console.log('Updating request with ID:', id, 'Converted to:', numericId)
    return apiRequest(`/api/request/${numericId}`, {
      method: 'PUT',
      body: transformedData,
    })
  },
}

// Vendor Management API
export const vendorAPI = {
  getAll: async () => {
    const response = await apiRequest('/api/vendor')
    // Transform backend response to frontend format
    return response.map((item) => ({
      id: item.VendorId,
      name: item.VendorName,
      vendorName: item.VendorName,
    }))
  },
  create: (data) => {
    // Transform frontend data to backend format
    const transformedData = {
      VendorName: data.name,
    }
    return apiRequest('/api/vendor', {
      method: 'POST',
      body: transformedData,
    })
  },
  update: (id, data) => {
    const numericId = Number(id);
    const transformedData = {
      vendorName: data.name,
    }
    console.log("Updating status of id:",numericId);
    return apiRequest(`/api/vendor/${numericId}`,{
      method: 'PUT',
      body: transformedData,
    })
  },
  delete: (id) => {
    // Use numeric vendor ID to delete
    const vendorId = Number(id)
    // if (isNaN(vendorId) || vendorId <= 0) {
    //   const error = new Error('Invalid vendor ID: ' + id)
    //   console.error(error)
    //   throw error
    // }
    return apiRequest(`/api/vendor/${vendorId}`, {
      method: 'DELETE',
    })
  },
}

//Device Category Management API
export const deviceAPI = {
  getAll: async () =>{
    const response = await apiRequest('/api/device')
    return response.map((item)=>({
      id: item.DeviceCategoryId,
      name: item.DeviceCategoryName,
      description: item.DeviceDescription,
    }))
  },
  create: (data) =>{
    const transformedData = {
      DeviceCatName: data.name,
      DeviceDescription: data.description
    }
    return apiRequest('/api/device',{
      method: 'POST',
      body: transformedData,
    })
  },
}

export default {
  authAPI,
  repairAPI,
  requestAPI,
  vendorAPI,
  deviceAPI,
}
