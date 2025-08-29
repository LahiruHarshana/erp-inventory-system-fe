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
    verified: boolean;
}

export type NewStore = Omit<Store, 'id' | 'isVerified'>;

export type Role = 'ROLE_BUSINESS_OWNER' | 'ROLE_INVENTORY_MANAGER' | 'ROLE_SUPPLY_CHAIN_COORDINATOR' | 'ROLE_ADMIN';

export interface User {
    token: string;
    role: Role;
    email: string;
name:string;
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
    role:Role;
    firstname:string;
    lastname:string;
}

export interface Product {
    id: number;
    sku: string;
    name: string;
    image: string;
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

export const OrderStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    RETURNED: 'RETURNED',
    RECEIVED: 'RECEIVED'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

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

export interface Inventory {
    id: number;
    productId: number;
    productName: string;
    warehouseId: number;
    warehouseName: string;
    quantity: number;
    lastUpdated: string;
}


export interface WarehouseSummary {
    warehouseName: string;
    productCount: number;
    totalQuantity: number;
}

export interface InventorySummary {
    totalProducts: number;
    totalStockQuantity: number;
    totalStockValue: number;
    productsByWarehouse: WarehouseSummary[];
}

export interface LowStockItem {
    productId: number;
    productName: string;
    sku: string;
    warehouseName: string;
    currentQuantity: number;
    supplierName: string;
}

export type PurchaseOrderHistory = PurchaseOrder[];

export interface SalesRecord {
    Date: string;
    Store_ID: string;
    Product_ID: string;
    Category: string;
    Region: string;
    Inventory_Level: number;
    Units_Sold: number;
    Units_Ordered: number;
    Price: number;
    Discount: number;
    Weather_Condition: string;
    Holiday_Promotion: number;
    Competitor_Pricing: number;
    Seasonality: string;
}

export interface ForecastRequest {
    records: SalesRecord[];
}

export interface ForecastResponse {
    predictions: number[];
}

export enum SalesStatus {
    PENDING = 'PENDING',
    SHIPPED = 'SHIPPED',
    CANCELLED = 'CANCELLED'
}

export interface SalesOrderItem {
    id?: number;
    productId: number;
    productName?: string;
    quantity: number;
    unitPrice: number;
}

export interface SalesOrder {
    id: number;
    buyerStoreId: number;
    sellerStoreId: number;
    warehouseId: number;
    orderDate: string;
    status: SalesStatus;
    totalAmount: number;
    orderItems: SalesOrderItem[];
}

export interface PlaceSalesOrder {
    buyerStoreId: number;
    sellerStoreId: number;
    warehouseId: number;
    orderItems: Omit<SalesOrderItem, 'id' | 'productName' | 'unitPrice'>[];
}

export interface Payment {
    transactionId: string;
    paymentMethod: string;
}

