import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import storeReducer from '../features/stores/storeSlice';
import authReducer from '../features/auth/authSlice';
import categoryReducer from '../features/category/categorySlice';
import uiReducer from '../features/ui/uiSlice';
import productReducer from '../features/products/productSlice';
import supplierReducer from '../features/suppliers/supplierSlice';
import warehouseReducer from '../features/warehouses/warehouseSlice.ts';
import purchaseOrderReducer from '../features/purchaseOrders/purchaseOrderSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        stores: storeReducer,
        user: userReducer,
        inventory: inventoryReducer,
        categories: categoryReducer,
        ui: uiReducer,
        products: productReducer,
        suppliers: supplierReducer,
        warehouses:warehouseReducer,
        purchaseOrders: purchaseOrderReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;