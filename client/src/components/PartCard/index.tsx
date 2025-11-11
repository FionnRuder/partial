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
      className="rounded border p-4 shadow cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      {/* Header Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{part.partName}</h3>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
            Level {part.level}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">Part Code: {part.code}</p>
      </div>

      {/* Main Details */}
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">State:</span> {PartStateLabels[part.state]}
          </div>
          <div>
            <span className="font-medium">Revision:</span> {part.revisionLevel}
          </div>
        </div>

        <div className="border-t pt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Program:</span> {part.program?.name || "N/A"}
            </div>
            <div>
              <span className="font-medium">Assigned To:</span> {part.assignedUser?.name || part.assignedUser?.username || "Unassigned"}
            </div>
          </div>
        </div>

        {part.parent && (
          <div className="border-t pt-2">
            <span className="font-medium">Parent Part:</span> {part.parent.partName} (ID: {part.parent.id})
          </div>
        )}

        {/* Related items */}
        <div className="border-t pt-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {part.children && part.children.length > 0 && (
              <div>
                <span className="font-medium">Child Parts:</span> {part.children.length}
              </div>
            )}
            {part.workItemLinks && part.workItemLinks.length > 0 && (
              <div>
                <span className="font-medium">Work Items:</span> {part.workItemLinks.length}
              </div>
            )}
          </div>
        </div>

        {/* Children List */}
        {part.children && part.children.length > 0 && (
          <div className="border-t pt-2">
            <p className="font-medium mb-1 text-xs">Child Parts:</p>
            <div className="ml-3 space-y-1 text-xs">
            {part.children.map((child) => (
                <div key={child.id} className="text-gray-600">
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

