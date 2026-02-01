'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Users, ShoppingCart, DollarSign, Eye } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface AnalyticsData {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
  conversionRate: number;
}

interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
}

interface TrafficSource {
  name: string;
  value: number;
}

interface Order {
  id: string;
  total: number;
  createdAt: any; // Firestore timestamp
  userId: string;
  orderStatus: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    // Set up real-time listeners for analytics data
    let ordersUnsubscribe: () => void;
    let productsUnsubscribe: () => void;

    const fetchData = async () => {
      try {
        // Listen to orders collection for real-time updates
        const ordersQuery = query(collection(db, 'orders'));
        ordersUnsubscribe = onSnapshot(ordersQuery, (snapshot) => {
          const ordersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Order));

          // Calculate metrics
          const revenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
          const ordersCount = ordersData.length;

          setTotalRevenue(revenue);
          setTotalOrders(ordersCount);

          // Calculate conversion rate (this would typically come from visitor data)
          // For now, we'll use a placeholder calculation based on orders
          // In a real app, this would come from analytics tracking
          const calculatedConversionRate = ordersCount > 0 ? Math.min(10, (ordersCount / 500) * 100) : 0;
          setConversionRate(parseFloat(calculatedConversionRate.toFixed(2)));

          // Calculate monthly analytics data
          const monthlyData: Record<string, AnalyticsData> = {};

          ordersData.forEach(order => {
            const date = order.createdAt?.toDate ? order.createdAt.toDate() : new Date();
            const month = date.toLocaleString('default', { month: 'short' });

            if (!monthlyData[month]) {
              monthlyData[month] = {
                date: month,
                revenue: 0,
                orders: 0,
                visitors: 0,
                conversionRate: 0
              };
            }

            monthlyData[month].revenue += order.total || 0;
            monthlyData[month].orders += 1;
          });

          // Add some mock visitor data for demonstration
          // In a real app, this would come from analytics tracking
          Object.keys(monthlyData).forEach(month => {
            // Calculate conversion rate based on actual orders vs visitors
            monthlyData[month].visitors = Math.floor(monthlyData[month].orders * 10); // Mock visitor count
            const convRate = monthlyData[month].visitors > 0
              ? parseFloat(((monthlyData[month].orders / monthlyData[month].visitors) * 100).toFixed(2))
              : 0;
            monthlyData[month].conversionRate = convRate;
          });

          setAnalyticsData(Object.values(monthlyData));
        });

        // Listen to products collection for performance data
        const productsQuery = query(collection(db, 'products'));
        productsUnsubscribe = onSnapshot(productsQuery, (snapshot) => {
          const productsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Product));

          // Calculate product performance based on actual orders
          // For now, we'll simulate this with random data based on product popularity
          const performanceData: ProductPerformance[] = productsData.slice(0, 5).map((product, index) => {
            // Simulate sales based on product price and popularity
            const sales = Math.max(1, Math.floor((100 - index * 10) / (product.price / 1000 || 1)));
            const revenue = sales * (product.price || 1000);

            return {
              name: product.name || `Product ${index + 1}`,
              sales,
              revenue
            };
          });

          setProductPerformance(performanceData);
        });

        // Set mock traffic sources data
        setTrafficSources([
          { name: 'Direct', value: 400 },
          { name: 'Social', value: 300 },
          { name: 'Referral', value: 300 },
          { name: 'Organic', value: 200 },
        ]);

        // Set mock unique visitors
        setUniqueVisitors(12450);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (ordersUnsubscribe) ordersUnsubscribe();
      if (productsUnsubscribe) productsUnsubscribe();
    };
  }, []);

  // Colors for charts
  const COLORS = ['#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fecaca'];
  const LINE_COLORS = ['#b91c1c', '#dc2626', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-white text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Analytics Dashboard</h1>
          <p className="text-sm text-gray-600">Track performance metrics and business insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Live Analytics
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group text-black">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-red-600 transition-colors`}>
              <DollarSign className={`w-5 h-5 text-green-500 group-hover:text-white`} />
            </div>
            <span className="flex items-center text-xs font-bold text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-gray-500 font-bold mb-1">Total Revenue</p>
          <h3 className="text-2xl font-bold tracking-tight text-black">₦{totalRevenue.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group text-black">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-red-600 transition-colors`}>
              <ShoppingCart className={`w-5 h-5 text-blue-500 group-hover:text-white`} />
            </div>
            <span className="flex items-center text-xs font-bold text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" /> +5.2%
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-gray-500 font-bold mb-1">Total Orders</p>
          <h3 className="text-2xl font-bold tracking-tight text-black">{totalOrders}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group text-black">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-red-600 transition-colors`}>
              <Users className={`w-5 h-5 text-purple-500 group-hover:text-white`} />
            </div>
            <span className="flex items-center text-xs font-bold text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" /> +2.1%
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-gray-500 font-bold mb-1">Unique Visitors</p>
          <h3 className="text-2xl font-bold tracking-tight text-black">{uniqueVisitors.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group text-black">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-red-600 transition-colors`}>
              <Eye className={`w-5 h-5 text-gray-500 group-hover:text-white`} />
            </div>
            <span className="flex items-center text-xs font-bold text-red-500">
              <TrendingUp className="w-3 h-3 mr-1" /> -1.2%
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-gray-500 font-bold mb-1">Conversion Rate</p>
          <h3 className="text-2xl font-bold tracking-tight text-black">{conversionRate.toFixed(2)}%</h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue & Orders Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-6">Revenue & Orders Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis yAxisId="left" stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '0.5rem' }}
                  formatter={(value, name) => {
                    if (name === 'revenue') {
                      return [`₦${Number(value).toLocaleString()}`, 'Revenue'];
                    }
                    return [value, name === 'orders' ? 'Orders' : name];
                  }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#b91c1c" name="Revenue (₦)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3b82f6" name="Orders" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Rate Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-6">Visitor Conversion Rate</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '0.5rem' }}
                  formatter={(value) => [`${value}%`, 'Conversion Rate']}
                />
                <Legend />
                <Bar dataKey="conversionRate" name="Conversion Rate" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Performance */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-6">Top Performing Products</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productPerformance}
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '0.5rem' }}
                  formatter={(value, name) => name === 'sales' ? [`${value} units`, 'Sales'] : [`₦${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Legend />
                <Bar dataKey="sales" name="Units Sold" fill="#b91c1c" radius={[0, 4, 4, 0]} />
                <Bar dataKey="revenue" name="Revenue (₦)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-6">Traffic Sources</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '0.5rem' }}
                  formatter={(value) => [`${value} visits`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}