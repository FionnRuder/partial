module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/state/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "globalSlice",
    ()=>globalSlice,
    "setIsDarkMode",
    ()=>setIsDarkMode,
    "setIsSidebarCollapsed",
    ()=>setIsSidebarCollapsed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
const initialState = {
    isSidebarCollapsed: false,
    isDarkMode: false
};
const globalSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "global",
    initialState,
    reducers: {
        setIsSidebarCollapsed: (state, action)=>{
            state.isSidebarCollapsed = action.payload;
        },
        setIsDarkMode: (state, action)=>{
            state.isDarkMode = action.payload;
        }
    }
});
const { setIsSidebarCollapsed, setIsDarkMode } = globalSlice.actions;
const __TURBOPACK__default__export__ = globalSlice.reducer;
}),
"[project]/src/state/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuditAction",
    ()=>AuditAction,
    "DeliverableTypeLabels",
    ()=>DeliverableTypeLabels,
    "IssueTypeLabels",
    ()=>IssueTypeLabels,
    "PartState",
    ()=>PartState,
    "PartStateLabels",
    ()=>PartStateLabels,
    "Priority",
    ()=>Priority,
    "Status",
    ()=>Status,
    "StatusLabels",
    ()=>StatusLabels,
    "WorkItemType",
    ()=>WorkItemType,
    "api",
    ()=>api,
    "useCreateAttachmentMutation",
    ()=>useCreateAttachmentMutation,
    "useCreateCommentMutation",
    ()=>useCreateCommentMutation,
    "useCreateDeliverableTypeMutation",
    ()=>useCreateDeliverableTypeMutation,
    "useCreateFeedbackMutation",
    ()=>useCreateFeedbackMutation,
    "useCreateInvitationMutation",
    ()=>useCreateInvitationMutation,
    "useCreateIssueTypeMutation",
    ()=>useCreateIssueTypeMutation,
    "useCreateMilestoneMutation",
    ()=>useCreateMilestoneMutation,
    "useCreatePartMutation",
    ()=>useCreatePartMutation,
    "useCreateProgramMutation",
    ()=>useCreateProgramMutation,
    "useCreateStatusLogMutation",
    ()=>useCreateStatusLogMutation,
    "useCreateTeamMutation",
    ()=>useCreateTeamMutation,
    "useCreateUserMutation",
    ()=>useCreateUserMutation,
    "useCreateWorkItemMutation",
    ()=>useCreateWorkItemMutation,
    "useDeleteAttachmentMutation",
    ()=>useDeleteAttachmentMutation,
    "useDeleteCommentMutation",
    ()=>useDeleteCommentMutation,
    "useDeleteDeliverableTypeMutation",
    ()=>useDeleteDeliverableTypeMutation,
    "useDeleteIssueTypeMutation",
    ()=>useDeleteIssueTypeMutation,
    "useDeletePartMutation",
    ()=>useDeletePartMutation,
    "useDeleteStatusLogMutation",
    ()=>useDeleteStatusLogMutation,
    "useDeleteWorkItemMutation",
    ()=>useDeleteWorkItemMutation,
    "useEditMilestoneMutation",
    ()=>useEditMilestoneMutation,
    "useEditPartMutation",
    ()=>useEditPartMutation,
    "useEditProgramMutation",
    ()=>useEditProgramMutation,
    "useEditTeamMutation",
    ()=>useEditTeamMutation,
    "useEditWorkItemMutation",
    ()=>useEditWorkItemMutation,
    "useGetAttachmentsByWorkItemQuery",
    ()=>useGetAttachmentsByWorkItemQuery,
    "useGetAuditLogByIdQuery",
    ()=>useGetAuditLogByIdQuery,
    "useGetAuditLogStatsQuery",
    ()=>useGetAuditLogStatsQuery,
    "useGetAuditLogsQuery",
    ()=>useGetAuditLogsQuery,
    "useGetCommentsByWorkItemQuery",
    ()=>useGetCommentsByWorkItemQuery,
    "useGetDeliverableTypesQuery",
    ()=>useGetDeliverableTypesQuery,
    "useGetEmailPreferencesQuery",
    ()=>useGetEmailPreferencesQuery,
    "useGetEntityAuditLogsQuery",
    ()=>useGetEntityAuditLogsQuery,
    "useGetFeedbackByIdQuery",
    ()=>useGetFeedbackByIdQuery,
    "useGetFeedbackQuery",
    ()=>useGetFeedbackQuery,
    "useGetInvitationsQuery",
    ()=>useGetInvitationsQuery,
    "useGetIssueTypesQuery",
    ()=>useGetIssueTypesQuery,
    "useGetMilestonesByProgramQuery",
    ()=>useGetMilestonesByProgramQuery,
    "useGetMilestonesQuery",
    ()=>useGetMilestonesQuery,
    "useGetMyFeedbackQuery",
    ()=>useGetMyFeedbackQuery,
    "useGetPartsByProgramQuery",
    ()=>useGetPartsByProgramQuery,
    "useGetPartsByUserQuery",
    ()=>useGetPartsByUserQuery,
    "useGetPartsQuery",
    ()=>useGetPartsQuery,
    "useGetProgramsQuery",
    ()=>useGetProgramsQuery,
    "useGetStatusLogsByWorkItemQuery",
    ()=>useGetStatusLogsByWorkItemQuery,
    "useGetTeamsQuery",
    ()=>useGetTeamsQuery,
    "useGetUnreadFeedbackCountQuery",
    ()=>useGetUnreadFeedbackCountQuery,
    "useGetUserByIdQuery",
    ()=>useGetUserByIdQuery,
    "useGetUsersQuery",
    ()=>useGetUsersQuery,
    "useGetWorkItemByIdQuery",
    ()=>useGetWorkItemByIdQuery,
    "useGetWorkItemsByPartQuery",
    ()=>useGetWorkItemsByPartQuery,
    "useGetWorkItemsByProgramQuery",
    ()=>useGetWorkItemsByProgramQuery,
    "useGetWorkItemsByUserQuery",
    ()=>useGetWorkItemsByUserQuery,
    "useGetWorkItemsQuery",
    ()=>useGetWorkItemsQuery,
    "useRevokeInvitationMutation",
    ()=>useRevokeInvitationMutation,
    "useSearchQuery",
    ()=>useSearchQuery,
    "useUpdateAttachmentMutation",
    ()=>useUpdateAttachmentMutation,
    "useUpdateCommentMutation",
    ()=>useUpdateCommentMutation,
    "useUpdateDeliverableTypeMutation",
    ()=>useUpdateDeliverableTypeMutation,
    "useUpdateEmailPreferencesMutation",
    ()=>useUpdateEmailPreferencesMutation,
    "useUpdateFeedbackMutation",
    ()=>useUpdateFeedbackMutation,
    "useUpdateIssueTypeMutation",
    ()=>useUpdateIssueTypeMutation,
    "useUpdateStatusLogMutation",
    ()=>useUpdateStatusLogMutation,
    "useUpdateUserMutation",
    ()=>useUpdateUserMutation,
    "useUpdateWorkItemStatusMutation",
    ()=>useUpdateWorkItemStatusMutation,
    "useValidateInvitationQuery",
    ()=>useValidateInvitationQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
