import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    role: string;
    name: string;
    notifications: number;
}

const initialState: UserState = {
    role: 'Inventory Manager',
    name: 'Alex Doe',
    notifications: 5,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserRole: (state, action: PayloadAction<string>) => {
            state.role = action.payload;
        },
    },
});

export const { setUserRole } = userSlice.actions;
export default userSlice.reducer;
