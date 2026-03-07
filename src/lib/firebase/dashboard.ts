import { collection, getDocs, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './config';
import { Unsubscribe } from 'firebase/firestore';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    createdAt: Date;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
  }>;
}

// Subscribe to dashboard stats (real-time)
export const subscribeToDashboardStats = (
  callback: (stats: DashboardStats | null) => void
): Unsubscribe => {
  const unsubscribeOrders = onSnapshot(
    query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
    async (orderSnapshot) => {
      const orders = orderSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Array<{ id: string; total?: number; status?: string; orderNumber?: string; userEmail?: string; createdAt?: any; }>;

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      const recentOrders = orders.slice(0, 5).map(order => ({
        id: order.id,
        orderNumber: order.orderNumber || '',
        customer: order.userEmail || 'Unknown',
        total: order.total || 0,
        status: order.status || 'pending',
        createdAt: order.createdAt?.toDate ? order.createdAt.toDate() : new Date(),
      }));

      // Get customers count
      let totalCustomers = 0;
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        totalCustomers = usersSnapshot.size;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }

      // Get products count
      let totalProducts = 0;
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        totalProducts = productsSnapshot.size;
      } catch (error) {
        console.error('Error fetching products:', error);
      }

      callback({
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalProducts,
        pendingOrders,
        recentOrders,
        topProducts: [], // Would need additional logic to calculate
      });
    },
    (error) => {
      console.error('Error subscribing to dashboard stats:', error);
      callback(null);
    }
  );

  return unsubscribeOrders;
};
