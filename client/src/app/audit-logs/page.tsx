"use client";

import Header from "@/components/Header";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetAuditLogsQuery,
  useGetAuditLogStatsQuery,
  AuditLog,
  AuditAction,
} from "@/state/api";
import { format } from "date-fns";
import { Search, Filter, Download, RefreshCw } from "lucide-react";

const AuditLogsPage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [filters, setFilters] = useState({
    action: "",
    entityType: "",
    entityId: "",
    userId: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  // Check if user is admin
  const isAdmin = user?.role === "Admin" || user?.role === "ProgramManager";

  const { data, isLoading, error, refetch } = useGetAuditLogsQuery({
    page,
    limit,
    ...(filters.action && { action: filters.action as AuditAction }),
    ...(filters.entityType && { entityType: filters.entityType }),
    ...(filters.entityId && { entityId: parseInt(filters.entityId) }),
    ...(filters.userId && { userId: parseInt(filters.userId) }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    ...(filters.search && { search: filters.search }),
  });

  const { data: stats } = useGetAuditLogStatsQuery({});

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
              Access Denied
            </h2>
            <p className="text-red-600 dark:text-red-300">
              You must be an Administrator to view audit logs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      action: "",
      entityType: "",
      entityId: "",
      userId: "",
      startDate: "",
      endDate: "",
      search: "",
    });
    setPage(1);
  };

  const formatAction = (action: AuditAction) => {
    const labels: Record<AuditAction, string> = {
      [AuditAction.CREATE]: "Created",
      [AuditAction.UPDATE]: "Updated",
      [AuditAction.DELETE]: "Deleted",
      [AuditAction.VIEW]: "Viewed",
      [AuditAction.LOGIN]: "Login",
      [AuditAction.LOGOUT]: "Logout",
      [AuditAction.EXPORT]: "Exported",
      [AuditAction.IMPORT]: "Imported",
    };
    return labels[action] || action;
  };

  const getActionColor = (action: AuditAction) => {
    const colors: Record<AuditAction, string> = {
      [AuditAction.CREATE]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      [AuditAction.UPDATE]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      [AuditAction.DELETE]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      [AuditAction.VIEW]: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      [AuditAction.LOGIN]: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      [AuditAction.LOGOUT]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      [AuditAction.EXPORT]: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      [AuditAction.IMPORT]: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Audit Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive audit trail of all system activities
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-dark-secondary rounded-lg p-4 shadow">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Logs</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalLogs.toLocaleString()}
              </div>
            </div>
            <div className="bg-white dark:bg-dark-secondary rounded-lg p-4 shadow">
              <div className="text-sm text-gray-600 dark:text-gray-400">Action Types</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.actionsCount.length}
              </div>
            </div>
            <div className="bg-white dark:bg-dark-secondary rounded-lg p-4 shadow">
              <div className="text-sm text-gray-600 dark:text-gray-400">Entity Types</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.entityTypesCount.length}
              </div>
            </div>
            <div className="bg-white dark:bg-dark-secondary rounded-lg p-4 shadow">
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.topUsers.length}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow mb-6 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search descriptions..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-primary text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Action
              </label>
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange("action", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-primary text-gray-900 dark:text-white"
              >
                <option value="">All Actions</option>
                {Object.values(AuditAction).map((action) => (
                  <option key={action} value={action}>
                    {formatAction(action)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entity Type
              </label>
              <input
                type="text"
                placeholder="e.g., WorkItem, User"
                value={filters.entityType}
                onChange={(e) => handleFilterChange("entityType", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-primary text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-primary text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-primary text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entity ID
              </label>
              <input
                type="number"
                placeholder="Entity ID"
                value={filters.entityId}
                onChange={(e) => handleFilterChange("entityId", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-primary text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Audit Log Entries
            </h2>
            <button
              onClick={() => refetch()}
              className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>

          {isLoading && (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              Loading audit logs...
            </div>
          )}

          {error && (
            <div className="p-8 text-center text-red-600 dark:text-red-400">
              Error loading audit logs. Please try again.
            </div>
          )}

          {data && !isLoading && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-dark-primary">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Entity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
                    {data.auditLogs.map((log: AuditLog) => (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 dark:hover:bg-dark-primary"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm:ss")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div>
                            <div className="font-medium">{log.user.name}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              {log.user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(
                              log.action
                            )}`}
                          >
                            {formatAction(log.action)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div>
                            <div className="font-medium">{log.entityType}</div>
                            {log.entityId && (
                              <div className="text-gray-500 dark:text-gray-400 text-xs">
                                ID: {log.entityId}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {log.description}
                          {log.changes && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Changes recorded
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {log.ipAddress || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, data.pagination.total)} of{" "}
                    {data.pagination.total} entries
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-primary text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-secondary"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      Page {page} of {data.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                      disabled={page === data.pagination.totalPages}
                      className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-primary text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-secondary"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;


