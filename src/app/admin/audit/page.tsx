'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Search, Eye, User } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  resourceType?: string;
  resourceId?: string;
  details: Record<string, any>;
}

export default function AuditLogsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!user) return;

    const q = query(
      collection(db, 'audit_logs'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logsData: AuditLog[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate
              ? data.timestamp.toDate()
              : new Date(),
          } as AuditLog;
        });

        setLogs(logsData);
        setLoadingLogs(false);
      },
      (error) => {
        console.error('Error fetching audit logs:', error);
        setLoadingLogs(false);
      }
    );

    return () => unsubscribe();
  }, [user, loading, router]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'all') return matchesSearch;
    return matchesSearch && log.action.toLowerCase().includes(filterType.toLowerCase());
  });

  if (loading || loadingLogs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-white text-black min-h-screen pt-16 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Audit Logs</h1>
          <p className="text-sm text-gray-600 mt-2">
            Security trail of all administrative actions.
          </p>
        </div>

        <div className="space-y-8">
          {/* Filters */}
          <div className="p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs by action, user, or IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none"
              >
                <option value="all">All Actions</option>
                <option value="login">Login Events</option>
                <option value="order">Order Changes</option>
                <option value="product">Product Updates</option>
                <option value="user">User Management</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">IP Address</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4 text-right">Details</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No audit logs found.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{log.action}</div>
                          {log.resourceType && log.resourceId && (
                            <div className="text-xs text-gray-500 mt-1">
                              {log.resourceType}: {log.resourceId}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium">{log.userName}</div>
                              <div className="text-xs text-gray-500">{log.userId}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-mono text-xs">{log.ipAddress}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {log.userAgent}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs text-gray-500">
                          {log.timestamp.toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <details>
                            <summary className="cursor-pointer inline-flex justify-end">
                              <Eye className="w-4 h-4 text-gray-500 hover:text-black" />
                            </summary>
                            <pre className="mt-2 p-4 bg-gray-50 rounded-md text-xs whitespace-pre-wrap max-w-md">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
