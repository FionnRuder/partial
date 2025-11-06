"use client";

import Header from '@/components/Header';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGetUserByIdQuery, useGetTeamsQuery, useUpdateUserMutation } from '@/state/api';

const Settings = () => {
    const { user: authUser, updateProfile } = useAuth();
    const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(authUser?.userId || 0, { skip: !authUser?.userId });
    const { data: teams, isLoading: isTeamsLoading } = useGetTeamsQuery();
    const [updateUser] = useUpdateUserMutation();

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        profilePictureUrl: '',
        disciplineTeamId: null as number | null,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Initialize form data when user data loads
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phoneNumber: user.phoneNumber || '',
                profilePictureUrl: user.profilePictureUrl || '',
                disciplineTeamId: user.disciplineTeamId || null,
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        setSaveStatus('idle');

        try {
            // Update via API
            await updateUser({
                userId: user.userId,
                data: {
                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                    profilePictureUrl: formData.profilePictureUrl || undefined,
                    disciplineTeamId: formData.disciplineTeamId || undefined,
                },
            }).unwrap();

            // Also update AuthContext
            await updateProfile({
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                profilePictureUrl: formData.profilePictureUrl || undefined,
                disciplineTeamId: formData.disciplineTeamId || undefined,
            });

            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Failed to update user:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } finally {
            setIsSaving(false);
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
                        onChange={(e) => setFormData({ ...formData, profilePictureUrl: e.target.value })}
                        className={inputStyles}
                        placeholder="https://example.com/profile.jpg"
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
        </div>
    );
};

export default Settings;