;
var Priority = /*#__PURE__*/ function(Priority) {
    Priority["Urgent"] = "Urgent";
    Priority["High"] = "High";
    Priority["Medium"] = "Medium";
    Priority["Low"] = "Low";
    Priority["Backlog"] = "Backlog";
    return Priority;
}({});
var Status = /*#__PURE__*/ function(Status) {
    Status["ToDo"] = "ToDo";
    Status["WorkInProgress"] = "WorkInProgress";
    Status["UnderReview"] = "UnderReview";
    Status["Completed"] = "Completed";
    return Status;
}({});
const StatusLabels = {
    ["ToDo"]: "To Do",
    ["WorkInProgress"]: "Work In Progress",
    ["UnderReview"]: "Under Review",
    ["Completed"]: "Completed"
};
const DeliverableTypeLabels = {
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
    "Other": "Other"
};
const IssueTypeLabels = {
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
    "Other": "Other"
};
var WorkItemType = /*#__PURE__*/ function(WorkItemType) {
    WorkItemType["Task"] = "Task";
    WorkItemType["Deliverable"] = "Deliverable";
    WorkItemType["Issue"] = "Issue";
    return WorkItemType;
}({});
var PartState = /*#__PURE__*/ function(PartState) {
    PartState["Released"] = "Released";
    PartState["UnderReview"] = "UnderReview";
    PartState["InWork"] = "InWork";
    PartState["Implementation"] = "Implementation";
    return PartState;
}({});
const PartStateLabels = {
    ["Released"]: "Released",
    ["UnderReview"]: "Under Review",
    ["InWork"]: "In Work",
    ["Implementation"]: "Implementation"
};
var AuditAction = /*#__PURE__*/ function(AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["VIEW"] = "VIEW";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["EXPORT"] = "EXPORT";
    AuditAction["IMPORT"] = "IMPORT";
    return AuditAction;
}({});
const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    baseQuery: async (args, api, extraOptions)=>{
        const baseQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
            baseUrl: ("TURBOPACK compile-time value", "http://localhost:8000"),
            credentials: 'include',
            prepareHeaders: (headers)=>{
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                return headers;
            }
        });
        const result = await baseQuery(args, api, extraOptions);
        // Handle 401 errors - session expired or invalid
        if (result.error && 'status' in result.error && result.error.status === 401) {
            const errorData = result.error.data;
            // If server indicates login is required, redirect to login
            if (errorData?.requiresLogin || errorData?.message?.includes('Session expired') || errorData?.message?.includes('Authentication required')) {
                // Clear local storage
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
        }
        return result;
    },
    reducerPath: "api",
    tagTypes: [
        "WorkItems",
        "Milestones",
        "Parts",
        "Programs",
        "Teams",
        "Users",
        "Comments",
        "StatusLogs",
        "Attachments",
        "Invitations",
        "DeliverableTypes",
        "IssueTypes",
        "Feedback",
        "AuditLogs"
    ],
    endpoints: (build)=>({
            /* ---------- WORK ITEMS ---------- */ getWorkItems: build.query({
                query: ()=>"workItems",
                providesTags: (result)=>result ? [
                        ...result.map(({ id })=>({
                                type: "WorkItems",
                                id
                            })),
                        {
                            type: "WorkItems",
                            id: "LIST"
                        }
                    ] : [
                        {
                            type: "WorkItems",
                            id: "LIST"
                        }
                    ]
            }),
            getWorkItemById: build.query({
                query: (workItemId)=>`workItems/${workItemId}`,
                providesTags: (result, error, workItemId)=>[
                        {
                            type: "WorkItems",
                            id: workItemId
                        }
                    ]
            }),
            getWorkItemsByProgram: build.query({
                query: ({ programId })=>`workItems?programId=${programId}`,
                providesTags: (result)=>result ? [
                        ...result.map(({ id })=>({
                                type: "WorkItems",
                                id
                            })),
                        {
                            type: "WorkItems",
                            id: "LIST"
                        }
                    ] : [
                        {
                            type: "WorkItems",
                            id: "LIST"
                        }
                    ]
            }),
            getWorkItemsByPart: build.query({
                query: ({ partId, includeChildren })=>{
                    const params = new URLSearchParams({
                        partId: String(partId)
                    });
                    if (includeChildren) {
                        params.append("includeChildren", "true");
                    }
                    return `workItems?${params.toString()}`;
                },
                providesTags: (result)=>result ? [
                        ...result.map(({ id })=>({
                                type: "WorkItems",
                                id
                            })),
                        {
                            type: "WorkItems",
                            id: "LIST"
                        }
                    ] : [
                        {
                            type: "WorkItems",
                            id: "LIST"
                        }
                    ]
            }),
            getWorkItemsByUser: build.query({
                query: (id)=>`workItems/user/${id}`,
                providesTags: (result)=>result ? [
                        ...result.map(({ id })=>({
                                type: "WorkItems",
                                id
                            })),
                        {
                            type: "WorkItems",
                            id: "LIST"
                        }
                    ] : [
                        {
                            type: "WorkItems",
                            id: "LIST"
                        }
                    ]
            }),
            createWorkItem: build.mutation({
                query: (body)=>({
                        url: "workItems",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    {
                        type: "WorkItems",
                        id: "LIST"
                    }
                ]
            }),
            updateWorkItemStatus: build.mutation({
                query: ({ workItemId, status })=>({
                        url: `workItems/${workItemId}/status`,
                        method: "PATCH",
                        body: {
                            status
                        }
                    }),
                // Invalidate the item and the list, so dependent queries refetch
                invalidatesTags: (result, error, { workItemId })=>[
                        {
                            type: "WorkItems",
                            id: workItemId
                        },
                        {
                            type: "WorkItems",
                            id: "LIST"
                        }
                    ]
            }),
            editWorkItem: build.mutation({
                query: ({ workItemId, updates })=>({
                        url: `workItems/${workItemId}`,
                        method: "PATCH",
                        body: updates
                    }),
                invalidatesTags: (result, error, { workItemId })=>[
                        {
                            type: "WorkItems",
                            id: workItemId
                        },
                        {
                            type: "WorkItems",
                            id: "LIST"
                        }
                    ]
            }),
            deleteWorkItem: build.mutation({
                query: (workItemId)=>({
                        url: `workItems/${workItemId}`,
                        method: "DELETE"
                    }),
                invalidatesTags: (result, error, workItemId)=>[
                        {
                            type: "WorkItems",
                            id: workItemId
                        },
                        {
                            type: "WorkItems",
                            id: "LIST"
                        }
                    ]
            }),
            getCommentsByWorkItem: build.query({
                query: (workItemId)=>`workItems/${workItemId}/comments`,
                providesTags: (result, error, workItemId)=>result ? [
                        ...result.map(({ id })=>({
                                type: "Comments",
                                id
                            })),
                        {
                            type: "Comments",
                            id: `LIST-${workItemId}`
                        }
                    ] : [
                        {
                            type: "Comments",
                            id: `LIST-${workItemId}`
                        }
                    ]
            }),
            createComment: build.mutation({
                query: ({ workItemId, text, commenterUserId })=>({
                        url: `workItems/${workItemId}/comments`,
                        method: "POST",
                        body: {
                            text,
                            commenterUserId
                        }
                    }),
                invalidatesTags: (result, error, { workItemId })=>[
                        {
                            type: "Comments",
                            id: `LIST-${workItemId}`
                        },
                        {
                            type: "WorkItems",
                            id: workItemId
                        }
                    ]
            }),
            updateComment: build.mutation({
                query: ({ workItemId, commentId, text, requesterUserId })=>({
                        url: `workItems/${workItemId}/comments/${commentId}`,
                        method: "PATCH",
                        body: {
                            text,
                            requesterUserId
                        }
                    }),
                invalidatesTags: (result, error, { workItemId, commentId })=>[
                        {
                            type: "Comments",
                            id: commentId
                        },
                        {
                            type: "Comments",
                            id: `LIST-${workItemId}`
                        },
                        {
                            type: "WorkItems",
                            id: workItemId
                        }
                    ]
            }),
            deleteComment: build.mutation({
                query: ({ workItemId, commentId, requesterUserId })=>({
                        url: `workItems/${workItemId}/comments/${commentId}`,
                        method: "DELETE",
                        body: {
                            requesterUserId
                        }
                    }),
                invalidatesTags: (result, error, { workItemId, commentId })=>[
                        {
                            type: "Comments",
                            id: commentId
                        },
                        {
                            type: "Comments",
                            id: `LIST-${workItemId}`
                        },
                        {
                            type: "WorkItems",
                            id: workItemId
                        }
                    ]
            }),
            getStatusLogsByWorkItem: build.query({
                query: (workItemId)=>`workItems/${workItemId}/statusLogs`,
                providesTags: (result, error, workItemId)=>result ? [
                        ...result.map(({ id })=>({
                                type: "StatusLogs",
                                id
                            })),
                        {
                            type: "StatusLogs",
                            id: `LIST-${workItemId}`
                        }
                    ] : [
                        {
                            type: "StatusLogs",
                            id: `LIST-${workItemId}`
                        }
                    ]
            }),
            createStatusLog: build.mutation({
                query: ({ workItemId, status, engineerUserId })=>({
                        url: `workItems/${workItemId}/statusLogs`,
                        method: "POST",
                        body: {
                            status,
                            engineerUserId
                        }
                    }),
                invalidatesTags: (result, error, { workItemId })=>[
                        {
                            type: "StatusLogs",
                            id: `LIST-${workItemId}`
                        },
                        {
                            type: "WorkItems",
                            id: workItemId
                        }
                    ]
            }),
            updateStatusLog: build.mutation({
                query: ({ workItemId, statusLogId, status, requesterUserId })=>({
                        url: `workItems/${workItemId}/statusLogs/${statusLogId}`,
                        method: "PATCH",
                        body: {
                            status,
                            requesterUserId
                        }
                    }),
                invalidatesTags: (result, error, { workItemId, statusLogId })=>[
                        {
                            type: "StatusLogs",
                            id: statusLogId
                        },
                        {
                            type: "StatusLogs",
                            id: `LIST-${workItemId}`
                        },
                        {
                            type: "WorkItems",
                            id: workItemId
                        }
                    ]
            }),
            deleteStatusLog: build.mutation({
                query: ({ workItemId, statusLogId, requesterUserId })=>({
                        url: `workItems/${workItemId}/statusLogs/${statusLogId}`,
                        method: "DELETE",
                        body: {
                            requesterUserId
                        }
                    }),
                invalidatesTags: (result, error, { workItemId, statusLogId })=>[
                        {
                            type: "StatusLogs",
                            id: statusLogId
                        },
                        {
                            type: "StatusLogs",
                            id: `LIST-${workItemId}`
                        },
                        {
                            type: "WorkItems",
                            id: workItemId
                        }
                    ]
            }),
            getAttachmentsByWorkItem: build.query({
                query: (workItemId)=>`workItems/${workItemId}/attachments`,
                providesTags: (result, error, workItemId)=>result ? [
                        ...result.map(({ id })=>({
                                type: "Attachments",
                                id
                            })),
                        {
                            type: "Attachments",
                            id: `LIST-${workItemId}`
                        }
                    ] : [
                        {
                            type: "Attachments",
                            id: `LIST-${workItemId}`
                        }
                    ]
            }),
            createAttachment: build.mutation({
                query: ({ workItemId, fileUrl, fileName, uploadedByUserId })=>({
                        url: `workItems/${workItemId}/attachments`,
                        method: "POST",
                        body: {
                            fileUrl,
                            fileName,
                            uploadedByUserId
                        }
                    }),
                invalidatesTags: (result, error, { workItemId })=>[
                        {
                            type: "Attachments",
                            id: `LIST-${workItemId}`
                        },
                        {
                            type: "WorkItems",
                            id: workItemId
                        }
                    ]
            }),
            updateAttachment: build.mutation({
                query: ({ workItemId, attachmentId, fileName, fileUrl, requesterUserId })=>({
                        url: `workItems/${workItemId}/attachments/${attachmentId}`,
                        method: "PATCH",
                        body: {
                            fileName,
                            fileUrl,
                            requesterUserId
                        }
                    }),
                invalidatesTags: (result, error, { workItemId, attachmentId })=>[
                        {
                            type: "Attachments",
                            id: attachmentId
                        },
                        {
                            type: "Attachments",
                            id: `LIST-${workItemId}`
                        },
                        {
                            type: "WorkItems",
                            id: workItemId
                        }
                    ]
            }),
            deleteAttachment: build.mutation({
                query: ({ workItemId, attachmentId, requesterUserId })=>({
                        url: `workItems/${workItemId}/attachments/${attachmentId}`,
                        method: "DELETE",
                        body: {
                            requesterUserId
                        }
                    }),
                invalidatesTags: (result, error, { workItemId, attachmentId })=>[
                        {
                            type: "Attachments",
                            id: attachmentId
                        },
                        {
                            type: "Attachments",
                            id: `LIST-${workItemId}`
                        },
                        {
                            type: "WorkItems",
                            id: workItemId
                        }
                    ]
            }),
            /* ---------- MILESTONES ---------- */ getMilestones: build.query({
                query: ()=>"milestones",
                providesTags: [
                    "Milestones"
                ]
            }),
            getMilestonesByProgram: build.query({
                query: ({ programId })=>`milestones?programId=${programId}`,
                providesTags: [
                    "Milestones"
                ]
            }),
            createMilestone: build.mutation({
                query: (body)=>({
                        url: "milestones",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "Milestones"
                ]
            }),
            editMilestone: build.mutation({
                query: ({ milestoneId, updates })=>({
                        url: `milestones/${milestoneId}`,
                        method: "PATCH",
                        body: updates
                    }),
                invalidatesTags: (result, error, { milestoneId })=>[
                        {
                            type: "Milestones",
                            id: milestoneId
                        },
                        {
                            type: "Milestones",
                            id: "LIST"
                        }
                    ]
            }),
            /* ---------- PARTS ---------- */ getParts: build.query({
                query: ()=>"parts",
                providesTags: (result)=>result ? [
                        ...result.map(({ id })=>({
                                type: "Parts",
                                id
                            })),
                        {
                            type: "Parts",
                            id: "LIST"
                        }
                    ] : [
                        {
                            type: "Parts",
                            id: "LIST"
                        }
                    ]
            }),
            getPartsByProgram: build.query({
                query: ({ programId })=>`parts?programId=${programId}`,
                providesTags: (result)=>result ? [
                        ...result.map(({ id })=>({
                                type: "Parts",
                                id
                            })),
                        {
                            type: "Parts",
                            id: "LIST"
                        }
                    ] : [
                        {
                            type: "Parts",
                            id: "LIST"
                        }
                    ]
            }),
            getPartsByUser: build.query({
                query: (id)=>`parts/user/${id}`,
                providesTags: (result)=>result ? [
                        ...result.map(({ id })=>({
                                type: "Parts",
                                id
                            })),
                        {
                            type: "Parts",
                            id: "LIST"
                        }
                    ] : [
                        {
                            type: "Parts",
                            id: "LIST"
                        }
                    ]
            }),
            createPart: build.mutation({
                query: (body)=>({
                        url: "parts",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "Parts"
                ]
            }),
            editPart: build.mutation({
                query: ({ partId, updates })=>({
                        url: `parts/${partId}`,
                        method: "PATCH",
                        body: updates
                    }),
                invalidatesTags: (result, error, { partId })=>[
                        {
                            type: "Parts",
                            id: partId
                        },
                        {
                            type: "Parts",
                            id: "LIST"
                        }
                    ]
            }),
            deletePart: build.mutation({
                query: (partId)=>({
                        url: `parts/${partId}`,
                        method: "DELETE"
                    }),
                invalidatesTags: (result, error, partId)=>[
                        {
                            type: "Parts",
                            id: partId
                        },
                        {
                            type: "Parts",
                            id: "LIST"
                        }
                    ]
            }),
            /* ---------- PROGRAMS ---------- */ getPrograms: build.query({
                query: ()=>"programs",
                providesTags: [
                    "Programs"
                ]
            }),
            createProgram: build.mutation({
                query: (body)=>({
                        url: "programs",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "Programs"
                ]
            }),
            editProgram: build.mutation({
                query: ({ programId, updates })=>({
                        url: `programs/${programId}`,
                        method: "PATCH",
                        body: updates
                    }),
                invalidatesTags: (result, error, { programId })=>[
                        {
                            type: "Programs",
                            id: programId
                        },
                        {
                            type: "Programs",
                            id: "LIST"
                        }
                    ]
            }),
            /* ---------- TEAMS ---------- */ getTeams: build.query({
                query: ()=>"teams",
                providesTags: [
                    "Teams"
                ]
            }),
            createTeam: build.mutation({
                query: (body)=>({
                        url: "teams",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "Teams"
                ]
            }),
            editTeam: build.mutation({
                query: ({ teamId, updates })=>({
                        url: `teams/${teamId}`,
                        method: "PATCH",
                        body: updates
                    }),
                invalidatesTags: (result, error, { teamId })=>[
                        {
                            type: "Teams",
                            id: teamId
                        },
                        {
                            type: "Teams",
                            id: "LIST"
                        }
                    ]
            }),
            /* ---------- USERS ---------- */ getUsers: build.query({
                query: ()=>"users",
                providesTags: [
                    "Users"
                ]
            }),
            getUserById: build.query({
                query: (id)=>`users/${id}`,
                providesTags: (result, error, id)=>[
                        {
                            type: "Users",
                            id
                        }
                    ]
            }),
            createUser: build.mutation({
                query: (userData)=>({
                        url: "users",
                        method: "POST",
                        body: userData
                    }),
                invalidatesTags: [
                    "Users"
                ]
            }),
            updateUser: build.mutation({
                query: ({ id, data })=>({
                        url: `users/${id}`,
                        method: "PUT",
                        body: data
                    }),
                invalidatesTags: (result, error, { id })=>[
                        {
                            type: "Users",
                            id
                        },
                        "Users"
                    ]
            }),
            getEmailPreferences: build.query({
                query: (id)=>`users/${id}/email-preferences`,
                providesTags: (result, error, id)=>[
                        {
                            type: "Users",
                            id
                        }
                    ]
            }),
            updateEmailPreferences: build.mutation({
                query: ({ id, preferences })=>({
                        url: `users/${id}/email-preferences`,
                        method: "PUT",
                        body: preferences
                    }),
                invalidatesTags: (result, error, { id })=>[
                        {
                            type: "Users",
                            id
                        },
                        "Users"
                    ]
            }),
            /* ---------- SEARCH ---------- */ search: build.query({
                query: (query)=>`search?query=${query}`
            }),
            /* ---------- INVITATIONS ---------- */ getInvitations: build.query({
                query: ()=>"invitations",
                providesTags: [
                    "Invitations"
                ]
            }),
            validateInvitation: build.query({
                query: (token)=>`invitations/validate/${token}`
            }),
            createInvitation: build.mutation({
                query: (body)=>({
                        url: "invitations",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "Invitations"
                ]
            }),
            revokeInvitation: build.mutation({
                query: (invitationId)=>({
                        url: `invitations/${invitationId}`,
                        method: "DELETE"
                    }),
                invalidatesTags: [
                    "Invitations"
                ]
            }),
            /* ---------- DELIVERABLE TYPES ---------- */ getDeliverableTypes: build.query({
                query: ()=>"deliverableTypes",
                providesTags: [
                    "DeliverableTypes"
                ]
            }),
            createDeliverableType: build.mutation({
                query: (body)=>({
                        url: "deliverableTypes",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "DeliverableTypes"
                ]
            }),
            updateDeliverableType: build.mutation({
                query: ({ typeId, updates })=>({
                        url: `deliverableTypes/${typeId}`,
                        method: "PATCH",
                        body: updates
                    }),
                invalidatesTags: [
                    "DeliverableTypes"
                ]
            }),
            deleteDeliverableType: build.mutation({
                query: (typeId)=>({
                        url: `deliverableTypes/${typeId}`,
                        method: "DELETE"
                    }),
                invalidatesTags: [
                    "DeliverableTypes"
                ]
            }),
            /* ---------- ISSUE TYPES ---------- */ getIssueTypes: build.query({
                query: ()=>"issueTypes",
                providesTags: [
                    "IssueTypes"
                ]
            }),
            createIssueType: build.mutation({
                query: (body)=>({
                        url: "issueTypes",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "IssueTypes"
                ]
            }),
            updateIssueType: build.mutation({
                query: ({ typeId, updates })=>({
                        url: `issueTypes/${typeId}`,
                        method: "PATCH",
                        body: updates
                    }),
                invalidatesTags: [
                    "IssueTypes"
                ]
            }),
            deleteIssueType: build.mutation({
                query: (typeId)=>({
                        url: `issueTypes/${typeId}`,
                        method: "DELETE"
                    }),
                invalidatesTags: [
                    "IssueTypes"
                ]
            }),
            /* ---------- FEEDBACK ---------- */ getUnreadFeedbackCount: build.query({
                query: ()=>"feedback/unread-count",
                providesTags: [
                    "Feedback"
                ]
            }),
            getFeedback: build.query({
                query: (params)=>{
                    const searchParams = new URLSearchParams();
                    if (params?.status) searchParams.append("status", params.status);
                    if (params?.type) searchParams.append("type", params.type);
                    if (params?.priority) searchParams.append("priority", params.priority);
                    const queryString = searchParams.toString();
                    return `feedback${queryString ? `?${queryString}` : ""}`;
                },
                providesTags: [
                    "Feedback"
                ]
            }),
            getFeedbackById: build.query({
                query: (id)=>`feedback/${id}`,
                providesTags: (result, error, id)=>[
                        {
                            type: "Feedback",
                            id
                        }
                    ]
            }),
            getMyFeedback: build.query({
                query: ()=>"feedback/my",
                providesTags: [
                    "Feedback"
                ]
            }),
            createFeedback: build.mutation({
                query: (body)=>({
                        url: "feedback",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "Feedback"
                ]
            }),
            updateFeedback: build.mutation({
                query: ({ id, data })=>({
                        url: `feedback/${id}`,
                        method: "PATCH",
                        body: data
                    }),
                invalidatesTags: (result, error, { id })=>[
                        {
                            type: "Feedback",
                            id
                        },
                        "Feedback"
                    ]
            }),
            /* ---------- AUDIT LOGS ---------- */ getAuditLogs: build.query({
                query: (params)=>{
                    const queryParams = new URLSearchParams();
                    if (params.page) queryParams.append("page", String(params.page));
                    if (params.limit) queryParams.append("limit", String(params.limit));
                    if (params.action) queryParams.append("action", params.action);
                    if (params.entityType) queryParams.append("entityType", params.entityType);
                    if (params.entityId) queryParams.append("entityId", String(params.entityId));
                    if (params.userId) queryParams.append("userId", String(params.userId));
                    if (params.startDate) queryParams.append("startDate", params.startDate);
                    if (params.endDate) queryParams.append("endDate", params.endDate);
                    if (params.search) queryParams.append("search", params.search);
                    return `auditLogs?${queryParams.toString()}`;
                },
                providesTags: [
                    "AuditLogs"
                ]
            }),
            getAuditLogById: build.query({
                query: (id)=>`auditLogs/${id}`,
                providesTags: (result, error, id)=>[
                        {
                            type: "AuditLogs",
                            id
                        }
                    ]
            }),
            getEntityAuditLogs: build.query({
                query: ({ entityType, entityId })=>`auditLogs/entity/${entityType}/${entityId}`,
                providesTags: [
                    "AuditLogs"
                ]
            }),
            getAuditLogStats: build.query({
                query: (params)=>{
                    const queryParams = new URLSearchParams();
                    if (params.startDate) queryParams.append("startDate", params.startDate);
                    if (params.endDate) queryParams.append("endDate", params.endDate);
                    return `auditLogs/stats?${queryParams.toString()}`;
                },
                providesTags: [
                    "AuditLogs"
                ]
            })
        })
});
const { useGetWorkItemsQuery, useGetWorkItemByIdQuery, useGetWorkItemsByProgramQuery, useGetWorkItemsByPartQuery, useGetWorkItemsByUserQuery, useCreateWorkItemMutation, useUpdateWorkItemStatusMutation, useEditWorkItemMutation, useDeleteWorkItemMutation, useGetCommentsByWorkItemQuery, useCreateCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation, useGetStatusLogsByWorkItemQuery, useCreateStatusLogMutation, useUpdateStatusLogMutation, useDeleteStatusLogMutation, useGetAttachmentsByWorkItemQuery, useCreateAttachmentMutation, useUpdateAttachmentMutation, useDeleteAttachmentMutation, useGetMilestonesQuery, useGetMilestonesByProgramQuery, useCreateMilestoneMutation, useEditMilestoneMutation, useGetPartsQuery, useGetPartsByProgramQuery, useGetPartsByUserQuery, useCreatePartMutation, useEditPartMutation, useDeletePartMutation, useGetProgramsQuery, useCreateProgramMutation, useEditProgramMutation, useGetTeamsQuery, useCreateTeamMutation, useEditTeamMutation, useGetUsersQuery, useGetUserByIdQuery, useCreateUserMutation, useUpdateUserMutation, useGetEmailPreferencesQuery, useUpdateEmailPreferencesMutation, useSearchQuery, useGetInvitationsQuery, useValidateInvitationQuery, useCreateInvitationMutation, useRevokeInvitationMutation, useGetDeliverableTypesQuery, useCreateDeliverableTypeMutation, useUpdateDeliverableTypeMutation, useDeleteDeliverableTypeMutation, useGetIssueTypesQuery, useCreateIssueTypeMutation, useUpdateIssueTypeMutation, useDeleteIssueTypeMutation, useGetUnreadFeedbackCountQuery, useGetFeedbackQuery, useGetFeedbackByIdQuery, useGetMyFeedbackQuery, useCreateFeedbackMutation, useUpdateFeedbackMutation, useGetAuditLogsQuery, useGetAuditLogByIdQuery, useGetEntityAuditLogsQuery, useGetAuditLogStatsQuery } = api;
}),
"[project]/src/app/redux.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StoreProvider,
    "makeStore",
    ()=>makeStore,
    "useAppDispatch",
    ()=>useAppDispatch,
    "useAppSelector",
    ()=>useAppSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux/dist/redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__persistStore$3e$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/persistStore.js [app-ssr] (ecmascript) <export default as persistStore>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistReducer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__persistReducer$3e$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/persistReducer.js [app-ssr] (ecmascript) <export default as persistReducer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$integration$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/es/integration/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$lib$2f$storage$2f$createWebStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux-persist/lib/storage/createWebStorage.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
/* REDUX PERSISTENCE */ const createNoopStorage = ()=>{
    return {
        getItem (_key) {
            return Promise.resolve(null);
        },
        setItem (_key, value) {
            return Promise.resolve(value);
        },
        removeItem (_key) {
            return Promise.resolve();
        }
    };
};
const storage = ("TURBOPACK compile-time truthy", 1) ? createNoopStorage() : "TURBOPACK unreachable";
const persistConfig = {
    key: "root",
    storage,
    whitelist: [
        "global"
    ]
};
const rootReducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combineReducers"])({
    global: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].reducer
});
const persistedReducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistReducer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__persistReducer$3e$__["persistReducer"])(persistConfig, rootReducer);
const makeStore = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
        reducer: persistedReducer,
        middleware: (getDefault)=>getDefault({
                serializableCheck: {
                    ignoredActions: [
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLUSH"],
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REHYDRATE"],
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAUSE"],
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PERSIST"],
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PURGE"],
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGISTER"]
                    ]
                }
            }).concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].middleware)
    });
};
const useAppDispatch = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDispatch"])();
const useAppSelector = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSelector"];
function StoreProvider({ children }) {
    const storeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [persistor, setPersistor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!storeRef.current) {
            storeRef.current = makeStore();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setupListeners"])(storeRef.current.dispatch);
        }
        // Create persistor after store is created
        if (storeRef.current && !persistor) {
            setPersistor((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__persistStore$3e$__["persistStore"])(storeRef.current));
        }
    }, [
        persistor
    ]);
    if (!storeRef.current || !persistor) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/src/app/redux.tsx",
            lineNumber: 99,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"], {
        store: storeRef.current,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$persist$2f$es$2f$integration$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PersistGate"], {
            loading: null,
            persistor: persistor,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/redux.tsx",
            lineNumber: 104,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/redux.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/better-auth-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authClient",
    ()=>authClient,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut,
    "signUp",
    ()=>signUp,
    "useSession",
    ()=>useSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/client/react/index.mjs [app-ssr] (ecmascript) <locals>");
