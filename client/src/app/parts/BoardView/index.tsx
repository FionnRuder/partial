import {
    useGetWorkItemsByPartQuery,
    useUpdateWorkItemStatusMutation,
    useGetCommentsByWorkItemQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    WorkItem as WorkItemType,
    Comment as CommentType,
} from '@/state/api';
import ModalEditWorkItem from '@/components/ModalEditWorkItem';
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { EllipsisVertical, MessageSquareMore, Plus, Calendar, Clock, Target, User, CheckCircle2, FileText, Tag } from 'lucide-react';
import { format } from "date-fns";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { skipToken } from '@reduxjs/toolkit/query';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/lib/toast';

type BoardProps = {
    id: string;
    setIsModalNewWorkItemOpen: (isOpen: boolean) => void;
    searchQuery: string;
    includeChildren: boolean;
};

const workItemStatus = ["ToDo", "WorkInProgress", "UnderReview", "Completed"];

// Helper function to filter work items based on search query
const filterWorkItemsBySearch = (workItems: WorkItemType[], searchQuery: string) => {
    if (!searchQuery.trim()) return workItems;
    
    const query = searchQuery.toLowerCase();
    return workItems.filter((item) => {
        return (
            item.title?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.tags?.toLowerCase().includes(query) ||
            item.workItemType?.toLowerCase().includes(query) ||
            item.status?.toLowerCase().includes(query) ||
            item.priority?.toLowerCase().includes(query)
        );
    });
};

const statusLabels: Record<string, string> = {
  ToDo: "To Do",
  WorkInProgress: "Work In Progress",
  UnderReview: "Under Review",
  Completed: "Completed"
};

// Helper function to format date without timezone conversion
// Extracts the date portion (YYYY-MM-DD) and parses it as a local date
const formatDateOnly = (dateString: string): string => {
  if (!dateString) return "";
  // Extract just the date portion (YYYY-MM-DD) from ISO string
  const dateOnly = dateString.split('T')[0];
  // Parse as local date to avoid timezone conversion
  const [year, month, day] = dateOnly.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return format(date, "P");
};

