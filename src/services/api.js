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
      color: item.Color,
      cost: item.Cost,
      department: item.DepartmentName,
    }))
  },
  create: (data) => {
    // Transform frontend data to backend format
    const transformedData = {
      Category: data.deviceCategory,
      DeviceName: data.deviceName,
      IssueDescription: data.issue,
      IssueDate: data.issueDate || null,
      ReturnDate: data.returnedDate || null,
      VendorName: data.vendor,
      Status: data.status || 'Pending',
      Cost: data.cost || null,
      DepartmentName: data.department,
    }
    return apiRequest('/api/repair', {
      method: 'POST',
      body: transformedData,
    })
  },
  update: (id, data) => {
    // Ensure ID is a number
    const repairId = Number(id)
    
    if (isNaN(repairId) || repairId <= 0) {
      const error = new Error('Invalid repair ID: ' + id)
      console.error(error)
      throw error
    }
    
    // Transform frontend data to backend format
    const transformedData = {
      IssueDescription: data.issue,
      // IssueDate: data.issueDate || null,
      // ReturnDate: data.returnedDate && data.returnedDate !== '-' ? data.returnedDate : null,
      VendorName: data.vendor,
      Status: data.status || 'Pending',
      Cost: data.cost || null,
      DepartmentName: data.department,
    }
    if (data.returnedDate) {
      transformedData.ReturnDate = data.returnedDate
    }
    if (data.issueDate) {
      transformedData.IssueDate = data.issueDate
    }

    return apiRequest(`/api/repair/${repairId}`, {
      method: 'PUT',
      body: transformedData,
    })
  },
  delete: (id) => {
    const numericId = Number(id)
    
    return apiRequest(`/api/repair/${numericId}`, {
      method: 'DELETE',
    })
  },
}

