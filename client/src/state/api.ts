import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ===================
   ENUMS (matches schema)
=================== */

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "ToDo",
  WorkInProgress = "WorkInProgress",
  UnderReview = "UnderReview",
  Completed = "Completed",
}

export const StatusLabels: Record<Status, string> = {
  [Status.ToDo]: "To Do",
  [Status.WorkInProgress]: "Work In Progress",
  [Status.UnderReview]: "Under Review",
  [Status.Completed]: "Completed",
};

// DeliverableType and IssueType are now table-based models
// Types are fetched from the API instead of using enums
export type DeliverableType = string; // Now a string type from API
export type IssueType = string; // Now a string type from API

// Legacy type labels for display - maps type names to human-readable labels
// Since types now come from the API with proper formatting, these labels are mainly for backward compatibility
// If a type name is not found in the labels, the type name itself is used
export const DeliverableTypeLabels: Record<string, string> = {
  // Legacy camelCase keys for backward compatibility
  "SystemSubsystemRequirementsSpecificationSRS": "System/Subsystem Requirements Specification (SRS)",
  "InterfaceControlDocumentICD": "Interface Control Document (ICD)",
  "PreliminaryDesignReviewPDRPackage": "Preliminary Design Review (PDR) Package",
  "RiskFailureModeEffectsAnalysisFMEADFMEAReport": "Risk/Failure Mode & Effects Analysis (FMEA/DFMEA) Report",
  "DevelopmentVerificationPlanVVMatrix": "Development & Verification Plan / V&V Matrix",
  "EngineeringDrawingCADModel": "Engineering Drawing & CAD Model",
  "BillofMaterialsBOM": "Bill of Materials (BOM)",
  "StressStructuralAnalysisReport": "Stress/Structural Analysis Report",
  "ThermalAnalysisReport": "Thermal Analysis Report",
  "ElectricalSchematicsPCBLayouts": "Electrical Schematics / PCB Layouts",
  "DesignforManufacturabilityDFMDesignforTestDFTReviewReport": "Design for Manufacturability (DFM) & Design for Test (DFT) Review Report",
  "CriticalDesignReviewCDRPackage": "Critical Design Review (CDR) Package",
  "WorkInstructionsAssemblyProcedures": "Work Instructions / Assembly Procedures",
  "FirstArticleInspectionFAIReport": "First Article Inspection (FAI) Report",
  "SupplierQualityRecordsCertificatesofConformanceCoC": "Supplier Quality Records / Certificates of Conformance (CoC)",
  "TestPlansandProcedures": "Test Plans and Procedures",
  "QualificationTestReport": "Qualification Test Report",
  "AcceptanceTestProcedureATPReport": "Acceptance Test Procedure (ATP) & Report",
  "CalibrationCertificates": "Calibration Certificates",
  "NonConformanceCorrectiveActionReportNCRCAR": "Non-Conformance / Corrective Action Report (NCR/CAR)",
  "RequirementsVerificationReport": "Requirements Verification Report",
  "AsBuiltConfigurationEndItemDataPackage": "As-Built Configuration / End-Item Data Package",
  "UserOperationsManual": "User / Operations Manual",
  "MaintenanceRepairManualSparePartsList": "Maintenance & Repair Manual / Spare Parts List",
  "CertificatesofCompliance": "Certificates of Compliance",
  "LessonsLearnedPostProjectReport": "Lessons-Learned & Post-Project Report",
  "Other": "Other",
}

export const IssueTypeLabels: Record<string, string> = {
  // Legacy camelCase keys for backward compatibility
  "Defect": "Defect",
  "Failure": "Failure",
  "RequirementWaiver": "Requirement Waiver",
  "NonConformanceReportNCR": "Non-Conformance Report (NCR)",
  "ProcessManufacturingIssue": "Process / Manufacturing Issue",
  "SupplyChainProcurementIssue": "Supply-Chain / Procurement Issue",
  "IntegrationInterfaceIssue": "Integration / Interface Issue",
  "TestVerificationAnomaly": "Test / Verification Anomaly",
  "EnvironmentalReliabilityIssue": "Environmental / Reliability Issue",
  "ConfigurationDocumentationControlIssue": "Configuration / Documentation Control Issue",
  "SafetyRegulatoryIssue": "Safety / Regulatory Issue",
  "ProgrammaticRiskItem": "Programmatic / Risk Item",
  "ObsolescenceEndOfLifeIssue": "Obsolescence / End-of-Life Issue",
  "Other": "Other",
}

