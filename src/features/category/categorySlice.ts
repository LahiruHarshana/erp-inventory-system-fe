import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { categoryApiService } from '../../services/categoryApiService';
import type { Category, NewCategory } from '../../types';
import type { RootState } from '../../app/store';

interface CategoryState {
    items: Category[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CategoryState = {
    items: [],
    status: 'idle',
    error: null,
};

// No changes to your thunks
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await categoryApiService.getCategories();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
});

export const addNewCategory = createAsyncThunk('categories/addNewCategory', async (newCategory: NewCategory, { rejectWithValue }) => {
    try {
        const response = await categoryApiService.createCategory(newCategory);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
});

export const deleteExistingCategory = createAsyncThunk('categories/deleteExistingCategory', async (id: number, { rejectWithValue }) => {
    try {
        await categoryApiService.deleteCategory(id);
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
});

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Categories
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
                state.error = null; // Clear previous errors
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Add New Category
            .addCase(addNewCategory.pending, (state) => {
                // Optionally handle a loading state for this specific action
                state.error = null;
            })
            .addCase(addNewCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                state.items.push(action.payload);
            })
            .addCase(addNewCategory.rejected, (state, action) => {
                // The error toast will be shown in the component,
                // but you can still set a global error if needed.
                state.error = action.payload as string;
            })
            // Delete Existing Category
            .addCase(deleteExistingCategory.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteExistingCategory.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteExistingCategory.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const selectAllCategories = (state: RootState) => state.categories.items;

export default categorySlice.reducer;