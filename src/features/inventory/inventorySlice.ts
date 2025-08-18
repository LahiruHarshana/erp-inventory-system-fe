import { createSlice } from '@reduxjs/toolkit';

const mockInventoryData = [
    { id: 'PROD-001', name: 'Wireless Mouse', category: 'Electronics', stock: 150, status: 'In Stock' },
    { id: 'PROD-002', name: 'Mechanical Keyboard', category: 'Electronics', stock: 75, status: 'In Stock' },
    { id: 'PROD-003', name: 'Office Chair', category: 'Furniture', stock: 40, status: 'Low Stock' },
    { id: 'PROD-004', name: 'Desk Lamp', category: 'Furniture', stock: 0, status: 'Out of Stock' },
    { id: 'PROD-005', name: 'Notebooks (Pack of 5)', category: 'Stationery', stock: 300, status: 'In Stock' },
];

const mockPurchaseOrders = [
    { id: 'PO-2024-001', supplier: 'Tech Supplies Inc.', date: '2024-08-15', status: 'Shipped', total: '$5,400.00' },
    { id: 'PO-2024-002', supplier: 'Office Comforts', date: '2024-08-12', status: 'Processing', total: '$12,800.00' },
    { id: 'PO-2024-003', supplier: 'Stationery World', date: '2024-08-10', status: 'Delivered', total: '$2,100.00' },
];

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        items: mockInventoryData,
        purchaseOrders: mockPurchaseOrders,
    },
    reducers: {
    },
});

export default inventorySlice.reducer;