// Device Requests API
export const requestAPI = {
  getAll: async () => {
    const response = await apiRequest('/api/request')
    // Backend may return an array or an object like { requests: [...] } or { data: [...] }
    const list = Array.isArray(response) ? response : (response.requests || response.data || [])

    return list.map(item => ({
      id: Number(item.RequestId.replace(/\D/g, '')),
      displayId: item.RequestId,
      requestedBy: item.Name,
      department: item.Department,
      deviceName: item.DeviceName,
      deviceType: item.Category,
      reason: item.Reason,
      requestDate: item.RequestDate,
      recievedate: item.RecieveDate,
      status: item.Status,
      color: item.Color,
      cost: item.Cost,
    }))
  },
  create: (data) => {
    // Transform frontend data to backend format
    const getTodayDate = () => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    }
    const transformedData = {
      RequesterName: data.name,
      DepartmentName: data.department,
      Category: data.deviceType,
      DeviceName: data.deviceName,
      Reason: data.reason,
      RequestDate: data.requestDate || getTodayDate(),
      Status: data.status || 'Pending',
      Cost: data.cost,
    }
    return apiRequest('/api/request', {
      method: 'POST',
      body: transformedData,
    })
  },
  update: (id, data) => {
    const numericId = Number(id)  
    // Transform frontend data to backend format
    const transformedData = {
      Reason: data.reason,
      Status: data.status || 'Pending',
      RequesterName: data.name,
      DepartmentName: data.department,
      Cost: data.cost,
    }
    // Only include date fields if provided
    if (data.requestDate) {
      transformedData.RequestDate = data.requestDate
    }
    if (data.recieveDate) {
      transformedData.RecieveDate = data.recieveDate
    }
    
    return apiRequest(`/api/request/${numericId}`, {
      method: 'PUT',
      body: transformedData,
    })
  },
  delete: (id) => {
    const numericId = Number(id);
    
    return apiRequest(`/api/request/${numericId}`, {
      method: "DELETE",
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
    // console.log("Updating status of id:",numericId);
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
  update: (id, data) => {
    const numericId = Number(id);
    const transformedData = {
      DeviceCatName: data.name,
      DeviceDescription: data.description,
    }
    // console.log("Updating status of:",numericId)
    // console.log(transformedData)
    return apiRequest(`/api/device/${numericId}`,{
      method: 'PUT',
      body: transformedData,
    })
  },
  delete: (id) => {
      const numericId = Number(id);
      return apiRequest(`/api/device/${numericId}`,{
        method: 'DELETE',
      })
  },
}

//Repair Status Management API
export const repairStatusAPI = {
  getAll: async () => {
    const response = await apiRequest('/api/repairStatus')
    return response.map((item)=>({
      id: item.RepairStatusId,
      name: item.RepairStatusName,
      description: item.StatusDescription,
      color: item.Color,
    }))
  },
  create: (data) => {
      const transformedData = {
        statusName: data.name,
        statusColor: data.color,
        statusDescription: data.description,
      }
      return apiRequest('/api/repairStatus',{
        method: 'POST',
        body: transformedData,
      })
  },
  update: (id, data) => {
    const numericId = Number(id);
    const transformedData = {
      statusName: data.name,
      statusDescription: data.description,
      statusColor: data.color,
    }
    // console.log("Editing id:",numericId);
    // console.log(transformedData);
    return apiRequest(`/api/repairStatus/${numericId}`, {
      method: 'PUT',
      body: transformedData,
    })
  },
  delete: (id) => {
    const numericId = Number(id);

    return apiRequest(`/api/repairStatus/${numericId}`,{
      method: 'DELETE',
    })
  }
}

//Request Status Management API
export const requestStatusAPI = {
  getAll: async () => {
    const response = await apiRequest('/api/requestStatus')
    return response.map((item)=>({
      id: item.RequestStatusId,
      name: item.RequestStatusName,
      description: item.StatusDescription,
      color: item.Color,
    }))
  },
  create: (data) => {
    const transformedData = {
      statusName: data.name,
      statusDescription: data.description,
      statusColor: data.color,
    }
    // console.log(transformedData);
    return apiRequest('/api/requestStatus',{
      method: 'POST',
      body: transformedData,
    })
  },
  update: (id, data) => {
    const numericId = Number(id);
    const transformedData = {
      statusName: data.name,
      statusDescription: data.description,
      statusColor: data.color,
    }
    console.log("Editing id:", numericId);
    console.log(transformedData);

    return apiRequest(`/api/requestStatus/${numericId}`, {
      method: 'PUT',
      body: transformedData,
    })
  },
}

export const dashboardAPI = {
  getCategoryChart: async() => {
    const response = await apiRequest('/api/report/devicecategorychart');
    return response.map((item)=>({
      category: item.category,
      count: item.count,
    }))
  },
  getRequestMetric: async () => {
    const response = await apiRequest('/api/report/requestmetric')
    return response[0] || { recieved:0, pending:0 };
  },
  getRepairMetric: async () => {
    const response = await apiRequest('/api/report/repairmetric')
    return response || {underrepair:0, cost:0};
  },
}

export const reportAPI = {
  getMonthlyRepairs: async() => {
    const response = await apiRequest('/api/report/monthlyrepairs')
    return response.map((item)=>({
      month: item.month,
      completed: item.completed,
      repairs: item.repairs,
    }))
  },
  getMonthlyRequests: async() => {
    const response = await apiRequest('/api/report/monthlyrequests')
    return response.map((item)=>({
      month: item.month,
      completed: item.completed,
      requests: item.requests,
    }))
  },
  getDetailedRepairReport: async() => {
    const response = await apiRequest('/api/report/reporttablerepair')
    return Array.isArray(response) ? response : (response.data || [])
  },
  getDetailedRequestReport: async() => {
    const response = await apiRequest('/api/report/reporttablerequest')
    // Fix the typo in backend response (catgory -> category)
    return Array.isArray(response) 
      ? response.map(item => ({
          ...item,
          category: item.catgory || item.category
        }))
      : []
  },
  getRepairSummary: async() => {
    const response = await apiRequest('/api/report/repairsummary')
    // Transform backend response to frontend format
    return {
      total: response.totalrepairs || 0,
      repairtime: response.repairtime ? parseInt(response.repairtime) : 0,
      percentchange: response.percentchange || "0"
    }
  },
  getRequestSummary: async() => {
    const response = await apiRequest('/api/report/requestsummary')
    // Transform backend response to frontend format
    return {
      total: response.totalrequests || 0,
      percentchange: response.percentchange || "0"
    }
  },
  getDepartmentRequests: async() => {
    const response = await apiRequest('/api/report/departmentrequest')
    // Transform to match expected format with 'total' instead of 'count'
    return Array.isArray(response) 
      ? response.map(item => ({
          department: item.department,
          total: item.count
        }))
      : []
  },
  getDeviceCategoryCount: async() => {
    const response = await apiRequest('/api/report/reporttablerepair')
    return Array.isArray(response) ? response : (response.data || [])
  },
  getDeviceCategoryCountRequest: async() => {
    const response = await apiRequest('/api/report/reporttablerequest')
    return Array.isArray(response) ? response : (response.data || [])
  }
}

// Department Management API
export const departmentAPI = {
  getAll: async () => {
    const response = await apiRequest('/api/department')
    // Transform backend response to frontend format
    return response.map((item) => ({
      id: item.DepartmentId,
      name: item.DepartmentName,
    }))
  },
  create: (data) => {
    // Transform frontend data to backend format
    const transformedData = {
      DepartmentName: data.name,
    }
    return apiRequest('/api/department', {
      method: 'POST',
      body: transformedData,
    })
  },
  update: (id, data) => {
    const departmentId = Number(id);
    const transformedData = {
      DepartmentName: data.name,
    }
    return apiRequest(`/api/department/${departmentId}`, {
      method: 'PUT',
      body: transformedData,
    })
  },
  delete: (id) => {
    const departmentId = Number(id);
    return apiRequest(`/api/department/${departmentId}`, {
      method: 'DELETE',
    })
  },
}

export default {
  authAPI,
  repairAPI,
  requestAPI,
  vendorAPI,
  deviceAPI,
  repairStatusAPI,
  requestStatusAPI,
  dashboardAPI,
  reportAPI,
  departmentAPI,
}
