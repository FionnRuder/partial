"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Priority,
  Program,
  WorkItem,
  WorkItemType,
  Status,
  useGetProgramsQuery,
  useGetWorkItemsQuery,
  useGetWorkItemsByProgramQuery,
  useGetTeamsQuery,
  useGetMilestonesQuery,
  useGetMilestonesByProgramQuery,
} from "@/state/api";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import BurndownChart from "@/components/BurndownChart";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

const workItemColumns: GridColDef<WorkItem>[] = [
  { 
    field: "workItemType", 
    headerName: "Type", 
    width: 120,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800">
        {params.value}
      </span>
    ),
  },
  { 
    field: "title", 
    headerName: "Title", 
    minWidth: 200,
    flex: 1,
  },
  { 
    field: "status", 
    headerName: "Status", 
    width: 140,
    renderCell: (params) => (
      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(params.value)}`}>
        {params.value}
      </span>
    ),
  },
  { 
    field: "priority", 
    headerName: "Priority", 
    width: 110,
    renderCell: (params) => (
      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityColor(params.value)}`}>
        {params.value}
      </span>
    ),
  },
  { 
    field: "dueDate", 
    headerName: "Due Date",
    width: 120,
    renderCell: (params) => {
      const dateStr = formatDate(params.value);
      const isPastDue = params.value && new Date(params.value) < new Date();
      const isNotCompleted = params.row.status !== Status.Completed;
      const shouldHighlight = isPastDue && isNotCompleted;
      
      return (
        <span className={shouldHighlight ? "text-red-600 font-semibold" : ""}>
          {dateStr}
        </span>
      );
    },
  },
  { 
    field: "estimatedCompletionDate",
    headerName: "ECD",
    width: 130,
    renderCell: (params) => {
      const dateStr = formatDate(params.value);
      const isPastDue = params.value && new Date(params.value) < new Date();
      const isNotCompleted = params.row.status !== Status.Completed;
      const shouldHighlight = isPastDue && isNotCompleted;
      
      return (
        <span className={shouldHighlight ? "text-red-600 font-semibold" : ""}>
          {dateStr}
        </span>
      );
    },
  },
  { 
    field: "percentComplete", 
    headerName: "% Complete", 
    width: 110,
    renderCell: (params) => (
      <span className="font-medium">{params.value ?? 0}%</span>
    ),
  },
  { 
    field: "inputStatus", 
    headerName: "Input Status", 
    width: 200,
    renderCell: (params) => params.value || "N/A",
  },
  { 
    field: "assigneeUserName", 
    headerName: "Assignee", 
    width: 150,
    renderCell: (params) => params.value || "Unassigned",
  },
];

const COLORS = ["#6FA8DC", "#66CDAA", "#FF9500", "#FF8042", "#A28FD0", "#FF6384", "#36A2EB"];

