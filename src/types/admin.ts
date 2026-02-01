export type AdminRole = 'super_admin' | 'order_manager' | 'content_manager';

export interface AdminUser {
    uid: string;
    email: string;
    displayName?: string;
    role: AdminRole;
    createdAt: Date;
    lastLogin?: Date;
}

export interface AuditLog {
    id: string;
    adminId: string;
    action: string;
    targetId?: string; // ID of the order/product/etc affected
    details?: string;
    timestamp: Date;
    ipAddress?: string;
}

export const PERMISSIONS = {
    super_admin: ['all'],
    order_manager: ['view_orders', 'manage_orders', 'view_customers'],
    content_manager: ['manage_products', 'manage_collections', 'manage_content', 'view_analytics'],
};
