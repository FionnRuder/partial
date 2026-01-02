import { WorkItem, StatusLabels, DeliverableTypeLabels, IssueTypeLabels } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  workItem: WorkItem;
};

// Helper function to format date without timezone conversion
// Extracts the date portion (YYYY-MM-DD) and parses it as a local date
const formatDateOnly = (dateString: string): string => {
  if (!dateString) return "N/A";
  // Extract just the date portion (YYYY-MM-DD) from ISO string
  const dateOnly = dateString.split('T')[0];
  // Parse as local date to avoid timezone conversion
  const [year, month, day] = dateOnly.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return format(date, "P");
};

const WorkItemCard = ({ workItem }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/work-items/${workItem.id}`);
  };

  return (
    <div 
      className="rounded border border-gray-200 p-4 shadow cursor-pointer hover:shadow-lg transition-shadow dark:border-gray-700 dark:bg-dark-secondary"
      onClick={handleClick}
    >
      {/* Header Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg dark:text-white">{workItem.title}</h3>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {workItem.workItemType}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          ID: {workItem.workItemType === "Deliverable"
            ? "D"
            : workItem.workItemType === "Issue"
            ? "I"
            : "T"}{workItem.id}
        </p>
      </div>

      {/* Description */}
      {workItem.description && (
        <div className="mb-3 rounded bg-gray-50 p-3 dark:bg-dark-tertiary">
          <p className="text-sm dark:text-gray-200">{workItem.description}</p>
        </div>
      )}

      {/* Main Details */}
      <div className="space-y-2 text-sm dark:text-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium dark:text-gray-300">Status:</span> {StatusLabels[workItem.status]}
          </div>
          <div>
            <span className="font-medium dark:text-gray-300">Priority:</span> {workItem.priority}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium dark:text-gray-300">Date Opened:</span> {formatDateOnly(workItem.dateOpened)}
          </div>
          <div>
            <span className="font-medium dark:text-gray-300">Due Date:</span> {formatDateOnly(workItem.dueDate)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium dark:text-gray-300">Est. Completion:</span> {formatDateOnly(workItem.estimatedCompletionDate)}
          </div>
          {workItem.actualCompletionDate && (
            <div>
              <span className="font-medium dark:text-gray-300">Actual Completion:</span> {formatDateOnly(workItem.actualCompletionDate)}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium dark:text-gray-300">Progress:</span> {workItem.percentComplete}%
          </div>
          <div>
            <span className="font-medium dark:text-gray-300">Input Status:</span> {workItem.inputStatus}
          </div>
        </div>

        {workItem.tags && (
          <div>
            <span className="font-medium dark:text-gray-300">Tags:</span> {workItem.tags}
          </div>
        )}

        <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium dark:text-gray-300">Program:</span> {workItem.program?.name || "N/A"}
            </div>
            <div>
              <span className="font-medium dark:text-gray-300">Milestone:</span> {workItem.dueByMilestone?.name || "N/A"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium dark:text-gray-300">Author:</span> {workItem.authorUser?.name || workItem.authorUser?.username || "Unknown"}
          </div>
          <div>
            <span className="font-medium dark:text-gray-300">Assignee:</span> {workItem.assigneeUser?.name || workItem.assigneeUser?.username || "Unassigned"}
          </div>
        </div>

        {/* Type-specific details */}
        {workItem.issueDetail && (
          <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
            <p className="font-medium mb-1 dark:text-gray-300">Issue Details:</p>
            <div className="ml-3 space-y-1 text-xs">
              <div>
                <span className="font-medium dark:text-gray-300">Type:</span> {(() => {
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
              </div>
              {workItem.issueDetail.rootCause && (
                <div>
                  <span className="font-medium dark:text-gray-300">Root Cause:</span> {workItem.issueDetail.rootCause}
                </div>
              )}
              {workItem.issueDetail.correctiveAction && (
                <div>
                  <span className="font-medium dark:text-gray-300">Corrective Action:</span> {workItem.issueDetail.correctiveAction}
                </div>
              )}
            </div>
          </div>
        )}

        {workItem.deliverableDetail && (
          <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
            <p className="font-medium mb-1 dark:text-gray-300">Deliverable Details:</p>
            <div className="ml-3 text-xs">
              <span className="font-medium dark:text-gray-300">Type:</span> {(() => {
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
            </div>
          </div>
        )}

        {/* Related items */}
        <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-2 text-xs">
            {workItem.partNumbers && workItem.partNumbers.length > 0 && (
              <div>
                <span className="font-medium dark:text-gray-300">Parts:</span> {workItem.partNumbers.length}
              </div>
            )}
            {workItem.attachments && workItem.attachments.length > 0 && (
              <div>
                <span className="font-medium dark:text-gray-300">Attachments:</span> {workItem.attachments.length}
              </div>
            )}
            {workItem.comments && workItem.comments.length > 0 && (
              <div>
                <span className="font-medium dark:text-gray-300">Comments:</span> {workItem.comments.length}
              </div>
            )}
          </div>
        </div>

        {/* Attachments preview */}
        {workItem.attachments && workItem.attachments.length > 0 && (
          <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
            <p className="font-medium mb-2 text-xs dark:text-gray-300">Attachment Preview:</p>
            <div className="flex gap-2">
              {workItem.attachments.slice(0, 3).map((attachment) => (
                <div key={attachment.id} className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                  <Image
                    src={attachment.fileUrl.startsWith('http') ? attachment.fileUrl : `/images/${attachment.fileUrl}`}
                    alt={attachment.fileName}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkItemCard;