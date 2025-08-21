import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { categoryApiService } from '../../services/categoryApiService';
import type { Category, NewCategory } from '../../types/categoryTypes';
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
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addNewCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                state.items.push(action.payload);
            })
            .addCase(deleteExistingCategory.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    },
});

export const selectAllCategories = (state: RootState) => state.categories.items;

export default categorySlice.reducer;
