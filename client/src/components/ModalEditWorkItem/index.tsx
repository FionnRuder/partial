"use client";

import Modal from '@/components/Modal';
import {
  Priority,
  Status,
  StatusLabels,
  WorkItemType,
  DeliverableTypeLabels,
  IssueTypeLabels,
  useEditWorkItemMutation,
  useDeleteWorkItemMutation,
  WorkItem as WorkItemTypeModel,
  WorkItemEditInput,
  useGetPartsQuery,
  useGetProgramsQuery,
  useGetMilestonesQuery,
  useGetUsersQuery,
  useGetDeliverableTypesQuery,
  useGetIssueTypesQuery,
  useGetWorkItemsQuery,
  useGetWorkItemByIdQuery,
} from '@/state/api';
import React, { useEffect, useState } from 'react';
import { formatISO } from 'date-fns';
import { showToast, showApiSuccess } from '@/lib/toast';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workItem: WorkItemTypeModel | null;
};

const ModalEditWorkItem = ({ isOpen, onClose, workItem: workItemProp }: Props) => {
  const [editWorkItem, { isLoading: isSaving }] = useEditWorkItemMutation();
  const [deleteWorkItem, { isLoading: isDeleting }] = useDeleteWorkItemMutation();
  const { data: parts = [], isLoading: partsLoading } = useGetPartsQuery();
  const { data: programs = [], isLoading: programsLoading } = useGetProgramsQuery();
  const { data: milestones = [], isLoading: milestonesLoading } = useGetMilestonesQuery();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: deliverableTypes = [] } = useGetDeliverableTypesQuery();
  const { data: issueTypes = [] } = useGetIssueTypesQuery();
  const { data: allWorkItems = [] } = useGetWorkItemsQuery();
  
  // Refetch work item with dependencies when modal opens
  const { data: workItemWithDeps, refetch: refetchWorkItem } = useGetWorkItemByIdQuery(
    workItemProp?.id || 0,
    { skip: !workItemProp?.id || !isOpen }
  );
  
  // Use the refetched work item if available (has dependencies), otherwise fall back to prop
  const workItem = workItemWithDeps || workItemProp;

  // form state
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
  const [programName, setProgramName] = useState("");
  const [dueByMilestoneId, setDueByMilestoneId] = useState("");
  const [milestoneName, setMilestoneName] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [authorUserName, setAuthorUserName] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [assignedUserName, setAssignedUserName] = useState("");

  const [issueType, setIssueType] = useState<string>("");
  const [rootCause, setRootCause] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [deliverableType, setDeliverableType] = useState<string>("");

  // Refetch work item when modal opens to ensure we have dependencies
  useEffect(() => {
    if (isOpen && workItemProp?.id) {
      refetchWorkItem();
    }
  }, [isOpen, workItemProp?.id, refetchWorkItem]);

  // Prefill all fields when modal opens
  useEffect(() => {
    if (workItem) {
      console.log("workItem.partNumbers", workItem.partNumbers);
      console.log("workItem.dependencies", workItem.dependencies);
      setWorkItemType(workItem.workItemType || "");
      setTitle(workItem.title || "");
      setDescription(workItem.description || "");
      setStatus(workItem.status || "");
      setPriority(workItem.priority || "");
      setTags(workItem.tags || "");
      setDateOpened(workItem.dateOpened ? workItem.dateOpened.split("T")[0] : "");
      setDueDate(workItem.dueDate ? workItem.dueDate.split("T")[0] : "");
      setEstimatedCompletionDate(
        workItem.estimatedCompletionDate ? workItem.estimatedCompletionDate.split("T")[0] : ""
      );
      setActualCompletionDate(
        workItem.actualCompletionDate ? workItem.actualCompletionDate.split("T")[0] : ""
      );
      setPercentComplete(workItem.percentComplete || 0);
      setInputStatus(workItem.inputStatus || "");
      setPartIds(workItem.partNumbers?.map((p) => p.partId) || []);
      const dependencyIds = workItem.dependencies?.map((d) => d.dependencyWorkItemId) || [];
      console.log("Setting dependencyWorkItemIds:", dependencyIds);
      setDependencyWorkItemIds(dependencyIds);
      
      setProgramId(workItem.programId?.toString() || "");
      // Prefill program name if known
      const program = programs.find((p) => p.id === workItem.programId);
      setProgramName(program?.name || "");

      setDueByMilestoneId(workItem.dueByMilestoneId?.toString() || "");
      // Prefill milestone name if known
      const milestone = milestones.find((p) => p.id === workItem.dueByMilestoneId);
      setMilestoneName(milestone?.name || "");

      setAuthorUserId(workItem.authorUserId?.toString() || "");
      // prefill authorUserName if workItem.authorUserId is known
      const authorUser = users.find((u) => u.id === workItem.authorUserId);
      setAuthorUserName(authorUser?.name || "");

      setAssignedUserId(workItem.assignedUserId?.toString() || "");
      // prefill assignedUserName if workItem.assignedUserId is known
      const assignedUser = users.find((u) => u.id === workItem.assignedUserId);
      setAssignedUserName(assignedUser?.name || "");

      if (workItem.workItemType === WorkItemType.Issue) {
        const type = workItem.issueDetail?.issueType;
        const typeName = typeof type === 'string' ? type : (type && typeof type === 'object' && 'name' in type ? (type as { name: string }).name : '');
        setIssueType(typeName);
        setRootCause(workItem.issueDetail?.rootCause || "");
        setCorrectiveAction(workItem.issueDetail?.correctiveAction || "");
      } else if (workItem.workItemType === WorkItemType.Deliverable) {
        const type = workItem.deliverableDetail?.deliverableType;
        const typeName = typeof type === 'string' ? type : (type && typeof type === 'object' && 'name' in type ? (type as { name: string }).name : '');
        setDeliverableType(typeName);
      }
    }
  }, [workItem, programs, milestones, users, allWorkItems]);

  const isFormValid = (): boolean =>
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

  const handleSubmit = async () => {
    if (!workItem || !isFormValid()) return;

    const updatedWorkItem: WorkItemEditInput = {
      workItemType: workItemType as WorkItemType,
      status: status as Status,
      priority: priority as Priority,
      title,
      description,
      tags,
      dateOpened: formatISO(new Date(dateOpened), { representation: 'complete' }),
      dueDate: formatISO(new Date(dueDate), { representation: 'complete' }),
      estimatedCompletionDate: formatISO(new Date(estimatedCompletionDate), { representation: 'complete' }),
      actualCompletionDate: actualCompletionDate
        ? formatISO(new Date(actualCompletionDate), { representation: 'complete' })
        : undefined,
      percentComplete,
      inputStatus,
      partIds,
      dependencyWorkItemIds: dependencyWorkItemIds.length > 0 ? dependencyWorkItemIds : undefined,
      programId: parseInt(programId),
      dueByMilestoneId: parseInt(dueByMilestoneId),
      authorUserId: authorUserId,
      assignedUserId: assignedUserId,
      issueDetail: workItemType === WorkItemType.Issue && issueType
        ? {
            issueType: issueType, // Send type name as string
            rootCause,
            correctiveAction,
          }
        : undefined,
      deliverableDetail: workItemType === WorkItemType.Deliverable && deliverableType
        ? {
            deliverableType: deliverableType, // Send type name as string
          }
        : undefined,
    };

    try {
        await editWorkItem({
            workItemId: workItem.id,
            updates: updatedWorkItem,
        }).unwrap();
        showApiSuccess("Work item updated successfully");
        onClose(); // close modal on success
    } catch (err: any) {
        // Extract error message from RTK Query error structure
        const errorMessage = 
            err?.data?.message || 
            (err?.data && typeof err.data === "string" ? err.data : null) ||
            err?.message || 
            "Failed to save work item";
        
        // Show toast with the error message directly (avoid passing error object)
        showToast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!workItem) return;

    const confirmed = window.confirm(
        `Are you sure you want to delete "${workItem.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
        await deleteWorkItem(workItem.id).unwrap();
        showApiSuccess("Work item deleted successfully");
        onClose(); // close modal on success
    } catch (err: any) {
        // Extract error message from RTK Query error structure
        const errorMessage = 
            err?.data?.message || 
            (err?.data && typeof err.data === "string" ? err.data : null) ||
            err?.message || 
            "Failed to delete work item";
        
        // Show toast with the error message directly
        showToast.error(errorMessage);
    }
  };


  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit ${workItem?.workItemType ?? "Work Item"}`}>
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Work Item Type */}
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Work Item Type:
            </label>
            <select
            className={selectStyles}
            value={workItemType}
            onChange={(e) =>
                setWorkItemType(
                e.target.value ? (WorkItemType[e.target.value as keyof typeof WorkItemType]) : ""
                )
            }
            >
            <option value="">Select Work Item Type</option>
            {Object.values(WorkItemType).map((type) => (
                <option key={type} value={type}>{type}</option>
            ))}
            </select>
        </div>

        {/* Conditional fields for Issue or Deliverable */}
        {workItemType === WorkItemType.Issue && (
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Issue Type:
            </label>
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
          </div>
        )}

        {workItemType === WorkItemType.Deliverable && (
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Deliverable Type:
            </label>
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
          </div>
        )}

        {/* Common Fields */}
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Title:
            </label>
            <input
                type="text"
                className={inputStyles}
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Description:
            </label>
            <textarea
                className={inputStyles}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </div>

        {workItemType === WorkItemType.Issue && (
          <>
            <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300">
                    Root Cause:
                </label>
                <textarea
                    className={inputStyles}
                    placeholder="Root Cause"
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300">
                    Corrective Action:
                </label>
                <textarea
                    className={inputStyles}
                    placeholder="Corrective Action"
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                />
            </div>
          </>
        )}

        {/* Status & Priority */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Status:
            </label>
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
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Priority:
            </label>
            <select
                className={selectStyles}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
            >
                <option value="">Select Priority</option>
                {Object.values(Priority).map((p) => (
                <option key={p} value={p}>{p}</option>
                ))}
            </select>
          </div>
        </div>

        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Tags:
            </label>
            <input
                type="text"
                className={inputStyles}
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Date Opened:
            </label>
            <input type="date" className={inputStyles} value={dateOpened} onChange={(e) => setDateOpened(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Due Date:
            </label>
            <input type="date" className={inputStyles} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Estimated Completion:
            </label>
            <input type="date" className={inputStyles} value={estimatedCompletionDate} onChange={(e) => setEstimatedCompletionDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Actual Completion:
            </label>
            <input type="date" className={inputStyles} value={actualCompletionDate} onChange={(e) => setActualCompletionDate(e.target.value)} />
          </div>
        </div>

        {/* Percent Complete */}
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Percent Complete:
            </label>
            <input
            type="number"
            className={inputStyles}
            placeholder="Percent Complete"
            value={percentComplete}
            onChange={(e) => setPercentComplete(Number(e.target.value))}
            min={0}
            max={100}
            />
        </div>

        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Current Status:
            </label>
            <input
            type="text"
            className={inputStyles}
            placeholder="Current Status"
            value={inputStatus}
            onChange={(e) => setInputStatus(e.target.value)}
            />
        </div>

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
                      wi.id !== workItem?.id &&
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
                // Try to find the work item in allWorkItems first
                const dep = allWorkItems.find((wi) => wi.id === depId);
                if (!dep) {
                  // Fallback: try to find in workItem.dependencies if not in allWorkItems
                  const dependency = workItem?.dependencies?.find((d) => d.dependencyWorkItemId === depId);
                  if (dependency?.dependencyWorkItem) {
                    const depWorkItem = dependency.dependencyWorkItem;
                    const prefix = depWorkItem.workItemType === "Deliverable" ? "D" : depWorkItem.workItemType === "Issue" ? "I" : "T";
                    return (
                      <span
                        key={depId}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {prefix}{depWorkItem.id}: {depWorkItem.title}
                        <button
                          type="button"
                          onClick={() => setDependencyWorkItemIds(dependencyWorkItemIds.filter((id) => id !== depId))}
                          className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    );
                  }
                  // If still not found, show just the ID
                  return (
                    <span
                      key={depId}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      ID: {depId}
                      <button
                        type="button"
                        onClick={() => setDependencyWorkItemIds(dependencyWorkItemIds.filter((id) => id !== depId))}
                        className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  );
                }
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
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
              Program:
          </label>
          <select
            className={inputStyles}
            value={programId}
            onChange={(e) => {
              setProgramId(e.target.value);
              const selected = programs.find((p) => p.id === Number(e.target.value));
              setProgramName(selected?.name || "");
            }}
            disabled={programsLoading}
          >
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
              Milestone:
          </label>
          <select
            className={inputStyles}
            value={dueByMilestoneId}
            onChange={(e) => {
              setDueByMilestoneId(e.target.value);
              const selected = milestones.find((p) => p.id === Number(e.target.value));
              setMilestoneName(selected?.name || "");
            }}
            disabled={milestonesLoading}
          >
            <option value="">Select Milestone</option>
            {milestones.map((milestone) => (
              <option key={milestone.id} value={milestone.id}>
                {milestone.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Author:
            </label>
            <select
              className={inputStyles}
              value={authorUserId}
              onChange={(e) => {
                setAuthorUserId(e.target.value);
                const selected = users.find((u) => u.id === e.target.value);
                setAuthorUserName(selected?.name || "");
              }}
              disabled={usersLoading}
            >
              <option value="">Select Author User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.username})
                </option>
              ))}
            </select>
        </div>

        <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
                Assignee:
            </label>
            <select
              className={inputStyles}
              value={assignedUserId}
              onChange={(e) => {
                setAssignedUserId(e.target.value);
                const selected = users.find((u) => u.id === e.target.value);
                setAssignedUserName(selected?.name || "");
              }}
              disabled={usersLoading}
            >
              <option value="">Select Assigned User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.username})
                </option>
              ))}
            </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isSaving ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isSaving}
        >
          {isSaving ? `Updating ${workItemType}...` : `Update ${workItemType}`}
        </button>
        <button
            type="button"
            onClick={handleDelete}
            className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                isDeleting ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isDeleting}
        >
            {isDeleting ? `Deleting ${workItemType}` : `Delete ${workItemType}`}
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditWorkItem;