;
const authClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAuthClient"])({
    baseURL: ("TURBOPACK compile-time value", "http://localhost:8000") || "http://localhost:8000",
    basePath: "/api/auth"
});
const { signIn, signUp, signOut, useSession } = authClient;
}),
"[project]/src/lib/betterAuthService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Better Auth service implementation
__turbopack_context__.s([
    "BetterAuthService",
    ()=>BetterAuthService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$better$2d$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/better-auth-client.ts [app-ssr] (ecmascript)");
;
class BetterAuthService {
    listeners = [];
    currentUser = null;
    constructor(){
        // Initialize from Better Auth session
        this.initializeFromSession();
    }
    async initializeFromSession() {
        try {
            const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$better$2d$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].getSession();
            if (session?.data?.user) {
                // Fetch full user data from backend
                await this.fetchUserFromBackend(session.data.user.id);
            }
        } catch (error) {
            console.debug("No Better Auth session found");
        }
    }
    async fetchUserFromBackend(betterAuthUserId) {
        const apiBaseUrl = ("TURBOPACK compile-time value", "http://localhost:8000") || "http://localhost:8000";
        try {
            const response = await fetch(`${apiBaseUrl}/users/${betterAuthUserId}`, {
                method: "GET",
                credentials: "include"
            });
            if (response.ok) {
                const userData = await response.json();
                const user = {
                    id: userData.id,
                    organizationId: userData.organizationId,
                    username: userData.username,
                    name: userData.name,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    role: userData.role,
                    profilePictureUrl: userData.profilePictureUrl || undefined,
                    disciplineTeamId: userData.disciplineTeamId || undefined,
                    organizationName: userData.organization?.name || undefined
                };
                this.currentUser = user;
                this.notifyListeners();
                return user;
            }
        } catch (error) {
            console.error("Failed to fetch user from backend:", error);
        }
        return null;
    }
    notifyListeners() {
        this.listeners.forEach((callback)=>callback(this.currentUser));
    }
    async signUp(data) {
        // Step 1: Sign up with Better Auth
        // Note: phoneNumber is NOT passed here - Better Auth rejects additional fields that aren't properly configured
        // The phoneNumber will be set in the onboarding flow via the /onboarding/signup endpoint
        // The database hook will set phoneNumber to an empty string initially
        const { data: signUpData, error: signUpError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$better$2d$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].signUp.email({
            email: data.email,
            password: data.password,
            name: data.name
        });
        if (signUpError) {
            // Log the full error for debugging
            console.error("Better Auth sign-up error (full):", JSON.stringify(signUpError, null, 2));
            console.error("Better Auth sign-up error message:", signUpError.message);
            console.error("Better Auth sign-up error code:", signUpError.code);
            console.error("Better Auth sign-up error status:", signUpError.status);
            throw new Error(signUpError.message || signUpError.code || "Failed to sign up");
        }
        if (!signUpData?.user) {
            throw new Error("Sign up succeeded but no user data returned");
        }
        // Step 2: Create user in database via onboarding endpoint
        // NOTE: If invitationToken is provided, the backend will update the user to join the invitation organization
        // If not provided, it will create a new organization
        // The onboarding page will handle the actual user creation with the invitation token
        // So we don't call the onboarding endpoint here - let the onboarding flow handle it
        // This prevents duplicate user creation
        // Just return the Better Auth user - the onboarding flow will handle database creation
        const user = {
            id: signUpData.user.id,
            organizationId: 0,
            username: signUpData.user.name?.split(' ')[0] || signUpData.user.email.split('@')[0],
            name: signUpData.user.name || '',
            email: signUpData.user.email,
            phoneNumber: data.phoneNumber,
            role: data.role
        };
        this.currentUser = user;
        this.notifyListeners();
        return user;
    }
    async signIn(data) {
        // Sign in with Better Auth
        const { data: signInData, error: signInError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$better$2d$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].signIn.email({
            email: data.email,
            password: data.password
        });
        if (signInError) {
            throw new Error(signInError.message || "Failed to sign in");
        }
        if (!signInData?.user) {
            throw new Error("Sign in succeeded but no user data returned");
        }
        // Fetch full user data from backend
        const user = await this.fetchUserFromBackend(signInData.user.id);
        if (!user) {
            // User authenticated but not in database - needs onboarding
            throw new Error("User authenticated but not found in database. Please complete onboarding.");
        }
        return user;
    }
    async signOut() {
        // Sign out from Better Auth
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$better$2d$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].signOut();
        // Clear local state
        this.currentUser = null;
        this.notifyListeners();
    }
    async refreshTokens() {
        // Better Auth handles token refresh automatically
        // This is a placeholder for the interface
        throw new Error("Token refresh is handled automatically by Better Auth");
    }
    async getCurrentUser() {
        // Get session from Better Auth
        const { data: session, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$better$2d$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].getSession();
        if (error || !session?.user) {
            this.currentUser = null;
            this.notifyListeners();
            return null;
        }
        // If we have a cached user with the same ID, return it
        if (this.currentUser && this.currentUser.id === session.user.id) {
            return this.currentUser;
        }
        // Fetch full user data from backend
        const user = await this.fetchUserFromBackend(session.user.id);
        return user;
    }
    async updateUserProfile(updates) {
        if (!this.currentUser) {
            throw new Error("No authenticated user");
        }
        const apiBaseUrl = ("TURBOPACK compile-time value", "http://localhost:8000") || "http://localhost:8000";
        try {
            const response = await fetch(`${apiBaseUrl}/users/${this.currentUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(updates)
            });
            if (response.ok) {
                const updatedUser = await response.json();
                const user = {
                    id: updatedUser.id,
                    organizationId: updatedUser.organizationId,
                    username: updatedUser.username,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phoneNumber: updatedUser.phoneNumber,
                    role: updatedUser.role,
                    profilePictureUrl: updatedUser.profilePictureUrl || undefined,
                    disciplineTeamId: updatedUser.disciplineTeamId || undefined,
                    organizationName: updatedUser.organization?.name || undefined
                };
                this.currentUser = user;
                this.notifyListeners();
                return user;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update user profile");
            }
        } catch (error) {
            console.error("Failed to update user profile:", error);
            throw new Error(error instanceof Error ? error.message : "Unable to update profile. Please check your connection and try again.");
        }
    }
    async changePassword(oldPassword, newPassword) {
        // Better Auth handles password changes
        // This would need to be implemented using Better Auth's password change endpoint
        throw new Error("Password change not yet implemented with Better Auth");
    }
    async resetPassword(email) {
        // Better Auth handles password reset
        throw new Error("Password reset not yet implemented with Better Auth");
    }
    async confirmPasswordReset(email, code, newPassword) {
        // Better Auth handles password reset confirmation
        throw new Error("Password reset confirmation not yet implemented with Better Auth");
    }
    getTokens() {
        // Better Auth handles tokens internally via cookies
        // This is a placeholder for the interface
        return null;
    }
    isAuthenticated() {
        return this.currentUser !== null;
    }
    onAuthStateChange(callback) {
        this.listeners.push(callback);
        // Return unsubscribe function
        return ()=>{
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
}
}),
"[project]/src/lib/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Authentication service abstraction layer
// This will allow easy switching between mock auth and Cognito
__turbopack_context__.s([
    "MockAuthService",
    ()=>MockAuthService,
    "authService",
    ()=>authService,
    "createAuthService",
    ()=>createAuthService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$betterAuthService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/betterAuthService.ts [app-ssr] (ecmascript)");
;
class MockAuthService {
    currentUser = null;
    listeners = [];
    constructor(){
        // Initialize from localStorage if available
        this.loadFromStorage();
    }
    loadFromStorage() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    saveToStorage() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    notifyListeners() {
        this.listeners.forEach((callback)=>callback(this.currentUser));
    }
    async signUp(data) {
        // NOTE: With Cognito integration, signup flow has changed:
        // 1. User must first sign up in Cognito (via Cognito hosted UI or API)
        // 2. After Cognito authentication, user is redirected to /auth/callback
        // 3. Callback checks if user exists in DB, if not redirects to /onboarding
        // 4. Onboarding page calls /onboarding/signup with session cookie (cognitoId comes from session)
        // For mock auth service, we'll still try to call the endpoint
        // but the backend will reject it if there's no Cognito session
        const username = data.email.split('@')[0];
        const apiBaseUrl = ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:8000';
        let user = null;
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            // Use onboarding endpoint which creates both organization and user
            // NOTE: This will fail without a Cognito session - user should authenticate first
            const response = await fetch(`${apiBaseUrl}/onboarding/signup`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                    // cognitoId is now retrieved from session on server side
                    username,
                    name: data.name,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    role: data.role
                })
            });
            if (response.ok) {
                // User and organization created in database successfully
                const result = await response.json();
                console.log('Onboarding response:', result);
                // Ensure userId is present - Prisma returns userId as the primary key
                if (!result.user?.id) {
                    console.error('User object missing id:', result.user);
                    throw new Error('User creation response missing userId');
                }
                user = {
                    id: result.user.id,
                    organizationId: result.organization.id,
                    username: result.user.username,
                    name: result.user.name,
                    email: result.user.email,
                    phoneNumber: result.user.phoneNumber,
                    role: result.user.role,
                    profilePictureUrl: result.user.profilePictureUrl || undefined,
                    disciplineTeamId: result.user.disciplineTeamId || undefined,
                    organizationName: result.organization.name || undefined
                };
                console.log('User and organization created in database:', user);
            } else {
                // If user already exists or database error
                const errorData = await response.json();
                console.error('Failed to save user to database:', errorData);
                // If user already exists (409), use that user data
                if (response.status === 409 && errorData.user) {
                    user = {
                        id: errorData.user.id,
                        organizationId: errorData.user.organizationId,
                        username: errorData.user.username,
                        name: errorData.user.name,
                        email: errorData.user.email,
                        phoneNumber: errorData.user.phoneNumber,
                        role: errorData.user.role,
                        profilePictureUrl: errorData.user.profilePictureUrl || undefined,
                        disciplineTeamId: errorData.user.disciplineTeamId || undefined
                    };
                    console.log('Using existing user from error response:', user);
                } else {
                    // For other errors, throw so the UI can handle it
                    throw new Error(errorData.message || 'Failed to create user account');
                }
            }
        } catch (error) {
            // If API call fails (e.g., server not running), throw error
            console.error('Onboarding API call failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Unable to create account. Please check your connection and try again.');
        }
        // Verify user was created successfully
        if (!user) {
            throw new Error('User creation failed: no user object returned');
        }
        // Verify user has required fields before saving
        if (!user.id || !user.organizationId) {
            console.error('User object missing required fields:', user);
            throw new Error('User creation failed: missing userId or organizationId');
        }
        this.currentUser = user;
        this.saveToStorage();
        console.log('User saved to localStorage:', this.currentUser);
        this.notifyListeners();
        return user;
    }
    async signIn(data) {
        // Simulate API call delay
        await new Promise((resolve)=>setTimeout(resolve, 1000));
        // Check if user exists in localStorage
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // If no existing user found, throw error (user should sign up first)
        throw new Error('User not found. Please sign up first.');
    }
    async signOut() {
        // Clear local storage first
        this.currentUser = null;
        this.saveToStorage();
        this.notifyListeners();
        // Redirect to server logout endpoint
        // The server will clear the session and redirect to Cognito logout,
        // which will then redirect back to the frontend
        const apiBaseUrl = ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:8000';
        window.location.href = `${apiBaseUrl}/auth/logout`;
    }
    async refreshTokens() {
        // Mock implementation
        return {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            idToken: 'mock-id-token'
        };
    }
    async getCurrentUser() {
        // Always check for Cognito session on server to get fresh data (including organization name)
        const apiBaseUrl = ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:8000';
        try {
            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), 5000); // 5 second timeout
            const response = await fetch(`${apiBaseUrl}/auth/me`, {
                method: 'GET',
                credentials: 'include',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (response.ok) {
                const data = await response.json();
                // If user has Cognito session and exists in database, use that
                if (data.isAuthenticated && data.userExistsInDb && data.user) {
                    const user = {
                        id: data.user.id,
                        organizationId: data.user.organizationId,
                        username: data.user.username,
                        name: data.user.name,
                        email: data.user.email,
                        phoneNumber: data.user.phoneNumber,
                        role: data.user.role,
                        profilePictureUrl: data.user.profilePictureUrl || undefined,
                        disciplineTeamId: data.user.disciplineTeamId || undefined,
                        organizationName: data.organization?.name || undefined
                    };
                    this.currentUser = user;
                    this.saveToStorage();
                    this.notifyListeners();
                    return user;
                }
                // If user has Cognito session but not in DB, return null (they need onboarding)
                // The onboarding page will handle this case
                if (data.isAuthenticated && !data.userExistsInDb) {
                    return null; // User needs to complete onboarding
                }
            }
        } catch (error) {
            // Only log if it's not a network error (backend might not be running)
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    // Request timed out - backend might be slow or unavailable
                    console.debug('Auth check request timed out - backend may be unavailable');
                } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    // Network error - backend is likely not running
                    console.debug('Backend server appears to be unavailable');
                } else {
                    // Other error - log it
                    console.error('Failed to check Cognito session:', error);
                }
            } else {
                console.error('Failed to check Cognito session:', error);
            }
            // If we have a cached user and the server is unavailable, return the cached user
            if (this.currentUser) {
                return this.currentUser;
            }
        }
        // If no server response and no cached user, return null
        return this.currentUser || null;
    }
    async updateUserProfile(updates) {
        if (!this.currentUser) {
            throw new Error('No authenticated user');
        }
        const baseUser = this.currentUser;
        // Try to update user in database
        const apiBaseUrl = ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:3001';
        try {
            const response = await fetch(`${apiBaseUrl}/users/${this.currentUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': String(this.currentUser.id)
                },
                body: JSON.stringify(updates)
            });
            if (response.ok) {
                // User updated in database successfully
                const updatedUser = await response.json();
                const mergedUser = {
                    ...baseUser,
                    ...updatedUser,
                    id: baseUser.id,
                    organizationId: updatedUser?.organizationId ?? baseUser.organizationId
                };
                this.currentUser = mergedUser;
                console.log('User updated in database:', updatedUser);
            } else {
                // If database update fails, still update local storage
                console.warn('Failed to update user in database, using local storage only');
                const mergedUser = {
                    ...baseUser,
                    ...updates,
                    id: baseUser.id,
                    organizationId: baseUser.organizationId
                };
                this.currentUser = mergedUser;
            }
        } catch (error) {
            // If API call fails, use local storage
            console.warn('Database API not available, using local storage only:', error);
            const mergedUser = {
                ...baseUser,
                ...updates,
                id: baseUser.id,
                organizationId: baseUser.organizationId
            };
            this.currentUser = mergedUser;
        }
        this.saveToStorage();
        this.notifyListeners();
        const finalUser = this.currentUser;
        if (!finalUser) {
            throw new Error('Failed to update user profile');
        }
        return finalUser;
    }
    async changePassword(oldPassword, newPassword) {
        // Mock implementation
        await new Promise((resolve)=>setTimeout(resolve, 1000));
    }
    async resetPassword(email) {
        // Mock implementation
        await new Promise((resolve)=>setTimeout(resolve, 1000));
    }
    async confirmPasswordReset(email, code, newPassword) {
        // Mock implementation
        await new Promise((resolve)=>setTimeout(resolve, 1000));
    }
    getTokens() {
        return {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            idToken: 'mock-id-token'
        };
    }
    isAuthenticated() {
        return this.currentUser !== null;
    }
    onAuthStateChange(callback) {
        this.listeners.push(callback);
        // Return unsubscribe function
        return ()=>{
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
}
function createAuthService() {
    // Use Better Auth service
    return new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$betterAuthService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BetterAuthService"]();
}
const authService = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$betterAuthService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BetterAuthService"]();
}),
"[externals]/perf_hooks [external] (perf_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("perf_hooks", () => require("perf_hooks"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/require-in-the-middle [external] (require-in-the-middle, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("require-in-the-middle", () => require("require-in-the-middle"));

