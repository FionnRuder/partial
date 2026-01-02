"use client";

import React, { useState } from "react";
import { useGetDeliverableTypesQuery, useCreateDeliverableTypeMutation, useUpdateDeliverableTypeMutation, useDeleteDeliverableTypeMutation } from "@/state/api";
import Header from "@/components/Header";
import { Trash2, Plus, Lock, AlertCircle, Edit2 } from "lucide-react";
import { showToast, showApiError, showApiSuccess } from "@/lib/toast";

const DeliverableTypesPage = () => {
  const { data: types, isLoading, error, refetch } = useGetDeliverableTypesQuery();
  const [createType, { isLoading: isCreating }] = useCreateDeliverableTypeMutation();
  const [updateType, { isLoading: isUpdating }] = useUpdateDeliverableTypeMutation();
  const [deleteType] = useDeleteDeliverableTypeMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingType, setEditingType] = useState<{ id: number; name: string } | null>(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newTypeName.trim()) {
      setFormError("Type name is required");
      return;
    }

    try {
      await createType({ name: newTypeName.trim() }).unwrap();
      setShowCreateModal(false);
      setNewTypeName("");
      refetch();
      showApiSuccess("Deliverable type created successfully");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to create deliverable type";
      setFormError(errorMessage);
      showApiError(error, "Failed to create deliverable type");
    }
  };

  const handleEditType = (type: { id: number; name: string }) => {
    setEditingType(type);
    setNewTypeName(type.name);
    setFormError(null);
  };

  const handleUpdateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;

    setFormError(null);

    if (!newTypeName.trim()) {
      setFormError("Type name is required");
      return;
    }

    try {
      await updateType({ typeId: editingType.id, updates: { name: newTypeName.trim() } }).unwrap();
      setEditingType(null);
      setNewTypeName("");
      refetch();
      showApiSuccess("Deliverable type updated successfully");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to update deliverable type";
      setFormError(errorMessage);
      showApiError(error, "Failed to update deliverable type");
    }
  };

  const handleDeleteType = async (typeId: number, typeName: string, isSystem: boolean) => {
    if (isSystem) {
      showToast.warning("Note: This is a system type.");
    }
    
    if (!confirm(`Are you sure you want to delete "${typeName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteError(null);
    try {
      await deleteType(typeId).unwrap();
      refetch();
      showApiSuccess(`Deliverable type "${typeName}" deleted successfully`);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to delete deliverable type";
      setDeleteError(errorMessage);
      showApiError(error, "Failed to delete deliverable type");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-full p-8">
        <Header name="Deliverable Types" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Manage deliverable types for your organization</p>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full p-8">
        <Header name="Deliverable Types" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Manage deliverable types for your organization</p>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Error loading deliverable types. You may not have permission to view types.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full p-8">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Header name="Deliverable Types" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage deliverable types for your organization</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center whitespace-nowrap px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Type
          </button>
        </div>
      </div>

      {deleteError && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-800 dark:text-red-200">{deleteError}</p>
          </div>
        </div>
      )}

      {types && types.length === 0 ? (
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No deliverable types found. Create your first type to get started.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Type
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
                {types?.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {type.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {type.isSystem ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                          <Lock className="w-3 h-3 mr-1" />
                          System
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          Custom
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(type.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditType({ id: type.id, name: type.name })}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit type"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteType(type.id, type.name, type.isSystem)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete type"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Type Modal */}
      {(showCreateModal || editingType) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => {
              setShowCreateModal(false);
              setEditingType(null);
              setNewTypeName("");
              setFormError(null);
            }}></div>

            <div className="inline-block align-bottom bg-white dark:bg-dark-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={editingType ? handleUpdateType : handleCreateType}>
                <div className="bg-white dark:bg-dark-secondary px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                        {editingType ? "Edit Deliverable Type" : "Create New Deliverable Type"}
                      </h3>

                      {formError && (
                        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                          <p className="text-sm text-red-800 dark:text-red-200">{formError}</p>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="typeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Type Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="typeName"
                            value={newTypeName}
                            onChange={(e) => setNewTypeName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter deliverable type name"
                            required
                            autoFocus
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isCreating || isUpdating ? (editingType ? "Updating..." : "Creating...") : (editingType ? "Update Type" : "Create Type")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingType(null);
                      setFormError(null);
                      setNewTypeName("");
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverableTypesPage;

