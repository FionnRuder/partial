import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { useGetWorkItemsByPartQuery, WorkItemType, Status, Priority, WorkItem } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import ModalEditWorkItem from "@/components/ModalEditWorkItem";
import { PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  setIsModalNewWorkItemOpen: (isOpen: boolean) => void;
  searchQuery: string;
  includeChildren: boolean;
};

// Helper function to filter work items based on search query
const filterWorkItemsBySearch = (workItems: WorkItem[], searchQuery: string) => {
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

const columns: GridColDef[] = [
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
    minWidth: 250,
    flex: 2,
  },
  {
    field: "description",
    headerName: "Description",
    minWidth: 300,
    flex: 2,
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
    field: "tags",
    headerName: "Tags",
    width: 150,
    renderCell: (params) => params.value || "N/A",
  },
  {
    field: "dateOpened",
    headerName: "Date Opened",
    width: 120,
    renderCell: (params) => formatDate(params.value),
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
    field: "actualCompletionDate",
    headerName: "Actual Completion",
    width: 140,
    renderCell: (params) => formatDate(params.value),
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
    width: 130,
    renderCell: (params) => params.value || "N/A",
  },
  {
    field: "program",
    headerName: "Program",
    width: 150,
    renderCell: (params) => params.value || "N/A",
  },
  {
    field: "dueByMilestone",
    headerName: "Milestone",
    width: 150,
    renderCell: (params) => params.value || "N/A",
  },
  {
    field: "authorUser",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value || "Unknown",
  },
  {
    field: "assigneeUser",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value || "Unassigned",
  },
  {
    field: "issueDetail",
    headerName: "Issue Type",
    width: 180,
    valueGetter: (value, row) => {
      // Ensure we return a string value
      // Handle nested structure: issueDetail.issueType.name
      if (typeof row.issueDetail === "string") {
        return row.issueDetail;
      }
      if (typeof row.issueDetail === "object" && row.issueDetail !== null) {
        const issueDetail = row.issueDetail as any;
        if (issueDetail.issueType) {
          if (typeof issueDetail.issueType === "object" && issueDetail.issueType !== null) {
            return issueDetail.issueType.name ? String(issueDetail.issueType.name) : "N/A";
          } else if (typeof issueDetail.issueType === "string") {
            return issueDetail.issueType;
          }
        }
      }
      return "N/A";
    },
    renderCell: (params) => {
      // Defensive check: ensure we have a string value
      // Check both params.value and params.row.issueDetail as fallback
      let displayValue = "N/A";
      
      // First try params.value (from valueGetter)
      if (params.value && typeof params.value === "string") {
        displayValue = params.value;
      }
      
      // If still N/A, try params.row as fallback with nested structure handling
      if (displayValue === "N/A" && params.row.issueDetail) {
        if (typeof params.row.issueDetail === "string") {
          displayValue = params.row.issueDetail;
        } else if (typeof params.row.issueDetail === "object" && params.row.issueDetail !== null) {
          const issueDetail = params.row.issueDetail as any;
          if (issueDetail.issueType) {
            if (typeof issueDetail.issueType === "object" && issueDetail.issueType !== null) {
              displayValue = issueDetail.issueType.name ? String(issueDetail.issueType.name) : "N/A";
            } else if (typeof issueDetail.issueType === "string") {
              displayValue = issueDetail.issueType;
            }
          }
        }
      }
      
      if (displayValue && displayValue !== "N/A") {
        return (
          <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
            {displayValue}
          </span>
        );
      }
      return "N/A";
    },
  },
  {
    field: "rootCause",
    headerName: "Root Cause",
    width: 200,
    flex: 1,
    renderCell: (params) => {
      const value = typeof params.value === "string" ? params.value : "N/A";
      return (
        <span className="text-xs">
          {value}
        </span>
      );
    },
  },
  {
    field: "correctiveAction",
    headerName: "Corrective Action",
    width: 200,
    flex: 1,
    renderCell: (params) => {
      const value = typeof params.value === "string" ? params.value : "N/A";
      return (
        <span className="text-xs">
          {value}
        </span>
      );
    },
  },
  {
    field: "deliverableDetail",
    headerName: "Deliverable Type",
    width: 200,
    valueGetter: (value, row) => {
      // Ensure we return a string value
      // Handle nested structure: deliverableDetail.deliverableType.name
      if (typeof row.deliverableDetail === "string") {
        return row.deliverableDetail;
      }
      if (typeof row.deliverableDetail === "object" && row.deliverableDetail !== null) {
        const deliverableDetail = row.deliverableDetail as any;
        if (deliverableDetail.deliverableType) {
          if (typeof deliverableDetail.deliverableType === "object" && deliverableDetail.deliverableType !== null) {
            return deliverableDetail.deliverableType.name ? String(deliverableDetail.deliverableType.name) : "N/A";
          } else if (typeof deliverableDetail.deliverableType === "string") {
            return deliverableDetail.deliverableType;
          }
        }
      }
      return "N/A";
    },
    renderCell: (params) => {
      // Defensive check: ensure we have a string value
      // Check both params.value and params.row.deliverableDetail as fallback
      let displayValue = "N/A";
      
      // First try params.value (from valueGetter)
      if (params.value && typeof params.value === "string") {
        displayValue = params.value;
      }
      
      // If still N/A, try params.row as fallback with nested structure handling
      if (displayValue === "N/A" && params.row.deliverableDetail) {
        if (typeof params.row.deliverableDetail === "string") {
          displayValue = params.row.deliverableDetail;
        } else if (typeof params.row.deliverableDetail === "object" && params.row.deliverableDetail !== null) {
          const deliverableDetail = params.row.deliverableDetail as any;
          if (deliverableDetail.deliverableType) {
            if (typeof deliverableDetail.deliverableType === "object" && deliverableDetail.deliverableType !== null) {
              displayValue = deliverableDetail.deliverableType.name ? String(deliverableDetail.deliverableType.name) : "N/A";
            } else if (typeof deliverableDetail.deliverableType === "string") {
              displayValue = deliverableDetail.deliverableType;
            }
          }
        }
      }
      
      if (displayValue && displayValue !== "N/A") {
        return (
          <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800">
            {displayValue}
          </span>
        );
      }
      return "N/A";
    },
  },
];

