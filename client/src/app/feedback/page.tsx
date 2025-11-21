"use client";

import React, { useState } from "react";
import { useGetFeedbackQuery, useUpdateFeedbackMutation, Priority } from "@/state/api";
import Header from "@/components/Header";
import { format } from "date-fns";
import { Bug, Sparkles, Lightbulb, CheckCircle, XCircle, Clock, AlertCircle, Edit2, Save, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const FeedbackPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  
  // Check if user has permission (Admin only)
  const hasPermission = user?.role === "Admin";
  
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ status: string; priority: Priority; adminNotes: string }>({ status: "", priority: Priority.Medium, adminNotes: "" });

  const queryParams: { status?: string; type?: string; priority?: string } = {};
  if (statusFilter !== "all") queryParams.status = statusFilter;
  if (typeFilter !== "all") queryParams.type = typeFilter;
  if (priorityFilter !== "all") queryParams.priority = priorityFilter;

  const { data: feedback, isLoading, error, refetch } = useGetFeedbackQuery(
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );
  const [updateFeedback, { isLoading: isUpdating }] = useUpdateFeedbackMutation();

  // Redirect if no permission
  React.useEffect(() => {
    if (user && !hasPermission) {
      router.push("/");
    }
  }, [user, hasPermission, router]);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({
      status: item.status,
      priority: item.priority,
      adminNotes: item.adminNotes || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ status: "", priority: Priority.Medium, adminNotes: "" });
  };

  const handleSave = async (id: number) => {
    try {
      await updateFeedback({
        id,
        data: {
          status: editData.status as any,
          priority: editData.priority,
          adminNotes: editData.adminNotes || undefined,
        },
      }).unwrap();
      setEditingId(null);
      setEditData({ status: "", adminNotes: "" });
      refetch();
    } catch (error: any) {
      alert(error?.data?.message || "Failed to update feedback");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug":
        return <Bug className="w-5 h-5 text-red-500" />;
      case "feature":
        return <Sparkles className="w-5 h-5 text-blue-500" />;
      case "improvement":
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bug":
        return "Bug Report";
      case "feature":
        return "Feature Request";
      case "improvement":
        return "Improvement";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case "open":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`}>
            <Clock className="w-3 h-3 mr-1" />
            Open
          </span>
        );
      case "in_progress":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300`}>
            <AlertCircle className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      case "resolved":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300`}>
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </span>
        );
      case "closed":
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300`}>
            <XCircle className="w-3 h-3 mr-1" />
            Closed
          </span>
        );
      default:
        return <span className={baseClasses}>{status}</span>;
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (priority) {
      case Priority.Urgent:
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300`}>
            🔴 Urgent
          </span>
        );
      case Priority.High:
        return (
          <span className={`${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300`}>
            🟠 High
          </span>
        );
      case Priority.Medium:
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300`}>
            🟡 Medium
          </span>
        );
      case Priority.Low:
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300`}>
            🟢 Low
          </span>
        );
      case Priority.Backlog:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300`}>
            ⚪ Backlog
          </span>
        );
      default:
        return <span className={baseClasses}>{priority}</span>;
    }
  };

  if (!hasPermission) {
    return (
      <div className="p-8">
        <Header name="Feedback" />
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <Header name="Feedback" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Header name="Feedback" />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-red-600 dark:text-red-400">Error loading feedback. Please try again.</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: feedback?.length || 0,
    open: feedback?.filter((f) => f.status === "open").length || 0,
    inProgress: feedback?.filter((f) => f.status === "in_progress").length || 0,
    resolved: feedback?.filter((f) => f.status === "resolved").length || 0,
    closed: feedback?.filter((f) => f.status === "closed").length || 0,
  };

  return (
    <div className="p-8">
      <Header name="Feedback Management" />
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow p-4">
          <div className="text-sm text-blue-600 dark:text-blue-400">Open</div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.open}</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow p-4">
          <div className="text-sm text-yellow-600 dark:text-yellow-400">In Progress</div>
          <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{stats.inProgress}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-4">
          <div className="text-sm text-green-600 dark:text-green-400">Resolved</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-300">{stats.resolved}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Closed</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-300">{stats.closed}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="bug">Bug Reports</option>
              <option value="feature">Feature Requests</option>
              <option value="improvement">Improvements</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value={Priority.Urgent}>🔴 Urgent</option>
              <option value={Priority.High}>🟠 High</option>
              <option value={Priority.Medium}>🟡 Medium</option>
              <option value={Priority.Low}>🟢 Low</option>
              <option value={Priority.Backlog}>⚪ Backlog</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedback && feedback.length > 0 ? (
          feedback.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  {getTypeIcon(item.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      {getStatusBadge(item.status)}
                      {getPriorityBadge(item.priority)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getTypeLabel(item.type)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        Submitted by <span className="font-medium">{item.submittedBy.name}</span> ({item.submittedBy.email})
                      </span>
                      <span>•</span>
                      <span>{format(new Date(item.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                      {item.resolvedBy && (
                        <>
                          <span>•</span>
                          <span>
                            Resolved by <span className="font-medium">{item.resolvedBy.name}</span>
                            {item.resolvedAt && (
                              <> on {format(new Date(item.resolvedAt), "MMM d, yyyy")}</>
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(item.id)}
                      disabled={isUpdating}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                      title="Save"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {editingId === item.id ? (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={editData.priority}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value as Priority })}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={Priority.Urgent}>🔴 Urgent</option>
                      <option value={Priority.High}>🟠 High</option>
                      <option value={Priority.Medium}>🟡 Medium</option>
                      <option value={Priority.Low}>🟢 Low</option>
                      <option value={Priority.Backlog}>⚪ Backlog</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={editData.adminNotes}
                      onChange={(e) => setEditData({ ...editData, adminNotes: e.target.value })}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Add internal notes about this feedback..."
                    />
                  </div>
                </div>
              ) : (
                item.adminNotes && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Admin Notes:
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {item.adminNotes}
                    </div>
                  </div>
                )
              )}
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No feedback found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;

