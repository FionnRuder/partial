"use client";

import Header from '@/components/Header';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGetUserByIdQuery, useGetTeamsQuery, useUpdateUserMutation, useGetEmailPreferencesQuery, useUpdateEmailPreferencesMutation, useGetOrganizationQuery, useUpdateOrganizationMutation } from '@/state/api';
import { showApiSuccess, showApiError } from '@/lib/toast';

const Settings = () => {
    const { user: authUser, updateProfile } = useAuth();
    const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(authUser?.id || "", { skip: !authUser?.id });
    const { data: teams, isLoading: isTeamsLoading } = useGetTeamsQuery();
    const [updateUser] = useUpdateUserMutation();
    const { data: emailPreferences, isLoading: isEmailPreferencesLoading } = useGetEmailPreferencesQuery(authUser?.id || "", { skip: !authUser?.id });
    const [updateEmailPreferences] = useUpdateEmailPreferencesMutation();
    const { data: organization, isLoading: isOrganizationLoading } = useGetOrganizationQuery();
    const [updateOrganization] = useUpdateOrganizationMutation();

    const sanitizeProfilePictureUrl = (value?: string | null) => {
        if (!value) return '';
        const trimmed = value.trim();
        if (!trimmed) return '';
        const lower = trimmed.toLowerCase();
        if (lower.startsWith('http://') || lower.startsWith('https://')) {
            return '';
        }
        return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    };

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        profilePictureUrl: '',
        disciplineTeamId: null as number | null,
    });
    const [emailPrefs, setEmailPrefs] = useState({
        emailNotificationsEnabled: true,
        emailWorkItemAssignment: true,
        emailWorkItemStatusChange: true,
        emailWorkItemComment: true,
        emailInvitation: true,
        emailApproachingDeadline: true,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingEmailPrefs, setIsSavingEmailPrefs] = useState(false);
    const [isSavingOrganization, setIsSavingOrganization] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [emailPrefsSaveStatus, setEmailPrefsSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [organizationSaveStatus, setOrganizationSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [organizationName, setOrganizationName] = useState('');

    // Initialize form data when user data loads
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phoneNumber: user.phoneNumber || '',
                profilePictureUrl: sanitizeProfilePictureUrl(user.profilePictureUrl),
                disciplineTeamId: user.disciplineTeamId || null,
            });
        }
    }, [user]);

    // Initialize email preferences when they load
    useEffect(() => {
        if (emailPreferences) {
            setEmailPrefs({
                emailNotificationsEnabled: emailPreferences.emailNotificationsEnabled ?? true,
                emailWorkItemAssignment: emailPreferences.emailWorkItemAssignment ?? true,
                emailWorkItemStatusChange: emailPreferences.emailWorkItemStatusChange ?? true,
                emailWorkItemComment: emailPreferences.emailWorkItemComment ?? true,
                emailInvitation: emailPreferences.emailInvitation ?? true,
                emailApproachingDeadline: emailPreferences.emailApproachingDeadline ?? true,
            });
        }
    }, [emailPreferences]);

    // Initialize organization name when it loads
    useEffect(() => {
        if (organization) {
            setOrganizationName(organization.name || '');
        }
    }, [organization]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        setSaveStatus('idle');

        try {
            // Update via API
            await updateUser({
                id: user.id,
                data: {
                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                    profilePictureUrl: formData.profilePictureUrl,
                    disciplineTeamId: formData.disciplineTeamId || undefined,
                },
            }).unwrap();

            // Also update AuthContext
            await updateProfile({
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                profilePictureUrl: formData.profilePictureUrl,
                disciplineTeamId: formData.disciplineTeamId || undefined,
            });

            setSaveStatus('success');
            showApiSuccess('Profile settings saved successfully');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Failed to update user:', error);
            setSaveStatus('error');
            showApiError(error, 'Failed to save profile settings');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEmailPrefsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser?.id) return;

        setIsSavingEmailPrefs(true);
        setEmailPrefsSaveStatus('idle');

        try {
            await updateEmailPreferences({
                id: authUser.id,
                preferences: emailPrefs,
            }).unwrap();

            setEmailPrefsSaveStatus('success');
            showApiSuccess('Email preferences saved successfully');
            setTimeout(() => setEmailPrefsSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Failed to update email preferences:', error);
            setEmailPrefsSaveStatus('error');
            showApiError(error, 'Failed to save email preferences');
            setTimeout(() => setEmailPrefsSaveStatus('idle'), 3000);
        } finally {
            setIsSavingEmailPrefs(false);
        }
    };

    const handleOrganizationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!organizationName.trim()) {
            setOrganizationSaveStatus('error');
            showApiError(new Error('Organization name cannot be empty'), 'Organization name is required');
            setTimeout(() => setOrganizationSaveStatus('idle'), 3000);
            return;
        }

        setIsSavingOrganization(true);
        setOrganizationSaveStatus('idle');

        try {
            await updateOrganization({
                name: organizationName.trim(),
            }).unwrap();

            setOrganizationSaveStatus('success');
            showApiSuccess('Organization name updated successfully');
            setTimeout(() => setOrganizationSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Failed to update organization:', error);
            setOrganizationSaveStatus('error');
            showApiError(error, 'Failed to save organization name');
            setTimeout(() => setOrganizationSaveStatus('idle'), 3000);
        } finally {
            setIsSavingOrganization(false);
        }
    };

    const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
    const inputStyles = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500";
    const readOnlyStyles = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 bg-gray-50";

    if (isUserLoading || !user) {
        return (
            <div className="p-8">
                <Header name="Settings" />
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <Header name="Settings" />
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username (Read-only) */}
                <div>
                    <label className={labelStyles}>Username</label>
                    <div className={readOnlyStyles}>{user.username}</div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Username cannot be changed</p>
                </div>

                {/* Email (Read-only) */}
                <div>
                    <label className={labelStyles}>Email</label>
                    <div className={readOnlyStyles}>{user.email}</div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                </div>

                {/* Name (Editable) */}
                <div>
                    <label htmlFor="name" className={labelStyles}>Name</label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputStyles}
                        required
                    />
                </div>

                {/* Phone Number (Editable) */}
                <div>
                    <label htmlFor="phoneNumber" className={labelStyles}>Phone Number</label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className={inputStyles}
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                {/* Profile Picture URL (Editable) */}
                <div>
                    <label htmlFor="profilePictureUrl" className={labelStyles}>Profile Picture URL</label>
                    <input
                        id="profilePictureUrl"
                        type="url"
                        value={formData.profilePictureUrl}
                        onChange={(e) => setFormData({ ...formData, profilePictureUrl: sanitizeProfilePictureUrl(e.target.value) })}
                        className={inputStyles}
                        placeholder="/images/profile.jpg"
                    />
                    {formData.profilePictureUrl && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                                <img
                                    src={formData.profilePictureUrl}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Discipline Team (Editable) */}
                <div>
                    <label htmlFor="disciplineTeam" className={labelStyles}>Discipline Team</label>
                    {isTeamsLoading ? (
                        <div className="flex items-center py-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                            <span className="text-gray-600 dark:text-gray-400">Loading teams...</span>
                        </div>
                    ) : (
                        <select
                            id="disciplineTeam"
                            value={formData.disciplineTeamId || ""}
                            onChange={(e) => setFormData({ ...formData, disciplineTeamId: e.target.value ? Number(e.target.value) : null })}
                            className={inputStyles}
                        >
                            <option value="">No team selected</option>
                            {teams?.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name} {team.description ? `- ${team.description}` : ""}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Role (Read-only) */}
                <div>
                    <label className={labelStyles}>Role</label>
                    <div className={readOnlyStyles}>{user.role}</div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Role cannot be changed</p>
                </div>

                {/* Save Status */}
                {saveStatus === 'success' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                        <div className="text-sm text-green-600 dark:text-green-400">
                            Settings saved successfully!
                        </div>
                    </div>
                )}

                {saveStatus === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                        <div className="text-sm text-red-600 dark:text-red-400">
                            Failed to save settings. Please try again.
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                            </div>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>

            {/* Organization Settings Section (Admin Only) */}
            {authUser?.role === 'Admin' && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Organization Settings</h2>
                    <form onSubmit={handleOrganizationSubmit} className="space-y-6">
                        {/* Organization Name (Editable for Admins) */}
                        <div>
                            <label htmlFor="organizationName" className={labelStyles}>Organization Name</label>
                            {isOrganizationLoading ? (
                                <div className="flex items-center py-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Loading organization...</span>
                                </div>
                            ) : (
                                <input
                                    id="organizationName"
                                    type="text"
                                    value={organizationName}
                                    onChange={(e) => setOrganizationName(e.target.value)}
                                    className={inputStyles}
                                    required
                                    placeholder="Enter organization name"
                                />
                            )}
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Only admins can edit the organization name</p>
                        </div>

                        {/* Organization Save Status */}
                        {organizationSaveStatus === 'success' && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                                <div className="text-sm text-green-600 dark:text-green-400">
                                    Organization name updated successfully!
                                </div>
                            </div>
                        )}

                        {organizationSaveStatus === 'error' && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                                <div className="text-sm text-red-600 dark:text-red-400">
                                    Failed to update organization name. Please try again.
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSavingOrganization || isOrganizationLoading}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSavingOrganization ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </div>
                                ) : (
                                    'Save Organization Name'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Email Notification Preferences Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Email Notification Preferences (Coming Soon)</h2>
                <form onSubmit={handleEmailPrefsSubmit} className="space-y-6">
                    {/* Master Toggle */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <span className="text-base font-medium text-gray-900 dark:text-white">Enable Email Notifications</span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Master switch for all email notifications</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={emailPrefs.emailNotificationsEnabled}
                                onChange={(e) => {
                                    const enabled = e.target.checked;
                                    setEmailPrefs({
                                        ...emailPrefs,
                                        emailNotificationsEnabled: enabled,
                                        // If enabling master, enable all; if disabling master, disable all
                                        ...(enabled ? {
                                            emailWorkItemAssignment: true,
                                            emailWorkItemStatusChange: true,
                                            emailWorkItemComment: true,
                                            emailInvitation: true,
                                            emailApproachingDeadline: true,
                                        } : {
                                            emailWorkItemAssignment: false,
                                            emailWorkItemStatusChange: false,
                                            emailWorkItemComment: false,
                                            emailInvitation: false,
                                            emailApproachingDeadline: false,
                                        }),
                                    });
                                }}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                        </label>
                    </div>

                    {/* Individual Notification Types */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Work Item Assignments</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">When you're assigned to a work item</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={emailPrefs.emailWorkItemAssignment && emailPrefs.emailNotificationsEnabled}
                                onChange={(e) => setEmailPrefs({ ...emailPrefs, emailWorkItemAssignment: e.target.checked })}
                                disabled={!emailPrefs.emailNotificationsEnabled}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Status Changes</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">When a work item's status is updated</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={emailPrefs.emailWorkItemStatusChange && emailPrefs.emailNotificationsEnabled}
                                onChange={(e) => setEmailPrefs({ ...emailPrefs, emailWorkItemStatusChange: e.target.checked })}
                                disabled={!emailPrefs.emailNotificationsEnabled}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Comments</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">When someone comments on a work item</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={emailPrefs.emailWorkItemComment && emailPrefs.emailNotificationsEnabled}
                                onChange={(e) => setEmailPrefs({ ...emailPrefs, emailWorkItemComment: e.target.checked })}
                                disabled={!emailPrefs.emailNotificationsEnabled}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Invitations</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">When you receive an invitation to join</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={emailPrefs.emailInvitation && emailPrefs.emailNotificationsEnabled}
                                onChange={(e) => setEmailPrefs({ ...emailPrefs, emailInvitation: e.target.checked })}
                                disabled={!emailPrefs.emailNotificationsEnabled}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Approaching Deadlines</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Reminders for upcoming work item deadlines</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={emailPrefs.emailApproachingDeadline && emailPrefs.emailNotificationsEnabled}
                                onChange={(e) => setEmailPrefs({ ...emailPrefs, emailApproachingDeadline: e.target.checked })}
                                disabled={!emailPrefs.emailNotificationsEnabled}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Email Preferences Save Status */}
                    {emailPrefsSaveStatus === 'success' && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                            <div className="text-sm text-green-600 dark:text-green-400">
                                Email preferences saved successfully!
                            </div>
                        </div>
                    )}

                    {emailPrefsSaveStatus === 'error' && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                            <div className="text-sm text-red-600 dark:text-red-400">
                                Failed to save email preferences. Please try again.
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSavingEmailPrefs || isEmailPreferencesLoading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSavingEmailPrefs ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </div>
                            ) : (
                                'Save Email Preferences'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;