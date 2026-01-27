(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/parts/ModalEditPart/index.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Modal/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ModalEditPart = (param)=>{
    let { isOpen, onClose, part } = param;
    _s();
    const [editPart, { isLoading }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEditPartMutation"])();
    const [deletePart, { isLoading: isDeleting }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeletePartMutation"])();
    const { data: users = [], isLoading: usersLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetUsersQuery"])();
    const { data: programs = [], isLoading: programsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"])();
    const { data: parentParts = [], isLoading: partsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPartsQuery"])();
    const [partCode, setPartCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [partName, setPartName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [level, setLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [revisionLevel, setRevisionLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [assignedUserId, setAssignedUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [assignedUserName, setAssignedUserName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [programId, setProgramId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [programName, setProgramName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [parentId, setParentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [parentPartName, setParentPartName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // ✅ Auto-fill fields when modal opens or part changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModalEditPart.useEffect": ()=>{
            if (part) {
                var _part_level, _part_assignedUserId, _part_programId, _part_parentId;
                setPartCode((part === null || part === void 0 ? void 0 : part.code) || "");
                setPartName((part === null || part === void 0 ? void 0 : part.partName) || "");
                setLevel((part === null || part === void 0 ? void 0 : (_part_level = part.level) === null || _part_level === void 0 ? void 0 : _part_level.toString()) || "");
                setState((part === null || part === void 0 ? void 0 : part.state) || "");
                setRevisionLevel((part === null || part === void 0 ? void 0 : part.revisionLevel) || "");
                setAssignedUserId((part === null || part === void 0 ? void 0 : (_part_assignedUserId = part.assignedUserId) === null || _part_assignedUserId === void 0 ? void 0 : _part_assignedUserId.toString()) || "");
                // prefill assignedUserName if part.assignedUserId is known
                const assignedUser = users.find({
                    "ModalEditPart.useEffect.assignedUser": (u)=>u.id === part.assignedUserId
                }["ModalEditPart.useEffect.assignedUser"]);
                setAssignedUserName((assignedUser === null || assignedUser === void 0 ? void 0 : assignedUser.name) || "");
                setProgramId((part === null || part === void 0 ? void 0 : (_part_programId = part.programId) === null || _part_programId === void 0 ? void 0 : _part_programId.toString()) || "");
                // Prefill program name if known
                const program = programs.find({
                    "ModalEditPart.useEffect.program": (p)=>p.id === part.programId
                }["ModalEditPart.useEffect.program"]);
                setProgramName((program === null || program === void 0 ? void 0 : program.name) || "");
                setParentId((part === null || part === void 0 ? void 0 : (_part_parentId = part.parentId) === null || _part_parentId === void 0 ? void 0 : _part_parentId.toString()) || "");
                // prefill assignedUserName if part.assignedUserId is known
                const parentPart = parentParts.find({
                    "ModalEditPart.useEffect.parentPart": (p)=>p.id === part.parentId
                }["ModalEditPart.useEffect.parentPart"]);
                setParentPartName((parentPart === null || parentPart === void 0 ? void 0 : parentPart.partName) || "");
            }
        }
    }["ModalEditPart.useEffect"], [
        part,
        users,
        programs,
        parentParts
    ]);
    const handleSubmit = async ()=>{
        if (!part) return;
        await editPart({
            partId: part.id,
            updates: {
                code: partCode,
                partName,
                level: Number(level),
                state: state || undefined,
                revisionLevel,
                assignedUserId: assignedUserId,
                programId: Number(programId),
                parentId: parentId ? Number(parentId) : undefined
            }
        });
        onClose(); // close modal on success
    };
    const isFormValid = ()=>partCode && partName && level && state && revisionLevel && assignedUserId && programId;
    const handleDelete = async ()=>{
        if (!part) return;
        const confirmed = window.confirm('Are you sure you want to delete "'.concat(part.partName, '"? This action cannot be undone.'));
        if (!confirmed) return;
        try {
            await deletePart(part.id).unwrap();
            onClose(); // close modal on success
        } catch (err) {
            console.error("Failed to delete part:", err);
        }
    };
    const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        isOpen: isOpen,
        onClose: onClose,
        name: "Edit Part",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            className: "mt-4 space-y-6",
            onSubmit: (e)=>{
                e.preventDefault();
                handleSubmit();
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm text-gray-600 dark:text-gray-300",
                            children: "Part Code:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            className: inputStyles,
                            placeholder: "Part Code",
                            value: partCode,
                            onChange: (e)=>setPartCode(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 131,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm text-gray-600 dark:text-gray-300",
                            children: "Part Name:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 140,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            className: inputStyles,
                            placeholder: "Part Name",
                            value: partName,
                            onChange: (e)=>setPartName(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 143,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm text-gray-600 dark:text-gray-300",
                            children: "Level:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 152,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            className: inputStyles,
                            placeholder: "Level",
                            value: level,
                            onChange: (e)=>setLevel(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 155,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm text-gray-600 dark:text-gray-300",
                            children: "State:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 164,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            className: inputStyles,
                            value: state,
                            onChange: (e)=>setState(e.target.value),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Select State"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                                    lineNumber: 172,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PartState"]).map((stateValue)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: stateValue,
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PartStateLabels"][stateValue]
                                    }, stateValue, false, {
                                        fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                                        lineNumber: 174,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 167,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                    lineNumber: 163,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm text-gray-600 dark:text-gray-300",
                            children: "Revision Level:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 181,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            className: inputStyles,
                            placeholder: "Revision Level",
                            value: revisionLevel,
                            onChange: (e)=>setRevisionLevel(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 184,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                    lineNumber: 180,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm text-gray-600 dark:text-gray-300",
                            children: "Assignee:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 193,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            className: inputStyles,
                            value: assignedUserId,
                            onChange: (e)=>{
                                setAssignedUserId(e.target.value);
                                const selected = users.find((u)=>u.id === e.target.value);
                                setAssignedUserName((selected === null || selected === void 0 ? void 0 : selected.name) || "");
                            },
                            disabled: usersLoading,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Select Assigned User"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
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
                                        fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                                        lineNumber: 208,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 196,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                    lineNumber: 192,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm text-gray-600 dark:text-gray-300",
                            children: "Program:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 215,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            className: inputStyles,
                            value: programId,
                            onChange: (e)=>{
                                setProgramId(e.target.value);
                                const selected = programs.find((p)=>p.id === Number(e.target.value));
                                setProgramName((selected === null || selected === void 0 ? void 0 : selected.name) || "");
                            },
                            disabled: programsLoading,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Select Program"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                programs.map((program)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: program.id,
                                        children: program.name
                                    }, program.id, false, {
                                        fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                                        lineNumber: 230,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 218,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm text-gray-600 dark:text-gray-300",
                            children: "Parent Part:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 237,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            className: inputStyles,
                            value: parentId,
                            onChange: (e)=>{
                                setParentId(e.target.value);
                                const selected = parentParts.find((p)=>p.id === Number(e.target.value));
                                setParentPartName((selected === null || selected === void 0 ? void 0 : selected.partName) || "");
                            },
                            disabled: partsLoading,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Select Parent Part"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                                    lineNumber: 250,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                parentParts.map((parentPart)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: parentPart.id,
                                        children: [
                                            parentPart.code,
                                            " - ",
                                            parentPart.partName
                                        ]
                                    }, parentPart.id, true, {
                                        fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                                        lineNumber: 252,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                            lineNumber: 240,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                    lineNumber: 236,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "submit",
                    className: "focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ".concat(!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""),
                    disabled: !isFormValid() || isLoading,
                    children: isLoading ? "Updating..." : "Update Part"
                }, void 0, false, {
                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                    lineNumber: 259,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: handleDelete,
                    className: "focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 ".concat(isDeleting ? "cursor-not-allowed opacity-50" : ""),
                    disabled: isDeleting,
                    children: isDeleting ? "Deleting Part" : "Delete Part"
                }, void 0, false, {
                    fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
                    lineNumber: 268,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
            lineNumber: 120,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/parts/ModalEditPart/index.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ModalEditPart, "jasCoMrdRRnsWs1BHCAdOABLJvM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEditPartMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeletePartMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetUsersQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPartsQuery"]
    ];
});
_c = ModalEditPart;
const __TURBOPACK__default__export__ = ModalEditPart;
var _c;
__turbopack_context__.k.register(_c, "ModalEditPart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/parts/ModalNewPart/index.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Modal/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const ModalNewPart = (param)=>{
    let { isOpen, onClose } = param;
    _s();
    const { data: users = [], isLoading: usersLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetUsersQuery"])();
    const { data: programs = [], isLoading: programsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"])();
    const { data: parts = [], isLoading: partsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPartsQuery"])();
    const [createPart, { isLoading }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreatePartMutation"])();
    const [partCode, setPartCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [partName, setPartName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [level, setLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [revisionLevel, setRevisionLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [assignedUserId, setAssignedUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [programId, setProgramId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [parentId, setParentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    //const [startDate, setStartDate] = useState("");
    //const [endDate, setEndDate] = useState("");
    const handleSubmit = async ()=>{
        if (!partCode || !partName || !level || !state || !revisionLevel || !assignedUserId || !programId) return;
        //const formattedStartDate = formatISO(new Date(startDate), { representation: 'complete'});
        //const formattedEndDate = formatISO(new Date(endDate), { representation: 'complete'});
        await createPart({
            code: partCode,
            partName,
            level: Number(level),
            state,
            revisionLevel,
            assignedUserId: assignedUserId,
            programId: Number(programId),
            parentId: parentId ? Number(parentId) : undefined
        });
    };
    const isFormValid = ()=>{
        return partCode && partName && level && state && revisionLevel && assignedUserId && programId;
    };
    const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modal$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        isOpen: isOpen,
        onClose: onClose,
        name: "Create New Part",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            className: "mt-4 space-y-6",
            onSubmit: (e)=>{
                e.preventDefault();
                handleSubmit();
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    className: inputStyles,
                    placeholder: "Part Code",
                    value: partCode,
                    onChange: (e)=>setPartCode(e.target.value)
                }, void 0, false, {
                    fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                    lineNumber: 62,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    className: inputStyles,
                    placeholder: "Part Name",
                    value: partName,
                    onChange: (e)=>setPartName(e.target.value)
                }, void 0, false, {
                    fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                    lineNumber: 69,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "number",
                    className: inputStyles,
                    placeholder: "Level",
                    value: level,
                    onChange: (e)=>setLevel(e.target.value)
                }, void 0, false, {
                    fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                    lineNumber: 76,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: inputStyles,
                    value: state,
                    onChange: (e)=>setState(e.target.value),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select State"
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                            lineNumber: 88,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PartState"]).map((stateValue)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: stateValue,
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PartStateLabels"][stateValue]
                            }, stateValue, false, {
                                fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                                lineNumber: 90,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                    lineNumber: 83,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    className: inputStyles,
                    placeholder: "Revision Level",
                    value: revisionLevel,
                    onChange: (e)=>setRevisionLevel(e.target.value)
                }, void 0, false, {
                    fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                    lineNumber: 95,
                    columnNumber: 17
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
                            fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                            lineNumber: 108,
                            columnNumber: 21
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
                                fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                                lineNumber: 110,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                    lineNumber: 102,
                    columnNumber: 17
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
                            fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                            lineNumber: 121,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        programs.map((program)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: program.id,
                                children: program.name
                            }, program.id, false, {
                                fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                                lineNumber: 123,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                    lineNumber: 115,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: inputStyles,
                    value: parentId,
                    onChange: (e)=>setParentId(e.target.value),
                    disabled: partsLoading,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select Parent Part"
                        }, void 0, false, {
                            fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                            lineNumber: 134,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        parts.map((part)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: part.id,
                                children: [
                                    part.code,
                                    " - ",
                                    part.partName
                                ]
                            }, part.id, true, {
                                fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                                lineNumber: 136,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                    lineNumber: 128,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "submit",
                    className: "focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ".concat(!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""),
                    disabled: !isFormValid() || isLoading,
                    children: isLoading ? "Creating..." : "Create Part"
                }, void 0, false, {
                    fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
                    lineNumber: 161,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
            lineNumber: 55,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/parts/ModalNewPart/index.tsx",
        lineNumber: 54,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ModalNewPart, "PGhD9BhEq7ZSpubbZjDlF26mvvg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetUsersQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPartsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreatePartMutation"]
    ];
});
_c = ModalNewPart;
const __TURBOPACK__default__export__ = ModalNewPart;
var _c;
__turbopack_context__.k.register(_c, "ModalNewPart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/part-hierarchy/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bolt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bolt$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bolt.js [app-client] (ecmascript) <export default as Bolt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.js [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-plus.js [app-client] (ecmascript) <export default as PlusSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$parts$2f$ModalEditPart$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/parts/ModalEditPart/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$parts$2f$ModalNewPart$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/parts/ModalNewPart/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header/index.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
// Custom hook to manage work item data for all parts
const useWorkItemData = (partsOrTree, programId)=>{
    _s();
    const [workItemData, setWorkItemData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Map());
    const [loadingParts, setLoadingParts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const fetchedPartsRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(new Set());
    const allWorkItemsRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef([]);
    // Fetch all work items for the program once (more efficient than per-part requests)
    const fetchAllWorkItemsForProgram = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWorkItemData.useCallback[fetchAllWorkItemsForProgram]": async (programId)=>{
            try {
                const headers = {};
                if ("TURBOPACK compile-time truthy", 1) {
                    const storedUser = window.localStorage.getItem('authUser');
                    if (storedUser) {
                        try {
                            const parsedUser = JSON.parse(storedUser);
                            if (parsedUser === null || parsedUser === void 0 ? void 0 : parsedUser.id) {
                                headers['x-user-id'] = String(parsedUser.id);
                            }
                        } catch (error) {
                            console.warn('Failed to parse authUser from localStorage', error);
                        }
                    }
                }
                const response = await fetch("".concat(("TURBOPACK compile-time value", "http://localhost:8000"), "/workItems?programId=").concat(programId), {
                    headers,
                    credentials: 'include'
                });
                if (response.status === 429) {
                    // Rate limited - wait and retry
                    const retryAfter = response.headers.get('Retry-After') || '30';
                    const waitTime = parseInt(retryAfter, 10) * 1000;
                    console.warn("Rate limited. Retrying after ".concat(waitTime, "ms..."));
                    await new Promise({
                        "useWorkItemData.useCallback[fetchAllWorkItemsForProgram]": (resolve)=>setTimeout(resolve, waitTime)
                    }["useWorkItemData.useCallback[fetchAllWorkItemsForProgram]"]);
                    return fetchAllWorkItemsForProgram(programId);
                }
                if (!response.ok) {
                    throw new Error("HTTP error! status: ".concat(response.status));
                }
                const workItems = await response.json();
                const workItemsArray = Array.isArray(workItems) ? workItems : [];
                allWorkItemsRef.current = workItemsArray;
                console.log("Fetched ".concat(workItemsArray.length, " work items for program ").concat(programId));
                // Group work items by partId
                const workItemsByPart = new Map();
                workItemsArray.forEach({
                    "useWorkItemData.useCallback[fetchAllWorkItemsForProgram]": (workItem)=>{
                        if (workItem.partNumbers && Array.isArray(workItem.partNumbers)) {
                            workItem.partNumbers.forEach({
                                "useWorkItemData.useCallback[fetchAllWorkItemsForProgram]": (partLink)=>{
                                    var _partLink_part;
                                    const partId = ((_partLink_part = partLink.part) === null || _partLink_part === void 0 ? void 0 : _partLink_part.id) || partLink.partId;
                                    if (partId) {
                                        if (!workItemsByPart.has(partId)) {
                                            workItemsByPart.set(partId, []);
                                        }
                                        workItemsByPart.get(partId).push(workItem);
                                    }
                                }
                            }["useWorkItemData.useCallback[fetchAllWorkItemsForProgram]"]);
                        }
                    }
                }["useWorkItemData.useCallback[fetchAllWorkItemsForProgram]"]);
                setWorkItemData(workItemsByPart);
            } catch (error) {
                console.error("Failed to fetch work items for program ".concat(programId, ":"), error);
                setWorkItemData(new Map());
            }
        }
    }["useWorkItemData.useCallback[fetchAllWorkItemsForProgram]"], []);
    // Fetch work items for a specific part (fallback if program fetch fails)
    const fetchWorkItemsForPart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWorkItemData.useCallback[fetchWorkItemsForPart]": async function(partId) {
            let retryCount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            const maxRetries = 3;
            setLoadingParts({
                "useWorkItemData.useCallback[fetchWorkItemsForPart]": (prev)=>{
                    if (prev.has(partId)) return prev;
                    return new Set(prev).add(partId);
                }
            }["useWorkItemData.useCallback[fetchWorkItemsForPart]"]);
            try {
                const headers = {};
                if ("TURBOPACK compile-time truthy", 1) {
                    const storedUser = window.localStorage.getItem('authUser');
                    if (storedUser) {
                        try {
                            const parsedUser = JSON.parse(storedUser);
                            if (parsedUser === null || parsedUser === void 0 ? void 0 : parsedUser.id) {
                                headers['x-user-id'] = String(parsedUser.id);
                            }
                        } catch (error) {
                            console.warn('Failed to parse authUser from localStorage', error);
                        }
                    }
                }
                const response = await fetch("".concat(("TURBOPACK compile-time value", "http://localhost:8000"), "/workItems?partId=").concat(partId), {
                    headers,
                    credentials: 'include'
                });
                if (response.status === 429) {
                    if (retryCount < maxRetries) {
                        const retryAfter = response.headers.get('Retry-After') || '30';
                        const waitTime = parseInt(retryAfter, 10) * 1000;
                        console.warn("Rate limited for part ".concat(partId, ". Retrying after ").concat(waitTime, "ms... (attempt ").concat(retryCount + 1, "/").concat(maxRetries, ")"));
                        await new Promise({
                            "useWorkItemData.useCallback[fetchWorkItemsForPart]": (resolve)=>setTimeout(resolve, waitTime)
                        }["useWorkItemData.useCallback[fetchWorkItemsForPart]"]);
                        return fetchWorkItemsForPart(partId, retryCount + 1);
                    } else {
                        throw new Error("Rate limited after ".concat(maxRetries, " retries"));
                    }
                }
                if (!response.ok) {
                    throw new Error("HTTP error! status: ".concat(response.status));
                }
                const workItems = await response.json();
                const workItemsArray = Array.isArray(workItems) ? workItems : [];
                console.log("Fetched ".concat(workItemsArray.length, " work items for part ").concat(partId, ":"), workItemsArray);
                setWorkItemData({
                    "useWorkItemData.useCallback[fetchWorkItemsForPart]": (prev)=>{
                        const newMap = new Map(prev);
                        newMap.set(partId, workItemsArray);
                        return newMap;
                    }
                }["useWorkItemData.useCallback[fetchWorkItemsForPart]"]);
            } catch (error) {
                console.error("Failed to fetch work items for part ".concat(partId, ":"), error);
                setWorkItemData({
                    "useWorkItemData.useCallback[fetchWorkItemsForPart]": (prev)=>{
                        const newMap = new Map(prev);
                        newMap.set(partId, []);
                        return newMap;
                    }
                }["useWorkItemData.useCallback[fetchWorkItemsForPart]"]);
            } finally{
                setLoadingParts({
                    "useWorkItemData.useCallback[fetchWorkItemsForPart]": (prev)=>{
                        const newSet = new Set(prev);
                        newSet.delete(partId);
                        return newSet;
                    }
                }["useWorkItemData.useCallback[fetchWorkItemsForPart]"]);
            }
        }
    }["useWorkItemData.useCallback[fetchWorkItemsForPart]"], []);
    // Collect all part IDs from the hierarchy
    const allPartIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useWorkItemData.useMemo[allPartIds]": ()=>{
            const ids = new Set();
            const collectPartIds = {
                "useWorkItemData.useMemo[allPartIds].collectPartIds": (partList)=>{
                    partList.forEach({
                        "useWorkItemData.useMemo[allPartIds].collectPartIds": (part)=>{
                            ids.add(part.id);
                            if ('children' in part && part.children) {
                                collectPartIds(part.children);
                            }
                        }
                    }["useWorkItemData.useMemo[allPartIds].collectPartIds"]);
                }
            }["useWorkItemData.useMemo[allPartIds].collectPartIds"];
            collectPartIds(partsOrTree);
            return Array.from(ids).sort().join(',');
        }
    }["useWorkItemData.useMemo[allPartIds]"], [
        partsOrTree
    ]);
    // Fetch all work items for the program when programId changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWorkItemData.useEffect": ()=>{
            if (programId) {
                fetchAllWorkItemsForProgram(programId);
            } else {
                setWorkItemData(new Map());
                allWorkItemsRef.current = [];
            }
        }
    }["useWorkItemData.useEffect"], [
        programId,
        fetchAllWorkItemsForProgram
    ]);
    return {
        workItemData,
        loadingParts
    };
};
_s(useWorkItemData, "RQF/c+gbeT5rBOlme66sDxaHtRw=");
// Component to display work item counts for a part
const PartWorkItemCounts = (param)=>{
    let { partId, children, isExpanded, workItemData } = param;
    _s1();
    const workItems = workItemData.get(partId);
    // Ensure workItems is always an array
    const workItemsArray = Array.isArray(workItems) ? workItems : [];
    // Get direct work item counts for this part
    const directCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PartWorkItemCounts.useMemo[directCounts]": ()=>{
            const deliverables = workItemsArray.filter({
                "PartWorkItemCounts.useMemo[directCounts]": (item)=>item.workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Deliverable
            }["PartWorkItemCounts.useMemo[directCounts]"]).length;
            const issues = workItemsArray.filter({
                "PartWorkItemCounts.useMemo[directCounts]": (item)=>item.workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Issue
            }["PartWorkItemCounts.useMemo[directCounts]"]).length;
            const tasks = workItemsArray.filter({
                "PartWorkItemCounts.useMemo[directCounts]": (item)=>item.workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Task
            }["PartWorkItemCounts.useMemo[directCounts]"]).length;
            const total = workItemsArray.length;
            return {
                deliverables,
                issues,
                tasks,
                total
            };
        }
    }["PartWorkItemCounts.useMemo[directCounts]"], [
        workItemsArray
    ]);
    // Recursively calculate children's work item counts
    const calculateChildrenCounts = (childNodes)=>{
        return childNodes.reduce((acc, child)=>{
            const childWorkItems = workItemData.get(child.id);
            // Ensure childWorkItems is always an array
            const childWorkItemsArray = Array.isArray(childWorkItems) ? childWorkItems : [];
            const childDirectCounts = {
                deliverables: childWorkItemsArray.filter((item)=>item.workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Deliverable).length,
                issues: childWorkItemsArray.filter((item)=>item.workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Issue).length,
                tasks: childWorkItemsArray.filter((item)=>item.workItemType === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"].Task).length,
                total: childWorkItemsArray.length
            };
            // Recursively get children's children counts
            const grandChildrenCounts = child.children ? calculateChildrenCounts(child.children) : {
                deliverables: 0,
                issues: 0,
                tasks: 0,
                total: 0
            };
            return {
                deliverables: acc.deliverables + childDirectCounts.deliverables + grandChildrenCounts.deliverables,
                issues: acc.issues + childDirectCounts.issues + grandChildrenCounts.issues,
                tasks: acc.tasks + childDirectCounts.tasks + grandChildrenCounts.tasks,
                total: acc.total + childDirectCounts.total + grandChildrenCounts.total
            };
        }, {
            deliverables: 0,
            issues: 0,
            tasks: 0,
            total: 0
        });
    };
    const childrenCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PartWorkItemCounts.useMemo[childrenCounts]": ()=>{
            if (!children || children.length === 0) {
                return {
                    deliverables: 0,
                    issues: 0,
                    tasks: 0,
                    total: 0
                };
            }
            return calculateChildrenCounts(children);
        }
    }["PartWorkItemCounts.useMemo[childrenCounts]"], [
        children,
        workItemData
    ]);
    // Determine which counts to display based on expansion state
    const displayCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PartWorkItemCounts.useMemo[displayCounts]": ()=>{
            const hasChildren = children && children.length > 0;
            if (isExpanded || !hasChildren) {
                // When expanded OR when it's a leaf node (no children), show only direct work items
                return directCounts;
            } else {
                // When collapsed AND has children, show total including children
                return {
                    deliverables: directCounts.deliverables + childrenCounts.deliverables,
                    issues: directCounts.issues + childrenCounts.issues,
                    tasks: directCounts.tasks + childrenCounts.tasks,
                    total: directCounts.total + childrenCounts.total
                };
            }
        }
    }["PartWorkItemCounts.useMemo[displayCounts]"], [
        isExpanded,
        directCounts,
        childrenCounts,
        children
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap items-center gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                        className: "h-3 w-3"
                    }, void 0, false, {
                        fileName: "[project]/src/app/part-hierarchy/page.tsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Deliverables: ",
                    displayCounts.deliverables
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-1 text-sm font-medium text-orange-600 dark:text-orange-400",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        className: "h-3 w-3"
                    }, void 0, false, {
                        fileName: "[project]/src/app/part-hierarchy/page.tsx",
                        lineNumber: 276,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Issues: ",
                    displayCounts.issues
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"], {
                        className: "h-3 w-3"
                    }, void 0, false, {
                        fileName: "[project]/src/app/part-hierarchy/page.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Tasks: ",
                    displayCounts.tasks
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                lineNumber: 279,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400",
                children: [
                    "Total: ",
                    displayCounts.total,
                    isExpanded || !children || children.length === 0 ? " (direct)" : " (including children)"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                lineNumber: 283,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/part-hierarchy/page.tsx",
        lineNumber: 270,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(PartWorkItemCounts, "PDa8tpIMT8MT9ueRYCoguPwfxBw=");
_c = PartWorkItemCounts;
const PartHierarchyPage = ()=>{
    var _this = ("TURBOPACK compile-time value", void 0);
    var _programs_find;
    _s2();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { data: allParts = [], isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPartsQuery"])();
    const { data: programs = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"])();
    const [expandedNodes, setExpandedNodes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [selectedProgramId, setSelectedProgramId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isEditModalOpen, setIsEditModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedPartForEdit, setSelectedPartForEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isNewPartModalOpen, setIsNewPartModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Auto-select the first program when programs are loaded
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PartHierarchyPage.useEffect": ()=>{
            if (programs.length > 0 && selectedProgramId === null) {
                setSelectedProgramId(programs[0].id);
            }
        }
    }["PartHierarchyPage.useEffect"], [
        programs,
        selectedProgramId
    ]);
    // Filter parts by selected program
    const filteredParts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PartHierarchyPage.useMemo[filteredParts]": ()=>{
            if (!selectedProgramId) return [];
            return allParts.filter({
                "PartHierarchyPage.useMemo[filteredParts]": (part)=>part.programId === selectedProgramId
            }["PartHierarchyPage.useMemo[filteredParts]"]);
        }
    }["PartHierarchyPage.useMemo[filteredParts]"], [
        allParts,
        selectedProgramId
    ]);
    // Build hierarchical tree structure
    const hierarchyTree = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PartHierarchyPage.useMemo[hierarchyTree]": ()=>{
            if (!filteredParts.length) return [];
            // Create a map for quick lookup
            const partMap = new Map();
            filteredParts.forEach({
                "PartHierarchyPage.useMemo[hierarchyTree]": (part)=>{
                    partMap.set(part.id, {
                        ...part,
                        children: []
                    });
                }
            }["PartHierarchyPage.useMemo[hierarchyTree]"]);
            // Build the tree
            const rootNodes = [];
            filteredParts.forEach({
                "PartHierarchyPage.useMemo[hierarchyTree]": (part)=>{
                    const node = partMap.get(part.id);
                    if (part.parentId && partMap.has(part.parentId)) {
                        const parent = partMap.get(part.parentId);
                        parent.children.push(node);
                    } else {
                        rootNodes.push(node);
                    }
                }
            }["PartHierarchyPage.useMemo[hierarchyTree]"]);
            // Sort children by part code
            const sortChildren = {
                "PartHierarchyPage.useMemo[hierarchyTree].sortChildren": (nodes)=>{
                    nodes.sort({
                        "PartHierarchyPage.useMemo[hierarchyTree].sortChildren": (a, b)=>a.code.localeCompare(b.code, undefined, {
                                numeric: true,
                                sensitivity: "base"
                            })
                    }["PartHierarchyPage.useMemo[hierarchyTree].sortChildren"]);
                    nodes.forEach({
                        "PartHierarchyPage.useMemo[hierarchyTree].sortChildren": (node)=>{
                            if (node.children && node.children.length > 0) {
                                sortChildren(node.children);
                            }
                        }
                    }["PartHierarchyPage.useMemo[hierarchyTree].sortChildren"]);
                }
            }["PartHierarchyPage.useMemo[hierarchyTree].sortChildren"];
            sortChildren(rootNodes);
            return rootNodes;
        }
    }["PartHierarchyPage.useMemo[hierarchyTree]"], [
        filteredParts
    ]);
    // Use the work item data hook with the hierarchy tree and programId
    const { workItemData } = useWorkItemData(hierarchyTree, selectedProgramId);
    const toggleNode = (nodeId)=>{
        setExpandedNodes((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };
    const handleEditPart = (part, e)=>{
        e.stopPropagation(); // Prevent triggering the row click
        setSelectedPartForEdit(part);
        setIsEditModalOpen(true);
    };
    const renderNode = function(node) {
        let depth = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        var _node_assignedUser;
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);
        const indentClass = "ml-".concat(depth * 4);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "select-none",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap items-center gap-x-4 gap-y-2 py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-l-2 border-transparent hover:border-blue-200 transition-colors ".concat(indentClass),
                    style: {
                        marginLeft: "".concat(depth * 20, "px")
                    },
                    onClick: ()=>router.push("/parts/".concat(node.id)),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-6 flex justify-center",
                            children: hasChildren ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    toggleNode(node.id);
                                },
                                className: "p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors",
                                children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: "h-4 w-4 text-gray-600 dark:text-gray-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                    lineNumber: 394,
                                    columnNumber: 19
                                }, _this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "h-4 w-4 text-gray-600 dark:text-gray-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                    lineNumber: 396,
                                    columnNumber: 19
                                }, _this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                lineNumber: 386,
                                columnNumber: 15
                            }, _this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                lineNumber: 400,
                                columnNumber: 15
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                            lineNumber: 384,
                            columnNumber: 11
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bolt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bolt$3e$__["Bolt"], {
                            className: "h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                            lineNumber: 405,
                            columnNumber: 11
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-w-0 flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-3 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-gray-900 dark:text-white",
                                            children: node.partName
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                            lineNumber: 410,
                                            columnNumber: 15
                                        }, _this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 dark:text-gray-300 truncate",
                                            children: [
                                                "(",
                                                node.code,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                            lineNumber: 413,
                                            columnNumber: 15
                                        }, _this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                    lineNumber: 409,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                                    lineNumber: 421,
                                                    columnNumber: 17
                                                }, _this),
                                                ((_node_assignedUser = node.assignedUser) === null || _node_assignedUser === void 0 ? void 0 : _node_assignedUser.name) || 'Unassigned'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                            lineNumber: 420,
                                            columnNumber: 15
                                        }, _this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                                    className: "h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 17
                                                }, _this),
                                                "Level ",
                                                node.level
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                            lineNumber: 424,
                                            columnNumber: 15
                                        }, _this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "px-2 py-1 rounded-full text-xs font-medium ".concat(node.state === 'Released' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : node.state === 'UnderReview' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : node.state === 'InWork' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'),
                                            children: node.state
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                            lineNumber: 428,
                                            columnNumber: 15
                                        }, _this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                    lineNumber: 419,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PartWorkItemCounts, {
                                    partId: node.id,
                                    children: node.children,
                                    isExpanded: isExpanded,
                                    workItemData: workItemData
                                }, void 0, false, {
                                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                    lineNumber: 444,
                                    columnNumber: 13
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                            lineNumber: 408,
                            columnNumber: 11
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>handleEditPart(node, e),
                                className: "p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors",
                                title: "Edit Part",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                    className: "h-4 w-4 text-gray-600 dark:text-gray-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                    lineNumber: 459,
                                    columnNumber: 15
                                }, _this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                lineNumber: 454,
                                columnNumber: 13
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                            lineNumber: 453,
                            columnNumber: 11
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                    lineNumber: 378,
                    columnNumber: 9
                }, _this),
                hasChildren && isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: node.children.map((child)=>renderNode(child, depth + 1))
                }, void 0, false, {
                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                    lineNumber: 466,
                    columnNumber: 11
                }, _this)
            ]
        }, node.id, true, {
            fileName: "[project]/src/app/part-hierarchy/page.tsx",
            lineNumber: 377,
            columnNumber: 7
        }, _this);
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-64",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-gray-500 dark:text-gray-400",
                    children: "Loading part hierarchy..."
                }, void 0, false, {
                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                    lineNumber: 478,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                lineNumber: 477,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/part-hierarchy/page.tsx",
            lineNumber: 476,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-64",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-500",
                    children: "Error loading part hierarchy. Please try again."
                }, void 0, false, {
                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                    lineNumber: 488,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                lineNumber: 487,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/part-hierarchy/page.tsx",
            lineNumber: 486,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        name: "Part Hierarchy",
                        buttonComponent: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600 transition-colors",
                            onClick: ()=>setIsNewPartModalOpen(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusSquare$3e$__["PlusSquare"], {
                                    className: "mr-2 h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                    lineNumber: 505,
                                    columnNumber: 17
                                }, void 0),
                                "New Part"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                            lineNumber: 501,
                            columnNumber: 15
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/app/part-hierarchy/page.tsx",
                        lineNumber: 498,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 dark:text-gray-400 mt-2",
                        children: "View and navigate the hierarchical structure of all parts in the system"
                    }, void 0, false, {
                        fileName: "[project]/src/app/part-hierarchy/page.tsx",
                        lineNumber: 510,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                lineNumber: 497,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "program-select",
                                className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                children: "Select a Program:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                lineNumber: 519,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                id: "program-select",
                                value: selectedProgramId || '',
                                onChange: (e)=>{
                                    const programId = Number(e.target.value);
                                    setSelectedProgramId(programId);
                                    // Clear expanded nodes when changing program filter
                                    setExpandedNodes(new Set());
                                },
                                className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]",
                                children: programs.map((program)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: program.id,
                                        children: program.name
                                    }, program.id, false, {
                                        fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                        lineNumber: 534,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                lineNumber: 522,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/part-hierarchy/page.tsx",
                        lineNumber: 518,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            // Expand all nodes
                                            const allNodeIds = new Set();
                                            const collectIds = (nodes)=>{
                                                nodes.forEach((node)=>{
                                                    if (node.children && node.children.length > 0) {
                                                        allNodeIds.add(node.id);
                                                        collectIds(node.children);
                                                    }
                                                });
                                            };
                                            collectIds(hierarchyTree);
                                            setExpandedNodes(allNodeIds);
                                        },
                                        className: "px-4 py-2 bg-blue-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium",
                                        children: "Expand All"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                        lineNumber: 544,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setExpandedNodes(new Set()),
                                        className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium",
                                        children: "Collapse All"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                        lineNumber: 563,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                lineNumber: 543,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-500 dark:text-gray-400",
                                children: selectedProgramId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        filteredParts.length,
                                        " parts in ",
                                        (_programs_find = programs.find((p)=>p.id === selectedProgramId)) === null || _programs_find === void 0 ? void 0 : _programs_find.name
                                    ]
                                }, void 0, true) : 'Select a program to view parts'
                            }, void 0, false, {
                                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                                lineNumber: 571,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/part-hierarchy/page.tsx",
                        lineNumber: 542,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                lineNumber: 516,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm",
                children: hierarchyTree.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-8 text-center text-gray-500 dark:text-gray-400",
                    children: [
                        "No parts found for the selected program.",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                            lineNumber: 588,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm",
                            children: "Try selecting a different program from the dropdown above."
                        }, void 0, false, {
                            fileName: "[project]/src/app/part-hierarchy/page.tsx",
                            lineNumber: 589,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                    lineNumber: 586,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "divide-y divide-gray-100 dark:divide-gray-800",
                    children: hierarchyTree.map((node)=>renderNode(node))
                }, void 0, false, {
                    fileName: "[project]/src/app/part-hierarchy/page.tsx",
                    lineNumber: 592,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                lineNumber: 584,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$parts$2f$ModalEditPart$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isEditModalOpen,
                onClose: ()=>{
                    setIsEditModalOpen(false);
                    setSelectedPartForEdit(null);
                },
                part: selectedPartForEdit
            }, void 0, false, {
                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                lineNumber: 599,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$parts$2f$ModalNewPart$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isNewPartModalOpen,
                onClose: ()=>setIsNewPartModalOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/app/part-hierarchy/page.tsx",
                lineNumber: 609,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/part-hierarchy/page.tsx",
        lineNumber: 495,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s2(PartHierarchyPage, "li6sGeHfoL1hcDCmgEsPTQxetfs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetPartsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"],
        useWorkItemData
    ];
});
_c1 = PartHierarchyPage;
const __TURBOPACK__default__export__ = PartHierarchyPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "PartWorkItemCounts");
__turbopack_context__.k.register(_c1, "PartHierarchyPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_6fd4fd7b._.js.map