import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { productApiService } from '../../services/productApiService';
import type { Product, NewProduct } from '../../types';
import type { RootState } from '../../app/store';

interface ProductState {
    items: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProductState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await productApiService.getProducts();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
});

export const addNewProduct = createAsyncThunk('products/addNewProduct', async (newProduct: NewProduct, { rejectWithValue }) => {
    try {
        const response = await productApiService.createProduct(newProduct);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
});

export const updateExistingProduct = createAsyncThunk('products/updateExistingProduct', async (product: Product, { rejectWithValue }) => {
    try {
        const response = await productApiService.updateProduct(product);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
});

export const deleteExistingProduct = createAsyncThunk('products/deleteExistingProduct', async (id: number, { rejectWithValue }) => {
    try {
        await productApiService.deleteProduct(id);
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addNewProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.items.push(action.payload);
            })
            .addCase(updateExistingProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) { state.items[index] = action.payload; }
            })
            .addCase(deleteExistingProduct.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    },
});

export const selectAllProducts = (state: RootState) => state.products.items;

export default productSlice.reducer;
