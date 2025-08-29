// src/pages/ProductManagementPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast'; // 1. Import toast and Toaster
import type { RootState, AppDispatch } from '../app/store';
import { fetchProducts, addNewProduct, updateExistingProduct, deleteExistingProduct } from '../features/products/productSlice';
import { fetchCategories, selectAllCategories } from '../features/category/categorySlice';
import { fetchSuppliers, selectAllSuppliers } from '../features/suppliers/supplierSlice';
import type { Product, NewProduct } from '../types';
import { PlusIcon, EditIcon, TrashIcon, PackageIcon, ExclamationIcon, SearchIcon } from '../components/icons';
import { ProductModal } from '../features/products/ProductModal';

// --- Helper Components ---
const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
);

const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <div className="text-center p-8 bg-white rounded-lg">
        <PackageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
        <div className="mt-6">
            <button onClick={onAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium inline-flex items-center">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add New Product
            </button>
        </div>
    </div>
);

// --- Main Component ---
export const ProductManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: products, status, error } = useSelector((state: RootState) => state.products);
    const categories = useSelector(selectAllCategories);
    const categoriesStatus = useSelector((state: RootState) => state.categories.status);
    const suppliers = useSelector(selectAllSuppliers);
    const suppliersStatus = useSelector((state: RootState) => state.suppliers.status);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState(''); // 2. State for search query

    // Fetch initial data
    useEffect(() => {
        if (status === 'idle') dispatch(fetchProducts());
        if (categoriesStatus === 'idle') dispatch(fetchCategories());
        if (suppliersStatus === 'idle') dispatch(fetchSuppliers());
    }, [status, categoriesStatus, suppliersStatus, dispatch]);

    // Show toast on fetch error
    useEffect(() => {
        if (status === 'failed' && error) {
            toast.error(`Error fetching data: ${error}`);
        }
    }, [status, error]);

    // 3. Memoized filtering logic for search
    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;
        return products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery]);

    const handleOpenModal = (product: Product | null = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    // 4. Update form submit to use toast.promise
    const handleFormSubmit = async (productData: Product | NewProduct) => {
        const isUpdating = 'id' in productData;
        const action = isUpdating
            ? updateExistingProduct(productData as Product)
            : addNewProduct(productData as NewProduct);

        const promise = dispatch(action).unwrap();

        toast.promise(promise, {
            loading: isUpdating ? 'Updating product...' : 'Creating product...',
            success: (result) => `Product "${result.name}" ${isUpdating ? 'updated' : 'created'} successfully!`,
            error: (err) => err || `Failed to ${isUpdating ? 'update' : 'create'} product.`,
        });
    };

    // 5. Replace window.confirm with a modern confirmation toast
    const handleDelete = (id: number, name: string) => {
        toast((t) => (
            <div className="flex flex-col items-center gap-3 p-2">
                <div className="flex items-center">
                    <ExclamationIcon className="h-8 w-8 text-red-500 mr-3" />
                    <div className="text-left">
                        <p className="font-bold text-gray-800">Delete "{name}"</p>
                        <p className="text-sm text-gray-600">Are you sure you want to delete this product?</p>
                    </div>
                </div>
                <div className="w-full flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await dispatch(deleteExistingProduct(id)).unwrap();
                                toast.success('Product deleted successfully!');
                            } catch (err: any) {
                                toast.error(err || 'Failed to delete product.');
                            }
                        }}
                        className="px-4 py-1.5 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'N/A';
    const getSupplierName = (id: number) => suppliers.find(s => s.id === id)?.name || 'N/A';

    const renderContent = () => {
        const isLoading = status === 'loading' || categoriesStatus === 'loading' || suppliersStatus === 'loading';
        if (isLoading && products.length === 0) return <LoadingSpinner />;
        if (status === 'failed' && products.length === 0) return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
        if (!isLoading && products.length === 0) return <EmptyState onAddNew={() => handleOpenModal()} />;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Unit Price</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">
                                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-50 rounded-md">
                                    {product.image ? (
                                        <img className="h-full w-full object-cover rounded-md" src={product.image} alt={product.name} />
                                    ) : (
                                        <PackageIcon className="h-6 w-6 text-gray-400" />
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">{product.sku}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryName(product.categoryId)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSupplierName(product.supplierId)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-semibold">${product.unitPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right space-x-2">
                                <button onClick={() => handleOpenModal(product)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"><EditIcon className="h-5 w-5"/></button>
                                <button onClick={() => handleDelete(product.id, product.name)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"><TrashIcon className="h-5 w-5"/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && searchQuery && (
                    <div className="text-center p-8 text-gray-500">No products found for "{searchQuery}".</div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            {/* 6. Add the Toaster component */}
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

            <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Create, edit, and manage all company products.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium flex items-center w-full md:w-auto justify-center">
                    <PlusIcon className="h-5 w-5 mr-2"/> Add New Product
                </button>
            </header>

            {/* 7. Add the search input bar */}
            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by product name or SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <main className="bg-white shadow-sm rounded-lg">
                {renderContent()}
            </main>

            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    product={editingProduct}
                    categories={categories}
                    suppliers={suppliers}
                />
            )}
        </div>
    );
};
