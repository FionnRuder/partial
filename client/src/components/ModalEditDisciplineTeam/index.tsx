import Modal from '@/components/Modal';
import {
  useEditTeamMutation,
  useGetUsersQuery,
  useGetProgramsQuery,
  DisciplineTeam
} from '@/state/api';
import React, { useEffect, useState } from 'react';
import { showApiError, showApiSuccess } from '@/lib/toast';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  team: DisciplineTeam | null;
};

const ModalEditDisciplineTeam = ({ isOpen, onClose, team }: Props) => {
  const [editTeam, { isLoading: isSaving }] = useEditTeamMutation();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: programs = [], isLoading: programsLoading } = useGetProgramsQuery();

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamManagerUserId, setTeamManagerUserId] = useState("");
  const [selectedProgramIds, setSelectedProgramIds] = useState<number[]>([]);

  // Prefill all fields when modal opens
  useEffect(() => {
    if (team) {
      setName(team.name || "");
      setDescription(team.description || "");
      setTeamManagerUserId(team.teamManagerUserId?.toString() || "");
      // Set selected programs from team.programs
      // team.programs is an array of Program objects (from getTeams response)
      if (team.programs && Array.isArray(team.programs) && team.programs.length > 0) {
        // Programs are already flattened in getTeams response
        setSelectedProgramIds(team.programs.map((p: any) => p.id));
      } else {
        setSelectedProgramIds([]);
      }
    }
  }, [team]);

  const isFormValid = (): boolean => {
    return !!name && !!description;
  };

  const handleSubmit = async () => {
    if (!team || !isFormValid()) return;

    const updatedTeam: any = {
      name,
      description,
      teamManagerUserId: teamManagerUserId ? parseInt(teamManagerUserId) : undefined,
      programIds: selectedProgramIds,
    };

    try {
      await editTeam({
        teamId: team.id,
        updates: updatedTeam,
      }).unwrap();
      showApiSuccess("Team updated successfully");
      onClose(); // close modal on success
    } catch (err: any) {
      console.error("Failed to save team:", err);
      showApiError(err, "Failed to save team");
    }
  };

  const handleProgramToggle = (programId: number) => {
    setSelectedProgramIds(prev => 
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit Discipline Team`}>
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Team Name:
          </label>
          <input
            type="text"
            className={inputStyles}
            placeholder="Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Description:
          </label>
          <textarea
            className={inputStyles}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Team Manager:
          </label>
          <select
            className={selectStyles}
            value={teamManagerUserId}
            onChange={(e) => setTeamManagerUserId(e.target.value)}
            disabled={usersLoading}
          >
            <option value="">Select Team Manager (Optional)</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.username})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assign Programs (Optional):
          </label>
          {programsLoading ? (
            <div className="text-sm text-gray-500">Loading programs...</div>
          ) : programs.length === 0 ? (
            <div className="text-sm text-gray-500">No programs available</div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 dark:border-dark-tertiary rounded p-3">
              {programs.map((program) => (
                <label
                  key={program.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedProgramIds.includes(program.id)}
                    onChange={() => handleProgramToggle(program.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {program.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isSaving ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isSaving}
        >
          {isSaving ? "Updating Team..." : "Update Team"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditDisciplineTeam;
