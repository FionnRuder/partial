"use client";

import React, { useState } from 'react';
import Modal from '../Modal';
import { useCreateFeedbackMutation, Priority } from '@/state/api';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const ModalFeedback = ({ isOpen, onClose }: Props) => {
    const [createFeedback, { isLoading }] = useCreateFeedbackMutation();
    const [formData, setFormData] = useState({
        type: 'bug' as 'bug' | 'feature' | 'improvement',
        title: '',
        description: '',
        priority: Priority.Medium as Priority,
    });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.description.trim()) {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 3000);
            return;
        }

        try {
            await createFeedback({
                type: formData.type,
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
            }).unwrap();

            setSubmitStatus('success');
            // Reset form
            setFormData({
                type: 'bug',
                title: '',
                description: '',
                priority: Priority.Medium,
            });
            
            // Close modal after 2 seconds
            setTimeout(() => {
                onClose();
                setSubmitStatus('idle');
            }, 2000);
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 3000);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                type: 'bug',
                title: '',
                description: '',
                priority: Priority.Medium,
            });
            setSubmitStatus('idle');
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} name="Submit Feedback">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Feedback Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type
                    </label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'bug' | 'feature' | 'improvement' })}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="bug">🐛 Bug Report</option>
                        <option value="feature">✨ Feature Request</option>
                        <option value="improvement">💡 Improvement Suggestion</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {formData.type === 'bug' && 'Report a bug or issue you encountered'}
                        {formData.type === 'feature' && 'Suggest a new feature you\'d like to see'}
                        {formData.type === 'improvement' && 'Suggest an improvement to existing functionality'}
                    </p>
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority
                    </label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value={Priority.Urgent}>🔴 Urgent</option>
                        <option value={Priority.High}>🟠 High</option>
                        <option value={Priority.Medium}>🟡 Medium</option>
                        <option value={Priority.Low}>🟢 Low</option>
                        <option value={Priority.Backlog}>⚪ Backlog</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        How important is this feedback to you?
                    </p>
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief summary of your feedback"
                        required
                        maxLength={200}
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Provide detailed information about your feedback..."
                        rows={6}
                        required
                        maxLength={2000}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {formData.description.length}/2000 characters
                    </p>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                        <div className="text-sm text-green-600 dark:text-green-400">
                            ✓ Feedback submitted successfully! Thank you for your input.
                        </div>
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                        <div className="text-sm text-red-600 dark:text-red-400">
                            Failed to submit feedback. Please try again.
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Submitting...
                            </div>
                        ) : (
                            'Submit Feedback'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ModalFeedback;

