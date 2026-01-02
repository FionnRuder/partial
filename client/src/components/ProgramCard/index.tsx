import { Program, useGetUsersQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  program: Program;
};

const ProgramCard = ({ program }: Props) => {
  const router = useRouter();
  const { data: users } = useGetUsersQuery();
  const programManager = users?.find((u) => u.id === program.programManagerUserId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleClick = () => {
    router.push("/programs");
  };

  return (
    <div 
      className="rounded border border-gray-200 p-4 shadow cursor-pointer hover:shadow-lg transition-shadow dark:border-gray-700 dark:bg-dark-secondary"
      onClick={handleClick}
    >
      {/* Header Section */}
      <div className="mb-3">
        <h3 className="font-semibold text-lg dark:text-white">{program.name}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">ID: {program.id}</p>
      </div>

      {/* Description */}
      {program.description && (
        <div className="mb-3 rounded bg-gray-50 p-3 dark:bg-dark-tertiary">
          <p className="text-sm dark:text-gray-200">{program.description}</p>
        </div>
      )}

      {/* Main Details */}
      <div className="space-y-2 text-sm dark:text-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium dark:text-gray-300">Start Date:</span> {formatDate(program.startDate)}
          </div>
          <div>
            <span className="font-medium dark:text-gray-300">End Date:</span> {formatDate(program.endDate)}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
          <span className="font-medium dark:text-gray-300">Program Manager:</span> {programManager?.name || "N/A"}
        </div>

        {/* Related items */}
        <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {program.partNumbers && program.partNumbers.length > 0 && (
              <div>
                <span className="font-medium dark:text-gray-300">Parts:</span> {program.partNumbers.length}
              </div>
            )}
            {program.disciplineTeams && program.disciplineTeams.length > 0 && (
              <div>
                <span className="font-medium dark:text-gray-300">Discipline Teams:</span> {program.disciplineTeams.length}
              </div>
            )}
            {program.milestones && program.milestones.length > 0 && (
              <div>
                <span className="font-medium dark:text-gray-300">Milestones:</span> {program.milestones.length}
              </div>
            )}
            {program.workItems && program.workItems.length > 0 && (
              <div>
                <span className="font-medium dark:text-gray-300">Work Items:</span> {program.workItems.length}
              </div>
            )}
          </div>
        </div>

        {/* Discipline Teams List */}
        {program.disciplineTeams && program.disciplineTeams.length > 0 && (
          <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
            <p className="font-medium mb-1 text-xs dark:text-gray-300">Discipline Teams:</p>
            <div className="ml-3 space-y-1 text-xs">
              {program.disciplineTeams.map((teamLink) => (
                <div key={teamLink.id} className="text-gray-600 dark:text-gray-400">
                  • {teamLink.disciplineTeam.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones List */}
        {program.milestones && program.milestones.length > 0 && (
          <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
            <p className="font-medium mb-1 text-xs dark:text-gray-300">Milestones:</p>
            <div className="ml-3 space-y-1 text-xs">
              {program.milestones.map((milestone) => (
                <div key={milestone.id} className="text-gray-600 dark:text-gray-400">
                  • {milestone.name} - {formatDate(milestone.date)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramCard;