# Quick Start Guide - API Integration

## Getting Started

### Prerequisites
1. Backend server running on `http://localhost:500`
2. Node.js and npm installed
3. All dependencies installed in frontend

### Installation

```bash
# If not already done, install dependencies
npm install

# Start the development server
npm run dev
```

### Login to Access the Application

1. Open browser to `http://localhost:5173` (or whatever port Vite runs on)
2. Enter credentials (provided by backend team)
3. On successful login:
   - JWT token automatically stored in localStorage
   - Redirected to Dashboard
   - Can now access all features

---

## Features Overview

### 🔧 Repair Management (`/repairs`)
- **View all repair requests** with status tracking
- **Create new repair** - Submit device for repair
- **Edit repair details** - Update status, vendor, dates
- **Search & filter** - Find repairs by device name or ID
- **Pagination** - 8 repairs per page

**Key API Calls:**
```javascript
GET    /api/repair          // List all repairs
POST   /api/repair          // Create repair
PUT    /api/repair/:id      // Update repair (admin)
```

### 📱 Device Requests (`/requests`)
- **View all device requests** with status tracking
- **Create request** - Request new device
- **Update status** - Change request status (Pending → Received → etc)
- **Search & filter** - Find requests by requester or ID
- **Status confirmation** - Dialog confirms status changes

**Key API Calls:**
```javascript
GET    /api/request         // List all requests
POST   /api/request         // Create request
PUT    /api/request/:id     // Update request (admin)
```

### 🏢 Vendor Management (Settings - `/settings`)
- **View all vendors** in database
- **Add new vendor** - Register new repair vendor
- **Delete vendor** - Remove vendor with confirmation
- **Validation** - Prevents empty/duplicate vendors

**Key API Calls:**
```javascript
GET    /api/vendor          // List all vendors
POST   /api/vendor          // Add vendor (admin)
DELETE /api/vendor/:id      // Delete vendor (admin)
```

---

## Common Workflows

### Workflow 1: Create & Track Repair

1. **Navigate to Repairs** → Click "New Repair"
2. **Fill repair form:**
   - Device Category: Select device type
   - Device Name: e.g., "Dell Latitude 5520"
   - Issue Description: Describe the problem
   - Vendor: Assign to repair vendor
3. **Click "Create Ticket"** → See success toast
4. **New repair appears in table** with "pending" status
5. **Later: Edit repair** → Update status to "in-progress" or "completed"

### Workflow 2: Submit & Update Device Request

1. **Navigate to Device Requests** → Click "New Request"
2. **Fill request form:**
   - Requested By: Your name
   - Department: Your department
   - Device Type: Type needed
   - Reason: Why you need it
3. **Click "Submit Request"** → See success message
4. **Admin can edit** → Change status to "received" or "canceled"
5. **Confirmation dialog** appears before status change

### Workflow 3: Manage Vendors

1. **Navigate to Settings** → Click "Vendor Management" tab
2. **Add vendor:**
   - Enter vendor name (e.g., "Best Repair Co")
   - Click "Add"
   - See vendor in list
3. **Delete vendor:**
   - Click trash icon
   - Confirm deletion
   - Vendor removed from system

---

## API Response Format

### Success Response
```javascript
{
  "data": { /* actual data */ },
  "message": "Operation successful"
}
```

### Error Response
```javascript
{
  "message": "Error description",
  "status": 400
}
```

---

## Storage & Persistence

### LocalStorage Keys
```javascript
localStorage.getItem('token')      // JWT token
localStorage.getItem('user')       // Username
localStorage.getItem('userRole')   // User role (if returned)
```

### Token in API Requests
Every request automatically includes:
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Troubleshooting

### Issue: Can't login
**Solution:** 
- Check backend is running on port 500
- Verify credentials with backend team
- Check browser console for error details

### Issue: "Failed to fetch" error
**Solution:**
- Ensure backend URL is correct: `http://localhost:500`
- Check if backend server is running
- Check browser network tab in DevTools

### Issue: 401 Unauthorized when accessing data
**Solution:**
- Token may have expired
- Try logging out and logging back in
- Clear localStorage: `localStorage.clear()`

### Issue: Form validation not working
**Solution:**
- Check all required fields are filled
- Browser console shows validation errors
- Ensure field values match expected format

### Issue: Changes not showing in list
**Solution:**
- List should auto-refresh after CRUD operations
- Try refreshing page (F5)
- Check browser DevTools for API errors

---

## Development Notes

### API Service Layer
Located at: `src/services/api.js`
- Handles all HTTP requests
- Automatically includes JWT token
- Centralized error handling
- Base URL easily configurable

### Authentication Context
Located at: `src/context/AuthContext.jsx`
- Manages login/logout
- Stores JWT token
- Persists user info
- Provides auth state to components

### Component Structure
```
src/
├── pages/           # Page components
├── components/      # Reusable UI components
├── context/         # State management
├── services/        # API calls
└── index.css        # Global styles
```

---

## Performance Tips

1. **Search debouncing** - Add delay to search inputs to reduce API calls
2. **Pagination** - Currently 8 items per page, increase if needed
3. **Lazy loading** - Load images/attachments on demand
4. **Caching** - Consider caching vendor lists since they change infrequently
5. **Batch operations** - Select multiple items and perform bulk actions

---

## Security Reminders

⚠️ **Important for Production:**
1. Store JWT tokens in httpOnly cookies, not localStorage
2. Use HTTPS for all API calls
3. Implement token refresh mechanism
4. Add request/response interceptors
5. Validate all user input before sending to API
6. Implement rate limiting on frontend
7. Add CSRF protection
8. Set proper CORS headers on backend

---

## Testing the API

### Using Browser DevTools

1. **Open Console** (F12)
2. **Test API directly:**

```javascript
// Test login
fetch('http://localhost:500/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user', password: 'pass' })
}).then(r => r.json()).then(console.log)

// Test get repairs (after login)
const token = localStorage.getItem('token')
fetch('http://localhost:500/api/repair', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log)
```

### Using Postman/Insomnia

1. Create POST request to `http://localhost:500/auth/login`
2. Send credentials in body
3. Copy token from response
4. Use token in Authorization header for other requests

---

## Next Steps

1. **Start the dev server:** `npm run dev`
2. **Login with test credentials**
3. **Explore each page:**
   - Dashboard
   - Repair Management
   - Device Requests
   - Settings
4. **Test create/edit/delete** operations
5. **Check Network tab** to see actual API calls
6. **Monitor toast notifications** for feedback

---

## Support

For issues or questions:
1. Check browser DevTools Console for errors
2. Check Network tab to see API responses
3. Refer to [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) for detailed docs
4. Contact development team with error messages

---

**Happy coding! 🚀**
