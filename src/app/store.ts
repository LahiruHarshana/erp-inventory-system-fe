import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import inventoryReducer from '../features/inventory/inventorySlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        inventory: inventoryReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;