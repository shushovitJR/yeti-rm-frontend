# Yeti Repair Management - API Integration Guide

## Overview
This document outlines the complete API integration implemented in the Yeti Repair Management frontend application. All changes are frontend-only as requested, with no modifications to backend code.

---

## 1. API Service Layer

**File:** [src/services/api.js](src/services/api.js)

### Features:
- **Centralized API calls** with consistent error handling
- **Automatic JWT token attachment** to protected routes from localStorage
- **Base URL:** http://localhost:500
- **Modular API endpoints** organized by feature

### API Groups:

#### Authentication API
```javascript
authAPI.login(username, password)
```

#### Repair Management API
```javascript
repairAPI.getAll()          // GET /api/repair
repairAPI.getById(id)       // GET /api/repair/:id
repairAPI.create(data)      // POST /api/repair
repairAPI.update(id, data)  // PUT /api/repair/:id
```

#### Device Requests API
```javascript
requestAPI.getAll()         // GET /api/request
requestAPI.getById(id)      // GET /api/request/:id
requestAPI.create(data)     // POST /api/request
requestAPI.update(id, data) // PUT /api/request/:id
```

#### Vendor Management API
```javascript
vendorAPI.getAll()          // GET /api/vendor
vendorAPI.create(data)      // POST /api/vendor
vendorAPI.delete(id)        // DELETE /api/vendor/:id
```

---

## 2. Authentication Context Update

**File:** [src/context/AuthContext.jsx](src/context/AuthContext.jsx)

### Changes:
- **JWT Token Storage:** Tokens stored in localStorage under key `token`
- **User Role Storage:** User roles stored in localStorage under key `userRole`
- **Async Login:** Login function now makes actual API calls instead of mock validation
- **Token Persistence:** Checks for existing tokens on component mount

### Key Features:
```javascript
{
  isAuthenticated: boolean,
  currentUser: string,
  userRole: string,
  isLoading: boolean,
  login: (username, password) => Promise<{success, error}>
  logout: () => void
}
```

---

## 3. Login Page Integration

**File:** [src/pages/Login.jsx](src/pages/Login.jsx)

### Implementation:
- **Real API Integration:** Connects to `/auth/login` endpoint
- **Error Handling:** Displays API error messages to users
- **Loading State:** Shows loading indicator during authentication
- **Token Management:** Automatically stores JWT token on successful login
- **Redirection:** Redirects to dashboard on successful login

### Flow:
1. User enters username and password
2. Form validates input
3. API request made to backend
4. Token stored in localStorage on success
5. User redirected to dashboard
6. Error message displayed on failure

---

## 4. Repair Management Page

**File:** [src/pages/RepairManagement.jsx](src/pages/RepairManagement.jsx)

### Features Implemented:

#### Data Fetching
- Fetches all repair requests on component mount using `repairAPI.getAll()`
- Loading state displayed while fetching
- Error handling with user-friendly messages

#### Display
- Table showing all repair requests with columns:
  - Repair ID
  - Device Name
  - Issue Description
  - Issue Date
  - Returned Date
  - Vendor Assignment
  - Status (badge with color coding)
- Search functionality by device name or repair ID
- Status filtering (Pending, In Progress, Completed)
- Pagination (8 items per page)

#### Create New Repair
- Side drawer form with fields:
  - Device Category
  - Device Name
  - Issue Date
  - Returned Date
  - Issue Description
  - Vendor Assignment (required)
- Form validation
- API call to create repair
- List refreshes after successful creation

#### Edit Repair
- Click Edit button to open edit drawer
- Pre-populated form with current repair data
- Update all fields
- API call updates repair
- Status change capability
- List refreshes after update

#### View Details
- Modal showing complete repair details
- Read-only display
- Status badge

#### Error Handling
- API errors displayed at top of page
- Toast notifications for success/failure
- Loading indicators during operations

---

## 5. Device Requests Page

**File:** [src/pages/DeviceRequests.jsx](src/pages/DeviceRequests.jsx)

### Features Implemented:

#### Data Fetching
- Fetches all device requests on component mount using `requestAPI.getAll()`
- Real-time loading and error states

#### Display
- Table with columns:
  - Request ID
  - Requested By
  - Department
  - Device Type
  - Request Date
  - Status (color-coded badges)
- Search by requester name or request ID
- Status filtering (Pending, Received, On Hold, Canceled)
- Pagination

#### Create Device Request
- Side drawer with fields:
  - Requested By (required)
  - Department
  - Device Type
  - Request Date
  - Reason for Request
- Validation for required fields
- API creates new request
- List auto-refreshes

#### Update Request
- Edit drawer pre-fills current data
- Change all request details
- Update status via dropdown
- Confirm status changes with dialog
- API update with optimistic UI refresh

#### View Request Details
- Modal with complete request information
- Read-only display format
- Status badge

#### Status Management
- Confirmation dialog before status changes
- Available statuses: Pending, Received, On Hold, Canceled
- Status updates persist in database

---

## 6. Vendor Management (Settings Page)

**File:** [src/pages/Settings.jsx](src/pages/Settings.jsx)

### Features Implemented:

#### Vendor Tab
- Dedicated vendor management section
- Real-time vendor list from backend

#### Add Vendor
- Input field for vendor name
- Validation:
  - No empty vendor names
  - No duplicate vendors
  - Error messages displayed inline
- API call creates vendor in database
- List auto-updates

#### Delete Vendor
- Confirmation dialog prevents accidental deletion
- API call deletes vendor
- List refreshes after deletion
- Success notification

#### Vendor List Display
- Loading state during fetch
- Error messages if fetch fails
- All vendors from database displayed
- Delete button for each vendor

#### Error Handling
- API error messages displayed
- Toast notifications for operations
- Loading indicators during async operations

