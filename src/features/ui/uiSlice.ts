import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

type ViewType = 'dashboard' | 'stores' | 'categories' | 'inventory' | 'reports' | 'purchaseOrders' | 'suppliers' | 'users';

interface UiState {
    activeView: ViewType;
}

const initialState: UiState = {
    activeView: 'dashboard',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setView: (state, action: PayloadAction<ViewType>) => {
            state.activeView = action.payload;
        },
    },
});

export const { setView } = uiSlice.actions;

export const selectActiveView = (state: RootState) => state.ui.activeView;

export default uiSlice.reducer;