export enum WorkItemType {
  Task = "Task",
  Deliverable = "Deliverable",
  Issue = "Issue",
}

/* ===================
   CORE INTERFACES
=================== */

export interface DisciplineTeamToProgram {
  id: number;
  disciplineTeamId: number;
  programId: number;
  disciplineTeam: DisciplineTeam;
}

export interface Program {
  id: number;
  organizationId: number;
  name: string;
  description?: string;
  programManagerUserId?: number;
  startDate: string;
  endDate: string;

  partNumbers?: Part[];
  disciplineTeams?: DisciplineTeamToProgram[];
  milestones?: Milestone[];
  workItems?: WorkItem[];
}

export interface User {
  userId: number;
  organizationId: number;
  cognitoId: string;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  profilePictureUrl?: string;
  disciplineTeamId?: number;

  disciplineTeam?: DisciplineTeam;
  authoredWorkItems?: WorkItem[];
  assignedWorkItems?: WorkItem[];
  partNumbers?: Part[];
  attachments?: Attachment[];
  comments?: Comment[];
}

export interface Milestone {
  id: number;
  organizationId: number;
  name: string;
  description: string;
  date: string;
  programId: number;

  program?: Program;
  workItems?: WorkItem[];
}

export enum PartState {
  Released = "Released",
  UnderReview = "UnderReview",
  InWork = "InWork",
  Implementation = "Implementation",
}

export const PartStateLabels: Record<PartState, string> = {
  [PartState.Released]: "Released",
  [PartState.UnderReview]: "Under Review",
  [PartState.InWork]: "In Work",
  [PartState.Implementation]: "Implementation",
};

export interface Part {
  id: number;
  organizationId: number;
  code: string;
  partName: string;
  level: number;
  state: PartState;
  revisionLevel: string;
  assignedUserId: number;
  programId: number;
  parentId?: number;

  assignedUser?: User;
  program?: Program;
  parent?: Part;
  children?: Part[];
  workItemLinks?: WorkItemToPart[];
}

export interface WorkItem {
  id: number;
  organizationId: number;
  workItemType: WorkItemType;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags?: string;
  dateOpened: string;
  dueDate: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  percentComplete: number;
  inputStatus: string;
  programId: number;
  dueByMilestoneId: number;
  authorUserId: number;
  assignedUserId: number;

  program: Program;
  dueByMilestone: Milestone;
  authorUser: User;
  assigneeUser: User;
  partNumbers?: WorkItemToPart[];
  partIds?: number[];
  attachments?: Attachment[];
  comments?: Comment[];

  issueDetail?: IssueDetail;
  deliverableDetail?: DeliverableDetail;
}

export interface IssueDetail {
  id: number;
  issueType: string | IssueTypeModel; // Type name (string) or full type object (when included)
  issueTypeId?: number; // Type ID (for new API)
  rootCause?: string;
  correctiveAction?: string;
}

export interface DeliverableDetail {
  id: number;
  deliverableType: string | DeliverableTypeModel; // Type name (string) or full type object (when included)
  deliverableTypeId?: number; // Type ID (for new API)
}

export interface WorkItemToPart {
  id: number;
  workItemId: number;
  partId: number;
  part?: Part;
}

export interface Attachment {
  id: number;
  organizationId: number;
  fileUrl: string;
  fileName: string;
  dateAttached: string;
  uploadedByUserId: number;
  workItemId?: number;
  uploadedByUser?: User;
}

export interface Comment {
  id: number;
  organizationId: number;
  text: string;
  dateCommented: string;
  commenterUserId: number;
  workItemId?: number;
  commenterUser?: User;
}

export interface StatusLog {
  id: number;
  organizationId: number;
  status: string;
  dateLogged: string;
  engineerUserId: number;
  workItemId: number;
  engineerUser?: User;
}

export interface DisciplineTeam {
  id: number;
  organizationId: number;
  name: string;
  description: string;
  teamManagerUserId?: number;
  teamManagerUsername?: string;
  teamManagerName?: string;

  users?: User[];
  programs?: Program[];
}

export interface SearchResults {
  workItems?: WorkItem[];
  programs?: Program[];
  users?: User[];
  milestones?: Milestone[];
  parts?: Part[];
}