const BoardView = ({ id, setIsModalNewWorkItemOpen, searchQuery, includeChildren }: BoardProps) => {
    const { user: authUser } = useAuth();
    const {
        data: workItems,
        isLoading,
        error,
        refetch: refetchWorkItems,
    } = useGetWorkItemsByPartQuery({ partId: Number(id), includeChildren });
    const [updateWorkItemStatus, { error: statusUpdateError }] = useUpdateWorkItemStatusMutation();
    const [activeCommentsWorkItem, setActiveCommentsWorkItem] = useState<WorkItemType | null>(null);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [newCommentText, setNewCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingCommentText, setEditingCommentText] = useState("");

    const { data: comments = [], isFetching: isCommentsLoading, refetch: refetchComments } =
        useGetCommentsByWorkItemQuery(
            activeCommentsWorkItem ? activeCommentsWorkItem.id : skipToken
        );

    const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
    const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation();
    const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();

    const moveWorkItem = async (workItemId: number, toStatus: string) => {
        try {
            const result = await updateWorkItemStatus({ workItemId, status: toStatus });
            
            // Check if the result has an error
            if ("error" in result && result.error) {
                const error = result.error as any;
                
                // RTK Query error structure: error.data contains the response body
                const errorData = error.data;
                let errorMessage: string;
                
                if (errorData && typeof errorData === "object" && errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData && typeof errorData === "string") {
                    errorMessage = errorData;
                } else if (error?.message) {
                    errorMessage = error.message;
                } else {
                    errorMessage = "Failed to update work item status";
                }
                
                // Show toast with the error message directly (avoid passing error object)
                showToast.error(errorMessage);
                return;
            }
            
            // Success - refetch work items to update the board
            if ("data" in result) {
                refetchWorkItems();
            }
        } catch (error: any) {
            // This catch block handles errors from .unwrap() if used elsewhere
            // Try to extract error message from various structures
            const errorMessage = 
                error?.data?.message ||
                (error?.data && typeof error.data === "string" ? error.data : null) ||
                error?.message ||
                "Failed to update work item status";
            
            // Show toast with the error message directly
            showToast.error(errorMessage);
        }
    };

    const [editingWorkItem, setEditingWorkItem] = useState<WorkItemType | null>(null);

    // Filter work items based on search query
    const filteredWorkItems = filterWorkItemsBySearch(workItems || [], searchQuery);

    const resetCommentState = () => {
        setNewCommentText("");
        setEditingCommentId(null);
        setEditingCommentText("");
    };

    const handleOpenComments = (workItem: WorkItemType) => {
        setActiveCommentsWorkItem(workItem);
        setIsCommentsModalOpen(true);
        resetCommentState();
    };

    const handleCloseComments = () => {
        setIsCommentsModalOpen(false);
        setActiveCommentsWorkItem(null);
        resetCommentState();
    };

    const handleSubmitComment = async () => {
        if (!activeCommentsWorkItem || !authUser || !newCommentText.trim()) return;
        try {
            await createComment({
                workItemId: activeCommentsWorkItem.id,
                text: newCommentText.trim(),
                commenterUserId: authUser.id,
            }).unwrap();
            resetCommentState();
            await refetchComments();
            refetchWorkItems();
        } catch (error) {
            console.error("Failed to create comment:", error);
        }
    };

    const handleStartEdit = (comment: CommentType) => {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.text);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingCommentText("");
    };

    const handleSaveEdit = async () => {
        if (!activeCommentsWorkItem || editingCommentId === null || !authUser || !editingCommentText.trim()) return;
        try {
            await updateComment({
                workItemId: activeCommentsWorkItem.id,
                commentId: editingCommentId,
                text: editingCommentText.trim(),
                requesterUserId: authUser.id,
            }).unwrap();
            resetCommentState();
            await refetchComments();
            refetchWorkItems();
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    };

    const handleDeleteComment = async (comment: CommentType) => {
        if (!activeCommentsWorkItem || !authUser) return;
        if (!window.confirm("Delete this comment?")) return;
        try {
            await deleteComment({
                workItemId: activeCommentsWorkItem.id,
                commentId: comment.id,
                requesterUserId: authUser.id,
            }).unwrap();
            await refetchComments();
            refetchWorkItems();
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>An error occured while fetching work items</div>;

    return <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
            {workItemStatus.map((status) => (
                <WorkItemColumn
                    key={status}
                    status={status}
                    workItems={filteredWorkItems}
                    moveWorkItem={moveWorkItem}
                    setIsModalNewWorkItemOpen={setIsModalNewWorkItemOpen}
                    setEditingWorkItem={setEditingWorkItem}
                    onOpenComments={handleOpenComments}
                />
            ))}
        </div>
        {editingWorkItem && (
            <ModalEditWorkItem
                isOpen={!!editingWorkItem}
                onClose={() => setEditingWorkItem(null)}
                workItem={editingWorkItem}
            />
        )}
        <Modal
            isOpen={isCommentsModalOpen}
            onClose={handleCloseComments}
            name={activeCommentsWorkItem ? `${activeCommentsWorkItem.workItemType} Comments` : "Comments"}
        >
            {isCommentsLoading ? (
                <p className="text-sm text-gray-500 dark:text-neutral-400">Loading comments...</p>
            ) : (
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-neutral-400">No comments yet.</p>
                    ) : (
                        comments.map((comment) => {
                            const isOwnComment = authUser?.id === comment.commenterUserId;
                            const commenterName =
                                comment.commenterUser?.name ||
                                comment.commenterUser?.username ||
                                `User ${comment.commenterUserId}`;
                            const formattedDate = format(new Date(comment.dateCommented), "PPpp");

                            return (
                                <div key={comment.id} className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{commenterName}</p>
                                            <p className="text-xs text-gray-500 dark:text-neutral-400">{formattedDate}</p>
                                        </div>
                                        {isOwnComment && (
                                            <div className="flex gap-2 text-xs">
                                                <button
                                                    className="rounded-md border border-gray-300 px-2 py-1 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    onClick={() => handleStartEdit(comment)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="rounded-md border border-red-300 px-2 py-1 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                                                    onClick={() => handleDeleteComment(comment)}
                                                    disabled={isDeletingComment}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {editingCommentId === comment.id ? (
                                        <div className="mt-3 space-y-2">
                                            <textarea
                                                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-dark-secondary dark:text-white"
                                                rows={3}
                                                value={editingCommentText}
                                                onChange={(e) => setEditingCommentText(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                                    onClick={handleSaveEdit}
                                                    disabled={isUpdatingComment}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200">
                                            {comment.text}
                                        </p>
                                    )}
                                </div>
                            );
                        })
                    )}

                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Add a comment</h4>
                        {!authUser ? (
                            <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                                Sign in to add comments.
                            </p>
                        ) : (
                            <div className="mt-2 space-y-3">
                                <textarea
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-dark-secondary dark:text-white"
                                    rows={3}
                                    placeholder="Share an update..."
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                />
                                <div className="flex justify-end">
                                    <button
                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                        onClick={handleSubmitComment}
                                        disabled={isCreatingComment || !newCommentText.trim()}
                                    >
                                        {isCreatingComment ? "Posting..." : "Post Comment"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    </DndProvider>;
};

type WorkItemColumnProps = {
    status: string;
    workItems: WorkItemType[];
    moveWorkItem: (workItemId: number, toStatus: string) => void;
    setIsModalNewWorkItemOpen: (isOpen: boolean) => void;
    setEditingWorkItem: (workItem: WorkItemType | null) => void;
    onOpenComments: (workItem: WorkItemType) => void;
};

const WorkItemColumn = ({
    status,
    workItems,
    moveWorkItem,
    setIsModalNewWorkItemOpen,
    setEditingWorkItem,
    onOpenComments,
    }: WorkItemColumnProps) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "workItem",
        drop: (item: { id: number }) => moveWorkItem(item.id, status),
        collect: (monitor: any) => ({
        isOver: !!monitor.isOver(),
        }),
    }));

    const workItemCount = workItems.filter((workItem) => workItem.status === status).length;

    const statusColor: any = {
        "ToDo": "#2563EB",
        "WorkInProgress": "#059669",
        "UnderReview": "#D97706",
        "Completed": "#000000",
    }

    return (
        <div
            ref={(instance) => {
                drop(instance);
            }}
            className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
        >
            <div className="mb-3 flex w-full">
                <div 
                    className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
                    style={{ backgroundColor: statusColor[status] }}
                />
                <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
                    <h3 className="flex items-center text-lg font-semibold dark:text-white">
                        {statusLabels[status]}{" "}
                        <span
                            className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
                            style={{ width: "1.5rem", height: "1.5rem" }}
                        >
                            {workItemCount}
                        </span>
                    </h3>
                    <div className="flex items-center gap-1">
                        <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
                            <EllipsisVertical size={26} />
                        </button>
                        <button className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
                            onClick={() => setIsModalNewWorkItemOpen(true)}>
                                <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
            {workItems.filter((workItem) => workItem.status === status).map((workItem) => (
                <WorkItem
                    key={workItem.id}
                    workItem={workItem}
                    setEditingWorkItem={setEditingWorkItem}
                    onOpenComments={onOpenComments}
                />
            ))}
        </div>
    )

};

type WorkItemProps = {
    workItem: WorkItemType;
    setEditingWorkItem: (workItem: WorkItemType | null) => void;
    onOpenComments: (workItem: WorkItemType) => void;
};

const WorkItem = ({ workItem, setEditingWorkItem, onOpenComments }: WorkItemProps) => {
    const router = useRouter();
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "workItem",
        item: { id: workItem.id },
        collect: (monitor: any) => ({
        isDragging: !!monitor.isDragging(),
        }),
    }));

    const workItemTagsSplit = workItem.tags ? workItem.tags.split(",").map(t => t.trim()).filter(Boolean) : [];

    const formattedDateOpened = formatDateOnly(workItem.dateOpened);
    const formattedDueDate = formatDateOnly(workItem.dueDate);
    const formattedEstimatedCompletionDate = formatDateOnly(workItem.estimatedCompletionDate);
    const formattedActualCompletionDate = workItem.actualCompletionDate ? formatDateOnly(workItem.actualCompletionDate) : "";

    const numberOfComments = workItem.comments?.length ?? 0;
    const numberOfAttachments = workItem.attachments?.length ?? 0;

    const PriorityTag = ({ priority }: { priority: WorkItemType["priority"]}) => (
        <div
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                priority === "Urgent"
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                : priority === "High"
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                    : priority === "Medium"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : priority === "Low"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
        >
            {priority}
        </div>
    );

    const WorkItemTypeBadge = () => {
        const typeColors = {
            "Deliverable": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
            "Issue": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            "Task": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        };
        const typePrefix = workItem.workItemType === "Deliverable" ? "D" : workItem.workItemType === "Issue" ? "I" : "T";
        return (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[workItem.workItemType as keyof typeof typeColors] || typeColors.Task}`}>
                {typePrefix}{workItem.id}
            </span>
        );
    };

    // Truncate description
    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <div
            ref={(instance) => {
                drag(instance);
            }}
            className={`mb-3 rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-dark-secondary ${
                isDragging ? "opacity-50" : "opacity-100"
            }`}
        >
            <div className="p-4">
                {/* Header: Priority, Type Badge, and Menu */}
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        {workItem.priority && <PriorityTag priority={workItem.priority} />}
                        <WorkItemTypeBadge />
                    </div>
                    <button 
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-gray-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingWorkItem(workItem);
                        }}
                        title="More options"
                    >
                        <EllipsisVertical size={18} />
                    </button>
                </div>

                {/* Title */}
                <h4 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight dark:text-white">
                    <Link
                        href={`/work-items/${workItem.id}`}
                        className="text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {workItem.title}
                    </Link>
                </h4>

                {/* Progress Bar */}
                {typeof workItem.percentComplete === "number" && (
                    <div className="mb-3">
                        <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{workItem.percentComplete}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div 
                                className="h-full bg-blue-600 transition-all dark:bg-blue-500"
                                style={{ width: `${workItem.percentComplete}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Key Dates */}
                <div className="mb-3 space-y-1.5 text-xs">
                    {formattedEstimatedCompletionDate && (
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Target size={14} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
                            <span className="font-medium">Est. Completion:</span>
                            <span className="text-gray-700 dark:text-gray-300">{formattedEstimatedCompletionDate}</span>
                        </div>
                    )}
                    {formattedDueDate && (
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Calendar size={14} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
                            <span className="font-medium">Due:</span>
                            <span className="text-gray-700 dark:text-gray-300">{formattedDueDate}</span>
                        </div>
                    )}
                    {workItem.status === "Completed" && formattedActualCompletionDate && (
                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                            <CheckCircle2 size={14} className="flex-shrink-0" />
                            <span className="font-medium">Completed:</span>
                            <span>{formattedActualCompletionDate}</span>
                        </div>
                    )}
                </div>

                {/* Description (truncated) */}
                {workItem.description && (
                    <div className="mb-3">
                        <div className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                            <FileText size={14} className="mt-0.5 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                            <p className="line-clamp-2 leading-relaxed">{truncateText(workItem.description, 120)}</p>
                        </div>
                    </div>
                )}

                {/* Tags */}
                {workItemTagsSplit.length > 0 && (
                    <div className="mb-3 flex flex-wrap items-center gap-1.5">
                        <Tag size={12} className="text-gray-400 dark:text-gray-500" />
                        {workItemTagsSplit.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                            >
                                {tag}
                            </span>
                        ))}
                        {workItemTagsSplit.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-500">+{workItemTagsSplit.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Status (if not completed) */}
                {workItem.status !== "Completed" && workItem.inputStatus && (
                    <div className="mb-3 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Status: </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{workItem.inputStatus}</span>
                    </div>
                )}

                {/* Divider */}
                <div className="my-3 border-t border-gray-200 dark:border-gray-700" />

                {/* Footer: Users, Comments, Attachments */}
                <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[workItem.assigneeUser, workItem.authorUser].map((user, index) => {
                            if (!user) return null;

                            const uniqueKey = `${user.id}-${index}`;
                            const role = index === 0 ? "Assignee" : "Author";
                            const tooltip = `${role}: ${user.name || user.username}`;

                            return user.profilePictureUrl ? (
                                <button
                                    key={uniqueKey}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/users/${user.id}`);
                                    }}
                                    className="relative h-7 w-7 cursor-pointer overflow-hidden rounded-full border-2 border-white ring-1 ring-gray-200 transition-all hover:z-10 hover:ring-2 hover:ring-blue-500 dark:border-dark-secondary dark:ring-gray-700"
                                    title={tooltip}
                                >
                                    <Image
                                        src={user.profilePictureUrl ? `/images/${user.profilePictureUrl}` : '/placeholder.png'}
                                        alt={user.username}
                                        width={28}
                                        height={28}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ) : (
                                <button
                                    key={uniqueKey}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/users/${user.id}`);
                                    }}
                                    title={tooltip}
                                    className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-gray-300 to-gray-400 text-xs font-semibold text-white ring-1 ring-gray-200 transition-all hover:z-10 hover:ring-2 hover:ring-blue-500 dark:border-dark-secondary dark:from-gray-600 dark:to-gray-700 dark:ring-gray-700"
                                >
                                    {(() => {
                                        if (user.name) {
                                            const names = user.name.trim().split(" ").filter(Boolean);
                                            if (names.length >= 2) {
                                                return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
                                            }
                                            if (names.length === 1 && names[0].length > 0) {
                                                return names[0][0].toUpperCase();
                                            }
                                        }
                                        if (user.username) {
                                            return user.username.substring(0, 2).toUpperCase();
                                        }
                                        return "?";
                                    })()}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        {numberOfAttachments > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <FileText size={14} />
                                <span>{numberOfAttachments}</span>
                            </div>
                        )}
                        <button
                            type="button"
                            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenComments(workItem);
                            }}
                        >
                            <MessageSquareMore size={16} />
                            <span className="font-medium">{numberOfComments}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default BoardView;