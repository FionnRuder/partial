"use client";
import React, { useState } from "react";
import { useAppSelector } from "../../redux";
import Image from "next/image";
import Link from "next/link";
import {
  useGetWorkItemByIdQuery,
  useGetProgramsQuery,
  useGetCommentsByWorkItemQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetStatusLogsByWorkItemQuery,
  useCreateStatusLogMutation,
  useUpdateStatusLogMutation,
  useDeleteStatusLogMutation,
  useGetAttachmentsByWorkItemQuery,
  useCreateAttachmentMutation,
  useUpdateAttachmentMutation,
  useDeleteAttachmentMutation,
  Status,
  Priority,
  DeliverableTypeLabels,
  IssueTypeLabels,
  Part,
  Comment as CommentType,
  StatusLog as StatusLogType,
  Attachment,
} from "@/state/api";
import { format } from "date-fns";
import ModalEditWorkItem from "@/components/ModalEditWorkItem";
import { SquarePen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  params: Promise<{ id: string }>;
};

const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.ToDo:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    case Status.WorkInProgress:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case Status.UnderReview:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case Status.Completed:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.Urgent:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case Priority.High:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case Priority.Medium:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case Priority.Low:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case Priority.Backlog:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

// Get user initials from name (first letter of first name and first letter of last name)
const getUserInitials = (user: { name?: string; username?: string } | null | undefined): string => {
  if (!user) return '?';
  
  if (user.name) {
    const names = user.name.trim().split(' ').filter(Boolean);
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    // If only one name, take the first letter
    if (names.length === 1 && names[0].length > 0) {
      return names[0][0].toUpperCase();
    }
  }
  
  // Fallback to username if name is not available
  if (user.username) {
    return user.username.substring(0, 2).toUpperCase();
  }
  
  return '?';
};

