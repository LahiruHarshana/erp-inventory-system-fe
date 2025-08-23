export interface Category {
    id: number;
    name: string;
}
export type NewCategory = Omit<Category, 'id'>;
export interface Store {
    id: number;
    storeName: string;
    storeRegistrationNumber: string;
    taxId: string;
    operationalDetails: string;
    isVerified: boolean;
}

export type NewStore = Omit<Store, 'id' | 'isVerified'>;

export type Role = 'ROLE_BUSINESS_OWNER' | 'ROLE_INVENTORY_MANAGER' | 'ROLE_SUPPLY_CHAIN_COORDINATOR' | 'ROLE_ADMIN';

export interface User {
    token: string;
    role: Role;
    email: string;
    // Add other user properties you might get from the backend
}

export interface RegisterRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: Role;
}

export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface AuthenticationResponse {
    token: string;
    role:Role
}

export interface Product {
    id: number;
    sku: string;
    name: string;
    description: string;
    categoryId: number;
    supplierId: number;
    unitPrice: number;
}
export type NewProduct = Omit<Product, 'id'>;

export interface Supplier {
    id: number;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    apiUrl: string;
}

export type NewSupplier = Omit<Supplier, 'id'>;

export interface Warehouse {
    id: number;
    name: string;
    location: string;
}

export type NewWarehouse = Omit<Warehouse, 'id'>;

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED',
    RECEIVED = 'RECEIVED'
}

export interface PurchaseOrderItem {
    id?: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    productName?: string;
}

export interface PurchaseOrder {
    id: number;
    supplierId: number;
    supplierName?: string;
    orderDate: string;
    expectedDeliveryDate: string;
    status: OrderStatus;
    totalAmount: number;
    orderItems: PurchaseOrderItem[];
}

export type NewPurchaseOrder = Omit<PurchaseOrder, 'id' | 'orderDate' | 'status' | 'totalAmount' | 'supplierName'> & {
    orderItems: Omit<PurchaseOrderItem, 'id' | 'productName'>[];
};

export interface Payment {
    transactionId: string;
    paymentMethod: string;
}
