# React Admin Panel - Product Management

## Lab Task 4: React Admin Panel

This is a React-based admin panel for managing products with full CRUD operations.

### Features:
- ✅ Insert new products
- ✅ Update existing products
- ✅ Delete products
- ✅ View all products in a table
- ✅ Category management
- ✅ Real-time updates

### Installation:

1. Install dependencies:
```bash
cd admin-panel
npm install
```

2. Make sure the backend server is running on `http://localhost:3000`

3. Start the React app:
```bash
npm start
```

The app will open at `http://localhost:3000` (or another port if 3000 is busy)

### Usage:

1. **Add Product**: Click "Add New Product" button, fill the form, and submit
2. **Edit Product**: Click "Edit" button on any product row
3. **Delete Product**: Click "Delete" button on any product row (with confirmation)

### Features:
- Modal-based form for Add/Edit
- Form validation
- Real-time data fetching
- Responsive design
- Error handling

### Project Structure:
```
admin-panel/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ProductManagement.js
│   │   └── ProductManagement.css
│   ├── services/
│   │   └── api.js          # API service layer
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```


