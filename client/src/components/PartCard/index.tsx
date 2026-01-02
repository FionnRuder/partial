import { Part, PartStateLabels } from "@/state/api";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  part: Part;
};

const PartCard = ({ part }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/parts/${part.id}`);
  };

  return (
    <div 
      className="rounded border border-gray-200 p-4 shadow cursor-pointer hover:shadow-lg transition-shadow dark:border-gray-700 dark:bg-dark-secondary"
      onClick={handleClick}
    >
      {/* Header Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg dark:text-white">{part.partName}</h3>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Level {part.level}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Part Code: {part.code}</p>
      </div>

      {/* Main Details */}
      <div className="space-y-2 text-sm dark:text-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium dark:text-gray-300">State:</span> {PartStateLabels[part.state]}
          </div>
          <div>
            <span className="font-medium dark:text-gray-300">Revision:</span> {part.revisionLevel}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium dark:text-gray-300">Program:</span> {part.program?.name || "N/A"}
            </div>
            <div>
              <span className="font-medium dark:text-gray-300">Assigned To:</span> {part.assignedUser?.name || part.assignedUser?.username || "Unassigned"}
            </div>
          </div>
        </div>

        {part.parent && (
          <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
            <span className="font-medium dark:text-gray-300">Parent Part:</span> {part.parent.partName} (ID: {part.parent.id})
          </div>
        )}

        {/* Related items */}
        <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {part.children && part.children.length > 0 && (
              <div>
                <span className="font-medium dark:text-gray-300">Child Parts:</span> {part.children.length}
              </div>
            )}
            {part.workItemLinks && part.workItemLinks.length > 0 && (
              <div>
                <span className="font-medium dark:text-gray-300">Work Items:</span> {part.workItemLinks.length}
              </div>
            )}
          </div>
        </div>

        {/* Children List */}
        {part.children && part.children.length > 0 && (
          <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
            <p className="font-medium mb-1 text-xs dark:text-gray-300">Child Parts:</p>
            <div className="ml-3 space-y-1 text-xs">
            {part.children.map((child) => (
                <div key={child.id} className="text-gray-600 dark:text-gray-400">
                  • {child.partName} (Level {child.level})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartCard;

