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

export enum DeliverableType {
  SystemSubsystemRequirementsSpecificationSRS = "SystemSubsystemRequirementsSpecificationSRS",
  InterfaceControlDocumentICD = "InterfaceControlDocumentICD",
  PreliminaryDesignReviewPDRPackage = "PreliminaryDesignReviewPDRPackage",
  RiskFailureModeEffectsAnalysisFMEADFMEAReport = "RiskFailureModeEffectsAnalysisFMEADFMEAReport",
  DevelopmentVerificationPlanVVMatrix = "DevelopmentVerificationPlanVVMatrix",
  EngineeringDrawingCADModel = "EngineeringDrawingCADModel",
  BillofMaterialsBOM = "BillofMaterialsBOM",
  StressStructuralAnalysisReport = "StressStructuralAnalysisReport",
  ThermalAnalysisReport = "ThermalAnalysisReport",
  ElectricalSchematicsPCBLayouts = "ElectricalSchematicsPCBLayouts",
  DesignforManufacturabilityDFMDesignforTestDFTReviewReport = "DesignforManufacturabilityDFMDesignforTestDFTReviewReport",
  CriticalDesignReviewCDRPackage = "CriticalDesignReviewCDRPackage",
  WorkInstructionsAssemblyProcedures = "WorkInstructionsAssemblyProcedures",
  FirstArticleInspectionFAIReport = "FirstArticleInspectionFAIReport",
  SupplierQualityRecordsCertificatesofConformanceCoC = "SupplierQualityRecordsCertificatesofConformanceCoC",
  TestPlansandProcedures = "TestPlansandProcedures",
  QualificationTestReport = "QualificationTestReport",
  AcceptanceTestProcedureATPReport = "AcceptanceTestProcedureATPReport",
  CalibrationCertificates = "CalibrationCertificates",
  NonConformanceCorrectiveActionReportNCRCAR = "NonConformanceCorrectiveActionReportNCRCAR",
  RequirementsVerificationReport = "RequirementsVerificationReport",
  AsBuiltConfigurationEndItemDataPackage = "AsBuiltConfigurationEndItemDataPackage",
  UserOperationsManual = "UserOperationsManual",
  MaintenanceRepairManualSparePartsList = "MaintenanceRepairManualSparePartsList",
  CertificatesofCompliance = "CertificatesofCompliance",
  LessonsLearnedPostProjectReport = "LessonsLearnedPostProjectReport",
  Other = "Other",
}

export const DeliverableTypeLabels: Record<DeliverableType, string> = {
  [DeliverableType.SystemSubsystemRequirementsSpecificationSRS]: "System/Subsystem Requirements Specification (SRS)",
  [DeliverableType.InterfaceControlDocumentICD]: "Interface Control Document (ICD)",
  [DeliverableType.PreliminaryDesignReviewPDRPackage]: "Preliminary Design Review (PDR) Package",
  [DeliverableType.RiskFailureModeEffectsAnalysisFMEADFMEAReport]: "Risk/Failure Mode & Effects Analysis (FMEA/DFMEA) Report",
  [DeliverableType.DevelopmentVerificationPlanVVMatrix]: "Development & Verification Plan / V&V Matrix",
  [DeliverableType.EngineeringDrawingCADModel]: "Engineering Drawing & CAD Model",
  [DeliverableType.BillofMaterialsBOM]: "Bill of Materials (BOM)",
  [DeliverableType.StressStructuralAnalysisReport]: "Stress/Structural Analysis Report",
  [DeliverableType.ThermalAnalysisReport]: "Thermal Analysis Report",
  [DeliverableType.ElectricalSchematicsPCBLayouts]: "Electrical Schematics / PCB Layouts",
  [DeliverableType.DesignforManufacturabilityDFMDesignforTestDFTReviewReport]: "Design for Manufacturability (DFM) & Design for Test (DFT) Review Report",
  [DeliverableType.CriticalDesignReviewCDRPackage]: "Critical Design Review (CDR) Package",
  [DeliverableType.WorkInstructionsAssemblyProcedures]: "Work Instructions / Assembly Procedures",
  [DeliverableType.FirstArticleInspectionFAIReport]: "First Article Inspection (FAI) Report",
  [DeliverableType.SupplierQualityRecordsCertificatesofConformanceCoC]: "Supplier Quality Records / Certificates of Conformance (CoC)",
  [DeliverableType.TestPlansandProcedures]: "Test Plans and Procedures",
  [DeliverableType.QualificationTestReport]: "Qualification Test Report",
  [DeliverableType.AcceptanceTestProcedureATPReport]: "Acceptance Test Procedure (ATP) & Report",
  [DeliverableType.CalibrationCertificates]: "Calibration Certificates",
  [DeliverableType.NonConformanceCorrectiveActionReportNCRCAR]: "Non-Conformance / Corrective Action Report (NCR/CAR)",
  [DeliverableType.RequirementsVerificationReport]: "Requirements Verification Report",
  [DeliverableType.AsBuiltConfigurationEndItemDataPackage]: "As-Built Configuration / End-Item Data Package",
  [DeliverableType.UserOperationsManual]: "User / Operations Manual",
  [DeliverableType.MaintenanceRepairManualSparePartsList]: "Maintenance & Repair Manual / Spare Parts List",
  [DeliverableType.CertificatesofCompliance]: "Certificates of Compliance",
  [DeliverableType.LessonsLearnedPostProjectReport]: "Lessons-Learned & Post-Project Report",
  [DeliverableType.Other]: "Other",
}

