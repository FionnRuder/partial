"use client";

import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { WorkItem, Status } from "@/state/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { format, eachDayOfInterval, isAfter, isBefore, isEqual, parseISO } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
  workItems: WorkItem[];
  startDate?: string;
  endDate?: string;
  isDarkMode?: boolean;
};

// Helper function to parse date string without timezone conversion
// Extracts the date portion (YYYY-MM-DD) and parses it as a local date
const parseDateOnly = (dateString: string | undefined): Date | null => {
  if (!dateString) return null;
  try {
    // Extract just the date portion (YYYY-MM-DD) from ISO string
    const dateOnly = dateString.split('T')[0];
    // Parse as local date to avoid timezone conversion
    const [year, month, day] = dateOnly.split('-').map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    return new Date(year, month - 1, day);
  } catch {
    return null;
  }
};

const BurndownChart: React.FC<Props> = ({ workItems, startDate, endDate, isDarkMode = false }) => {
  const today = new Date();
  // Set today to midnight to avoid timezone issues when comparing
  today.setHours(0, 0, 0, 0);

  // Determine chart start/end date
  const minDate = useMemo(() => {
    if (startDate) {
      const parsed = parseDateOnly(startDate);
      return parsed || today;
    }

    const dates = workItems
      .map((w) => parseDateOnly(w.dueDate))
      .concat(workItems.map((w) => parseDateOnly(w.estimatedCompletionDate || w.dueDate)))
      .concat(workItems.map((w) => parseDateOnly(w.actualCompletionDate || w.dueDate)))
      .filter((d): d is Date => d !== null);
    
    return dates.length > 0 
      ? new Date(Math.min(...dates.map((d) => d.getTime())))
      : today;
  }, [workItems, startDate, today]);

  const maxDate = useMemo(() => {
    // If endDate is explicitly provided, use it
    if (endDate) {
      const parsed = parseDateOnly(endDate);
      return parsed || today;
    }

    // Collect all dates from work items (dueDate, estimatedCompletionDate, actualCompletionDate)
    const dates = workItems
      .map((w) => parseDateOnly(w.dueDate))
      .concat(workItems.map((w) => parseDateOnly(w.estimatedCompletionDate || w.dueDate)))
      .concat(workItems.map((w) => parseDateOnly(w.actualCompletionDate || w.dueDate)))
      .filter((d): d is Date => d !== null);
    
    // Get the maximum of all dates
    const max = dates.length > 0 
      ? new Date(Math.max(...dates.map((d) => d.getTime())))
      : today;
    
    // Ensure the max is at least today
    return isAfter(max, today) ? max : today;
  }, [workItems, endDate, today]);

  const dates = eachDayOfInterval({ start: minDate, end: maxDate }).map((d) => format(d, "yyyy-MM-dd"));

  // Get total number of work items
  const totalItems = workItems.length;

  // Get the latest due date for baseline calculation
  const latestDueDate = useMemo(() => {
    const dueDates = workItems
      .map((w) => parseDateOnly(w.dueDate))
      .filter((d): d is Date => d !== null);
    return dueDates.length > 0 ? new Date(Math.max(...dueDates.map((d) => d.getTime()))) : maxDate;
  }, [workItems, maxDate]);

  // Helper function to count remaining items for actuals (based on actual completion date or status)
  const getActualsRemaining = (dateStr: string): number => {
    const currentDate = parseDateOnly(dateStr);
    if (!currentDate) return workItems.length;
    
    return workItems.filter((w) => {
      // If item has an actualCompletionDate, use it for precise timing
      if (w.actualCompletionDate) {
        const completionDate = parseDateOnly(w.actualCompletionDate);
        if (!completionDate) return true; // No valid date means still remaining
        // Item is remaining if completion date is after current date
        return isAfter(completionDate, currentDate);
      }
      
      // If no actualCompletionDate, check status
      // If status is Completed, we don't know when it was completed, so we can't accurately track it
      // For items without completion date but marked as completed, we'll assume they're completed
      // This is a limitation - ideally all completed items should have actualCompletionDate
      if (w.status === Status.Completed) {
        // Without a date, we can't know when it was completed, so we'll treat it as completed
        // This means it won't be counted as remaining
        return false;
      }
      
      // Item is still remaining if not completed
      return true;
    }).length;
  };

  // Helper function to count remaining items for forecast (based on estimated completion date)
  const getForecastRemaining = (dateStr: string): number => {
    const currentDate = parseDateOnly(dateStr);
    if (!currentDate) return workItems.length;
    
    return workItems.filter((w) => {
      const estimatedDate = w.estimatedCompletionDate 
        ? parseDateOnly(w.estimatedCompletionDate)
        : w.dueDate 
        ? parseDateOnly(w.dueDate)
        : null;
      
      if (!estimatedDate) return true; // No date means still remaining
      
      // Item is remaining if estimated completion date is after current date
      return isAfter(estimatedDate, currentDate);
    }).length;
  };

  // Calculate baseline: count items with due dates after current date
  // This represents the planned burndown - items remaining based on their due dates
  const baselineLine = dates.map((d) => {
    const currentDate = parseDateOnly(d);
    if (!currentDate) return workItems.length;
    
    return workItems.filter((w) => {
      const dueDate = w.dueDate ? parseDateOnly(w.dueDate) : null;
      if (!dueDate) return true; // Items without due dates are always remaining
      // Item is remaining if due date is after current date
      return isAfter(dueDate, currentDate);
    }).length;
  });

  // Calculate forecast line: items remaining based on estimated completion dates
  const forecastLine = dates.map((d) => getForecastRemaining(d));

  // Calculate actuals line: items remaining based on actual completion dates (only up to today)
  const actualsLine = dates.map((d) => {
    const currentDate = parseDateOnly(d);
    if (!currentDate) return null;
    // Only show actuals up to today
    if (isAfter(currentDate, today)) {
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
        spanGaps: false, // prevents the line from connecting beyond nulls
      },
      {
        label: "Baseline (Due Date)",
        data: baselineLine,
        borderColor: "#FF9500",
        backgroundColor: "rgba(255,149,0,0.2)",
        fill: true,
      },
      {
        label: "Forecast (Estimated Completion)",
        data: forecastLine,
        borderColor: "#6FA8DC",
        backgroundColor: "rgba(111, 168, 220, 0.2)",
        fill: true,
      },
    ],
  };

    const textColor = isDarkMode ? "#FFFFFF" : "#000000";
    const gridColor = isDarkMode ? "#444" : "#CCC";

    const options: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
            legend: { 
            position: "top",
            labels: {
                color: textColor, // legend text
                usePointStyle: true,
            },
            },
            title: { 
                display: false, 
                text: "Work Item Burndown Chart",
                color: textColor, // chart title
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
                    label: function (tooltipItem) {
                        const datasetLabel = tooltipItem.dataset.label || "";
                        const value = tooltipItem.raw === null ? "—" : tooltipItem.raw;
                        return `${datasetLabel}: ${value}`;
                    },
                },
            },
        },
        interaction: {
            mode: "index",
            intersect: false,
        },
        scales: {
            x: {
                title: { display: false, text: "Date", color: textColor },
                ticks: { color: textColor },
                grid: { color: gridColor },
            },
            y: {
                beginAtZero: true,
                title: { display: false, text: "Remaining Work Items", color: textColor },
                ticks: { color: textColor },
                grid: { color: gridColor },
            },
        },
    };


  return <Line data={data} options={options} />;
};

export default BurndownChart;
