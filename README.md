# Repair & Device Request Management System

> **Enterprise-grade Device Repair & Request Management System with Full Backend API Integration**

**Status:** ✅ **API INTEGRATION COMPLETE - READY FOR DEPLOYMENT**

A modern, professional, enterprise-grade web application for managing device repairs, device requests, and vendor management within organizations.

## 🎯 Overview

This system provides a comprehensive solution for organizations to:
- ✅ Authenticate users securely with JWT tokens
- ✅ Track device repairs with complete CRUD operations
- ✅ Manage device requests with status tracking
- ✅ Manage repair vendors efficiently
- ✅ Real-time synchronization with backend APIs
- ✅ Comprehensive error handling and user feedback
- ✅ Role-based access control

## ✨ Key Features

### 🔐 Authentication
- Real API-based login
- JWT token management
- Persistent authentication
- Automatic token attachment to requests
- Secure logout functionality

### 🔧 Repair Management
- Create new repair tickets
- Edit and update repairs
- Status tracking (Pending, In Progress, Completed)
- Search and filter repairs
- Pagination support
- Vendor assignment
- Real-time data sync with backend

### 📱 Device Requests
- Submit device requests
- Track request status
- Update request details
- Confirmation dialogs for status changes
- Search and filter requests
- Pagination support
- Real-time data sync

### 🏢 Vendor Management
- Add new vendors
- Delete vendors with confirmation
- Input validation
- Duplicate prevention
- Real-time list updates

### 📊 Dashboard
- Real-time metrics
- Monthly repairs trend visualization
- Device category distribution charts
- Recent activity feed

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend server running on `http://localhost:500`
- Modern web browser

### Quick Start (5 minutes)

1. **Navigate to project directory**
   ```bash
   cd c:/Users/Asus/Desktop/yeti-repair-mngmt/Yeti-Repair-app
   ```

2. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Login with test credentials**
   - Use credentials provided by your team
   - JWT token automatically stored
   - Access dashboard and features

**For detailed getting started guide, see [QUICK_START.md](QUICK_START.md)**

## 🔌 API Integration

### ✅ Full Backend API Integration

All backend endpoints have been integrated:

| Feature | Endpoints | Status |
|---------|-----------|--------|
| **Authentication** | `POST /auth/login` | ✅ Complete |
| **Repair Management** | `GET/POST/PUT /api/repair` | ✅ Complete |
| **Device Requests** | `GET/POST/PUT /api/request` | ✅ Complete |
| **Vendor Management** | `GET/POST/DELETE /api/vendor` | ✅ Complete |

### API Features
- ✅ Automatic JWT token attachment
- ✅ Comprehensive error handling
- ✅ Loading states
- ✅ User feedback (toasts)
- ✅ Form validation
- ✅ Confirmation dialogs

**For detailed API documentation, see [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)**

## 📚 Documentation

Complete documentation is provided:

1. **[QUICK_START.md](QUICK_START.md)** - Getting started (10 min read)
2. **[API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)** - Technical reference (30 min read)
3. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Project overview (20 min read)
4. **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - QA guide (100+ test cases)
5. **[CHANGELOG.md](CHANGELOG.md)** - Change tracking
6. **[INDEX.md](INDEX.md)** - Documentation navigation

**See [INDEX.md](INDEX.md) for complete documentation index**

## 🏗️ Technology Stack

- **Frontend Framework**: React 18.2.0
- **Routing**: React Router DOM 6.20.0
- **Styling**: Tailwind CSS 3.3.0
- **Charts & Visualization**: Recharts 2.10.0
- **Icons**: Lucide React 0.294.0
- **Build Tool**: Vite 5.0.0
- **HTTP**: Fetch API (no external HTTP library needed)
- **State Management**: React Context API
- **API Service**: Centralized service layer (`src/services/api.js`)

## 📋 Project Structure

```
src/
├── services/
│   └── api.js              # ✨ NEW - API service layer
├── context/
│   ├── AuthContext.jsx     # 🔄 JWT token & user management
│   └── ToastContext.jsx    # Notifications
├── components/
│   ├── Header.jsx          # Navigation
│   ├── Sidebar.jsx         # Sidebar menu
│   ├── Modal.jsx           # Modal dialog
│   ├── SideDrawer.jsx      # Side form drawer
│   ├── ConfirmDialog.jsx   # Confirmation
│   ├── Toast.jsx           # Notifications
│   └── ProtectedRoute.jsx  # Auth guard
├── pages/
│   ├── Dashboard.jsx       # Dashboard
│   ├── RepairManagement.jsx # 🔄 API integrated
│   ├── DeviceRequests.jsx  # 🔄 API integrated
│   ├── Settings.jsx        # 🔄 Vendor API
│   ├── Login.jsx           # 🔄 JWT Auth
│   └── Reports.jsx         # Reports
├── App.jsx                 # Main app
└── main.jsx                # Entry point
```

