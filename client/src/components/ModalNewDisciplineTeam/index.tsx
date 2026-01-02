import Modal from '@/components/Modal';
import {
  useCreateTeamMutation,
  useGetUsersQuery,
  useGetProgramsQuery,
  DisciplineTeam
} from '@/state/api';
import React, { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewDisciplineTeam = ({
  isOpen,
  onClose,
}: Props) => {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: programs = [], isLoading: programsLoading } = useGetProgramsQuery();
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamManagerUserId, setTeamManagerUserId] = useState("");
  const [selectedProgramIds, setSelectedProgramIds] = useState<number[]>([]);

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const payload: any = {
      name,
      description,
      teamManagerUserId: teamManagerUserId ? parseInt(teamManagerUserId) : undefined,
      programIds: selectedProgramIds.length > 0 ? selectedProgramIds : undefined,
    };

    try {
      await createTeam(payload).unwrap();
      // Reset form
      setName("");
      setDescription("");
      setTeamManagerUserId("");
      setSelectedProgramIds([]);
      onClose(); // close modal on success
    } catch (err) {
      console.error("Failed to create team:", err);
    }
  };

  const handleProgramToggle = (programId: number) => {
    setSelectedProgramIds(prev => 
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const isFormValid = (): boolean => {
    return !!name && !!description;
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={"Create New Discipline Team"}>
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

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
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating Team..." : "Create Team"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewDisciplineTeam;
