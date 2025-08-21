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
    // Include other fields your backend sends on login/register
}