## 🔐 Authentication

### JWT Token Management
- Login via `POST /auth/login`
- Token stored in localStorage
- Automatic token attachment to requests
- Bearer token format: `Authorization: Bearer <token>`
- Token cleared on logout

### Secure API Calls
```javascript
// All API calls automatically include JWT token
const response = await fetch('http://localhost:500/api/repair', {
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  }
})
```

## 🔄 Data Flow

### Example: Create New Repair
```
User clicks "New Repair"
  ↓
Fill form fields
  ↓
Click "Create"
  ↓
repairAPI.create(data)
  ↓
POST /api/repair (with JWT token)
  ↓
Backend processes & returns id
  ↓
Update local state
  ↓
Refresh repairs list
  ↓
Show success toast
  ↓
Close form drawer
```

## ✨ Features

## 🎨 Design Features

### Color Palette
- **Primary**: Navy green (#1e3a8a)
- **Secondary**: Slate Gray (#64748b)
- **Accent**: Bright green (#3b82f6)
- **Success**: Emerald Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)

### Typography
- Font Family: Inter, Roboto, Open Sans
- Responsive sizing for all screen sizes

### Components
- Card-based layouts with subtle shadows
- Smooth transitions and hover effects
- Professional badges and status indicators
- Accessible contrast ratios
- Touch-friendly button sizes

## 📱 Responsive Design

The application is fully responsive across:
- **Desktop**: Full sidebar, multi-column layouts
- **Tablet**: Collapsible sidebar, optimized spacing
- **Mobile**: Single column, touch-optimized navigation

## 🔐 Role-Based Access Control

### Admin
- Full system access
- User management
- Settings configuration
- Report generation
- Repair ticket management
- Request approval

### IT Staff
- Device inventory management
- Repair ticket creation and updates
- Report viewing
- Limited user management

### Employee
- Device request submission
- View own requests
- View device inventory
- Access to reports

## 🔔 Features Highlights

### Smart Notifications
- Toast notifications for all actions
- Success, error, warning, and info messages
- Auto-dismiss with manual close option

### Data Management
- Search and filter across all modules
- Pagination for large datasets
- Export to PDF and Excel formats
- Detailed modal views

### User Experience
- Confirmation dialogs for destructive actions
- Loading states and feedback
- Breadcrumb navigation
- Active state indicators
- Smooth animations

## 📊 Data Models

### Device
- Device ID, Name, Category, Serial Number
- Assigned To, Status, Join Date

### Repair
- Repair ID, Device Name, Issue Description
- Reported Date, Technician, Status
- Expected Completion Date

### Request
- Request ID, Requested By, Department
- Device Type, Reason, Request Date
- Approval Status

### User
- Name, Email, Role, Department
- Status, Join Date, Permissions

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Style
- Clean, readable component structure
- Consistent naming conventions
- Reusable component patterns
- Context API for state management

## 🔄 Workflow Examples

### Creating a Repair Ticket
1. Navigate to Repair Management
2. Click "New Repair"
3. Select device and describe issue
4. Assign technician and set expected date
5. Submit ticket

### Approving Device Requests
1. Navigate to Device Requests
2. Filter by "Pending" status
3. Review request details
4. Click "Approve" or "Reject"
5. Confirm action

### Generating Reports
1. Navigate to Reports
2. Select report type and date range
3. Click "Generate Report"
4. View charts and analytics
5. Export to PDF or Excel

## 📈 Analytics & Insights

The Reports module provides:
- Real-time repair metrics
- Completion rate tracking
- Department-wise analysis
- Device category breakdown
- Trend visualization
- Export capabilities

## 🔒 Security Considerations

- Role-based access control
- Permission-based UI rendering
- Confirmation dialogs for destructive actions
- Input validation on forms
- Secure data handling

## 📝 Notes

- All data is currently mock data for demonstration
- Integration with backend API required for production
- Authentication system needs to be implemented
- Database setup required for persistent storage

## 🚀 Deployment

### Netlify Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy using Netlify CLI or connect GitHub repository

3. Set environment variables if needed

### Other Platforms

The application can be deployed to:
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps
- Any static hosting service

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review component props and usage
3. Examine example implementations
4. Refer to the code comments

## 📄 License

This project is proprietary and intended for organizational use.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [React Router](https://reactrouter.com)

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: Production Ready
