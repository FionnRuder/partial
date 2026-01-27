(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ModalNewWorkItem/index.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Modal/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/formatISO.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const ModalNewWorkItem = (param)=>{
    let { isOpen, onClose, id = null, workItemType: initialWorkItemType = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Task } = param;
    _s();
    const { data: parts = [], isLoading: partsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPartsQuery"])();
    const { data: users = [], isLoading: usersLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetUsersQuery"])();
    const { data: programs = [], isLoading: programsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"])();
    const { data: milestones = [], isLoading: milestonesLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetMilestonesQuery"])();
    const { data: deliverableTypes = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetDeliverableTypesQuery"])();
    const { data: issueTypes = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetIssueTypesQuery"])();
    const [createWorkItem, { isLoading }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateWorkItemMutation"])();
    const [workItemType, setWorkItemType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [priority, setPriority] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tags, setTags] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [dateOpened, setDateOpened] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [dueDate, setDueDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [estimatedCompletionDate, setEstimatedCompletionDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [actualCompletionDate, setActualCompletionDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [percentComplete, setPercentComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [inputStatus, setInputStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [partIds, setPartIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [programId, setProgramId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [dueByMilestoneId, setDueByMilestoneId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [authorUserId, setAuthorUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [assignedUserId, setAssignedUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Subtype fields
    const [issueType, setIssueType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [rootCause, setRootCause] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [correctiveAction, setCorrectiveAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [deliverableType, setDeliverableType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const handleSubmit = async ()=>{
        if (!isFormValid()) return;
        const formattedDateOpened = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatISO"])(new Date(dateOpened), {
            representation: 'complete'
        });
        const formattedDueDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatISO"])(new Date(dueDate), {
            representation: 'complete'
        });
        const formattedEstimatedCompletionDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatISO"])(new Date(estimatedCompletionDate), {
            representation: 'complete'
        });
        const formattedActualCompletionDate = actualCompletionDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatISO"])(new Date(actualCompletionDate), {
            representation: 'complete'
        }) : undefined;
        const payload = {
            workItemType: workItemType,
            title,
            description,
            status: status,
            priority: priority,
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
            assignedUserId: assignedUserId
        };
        if (partIds.length > 0) {
            payload.partIds = partIds;
        }
        // Add subtype-specific data
        if (workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Issue && issueType) {
            payload.issueDetail = {
                issueType: issueType
            };
            if (rootCause) payload.issueDetail.rootCause = rootCause;
            if (correctiveAction) payload.issueDetail.correctiveAction = correctiveAction;
        } else if (workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Deliverable && deliverableType) {
            payload.deliverableDetail = {
                deliverableType: deliverableType
            };
        }
        try {
            await createWorkItem(payload).unwrap();
            onClose(); // close modal on success
        } catch (err) {
            console.error("Failed to create work item:", err);
        }
    };
    const isFormValid = ()=>{
        const baseValid = !!workItemType && !!title && !!description && !!status && !!priority && !!dateOpened && !!dueDate && !!estimatedCompletionDate && percentComplete >= 0 && !!inputStatus && !!programId && !!dueByMilestoneId && !!authorUserId && !!assignedUserId;
        if (workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Issue) {
            return baseValid && !!issueType;
        }
        if (workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Deliverable) {
            return baseValid && !!deliverableType;
        }
        return baseValid;
    };
    const selectStyles = "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
    const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        isOpen: isOpen,
        onClose: onClose,
        name: "Create New Work Item",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            className: "mt-4 space-y-6",
            onSubmit: (e)=>{
                e.preventDefault();
                handleSubmit();
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: selectStyles,
                    value: workItemType,
                    onChange: (e)=>setWorkItemType(e.target.value ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"][e.target.value] : ""),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select Work Item Type"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"]).map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: type,
                                children: type
                            }, type, false, {
                                fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                lineNumber: 177,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 164,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Issue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: selectStyles,
                    value: issueType,
                    onChange: (e)=>setIssueType(e.target.value),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select Issue Type"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 190,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        issueTypes.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: type.name,
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IssueTypeLabels"][type.name] || type.name
                            }, type.id, false, {
                                fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                lineNumber: 192,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 185,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Deliverable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: selectStyles,
                    value: deliverableType,
                    onChange: (e)=>setDeliverableType(e.target.value),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select Deliverable Type"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 205,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        deliverableTypes.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: type.name,
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeliverableTypeLabels"][type.name] || type.name
                            }, type.id, false, {
                                fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                lineNumber: 207,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 200,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    className: inputStyles,
                    placeholder: "Title",
                    value: title,
                    onChange: (e)=>setTitle(e.target.value)
                }, void 0, false, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    className: inputStyles,
                    placeholder: "Description",
                    value: description,
                    onChange: (e)=>setDescription(e.target.value)
                }, void 0, false, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 221,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Issue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            className: inputStyles,
                            placeholder: "Root Cause",
                            value: rootCause,
                            onChange: (e)=>setRootCause(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            className: inputStyles,
                            placeholder: "Corrective Action",
                            value: correctiveAction,
                            onChange: (e)=>setCorrectiveAction(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 236,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            className: selectStyles,
                            value: status,
                            onChange: (e)=>setStatus(e.target.value),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Select Status"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 251,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Status"]).map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: s,
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusLabels"][s]
                                    }, s, false, {
                                        fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                        lineNumber: 253,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            className: selectStyles,
                            value: priority,
                            onChange: (e)=>setPriority(e.target.value),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Select Priority"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Priority"].Urgent,
                                    children: "Urgent"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 264,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Priority"].High,
                                    children: "High"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 265,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Priority"].Medium,
                                    children: "Medium"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 266,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Priority"].Low,
                                    children: "Low"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 267,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Priority"].Backlog,
                                    children: "Backlog"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 268,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 258,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 245,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    className: inputStyles,
                    placeholder: "Tags (comma separated)",
                    value: tags,
                    onChange: (e)=>setTags(e.target.value)
                }, void 0, false, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 271,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm text-gray-600 dark:text-gray-300",
                                    children: "Date Opened:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 281,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    className: inputStyles,
                                    value: dateOpened,
                                    onChange: (e)=>setDateOpened(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 284,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 280,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm text-gray-600 dark:text-gray-300",
                                    children: "Due Date:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 293,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    className: inputStyles,
                                    value: dueDate,
                                    onChange: (e)=>setDueDate(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 296,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 292,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm text-gray-600 dark:text-gray-300",
                                    children: "Estimated Completion:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 305,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    className: inputStyles,
                                    value: estimatedCompletionDate,
                                    onChange: (e)=>setEstimatedCompletionDate(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 308,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 304,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm text-gray-600 dark:text-gray-300",
                                    children: "Actual Completion:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 317,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    className: inputStyles,
                                    value: actualCompletionDate,
                                    onChange: (e)=>setActualCompletionDate(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 320,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 316,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 279,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm text-gray-600 dark:text-gray-300",
                            children: "Percent Complete:"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 329,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            className: inputStyles,
                            value: percentComplete,
                            onChange: (e)=>setPercentComplete(Number(e.target.value)),
                            min: 0,
                            max: 100
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 332,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 328,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    className: inputStyles,
                    placeholder: "Current Status",
                    value: inputStatus,
                    onChange: (e)=>setInputStatus(e.target.value)
                }, void 0, false, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 341,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm text-gray-600 dark:text-gray-300",
                            children: "Affected Part(s):"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 349,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            multiple: true,
                            className: inputStyles,
                            value: partIds.map(String),
                            onChange: (e)=>{
                                const selectedOptions = Array.from(e.target.selectedOptions);
                                const ids = selectedOptions.map((opt)=>Number(opt.value));
                                setPartIds(ids);
                            },
                            disabled: partsLoading,
                            children: parts === null || parts === void 0 ? void 0 : parts.map((part)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: part.id,
                                    children: [
                                        part.partName,
                                        " (",
                                        part.code,
                                        ")"
                                    ]
                                }, part.id, true, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 364,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 352,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-xs text-gray-600 dark:text-gray-300",
                            children: [
                                "Hold ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    children: "Ctrl"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 370,
                                    columnNumber: 18
                                }, ("TURBOPACK compile-time value", void 0)),
                                " (Windows) or ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    children: "Cmd"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                    lineNumber: 370,
                                    columnNumber: 47
                                }, ("TURBOPACK compile-time value", void 0)),
                                " (Mac) to select multiple."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 369,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 348,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: inputStyles,
                    value: programId,
                    onChange: (e)=>setProgramId(e.target.value),
                    disabled: programsLoading,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select Program"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 379,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        programs.map((program)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: program.id,
                                children: program.name
                            }, program.id, false, {
                                fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                lineNumber: 381,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 373,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: inputStyles,
                    value: dueByMilestoneId,
                    onChange: (e)=>setDueByMilestoneId(e.target.value),
                    disabled: milestonesLoading,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select Milestone"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 392,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        milestones.map((milestone)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: milestone.id,
                                children: milestone.name
                            }, milestone.id, false, {
                                fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                lineNumber: 394,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 386,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: inputStyles,
                    value: authorUserId,
                    onChange: (e)=>setAuthorUserId(e.target.value),
                    disabled: usersLoading,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select Author User"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 405,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: user.id,
                                children: [
                                    user.name,
                                    " (",
                                    user.username,
                                    ")"
                                ]
                            }, user.id, true, {
                                fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                lineNumber: 407,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 399,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: inputStyles,
                    value: assignedUserId,
                    onChange: (e)=>setAssignedUserId(e.target.value),
                    disabled: usersLoading,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select Assigned User"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                            lineNumber: 418,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: user.id,
                                children: [
                                    user.name,
                                    " (",
                                    user.username,
                                    ")"
                                ]
                            }, user.id, true, {
                                fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                                lineNumber: 420,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 412,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "submit",
                    className: "focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ".concat(!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""),
                    disabled: !isFormValid() || isLoading,
                    children: isLoading ? "Creating ".concat(workItemType, "...") : "Create Work Item ".concat(workItemType)
                }, void 0, false, {
                    fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
                    lineNumber: 427,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
            lineNumber: 157,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ModalNewWorkItem/index.tsx",
        lineNumber: 156,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ModalNewWorkItem, "zz9VgfYPePWzZpNkeqP/RbLF/1A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPartsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetUsersQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetMilestonesQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetDeliverableTypesQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetIssueTypesQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateWorkItemMutation"]
    ];
});
_c = ModalNewWorkItem;
const __TURBOPACK__default__export__ = ModalNewWorkItem;
var _c;
__turbopack_context__.k.register(_c, "ModalNewWorkItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/BurndownChart/index.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-chartjs-2/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/dist/chart.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$eachDayOfInterval$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/eachDayOfInterval.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isAfter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/isAfter.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"].register(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CategoryScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LinearScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PointElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LineElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Title"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tooltip"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Legend"]);
// Helper function to parse date string without timezone conversion
// Extracts the date portion (YYYY-MM-DD) and parses it as a local date
const parseDateOnly = (dateString)=>{
    if (!dateString) return null;
    try {
        // Extract just the date portion (YYYY-MM-DD) from ISO string
        const dateOnly = dateString.split('T')[0];
        // Parse as local date to avoid timezone conversion
        const [year, month, day] = dateOnly.split('-').map(Number);
        if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
        return new Date(year, month - 1, day);
    } catch (e) {
        return null;
    }
};
const BurndownChart = (param)=>{
    let { workItems, startDate, endDate, isDarkMode = false } = param;
    _s();
    const today = new Date();
    // Set today to midnight to avoid timezone issues when comparing
    today.setHours(0, 0, 0, 0);
    // Determine chart start/end date
    const minDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BurndownChart.useMemo[minDate]": ()=>{
            if (startDate) {
                const parsed = parseDateOnly(startDate);
                return parsed || today;
            }
            const dates = workItems.map({
                "BurndownChart.useMemo[minDate].dates": (w)=>parseDateOnly(w.dueDate)
            }["BurndownChart.useMemo[minDate].dates"]).concat(workItems.map({
                "BurndownChart.useMemo[minDate].dates": (w)=>parseDateOnly(w.estimatedCompletionDate || w.dueDate)
            }["BurndownChart.useMemo[minDate].dates"])).concat(workItems.map({
                "BurndownChart.useMemo[minDate].dates": (w)=>parseDateOnly(w.actualCompletionDate || w.dueDate)
            }["BurndownChart.useMemo[minDate].dates"])).filter({
                "BurndownChart.useMemo[minDate].dates": (d)=>d !== null
            }["BurndownChart.useMemo[minDate].dates"]);
            return dates.length > 0 ? new Date(Math.min(...dates.map({
                "BurndownChart.useMemo[minDate]": (d)=>d.getTime()
            }["BurndownChart.useMemo[minDate]"]))) : today;
        }
    }["BurndownChart.useMemo[minDate]"], [
        workItems,
        startDate,
        today
    ]);
    const maxDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BurndownChart.useMemo[maxDate]": ()=>{
            // If endDate is explicitly provided, use it
            if (endDate) {
                const parsed = parseDateOnly(endDate);
                return parsed || today;
            }
            // Collect all dates from work items (dueDate, estimatedCompletionDate, actualCompletionDate)
            const dates = workItems.map({
                "BurndownChart.useMemo[maxDate].dates": (w)=>parseDateOnly(w.dueDate)
            }["BurndownChart.useMemo[maxDate].dates"]).concat(workItems.map({
                "BurndownChart.useMemo[maxDate].dates": (w)=>parseDateOnly(w.estimatedCompletionDate || w.dueDate)
            }["BurndownChart.useMemo[maxDate].dates"])).concat(workItems.map({
                "BurndownChart.useMemo[maxDate].dates": (w)=>parseDateOnly(w.actualCompletionDate || w.dueDate)
            }["BurndownChart.useMemo[maxDate].dates"])).filter({
                "BurndownChart.useMemo[maxDate].dates": (d)=>d !== null
            }["BurndownChart.useMemo[maxDate].dates"]);
            // Get the maximum of all dates
            const max = dates.length > 0 ? new Date(Math.max(...dates.map({
                "BurndownChart.useMemo[maxDate]": (d)=>d.getTime()
            }["BurndownChart.useMemo[maxDate]"]))) : today;
            // Ensure the max is at least today
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isAfter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAfter"])(max, today) ? max : today;
        }
    }["BurndownChart.useMemo[maxDate]"], [
        workItems,
        endDate,
        today
    ]);
    const dates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$eachDayOfInterval$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eachDayOfInterval"])({
        start: minDate,
        end: maxDate
    }).map((d)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(d, "yyyy-MM-dd"));
    // Get total number of work items
    const totalItems = workItems.length;
    // Get the latest due date for baseline calculation
    const latestDueDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BurndownChart.useMemo[latestDueDate]": ()=>{
            const dueDates = workItems.map({
                "BurndownChart.useMemo[latestDueDate].dueDates": (w)=>parseDateOnly(w.dueDate)
            }["BurndownChart.useMemo[latestDueDate].dueDates"]).filter({
                "BurndownChart.useMemo[latestDueDate].dueDates": (d)=>d !== null
            }["BurndownChart.useMemo[latestDueDate].dueDates"]);
            return dueDates.length > 0 ? new Date(Math.max(...dueDates.map({
                "BurndownChart.useMemo[latestDueDate]": (d)=>d.getTime()
            }["BurndownChart.useMemo[latestDueDate]"]))) : maxDate;
        }
    }["BurndownChart.useMemo[latestDueDate]"], [
        workItems,
        maxDate
    ]);
    // Helper function to count remaining items for actuals (based on actual completion date or status)
    const getActualsRemaining = (dateStr)=>{
        const currentDate = parseDateOnly(dateStr);
        if (!currentDate) return workItems.length;
        return workItems.filter((w)=>{
            // If item has an actualCompletionDate, use it for precise timing
            if (w.actualCompletionDate) {
                const completionDate = parseDateOnly(w.actualCompletionDate);
                if (!completionDate) return true; // No valid date means still remaining
                // Item is remaining if completion date is after current date
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isAfter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAfter"])(completionDate, currentDate);
            }
            // If no actualCompletionDate, check status
            // If status is Completed, we don't know when it was completed, so we can't accurately track it
            // For items without completion date but marked as completed, we'll assume they're completed
            // This is a limitation - ideally all completed items should have actualCompletionDate
            if (w.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Status"].Completed) {
                // Without a date, we can't know when it was completed, so we'll treat it as completed
                // This means it won't be counted as remaining
                return false;
            }
            // Item is still remaining if not completed
            return true;
        }).length;
    };
    // Helper function to count remaining items for forecast (based on estimated completion date)
    const getForecastRemaining = (dateStr)=>{
        const currentDate = parseDateOnly(dateStr);
        if (!currentDate) return workItems.length;
        return workItems.filter((w)=>{
            const estimatedDate = w.estimatedCompletionDate ? parseDateOnly(w.estimatedCompletionDate) : w.dueDate ? parseDateOnly(w.dueDate) : null;
            if (!estimatedDate) return true; // No date means still remaining
            // Item is remaining if estimated completion date is after current date
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isAfter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAfter"])(estimatedDate, currentDate);
        }).length;
    };
    // Calculate baseline: count items with due dates after current date
    // This represents the planned burndown - items remaining based on their due dates
    const baselineLine = dates.map((d)=>{
        const currentDate = parseDateOnly(d);
        if (!currentDate) return workItems.length;
        return workItems.filter((w)=>{
            const dueDate = w.dueDate ? parseDateOnly(w.dueDate) : null;
            if (!dueDate) return true; // Items without due dates are always remaining
            // Item is remaining if due date is after current date
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isAfter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAfter"])(dueDate, currentDate);
        }).length;
    });
    // Calculate forecast line: items remaining based on estimated completion dates
    const forecastLine = dates.map((d)=>getForecastRemaining(d));
    // Calculate actuals line: items remaining based on actual completion dates (only up to today)
    const actualsLine = dates.map((d)=>{
        const currentDate = parseDateOnly(d);
        if (!currentDate) return null;
        // Only show actuals up to today
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isAfter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAfter"])(currentDate, today)) {
            return null;
        }
        return getActualsRemaining(d);
    });
    const data = {
        labels: dates,
        datasets: [
            {
                label: "Actuals (Remaining)",
                data: actualsLine,
                borderColor: "#66CDAA",
                backgroundColor: "rgba(102,205,170,0.2)",
                fill: true,
                spanGaps: false
            },
            {
                label: "Baseline (Due Date)",
                data: baselineLine,
                borderColor: "#FF9500",
                backgroundColor: "rgba(255,149,0,0.2)",
                fill: true
            },
            {
                label: "Forecast (Estimated Completion)",
                data: forecastLine,
                borderColor: "#6FA8DC",
                backgroundColor: "rgba(111, 168, 220, 0.2)",
                fill: true
            }
        ]
    };
    const textColor = isDarkMode ? "#FFFFFF" : "#000000";
    const gridColor = isDarkMode ? "#444" : "#CCC";
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: textColor,
                    usePointStyle: true
                }
            },
            title: {
                display: false,
                text: "Work Item Burndown Chart",
                color: textColor
            },
            tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: isDarkMode ? "#222" : "#fff",
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: gridColor,
                borderWidth: 1,
                callbacks: {
                    label: function(tooltipItem) {
                        const datasetLabel = tooltipItem.dataset.label || "";
                        const value = tooltipItem.raw === null ? "—" : tooltipItem.raw;
                        return "".concat(datasetLabel, ": ").concat(value);
                    }
                }
            }
        },
        interaction: {
            mode: "index",
            intersect: false
        },
        scales: {
            x: {
                title: {
                    display: false,
                    text: "Date",
                    color: textColor
                },
                ticks: {
                    color: textColor
                },
                grid: {
                    color: gridColor
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: false,
                    text: "Remaining Work Items",
                    color: textColor
                },
                ticks: {
                    color: textColor
                },
                grid: {
                    color: gridColor
                }
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
        data: data,
        options: options
    }, void 0, false, {
        fileName: "[project]/src/components/BurndownChart/index.tsx",
        lineNumber: 262,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(BurndownChart, "2QvjywjuXIjTZkD92gHk1DBlyNQ=");
_c = BurndownChart;
const __TURBOPACK__default__export__ = BurndownChart;
var _c;
__turbopack_context__.k.register(_c, "BurndownChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dataGridClassNames",
    ()=>dataGridClassNames,
    "dataGridSxStyles",
    ()=>dataGridSxStyles
]);
const dataGridClassNames = "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";
const dataGridSxStyles = (isDarkMode)=>{
    return {
        "& .MuiDataGrid-columnHeaders": {
            color: "".concat(isDarkMode ? "#e5e7eb" : ""),
            '& [role="row"] > *': {
                backgroundColor: "".concat(isDarkMode ? "#1d1f21" : "white"),
                borderColor: "".concat(isDarkMode ? "#2d3135" : "")
            }
        },
        "& .MuiIconbutton-root": {
            color: "".concat(isDarkMode ? "#a3a3a3" : "")
        },
        "& .MuiTablePagination-root": {
            color: "".concat(isDarkMode ? "#a3a3a3" : "")
        },
        "& .MuiTablePagination-selectIcon": {
            color: "".concat(isDarkMode ? "#a3a3a3" : "")
        },
        "& .MuiDataGrid-cell": {
            border: "none"
        },
        "& .MuiDataGrid-row": {
            borderBottom: "1px solid ".concat(isDarkMode ? "#2d3135" : "e5e7eb"),
            "&:hover": {
                backgroundColor: "".concat(isDarkMode ? "#2d3135" : "#f3f4f6")
            }
        },
        "& .MuiDataGrid-withBorderColor": {
            borderColor: "".concat(isDarkMode ? "#2d3135" : "e5e7eb")
        }
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/work-items/deliverables/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/redux.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModalNewWorkItem$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ModalNewWorkItem/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BurndownChart$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BurndownChart/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$x$2d$data$2d$grid$2f$esm$2f$DataGrid$2f$DataGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/x-data-grid/esm/DataGrid/DataGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-plus.js [app-client] (ecmascript) <export default as PlusSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SquarePen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as SquarePen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
;
const getStatusColor = (status)=>{
    switch(status){
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Status"].ToDo:
            return "bg-gray-100 text-gray-800";
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Status"].WorkInProgress:
            return "bg-blue-100 text-blue-800";
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Status"].UnderReview:
            return "bg-yellow-100 text-yellow-800";
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Status"].Completed:
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};
const getPriorityColor = (priority)=>{
    switch(priority){
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Priority"].Urgent:
            return "bg-red-100 text-red-800";
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Priority"].High:
            return "bg-orange-100 text-orange-800";
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Priority"].Medium:
            return "bg-yellow-100 text-yellow-800";
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Priority"].Low:
            return "bg-green-100 text-green-800";
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Priority"].Backlog:
            return "bg-gray-100 text-gray-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};
const formatDate = (dateString)=>{
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
};
const workItemColumns = [
    {
        field: "workItemType",
        headerName: "Type",
        width: 120,
        renderCell: (params)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800",
                children: params.value
            }, void 0, false, {
                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        field: "title",
        headerName: "Title",
        minWidth: 200,
        flex: 1
    },
    {
        field: "status",
        headerName: "Status",
        width: 140,
        renderCell: (params)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex rounded-full px-2 text-xs font-semibold leading-5 ".concat(getStatusColor(params.value)),
                children: params.value
            }, void 0, false, {
                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        field: "priority",
        headerName: "Priority",
        width: 110,
        renderCell: (params)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex rounded-full px-2 text-xs font-semibold leading-5 ".concat(getPriorityColor(params.value)),
                children: params.value
            }, void 0, false, {
                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
    },
    {
        field: "dueDate",
        headerName: "Due Date",
        width: 120,
        renderCell: (params)=>{
            const dateStr = formatDate(params.value);
            const isPastDue = params.value && new Date(params.value) < new Date();
            const isNotCompleted = params.row.status !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Status"].Completed;
            const shouldHighlight = isPastDue && isNotCompleted;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: shouldHighlight ? "text-red-600 font-semibold" : "",
                children: dateStr
            }, void 0, false, {
                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                lineNumber: 102,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        field: "estimatedCompletionDate",
        headerName: "ECD",
        width: 130,
        renderCell: (params)=>{
            const dateStr = formatDate(params.value);
            const isPastDue = params.value && new Date(params.value) < new Date();
            const isNotCompleted = params.row.status !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Status"].Completed;
            const shouldHighlight = isPastDue && isNotCompleted;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: shouldHighlight ? "text-red-600 font-semibold" : "",
                children: dateStr
            }, void 0, false, {
                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                lineNumber: 119,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        field: "percentComplete",
        headerName: "% Complete",
        width: 110,
        renderCell: (params)=>{
            var _params_value;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-medium",
                children: [
                    (_params_value = params.value) !== null && _params_value !== void 0 ? _params_value : 0,
                    "%"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0));
        }
    },
    {
        field: "inputStatus",
        headerName: "Input Status",
        width: 200,
        renderCell: (params)=>params.value || "N/A"
    },
    {
        field: "assigneeUserName",
        headerName: "Assignee",
        width: 150,
        renderCell: (params)=>params.value || "Unassigned"
    }
];
const DeliverablesPage = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isModalNewWorkItemOpen, setIsModalNewWorkItemOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedPriority, setSelectedPriority] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [workItemFilter, setWorkItemFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [selectedTeamId, setSelectedTeamId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [selectedProgramId, setSelectedProgramId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [selectedDeliverableType, setSelectedDeliverableType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const { data: workItems, isLoading, isError: isWorkItemsError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWorkItemsQuery"])();
    const { data: teams } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetTeamsQuery"])();
    const { data: users } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetUsersQuery"])();
    const { data: programs } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"])();
    const { data: deliverableTypes } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetDeliverableTypesQuery"])();
    const isDarkMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "DeliverablesPage.useAppSelector[isDarkMode]": (state)=>state.global.isDarkMode
    }["DeliverablesPage.useAppSelector[isDarkMode]"]);
    // First filter by work item type, then apply deliverable type filter, then program filter, then team filter, then status filter
    const typeFilteredWorkItems = workItems === null || workItems === void 0 ? void 0 : workItems.filter((workItem)=>workItem.workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Deliverable);
    // Apply deliverable type filtering
    const deliverableTypeFilteredWorkItems = selectedDeliverableType === "all" ? typeFilteredWorkItems : typeFilteredWorkItems === null || typeFilteredWorkItems === void 0 ? void 0 : typeFilteredWorkItems.filter((item)=>{
        var _item_deliverableDetail;
        const type = (_item_deliverableDetail = item.deliverableDetail) === null || _item_deliverableDetail === void 0 ? void 0 : _item_deliverableDetail.deliverableType;
        const typeName = typeof type === 'string' ? type : type && typeof type === 'object' && 'name' in type ? type.name : '';
        return typeName === selectedDeliverableType;
    });
    // Apply program filtering
    const programFilteredWorkItems = selectedProgramId === "all" ? deliverableTypeFilteredWorkItems : deliverableTypeFilteredWorkItems === null || deliverableTypeFilteredWorkItems === void 0 ? void 0 : deliverableTypeFilteredWorkItems.filter((item)=>item.programId === selectedProgramId);
    // Apply team filtering
    const teamFilteredWorkItems = selectedTeamId === "all" ? programFilteredWorkItems : programFilteredWorkItems === null || programFilteredWorkItems === void 0 ? void 0 : programFilteredWorkItems.filter((item)=>{
        const assignee = users === null || users === void 0 ? void 0 : users.find((u)=>u.id === item.assignedUserId);
        return (assignee === null || assignee === void 0 ? void 0 : assignee.disciplineTeamId) === selectedTeamId;
    });
    const filteredWorkItems = workItemFilter === "open" ? teamFilteredWorkItems === null || teamFilteredWorkItems === void 0 ? void 0 : teamFilteredWorkItems.filter((item)=>item.status !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Status"].Completed) : teamFilteredWorkItems;
    if (isWorkItemsError) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Error fetching work items."
    }, void 0, false, {
        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
        lineNumber: 194,
        columnNumber: 34
    }, ("TURBOPACK compile-time value", void 0));
    // Priority filtering for the table
    const filteredWorkItemsByPriority = selectedPriority === "all" ? filteredWorkItems : filteredWorkItems === null || filteredWorkItems === void 0 ? void 0 : filteredWorkItems.filter((item)=>item.priority === selectedPriority);
    const displayedWorkItems = [
        ...filteredWorkItemsByPriority || []
    ].sort((a, b)=>new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((item)=>{
        var _item_assigneeUser;
        return {
            ...item,
            assigneeUserName: ((_item_assigneeUser = item.assigneeUser) === null || _item_assigneeUser === void 0 ? void 0 : _item_assigneeUser.name) || "Unassigned"
        };
    });
    // Priority counts for dropdown
    const priorityCounts = (filteredWorkItems === null || filteredWorkItems === void 0 ? void 0 : filteredWorkItems.reduce((acc, item)=>{
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
    }, {})) || {};
    const totalCount = (filteredWorkItems === null || filteredWorkItems === void 0 ? void 0 : filteredWorkItems.length) || 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "m-5 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModalNewWorkItem$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isModalNewWorkItemOpen,
                onClose: ()=>setIsModalNewWorkItemOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                lineNumber: 222,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                name: "Deliverables",
                buttonComponent: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600 transition-colors",
                            onClick: ()=>setIsModalNewWorkItemOpen(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusSquare$3e$__["PlusSquare"], {
                                    className: "mr-2 h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                    lineNumber: 230,
                                    columnNumber: 33
                                }, void 0),
                                "Add Deliverable"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                            lineNumber: 227,
                            columnNumber: 25
                        }, void 0),
                        (user === null || user === void 0 ? void 0 : user.role) && [
                            'Admin',
                            'Manager',
                            'Program Manager'
                        ].includes(user.role) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push('/deliverable-types'),
                            className: "flex items-center rounded-md bg-gray-300 px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-dark-tertiary dark:text-white dark:hover:bg-gray-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SquarePen$3e$__["SquarePen"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                    lineNumber: 240,
                                    columnNumber: 33
                                }, void 0),
                                "Edit Deliverable Types"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                            lineNumber: 236,
                            columnNumber: 29
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-1 dark:border-gray-600 dark:bg-dark-tertiary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "px-3 py-1 text-sm font-medium transition-colors ".concat(workItemFilter === "all" ? "rounded-md bg-white text-gray-900 shadow-sm dark:bg-dark-secondary dark:text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"),
                                        onClick: ()=>setWorkItemFilter("all"),
                                        children: "All Deliverables"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                        lineNumber: 248,
                                        columnNumber: 33
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "px-3 py-1 text-sm font-medium transition-colors ".concat(workItemFilter === "open" ? "rounded-md bg-white text-gray-900 shadow-sm dark:bg-dark-secondary dark:text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"),
                                        onClick: ()=>setWorkItemFilter("open"),
                                        children: "Open Deliverables"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                        lineNumber: 258,
                                        columnNumber: 33
                                    }, void 0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                lineNumber: 247,
                                columnNumber: 29
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                            lineNumber: 246,
                            columnNumber: 25
                        }, void 0)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                    lineNumber: 226,
                    columnNumber: 21
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                lineNumber: 223,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex items-center gap-4 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        id: "program-select",
                        className: "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-dark-secondary dark:text-white",
                        value: selectedProgramId,
                        onChange: (e)=>{
                            const value = e.target.value;
                            setSelectedProgramId(value === "all" ? "all" : parseInt(value));
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "all",
                                children: "All Programs"
                            }, void 0, false, {
                                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                lineNumber: 286,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            programs === null || programs === void 0 ? void 0 : programs.map((program)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: program.id,
                                    children: program.name
                                }, program.id, false, {
                                    fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                    lineNumber: 288,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                        lineNumber: 277,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        id: "team-select",
                        className: "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-dark-secondary dark:text-white",
                        value: selectedTeamId,
                        onChange: (e)=>{
                            const value = e.target.value;
                            setSelectedTeamId(value === "all" ? "all" : parseInt(value));
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "all",
                                children: "All Teams"
                            }, void 0, false, {
                                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                lineNumber: 304,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            teams === null || teams === void 0 ? void 0 : teams.map((team)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: team.id,
                                    children: team.name
                                }, team.id, false, {
                                    fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                    lineNumber: 306,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                        lineNumber: 295,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        id: "deliverable-type-select",
                        className: "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-dark-secondary dark:text-white",
                        value: selectedDeliverableType,
                        onChange: (e)=>{
                            const value = e.target.value;
                            setSelectedDeliverableType(value === "all" ? "all" : value);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "all",
                                children: "All Deliverable Types"
                            }, void 0, false, {
                                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                lineNumber: 322,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            deliverableTypes === null || deliverableTypes === void 0 ? void 0 : deliverableTypes.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: type.name,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeliverableTypeLabels"][type.name] || type.name
                                }, type.id, false, {
                                    fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                    lineNumber: 324,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                        lineNumber: 313,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                lineNumber: 275,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 rounded-lg bg-white p-4 shadow dark:bg-dark-secondary",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold dark:text-white",
                                children: selectedPriority === "all" ? "All Deliverables" : "".concat(selectedPriority, " Priority Deliverables")
                            }, void 0, false, {
                                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                lineNumber: 334,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: selectedPriority,
                                onChange: (e)=>setSelectedPriority(e.target.value),
                                className: "rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-dark-secondary dark:text-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: [
                                            "All Priorities (",
                                            totalCount,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                        lineNumber: 344,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Priority"]).map((priority)=>{
                                        var _priorityCounts_priority;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: priority,
                                            children: [
                                                priority,
                                                " (",
                                                (_priorityCounts_priority = priorityCounts[priority]) !== null && _priorityCounts_priority !== void 0 ? _priorityCounts_priority : 0,
                                                ")"
                                            ]
                                        }, priority, true, {
                                            fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                            lineNumber: 346,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0));
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                                lineNumber: 339,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                        lineNumber: 333,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            height: 500,
                            width: "100%"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$x$2d$data$2d$grid$2f$esm$2f$DataGrid$2f$DataGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataGrid"], {
                            rows: displayedWorkItems,
                            columns: workItemColumns,
                            loading: isLoading,
                            getRowClassName: ()=>"data-grid-row",
                            getCellClassName: ()=>"data-grid-cell",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dataGridClassNames"],
                            showToolbar: true,
                            sx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dataGridSxStyles"])(isDarkMode),
                            initialState: {
                                sorting: {
                                    sortModel: [
                                        {
                                            field: "dueDate",
                                            sort: "asc"
                                        }
                                    ]
                                }
                            },
                            onRowClick: (params)=>router.push("/work-items/".concat(params.row.id))
                        }, void 0, false, {
                            fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                            lineNumber: 353,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                        lineNumber: 352,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                lineNumber: 332,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 rounded-lg bg-white p-4 shadow dark:bg-dark-secondary",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mb-4 text-lg font-semibold dark:text-white",
                        children: "Deliverables Burndown Chart"
                    }, void 0, false, {
                        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                        lineNumber: 374,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BurndownChart$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        workItems: deliverableTypeFilteredWorkItems || [],
                        isDarkMode: isDarkMode
                    }, void 0, false, {
                        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                        lineNumber: 377,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/work-items/deliverables/page.tsx",
                lineNumber: 373,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/work-items/deliverables/page.tsx",
        lineNumber: 221,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(DeliverablesPage, "EYsP7FN+4xn6a1ndapAscDcuj0o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWorkItemsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetTeamsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetUsersQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetDeliverableTypesQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"]
    ];
});
_c = DeliverablesPage;
const __TURBOPACK__default__export__ = DeliverablesPage;
var _c;
__turbopack_context__.k.register(_c, "DeliverablesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_2aed0405._.js.map