---

## 7. JWT Token Handling

### Automatic Token Attachment
Every API request automatically includes the JWT token:

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Protected Routes
The following routes require JWT authentication:
- `PUT /api/repair/:id` (Update repair)
- `PUT /api/request/:id` (Update request)
- `POST /api/vendor` (Add vendor)
- `DELETE /api/vendor/:id` (Delete vendor)

### Token Lifecycle
1. User logs in → token stored in localStorage
2. Each API request → token automatically attached
3. User logs out → token removed from localStorage
4. Page refresh → token persists if available

---

## 8. Error Handling & User Feedback

### Error Display
- **Top-level alerts:** API errors shown at page top
- **Toast notifications:** Success/error messages
- **Inline validation:** Form field errors
- **Modal dialogs:** Confirmation for destructive actions

### Loading States
- Loading indicators during data fetch
- Disabled buttons during API calls
- "Loading..." messages in tables
- Skeleton screens (can be enhanced)

### User Feedback
- Success toast notifications on CRUD operations
- Error messages with details
- Confirmation dialogs for deletions
- Form validation messages

---

## 9. Data Flow Examples

### Login Flow
```
User Input → Validation → API Call (authAPI.login) 
→ Token Storage → Redirect to Dashboard
```

### Create Repair Flow
```
Click "New Repair" → Side Drawer Opens 
→ Fill Form → Validation → API Call (repairAPI.create) 
→ List Refresh → Success Toast
```

### Update Vendor Flow
```
Click Delete Vendor → Confirmation Dialog → API Call (vendorAPI.delete) 
→ List Refresh → Success Toast
```

---

## 10. Environment Configuration

### Base URL
- **Location:** [src/services/api.js](src/services/api.js) (line 2)
- **Current:** `http://localhost:500`
- **To Change:** Modify `API_BASE_URL` variable

### Token Storage Keys
- **Token:** `localStorage.getItem('token')`
- **User:** `localStorage.getItem('user')`
- **Role:** `localStorage.getItem('userRole')`

---

## 11. Testing Checklist

### Login Page
- ✅ Login with valid credentials
- ✅ Login with invalid credentials
- ✅ Error messages display
- ✅ Token persists after refresh
- ✅ Redirect to dashboard on success

### Repair Management
- ✅ Load repairs on page load
- ✅ Search by device name
- ✅ Filter by status
- ✅ Create new repair
- ✅ Edit existing repair
- ✅ Update repair status
- ✅ View repair details
- ✅ Handle API errors

### Device Requests
- ✅ Load requests on page load
- ✅ Create new request
- ✅ Edit request details
- ✅ Update request status
- ✅ View request details
- ✅ Confirm status changes
- ✅ Error handling

### Vendor Management
- ✅ Load vendors on page load
- ✅ Add new vendor
- ✅ Validation: empty name
- ✅ Validation: duplicate name
- ✅ Delete vendor
- ✅ Confirmation before delete
- ✅ Error messages

---

## 12. Future Enhancements

### Recommended Improvements
1. **Pagination improvements:** Server-side pagination support
2. **Advanced filtering:** Date range, multiple status filters
3. **Batch operations:** Bulk edit/delete functionality
4. **Export functionality:** Download data as CSV/PDF
5. **Real-time updates:** WebSocket for live data sync
6. **File uploads:** Attachment support for repairs/requests
7. **Analytics dashboard:** Statistics and reports
8. **Audit logging:** Track all changes by user
9. **Role-based access:** Fine-grained permissions
10. **API caching:** Reduce server load with caching

---

## 13. Important Notes

### Security
- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- All API calls require HTTPS in production
- CORS should be properly configured on backend
- Token expiration handling recommended

### Performance
- API calls are optimized with proper error handling
- Loading states prevent duplicate requests
- List refreshes only after successful operations
- Consider implementing request debouncing for search

### Compatibility
- Modern browsers with ES6 support
- React 18.2.0 or higher
- fetch API (no axios required)

---

## 14. Quick Reference

### Import API Services
```javascript
import { authAPI, repairAPI, requestAPI, vendorAPI } from '../services/api'
```

### Use Toast Notifications
```javascript
import { useToast } from '../context/ToastContext'

const { addToast } = useToast()
addToast('Success message', 'success')
addToast('Error message', 'error')
```

### Use Auth Context
```javascript
import { useAuth } from '../context/AuthContext'

const { isAuthenticated, currentUser, userRole, login, logout } = useAuth()
```

---

## 15. Support & Troubleshooting

### Common Issues

**Issue:** "Failed to fetch" errors
- **Solution:** Check if backend is running on http://localhost:500
- **Check:** Browser console for detailed error messages

**Issue:** Login not working
- **Solution:** Verify credentials with backend team
- **Check:** Network tab in DevTools to see API response

**Issue:** 401 Unauthorized errors
- **Solution:** Token may have expired
- **Action:** Clear localStorage and login again

**Issue:** CORS errors
- **Solution:** Backend CORS configuration issue
- **Action:** Contact backend team for proper CORS setup

---

## Files Modified Summary

| File | Changes |
|------|---------|
| `src/services/api.js` | ✨ NEW - API service layer |
| `src/context/AuthContext.jsx` | 🔄 Updated - JWT token handling |
| `src/pages/Login.jsx` | 🔄 Updated - API integration |
| `src/pages/RepairManagement.jsx` | 🔄 Updated - Complete API integration |
| `src/pages/DeviceRequests.jsx` | 🔄 Updated - Complete API integration |
| `src/pages/Settings.jsx` | 🔄 Updated - Vendor management API |

---

**Integration Date:** December 22, 2025
**Status:** ✅ Complete
**Frontend Only:** ✅ Yes - No backend modifications
