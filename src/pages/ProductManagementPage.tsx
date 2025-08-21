import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchProducts, addNewProduct, updateExistingProduct, deleteExistingProduct } from '../features/products/productSlice';
import { fetchCategories, selectAllCategories } from '../features/category/categorySlice';
import type { Product, NewProduct } from '../types';
import { PlusIcon, EditIcon, TrashIcon, PackageIcon } from '../components/icons';
import { ProductModal } from '../features/products/ProductModal';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
);

const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
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

export const ProductManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: products, status, error } = useSelector((state: RootState) => state.products);
    const categories = useSelector(selectAllCategories);
    const categoriesStatus = useSelector((state: RootState) => state.categories.status);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchProducts());
        if (categoriesStatus === 'idle') dispatch(fetchCategories());
    }, [status, categoriesStatus, dispatch]);

    const handleOpenModal = (product: Product | null = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (productData: Product | NewProduct) => {
        if ('id' in productData) {
            dispatch(updateExistingProduct(productData as Product));
        } else {
            dispatch(addNewProduct(productData as NewProduct));
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteExistingProduct(id));
        }
    };

    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'N/A';

    const renderContent = () => {
        if (status === 'loading' || categoriesStatus === 'loading') return <LoadingSpinner />;
        if (status === 'failed') return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
        if (products.length === 0) return <EmptyState onAddNew={() => handleOpenModal()} />;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Unit Price</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">{product.sku}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryName(product.categoryId)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-semibold">${product.unitPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right space-x-4">
                                <button onClick={() => handleOpenModal(product)} className="text-indigo-600 hover:text-indigo-900 p-1"><EditIcon className="h-5 w-5"/></button>
                                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 p-1"><TrashIcon className="h-5 w-5"/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Create, edit, and manage all company products.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2"/> Add New Product
                </button>
            </header>
            <main className="bg-white shadow-sm rounded-lg">
                {renderContent()}
            </main>
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                product={editingProduct}
                categories={categories}
            />
        </div>
    );
};
