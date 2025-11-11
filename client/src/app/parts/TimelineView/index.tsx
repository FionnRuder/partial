import { useAppSelector } from '@/app/redux';
import { useGetWorkItemsByPartQuery } from '@/state/api';
import {
  DisplayOption,
  Gantt,
  Task,
  ViewMode
} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from 'react';
import { PlusSquare } from "lucide-react";

type Props = {
  id: string;
  setIsModalNewWorkItemOpen: (isOpen: boolean) => void;
  searchQuery: string;
  includeChildren: boolean;
};

// Helper function to filter work items based on search query
const filterWorkItemsBySearch = (workItems: any[], searchQuery: string) => {
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

const Timeline = ({ id, setIsModalNewWorkItemOpen, searchQuery, includeChildren }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: workItems, error, isLoading } =
    useGetWorkItemsByPartQuery({ partId: Number(id), includeChildren });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US"
  });

  // Filter work items based on search query
  const filteredWorkItems = useMemo(() => {
    return filterWorkItemsBySearch(workItems || [], searchQuery);
  }, [workItems, searchQuery]);

  // ✅ Ensure ganttTasks matches the Task[] interface from gantt-task-react
  const ganttTasks: Task[] = useMemo(() => {
    if (!filteredWorkItems || filteredWorkItems.length === 0) {
      return [];
    }
    
    return filteredWorkItems
      .filter((workItem) => {
        // Only include work items that have both dateOpened and dueDate
        return workItem.dateOpened && workItem.dueDate;
      })
      .map((workItem) => ({
        start: new Date(workItem.dateOpened as string),
        end: new Date(workItem.dueDate as string),
        name: workItem.title,
        id: `${workItem.workItemType}-${workItem.id}`,
        type: "task", // must be "task" | "milestone" | "project"
        progress: workItem.percentComplete ?? 0,
        isDisabled: false
      }));
  }, [filteredWorkItems]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !workItems) return <div>An error occurred while fetching work items</div>;

  // Handle empty state when no work items exist or no work items have valid dates
  if (ganttTasks.length === 0) {
    return (
      <div className="px-4 xl:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 py-5">
          <h1 className="me-2 text-lg font-bold dark:text-white">
            Work Item Timeline
          </h1>
        </div>

        <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-gray-400">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No work items to display
            </h3>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              {filteredWorkItems && filteredWorkItems.length > 0 
                ? "Work items exist but don't have valid start/end dates for timeline view."
                : "No work items have been created for this part yet."
              }
            </p>
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewWorkItemOpen(true)}
            >
              <PlusSquare className="mr-2 h-5 w-5" />New Work Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="me-2 text-lg font-bold dark:text-white">
          Work Item Timeline
        </h1>
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline clock w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks} // ✅ correct prop name
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="200px"
            barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
            barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
          />
        </div>
        <div className="px-4 pb-5 pt-1">
          <button
            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewWorkItemOpen(true)}
          >
            <PlusSquare className="mr-2 h-5 w-5" />New Work Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