module.exports = mod;
}),
"[externals]/import-in-the-middle [external] (import-in-the-middle, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("import-in-the-middle", () => require("import-in-the-middle"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/node:diagnostics_channel [external] (node:diagnostics_channel, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:diagnostics_channel", () => require("node:diagnostics_channel"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/diagnostics_channel [external] (diagnostics_channel, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("diagnostics_channel", () => require("diagnostics_channel"));

module.exports = mod;
}),
"[externals]/node:child_process [external] (node:child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:child_process", () => require("node:child_process"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:os [external] (node:os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:os", () => require("node:os"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:readline [external] (node:readline, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:readline", () => require("node:readline"));

module.exports = mod;
}),
"[externals]/node:worker_threads [external] (node:worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:worker_threads", () => require("node:worker_threads"));

module.exports = mod;
}),
"[externals]/node:http [external] (node:http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:http", () => require("node:http"));

module.exports = mod;
}),
"[externals]/node:module [external] (node:module, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:module", () => require("node:module"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/module [external] (module, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("module", () => require("module"));

module.exports = mod;
}),
"[externals]/async_hooks [external] (async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("async_hooks", () => require("async_hooks"));

module.exports = mod;
}),
"[externals]/node:https [external] (node:https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:https", () => require("node:https"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:zlib [external] (node:zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:zlib", () => require("node:zlib"));

module.exports = mod;
}),
"[externals]/node:net [external] (node:net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:net", () => require("node:net"));

