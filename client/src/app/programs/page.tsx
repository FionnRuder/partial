"use client"

import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { useGetProgramsQuery, useGetMilestonesByProgramQuery, useGetWorkItemsByProgramQuery, useGetMilestonesQuery, useGetWorkItemsQuery, DeliverableTypeLabels, IssueTypeLabels } from '@/state/api';
import ModalNewProgram from '@/components/ModalNewProgram';
import ModalEditProgram from '@/components/ModalEditProgram';
import ModalNewMilestone from '@/components/ModalNewMilestone';
import ModalEditMilestone from '@/components/ModalEditMilestone';
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, CheckCircle, Clock, Target, SquarePen, PlusSquare, ChevronDown, ChevronRight } from 'lucide-react';

type TaskTypeItems = "task" | "milestone" | "project";

const Programs = () => {
    const router = useRouter();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: programs, isLoading: programsLoading, isError: programsError } = useGetProgramsQuery();

    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-US"
    });

    const [selectedProgramId, setSelectedProgramId] = useState<number | "all">("all");
    
    // Get the selected program data for the edit button
    const selectedProgram = useMemo(() => {
        if (selectedProgramId === "all" || !programs) return null;
        return programs.find(program => program.id === selectedProgramId) || null;
    }, [selectedProgramId, programs]);

    const [workItemFilter, setWorkItemFilter] = useState<"all" | "open">("all");
    
    // Expand/collapse state for table rows
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    
    // Modal states
    const [isNewProgramModalOpen, setIsNewProgramModalOpen] = useState(false);
    const [isEditProgramModalOpen, setIsEditProgramModalOpen] = useState(false);
    const [programToEdit, setProgramToEdit] = useState<any>(null);
    
    // Milestone modal states
    const [isNewMilestoneModalOpen, setIsNewMilestoneModalOpen] = useState(false);
    const [isEditMilestoneModalOpen, setIsEditMilestoneModalOpen] = useState(false);
    const [milestoneToEdit, setMilestoneToEdit] = useState<any>(null);

    // Get milestones - always fetch all milestones, then filter in the UI
    const { data: allMilestones, isLoading: milestonesLoading } = useGetMilestonesQuery();

    // Get work items - always fetch all work items, then filter in the UI
    const { data: allWorkItems } = useGetWorkItemsQuery();

    // Filter work items based on the toggle and selected program
    const filteredWorkItems = useMemo(() => {
        if (!allWorkItems) return [];
        
        // First filter by program if specific program is selected
        let filtered = allWorkItems;
        if (selectedProgramId !== "all") {
            filtered = allWorkItems.filter((item) => item.programId === selectedProgramId);
        }
        
        // Then filter by status (all vs open)
        return workItemFilter === "open" 
            ? filtered.filter((item) => item.status !== "Completed")
            : filtered;
    }, [allWorkItems, workItemFilter, selectedProgramId]);

    // Work item type distribution with subtype breakdowns
    const workItemTypeCounts = useMemo(() => {
        if (!allWorkItems) return [];
        
        // Filter by selected program
        const programFilteredItems = selectedProgramId === "all" 
            ? allWorkItems 
            : allWorkItems.filter((item) => item.programId === selectedProgramId);
        
        const typeCount: Record<string, { 
            openCount: number; 
            completedCount: number; 
            totalCount: number;
            subtypes?: Record<string, { openCount: number; completedCount: number; totalCount: number }> 
        }> = {};
        
        programFilteredItems.forEach((item) => {
            const isCompleted = item.status === "Completed";
            
            if (!typeCount[item.workItemType]) {
                typeCount[item.workItemType] = { openCount: 0, completedCount: 0, totalCount: 0, subtypes: {} };
            }
            
            typeCount[item.workItemType].totalCount++;
            if (isCompleted) {
                typeCount[item.workItemType].completedCount++;
            } else {
                typeCount[item.workItemType].openCount++;
            }
            
            // Track subtypes for Deliverables and Issues
            if (item.workItemType === 'Deliverable' && item.deliverableDetail?.deliverableType) {
                if (!typeCount[item.workItemType].subtypes) {
                    typeCount[item.workItemType].subtypes = {};
                }
                const subtype = item.deliverableDetail.deliverableType;
                if (!typeCount[item.workItemType].subtypes![subtype]) {
                    typeCount[item.workItemType].subtypes![subtype] = { openCount: 0, completedCount: 0, totalCount: 0 };
                }
                typeCount[item.workItemType].subtypes![subtype].totalCount++;
                if (isCompleted) {
                    typeCount[item.workItemType].subtypes![subtype].completedCount++;
                } else {
                    typeCount[item.workItemType].subtypes![subtype].openCount++;
                }
            } else if (item.workItemType === 'Issue' && item.issueDetail?.issueType) {
                if (!typeCount[item.workItemType].subtypes) {
                    typeCount[item.workItemType].subtypes = {};
                }
                const subtype = item.issueDetail.issueType;
                if (!typeCount[item.workItemType].subtypes![subtype]) {
                    typeCount[item.workItemType].subtypes![subtype] = { openCount: 0, completedCount: 0, totalCount: 0 };
                }
                typeCount[item.workItemType].subtypes![subtype].totalCount++;
                if (isCompleted) {
                    typeCount[item.workItemType].subtypes![subtype].completedCount++;
                } else {
                    typeCount[item.workItemType].subtypes![subtype].openCount++;
                }
            }
        });
        
        return Object.entries(typeCount).map(([type, data]) => ({ 
            type, 
            openCount: data.openCount,
            completedCount: data.completedCount,
            totalCount: data.totalCount,
            subtypes: data.subtypes 
        }));
    }, [allWorkItems, selectedProgramId]);

    const ganttTasks = useMemo(() => {
        return (
            programs?.map((program) => ({
                start: new Date(program.startDate as string),
                end: new Date(program.endDate as string),
                name: program.name,
                id: `Program-${program.id}`,
                type: "program" as TaskTypeItems,
                progress: 50,
                isDisabled: false
            })) || []
        )
    }, [programs]);

    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setDisplayOptions((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }));
    };

    const handleProgramChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;
        setSelectedProgramId(value === "all" ? "all" : parseInt(value));
    };

    const toggleRowExpansion = (rowKey: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(rowKey)) {
            newExpanded.delete(rowKey);
        } else {
            newExpanded.add(rowKey);
        }
        setExpandedRows(newExpanded);
    };

    const handleWorkItemTypeClick = (workItemType: string) => {
        const route = workItemType.toLowerCase();
        if (route === 'deliverable' || route === 'issue' || route === 'task') {
            router.push(`/work-items/${route}s`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getMilestoneStatus = (milestoneDate: string) => {
        const today = new Date();
        const milestone = new Date(milestoneDate);
        const diffTime = milestone.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return { status: 'completed', color: 'text-green-600', icon: CheckCircle };
        } else if (diffDays <= 30) {
            return { status: 'upcoming', color: 'text-orange-600', icon: Clock };
        } else {
            return { status: 'future', color: 'text-blue-600', icon: Target };
        }
    };

    if (programsLoading) return <div>Loading...</div>
    if (programsError || !programs) return <div>An error occurred while fetching programs</div>;

    return (
        <div className="max-w-full p-8">
            <header className="mb-6">
                <div className="flex items-center justify-between">
                    <Header 
                        name="Programs" 
                        buttonComponent={
                            <div className="flex gap-3">
                                {/* New Program Button */}
                                <button
                                    onClick={() => setIsNewProgramModalOpen(true)}
                                    className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <PlusSquare className="mr-2 h-5 w-5" />New Program
                                </button>
                                {/* Edit Program Button - only show when a specific program is selected */}
                                {selectedProgram && (
                                    <button
                                        onClick={() => {
                                            setProgramToEdit(selectedProgram);
                                            setIsEditProgramModalOpen(true);
                                        }}
                                        className="flex items-center rounded-md bg-gray-300 px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-dark-tertiary dark:text-white dark:hover:bg-gray-600"
                                    >
                                        <SquarePen className="mr-2 h-4 w-4" />
                                        Edit Program
                                    </button>
                                )}
                            </div>
                        }
                    />
                </div>
            </header>

            {/* Timeline Section */}
            <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Program Timeline
                    </h2>
                    <div className="relative inline-block w-64">
                        <select
                            className="focus:shadow-outline w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
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
                            tasks={ganttTasks}
                            {...displayOptions}
                            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                            listCellWidth="200px"
                            projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
                            projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
                            projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
                        />
                    </div>
                </div>
            </div>

            {/* Program Selection and Work Item Filter */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <select
                        id="program-select"
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-dark-secondary dark:text-white"
                        value={selectedProgramId}
                        onChange={handleProgramChange}
                    >
                        <option value="all">All Programs</option>
                        {programs.map((program) => (
                            <option key={program.id} value={program.id}>
                                {program.name}
                            </option>
                        ))}
                    </select>
                    
                    {/* New Milestone Button */}
                    <button
                        onClick={() => setIsNewMilestoneModalOpen(true)}
                        className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <PlusSquare className="mr-2 h-5 w-5" />
                        New Milestone
                    </button>
                </div>

                {/* Work Item Status Toggle */}
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

            {/* Work Items Table and Milestones Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Milestones Section */}
                <div>
                    <div className="rounded-lg bg-white shadow dark:bg-dark-secondary md:max-h-[940px] max-h-[50vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-dark-secondary z-10 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Program Milestones
                        </h2>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {allMilestones?.filter((milestone) => {
                                if (selectedProgramId === "all") return true;
                                return milestone.programId === selectedProgramId;
                            }).length || 0} milestones
                        </div>
                    </div>
                </div>
                
                <div className="p-4 pt-0">
                    {milestonesLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-500 dark:text-gray-300">Loading milestones...</span>
                        </div>
                    ) : allMilestones && allMilestones.length > 0 ? (
                        <div className="space-y-2">
                            {[...allMilestones]
                                .filter((milestone) => {
                                    // When "All Programs" is selected, show all milestones
                                    if (selectedProgramId === "all") return true;
                                    // When specific program is selected, only show milestones for that program
                                    return milestone.programId === selectedProgramId;
                                })
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map((milestone) => {
                                    // Get filtered work items for this milestone
                                    const milestoneWorkItems = filteredWorkItems?.filter(
                                        (wi) => wi.dueByMilestoneId === milestone.id
                                    ) || [];

                                    // Get program name for display
                                    const programName = selectedProgramId === "all" 
                                        ? programs.find((p) => p.id === milestone.programId)?.name || "Unknown Program"
                                        : programs.find((p) => p.id === selectedProgramId)?.name || "Unknown Program";

                                    // Enhanced status logic
                                    const today = new Date();
                                    const milestoneDate = milestone.date ? new Date(milestone.date) : null;
                                    const isPast = milestoneDate ? milestoneDate < today : false;
                                    const isUpcoming = milestoneDate ? {
                                        daysUntil: Math.ceil((milestoneDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
                                        isWithin30Days: Math.ceil((milestoneDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) <= 30
                                    } : null;

                                    // Status badge
                                    const getStatusBadge = () => {
                                        if (isPast) {
                                            return (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                                                    Completed
                                                </span>
                                            );
                                        } else if (isUpcoming?.isWithin30Days) {
                                            return (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse"></div>
                                                    Due in {isUpcoming.daysUntil} days
                                                </span>
                                            );
                                        } else {
                                            return (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                                                    Upcoming
                                                </span>
                                            );
                                        }
                                    };

                                    return (
                                        <div
                                            key={milestone.id}
                                            className={`p-2 rounded-lg border transition-all duration-200 hover:shadow-md ${
                                                isPast 
                                                    ? "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700" 
                                                    : isUpcoming?.isWithin30Days
                                                    ? "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700"
                                                    : "bg-white border-gray-200 dark:bg-dark-tertiary dark:border-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-semibold text-sm truncate ${
                                                        isPast ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-white"
                                                    }`}>
                                                        {milestone.name}
                                                    </h3>
                                                    <p className={`text-xs ${
                                                        isPast ? "text-gray-500 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"
                                                    }`}>
                                                        {selectedProgramId === "all" ? programName : milestone.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMilestoneToEdit(milestone);
                                                            setIsEditMilestoneModalOpen(true);
                                                        }}
                                                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                        title="Edit Milestone"
                                                    >
                                                        <SquarePen size={12} className="text-gray-600 dark:text-gray-300" />
                                                    </button>
                                                    {getStatusBadge()}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between text-xs">
                                                <span className={`${
                                                    isPast ? "text-gray-500 dark:text-gray-500" : "text-gray-600 dark:text-gray-400"
                                                }`}>
                                                    {milestoneDate ? milestoneDate.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : "No date"}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    milestoneWorkItems && milestoneWorkItems.length > 0
                                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                                }`}>
                                                    {milestoneWorkItems.length} work items
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                                No milestones found for the selected program
                            </div>
                        </div>
                    )}
                    </div>
                </div>
                </div>

                {/* Work Item Type Distribution Table */}
                <div>
                    <div className="rounded-lg bg-white shadow dark:bg-dark-secondary">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Work Items by Type
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-dark-tertiary">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Work Item Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Qty Open
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Qty Closed
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Qty Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
                                    {workItemTypeCounts.length > 0 ? (
                                        workItemTypeCounts.map((item, index) => {
                                            const hasSubtypes = item.subtypes && Object.keys(item.subtypes).length > 0;
                                            const isExpanded = expandedRows.has(item.type);
                                            const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;
                                            
                                            return (
                                                <React.Fragment key={index}>
                                                    <tr 
                                                        onClick={() => handleWorkItemTypeClick(item.type)}
                                                        className="hover:bg-gray-50 dark:hover:bg-dark-tertiary cursor-pointer"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                            <div className="flex items-center gap-2">
                                                                {hasSubtypes ? (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            toggleRowExpansion(item.type);
                                                                        }}
                                                                        className="flex items-center justify-center w-4 h-4 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                                    >
                                                                        <ChevronIcon className="w-3 h-3" />
                                                                    </button>
                                                                ) : (
                                                                    <span className="w-4" />
                                                                )}
                                                                <span>{item.type}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                            {item.openCount}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                            {item.completedCount}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                            {item.totalCount}
                                                        </td>
                                                    </tr>
                                                    {hasSubtypes && isExpanded && Object.entries(item.subtypes!).map(([subtype, counts]) => {
                                                        // Use labels for deliverable and issue types
                                                        let displayName = subtype;
                                                        if (item.type === 'Deliverable' && DeliverableTypeLabels[subtype as keyof typeof DeliverableTypeLabels]) {
                                                            displayName = DeliverableTypeLabels[subtype as keyof typeof DeliverableTypeLabels];
                                                        } else if (item.type === 'Issue' && IssueTypeLabels[subtype as keyof typeof IssueTypeLabels]) {
                                                            displayName = IssueTypeLabels[subtype as keyof typeof IssueTypeLabels];
                                                        }
                                                        
                                                        return (
                                                            <tr key={subtype} className="hover:bg-gray-50 dark:hover:bg-dark-tertiary bg-gray-50 dark:bg-dark-tertiary">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 pl-12">
                                                                    {displayName}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                    {counts.openCount}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                    {counts.completedCount}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                    {counts.totalCount}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                No work items found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        
        {/* Modals */}
        <ModalNewProgram
            isOpen={isNewProgramModalOpen}
            onClose={() => setIsNewProgramModalOpen(false)}
        />
        
        <ModalEditProgram
            isOpen={isEditProgramModalOpen}
            onClose={() => setIsEditProgramModalOpen(false)}
            program={programToEdit}
        />
        
        <ModalNewMilestone
            isOpen={isNewMilestoneModalOpen}
            onClose={() => setIsNewMilestoneModalOpen(false)}
        />
        
        <ModalEditMilestone
            isOpen={isEditMilestoneModalOpen}
            onClose={() => setIsEditMilestoneModalOpen(false)}
            milestone={milestoneToEdit}
        />
        </div>
    )
};

export default Programs;