export interface Invitation {
  id: number;
  organizationId: number;
  token: string;
  invitedEmail?: string;
  role: string;
  expiresAt: string;
  used: boolean;
  usedAt?: string;
  usedByUserId?: number;
  createdByUserId: number;
  createdAt: string;
  organization?: {
    id: number;
    name: string;
  };
  createdBy?: {
    userId: number;
    name: string;
    email: string;
  };
  usedBy?: {
    userId: number;
    name: string;
    email: string;
  };
}

export interface InvitationCreateInput {
  invitedEmail?: string;
  role: string;
  expiresInDays?: number;
}

export interface DeliverableTypeModel {
  id: number;
  organizationId: number;
  name: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IssueTypeModel {
  id: number;
  organizationId: number;
  name: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeliverableTypeCreateInput {
  name: string;
}

export interface IssueTypeCreateInput {
  name: string;
}

export interface InvitationValidationResponse {
  invitation: {
    id: number;
    invitedEmail?: string;
    role: string;
    expiresAt: string;
    organization: {
      id: number;
      name: string;
    };
    createdBy: {
      name: string;
      email: string;
    };
    createdAt: string;
  };
}

export interface WorkItemCreateInput {
  workItemType: WorkItemType;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  tags?: string;
  dateOpened?: string;
  dueDate: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  percentComplete?: number;
  inputStatus?: string;
  programId: number;
  dueByMilestoneId: number;
  authorUserId: number;
  assignedUserId: number;
  issueDetail?: {
    issueType: IssueType;
    rootCause?: string;
    correctiveAction?: string;
  };
  deliverableDetail?: {
    deliverableType: DeliverableType;
  };
  partIds?: number[];
}

export interface WorkItemEditInput {
  workItemType?: WorkItemType;
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  dateOpened?: string;
  dueDate?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  percentComplete?: number;
  inputStatus?: string;
  programId?: number;
  dueByMilestoneId?: number;
  authorUserId?: number;
  assignedUserId?: number;
  issueDetail?: {
    issueType?: IssueType;
    rootCause?: string;
    correctiveAction?: string;
  };
  deliverableDetail?: {
    deliverableType?: DeliverableType;
  };
  partIds?: number[];
}


/* ===================
   API (RTK Query)
=================== */

export const api = createApi({
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      credentials: 'include', // Include session cookie with all requests
      prepareHeaders: (headers) => {
        if (typeof window !== "undefined") {
          const storedUser = window.localStorage.getItem("authUser");
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser?.userId) {
                const userId = String(parsedUser.userId);
                headers.set("x-user-id", userId);
                console.log("Setting x-user-id header:", userId, "from user:", parsedUser);
              } else {
                console.warn("authUser in localStorage missing userId:", parsedUser);
              }
            } catch (error) {
              console.warn("Failed to parse authUser from localStorage", error);
            }
          } else {
            console.warn("No authUser found in localStorage");
          }
        }
        return headers;
      },
    });

    const result = await baseQuery(args, api, extraOptions);
    
    // Handle 401 errors - session expired or invalid
    if (result.error && 'status' in result.error && result.error.status === 401) {
      const errorData = result.error.data as any;
      
      // If server indicates login is required, redirect to login
      if (errorData?.requiresLogin || errorData?.message?.includes('Session expired') || errorData?.message?.includes('Authentication required')) {
        // Clear local storage
        if (typeof window !== "undefined") {
          localStorage.removeItem("authUser");
          localStorage.removeItem("isAuthenticated");
          
          // Only redirect if we're not already on the onboarding/login page
          const currentPath = window.location.pathname;
          if (!currentPath.startsWith('/onboarding') && !currentPath.startsWith('/auth/')) {
            console.log('Session expired, redirecting to login...');
            window.location.href = '/onboarding';
          }
        }
      }
    }
    
    return result;
  },
      reducerPath: "api",
      tagTypes: ["WorkItems", "Milestones", "Parts", "Programs", "Teams", "Users", "Comments", "StatusLogs", "Attachments", "Invitations", "DeliverableTypes", "IssueTypes"],
  endpoints: (build) => ({
    /* ---------- WORK ITEMS ---------- */
    getWorkItems: build.query<WorkItem[], void>({
        query: () => "workItems",
        providesTags: (result) =>
            result
                ? [
                        ...result.map(({ id }) => ({ type: "WorkItems" as const, id })),
                        { type: "WorkItems", id: "LIST" },
                    ]
                : [{ type: "WorkItems", id: "LIST" }],
    }),

    getWorkItemById: build.query<WorkItem, number>({
        query: (workItemId) => `workItems/${workItemId}`,
        providesTags: (result, error, workItemId) => [{ type: "WorkItems", id: workItemId }],
    }),

    getWorkItemsByProgram: build.query<WorkItem[], { programId: number }>({
        query: ({ programId }) => `workItems?programId=${programId}`,
        providesTags: (result) =>
            result
                ? [
                        ...result.map(({ id }) => ({ type: "WorkItems" as const, id })),
                        { type: "WorkItems", id: "LIST" },
                    ]
                : [{ type: "WorkItems", id: "LIST" }],
    }),

    getWorkItemsByPart: build.query<WorkItem[], { partId: number; includeChildren?: boolean }>({
        query: ({ partId, includeChildren }) => {
            const params = new URLSearchParams({ partId: String(partId) });
            if (includeChildren) {
                params.append("includeChildren", "true");
            }
            return `workItems?${params.toString()}`;
        },
        providesTags: (result) =>
            result
                ? [
                        ...result.map(({ id }) => ({ type: "WorkItems" as const, id })),
                        { type: "WorkItems", id: "LIST" },
                    ]
                : [{ type: "WorkItems", id: "LIST" }],
    }),

    getWorkItemsByUser: build.query<WorkItem[], number>({
        query: (userId) => `workItems/user/${userId}`,
        providesTags: (result) =>
            result
                ? [
                        ...result.map(({ id }) => ({ type: "WorkItems" as const, id })),
                        { type: "WorkItems", id: "LIST" },
                    ]
                : [{ type: "WorkItems", id: "LIST" }],
    }),

    createWorkItem: build.mutation<WorkItem, WorkItemCreateInput>({
        query: (body) => ({
            url: "workItems",
            method: "POST",
            body,
        }),
        invalidatesTags: [{ type: "WorkItems", id: "LIST" }],
    }),

    updateWorkItemStatus: build.mutation<
        WorkItem,
        { workItemId: number; status: string }
    >({
        query: ({ workItemId, status }) => ({
            url: `workItems/${workItemId}/status`,
            method: "PATCH",
            body: { status },
        }),
        // Invalidate the item and the list, so dependent queries refetch
        invalidatesTags: (result, error, { workItemId }) => [
            { type: "WorkItems", id: workItemId },
            { type: "WorkItems", id: "LIST" },
        ],
    }),

    editWorkItem: build.mutation<WorkItem, { workItemId: number; updates: WorkItemEditInput }>({
        query: ({ workItemId, updates }) => ({
            url: `workItems/${workItemId}`,
            method: "PATCH",
            body: updates,
        }),
        invalidatesTags: (result, error, { workItemId }) => [
            { type: "WorkItems", id: workItemId },
            { type: "WorkItems", id: "LIST" },
        ],
    }),

    deleteWorkItem: build.mutation<void, number>({
        query: (workItemId) => ({
            url: `workItems/${workItemId}`,
            method: "DELETE",
        }),
        invalidatesTags: (result, error, workItemId) => [
            { type: "WorkItems", id: workItemId },
            { type: "WorkItems", id: "LIST" },
        ],
    }),

    getCommentsByWorkItem: build.query<Comment[], number>({
        query: (workItemId) => `workItems/${workItemId}/comments`,
        providesTags: (result, error, workItemId) =>
            result
                ? [
                        ...result.map(({ id }) => ({ type: "Comments" as const, id })),
                        { type: "Comments", id: `LIST-${workItemId}` },
                    ]
                : [{ type: "Comments", id: `LIST-${workItemId}` }],
    }),

    createComment: build.mutation<
        Comment,
        { workItemId: number; text: string; commenterUserId: number }
    >({
        query: ({ workItemId, text, commenterUserId }) => ({
            url: `workItems/${workItemId}/comments`,
            method: "POST",
            body: { text, commenterUserId },
        }),
        invalidatesTags: (result, error, { workItemId }) => [
            { type: "Comments", id: `LIST-${workItemId}` },
            { type: "WorkItems", id: workItemId },
        ],
    }),

    updateComment: build.mutation<
        Comment,
        { workItemId: number; commentId: number; text: string; requesterUserId: number }
    >({
        query: ({ workItemId, commentId, text, requesterUserId }) => ({
            url: `workItems/${workItemId}/comments/${commentId}`,
            method: "PATCH",
            body: { text, requesterUserId },
        }),
        invalidatesTags: (result, error, { workItemId, commentId }) => [
            { type: "Comments", id: commentId },
            { type: "Comments", id: `LIST-${workItemId}` },
            { type: "WorkItems", id: workItemId },
        ],
    }),

    deleteComment: build.mutation<
        void,
        { workItemId: number; commentId: number; requesterUserId: number }
    >({
        query: ({ workItemId, commentId, requesterUserId }) => ({
            url: `workItems/${workItemId}/comments/${commentId}`,
            method: "DELETE",
            body: { requesterUserId },
        }),
        invalidatesTags: (result, error, { workItemId, commentId }) => [
            { type: "Comments", id: commentId },
            { type: "Comments", id: `LIST-${workItemId}` },
            { type: "WorkItems", id: workItemId },
        ],
    }),

    getStatusLogsByWorkItem: build.query<StatusLog[], number>({
        query: (workItemId) => `workItems/${workItemId}/statusLogs`,
        providesTags: (result, error, workItemId) =>
            result
                ? [
                        ...result.map(({ id }) => ({ type: "StatusLogs" as const, id })),
                        { type: "StatusLogs", id: `LIST-${workItemId}` },
                    ]
                : [{ type: "StatusLogs", id: `LIST-${workItemId}` }],
    }),

    createStatusLog: build.mutation<
        StatusLog,
        { workItemId: number; status: string; engineerUserId: number }
    >({
        query: ({ workItemId, status, engineerUserId }) => ({
            url: `workItems/${workItemId}/statusLogs`,
            method: "POST",
            body: { status, engineerUserId },
        }),
        invalidatesTags: (result, error, { workItemId }) => [
            { type: "StatusLogs", id: `LIST-${workItemId}` },
            { type: "WorkItems", id: workItemId },
        ],
    }),

    updateStatusLog: build.mutation<
        StatusLog,
        { workItemId: number; statusLogId: number; status: string; requesterUserId: number }
    >({
        query: ({ workItemId, statusLogId, status, requesterUserId }) => ({
            url: `workItems/${workItemId}/statusLogs/${statusLogId}`,
            method: "PATCH",
            body: { status, requesterUserId },
        }),
        invalidatesTags: (result, error, { workItemId, statusLogId }) => [
            { type: "StatusLogs", id: statusLogId },
            { type: "StatusLogs", id: `LIST-${workItemId}` },
            { type: "WorkItems", id: workItemId },
        ],
    }),

    deleteStatusLog: build.mutation<
        void,
        { workItemId: number; statusLogId: number; requesterUserId: number }
    >({
        query: ({ workItemId, statusLogId, requesterUserId }) => ({
            url: `workItems/${workItemId}/statusLogs/${statusLogId}`,
            method: "DELETE",
            body: { requesterUserId },
        }),
        invalidatesTags: (result, error, { workItemId, statusLogId }) => [
            { type: "StatusLogs", id: statusLogId },
            { type: "StatusLogs", id: `LIST-${workItemId}` },
            { type: "WorkItems", id: workItemId },
        ],
    }),

    getAttachmentsByWorkItem: build.query<Attachment[], number>({
        query: (workItemId) => `workItems/${workItemId}/attachments`,
        providesTags: (result, error, workItemId) =>
            result
                ? [
                        ...result.map(({ id }) => ({ type: "Attachments" as const, id })),
                        { type: "Attachments", id: `LIST-${workItemId}` },
                    ]
                : [{ type: "Attachments", id: `LIST-${workItemId}` }],
    }),

    createAttachment: build.mutation<
        Attachment,
        { workItemId: number; fileUrl: string; fileName: string; uploadedByUserId: number }
    >({
        query: ({ workItemId, fileUrl, fileName, uploadedByUserId }) => ({
            url: `workItems/${workItemId}/attachments`,
            method: "POST",
            body: { fileUrl, fileName, uploadedByUserId },
        }),
        invalidatesTags: (result, error, { workItemId }) => [
            { type: "Attachments", id: `LIST-${workItemId}` },
            { type: "WorkItems", id: workItemId },
        ],
    }),

    updateAttachment: build.mutation<
        Attachment,
        { workItemId: number; attachmentId: number; fileName: string; fileUrl: string; requesterUserId: number }
    >({
        query: ({ workItemId, attachmentId, fileName, fileUrl, requesterUserId }) => ({
            url: `workItems/${workItemId}/attachments/${attachmentId}`,
            method: "PATCH",
            body: { fileName, fileUrl, requesterUserId },
        }),
        invalidatesTags: (result, error, { workItemId, attachmentId }) => [
            { type: "Attachments", id: attachmentId },
            { type: "Attachments", id: `LIST-${workItemId}` },
            { type: "WorkItems", id: workItemId },
        ],
    }),

    deleteAttachment: build.mutation<
        void,
        { workItemId: number; attachmentId: number; requesterUserId: number }
    >({
        query: ({ workItemId, attachmentId, requesterUserId }) => ({
            url: `workItems/${workItemId}/attachments/${attachmentId}`,
            method: "DELETE",
            body: { requesterUserId },
        }),
        invalidatesTags: (result, error, { workItemId, attachmentId }) => [
            { type: "Attachments", id: attachmentId },
            { type: "Attachments", id: `LIST-${workItemId}` },
            { type: "WorkItems", id: workItemId },
        ],
    }),


    /* ---------- MILESTONES ---------- */
    getMilestones: build.query<Milestone[], void>({
      query: () => "milestones",
      providesTags: ["Milestones"],
    }),
    getMilestonesByProgram: build.query<Milestone[], { programId: number }>({
      query: ({ programId }) => `milestones?programId=${programId}`,
      providesTags: ["Milestones"],
    }),
    createMilestone: build.mutation<Milestone, Partial<Milestone>>({
      query: (body) => ({
        url: "milestones",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Milestones"],
    }),
    editMilestone: build.mutation<Milestone, { milestoneId: number; updates: Partial<Milestone> }>({
      query: ({ milestoneId, updates }) => ({
        url: `milestones/${milestoneId}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { milestoneId }) => [
        { type: "Milestones", id: milestoneId },
        { type: "Milestones", id: "LIST" },
      ],
    }),

    /* ---------- PARTS ---------- */
    getParts: build.query<Part[], void>({
      query: () => "parts",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Parts" as const, id })),
              { type: "Parts", id: "LIST" },
            ]
          : [{ type: "Parts", id: "LIST" }],
    }),
    getPartsByProgram: build.query<Part[], { programId: number }>({
      query: ({ programId }) => `parts?programId=${programId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Parts" as const, id })),
              { type: "Parts", id: "LIST" },
            ]
          : [{ type: "Parts", id: "LIST" }],
    }),
    getPartsByUser: build.query<Part[], number>({
      query: (userId) => `parts/user/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Parts" as const, id })),
              { type: "Parts", id: "LIST" },
            ]
          : [{ type: "Parts", id: "LIST" }],
    }),
    createPart: build.mutation<Part, Partial<Part>>({
      query: (body) => ({
        url: "parts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Parts"],
    }),
    editPart: build.mutation<Part, { partId: number; updates: Partial<Part> }>({
      query: ({ partId, updates }) => ({
        url: `parts/${partId}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { partId }) => [
        { type: "Parts", id: partId },
        { type: "Parts", id: "LIST" },
      ],
    }),
    deletePart: build.mutation<void, number>({
      query: (partId) => ({
        url: `parts/${partId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, partId) => [
        { type: "Parts", id: partId },
        { type: "Parts", id: "LIST" },
      ],
    }),

    /* ---------- PROGRAMS ---------- */
    getPrograms: build.query<Program[], void>({
      query: () => "programs",
      providesTags: ["Programs"],
    }),
    createProgram: build.mutation<Program, Partial<Program>>({
      query: (body) => ({
        url: "programs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Programs"],
    }),
    editProgram: build.mutation<Program, { programId: number; updates: Partial<Program> }>({
      query: ({ programId, updates }) => ({
        url: `programs/${programId}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { programId }) => [
        { type: "Programs", id: programId },
        { type: "Programs", id: "LIST" },
      ],
    }),

    /* ---------- TEAMS ---------- */
    getTeams: build.query<DisciplineTeam[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    createTeam: build.mutation<DisciplineTeam, Partial<DisciplineTeam>>({
      query: (body) => ({
        url: "teams",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teams"],
    }),
    editTeam: build.mutation<DisciplineTeam, { teamId: number; updates: Partial<DisciplineTeam> }>({
      query: ({ teamId, updates }) => ({
        url: `teams/${teamId}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: "Teams", id: teamId },
        { type: "Teams", id: "LIST" },
      ],
    }),

    /* ---------- USERS ---------- */
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    getUserById: build.query<User, number>({
      query: (userId) => `users/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Users", id: userId }],
    }),

    createUser: build.mutation<User, Partial<User> & { cognitoId: string; username: string; name: string; email: string; phoneNumber: string; role: string }>({
      query: (userData) => ({
        url: "users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: build.mutation<User, { userId: number; data: Partial<User> }>({
      query: ({ userId, data }) => ({
        url: `users/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Users", id: userId },
        "Users",
      ],
    }),

    /* ---------- SEARCH ---------- */
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),

    /* ---------- INVITATIONS ---------- */
    getInvitations: build.query<Invitation[], void>({
      query: () => "invitations",
      providesTags: ["Invitations"],
    }),
    validateInvitation: build.query<InvitationValidationResponse, string>({
      query: (token) => `invitations/validate/${token}`,
      // Don't cache this - always fetch fresh
    }),
    createInvitation: build.mutation<{ invitation: Invitation; invitationUrl: string }, InvitationCreateInput>({
      query: (body) => ({
        url: "invitations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Invitations"],
    }),
    revokeInvitation: build.mutation<void, number>({
      query: (invitationId) => ({
        url: `invitations/${invitationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invitations"],
    }),

    /* ---------- DELIVERABLE TYPES ---------- */
    getDeliverableTypes: build.query<DeliverableTypeModel[], void>({
      query: () => "deliverableTypes",
      providesTags: ["DeliverableTypes"],
    }),
    createDeliverableType: build.mutation<DeliverableTypeModel, DeliverableTypeCreateInput>({
      query: (body) => ({
        url: "deliverableTypes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DeliverableTypes"],
    }),
    deleteDeliverableType: build.mutation<void, number>({
      query: (typeId) => ({
        url: `deliverableTypes/${typeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeliverableTypes"],
    }),

    /* ---------- ISSUE TYPES ---------- */
    getIssueTypes: build.query<IssueTypeModel[], void>({
      query: () => "issueTypes",
      providesTags: ["IssueTypes"],
    }),
    createIssueType: build.mutation<IssueTypeModel, IssueTypeCreateInput>({
      query: (body) => ({
        url: "issueTypes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["IssueTypes"],
    }),
    deleteIssueType: build.mutation<void, number>({
      query: (typeId) => ({
        url: `issueTypes/${typeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["IssueTypes"],
    }),
  }),
});

/* ===================
   HOOK EXPORTS
=================== */
export const {
  useGetWorkItemsQuery,
  useGetWorkItemByIdQuery,
  useGetWorkItemsByProgramQuery,
  useGetWorkItemsByPartQuery,
  useGetWorkItemsByUserQuery,
  useCreateWorkItemMutation,
  useUpdateWorkItemStatusMutation,
  useEditWorkItemMutation,
  useDeleteWorkItemMutation,
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

  useGetMilestonesQuery,
  useGetMilestonesByProgramQuery,
  useCreateMilestoneMutation,
  useEditMilestoneMutation,

  useGetPartsQuery,
  useGetPartsByProgramQuery,
  useGetPartsByUserQuery,
  useCreatePartMutation,
  useEditPartMutation,
  useDeletePartMutation,

  useGetProgramsQuery,
  useCreateProgramMutation,
  useEditProgramMutation,

  useGetTeamsQuery,
  useCreateTeamMutation,
  useEditTeamMutation,

  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,

  useSearchQuery,

  useGetInvitationsQuery,
  useValidateInvitationQuery,
  useCreateInvitationMutation,
  useRevokeInvitationMutation,

  useGetDeliverableTypesQuery,
  useCreateDeliverableTypeMutation,
  useDeleteDeliverableTypeMutation,

  useGetIssueTypesQuery,
  useCreateIssueTypeMutation,
  useDeleteIssueTypeMutation,
} = api;