module.exports = mod;
}),
"[externals]/node:tls [external] (node:tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:tls", () => require("node:tls"));

module.exports = mod;
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "ProtectedRoute",
    ()=>ProtectedRoute,
    "useAuth",
    ()=>useAuth,
    "useAuthActions",
    ()=>useAuthActions,
    "useAuthState",
    ()=>useAuthState,
    "useRoleAccess",
    ()=>useRoleAccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@sentry/nextjs/build/cjs/index.server.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const sanitizeProfilePictureUrl = (value)=>{
        if (!value) return undefined;
        const trimmed = value.trim();
        if (!trimmed) return undefined;
        const lower = trimmed.toLowerCase();
        if (lower.startsWith('http://') || lower.startsWith('https://')) {
            return undefined;
        }
        return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    };
    const sanitizeUser = (current)=>{
        if (!current) return null;
        const sanitizedProfilePictureUrl = sanitizeProfilePictureUrl(current.profilePictureUrl);
        return {
            ...current,
            profilePictureUrl: sanitizedProfilePictureUrl
        };
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Initialize auth state
        const initializeAuth = async ()=>{
            try {
                // Only run on client side
                if ("TURBOPACK compile-time truthy", 1) {
                    setIsLoading(false);
                    return;
                }
                //TURBOPACK unreachable
                ;
                const currentUser = undefined;
                const sanitizedUser = undefined;
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                setUser(null);
            } finally{
                setIsLoading(false);
            }
        };
        initializeAuth();
        // Listen for auth state changes
        const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].onAuthStateChange((user)=>{
            setUser(sanitizeUser(user));
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);
    const signUp = async (data)=>{
        setIsLoading(true);
        try {
            const newUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].signUp(data);
            const sanitized = sanitizeUser(newUser);
            setUser(sanitized);
            // Set Sentry user context
            if (sanitized) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setUser"]({
                    id: sanitized.id.toString(),
                    email: sanitized.email
                });
            }
            return sanitized;
        } catch (error) {
            setUser(null);
            throw error;
        } finally{
            setIsLoading(false);
        }
    };
    const signIn = async (data)=>{
        setIsLoading(true);
        try {
            const signedInUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].signIn(data);
            const sanitized = sanitizeUser(signedInUser);
            setUser(sanitized);
            return sanitized;
        } catch (error) {
            setUser(null);
            throw error;
        } finally{
            setIsLoading(false);
        }
    };
    const signOut = async ()=>{
        setIsLoading(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].signOut();
            setUser(null);
            // Clear Sentry user context
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setUser"](null);
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        } finally{
            setIsLoading(false);
        }
    };
    const updateProfile = async (updates)=>{
        if (!user) {
            throw new Error('No authenticated user');
        }
        try {
            const mergedUpdates = {
                ...updates,
                profilePictureUrl: sanitizeProfilePictureUrl(updates.profilePictureUrl ?? undefined)
            };
            const updatedUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].updateUserProfile(mergedUpdates);
            const sanitized = sanitizeUser(updatedUser);
            setUser(sanitized);
            return sanitized;
        } catch (error) {
            throw error;
        }
    };
    const refreshTokens = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].refreshTokens();
        } catch (error) {
            console.error('Token refresh error:', error);
            // If refresh fails, sign out the user
            await signOut();
            throw error;
        }
    };
    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshTokens
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 186,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
function useAuthState() {
    const { user, isLoading, isAuthenticated } = useAuth();
    return {
        user,
        isLoading,
        isAuthenticated
    };
}
function useAuthActions() {
    const { signUp, signIn, signOut, updateProfile, refreshTokens } = useAuth();
    return {
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshTokens
    };
}
function ProtectedRoute({ children, fallback, requireRole }) {
    const { user, isLoading, isAuthenticated } = useAuth();
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"
            }, void 0, false, {
                fileName: "[project]/src/contexts/AuthContext.tsx",
                lineNumber: 226,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/contexts/AuthContext.tsx",
            lineNumber: 225,
            columnNumber: 7
        }, this);
    }
    if (!isAuthenticated) {
        return fallback || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-gray-900 dark:text-white mb-4",
                        children: "Authentication Required"
                    }, void 0, false, {
                        fileName: "[project]/src/contexts/AuthContext.tsx",
                        lineNumber: 235,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 dark:text-gray-400",
                        children: "Please sign in to access this page."
                    }, void 0, false, {
                        fileName: "[project]/src/contexts/AuthContext.tsx",
                        lineNumber: 238,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/contexts/AuthContext.tsx",
                lineNumber: 234,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/contexts/AuthContext.tsx",
            lineNumber: 233,
            columnNumber: 7
        }, this);
    }
    if (requireRole && user?.role !== requireRole) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-gray-900 dark:text-white mb-4",
                        children: "Access Denied"
                    }, void 0, false, {
                        fileName: "[project]/src/contexts/AuthContext.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 dark:text-gray-400",
                        children: "You don't have permission to access this page."
                    }, void 0, false, {
                        fileName: "[project]/src/contexts/AuthContext.tsx",
                        lineNumber: 253,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/contexts/AuthContext.tsx",
                lineNumber: 249,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/contexts/AuthContext.tsx",
            lineNumber: 248,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
function useRoleAccess() {
    const { user } = useAuth();
    const hasRole = (role)=>{
        return user?.role === role;
    };
    const isEngineer = ()=>{
        return user?.role === 'Engineer' || user?.role === 'Design Engineer' || user?.role === 'Electrical Eng' || user?.role === 'Mechanical Eng' || user?.role === 'Test Engineer';
    };
    const isProgramManager = ()=>{
        return user?.role === 'Program Manager' || user?.role === 'Project Manager';
    };
    const canAccessProgramManagement = ()=>{
        return isProgramManager();
    };
    const canManageWorkItems = ()=>{
        return isEngineer() || isProgramManager();
    };
    return {
        hasRole,
        isEngineer,
        isProgramManager,
        canAccessProgramManagement,
        canManageWorkItems
    };
}
}),
"[project]/src/components/Header/index.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const Header = ({ name, buttonComponent, isSmallText = false })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-5 flex w-full items-center justify-between",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: `${isSmallText ? "text-lg" : "text-2xl"} font-semibold dark:text-white`,
                children: name
            }, void 0, false, {
                fileName: "[project]/src/components/Header/index.tsx",
                lineNumber: 12,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            buttonComponent
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Header/index.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Header;
}),
"[project]/src/components/Modal/index.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header/index.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
;
;
;
;
const Modal = ({ children, isOpen, onClose, name })=>{
    if (!isOpen) return null;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createPortal(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary max-h-[85vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    name: name,
                    buttonComponent: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "flex h-7 w-7 items-center justify-center rounded-full bg-blue-primary text-white hover:bg-blue-600",
                        onClick: onClose,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/components/Modal/index.tsx",
                            lineNumber: 32,
                            columnNumber: 33
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Modal/index.tsx",
                        lineNumber: 28,
                        columnNumber: 29
                    }, void 0),
                    isSmallText: true
                }, void 0, false, {
                    fileName: "[project]/src/components/Modal/index.tsx",
                    lineNumber: 25,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Modal/index.tsx",
            lineNumber: 24,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Modal/index.tsx",
        lineNumber: 23,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)), document.body);
};
const __TURBOPACK__default__export__ = Modal;
}),
"[project]/src/components/ModalFeedback/index.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Modal/index.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/api.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ModalFeedback = ({ isOpen, onClose })=>{
    const [createFeedback, { isLoading }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCreateFeedbackMutation"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        type: 'bug',
        title: '',
        description: '',
        priority: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Priority"].Medium
    });
    const [submitStatus, setSubmitStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) {
            setSubmitStatus('error');
            setTimeout(()=>setSubmitStatus('idle'), 3000);
            return;
        }
        try {
            await createFeedback({
                type: formData.type,
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority
            }).unwrap();
            setSubmitStatus('success');
            // Reset form
            setFormData({
                type: 'bug',
                title: '',
                description: '',
                priority: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Priority"].Medium
            });
            // Close modal after 2 seconds
            setTimeout(()=>{
                onClose();
                setSubmitStatus('idle');
            }, 2000);
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            setSubmitStatus('error');
            setTimeout(()=>setSubmitStatus('idle'), 3000);
        }
    };
    const handleClose = ()=>{
        if (!isLoading) {
            setFormData({
                type: 'bug',
                title: '',
                description: '',
                priority: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Priority"].Medium
            });
            setSubmitStatus('idle');
            onClose();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        isOpen: isOpen,
        onClose: handleClose,
        name: "Submit Feedback",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                            children: "Type"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 78,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: formData.type,
                            onChange: (e)=>setFormData({
                                    ...formData,
                                    type: e.target.value
                                }),
                            className: "w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                            required: true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "bug",
                                    children: "🐛 Bug Report"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                    lineNumber: 87,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "feature",
                                    children: "✨ Feature Request"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                    lineNumber: 88,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "improvement",
                                    children: "💡 Improvement Suggestion"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                    lineNumber: 89,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 81,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-xs text-gray-500 dark:text-gray-400",
                            children: [
                                formData.type === 'bug' && 'Report a bug or issue you encountered',
                                formData.type === 'feature' && 'Suggest a new feature you\'d like to see',
                                formData.type === 'improvement' && 'Suggest an improvement to existing functionality'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 91,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                    lineNumber: 77,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                            children: "Priority"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 100,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: formData.priority,
                            onChange: (e)=>setFormData({
                                    ...formData,
                                    priority: e.target.value
                                }),
                            className: "w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                            required: true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Priority"].Urgent,
                                    children: "🔴 Urgent"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                    lineNumber: 109,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Priority"].High,
                                    children: "🟠 High"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                    lineNumber: 110,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Priority"].Medium,
                                    children: "🟡 Medium"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                    lineNumber: 111,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Priority"].Low,
                                    children: "🟢 Low"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                    lineNumber: 112,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Priority"].Backlog,
                                    children: "⚪ Backlog"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                    lineNumber: 113,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 103,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-xs text-gray-500 dark:text-gray-400",
                            children: "How important is this feedback to you?"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 115,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                    lineNumber: 99,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "title",
                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                            children: [
                                "Title ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-500",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                    lineNumber: 123,
                                    columnNumber: 31
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 122,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "title",
                            type: "text",
                            value: formData.title,
                            onChange: (e)=>setFormData({
                                    ...formData,
                                    title: e.target.value
                                }),
                            className: "w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                            placeholder: "Brief summary of your feedback",
                            required: true,
                            maxLength: 200
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 125,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                    lineNumber: 121,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "description",
                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                            children: [
                                "Description ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-500",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                    lineNumber: 140,
                                    columnNumber: 37
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 139,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            id: "description",
                            value: formData.description,
                            onChange: (e)=>setFormData({
                                    ...formData,
                                    description: e.target.value
                                }),
                            className: "w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                            placeholder: "Provide detailed information about your feedback...",
                            rows: 6,
                            required: true,
                            maxLength: 2000
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 142,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-xs text-gray-500 dark:text-gray-400",
                            children: [
                                formData.description.length,
                                "/2000 characters"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 152,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                    lineNumber: 138,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                submitStatus === 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-green-600 dark:text-green-400",
                        children: "✓ Feedback submitted successfully! Thank you for your input."
                    }, void 0, false, {
                        fileName: "[project]/src/components/ModalFeedback/index.tsx",
                        lineNumber: 160,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                    lineNumber: 159,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                submitStatus === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-red-600 dark:text-red-400",
                        children: "Failed to submit feedback. Please try again."
                    }, void 0, false, {
                        fileName: "[project]/src/components/ModalFeedback/index.tsx",
                        lineNumber: 168,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                    lineNumber: 167,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-3 pt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleClose,
                            disabled: isLoading,
                            className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 176,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: isLoading || !formData.title.trim() || !formData.description.trim(),
                            className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                            children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                        lineNumber: 191,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Submitting..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ModalFeedback/index.tsx",
                                lineNumber: 190,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)) : 'Submit Feedback'
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalFeedback/index.tsx",
                            lineNumber: 184,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalFeedback/index.tsx",
                    lineNumber: 175,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ModalFeedback/index.tsx",
            lineNumber: 75,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ModalFeedback/index.tsx",
        lineNumber: 74,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = ModalFeedback;
}),
"[project]/src/components/Navbar/index.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/redux.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModalFeedback$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ModalFeedback/index.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const Navbar = ()=>{
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { signOut, user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const isSidebarCollapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppSelector"])((state)=>state.global.isSidebarCollapsed);
    const isDarkMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppSelector"])((state)=>state.global.isDarkMode);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    // Get user initials from username or name
    const getUserInitials = ()=>{
        if (user?.name) {
            const names = user.name.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return user.name.substring(0, 2).toUpperCase();
        }
        if (user?.username) {
            return user.username.substring(0, 2).toUpperCase();
        }
        return '?';
    };
    const sanitizeProfilePictureUrl = (value)=>{
        if (!value) return "";
        const trimmed = value.trim();
        if (!trimmed) return "";
        const lower = trimmed.toLowerCase();
        if (lower.startsWith("http://") || lower.startsWith("https://")) {
            return "";
        }
        return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    };
    const safeProfilePictureUrl = sanitizeProfilePictureUrl(user?.profilePictureUrl);
    const handleLogout = async ()=>{
        try {
            // signOut() will redirect to server logout endpoint
            // which handles session clearing and Cognito logout
            await signOut();
        // Don't call router.push here - signOut() handles the redirect
        } catch (error) {
            console.error('Logout error:', error);
            // On error, still try to redirect to onboarding
            router.push("/onboarding");
        }
    };
    const handleSearchSubmit = (e)=>{
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            router.push("/search");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between bg-white px-4 py-3 dark:bg-black",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-8",
                children: [
                    !isSidebarCollapsed ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setIsSidebarCollapsed"])(!isSidebarCollapsed)),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            className: "h-8 w-8 dark:text-white"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar/index.tsx",
                            lineNumber: 81,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar/index.tsx",
                        lineNumber: 78,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSearchSubmit,
                        className: "relative flex h-min w-[200px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar/index.tsx",
                                lineNumber: 85,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white",
                                type: "search",
                                placeholder: "Search...",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar/index.tsx",
                                lineNumber: 86,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navbar/index.tsx",
                        lineNumber: 84,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar/index.tsx",
                lineNumber: 76,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsFeedbackModalOpen(true),
                        className: isDarkMode ? `h-min w-min rounded p-2 dark:hover:bg-gray-700` : `h-min w-min rounded p-2 hover:bg-gray-100`,
                        title: "Submit Feedback",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                            className: "h-6 w-6 cursor-pointer dark:text-white"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar/index.tsx",
                            lineNumber: 107,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar/index.tsx",
                        lineNumber: 98,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setIsDarkMode"])(!isDarkMode)),
                        className: isDarkMode ? `rounded p-2 dark:hover:bg-gray-700` : `rounded p-2 hover:bg-gray-100`,
                        title: isDarkMode ? "Toggle Light Mode" : "Toggle Dark Mode",
                        children: isDarkMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                            className: "h-6 w-6 cursor-pointer dark:text-white"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar/index.tsx",
                            lineNumber: 119,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                            className: "h-6 w-6 cursor-pointer dark:text-white"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar/index.tsx",
                            lineNumber: 121,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar/index.tsx",
                        lineNumber: 109,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/settings",
                        className: isDarkMode ? `h-min w-min rounded p-2 dark:hover:bg-gray-700` : `h-min w-min rounded p-2 hover:bg-gray-100`,
                        title: "Settings",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                            className: "h-6 w-6 cursor-pointer dark:text-white"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar/index.tsx",
                            lineNumber: 133,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar/index.tsx",
                        lineNumber: 124,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-2 mr-4 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar/index.tsx",
                        lineNumber: 136,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    user?.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: `/users/${user.id}`,
                        className: isDarkMode ? `h-min w-min rounded-full dark:hover:bg-gray-700` : `h-min w-min rounded-full hover:bg-gray-100`,
                        title: "View Profile",
                        children: safeProfilePictureUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                src: safeProfilePictureUrl ? `/images/${safeProfilePictureUrl}` : '/placeholder.png',
                                alt: user.name || user.username,
                                width: 32,
                                height: 32,
                                className: "h-full w-full object-cover"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar/index.tsx",
                                lineNumber: 151,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar/index.tsx",
                            lineNumber: 150,
                            columnNumber: 29
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300",
                            children: getUserInitials()
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar/index.tsx",
                            lineNumber: 160,
                            columnNumber: 29
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar/index.tsx",
                        lineNumber: 140,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleLogout,
                        className: isDarkMode ? `ml-2 h-min w-min rounded p-2 dark:hover:bg-gray-700` : `ml-2 h-min w-min rounded p-2 hover:bg-gray-100`,
                        title: "Logout",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                            className: "h-6 w-6 cursor-pointer dark:text-white"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar/index.tsx",
                            lineNumber: 176,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar/index.tsx",
                        lineNumber: 167,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar/index.tsx",
                lineNumber: 97,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModalFeedback$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isFeedbackModalOpen,
                onClose: ()=>setIsFeedbackModalOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar/index.tsx",
                lineNumber: 181,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Navbar/index.tsx",
        lineNumber: 74,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Navbar;
}),
"[project]/src/components/Sidebar/index.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/redux.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bolt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bolt$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bolt.js [app-ssr] (ecmascript) <export default as Bolt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-ssr] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.js [app-ssr] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-ssr] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LockIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-ssr] (ecmascript) <export default as LockIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tree-pine.js [app-ssr] (ecmascript) <export default as TreePine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
const Sidebar = ()=>{
    const [showPrograms, setShowPrograms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showWorkItems, setShowWorkItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [expandedPrograms, setExpandedPrograms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const { data: programs } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGetProgramsQuery"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const userId = user?.id;
    const { data: userParts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGetPartsByUserQuery"])(userId || "", {
        skip: !userId
    });
    // ✅ Group parts by programId for easy display
    const partsByProgram = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!userParts) return {};
        return userParts.reduce((acc, part)=>{
            (acc[part.programId] ||= []).push(part);
            return acc;
        }, {});
    }, [
        userParts
    ]);
    // ✅ Filter programs to only show those where the user has parts or belongs via discipline team
    const filteredPrograms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!programs) return [];
        const programIdsFromParts = new Set((userParts ?? []).map((part)=>part.programId));
        if (programIdsFromParts.size > 0) {
            return programs.filter((program)=>programIdsFromParts.has(program.id));
        }
        if (!user?.disciplineTeamId) return [];
        return programs.filter((program)=>program.disciplineTeams?.some((dtp)=>dtp.disciplineTeamId === user.disciplineTeamId));
    }, [
        programs,
        userParts,
        user?.disciplineTeamId
    ]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const isSidebarCollapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppSelector"])((state)=>state.global.isSidebarCollapsed);
    /* =========================
       ✅ Restore expanded programs from localStorage
    ========================== */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const stored = localStorage.getItem("expandedPrograms");
        if (stored) {
            setExpandedPrograms(JSON.parse(stored));
        }
    }, []);
    /* =========================
       ✅ Auto-expand the program for the active part
    ========================== */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (userParts && pathname.startsWith("/parts/")) {
            const partId = Number(pathname.split("/parts/")[1]);
            const activePart = userParts.find((p)=>p.id === partId);
            if (activePart) {
                setExpandedPrograms((prev)=>{
                    const updated = {
                        ...prev,
                        [activePart.programId]: true
                    };
                    localStorage.setItem("expandedPrograms", JSON.stringify(updated));
                    return updated;
                });
            }
        }
    }, [
        pathname,
        userParts
    ]);
    const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
        transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
        ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
    `;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: sidebarClassNames,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-[100%] w-full flex-col justify-start",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xl font-bold text-gray-800 dark:text-white",
                            children: "PARTIAL"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 120,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        !isSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "py-3",
                            onClick: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setIsSidebarCollapsed"])(!isSidebarCollapsed)),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Sidebar/index.tsx",
                                lineNumber: 130,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 124,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 119,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: "/logo1.png",
                            alt: "Logo",
                            width: 40,
                            height: 40
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 137,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-md font-bold tracking-wide dark:text-gray-200",
                                    children: user?.organizationName || "Organization"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Sidebar/index.tsx",
                                    lineNumber: 139,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 flex items-start gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LockIcon$3e$__["LockIcon"], {
                                            className: "mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Sidebar/index.tsx",
                                            lineNumber: 143,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500",
                                            children: "Private"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Sidebar/index.tsx",
                                            lineNumber: 144,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Sidebar/index.tsx",
                                    lineNumber: 142,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 138,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 136,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "z-10 w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
                            label: "Home",
                            href: "/"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 151,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
                            label: "Search",
                            href: "/search"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 152,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"],
                            label: "Programs",
                            href: "/programs"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 153,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__["TreePine"],
                            label: "Part Hierarchy",
                            href: "/part-hierarchy"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 154,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
                            label: "Users",
                            href: "/users"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 155,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                            label: "Teams",
                            href: "/teams"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 156,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        user?.role && [
                            'Admin',
                            'Manager',
                            'Program Manager'
                        ].includes(user.role) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"],
                            label: "Invitations",
                            href: "/invitations"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 159,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        user?.role === 'Admin' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FeedbackLinkWithBadge, {}, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 163,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
                            label: "Settings",
                            href: "/settings"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 165,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 150,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                filteredPrograms.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowPrograms((p)=>!p),
                            className: "flex w-full items-center justify-between px-8 py-3 text-gray-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "My Parts"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Sidebar/index.tsx",
                                    lineNumber: 175,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                showPrograms ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                    className: "h-5 w-5 text-gray-500 dark:text-gray-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Sidebar/index.tsx",
                                    lineNumber: 177,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: "h-5 w-5 text-gray-500 dark:text-gray-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Sidebar/index.tsx",
                                    lineNumber: 179,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 171,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        showPrograms && filteredPrograms?.map((program)=>{
                            const isOpen = expandedPrograms[program.id] ?? false;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setExpandedPrograms((prev)=>{
                                                const newState = {
                                                    ...prev,
                                                    [program.id]: !isOpen
                                                };
                                                localStorage.setItem("expandedPrograms", JSON.stringify(newState));
                                                return newState;
                                            });
                                        },
                                        className: "flex w-full items-center justify-between px-8 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                                                        className: "h-5 w-5 text-gray-700 dark:text-gray-200"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Sidebar/index.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 49
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    program.name
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Sidebar/index.tsx",
                                                lineNumber: 206,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                className: "h-5 w-5 text-gray-700 dark:text-gray-200"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Sidebar/index.tsx",
                                                lineNumber: 211,
                                                columnNumber: 49
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: "h-5 w-5 text-gray-700 dark:text-gray-200"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Sidebar/index.tsx",
                                                lineNumber: 213,
                                                columnNumber: 49
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Sidebar/index.tsx",
                                        lineNumber: 190,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isOpen && partsByProgram[program.id]?.map((part)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bolt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bolt$3e$__["Bolt"],
                                            label: `${part.partName} (${part.code})`,
                                            href: `/parts/${part.id}`
                                        }, part.id, false, {
                                            fileName: "[project]/src/components/Sidebar/index.tsx",
                                            lineNumber: 220,
                                            columnNumber: 49
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, program.id, true, {
                                fileName: "[project]/src/components/Sidebar/index.tsx",
                                lineNumber: 188,
                                columnNumber: 37
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    ]
                }, void 0, true),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setShowWorkItems((prev)=>!prev),
                    className: "flex w-full items-center justify-between px-8 py-3 text-gray-500",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Work Items"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 238,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        showWorkItems ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                            className: "h-5 w-5 text-gray-500 dark:text-gray-400"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 240,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            className: "h-5 w-5 text-gray-500 dark:text-gray-400"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 242,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 234,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                showWorkItems && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                            label: "Deliverables",
                            href: "/work-items/deliverables"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 247,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
                            label: "Issues",
                            href: "/work-items/issues"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 248,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"],
                            label: "Tasks",
                            href: "/work-items/tasks"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 249,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 117,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Sidebar/index.tsx",
        lineNumber: 116,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const SidebarLink = ({ href, icon: Icon, label })=>{
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const isActive = pathname === href || pathname === "/" && href === "/dashboard";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: "w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""} justify-start px-8 py-3`,
            children: [
                isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200"
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 277,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: "h-6 w-6 text-gray-800 dark:text-gray-100"
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 279,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `font-medium text-gray-800 dark:text-gray-100`,
                    children: label
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 280,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 271,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Sidebar/index.tsx",
        lineNumber: 270,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const FeedbackLinkWithBadge = ()=>{
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const isActive = pathname === "/feedback";
    const { data: countData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGetUnreadFeedbackCountQuery"])(undefined, {
        pollingInterval: 30000
    });
    const unreadCount = countData?.count || 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: "/feedback",
        className: "w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""} justify-start px-8 py-3`,
            children: [
                isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200"
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 304,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                    className: "h-6 w-6 text-gray-800 dark:text-gray-100"
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 306,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `font-medium text-gray-800 dark:text-gray-100 flex-1`,
                    children: "Feedback"
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 307,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold bg-red-500 text-white",
                    children: unreadCount > 99 ? '99+' : unreadCount
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 311,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 298,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Sidebar/index.tsx",
        lineNumber: 297,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Sidebar;
}),
"[project]/src/lib/errorHandler.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Global error handling utilities with Sentry integration
 */ __turbopack_context__.s([
    "createErrorHandler",
    ()=>createErrorHandler,
    "getUserFriendlyErrorMessage",
    ()=>getUserFriendlyErrorMessage,
    "handleApiError",
    ()=>handleApiError,
    "logError",
    ()=>logError,
    "withErrorHandling",
    ()=>withErrorHandling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@sentry/nextjs/build/cjs/index.server.js [app-ssr] (ecmascript)");
;
const logError = (error, context)=>{
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    // In development, log to console
    if ("TURBOPACK compile-time truthy", 1) {
        console.error("Error logged:", {
            message: errorMessage,
            stack: errorStack,
            context,
            timestamp: new Date().toISOString()
        });
    }
    // Send to Sentry with context
    if (error instanceof Error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withScope"]((scope)=>{
            if (context) {
                if (context.component) {
                    scope.setTag("component", context.component);
                }
                if (context.action) {
                    scope.setTag("action", context.action);
                }
                if (context.userId) {
                    scope.setUser({
                        id: context.userId.toString()
                    });
                }
                if (context.additionalInfo) {
                    scope.setContext("additionalInfo", context.additionalInfo);
                }
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["captureException"](error);
        });
    } else {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["captureMessage"](String(error), "error");
    }
};
const getUserFriendlyErrorMessage = (error, defaultMessage = "An unexpected error occurred")=>{
    if (!(error instanceof Error)) {
        return defaultMessage;
    }
    const errorMessage = error.message.toLowerCase();
    // Network errors
    if (errorMessage.includes("network") || errorMessage.includes("fetch") || errorMessage.includes("connection")) {
        return "Unable to connect to the server. Please check your internet connection and try again.";
    }
    // Authentication errors
    if (errorMessage.includes("unauthorized") || errorMessage.includes("authentication") || errorMessage.includes("session expired")) {
        return "Your session has expired. Please log in again.";
    }
    // Permission errors
    if (errorMessage.includes("forbidden") || errorMessage.includes("permission") || errorMessage.includes("access denied")) {
        return "You don't have permission to perform this action.";
    }
    // Not found errors
    if (errorMessage.includes("not found") || errorMessage.includes("404")) {
        return "The requested resource was not found.";
    }
    // Validation errors
    if (errorMessage.includes("validation") || errorMessage.includes("invalid") || errorMessage.includes("required")) {
        return "Please check your input and try again.";
    }
    // Server errors
    if (errorMessage.includes("500") || errorMessage.includes("internal server error")) {
        return "A server error occurred. Please try again later.";
    }
    // Rate limiting
    if (errorMessage.includes("rate limit") || errorMessage.includes("too many requests")) {
        return "Too many requests. Please wait a moment and try again.";
    }
    // Return the original message if it's user-friendly, otherwise return default
    if (error.message && error.message.length < 100) {
        return error.message;
    }
    return defaultMessage;
};
const handleApiError = (error, defaultMessage = "An error occurred")=>{
    // Check for API error response structure
    if (error?.data?.message) {
        return getUserFriendlyErrorMessage(new Error(error.data.message), defaultMessage);
    }
    if (error?.message) {
        return getUserFriendlyErrorMessage(error, defaultMessage);
    }
    return defaultMessage;
};
const withErrorHandling = (fn, context)=>{
    return async (...args)=>{
        try {
            return await fn(...args);
        } catch (error) {
            logError(error, context);
            throw error;
        }
    };
};
const createErrorHandler = (context)=>{
    return (error)=>{
        logError(error, context);
        const message = getUserFriendlyErrorMessage(error);
        // You could also show a toast notification here
        // showToast.error(message);
        return message;
    };
};
}),
"[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RouteErrorBoundary",
    ()=>RouteErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$error$2d$boundary$2f$dist$2f$react$2d$error$2d$boundary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-error-boundary/dist/react-error-boundary.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/errorHandler.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const RouteErrorFallback = ({ error, resetErrorBoundary })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const isDevelopment = ("TURBOPACK compile-time value", "development") === "development";
    const handleGoHome = ()=>{
        router.push("/home");
        resetErrorBoundary();
    };
    const handleReload = ()=>{
        window.location.reload();
    };
    // Log error
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logError"])(error, {
            component: "RouteErrorBoundary",
            action: "render",
            additionalInfo: {
                pathname
            }
        });
    }, [
        error,
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-[60vh] flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-xl w-full bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "h-6 w-6 text-red-500 mr-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-gray-900 dark:text-white",
                            children: "Page Error"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600 dark:text-gray-300 mb-4",
                    children: "This page encountered an error. You can try refreshing or return to the home page."
                }, void 0, false, {
                    fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                isDevelopment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-red-700 dark:text-red-300 font-mono",
                        children: error.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                        lineNumber: 57,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: resetErrorBoundary,
                            className: "flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                "Try Again"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleGoHome,
                            className: "flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                "Go Home"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleReload,
                            className: "flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                "Reload"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const RouteErrorBoundary = ({ children, fallback: Fallback = RouteErrorFallback })=>{
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$error$2d$boundary$2f$dist$2f$react$2d$error$2d$boundary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
        FallbackComponent: Fallback,
        onError: (error, errorInfo)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logError"])(error, {
                component: "RouteErrorBoundary",
                action: "onError",
                additionalInfo: {
                    pathname,
                    componentStack: errorInfo.componentStack
                }
            });
        },
        resetKeys: [
            pathname
        ],
        onReset: ()=>{
            // Optional: scroll to top on reset
            window.scrollTo(0, 0);
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/app/dashboardWrapper.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Navbar/index.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Sidebar/index.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/redux.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ErrorBoundary$2f$RouteErrorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ErrorBoundary/RouteErrorBoundary.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const DashboardLayout = ({ children })=>{
    const isSidebarCollapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppSelector"])((state)=>state.global.isSidebarCollapsed);
    const isDarkMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppSelector"])((state)=>state.global.isDarkMode);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen w-full bg-gray-50 text-gray-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/dashboardWrapper.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: `flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${isSidebarCollapsed ? "" : "md:pl-64"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/dashboardWrapper.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboardWrapper.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboardWrapper.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const DashboardWrapper = ({ children })=>{
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { isAuthenticated, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isOnboarding, setIsOnboarding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // All hooks must be called unconditionally (Rules of Hooks)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if current path is onboarding or auth routes
        setIsOnboarding(pathname === "/onboarding" || pathname.startsWith("/auth/"));
    }, [
        pathname
    ]);
    // Public routes that don't require authentication
    const publicRoutes = [
        "/onboarding",
        "/auth/login",
        "/debug-sentry"
    ];
    const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/auth/");
    // Redirect unauthenticated users to onboarding (except for public routes)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isLoading && !isAuthenticated && !isPublicRoute) {
            router.push("/onboarding");
        }
    }, [
        isAuthenticated,
        isLoading,
        pathname,
        router,
        isPublicRoute
    ]);
    // Show loading spinner while checking authentication
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboardWrapper.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/dashboardWrapper.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // If not authenticated and not on a public route, show loading while redirecting
    if (!isAuthenticated && !isPublicRoute) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboardWrapper.tsx",
                lineNumber: 76,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/dashboardWrapper.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ErrorBoundary$2f$RouteErrorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RouteErrorBoundary"], {
            children: isOnboarding || isPublicRoute ? // For onboarding and auth routes, render without dashboard layout
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/dashboardWrapper.tsx",
                lineNumber: 86,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)) : // For all other pages, use dashboard layout (only if authenticated)
            isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardLayout, {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/dashboardWrapper.tsx",
                lineNumber: 92,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)) : // Fallback: show loading while redirecting
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboardWrapper.tsx",
                    lineNumber: 96,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/dashboardWrapper.tsx",
                lineNumber: 95,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/dashboardWrapper.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/dashboardWrapper.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = DashboardWrapper;
}),
"[project]/src/components/ErrorBoundary/index.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@sentry/nextjs/build/cjs/index.server.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Component"] {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }
    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if ("TURBOPACK compile-time truthy", 1) {
            console.error("ErrorBoundary caught an error:", error, errorInfo);
        }
        // Send to Sentry with component stack
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withScope"]((scope)=>{
            scope.setContext("reactErrorBoundary", {
                componentStack: errorInfo.componentStack
            });
            scope.setTag("errorBoundary", "true");
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["captureException"](error);
        });
        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
        // Update state with error info
        this.setState({
            error,
            errorInfo
        });
    }
    componentDidUpdate(prevProps) {
        // Reset error boundary when resetKeys change
        if (this.props.resetKeys && this.props.resetOnPropsChange) {
            const hasResetKeyChanged = this.props.resetKeys.some((key, index)=>key !== prevProps.resetKeys?.[index]);
            if (hasResetKeyChanged && this.state.hasError) {
                this.resetErrorBoundary();
            }
        }
    }
    resetErrorBoundary = ()=>{
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };
    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }
            // Default error UI
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorFallback, {
                error: this.state.error,
                errorInfo: this.state.errorInfo,
                onReset: this.resetErrorBoundary
            }, void 0, false, {
                fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                lineNumber: 96,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
const ErrorFallback = ({ error, errorInfo, onReset })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const isDevelopment = ("TURBOPACK compile-time value", "development") === "development";
    const handleGoHome = ()=>{
        router.push("/home");
        onReset();
    };
    const handleReload = ()=>{
        window.location.reload();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-2xl w-full bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "h-8 w-8 text-red-500 mr-3"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                            lineNumber: 135,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-gray-900 dark:text-white",
                            children: "Something went wrong"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                    lineNumber: 134,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600 dark:text-gray-300 mb-6",
                    children: "We're sorry, but something unexpected happened. Don't worry, your data is safe. You can try refreshing the page or return to the home page."
                }, void 0, false, {
                    fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                    lineNumber: 141,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                isDevelopment && error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-red-800 dark:text-red-200",
                                children: "Error Details (Development Only)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                                lineNumber: 149,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                            lineNumber: 148,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            className: "text-xs text-red-700 dark:text-red-300 overflow-auto max-h-48",
                            children: [
                                error.toString(),
                                errorInfo?.componentStack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        "\n\nComponent Stack:",
                                        errorInfo.componentStack
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                            lineNumber: 153,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                    lineNumber: 147,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onReset,
                            className: "flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                "Try Again"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                            lineNumber: 166,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleGoHome,
                            className: "flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                "Go to Home"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleReload,
                            className: "flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                "Reload Page"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                    lineNumber: 165,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                !isDevelopment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-6 text-sm text-gray-500 dark:text-gray-400 text-center",
                    children: [
                        "If this problem persists, please contact support with the error code:",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                            className: "bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded",
                            children: error?.name || "UNKNOWN"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                            lineNumber: 192,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ErrorBoundary/index.tsx",
                    lineNumber: 190,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ErrorBoundary/index.tsx",
            lineNumber: 133,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ErrorBoundary/index.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = ErrorBoundary;
}),
"[project]/src/lib/toast.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "showApiError",
    ()=>showApiError,
    "showApiSuccess",
    ()=>showApiSuccess,
    "showToast",
    ()=>showToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/errorHandler.ts [app-ssr] (ecmascript)");
;
;
const showToast = {
    /**
   * Show a success toast notification
   */ success: (message, duration = 4000)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success(message, {
            duration
        });
    },
    /**
   * Show an error toast notification
   */ error: (message, duration = 5000)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(message, {
            duration
        });
    },
    /**
   * Show a warning toast notification
   */ warning: (message, duration = 4000)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(message, {
            icon: "⚠️",
            duration,
            style: {
                background: "#fbbf24",
                color: "#fff"
            }
        });
    },
    /**
   * Show an info toast notification
   */ info: (message, duration = 4000)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(message, {
            icon: "ℹ️",
            duration
        });
    },
    /**
   * Show a loading toast notification
   * Returns a function to update the toast (success/error)
   */ loading: (message)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].loading(message);
    },
    /**
   * Dismiss a specific toast
   */ dismiss: (toastId)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].dismiss(toastId);
    },
    /**
   * Dismiss all toasts
   */ dismissAll: ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].dismiss();
    }
};
const showApiError = (error, defaultMessage = "An error occurred")=>{
    // Log the error for debugging
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logError"])(error, {
        component: "showApiError",
        action: "display_error"
    });
    // Get user-friendly error message
    const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleApiError"])(error, defaultMessage);
    showToast.error(message);
};
const showApiSuccess = (message)=>{
    showToast.success(message);
};
}),
"[project]/src/lib/globalErrorHandler.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "removeGlobalErrorHandlers",
    ()=>removeGlobalErrorHandlers,
    "setupGlobalErrorHandlers",
    ()=>setupGlobalErrorHandlers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/errorHandler.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/toast.ts [app-ssr] (ecmascript)");
"use client";
;
;
const setupGlobalErrorHandlers = ()=>{
    // Handle unhandled JavaScript errors
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
};
const removeGlobalErrorHandlers = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
};
}),
"[project]/src/components/ErrorBoundary/GlobalErrorHandler.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlobalErrorHandlerSetup",
    ()=>GlobalErrorHandlerSetup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$globalErrorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/globalErrorHandler.ts [app-ssr] (ecmascript)");
"use client";
;
;
const GlobalErrorHandlerSetup = ()=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Setup global error handlers
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$globalErrorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setupGlobalErrorHandlers"])();
        // Cleanup on unmount
        return ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$globalErrorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeGlobalErrorHandlers"])();
        };
    }, []);
    // This component doesn't render anything
    return null;
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c8f5a3d7._.js.map