import { User } from "@/state/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/users/${user.id}`);
  };

  return (
    <div 
      className="rounded border border-gray-200 p-4 shadow cursor-pointer hover:shadow-lg transition-shadow dark:border-gray-700 dark:bg-dark-secondary"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 mb-3">
        {user.profilePictureUrl ? (
          <Image
            src={user.profilePictureUrl ? `/images/${user.profilePictureUrl}` : '/p1.jpeg'}
            alt="profile picture"
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
            {(() => {
              // Get initials from name (first letter of first name and first letter of last name)
              if (user.name) {
                const names = user.name.trim().split(" ").filter(Boolean);
                if (names.length >= 2) {
                  return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
                }
                if (names.length === 1 && names[0].length > 0) {
                  return names[0][0].toUpperCase();
                }
              }
              // Fallback to username if name is not available
              if (user.username) {
                return user.username.substring(0, 2).toUpperCase();
              }
              return "?";
            })()}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg dark:text-white">{user.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.username}</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm dark:text-gray-200">
        <div>
          <span className="font-medium dark:text-gray-300">Email:</span> {user.email}
        </div>
        {user.phoneNumber && (
          <div>
            <span className="font-medium dark:text-gray-300">Phone:</span> {user.phoneNumber}
          </div>
        )}
        <div>
          <span className="font-medium dark:text-gray-300">Role:</span> {user.role}
        </div>
        {user.disciplineTeam && (
          <div>
            <span className="font-medium dark:text-gray-300">Discipline Team:</span> {user.disciplineTeam.name}
          </div>
        )}
        {user.authoredWorkItems && user.authoredWorkItems.length > 0 && (
          <div>
            <span className="font-medium dark:text-gray-300">Authored Work Items:</span> {user.authoredWorkItems.length}
          </div>
        )}
        {user.assignedWorkItems && user.assignedWorkItems.length > 0 && (
          <div>
            <span className="font-medium dark:text-gray-300">Assigned Work Items:</span> {user.assignedWorkItems.length}
          </div>
        )}
        {user.partNumbers && user.partNumbers.length > 0 && (
          <div>
            <span className="font-medium dark:text-gray-300">Parts:</span> {user.partNumbers.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;