import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import storeReducer from '../features/stores/storeSlice';
import authReducer from '../features/auth/authSlice';


export const store = configureStore({
    reducer: {
                auth: authReducer,
        stores: storeReducer,
        user: userReducer,
        inventory: inventoryReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;