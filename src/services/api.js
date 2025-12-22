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
      id: item.RepairId,
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
      id: response.RepairId,
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
    return apiRequest(`/api/repair/${id}`, {
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
      deviceType: item.DeviceName,
      reason: item.Reason,
      requestDate: item.RequestDate,
      status: item.Status,
    }))
  },
  getById: async (id) => {
    const response = await apiRequest(`/api/request/${id}`)
    return {
      id: response.RequestId,
      requestedBy: response.RequestedBy,
      department: response.Department,
      deviceType: response.DeviceCategory,
      reason: response.Reason,
      requestDate: response.RequestDate,
      status: response.Status,
    }
  },
  create: (data) => {
    // Transform frontend data to backend format
    const transformedData = {
      DeviceCategory: data.deviceType,
      DeviceName: data.deviceType,
      Reason: data.reason,
      RequestStatus: data.status || 'Pending',
    }
    return apiRequest('/api/request', {
      method: 'POST',
      body: transformedData,
    })
  },
  update: (id, data) => {
    // Transform frontend data to backend format
    const transformedData = {
      DeviceCategory: data.deviceType,
      DeviceName: data.deviceType,
      Reason: data.reason,
      RequestStatus: data.status || 'Pending',
    }
    return apiRequest(`/api/request/${id}`, {
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
    // Note: Backend doesn't return VendorId, so we use VendorName as identifier
    return response.map((item, index) => ({
      id: index, // Use index as temporary ID since backend doesn't provide it
      name: item.VendorName,
      vendorName: item.VendorName, // Keep original name for deletion
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
  delete: (vendorName) =>
    // Use vendor name to find and delete by making a request
    apiRequest(`/api/vendor/${vendorName}`, {
      method: 'DELETE',
    }),
}

export default {
  authAPI,
  repairAPI,
  requestAPI,
  vendorAPI,
}