export enum IssueType {
  Defect = "Defect",
  Failure = "Failure",
  RequirementWaiver = "RequirementWaiver",
  NonConformanceReportNCR = "NonConformanceReportNCR",
  ProcessManufacturingIssue = "ProcessManufacturingIssue",
  SupplyChainProcurementIssue = "SupplyChainProcurementIssue",
  IntegrationInterfaceIssue = "IntegrationInterfaceIssue",
  TestVerificationAnomaly = "TestVerificationAnomaly",
  EnvironmentalReliabilityIssue = "EnvironmentalReliabilityIssue",
  ConfigurationDocumentationControlIssue = "ConfigurationDocumentationControlIssue",
  SafetyRegulatoryIssue = "SafetyRegulatoryIssue",
  ProgrammaticRiskItem = "ProgrammaticRiskItem",
  ObsolescenceEndOfLifeIssue = "ObsolescenceEndOfLifeIssue",
  Other = "Other",
}

export const IssueTypeLabels: Record<IssueType, string> = {
  [IssueType.Defect]: "Defect",
  [IssueType.Failure]: "Failure",
  [IssueType.RequirementWaiver]: "Requirement Waiver",
  [IssueType.NonConformanceReportNCR]: "Non-Conformance Report (NCR)",
  [IssueType.ProcessManufacturingIssue]: "Process / Manufacturing Issue",
  [IssueType.SupplyChainProcurementIssue]: "Supply-Chain / Procurement Issue",
  [IssueType.IntegrationInterfaceIssue]: "Integration / Interface Issue",
  [IssueType.TestVerificationAnomaly]: "Test / Verification Anomaly",
  [IssueType.EnvironmentalReliabilityIssue]: "Environmental / Reliability Issue",
  [IssueType.ConfigurationDocumentationControlIssue]: "Configuration / Documentation Control Issue",
  [IssueType.SafetyRegulatoryIssue]: "Safety / Regulatory Issue",
  [IssueType.ProgrammaticRiskItem]: "Programmatic / Risk Item",
  [IssueType.ObsolescenceEndOfLifeIssue]: "Obsolescence / End-of-Life Issue",
  [IssueType.Other]: "Other",
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
  issueType: IssueType;
  rootCause?: string;
  correctiveAction?: string;
}

export interface DeliverableDetail {
  id: number;
  deliverableType: DeliverableType;
}

export interface WorkItemToPart {
  id: number;
  workItemId: number;
  partId: number;
  part?: Part;
}

export interface Attachment {
  id: number;
  fileUrl: string;
  fileName: string;
  dateAttached: string;
  uploadedByUserId: number;
  workItemId?: number;
}

export interface Comment {
  id: number;
  text: string;
  dateCommented: string;
  commenterUserId: number;
  workItemId?: number;
  commenterUser?: User;
}

export interface DisciplineTeam {
  id: number;
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
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["WorkItems", "Milestones", "Parts", "Programs", "Teams", "Users", "Comments"],
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
} = api;