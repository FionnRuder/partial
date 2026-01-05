"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useAppSelector } from "../../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import Image from "next/image";
import { useGetUserByIdQuery } from "@/state/api";
import { Part, Priority, Status, WorkItem, useGetProgramsQuery, useGetTeamsQuery, useUpdateUserMutation } from "@/state/api";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { SquarePen } from "lucide-react";

type Props = {
  params: Promise<{ username: string }>;
};

const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.ToDo:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    case Status.WorkInProgress:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case Status.UnderReview:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case Status.Completed:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.Urgent:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case Priority.High:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case Priority.Medium:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case Priority.Low:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case Priority.Backlog:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const formatPhoneNumber = (phone: string) => {
  if (!phone) return "N/A";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

const workItemColumns: GridColDef<WorkItem>[] = [
  {
    field: "workItemType",
    headerName: "Type",
    width: 120,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
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
      const dateStr = params.value ? format(new Date(params.value), "MM/dd/yyyy") : "N/A";
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
    field: "program",
    headerName: "Program",
    width: 200,
    valueGetter: (value, row) => row.program?.name || "N/A",
  },
];

const getInitials = (name?: string, username?: string) => {
  if (name) {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    if (parts.length === 1 && parts[0].length > 0) {
      const first = parts[0][0];
      const second = parts[0][1] || "";
      return `${first}${second}`.toUpperCase();
    }
  }
  if (username) {
    return username.substring(0, 2).toUpperCase();
  }
  return "?";
};

const sanitizeProfilePictureUrl = (value?: string | null) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) {
    return "";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const UserDetailPage = ({ params }: Props) => {
  const { username: encodedUsername } = React.use(params);
  const username = decodeURIComponent(encodedUsername);
  const router = useRouter();
  const [selectedPriority, setSelectedPriority] = useState<Priority | "all">("all");

  const { data: user, isLoading, isError } = useGetUserByIdQuery(username);
  const { data: teams, isLoading: isTeamsLoading } = useGetTeamsQuery();
  const { data: programs = [] } = useGetProgramsQuery();
  const programById = useMemo(
    () => new Map(programs.map((program) => [program.id, program.name])),
    [programs]
  );
  const [updateUser] = useUpdateUserMutation();
  const { user: authUser, updateProfile } = useAuth();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    profilePictureUrl: sanitizeProfilePictureUrl(user?.profilePictureUrl),
    disciplineTeamId: user?.disciplineTeamId || null,
  });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
      profilePictureUrl: sanitizeProfilePictureUrl(user?.profilePictureUrl),
      disciplineTeamId: user?.disciplineTeamId || null,
    });
  }, [user]);

  const isOwnProfile = authUser?.userId === user?.userId;

  if (isLoading) return <div className="p-8">Loading user...</div>;
  if (isError || !user) return <div className="p-8">Error loading user or user not found</div>;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const sanitizedProfileUrl = sanitizeProfilePictureUrl(formData.profilePictureUrl);

      await updateUser({
        userId: user.userId,
        data: {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          profilePictureUrl: sanitizedProfileUrl || undefined,
          disciplineTeamId: formData.disciplineTeamId || undefined,
        },
      }).unwrap();

      if (isOwnProfile) {
        await updateProfile({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          profilePictureUrl: sanitizedProfileUrl || undefined,
          disciplineTeamId: formData.disciplineTeamId || undefined,
        });
      }

      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Failed to update user:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Get assigned work items
  const assignedWorkItems = user.assignedWorkItems || [];
  const assignedParts = user.partNumbers || [];
  
  // Filter by priority
  const filteredWorkItems =
    selectedPriority === "all"
      ? assignedWorkItems
      : assignedWorkItems.filter((item) => item.priority === selectedPriority);

  // Sort by priority order (Urgent -> High -> Medium -> Low -> Backlog)
  const priorityOrder = {
    [Priority.Urgent]: 0,
    [Priority.High]: 1,
    [Priority.Medium]: 2,
    [Priority.Low]: 3,
    [Priority.Backlog]: 4,
  };

  const sortedWorkItems = [...filteredWorkItems].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Priority counts
  const priorityCounts = assignedWorkItems.reduce(
    (acc: Record<string, number>, item: WorkItem) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalCount = assignedWorkItems.length;

  return (
    <div className="flex w-full flex-col p-8">
      <div className="flex items-center justify-between">
        <Header name={user.name} />
        {isOwnProfile && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 whitespace-nowrap rounded-md bg-gray-300 px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-dark-tertiary dark:text-white dark:hover:bg-gray-600"
          >
            <SquarePen className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* User Information Section */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <div className="flex items-start gap-6">
          {/* Profile Picture */}
          <div className="h-24 w-24 flex-shrink-0">
            {formData.profilePictureUrl ? (
              <Image
                src={formData.profilePictureUrl ? `/images/${formData.profilePictureUrl}` : '/placeholder.png'}
                alt={user.username}
                width={96}
                height={96}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300 text-3xl font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {getInitials(user.name, user.username)}
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Username:</span>
                <p className="text-gray-900 dark:text-gray-100">{user.username}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email:</span>
                <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Phone Number:</span>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">
                    {formatPhoneNumber(user.phoneNumber)}
                  </p>
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Role:</span>
                <p className="text-gray-900 dark:text-gray-100">{user.role}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Discipline Team:</span>
                {isEditing ? (
                  isTeamsLoading ? (
                    <div className="flex items-center py-1">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Loading teams...</span>
                    </div>
                  ) : (
                    <select
                      value={formData.disciplineTeamId || ""}
                      onChange={(e) => setFormData({ ...formData, disciplineTeamId: e.target.value ? Number(e.target.value) : null })}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">No team selected</option>
                      {teams?.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  )
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">
                    {user.disciplineTeam?.name || "N/A"}
                  </p>
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Profile Picture URL:</span>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.profilePictureUrl}
                    onChange={(e) => setFormData({ ...formData, profilePictureUrl: sanitizeProfilePictureUrl(e.target.value) })}
                    placeholder="/images/profile.jpg"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">
                    {formData.profilePictureUrl || "N/A"}
                  </p>
                )}
              </div>
            </div>
            {isEditing && formData.profilePictureUrl && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Profile Picture Preview:</p>
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-600">
                  <img
                    src={formData.profilePictureUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
            {saveStatus === 'success' && (
              <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                Profile updated successfully.
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                Failed to update profile. Please try again.
              </div>
            )}
            {isEditing && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSaveStatus('idle');
                    setFormData({
                      name: user.name || "",
                      phoneNumber: user.phoneNumber || "",
                      profilePictureUrl: sanitizeProfilePictureUrl(user.profilePictureUrl),
                      disciplineTeamId: user.disciplineTeamId || null,
                    });
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assigned Parts */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">Assigned Parts</h3>
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            {assignedParts.length} {assignedParts.length === 1 ? "part" : "parts"}
          </span>
        </div>
        {assignedParts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            This user has no assigned parts.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assignedParts.map((part: Part) => (
              <Link
                key={part.id}
                href={`/parts/${part.id}`}
                className="group flex flex-col rounded-md border border-gray-200 p-4 shadow-sm transition hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:bg-dark-tertiary dark:hover:border-blue-400"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 transition group-hover:text-blue-600 dark:text-white">
                      {part.partName} ({part.code})
                    </h4>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                    {part.state}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-sm text-gray-500 dark:text-neutral-400">
                  <p>
                    Program: {part.program?.name ?? programById.get(part.programId) ?? "N/A"}
                  </p>
                  <p>Level: {part.level ?? "N/A"}</p>
                  <p>Revision: {part.revisionLevel ?? "N/A"}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Work Items Table */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">
            {selectedPriority === "all"
              ? "All Assigned Work Items"
              : `${selectedPriority} Priority Work Items`}
          </h3>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as Priority | "all")}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-dark-tertiary dark:text-white"
          >
            <option value="all">All Priorities ({totalCount})</option>
            {Object.values(Priority).map((priority) => (
              <option key={priority} value={priority}>
                {priority} ({priorityCounts[priority] ?? 0})
              </option>
            ))}
          </select>
        </div>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={sortedWorkItems}
            columns={workItemColumns}
            getRowId={(row) => row.id}
            pagination
            showToolbar
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
            initialState={{
              sorting: {
                sortModel: [{ field: "priority", sort: "asc" }],
              },
            }}
            onRowClick={(params) => router.push(`/work-items/${params.row.id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
