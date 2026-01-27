(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/src/app/home/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/redux.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$x$2d$data$2d$grid$2f$esm$2f$DataGrid$2f$DataGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/x-data-grid/esm/DataGrid/DataGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BurndownChart$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BurndownChart/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Legend.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/Pie.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/PieChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
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
const workItemColumns = [
    {
        field: "workItemType",
        headerName: "Type",
        width: 120,
        renderCell: (params)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800",
                children: params.value
            }, void 0, false, {
                fileName: "[project]/src/app/home/page.tsx",
                lineNumber: 46,
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
                fileName: "[project]/src/app/home/page.tsx",
                lineNumber: 62,
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
                fileName: "[project]/src/app/home/page.tsx",
                lineNumber: 72,
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
                fileName: "[project]/src/app/home/page.tsx",
                lineNumber: 88,
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
                fileName: "[project]/src/app/home/page.tsx",
                lineNumber: 105,
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
                fileName: "[project]/src/app/home/page.tsx",
                lineNumber: 116,
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
const COLORS = [
    "#6FA8DC",
    "#66CDAA",
    "#FF9500",
    "#FF8042",
    "#A28FD0",
    "#FF6384",
    "#36A2EB"
];
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
const HomePage = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isAuthenticated, isLoading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [selectedProgramId, setSelectedProgramId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [chartMode, setChartMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("type");
    // Call hooks unconditionally (React rules of hooks)
    const { data: programs, isLoading: isProgramsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"])(undefined, {
        skip: !isAuthenticated
    });
    const { data: teams, isLoading: isTeamsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetTeamsQuery"])(undefined, {
        skip: !isAuthenticated
    });
    const [selectedWorkItemType, setSelectedWorkItemType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [selectedPriority, setSelectedPriority] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [workItemFilter, setWorkItemFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [showPastMilestones, setShowPastMilestones] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const barChartContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [barChartHeight, setBarChartHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(400);
    const pieChartContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pieChartHeight, setPieChartHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(400);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            setShowPastMilestones(false);
        }
    }["HomePage.useEffect"], [
        selectedProgramId
    ]);
    // Measure bar chart container height to fill available space
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            const updateBarChartHeight = {
                "HomePage.useEffect.updateBarChartHeight": ()=>{
                    if (barChartContainerRef.current) {
                        // Get the full container height and subtract header (h3 + mb-4) and padding (p-4 = 16px top + 16px bottom)
                        const containerHeight = barChartContainerRef.current.clientHeight;
                        const headerHeight = 28 + 16; // h3 text-lg (~28px) + mb-4 (16px margin)
                        const padding = 32; // p-4 = 16px top + 16px bottom
                        const chartHeight = containerHeight - headerHeight - padding;
                        setBarChartHeight(Math.max(chartHeight, 300)); // Minimum 300px
                    }
                }
            }["HomePage.useEffect.updateBarChartHeight"];
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(updateBarChartHeight);
            window.addEventListener('resize', updateBarChartHeight);
            return ({
                "HomePage.useEffect": ()=>window.removeEventListener('resize', updateBarChartHeight)
            })["HomePage.useEffect"];
        }
    }["HomePage.useEffect"], []); // Only recalculate on mount and window resize
    // Measure pie chart container height to fill available space
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            const updatePieChartHeight = {
                "HomePage.useEffect.updatePieChartHeight": ()=>{
                    if (pieChartContainerRef.current) {
                        // Get the full container height and subtract header (h3 + mb-4) and padding (p-4 = 16px top + 16px bottom)
                        const containerHeight = pieChartContainerRef.current.clientHeight;
                        const headerHeight = 28 + 16; // h3 text-lg (~28px) + mb-4 (16px margin)
                        const padding = 32; // p-4 = 16px top + 16px bottom
                        const chartHeight = containerHeight - headerHeight - padding;
                        setPieChartHeight(Math.max(chartHeight, 300)); // Minimum 300px
                    }
                }
            }["HomePage.useEffect.updatePieChartHeight"];
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(updatePieChartHeight);
            window.addEventListener('resize', updatePieChartHeight);
            return ({
                "HomePage.useEffect": ()=>window.removeEventListener('resize', updatePieChartHeight)
            })["HomePage.useEffect"];
        }
    }["HomePage.useEffect"], []); // Only recalculate on mount and window resize
    // Redirect to onboarding if not authenticated
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            if (!authLoading && !isAuthenticated) {
                router.push("/onboarding");
            }
        }
    }["HomePage.useEffect"], [
        isAuthenticated,
        authLoading,
        router
    ]);
    // Call all hooks unconditionally to follow rules of hooks
    const { data: allWorkItems, isLoading: isAllWorkItemsLoading, isError: allWorkItemsError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWorkItemsQuery"])(undefined, {
        skip: !isAuthenticated
    });
    const { data: programWorkItems, isLoading: isProgramWorkItemsLoading, isError: programWorkItemsError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWorkItemsByProgramQuery"])({
        programId: selectedProgramId === "all" ? 0 : selectedProgramId
    }, {
        skip: selectedProgramId === "all" || !isAuthenticated
    });
    const { data: allMilestones, isLoading: isAllMilestonesLoading, isError: allMilestonesError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetMilestonesQuery"])(undefined, {
        skip: !isAuthenticated
    });
    const { data: programMilestones, isLoading: isProgramMilestonesLoading, isError: programMilestonesError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetMilestonesByProgramQuery"])({
        programId: selectedProgramId === "all" ? 0 : selectedProgramId
    }, {
        skip: selectedProgramId === "all" || !isAuthenticated
    });
    // Conditionally use the appropriate data based on selectedProgramId
    const workItems = selectedProgramId === "all" ? allWorkItems : programWorkItems;
    const isWorkItemsLoading = selectedProgramId === "all" ? isAllWorkItemsLoading : isProgramWorkItemsLoading;
    const workItemsError = selectedProgramId === "all" ? allWorkItemsError : programWorkItemsError;
    const milestones = selectedProgramId === "all" ? allMilestones : programMilestones;
    const milestonesLoading = selectedProgramId === "all" ? isAllMilestonesLoading : isProgramMilestonesLoading;
    const milestonesError = selectedProgramId === "all" ? allMilestonesError : programMilestonesError;
    const displayedMilestones = selectedProgramId === "all" ? milestones : milestones === null || milestones === void 0 ? void 0 : milestones.filter((m)=>m.programId === selectedProgramId);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const sortedMilestones = [
        ...displayedMilestones !== null && displayedMilestones !== void 0 ? displayedMilestones : []
    ].sort((a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
    const upcomingMilestones = sortedMilestones.filter((milestone)=>{
        if (!milestone.date) return true;
        const milestoneDate = new Date(milestone.date);
        return milestoneDate >= startOfToday;
    });
    const pastMilestones = sortedMilestones.filter((milestone)=>milestone.date && new Date(milestone.date) < startOfToday).sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
    const isDarkMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "HomePage.useAppSelector[isDarkMode]": (state)=>state.global.isDarkMode
    }["HomePage.useAppSelector[isDarkMode]"]);
    // Don't render anything if not authenticated (will redirect)
    if (authLoading || !isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"
            }, void 0, false, {
                fileName: "[project]/src/app/home/page.tsx",
                lineNumber: 317,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/home/page.tsx",
            lineNumber: 316,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (isWorkItemsLoading || isProgramsLoading || isTeamsLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Loading..."
    }, void 0, false, {
        fileName: "[project]/src/app/home/page.tsx",
        lineNumber: 323,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
    if (workItemsError || !workItems || !programs || !teams) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Error fetching data"
    }, void 0, false, {
        fileName: "[project]/src/app/home/page.tsx",
        lineNumber: 325,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
    /* ---------- DATA TRANSFORMS ---------- */ // First, apply the work item filter (all vs open) to all data
    const filteredWorkItems = workItemFilter === "open" ? workItems.filter((item)=>item.status !== "Completed") : workItems;
    // 1️⃣ Work Items by Discipline Team
    const teamCount = filteredWorkItems.reduce((acc, item)=>{
        const team = teams.find((t)=>{
            var _item_assigneeUser;
            return t.id === ((_item_assigneeUser = item.assigneeUser) === null || _item_assigneeUser === void 0 ? void 0 : _item_assigneeUser.disciplineTeamId);
        });
        const teamName = (team === null || team === void 0 ? void 0 : team.name) || "Unassigned";
        acc[teamName] = (acc[teamName] || 0) + 1;
        return acc;
    }, {});
    const teamDistribution = Object.entries(teamCount).map((param)=>{
        let [name, count] = param;
        return {
            name,
            count
        };
    }).sort((a, b)=>b.count - a.count);
    // 2️⃣ Pie chart data: Type vs Priority
    const priorityCount = filteredWorkItems.reduce((acc, item)=>{
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
    }, {});
    const priorityDistribution = Object.entries(priorityCount).map((param)=>{
        let [name, count] = param;
        return {
            name,
            count
        };
    });
    const typeCount = filteredWorkItems.reduce((acc, item)=>{
        acc[item.workItemType] = (acc[item.workItemType] || 0) + 1;
        return acc;
    }, {});
    const typeDistribution = Object.entries(typeCount).map((param)=>{
        let [name, count] = param;
        return {
            name,
            count
        };
    });
    const pieData = chartMode === "type" ? typeDistribution : priorityDistribution;
    // 3️⃣ Priority Work Items for the DataGrid (Urgent is default)
    const filteredWorkItemsByPriority = selectedPriority === "all" ? filteredWorkItems : filteredWorkItems.filter((item)=>item.priority === selectedPriority);
    const displayedWorkItems = [
        ...filteredWorkItemsByPriority
    ].sort((a, b)=>new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((item)=>{
        var _item_assigneeUser;
        return {
            ...item,
            assigneeUserName: ((_item_assigneeUser = item.assigneeUser) === null || _item_assigneeUser === void 0 ? void 0 : _item_assigneeUser.name) || "Unassigned"
        };
    });
    // Work Items filtered by Type (for Burndown Chart - uses all work items, not filtered by status):
    const filteredWorkItemsForChart = selectedWorkItemType === "all" ? workItems : workItems.filter((item)=>item.workItemType === selectedWorkItemType);
    const formattedTeamName = (name)=>name.length > 8 ? name.slice(0, 8) + "…" : name;
    // 📊 Priority counts for datagrid dropdown
    const priorityCounts = filteredWorkItems.reduce((acc, item)=>{
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
    }, {});
    const totalCount = filteredWorkItems.length;
    const chartColors = isDarkMode ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF"
    } : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full w-full bg-gray-100 bg-transparent p-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                name: "Home Dashboard"
            }, void 0, false, {
                fileName: "[project]/src/app/home/page.tsx",
                lineNumber: 408,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
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
                                    fileName: "[project]/src/app/home/page.tsx",
                                    lineNumber: 422,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                programs.map((program)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: program.id,
                                        children: program.name
                                    }, program.id, false, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 424,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/home/page.tsx",
                            lineNumber: 413,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.tsx",
                        lineNumber: 412,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-1 dark:border-gray-600 dark:bg-dark-tertiary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setWorkItemFilter("all"),
                                    className: "rounded-md px-4 py-2 text-sm font-medium transition-colors ".concat(workItemFilter === "all" ? "bg-white text-blue-600 shadow-sm dark:bg-dark-secondary dark:text-blue-400" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"),
                                    children: "All Work Items"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.tsx",
                                    lineNumber: 434,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setWorkItemFilter("open"),
                                    className: "rounded-md px-4 py-2 text-sm font-medium transition-colors ".concat(workItemFilter === "open" ? "bg-white text-blue-600 shadow-sm dark:bg-dark-secondary dark:text-blue-400" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"),
                                    children: "Open Work Items"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.tsx",
                                    lineNumber: 444,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/home/page.tsx",
                            lineNumber: 433,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.tsx",
                        lineNumber: 432,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/home/page.tsx",
                lineNumber: 411,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 gap-4 md:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "col-span-3 md:col-span-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg bg-white p-4 shadow dark:bg-dark-secondary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold dark:text-white",
                                            children: "Work Item Burndown"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.tsx",
                                            lineNumber: 464,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-dark-secondary dark:text-white",
                                            value: selectedWorkItemType,
                                            onChange: (e)=>{
                                                const value = e.target.value;
                                                setSelectedWorkItemType(value);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "all",
                                                    children: "All Types"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/home/page.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkItemType"]).map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: type,
                                                        children: type
                                                    }, type, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 477,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/home/page.tsx",
                                            lineNumber: 467,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/home/page.tsx",
                                    lineNumber: 463,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BurndownChart$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    workItems: filteredWorkItemsForChart,
                                    isDarkMode: isDarkMode
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.tsx",
                                    lineNumber: 483,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/home/page.tsx",
                            lineNumber: 462,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.tsx",
                        lineNumber: 461,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "col-span-3 md:col-span-1 md:row-span-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg bg-white shadow dark:bg-dark-secondary md:max-h-[940px] max-h-[50vh] overflow-y-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sticky top-0 bg-white dark:bg-dark-secondary z-10 p-4 border-b border-gray-200 dark:border-gray-700",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-semibold dark:text-white",
                                                children: "Program Milestones"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.tsx",
                                                lineNumber: 492,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500 dark:text-gray-400",
                                                children: [
                                                    upcomingMilestones.length,
                                                    " upcoming"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.tsx",
                                                lineNumber: 495,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 491,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.tsx",
                                    lineNumber: 490,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 pt-0",
                                    children: milestonesLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center py-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.tsx",
                                                lineNumber: 504,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-2 text-gray-500 dark:text-gray-300",
                                                children: "Loading milestones..."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.tsx",
                                                lineNumber: 505,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 503,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)) : milestonesError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-8",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-red-500 text-sm",
                                            children: "Error loading milestones"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.tsx",
                                            lineNumber: 509,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 508,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)) : sortedMilestones.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            upcomingMilestones.length > 0 ? upcomingMilestones.map((milestone)=>{
                                                var _programs_find;
                                                const milestoneWorkItems = filteredWorkItems === null || filteredWorkItems === void 0 ? void 0 : filteredWorkItems.filter((wi)=>wi.dueByMilestoneId === milestone.id);
                                                const programName = ((_programs_find = programs.find((p)=>p.id === milestone.programId)) === null || _programs_find === void 0 ? void 0 : _programs_find.name) || "—";
                                                const today = new Date();
                                                const milestoneDate = milestone.date ? new Date(milestone.date) : null;
                                                const isPast = milestoneDate ? milestoneDate < today : false;
                                                const daysUntil = milestoneDate ? Math.ceil((milestoneDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
                                                const isWithin30Days = daysUntil !== null ? daysUntil <= 30 && daysUntil >= 0 : false;
                                                const getStatusBadge = ()=>{
                                                    if (isPast) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mr-1 h-2 w-2 rounded-full bg-gray-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.tsx",
                                                                    lineNumber: 537,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                "Completed"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.tsx",
                                                            lineNumber: 536,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0));
                                                    }
                                                    if (isWithin30Days) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mr-1 h-2 w-2 animate-pulse rounded-full bg-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.tsx",
                                                                    lineNumber: 545,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                "Due in ",
                                                                daysUntil,
                                                                " days"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.tsx",
                                                            lineNumber: 544,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0));
                                                    }
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mr-1 h-2 w-2 rounded-full bg-blue-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.tsx",
                                                                lineNumber: 552,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            "Upcoming"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 551,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0));
                                                };
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-lg border px-3 py-2 transition-all duration-200 hover:shadow-md ".concat(isPast ? "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700" : isWithin30Days ? "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700" : "bg-white border-gray-200 dark:bg-dark-tertiary dark:border-gray-700"),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-1 flex items-start justify-between gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "min-w-0 flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "truncate text-sm font-semibold ".concat(isPast ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-white"),
                                                                            children: milestone.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.tsx",
                                                                            lineNumber: 571,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "truncate text-xs ".concat(isPast ? "text-gray-500 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"),
                                                                            children: programName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/home/page.tsx",
                                                                            lineNumber: 580,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.tsx",
                                                                    lineNumber: 570,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                getStatusBadge()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.tsx",
                                                            lineNumber: 569,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between text-xs",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "".concat(isPast ? "text-gray-500 dark:text-gray-500" : "text-gray-600 dark:text-gray-400"),
                                                                    children: milestoneDate ? milestoneDate.toLocaleDateString("en-US", {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                        year: "numeric"
                                                                    }) : "No date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/home/page.tsx",
                                                                    lineNumber: 593,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "rounded-full px-2 py-1 text-xs font-medium ".concat(milestoneWorkItems && milestoneWorkItems.length > 0 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"),
                                                                    children: [
                                                                        (milestoneWorkItems === null || milestoneWorkItems === void 0 ? void 0 : milestoneWorkItems.length) || 0,
                                                                        " work items"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/home/page.tsx",
                                                                    lineNumber: 608,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/home/page.tsx",
                                                            lineNumber: 592,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, milestone.id, true, {
                                                    fileName: "[project]/src/app/home/page.tsx",
                                                    lineNumber: 559,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0));
                                            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-md border border-dashed border-blue-200 bg-blue-50 px-3 py-4 text-center text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200",
                                                children: "No upcoming milestones. Create a new milestone to keep momentum."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.tsx",
                                                lineNumber: 622,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            pastMilestones.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-3 border-t border-gray-200 pt-3 dark:border-gray-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setShowPastMilestones((prev)=>!prev),
                                                        className: "flex w-full items-center justify-between rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Past Milestones (",
                                                                    pastMilestones.length,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/home/page.tsx",
                                                                lineNumber: 634,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            showPastMilestones ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.tsx",
                                                                lineNumber: 636,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/home/page.tsx",
                                                                lineNumber: 638,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 629,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    showPastMilestones && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 space-y-1.5",
                                                        children: pastMilestones.map((milestone)=>{
                                                            var _programs_find;
                                                            const milestoneDate = milestone.date ? new Date(milestone.date) : null;
                                                            const programName = ((_programs_find = programs.find((p)=>p.id === milestone.programId)) === null || _programs_find === void 0 ? void 0 : _programs_find.name) || "—";
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs dark:border-gray-700 dark:bg-dark-tertiary",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "truncate font-medium text-gray-700 dark:text-gray-200",
                                                                                children: milestone.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.tsx",
                                                                                lineNumber: 657,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "truncate text-[11px] text-gray-500 dark:text-gray-400",
                                                                                children: programName
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/home/page.tsx",
                                                                                lineNumber: 660,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/home/page.tsx",
                                                                        lineNumber: 656,
                                                                        columnNumber: 31
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col items-end text-[11px] text-gray-500 dark:text-gray-400",
                                                                        children: milestoneDate ? milestoneDate.toLocaleDateString("en-US", {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                            year: "numeric"
                                                                        }) : "No date"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/home/page.tsx",
                                                                        lineNumber: 664,
                                                                        columnNumber: 31
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, "past-".concat(milestone.id), true, {
                                                                fileName: "[project]/src/app/home/page.tsx",
                                                                lineNumber: 652,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0));
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 643,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.tsx",
                                                lineNumber: 628,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 512,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-8 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-gray-500 dark:text-gray-400",
                                            children: "No milestones found"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.tsx",
                                            lineNumber: 683,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 682,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/home/page.tsx",
                                    lineNumber: 500,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/home/page.tsx",
                            lineNumber: 489,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/home/page.tsx",
                        lineNumber: 488,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "col-span-3 md:col-span-2 grid grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: barChartContainerRef,
                                className: "flex flex-col rounded-lg bg-white p-4 shadow dark:bg-dark-secondary min-h-[400px] h-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "mb-4 text-lg font-semibold dark:text-white",
                                        children: "Work Items by Discipline Team"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 696,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-h-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                            width: "100%",
                                            height: barChartHeight,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                                                data: teamDistribution,
                                                margin: {
                                                    bottom: 50
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                        strokeDasharray: "3 3",
                                                        stroke: chartColors.barGrid
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 702,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                                        dataKey: "name",
                                                        tickFormatter: formattedTeamName,
                                                        stroke: chartColors.text,
                                                        interval: 0,
                                                        angle: -45,
                                                        textAnchor: "end",
                                                        height: 70,
                                                        tick: {
                                                            fill: chartColors.text,
                                                            fontSize: 11
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 703,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                                        stroke: chartColors.text
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 713,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 714,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                                        dataKey: "count",
                                                        fill: chartColors.bar,
                                                        children: teamDistribution.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                                fill: COLORS[index % COLORS.length]
                                                            }, "cell-".concat(index), false, {
                                                                fileName: "[project]/src/app/home/page.tsx",
                                                                lineNumber: 717,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 715,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.tsx",
                                                lineNumber: 701,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.tsx",
                                            lineNumber: 700,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 699,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.tsx",
                                lineNumber: 695,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: pieChartContainerRef,
                                className: "flex flex-col rounded-lg bg-white p-4 shadow dark:bg-dark-secondary min-h-[400px] h-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold dark:text-white",
                                                children: "Work Item Distribution (By Type / By Priority)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/home/page.tsx",
                                                lineNumber: 728,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: chartMode,
                                                onChange: (e)=>setChartMode(e.target.value),
                                                className: "rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-dark-secondary dark:text-white",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "type",
                                                        children: "By Type"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 736,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "priority",
                                                        children: "By Priority"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 737,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.tsx",
                                                lineNumber: 731,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 727,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-h-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                            width: "100%",
                                            height: pieChartHeight,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PieChart"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pie"], {
                                                        dataKey: "count",
                                                        data: pieData,
                                                        fill: chartColors.pieFill,
                                                        label: true,
                                                        children: pieData.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                                fill: COLORS[index % COLORS.length]
                                                            }, "cell-".concat(index), false, {
                                                                fileName: "[project]/src/app/home/page.tsx",
                                                                lineNumber: 745,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 743,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 748,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {}, void 0, false, {
                                                        fileName: "[project]/src/app/home/page.tsx",
                                                        lineNumber: 749,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/home/page.tsx",
                                                lineNumber: 742,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/home/page.tsx",
                                            lineNumber: 741,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 740,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.tsx",
                                lineNumber: 726,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.tsx",
                        lineNumber: 693,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold dark:text-white",
                                        children: selectedPriority === "all" ? "All Work Items" : "".concat(selectedPriority, " Priority Work Items")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 759,
                                        columnNumber: 13
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
                                                fileName: "[project]/src/app/home/page.tsx",
                                                lineNumber: 769,
                                                columnNumber: 15
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
                                                    fileName: "[project]/src/app/home/page.tsx",
                                                    lineNumber: 771,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0));
                                            })
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/home/page.tsx",
                                        lineNumber: 764,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/home/page.tsx",
                                lineNumber: 758,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 650,
                                    width: "100%"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$x$2d$data$2d$grid$2f$esm$2f$DataGrid$2f$DataGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataGrid"], {
                                    rows: displayedWorkItems,
                                    columns: workItemColumns,
                                    loading: isWorkItemsLoading,
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
                                    fileName: "[project]/src/app/home/page.tsx",
                                    lineNumber: 778,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/app/home/page.tsx",
                                lineNumber: 777,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/home/page.tsx",
                        lineNumber: 757,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/home/page.tsx",
                lineNumber: 459,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/home/page.tsx",
        lineNumber: 407,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(HomePage, "5lW+IDf1VhGxAN0TjUic3HUyJac=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetProgramsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetTeamsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWorkItemsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetWorkItemsByProgramQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetMilestonesQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetMilestonesByProgramQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"]
    ];
});
_c = HomePage;
const __TURBOPACK__default__export__ = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_ffa0472d._.js.map