const WorkItemDetailPage = ({ params }: Props) => {
  const { id } = React.use(params);
  const workItemId = Number(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [newStatusText, setNewStatusText] = useState("");
  const [editingStatusLogId, setEditingStatusLogId] = useState<number | null>(null);
  const [editingStatusText, setEditingStatusText] = useState("");
  const [newAttachmentFileUrl, setNewAttachmentFileUrl] = useState("");
  const [newAttachmentFileName, setNewAttachmentFileName] = useState("");
  const [editingAttachmentId, setEditingAttachmentId] = useState<number | null>(null);
  const [editingAttachmentFileName, setEditingAttachmentFileName] = useState("");
  const [editingAttachmentFileUrl, setEditingAttachmentFileUrl] = useState("");

  const { data: workItem, isLoading, isError, refetch: refetchWorkItem } = useGetWorkItemByIdQuery(workItemId);
  const { data: programs = [] } = useGetProgramsQuery();
  const { data: comments = [], isFetching: isCommentsLoading, refetch: refetchComments } = useGetCommentsByWorkItemQuery(workItemId);
  const { data: statusLogs = [], isFetching: isStatusLogsLoading, refetch: refetchStatusLogs } = useGetStatusLogsByWorkItemQuery(workItemId);
  const { data: attachments = [], isFetching: isAttachmentsLoading, refetch: refetchAttachments } = useGetAttachmentsByWorkItemQuery(workItemId);
  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();
  const [createStatusLog, { isLoading: isCreatingStatusLog }] = useCreateStatusLogMutation();
  const [updateStatusLog, { isLoading: isUpdatingStatusLog }] = useUpdateStatusLogMutation();
  const [deleteStatusLog, { isLoading: isDeletingStatusLog }] = useDeleteStatusLogMutation();
  const [createAttachment, { isLoading: isCreatingAttachment }] = useCreateAttachmentMutation();
  const [updateAttachment, { isLoading: isUpdatingAttachment }] = useUpdateAttachmentMutation();
  const [deleteAttachment, { isLoading: isDeletingAttachment }] = useDeleteAttachmentMutation();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { user: authUser } = useAuth();

  const resetCommentState = () => {
    setNewCommentText("");
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const resetStatusLogState = () => {
    setNewStatusText("");
    setEditingStatusLogId(null);
    setEditingStatusText("");
  };

  const handleSubmitComment = async () => {
    if (!authUser || !newCommentText.trim()) return;
    try {
      await createComment({
        workItemId,
        text: newCommentText.trim(),
        commenterUserId: authUser.id,
      }).unwrap();
      resetCommentState();
      await refetchComments();
      refetchWorkItem();
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
    if (editingCommentId === null || !authUser || !editingCommentText.trim()) return;
    try {
      await updateComment({
        workItemId,
        commentId: editingCommentId,
        text: editingCommentText.trim(),
        requesterUserId: authUser.id,
      }).unwrap();
      resetCommentState();
      await refetchComments();
      refetchWorkItem();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (comment: CommentType) => {
    if (!authUser) return;
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment({
        workItemId,
        commentId: comment.id,
        requesterUserId: authUser.id,
      }).unwrap();
      await refetchComments();
      refetchWorkItem();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleSubmitStatusLog = async () => {
    if (!authUser || !newStatusText.trim()) return;
    try {
      await createStatusLog({
        workItemId,
        status: newStatusText.trim(),
        engineerUserId: authUser.id,
      }).unwrap();
      resetStatusLogState();
      await refetchStatusLogs();
      refetchWorkItem();
    } catch (error) {
      console.error("Failed to create status log:", error);
    }
  };

  const handleStartEditStatusLog = (statusLog: StatusLogType) => {
    setEditingStatusLogId(statusLog.id);
    setEditingStatusText(statusLog.status);
  };

  const handleCancelEditStatusLog = () => {
    setEditingStatusLogId(null);
    setEditingStatusText("");
  };

  const handleSaveEditStatusLog = async () => {
    if (editingStatusLogId === null || !authUser || !editingStatusText.trim()) return;
    try {
      await updateStatusLog({
        workItemId,
        statusLogId: editingStatusLogId,
        status: editingStatusText.trim(),
        requesterUserId: authUser.id,
      }).unwrap();
      resetStatusLogState();
      await refetchStatusLogs();
      refetchWorkItem();
    } catch (error) {
      console.error("Failed to update status log:", error);
    }
  };

  const handleDeleteStatusLog = async (statusLog: StatusLogType) => {
    if (!authUser) return;
    if (!window.confirm("Delete this status update?")) return;
    try {
      await deleteStatusLog({
        workItemId,
        statusLogId: statusLog.id,
        requesterUserId: authUser.id,
      }).unwrap();
      await refetchStatusLogs();
      refetchWorkItem();
    } catch (error) {
      console.error("Failed to delete status log:", error);
    }
  };

  const handleSubmitAttachment = async () => {
    if (!authUser || !newAttachmentFileUrl.trim() || !newAttachmentFileName.trim()) return;
    try {
      await createAttachment({
        workItemId,
        fileUrl: newAttachmentFileUrl.trim(),
        fileName: newAttachmentFileName.trim(),
        uploadedByUserId: authUser.id,
      }).unwrap();
      setNewAttachmentFileUrl("");
      setNewAttachmentFileName("");
      await refetchAttachments();
      refetchWorkItem();
    } catch (error) {
      console.error("Failed to create attachment:", error);
    }
  };

  const handleStartEditAttachment = (attachment: Attachment) => {
    setEditingAttachmentId(attachment.id);
    setEditingAttachmentFileName(attachment.fileName);
    setEditingAttachmentFileUrl(attachment.fileUrl);
  };

  const handleCancelEditAttachment = () => {
    setEditingAttachmentId(null);
    setEditingAttachmentFileName("");
    setEditingAttachmentFileUrl("");
  };

  const handleSaveEditAttachment = async () => {
    if (editingAttachmentId === null || !authUser || !editingAttachmentFileName.trim() || !editingAttachmentFileUrl.trim()) return;
    try {
      await updateAttachment({
        workItemId,
        attachmentId: editingAttachmentId,
        fileName: editingAttachmentFileName.trim(),
        fileUrl: editingAttachmentFileUrl.trim(),
        requesterUserId: authUser.id,
      }).unwrap();
      setEditingAttachmentId(null);
      setEditingAttachmentFileName("");
      setEditingAttachmentFileUrl("");
      await refetchAttachments();
      refetchWorkItem();
    } catch (error) {
      console.error("Failed to update attachment:", error);
    }
  };

  const handleDeleteAttachment = async (attachment: Attachment) => {
    if (!authUser) return;
    if (!window.confirm("Delete this attachment?")) return;
    try {
      await deleteAttachment({
        workItemId,
        attachmentId: attachment.id,
        requesterUserId: authUser.id,
      }).unwrap();
      await refetchAttachments();
      refetchWorkItem();
    } catch (error) {
      console.error("Failed to delete attachment:", error);
    }
  };

  if (isLoading) return <div className="p-8">Loading work item...</div>;
  if (isError || !workItem) return <div className="p-8">Error loading work item or work item not found</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <ModalEditWorkItem
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        workItem={workItem}
      />

      {/* Header with Work Item Type and Title */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold dark:text-white">
              {workItem.title}
            </h1>            
            <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold leading-5 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {workItem.workItemType}
            </span>
          </div>
          <h2 className="text-lg font-medium text-gray-600 dark:text-gray-400 ml-0 mt-1">
            ID: {workItem.workItemType === "Deliverable"
              ? "D"
              : workItem.workItemType === "Issue"
              ? "I"
              : "T"}{workItem.id}
          </h2>
        </div>
        
        {/* Edit Button */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center rounded-md bg-gray-300 px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-dark-tertiary dark:text-white dark:hover:bg-gray-600"
        >
          <SquarePen className="mr-2 h-4 w-4" />
          Edit Work Item
        </button>
      </div>

      {/* Main Information */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <h3 className="mb-4 text-lg font-semibold dark:text-white">Work Item Details</h3>
        
        {/* Description */}
        {workItem.description && (
          <div className="mb-6">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Description:</span>
            <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">{workItem.description}</p>
          </div>
        )}

        {/* Root Cause and Corrective Action - only show if issue */}
        {workItem.issueDetail && (workItem.issueDetail.rootCause || workItem.issueDetail.correctiveAction) && (
          <div className="mb-6 space-y-4">
            {workItem.issueDetail.rootCause && (
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Root Cause:</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                  {workItem.issueDetail.rootCause}
                </p>
              </div>
            )}

            {workItem.issueDetail.correctiveAction && (
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Corrective Action:</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                  {workItem.issueDetail.correctiveAction}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deliverable Type - only show if deliverable */}
          {workItem.deliverableDetail && (
            <div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Deliverable Type:</span>
              <p className="text-gray-900 dark:text-gray-100 mt-1">
                {(() => {
                  const type = workItem.deliverableDetail.deliverableType;
                  if (typeof type === 'string') {
                    return DeliverableTypeLabels[type] || type;
                  }
                  if (type && typeof type === 'object' && 'name' in type) {
                    const typeName = (type as { name: string }).name;
                    return DeliverableTypeLabels[typeName] || typeName;
                  }
                  return 'Unknown';
                })()}
              </p>
            </div>
          )}

          {/* Issue Type - only show if issue */}
          {workItem.issueDetail && (
            <div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Issue Type:</span>
              <p className="text-gray-900 dark:text-gray-100 mt-1">
                {(() => {
                  const type = workItem.issueDetail.issueType;
                  if (typeof type === 'string') {
                    return IssueTypeLabels[type] || type;
                  }
                  if (type && typeof type === 'object' && 'name' in type) {
                    const typeName = (type as { name: string }).name;
                    return IssueTypeLabels[typeName] || typeName;
                  }
                  return 'Unknown';
                })()}
              </p>
            </div>
          )}
          {/* Status */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status:</span>
            <div className="mt-1">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5 ${getStatusColor(workItem.status)}`}>
                {workItem.status}
              </span>
            </div>
          </div>

          {/* Priority */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Priority:</span>
            <div className="mt-1">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5 ${getPriorityColor(workItem.priority)}`}>
                {workItem.priority}
              </span>
            </div>
          </div>

          {/* Tags */}
          {workItem.tags && (
            <div className="md:col-span-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Tags:</span>
              <p className="text-gray-900 dark:text-gray-100 mt-1">{workItem.tags}</p>
            </div>
          )}

          {/* Date Opened */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Date Opened:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">
              {format(new Date(workItem.dateOpened), "PPP")}
            </p>
          </div>

          {/* Due Date */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Due Date:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">
              {format(new Date(workItem.dueDate), "PPP")}
            </p>
          </div>

          {/* Estimated Completion Date */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Estimated Completion Date:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">
              {format(new Date(workItem.estimatedCompletionDate), "PPP")}
            </p>
          </div>

          {/* Actual Completion Date */}
          {workItem.actualCompletionDate && (
            <div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Actual Completion Date:</span>
              <p className="text-gray-900 dark:text-gray-100 mt-1">
                {format(new Date(workItem.actualCompletionDate), "PPP")}
              </p>
            </div>
          )}

          {/* Percent Complete */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Progress:</span>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${workItem.percentComplete}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{workItem.percentComplete}%</p>
            </div>
          </div>

          {/* Program */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Program:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">
              {workItem.program?.name || "N/A"}
            </p>
          </div>

          {/* Due By Milestone */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Due By Milestone:</span>
            <p className="text-gray-900 dark:text-gray-100 mt-1">
              {workItem.dueByMilestone?.name || "N/A"}
            </p>
            {workItem.dueByMilestone && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {format(new Date(workItem.dueByMilestone.date), "PPP")}
              </p>
            )}
          </div>

          {/* Author */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Author:</span>
            {workItem.authorUser ? (
              <Link 
                href={`/users/${workItem.authorUser.id}`}
                className="flex items-center gap-3 mt-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                {workItem.authorUser.profilePictureUrl ? (
                  <Image
                    src={workItem.authorUser.profilePictureUrl ? `/images/${workItem.authorUser.profilePictureUrl}` : '/placeholder.png'}
                    alt={workItem.authorUser.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
                    {getUserInitials(workItem.authorUser)}
                  </div>
                )}
                <div>
                  <p className="text-gray-900 dark:text-gray-100">
                    {workItem.authorUser.name || workItem.authorUser.username || "Unknown"}
                  </p>
                  {workItem.authorUser.email && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{workItem.authorUser.email}</p>
                  )}
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
                  ?
                </div>
                <div>
                  <p className="text-gray-900 dark:text-gray-100">Unknown</p>
                </div>
              </div>
            )}
          </div>

          {/* Assignee */}
          <div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Assignee:</span>
            {workItem.assigneeUser ? (
              <Link 
                href={`/users/${workItem.assigneeUser.id}`}
                className="flex items-center gap-3 mt-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                {workItem.assigneeUser.profilePictureUrl ? (
                  <Image
                    src={workItem.assigneeUser.profilePictureUrl ? `/images/${workItem.assigneeUser.profilePictureUrl}` : '/placeholder.png'}
                    alt={workItem.assigneeUser.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
                    {getUserInitials(workItem.assigneeUser)}
                  </div>
                )}
                <div>
                  <p className="text-gray-900 dark:text-gray-100">
                    {workItem.assigneeUser.name || workItem.assigneeUser.username || "Unassigned"}
                  </p>
                  {workItem.assigneeUser.email && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{workItem.assigneeUser.email}</p>
                  )}
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
                  ?
                </div>
                <div>
                  <p className="text-gray-900 dark:text-gray-100">Unassigned</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Log */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">Status Log</h3>
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            {statusLogs.length} {statusLogs.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {isStatusLogsLoading ? (
          <p className="text-sm text-gray-500 dark:text-neutral-400">Loading status logs...</p>
        ) : statusLogs.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-neutral-400">No status logs yet.</p>
        ) : (
          <div className="space-y-4">
            {statusLogs.map((statusLog) => {
              const isOwnStatusLog = authUser?.id === statusLog.engineerUserId;
              const engineerName =
                statusLog.engineerUser?.name ||
                statusLog.engineerUser?.username ||
                `User ${statusLog.engineerUserId}`;
              const formattedDate = format(new Date(statusLog.dateLogged), "PPpp");

              return (
                <div key={statusLog.id} className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{engineerName}</p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">{formattedDate}</p>
                    </div>
                    {isOwnStatusLog && (
                      <div className="flex gap-2 text-xs">
                        <button
                          className="rounded-md border border-gray-300 px-2 py-1 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={() => handleStartEditStatusLog(statusLog)}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-md border border-red-300 px-2 py-1 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                          onClick={() => handleDeleteStatusLog(statusLog)}
                          disabled={isDeletingStatusLog}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  {editingStatusLogId === statusLog.id ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-dark-secondary dark:text-white"
                        rows={3}
                        value={editingStatusText}
                        onChange={(e) => setEditingStatusText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                          onClick={handleSaveEditStatusLog}
                          disabled={isUpdatingStatusLog}
                        >
                          Save
                        </button>
                        <button
                          className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={handleCancelEditStatusLog}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200">
                      {statusLog.status}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Add a status update</h4>
          {!authUser ? (
            <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
              Sign in to add status updates.
            </p>
          ) : (
            <div className="mt-2 space-y-3">
              <textarea
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-dark-secondary dark:text-white"
                rows={3}
                placeholder="Provide a status update..."
                value={newStatusText}
                onChange={(e) => setNewStatusText(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleSubmitStatusLog}
                  disabled={isCreatingStatusLog || !newStatusText.trim()}
                >
                  {isCreatingStatusLog ? "Posting..." : "Post Status Update"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Parts */}
      {(workItem.partNumbers?.length ?? 0) > 0 && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white">Associated Parts</h3>
            <span className="text-sm text-gray-500 dark:text-neutral-400">
              {workItem.partNumbers?.length ?? 0}{" "}
              {(workItem.partNumbers?.length ?? 0) === 1 ? "part" : "parts"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workItem.partNumbers?.map((link) => {
              const part = link.part as Part | undefined;
              const programName =
                part?.program?.name ??
                programs.find((program) => program.id === part?.programId)?.name ??
                "N/A";

              return (
                <a
                  key={link.id}
                  href={part ? `/parts/${part.id}` : "#"}
                  className={`group flex flex-col rounded-md border border-gray-200 p-4 shadow-sm transition hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:bg-dark-tertiary dark:hover:border-blue-400 ${
                    part ? "" : "pointer-events-none opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 transition group-hover:text-blue-600 dark:text-white">
                        {part ? `${part.partName} (${part.code})` : "Unknown Part"}
                      </h4>
                    </div>
                    {part?.state && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                        {part.state}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-gray-500 dark:text-neutral-400">
                    <p>Program: {programName}</p>
                    <p>Level: {part?.level ?? "N/A"}</p>
                    <p>Revision: {part?.revisionLevel ?? "N/A"}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Attachments */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">Attachments</h3>
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            {attachments.length}{" "}
            {attachments.length === 1 ? "attachment" : "attachments"}
          </span>
        </div>

        {isAttachmentsLoading ? (
          <p className="text-sm text-gray-500 dark:text-neutral-400">Loading attachments...</p>
        ) : attachments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-neutral-400">No attachments yet.</p>
        ) : (
          <div className="space-y-3">
            {attachments.map((attachment: Attachment) => {
              const isOwnAttachment = authUser?.id === attachment.uploadedByUserId;
              const uploaderName =
                attachment.uploadedByUser?.name ||
                attachment.uploadedByUser?.username ||
                `User ${attachment.uploadedByUserId}`;
              const formattedDate = format(new Date(attachment.dateAttached), "PPpp");
              const fileUrl = attachment.fileUrl.startsWith('http') 
                ? attachment.fileUrl 
                : `/images/${attachment.fileUrl}`;

              return (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingAttachmentId === attachment.id ? (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              File Name
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-dark-secondary dark:text-white"
                              value={editingAttachmentFileName}
                              onChange={(e) => setEditingAttachmentFileName(e.target.value)}
                              placeholder="File name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              File URL
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-dark-secondary dark:text-white"
                              value={editingAttachmentFileUrl}
                              onChange={(e) => setEditingAttachmentFileUrl(e.target.value)}
                              placeholder="File URL"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                              onClick={handleSaveEditAttachment}
                              disabled={isUpdatingAttachment || !editingAttachmentFileName.trim() || !editingAttachmentFileUrl.trim()}
                            >
                              Save
                            </button>
                            <button
                              className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                              onClick={handleCancelEditAttachment}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate block"
                          >
                            {attachment.fileName}
                          </a>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
                            <span>Uploaded by {uploaderName}</span>
                            <span>•</span>
                            <span>{formattedDate}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {editingAttachmentId !== attachment.id && (
                    <div className="ml-4 flex items-center gap-2 flex-shrink-0">
                      {isOwnAttachment && (
                        <>
                          <button
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            onClick={() => handleStartEditAttachment(attachment)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-md border border-red-300 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                            onClick={() => handleDeleteAttachment(attachment)}
                            disabled={isDeletingAttachment}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Add an attachment</h4>
          {!authUser ? (
            <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
              Sign in to add attachments.
            </p>
          ) : (
            <div className="mt-2 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File URL
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-dark-secondary dark:text-white"
                  placeholder="https://example.com/file.pdf or S3 path"
                  value={newAttachmentFileUrl}
                  onChange={(e) => setNewAttachmentFileUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-dark-secondary dark:text-white"
                  placeholder="document.pdf"
                  value={newAttachmentFileName}
                  onChange={(e) => setNewAttachmentFileName(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleSubmitAttachment}
                  disabled={isCreatingAttachment || !newAttachmentFileUrl.trim() || !newAttachmentFileName.trim()}
                >
                  {isCreatingAttachment ? "Adding..." : "Add Attachment"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">Comments</h3>
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
        </div>

        {isCommentsLoading ? (
          <p className="text-sm text-gray-500 dark:text-neutral-400">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-neutral-400">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
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
            })}
          </div>
        )}

        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
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
    </div>
  );
};

export default WorkItemDetailPage;
