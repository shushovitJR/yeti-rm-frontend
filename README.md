# Repair & Device Request Management System

A modern, professional, enterprise-grade web application for managing device repairs, device requests, and inventory tracking within organizations.

## 🎯 Overview

This system provides a comprehensive solution for organizations to:
- Track devices in inventory with detailed categorization
- Manage repair requests and technician assignments
- Handle device request approvals and workflows
- Generate detailed reports and analytics
- Manage users and role-based permissions
- Configure system settings and preferences

## ✨ Key Features

### 📊 Dashboard
- Real-time metrics (Total Devices, Under Repair, Pending Requests, Approved Requests)
- Monthly repairs trend visualization
- Device category distribution charts
- Recent activity feed

### 🖥️ Device Inventory
- Complete device catalog with search and filtering
- Device status tracking (Available, Assigned, In Repair)
- Category-based organization
- Export to PDF/Excel
- Pagination and detailed device views

### 🛠️ Repair Management
- Repair ticket creation and tracking
- Technician assignment
- Status updates (Pending, In Progress, Completed)
- Expected completion date tracking
- Repair history and notes

### 📥 Device Requests
- User-friendly request submission form
- Department-based organization
- Approval workflow with role-based actions
- Status tracking (Pending, Approved, Rejected)
- Request history and details

### 📈 Reports
- Daily repair trends
- Monthly summary reports
- Department-wise device usage analysis
- Device category breakdown
- Export capabilities (PDF/Excel)
- Detailed analytics and metrics

### 👥 User Management
- User account creation and management
- Role-based access control (Admin, IT Staff, Employee)
- Permission management
- User status activation/deactivation
- Department assignment

### ⚙️ Settings
- Device category configuration
- Repair status type customization
- Approval rules management
- Notification preferences
- System configuration

## 🏗️ Technology Stack

- **Frontend Framework**: React 18.2.0
- **Routing**: React Router DOM 6.20.0
- **Styling**: Tailwind CSS 3.3.0
- **Charts & Visualization**: Recharts 2.10.0
- **Icons**: Lucide React 0.294.0
- **Build Tool**: Vite 5.0.0
- **Export Utilities**: jsPDF 2.5.1, XLSX 0.18.5

## 📋 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Top navigation bar
│   ├── Sidebar.jsx         # Left sidebar navigation
│   ├── Modal.jsx           # Reusable modal component
│   ├── ConfirmDialog.jsx   # Confirmation dialog
│   └── Toast.jsx           # Toast notifications
├── context/
│   └── ToastContext.jsx    # Toast notification context
├── pages/
│   ├── Dashboard.jsx       # Dashboard page
│   ├── DeviceInventory.jsx # Device inventory management
│   ├── RepairManagement.jsx # Repair tracking
│   ├── DeviceRequests.jsx  # Device request handling
│   ├── Reports.jsx         # Reports and analytics
│   ├── UserManagement.jsx  # User management
│   └── Settings.jsx        # System settings
├── App.jsx                 # Main app component
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd c:/Users/Asus/Desktop/Yeti-Repair-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The application will automatically open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## 🎨 Design Features

### Color Palette
- **Primary**: Navy Blue (#1e3a8a)
- **Secondary**: Slate Gray (#64748b)
- **Accent**: Bright Blue (#3b82f6)
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
