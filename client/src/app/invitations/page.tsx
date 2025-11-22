"use client";

import React, { useState } from "react";
import { useGetInvitationsQuery, useCreateInvitationMutation, useRevokeInvitationMutation } from "@/state/api";
import Header from "@/components/Header";
import { format } from "date-fns";
import { Copy, Trash2, Mail, UserPlus, CheckCircle, XCircle, Clock } from "lucide-react";
import { showApiError, showApiSuccess } from "@/lib/toast";

const InvitationsPage = () => {
  const { data: invitations, isLoading, error, refetch } = useGetInvitationsQuery();
  const [createInvitation, { isLoading: isCreating }] = useCreateInvitationMutation();
  const [revokeInvitation] = useRevokeInvitationMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    invitedEmail: "",
    role: "Engineer",
    expiresInDays: 7,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Roles that can be assigned via invitations
  // Note: These should match the UserRole enum in the backend
  const roles = ["Admin", "Manager", "Program Manager", "Engineer", "Viewer"] as const;

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.role) {
      setFormError("Role is required");
      return;
    }

    try {
      const result = await createInvitation({
        invitedEmail: formData.invitedEmail || undefined,
        role: formData.role,
        expiresInDays: formData.expiresInDays,
      }).unwrap();

      // Show success and reset form
      setShowCreateModal(false);
      setFormData({
        invitedEmail: "",
        role: "Engineer",
        expiresInDays: 7,
      });
      refetch();
      showApiSuccess("Invitation created successfully");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to create invitation";
      setFormError(errorMessage);
      showApiError(error, "Failed to create invitation");
    }
  };

  const handleRevokeInvitation = async (invitationId: number) => {
    if (!confirm("Are you sure you want to revoke this invitation? This action cannot be undone.")) {
      return;
    }

    try {
      await revokeInvitation(invitationId).unwrap();
      refetch();
      showApiSuccess("Invitation revoked successfully");
    } catch (error: any) {
      showApiError(error, "Failed to revoke invitation");
    }
  };

  const copyInvitationUrl = (token: string) => {
    const url = `${window.location.origin}/onboarding?invitation=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getStatusBadge = (invitation: any) => {
    if (invitation.used) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Used
        </span>
      );
    }

    const expiresAt = new Date(invitation.expiresAt);
    const now = new Date();

    if (expiresAt < now) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
          <XCircle className="w-3 h-3 mr-1" />
          Expired
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-full p-8">
        <Header title="Invitations" subtitle="Manage organization invitations" />
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full p-8">
        <Header title="Invitations" subtitle="Manage organization invitations" />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Error loading invitations. You may not have permission to view invitations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full p-8">
      <div className="flex justify-between items-center mb-6">
        <Header title="Invitations" subtitle="Invite users to join your organization" />
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center whitespace-nowrap px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Invitation
        </button>
      </div>

      {invitations && invitations.length === 0 ? (
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-8 text-center">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Invitations</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't created any invitations yet. Create one to invite users to your organization.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Invitation
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
                {invitations?.map((invitation) => (
                  <tr key={invitation.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {invitation.invitedEmail || (
                        <span className="text-gray-400 dark:text-gray-500 italic">No email restriction</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {invitation.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invitation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {format(new Date(invitation.expiresAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {invitation.createdBy?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {!invitation.used && (
                          <>
                            <button
                              onClick={() => copyInvitationUrl(invitation.token)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Copy invitation link"
                            >
                              {copiedToken === invitation.token ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRevokeInvitation(invitation.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Revoke invitation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Invitation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)}></div>

            <div className="inline-block align-bottom bg-white dark:bg-dark-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateInvitation}>
                <div className="bg-white dark:bg-dark-secondary px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                        Create New Invitation
                      </h3>

                      {formError && (
                        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                          <p className="text-sm text-red-800 dark:text-red-200">{formError}</p>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="invitedEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email (Optional)
                          </label>
                          <input
                            type="email"
                            id="invitedEmail"
                            value={formData.invitedEmail}
                            onChange={(e) => setFormData({ ...formData, invitedEmail: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="user@example.com"
                          />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Leave empty to allow any email address
                          </p>
                        </div>

                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Role <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="expiresInDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Expires In (Days)
                          </label>
                          <input
                            type="number"
                            id="expiresInDays"
                            min="1"
                            max="30"
                            value={formData.expiresInDays}
                            onChange={(e) => setFormData({ ...formData, expiresInDays: parseInt(e.target.value) || 7 })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isCreating ? "Creating..." : "Create Invitation"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormError(null);
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

export default InvitationsPage;