const TableView = ({ id, setIsModalNewWorkItemOpen, searchQuery, includeChildren }: Props) => {
  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [workItemFilter, setWorkItemFilter] = React.useState<"all" | "open">("all");
  const [editingWorkItem, setEditingWorkItem] = React.useState<WorkItem | null>(null);
  
  const {
    data: workItems,
    error,
    isLoading,
  } = useGetWorkItemsByPartQuery({ partId: Number(id), includeChildren });

  if (isLoading) return <div>Loading...</div>;
  if (error || !workItems) return <div>An error occurred while fetching work items</div>;

  // Filter work items based on the toggle and search query
  let filteredWorkItems = workItemFilter === "open"
    ? workItems.filter((item) => item.status !== Status.Completed)
    : workItems;
  
  // Apply search filter
  filteredWorkItems = filterWorkItemsBySearch(filteredWorkItems, searchQuery);

  // Transform work items to flatten nested objects for DataGrid
  // This prevents DataGrid from trying to render objects directly
  // We explicitly create a new object with only primitive values
  const transformedWorkItems = filteredWorkItems.map((item) => {
    // Helper to safely extract string from object or return string as-is
    const getStringValue = (value: any, extractor?: (obj: any) => string): string => {
      if (!value) return "N/A";
      if (typeof value === "string") {
        // If it's already a string, check if it's JSON (shouldn't happen but be safe)
        if (value.startsWith("{") && value.startsWith("{")) {
          try {
            const parsed = JSON.parse(value);
            if (extractor && typeof parsed === "object") {
              return extractor(parsed) || "N/A";
            }
          } catch {
            // Not valid JSON, return as-is
          }
        }
        return value;
      }
      if (typeof value === "object" && extractor) {
        const extracted = extractor(value);
        return extracted || "N/A";
      }
      return "N/A";
    };
    
    // Extract issue type and deliverable type strings explicitly
    // Note: issueDetail and deliverableDetail have nested structure:
    // issueDetail: { issueType: { name: "..." } }
    // deliverableDetail: { deliverableType: { name: "..." } }
    let issueTypeString = "N/A";
    if (item.workItemType === WorkItemType.Issue && item.issueDetail) {
      if (typeof item.issueDetail === "object" && item.issueDetail !== null && !Array.isArray(item.issueDetail)) {
        const issueDetail = item.issueDetail as any;
        // Check if issueType is a nested object with a name property
        if (issueDetail.issueType) {
          if (typeof issueDetail.issueType === "object" && issueDetail.issueType !== null) {
            // It's a nested object, extract the name
            issueTypeString = issueDetail.issueType.name ? String(issueDetail.issueType.name) : "N/A";
          } else if (typeof issueDetail.issueType === "string") {
            // It's already a string
            issueTypeString = issueDetail.issueType;
          }
        }
      } else if (typeof item.issueDetail === "string") {
        issueTypeString = item.issueDetail;
      }
    }
    
    let deliverableTypeString = "N/A";
    if (item.workItemType === WorkItemType.Deliverable && item.deliverableDetail) {
      if (typeof item.deliverableDetail === "object" && item.deliverableDetail !== null && !Array.isArray(item.deliverableDetail)) {
        const deliverableDetail = item.deliverableDetail as any;
        // Check if deliverableType is a nested object with a name property
        if (deliverableDetail.deliverableType) {
          if (typeof deliverableDetail.deliverableType === "object" && deliverableDetail.deliverableType !== null) {
            // It's a nested object, extract the name
            deliverableTypeString = deliverableDetail.deliverableType.name ? String(deliverableDetail.deliverableType.name) : "N/A";
          } else if (typeof deliverableDetail.deliverableType === "string") {
            // It's already a string
            deliverableTypeString = deliverableDetail.deliverableType;
          }
        }
      } else if (typeof item.deliverableDetail === "string") {
        deliverableTypeString = item.deliverableDetail;
      }
    }
    
    // Ensure these are definitely strings, not objects
    issueTypeString = typeof issueTypeString === "string" ? issueTypeString : "N/A";
    deliverableTypeString = typeof deliverableTypeString === "string" ? deliverableTypeString : "N/A";
    
    // Extract primitive values explicitly to avoid any object references
    const transformed: any = {
      id: item.id,
      organizationId: item.organizationId,
      workItemType: item.workItemType,
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      tags: item.tags,
      dateOpened: item.dateOpened,
      dueDate: item.dueDate,
      estimatedCompletionDate: item.estimatedCompletionDate,
      actualCompletionDate: item.actualCompletionDate,
      percentComplete: item.percentComplete,
      inputStatus: item.inputStatus,
      programId: item.programId,
      dueByMilestoneId: item.dueByMilestoneId,
      authorUserId: item.authorUserId,
      assignedUserId: item.assignedUserId,
      // Convert object fields to strings - ensure they're always strings
      program: getStringValue(item.program, (p) => p.name),
      dueByMilestone: getStringValue(item.dueByMilestone, (m) => m.name),
      authorUser: getStringValue(item.authorUser, (u) => u.name || u.username),
      assigneeUser: getStringValue(item.assigneeUser, (u) => u.name || u.username),
      // Use explicitly extracted strings - double-check they're strings
      issueDetail: typeof issueTypeString === "string" ? issueTypeString : "N/A",
      deliverableDetail: typeof deliverableTypeString === "string" ? deliverableTypeString : "N/A",
      // Extract nested fields from issueDetail for rootCause and correctiveAction columns
      rootCause: item.workItemType === WorkItemType.Issue && item.issueDetail && typeof item.issueDetail === "object"
        ? (item.issueDetail.rootCause || "N/A")
        : "N/A",
      correctiveAction: item.workItemType === WorkItemType.Issue && item.issueDetail && typeof item.issueDetail === "object"
        ? (item.issueDetail.correctiveAction || "N/A")
        : "N/A",
    };
    
    // Final safety check: ensure all values are primitives (no objects or arrays)
    // Special handling for issueDetail and deliverableDetail to ensure they're strings
    Object.keys(transformed).forEach(key => {
      const value = transformed[key];
      if (value !== null && value !== undefined) {
        if (typeof value === "object" && !Array.isArray(value)) {
          // Special handling for issueDetail and deliverableDetail with nested structure
          if (key === "issueDetail" && (value as any).issueType) {
            const issueType = (value as any).issueType;
            if (typeof issueType === "object" && issueType !== null && issueType.name) {
              transformed[key] = String(issueType.name);
            } else if (typeof issueType === "string") {
              transformed[key] = issueType;
            } else {
              transformed[key] = "N/A";
            }
          } else if (key === "deliverableDetail" && (value as any).deliverableType) {
            const deliverableType = (value as any).deliverableType;
            if (typeof deliverableType === "object" && deliverableType !== null && deliverableType.name) {
              transformed[key] = String(deliverableType.name);
            } else if (typeof deliverableType === "string") {
              transformed[key] = deliverableType;
            } else {
              transformed[key] = "N/A";
            }
          } else {
            // This shouldn't happen, but if it does, set to N/A (don't stringify)
            console.warn(`Unexpected object in transformed data at key "${key}":`, value);
            transformed[key] = "N/A";
          }
        } else if (Array.isArray(value)) {
          // Arrays should also be excluded
          transformed[key] = "N/A";
        }
      }
    });
    
    // Final verification: ensure issueDetail and deliverableDetail are strings
    if (typeof transformed.issueDetail !== "string") {
      console.warn("issueDetail is not a string:", transformed.issueDetail, typeof transformed.issueDetail);
      // Try to extract from object if it's still an object
      if (typeof transformed.issueDetail === "object" && transformed.issueDetail !== null) {
        transformed.issueDetail = (transformed.issueDetail as any).issueType ? String((transformed.issueDetail as any).issueType) : "N/A";
      } else {
        transformed.issueDetail = "N/A";
      }
    }
    if (typeof transformed.deliverableDetail !== "string") {
      console.warn("deliverableDetail is not a string:", transformed.deliverableDetail, typeof transformed.deliverableDetail);
      // Try to extract from object if it's still an object
      if (typeof transformed.deliverableDetail === "object" && transformed.deliverableDetail !== null) {
        transformed.deliverableDetail = (transformed.deliverableDetail as any).deliverableType ? String((transformed.deliverableDetail as any).deliverableType) : "N/A";
      } else {
        transformed.deliverableDetail = "N/A";
      }
    }
    
    // Debug: log first item to verify transformation (only log once)
    if (filteredWorkItems.indexOf(item) === 0) {
      console.log("Sample transformed item:", {
        id: transformed.id,
        workItemType: transformed.workItemType,
        issueDetail: transformed.issueDetail,
        deliverableDetail: transformed.deliverableDetail,
        issueDetailType: typeof transformed.issueDetail,
        deliverableDetailType: typeof transformed.deliverableDetail,
        originalIssueDetail: item.issueDetail,
        originalDeliverableDetail: item.deliverableDetail,
      });
    }
    
    return transformed;
  });

  return (
    <div className="h-[calc(100vh-250px)] w-full px-4 pb-8 xl:px-6">
      {editingWorkItem && (
        <ModalEditWorkItem
          isOpen={!!editingWorkItem}
          onClose={() => setEditingWorkItem(null)}
          workItem={editingWorkItem}
        />
      )}
      <div className="pt-5">
        <div className="mb-4 flex items-center justify-between">
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
          
          <button
            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewWorkItemOpen(true)}
          >
            <PlusSquare className="mr-2 h-5 w-5" />New Work Item
          </button>
        </div>
      </div>
      <DataGrid
        rows={transformedWorkItems || []}
        columns={columns}
        className={dataGridClassNames}
        showToolbar
        sx={dataGridSxStyles(isDarkMode)}
        autoHeight={false}
        pagination
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
          sorting: {
            sortModel: [{ field: 'dueDate', sort: 'asc' }],
          },
        }}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
        onRowClick={(params) => router.push(`/work-items/${params.row.id}`)}
      />
    </div>
  );
};

export default TableView;