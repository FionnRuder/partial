import Modal from '@/components/Modal';
import {
  Priority,
  Status,
  StatusLabels,
  WorkItemType,
  useCreateWorkItemMutation,
  WorkItemCreateInput,
  useGetPartsQuery,
  useGetUsersQuery,
  useGetProgramsQuery,
  useGetMilestonesQuery,
  useGetDeliverableTypesQuery,
  useGetIssueTypesQuery,
  useGetWorkItemsQuery,
  DeliverableTypeLabels,
  IssueTypeLabels,
} from '@/state/api';
import React, { useState } from 'react';
import { formatISO } from 'date-fns';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
  workItemType?: WorkItemType;
};

const ModalNewWorkItem = ({
  isOpen,
  onClose,
  id = null,
  workItemType: initialWorkItemType = WorkItemType.Task,
}: Props) => {
  const { data: parts = [], isLoading: partsLoading } = useGetPartsQuery();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: programs = [], isLoading: programsLoading } = useGetProgramsQuery();
  const { data: milestones = [], isLoading: milestonesLoading } = useGetMilestonesQuery();
  const { data: deliverableTypes = [] } = useGetDeliverableTypesQuery();
  const { data: issueTypes = [] } = useGetIssueTypesQuery();
  const { data: allWorkItems = [] } = useGetWorkItemsQuery();
  const [createWorkItem, { isLoading }] = useCreateWorkItemMutation();
  const [workItemType, setWorkItemType] = useState<WorkItemType | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [tags, setTags] = useState("");
  const [dateOpened, setDateOpened] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");
  const [actualCompletionDate, setActualCompletionDate] = useState("");
  const [percentComplete, setPercentComplete] = useState<number>(0);
  const [inputStatus, setInputStatus] = useState("");
  const [partIds, setPartIds] = useState<number[]>([]);
  const [partSearchQuery, setPartSearchQuery] = useState("");
  const [dependencyWorkItemIds, setDependencyWorkItemIds] = useState<number[]>([]);
  const [dependencySearchQuery, setDependencySearchQuery] = useState("");
  const [programId, setProgramId] = useState("");
  const [dueByMilestoneId, setDueByMilestoneId] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");

  // Subtype fields
  const [issueType, setIssueType] = useState<string>("");
  const [rootCause, setRootCause] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [deliverableType, setDeliverableType] = useState<string>("");

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const formattedDateOpened = formatISO(new Date(dateOpened), { representation: 'complete' });
    const formattedDueDate = formatISO(new Date(dueDate), { representation: 'complete' });
    const formattedEstimatedCompletionDate = formatISO(new Date(estimatedCompletionDate), { representation: 'complete' });
    const formattedActualCompletionDate = actualCompletionDate
      ? formatISO(new Date(actualCompletionDate), { representation: 'complete' })
      : undefined;


    const payload: WorkItemCreateInput = {
      workItemType: workItemType as WorkItemType,
      title,
      description,
      status: status as Status,
      priority: priority as Priority,
      tags,
      dateOpened: formattedDateOpened,
      dueDate: formattedDueDate,
      estimatedCompletionDate: formattedEstimatedCompletionDate,
      actualCompletionDate: formattedActualCompletionDate,
      percentComplete,
      inputStatus,
      programId: parseInt(programId),
      dueByMilestoneId: parseInt(dueByMilestoneId),
      authorUserId: authorUserId,
      assignedUserId: assignedUserId,
    };

    if (partIds.length > 0) {
      payload.partIds = partIds;
    }

    if (dependencyWorkItemIds.length > 0) {
      payload.dependencyWorkItemIds = dependencyWorkItemIds;
    }

    // Add subtype-specific data
    if (workItemType === WorkItemType.Issue && issueType) {
      payload.issueDetail = {
        issueType: issueType, // Send type name as string
      };
      if (rootCause) payload.issueDetail.rootCause = rootCause;
      if (correctiveAction) payload.issueDetail.correctiveAction = correctiveAction;
    } else if (workItemType === WorkItemType.Deliverable && deliverableType) {
      payload.deliverableDetail = {
        deliverableType: deliverableType, // Send type name as string
      };
    }

    try {
      await createWorkItem(payload).unwrap();
      onClose(); // close modal on success
    } catch (err) {
    console.error("Failed to create work item:", err);
    }
  };

  const isFormValid = (): boolean => {
    const baseValid =
      !!workItemType &&
      !!title &&
      !!description &&
      !!status &&
      !!priority &&
      !!dateOpened &&
      !!dueDate &&
      !!estimatedCompletionDate &&
      percentComplete >= 0 &&
      !!inputStatus &&
      !!programId &&
      !!dueByMilestoneId &&
      !!authorUserId &&
      !!assignedUserId;

    if (workItemType === WorkItemType.Issue) {
      return baseValid && !!issueType;
    }

    if (workItemType === WorkItemType.Deliverable) {
      return baseValid && !!deliverableType;
    }

    return baseValid;
  };


  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={"Create New Work Item"}>
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <select
          className={selectStyles}
          value={workItemType}
          onChange={(e) =>
            setWorkItemType(
              e.target.value
                ? (WorkItemType[e.target.value as keyof typeof WorkItemType])
                : ""
            )
          }
        >
          <option value="">Select Work Item Type</option>
          {Object.values(WorkItemType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Subtype fields */}
        {workItemType === WorkItemType.Issue && (
          <select
            className={selectStyles}
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
          >
            <option value="">Select Issue Type</option>
            {issueTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {IssueTypeLabels[type.name] || type.name}
                </option>
              ))}
          </select>
        )}

        {workItemType === WorkItemType.Deliverable && (
          <select
            className={selectStyles}
            value={deliverableType}
            onChange={(e) => setDeliverableType(e.target.value)}
          >
            <option value="">Select Deliverable Type</option>
            {deliverableTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {DeliverableTypeLabels[type.name] || type.name}
              </option>
            ))}
          </select>
        )}
        
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {workItemType === WorkItemType.Issue && (
          <>
            <textarea
              className={inputStyles}
              placeholder="Root Cause"
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
            />
            <textarea
              className={inputStyles}
              placeholder="Corrective Action"
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
            />
          </>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="">Select Status</option>
            {Object.values(Status).map((s) => (
              <option key={s} value={s}>
                {StatusLabels[s]}
              </option>
            ))}
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Date Opened:
            </label>
            <input
              type="date"
              className={inputStyles}
              value={dateOpened}
              onChange={(e) => setDateOpened(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Due Date:
            </label>
            <input
              type="date"
              className={inputStyles}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Estimated Completion:
            </label>
            <input
              type="date"
              className={inputStyles}
              value={estimatedCompletionDate}
              onChange={(e) => setEstimatedCompletionDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Actual Completion:
            </label>
            <input
              type="date"
              className={inputStyles}
              value={actualCompletionDate}
              onChange={(e) => setActualCompletionDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Percent Complete:
          </label>
          <input
            type="number"
            className={inputStyles}
            value={percentComplete}
            onChange={(e) => setPercentComplete(Number(e.target.value))}
            min={0}
            max={100}
          />
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Current Status"
          value={inputStatus}
          onChange={(e) => setInputStatus(e.target.value)}
        />
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Affected Part(s):
          </label>
          <div className="relative">
            <input
              type="text"
              className={inputStyles}
              placeholder="Search parts..."
              value={partSearchQuery}
              onChange={(e) => setPartSearchQuery(e.target.value)}
              onFocus={() => setPartSearchQuery("")}
            />
            {partSearchQuery && (
              <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-dark-secondary">
                {parts
                  .filter((part) => {
                    const searchLower = partSearchQuery.toLowerCase();
                    return (
                      part.code.toLowerCase().includes(searchLower) ||
                      part.partName.toLowerCase().includes(searchLower)
                    );
                  })
                  .slice(0, 10)
                  .map((part) => {
                    const isSelected = partIds.includes(part.id);
                    return (
                      <div
                        key={part.id}
                        className={`cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          isSelected ? "bg-blue-100 dark:bg-blue-900" : ""
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            setPartIds(partIds.filter((id) => id !== part.id));
                          } else {
                            setPartIds([...partIds, part.id]);
                          }
                          setPartSearchQuery("");
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium dark:text-white">
                            {part.code}: {part.partName}
                          </span>
                          {isSelected && <span className="text-xs text-blue-600 dark:text-blue-400">✓</span>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
          {partIds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {partIds.map((partId) => {
                const part = parts.find((p) => p.id === partId);
                if (!part) return null;
                return (
                  <span
                    key={partId}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {part.code}: {part.partName}
                    <button
                      type="button"
                      onClick={() => setPartIds(partIds.filter((id) => id !== partId))}
                      className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Dependencies:
          </label>
          <div className="relative">
            <input
              type="text"
              className={inputStyles}
              placeholder="Search work items..."
              value={dependencySearchQuery}
              onChange={(e) => setDependencySearchQuery(e.target.value)}
              onFocus={() => setDependencySearchQuery("")}
            />
            {dependencySearchQuery && (
              <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-dark-secondary">
                {allWorkItems
                  .filter((wi) => {
                    const searchLower = dependencySearchQuery.toLowerCase();
                    return (
                      wi.id !== Number(id) &&
                      (wi.title.toLowerCase().includes(searchLower) ||
                        wi.id.toString().includes(searchLower) ||
                        wi.workItemType.toLowerCase().includes(searchLower))
                    );
                  })
                  .slice(0, 10)
                  .map((wi) => {
                    const isSelected = dependencyWorkItemIds.includes(wi.id);
                    const prefix = wi.workItemType === "Deliverable" ? "D" : wi.workItemType === "Issue" ? "I" : "T";
                    return (
                      <div
                        key={wi.id}
                        className={`cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          isSelected ? "bg-blue-100 dark:bg-blue-900" : ""
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            setDependencyWorkItemIds(dependencyWorkItemIds.filter((id) => id !== wi.id));
                          } else {
                            setDependencyWorkItemIds([...dependencyWorkItemIds, wi.id]);
                          }
                          setDependencySearchQuery("");
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium dark:text-white">
                            {prefix}{wi.id}: {wi.title}
                          </span>
                          {isSelected && <span className="text-xs text-blue-600 dark:text-blue-400">✓</span>}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {wi.workItemType} • {wi.status}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
          {dependencyWorkItemIds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {dependencyWorkItemIds.map((depId) => {
                const dep = allWorkItems.find((wi) => wi.id === depId);
                if (!dep) return null;
                const prefix = dep.workItemType === "Deliverable" ? "D" : dep.workItemType === "Issue" ? "I" : "T";
                return (
                  <span
                    key={depId}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {prefix}{dep.id}: {dep.title}
                    <button
                      type="button"
                      onClick={() => setDependencyWorkItemIds(dependencyWorkItemIds.filter((id) => id !== depId))}
                      className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <select
          className={inputStyles}
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          disabled={programsLoading}
        >
          <option value="">Select Program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
            {program.name}
            </option>
          ))}
        </select>
        <select
          className={inputStyles}
          value={dueByMilestoneId}
          onChange={(e) => setDueByMilestoneId(e.target.value)}
          disabled={milestonesLoading}
        >
          <option value="">Select Milestone</option>
          {milestones.map((milestone) => (
              <option key={milestone.id} value={milestone.id}>
              {milestone.name}
              </option>
          ))}
        </select>
        <select
          className={inputStyles}
          value={authorUserId}
          onChange={(e) => setAuthorUserId(e.target.value)}
          disabled={usersLoading}
        >
          <option value="">Select Author User</option>
          {users.map((user) => (
              <option key={user.id} value={user.id}>
              {user.name} ({user.username})
              </option>
          ))}
        </select>
        <select
          className={inputStyles}
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
          disabled={usersLoading}
        >
          <option value="">Select Assigned User</option>
          {users.map((user) => (
              <option key={user.id} value={user.id}>
              {user.name} ({user.username})
              </option>
          ))}
        </select>
        

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? `Creating ${workItemType}...` : `Create Work Item ${workItemType}`}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewWorkItem;