const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.ToDo:
      return "bg-gray-100 text-gray-800";
    case Status.WorkInProgress:
      return "bg-blue-100 text-blue-800";
    case Status.UnderReview:
      return "bg-yellow-100 text-yellow-800";
    case Status.Completed:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.Urgent:
      return "bg-red-100 text-red-800";
    case Priority.High:
      return "bg-orange-100 text-orange-800";
    case Priority.Medium:
      return "bg-yellow-100 text-yellow-800";
    case Priority.Low:
      return "bg-green-100 text-green-800";
    case Priority.Backlog:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedProgramId, setSelectedProgramId] = useState<number | "all">("all");
  const [chartMode, setChartMode] = useState<"type" | "priority">("type");

  // Call hooks unconditionally (React rules of hooks)
  const { data: programs, isLoading: isProgramsLoading } = useGetProgramsQuery(undefined, {
    skip: !isAuthenticated, // Skip API calls if not authenticated
  });
  const { data: teams, isLoading: isTeamsLoading } = useGetTeamsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [selectedWorkItemType, setSelectedWorkItemType] = useState<WorkItemType | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<Priority | "all">("all");
  const [workItemFilter, setWorkItemFilter] = useState<"all" | "open">("all");
  const [showPastMilestones, setShowPastMilestones] = useState(false);
  const barChartContainerRef = useRef<HTMLDivElement>(null);
  const [barChartHeight, setBarChartHeight] = useState(400);
  const pieChartContainerRef = useRef<HTMLDivElement>(null);
  const [pieChartHeight, setPieChartHeight] = useState(400);

  useEffect(() => {
    setShowPastMilestones(false);
  }, [selectedProgramId]);

  // Measure bar chart container height to fill available space
  useEffect(() => {
    const updateBarChartHeight = () => {
      if (barChartContainerRef.current) {
        // Get the full container height and subtract header (h3 + mb-4) and padding (p-4 = 16px top + 16px bottom)
        const containerHeight = barChartContainerRef.current.clientHeight;
        const headerHeight = 28 + 16; // h3 text-lg (~28px) + mb-4 (16px margin)
        const padding = 32; // p-4 = 16px top + 16px bottom
        const chartHeight = containerHeight - headerHeight - padding;
        setBarChartHeight(Math.max(chartHeight, 300)); // Minimum 300px
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(updateBarChartHeight);
    window.addEventListener('resize', updateBarChartHeight);
    return () => window.removeEventListener('resize', updateBarChartHeight);
  }, []); // Only recalculate on mount and window resize

  // Measure pie chart container height to fill available space
  useEffect(() => {
    const updatePieChartHeight = () => {
      if (pieChartContainerRef.current) {
        // Get the full container height and subtract header (h3 + mb-4) and padding (p-4 = 16px top + 16px bottom)
        const containerHeight = pieChartContainerRef.current.clientHeight;
        const headerHeight = 28 + 16; // h3 text-lg (~28px) + mb-4 (16px margin)
        const padding = 32; // p-4 = 16px top + 16px bottom
        const chartHeight = containerHeight - headerHeight - padding;
        setPieChartHeight(Math.max(chartHeight, 300)); // Minimum 300px
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(updatePieChartHeight);
    window.addEventListener('resize', updatePieChartHeight);
    return () => window.removeEventListener('resize', updatePieChartHeight);
  }, []); // Only recalculate on mount and window resize

  // Redirect to onboarding if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/onboarding");
    }
  }, [isAuthenticated, authLoading, router]);

  // Call all hooks unconditionally to follow rules of hooks
  const {
    data: allWorkItems,
    isLoading: isAllWorkItemsLoading,
    isError: allWorkItemsError,
  } = useGetWorkItemsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const {
    data: programWorkItems,
    isLoading: isProgramWorkItemsLoading,
    isError: programWorkItemsError,
  } = useGetWorkItemsByProgramQuery(
    { programId: selectedProgramId === "all" ? 0 : selectedProgramId },
    { skip: selectedProgramId === "all" || !isAuthenticated }
  );

  const {
    data: allMilestones,
    isLoading: isAllMilestonesLoading,
    isError: allMilestonesError,
  } = useGetMilestonesQuery(undefined, {
    skip: !isAuthenticated,
  });

  const {
    data: programMilestones,
    isLoading: isProgramMilestonesLoading,
    isError: programMilestonesError,
  } = useGetMilestonesByProgramQuery(
    { programId: selectedProgramId === "all" ? 0 : selectedProgramId },
    { skip: selectedProgramId === "all" || !isAuthenticated }
  );

  // Conditionally use the appropriate data based on selectedProgramId
  const workItems = selectedProgramId === "all" ? allWorkItems : programWorkItems;
  const isWorkItemsLoading = selectedProgramId === "all" ? isAllWorkItemsLoading : isProgramWorkItemsLoading;
  const workItemsError = selectedProgramId === "all" ? allWorkItemsError : programWorkItemsError;

  const milestones = selectedProgramId === "all" ? allMilestones : programMilestones;
  const milestonesLoading = selectedProgramId === "all" ? isAllMilestonesLoading : isProgramMilestonesLoading;
  const milestonesError = selectedProgramId === "all" ? allMilestonesError : programMilestonesError;

  const displayedMilestones =
    selectedProgramId === "all"
      ? milestones
      : milestones?.filter((m) => m.programId === selectedProgramId);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const sortedMilestones = [...(displayedMilestones ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const upcomingMilestones = sortedMilestones.filter((milestone) => {
    if (!milestone.date) return true;
    const milestoneDate = new Date(milestone.date);
    return milestoneDate >= startOfToday;
  });

  const pastMilestones = sortedMilestones
    .filter((milestone) => milestone.date && new Date(milestone.date) < startOfToday)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Don't render anything if not authenticated (will redirect)
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isWorkItemsLoading || isProgramsLoading || isTeamsLoading)
    return <div>Loading...</div>;
  if (workItemsError || !workItems || !programs || !teams)
    return <div>Error fetching data</div>;

  /* ---------- DATA TRANSFORMS ---------- */

  // First, apply the work item filter (all vs open) to all data
  const filteredWorkItems = workItemFilter === "open"
    ? workItems.filter((item) => item.status !== "Completed")
    : workItems;

  // 1️⃣ Work Items by Discipline Team
  const teamCount = filteredWorkItems.reduce((acc: Record<string, number>, item: WorkItem) => {
    const team = teams.find((t) => t.id === item.assigneeUser?.disciplineTeamId);
    const teamName = team?.name || "Unassigned";
    acc[teamName] = (acc[teamName] || 0) + 1;
    return acc;
  }, {});
  const teamDistribution = Object.entries(teamCount).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  // 2️⃣ Pie chart data: Type vs Priority
  const priorityCount = filteredWorkItems.reduce((acc: Record<string, number>, item: WorkItem) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {});
  const priorityDistribution = Object.entries(priorityCount).map(([name, count]) => ({ name, count }));

  const typeCount = filteredWorkItems.reduce((acc: Record<string, number>, item: WorkItem) => {
    acc[item.workItemType] = (acc[item.workItemType] || 0) + 1;
    return acc;
  }, {});
  const typeDistribution = Object.entries(typeCount).map(([name, count]) => ({ name, count }));

  const pieData = chartMode === "type" ? typeDistribution : priorityDistribution;

  // 3️⃣ Priority Work Items for the DataGrid (Urgent is default)
  const filteredWorkItemsByPriority =
    selectedPriority === "all"
      ? filteredWorkItems
      : filteredWorkItems.filter((item) => item.priority === selectedPriority);
  
  const displayedWorkItems = [...filteredWorkItemsByPriority]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .map((item) => ({
      ...item,
      assigneeUserName: item.assigneeUser?.name || "Unassigned",
    }));

  // Work Items filtered by Type (for Burndown Chart - uses all work items, not filtered by status):
  const filteredWorkItemsForChart = 
  selectedWorkItemType === "all"
    ? workItems
    : workItems.filter((item) => item.workItemType === selectedWorkItemType);

  const formattedTeamName = (name: string) => 
    name.length > 8 ? name.slice(0, 8) + "…" : name;

  // 📊 Priority counts for datagrid dropdown
  const priorityCounts = filteredWorkItems.reduce(
    (acc: Record<string, number>, item: WorkItem) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalCount = filteredWorkItems.length;


  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  return (
    <div className="h-full w-full bg-gray-100 bg-transparent p-8">
      <Header name="Home Dashboard" />

      {/* ---- Program Selector and Work Item Filter ---- */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <select
            id="program-select"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-dark-secondary dark:text-white"
            value={selectedProgramId}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedProgramId(value === "all" ? "all" : parseInt(value));
            }}
          >
            <option value="all">All Programs</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        {/* Work Item Status Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-1 dark:border-gray-600 dark:bg-dark-tertiary">
            <button
              onClick={() => setWorkItemFilter("all")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                workItemFilter === "all"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-dark-secondary dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              All Work Items
            </button>
            <button
              onClick={() => setWorkItemFilter("open")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                workItemFilter === "open"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-dark-secondary dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Open Work Items
            </button>
          </div>
        </div>
      </div>

      {/* ---- Charts and Table ---- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* ---- Burndown Chart: Work Items — spans 2 columns ---- */}
        <div className="col-span-3 md:col-span-2">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold dark:text-white">
                Work Item Burndown
              </h3>
              <select
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-dark-secondary dark:text-white"
                value={selectedWorkItemType}
                onChange={(e) => {
                  const value = e.target.value as WorkItemType | "all";
                  setSelectedWorkItemType(value);
                }}
              >
                <option value="all">All Types</option>
                {Object.values(WorkItemType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <BurndownChart workItems={filteredWorkItemsForChart} isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* 🧩 Milestones Section */}
        <div className="col-span-3 md:col-span-1 md:row-span-2">
          <div className="rounded-lg bg-white shadow dark:bg-dark-secondary md:max-h-[940px] max-h-[50vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-dark-secondary z-10 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold dark:text-white">
                  Program Milestones
                </h2>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {upcomingMilestones.length} upcoming
                </div>
              </div>
            </div>
            <div className="p-4 pt-0">

            {milestonesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-500 dark:text-gray-300">Loading milestones...</span>
              </div>
            ) : milestonesError ? (
              <div className="text-center py-8">
                <div className="text-red-500 text-sm">Error loading milestones</div>
              </div>
            ) : sortedMilestones.length > 0 ? (
              <div className="space-y-3">
                {upcomingMilestones.length > 0 ? (
                  upcomingMilestones.map((milestone) => {
                    const milestoneWorkItems = filteredWorkItems?.filter(
                      (wi) => wi.dueByMilestoneId === milestone.id
                    );
                    const programName =
                      programs.find((p) => p.id === milestone.programId)?.name || "—";

                    const today = new Date();
                    const milestoneDate = milestone.date ? new Date(milestone.date) : null;
                    const isPast = milestoneDate ? milestoneDate < today : false;
                    const daysUntil = milestoneDate
                      ? Math.ceil(
                          (milestoneDate.getTime() - today.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : null;
                    const isWithin30Days =
                      daysUntil !== null ? daysUntil <= 30 && daysUntil >= 0 : false;

                    const getStatusBadge = () => {
                      if (isPast) {
                        return (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            <div className="mr-1 h-2 w-2 rounded-full bg-gray-400"></div>
                            Completed
                          </span>
                        );
                      }
                      if (isWithin30Days) {
                        return (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            <div className="mr-1 h-2 w-2 animate-pulse rounded-full bg-orange-500"></div>
                            Due in {daysUntil} days
                          </span>
                        );
                      }
                      return (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <div className="mr-1 h-2 w-2 rounded-full bg-blue-500"></div>
                          Upcoming
                        </span>
                      );
                    };

                    return (
                      <div
                        key={milestone.id}
                        className={`rounded-lg border px-3 py-2 transition-all duration-200 hover:shadow-md ${
                          isPast
                            ? "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                            : isWithin30Days
                            ? "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700"
                            : "bg-white border-gray-200 dark:bg-dark-tertiary dark:border-gray-700"
                        }`}
                      >
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3
                              className={`truncate text-sm font-semibold ${
                                isPast
                                  ? "text-gray-600 dark:text-gray-400"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {milestone.name}
                            </h3>
                            <p
                              className={`truncate text-xs ${
                                isPast
                                  ? "text-gray-500 dark:text-gray-500"
                                  : "text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {programName}
                            </p>
                          </div>
                          {getStatusBadge()}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`${
                              isPast
                                ? "text-gray-500 dark:text-gray-500"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {milestoneDate
                              ? milestoneDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "No date"}
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              milestoneWorkItems && milestoneWorkItems.length > 0
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                            }`}
                          >
                            {milestoneWorkItems?.length || 0} work items
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-md border border-dashed border-blue-200 bg-blue-50 px-3 py-4 text-center text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                    No upcoming milestones. Create a new milestone to keep momentum.
                  </div>
                )}

                {pastMilestones.length > 0 && (
                  <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowPastMilestones((prev) => !prev)}
                      className="flex w-full items-center justify-between rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <span>Past Milestones ({pastMilestones.length})</span>
                      {showPastMilestones ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {showPastMilestones && (
                      <div className="mt-2 space-y-1.5">
                        {pastMilestones.map((milestone) => {
                          const milestoneDate = milestone.date
                            ? new Date(milestone.date)
                            : null;
                          const programName =
                            programs.find((p) => p.id === milestone.programId)?.name || "—";

                          return (
                            <div
                              key={`past-${milestone.id}`}
                              className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs dark:border-gray-700 dark:bg-dark-tertiary"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-medium text-gray-700 dark:text-gray-200">
                                  {milestone.name}
                                </p>
                                <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                                  {programName}
                                </p>
                              </div>
                              <div className="flex flex-col items-end text-[11px] text-gray-500 dark:text-gray-400">
                                {milestoneDate
                                  ? milestoneDate.toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "No date"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No milestones found
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* ---- Bar Chart and Pie Chart sit on first row ---- */}
        <div className="col-span-3 md:col-span-2 grid grid-cols-2 gap-4">
          {/* ---- Bar Chart: Work Items by Discipline Team ---- */}
          <div ref={barChartContainerRef} className="flex flex-col rounded-lg bg-white p-4 shadow dark:bg-dark-secondary min-h-[400px] h-full">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Work Items by Discipline Team
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height={barChartHeight}>
                <BarChart data={teamDistribution} margin={{ bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
                  <XAxis 
                    dataKey="name"
                    tickFormatter={formattedTeamName}
                    stroke={chartColors.text}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fill: chartColors.text, fontSize: 11 }}
                  />
                  <YAxis stroke={chartColors.text} />
                  <Tooltip />
                  <Bar dataKey="count" fill={chartColors.bar}>
                    {teamDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ---- Pie Chart: Type vs Priority ---- */}
          <div ref={pieChartContainerRef} className="flex flex-col rounded-lg bg-white p-4 shadow dark:bg-dark-secondary min-h-[400px] h-full">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold dark:text-white">
                Work Item Distribution (By Type / By Priority)
              </h3>
              <select
                value={chartMode}
                onChange={(e) => setChartMode(e.target.value as "type" | "priority")}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-dark-secondary dark:text-white"
              >
                <option value="type">By Type</option>
                <option value="priority">By Priority</option>
              </select>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height={pieChartHeight}>
                <PieChart>
                  <Pie dataKey="count" data={pieData} fill={chartColors.pieFill} label>
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ---- Urgent Work Items DataGrid ---- */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white">
              {selectedPriority === "all"
                ? "All Work Items"
                : `${selectedPriority} Priority Work Items`}
            </h3>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as Priority | "all")}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-dark-secondary dark:text-white"
            >
              <option value="all">All Priorities ({totalCount})</option>
              {Object.values(Priority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority} ({priorityCounts[priority] ?? 0})
                </option>
              ))}
            </select>
          </div>
          <div style={{ height: 650, width: "100%" }}>
            <DataGrid
              rows={displayedWorkItems}
              columns={workItemColumns}
              loading={isWorkItemsLoading}
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              className={dataGridClassNames}
              showToolbar
              sx={dataGridSxStyles(isDarkMode)}
              initialState={{
                sorting: {
                  sortModel: [{ field: "dueDate", sort: "asc" }],
                },
              }}
              onRowClick={(params) => router.push(`/work-items/${params.row.id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

