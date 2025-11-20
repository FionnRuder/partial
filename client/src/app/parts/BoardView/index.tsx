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
import { EllipsisVertical, MessageSquareMore, Plus } from 'lucide-react';
import { format } from "date-fns";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { skipToken } from '@reduxjs/toolkit/query';
import { useAuth } from '@/contexts/AuthContext';

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

const BoardView = ({ id, setIsModalNewWorkItemOpen, searchQuery, includeChildren }: BoardProps) => {
    const { user: authUser } = useAuth();
    const {
        data: workItems,
        isLoading,
        error,
        refetch: refetchWorkItems,
    } = useGetWorkItemsByPartQuery({ partId: Number(id), includeChildren });
    const [updateWorkItemStatus] = useUpdateWorkItemStatusMutation();
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

    const moveWorkItem = (workItemId: number, toStatus: string) => {
        updateWorkItemStatus({ workItemId, status: toStatus })
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
                commenterUserId: authUser.userId,
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
                requesterUserId: authUser.userId,
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
                requesterUserId: authUser.userId,
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
                            const isOwnComment = authUser?.userId === comment.commenterUserId;
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

    const workItemTagsSplit = workItem.tags ? workItem.tags.split(",") : [];

    const formattedDateOpened = workItem.dateOpened
        ? format(new Date(workItem.dateOpened), "P")
        : "";
    const formattedDueDate = workItem.dueDate
        ? format(new Date(workItem.dueDate), "P")
        : "";
    const formattedEstimatedCompletionDate = workItem.estimatedCompletionDate
        ? format(new Date(workItem.estimatedCompletionDate), "P")
        : "";
    const formattedActualCompletionDate = workItem.actualCompletionDate
        ? format(new Date(workItem.actualCompletionDate), "P")
        : "";

    const numberOfComments = workItem.comments?.length ?? 0;

    const PriorityTag = ({ priority }: { priority: WorkItemType["priority"]}) => (
        <div
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                priority === "Urgent"
                ? "bg-red-200 text-red-700"
                : priority === "High"
                    ? "bg-yellow-200 text-yellow-700"
                    : priority === "Medium"
                    ? "bg-green-200 text-green-700"
                    : priority === "Low"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-gray-200 text-gray-700"
            }`}
        >
            {priority}
        </div>
    );

    return (
        <div
            ref={(instance) => {
                drag(instance);
            }}
            className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
                isDragging ? "opacity-50" : "opacity-100"
            }`}
        >
            
            <div className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        {workItem.priority && <PriorityTag priority={workItem.priority} />}
                        <div className="flex gap-2">
                            {workItemTagsSplit.map((tag) => (
                                <div
                                    key={tag}
                                    className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                                >
                                    {" "}
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button 
                        className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500"
                        onClick={() => setEditingWorkItem(workItem)}
                        >
                        <EllipsisVertical size={26} />
                    </button>
                </div>

                <div className="mt-3 mb-1 flex justify-between">
                    <h4 className="text-md font-bold dark:text-white">
                        <Link
                            href={`/work-items/${workItem.id}`}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                            {workItem.title}
                        </Link>
                    </h4>
                    {typeof workItem.percentComplete === "number" && (
                        <div className="whitespace-nowrap text-xs font-semibold dark:text-white">
                            {workItem.percentComplete}%
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-neutral-500">
                    <span>{workItem.workItemType}</span>
                    <span>
                        {workItem.workItemType === "Deliverable"
                            ? "D"
                            : workItem.workItemType === "Issue"
                                ? "I"
                                : "T"}{workItem.id}
                    </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-neutral-500">
                    {formattedDateOpened && <span>{formattedDateOpened} (opened) - </span>}
                    {formattedDueDate && <span>{formattedDueDate} (due)</span>}
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-500">
                    Description: {workItem.description}
                </p>
                {workItem.workItemType === "Issue" && workItem.issueDetail && (
                    <div className="text-xs text-gray-500 dark:text-neutral-500">
                        {workItem.issueDetail.rootCause && (
                            <p>
                                <span>Root Cause:</span>{" "}
                                {workItem.issueDetail.rootCause}
                            </p>
                        )}
                        {workItem.issueDetail.correctiveAction && (
                            <p>
                                <span>Corrective Action:</span>{" "}
                                {workItem.issueDetail.correctiveAction}
                            </p>
                        )}
                    </div>
                )}
                <div className="text-xs text-gray-500 dark:text-neutral-500">
                    {formattedEstimatedCompletionDate && <span>Estimated Completion Date: {formattedEstimatedCompletionDate}</span>}
                </div>
                {workItem.status === "Completed" && (
                    <div className="text-xs text-gray-500 dark:text-neutral-500">
                        <p>
                            <span>Actual Completion Date:</span>{" "}
                            {formattedActualCompletionDate}
                        </p>
                    </div>
                )}
                {workItem.status !== "Completed" && (
                    <p className="text-xs text-gray-500 dark:text-neutral-500">
                        Current Status: {workItem.inputStatus}
                    </p>
                )}
                {workItem.attachments && workItem.attachments.length > 0 && (
                // <Image
                //     src={`https://partial-s3-images.s3.us-east-1.amazonaws.com/${workItem.attachments[0].fileUrl}`}
                //     alt={workItem.attachments[0].fileName}
                //     width={400}
                //     height={200}
                //     className="h-auto w-full rounded-t-md"
                // />
                    <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-neutral-500">
                        <Link href={`/${workItem.attachments[0].fileUrl}`}>
                            {workItem.attachments[0].fileName}
                        </Link>
                    </div>
                )}
                <div className="mt-4 border-t border-gray-200 dark-border-stroke-dark" />

                {/* USERS */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex -space-x-[6px] overflow-hidden">
                        {[workItem.assigneeUser, workItem.authorUser].map((user, index) => {
                            if (!user) return null;

                            const uniqueKey = `${user.userId}-${index}`;
                            const role = index === 0 ? "Assignee" : "Author"; // Determine role
                            const tooltip = `${role}: ${user.name}`;

                            return user.profilePictureUrl ? (
                                <button
                                    key={uniqueKey}
                                    onClick={() => router.push(`/users/${user.userId}`)}
                                    className="cursor-pointer"
                                >
                                    <Image
                                        src={`https://partial-s3-images.s3.us-east-1.amazonaws.com/${user.profilePictureUrl}`}
                                        alt={user.username}
                                        title={tooltip}  // <-- tooltip on hover
                                        width={30}
                                        height={30}
                                        className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                                    />
                                </button>
                            ) : (
                                <button
                                    key={uniqueKey}
                                    onClick={() => router.push(`/users/${user.userId}`)}
                                    title={tooltip}  // <-- tooltip on hover
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-gray-300 text-xs font-medium text-gray-600 dark:border-dark-secondary"
                                >
                                    {(() => {
                                        // Get initials from name (first letter of first name and first letter of last name)
                                        if (user.name) {
                                            const names = user.name.trim().split(" ").filter(Boolean);
                                            if (names.length >= 2) {
                                                return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
                                            }
                                            if (names.length === 1 && names[0].length > 0) {
                                                return names[0][0].toUpperCase();
                                            }
                                        }
                                        // Fallback to username if name is not available
                                        if (user.username) {
                                            return user.username.substring(0, 2).toUpperCase();
                                        }
                                        return "?";
                                    })()}
                                </button>
                            );
                        })}
                    </div>

                    {/* Comments */}
                    <button
                        type="button"
                        className="flex items-center text-gray-500 hover:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-400"
                        onClick={() => onOpenComments(workItem)}
                    >
                        <MessageSquareMore size={20} />
                        <span className="ml-1 text-sm dark:text-neutral-400">
                            {numberOfComments}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
};

export default BoardView;