"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useGetPartsQuery, useGetProgramsQuery, WorkItemType } from '@/state/api';
import { Part, Program, WorkItem } from '@/state/api';
import { ChevronDown, ChevronRight, Bolt, User, Layers, FileText, AlertTriangle, CheckSquare, Edit, PlusSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ModalEditPart from '@/app/parts/ModalEditPart';
import ModalNewPart from '@/app/parts/ModalNewPart';
import Header from '@/components/Header';

interface PartHierarchyNode extends Part {
  children?: PartHierarchyNode[];
  isExpanded?: boolean;
}

interface WorkItemCounts {
  deliverables: number;
  issues: number;
  tasks: number;
  total: number;
}

// Custom hook to manage work item data for all parts
const useWorkItemData = (partsOrTree: Part[] | PartHierarchyNode[], programId: number | null) => {
  const [workItemData, setWorkItemData] = useState<Map<number, WorkItem[]>>(new Map());
  const [loadingParts, setLoadingParts] = useState<Set<number>>(new Set());
  const fetchedPartsRef = React.useRef<Set<number>>(new Set());
  const allWorkItemsRef = React.useRef<WorkItem[]>([]);

  // Fetch all work items for the program once (more efficient than per-part requests)
  const fetchAllWorkItemsForProgram = useCallback(async (programId: number) => {
    try {
      const headers: HeadersInit = {};
      if (typeof window !== 'undefined') {
        const storedUser = window.localStorage.getItem('authUser');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser?.userId) {
              headers['x-user-id'] = String(parsedUser.userId);
            }
          } catch (error) {
            console.warn('Failed to parse authUser from localStorage', error);
          }
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/workItems?programId=${programId}`, {
        headers,
        credentials: 'include',
      });
      
      if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = response.headers.get('Retry-After') || '30';
        const waitTime = parseInt(retryAfter, 10) * 1000;
        console.warn(`Rate limited. Retrying after ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return fetchAllWorkItemsForProgram(programId);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const workItems = await response.json();
      const workItemsArray = Array.isArray(workItems) ? workItems : [];
      allWorkItemsRef.current = workItemsArray;
      console.log(`Fetched ${workItemsArray.length} work items for program ${programId}`);
      
      // Group work items by partId
      const workItemsByPart = new Map<number, WorkItem[]>();
      workItemsArray.forEach(workItem => {
        if (workItem.partNumbers && Array.isArray(workItem.partNumbers)) {
          workItem.partNumbers.forEach((partLink: any) => {
            const partId = partLink.part?.id || partLink.partId;
            if (partId) {
              if (!workItemsByPart.has(partId)) {
                workItemsByPart.set(partId, []);
              }
              workItemsByPart.get(partId)!.push(workItem);
            }
          });
        }
      });
      
      setWorkItemData(workItemsByPart);
    } catch (error) {
      console.error(`Failed to fetch work items for program ${programId}:`, error);
      setWorkItemData(new Map());
    }
  }, []);

  // Fetch work items for a specific part (fallback if program fetch fails)
  const fetchWorkItemsForPart = useCallback(async (partId: number, retryCount = 0) => {
    const maxRetries = 3;
    
    setLoadingParts(prev => {
      if (prev.has(partId)) return prev;
      return new Set(prev).add(partId);
    });
    
    try {
      const headers: HeadersInit = {};
      if (typeof window !== 'undefined') {
        const storedUser = window.localStorage.getItem('authUser');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser?.userId) {
              headers['x-user-id'] = String(parsedUser.userId);
            }
          } catch (error) {
            console.warn('Failed to parse authUser from localStorage', error);
          }
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/workItems?partId=${partId}`, {
        headers,
        credentials: 'include',
      });
      
      if (response.status === 429) {
        if (retryCount < maxRetries) {
          const retryAfter = response.headers.get('Retry-After') || '30';
          const waitTime = parseInt(retryAfter, 10) * 1000;
          console.warn(`Rate limited for part ${partId}. Retrying after ${waitTime}ms... (attempt ${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return fetchWorkItemsForPart(partId, retryCount + 1);
        } else {
          throw new Error(`Rate limited after ${maxRetries} retries`);
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const workItems = await response.json();
      const workItemsArray = Array.isArray(workItems) ? workItems : [];
      console.log(`Fetched ${workItemsArray.length} work items for part ${partId}:`, workItemsArray);
      setWorkItemData(prev => {
        const newMap = new Map(prev);
        newMap.set(partId, workItemsArray);
        return newMap;
      });
    } catch (error) {
      console.error(`Failed to fetch work items for part ${partId}:`, error);
      setWorkItemData(prev => {
        const newMap = new Map(prev);
        newMap.set(partId, []);
        return newMap;
      });
    } finally {
      setLoadingParts(prev => {
        const newSet = new Set(prev);
        newSet.delete(partId);
        return newSet;
      });
    }
  }, []);

  // Collect all part IDs from the hierarchy
  const allPartIds = useMemo(() => {
    const ids = new Set<number>();
    const collectPartIds = (partList: (Part | PartHierarchyNode)[]) => {
      partList.forEach(part => {
        ids.add(part.id);
        if ('children' in part && part.children) {
          collectPartIds(part.children);
        }
      });
    };
    collectPartIds(partsOrTree);
    return Array.from(ids).sort().join(',');
  }, [partsOrTree]);

  // Fetch all work items for the program when programId changes
  useEffect(() => {
    if (programId) {
      fetchAllWorkItemsForProgram(programId);
    } else {
      setWorkItemData(new Map());
      allWorkItemsRef.current = [];
    }
  }, [programId, fetchAllWorkItemsForProgram]);

  return { workItemData, loadingParts };
};

// Component to display work item counts for a part
const PartWorkItemCounts = ({
  partId,
  children,
  isExpanded,
  workItemData,
}: {
  partId: number;
  children?: PartHierarchyNode[];
  isExpanded: boolean;
  workItemData: Map<number, WorkItem[]>;
}) => {
  const workItems = workItemData.get(partId);
  // Ensure workItems is always an array
  const workItemsArray = Array.isArray(workItems) ? workItems : [];

  // Get direct work item counts for this part
  const directCounts = useMemo((): WorkItemCounts => {
    const deliverables = workItemsArray.filter(item => item.workItemType === WorkItemType.Deliverable).length;
    const issues = workItemsArray.filter(item => item.workItemType === WorkItemType.Issue).length;
    const tasks = workItemsArray.filter(item => item.workItemType === WorkItemType.Task).length;
    const total = workItemsArray.length;

    return { deliverables, issues, tasks, total };
  }, [workItemsArray]);

  // Recursively calculate children's work item counts
  const calculateChildrenCounts = (childNodes: PartHierarchyNode[]): WorkItemCounts => {
    return childNodes.reduce((acc, child) => {
      const childWorkItems = workItemData.get(child.id);
      // Ensure childWorkItems is always an array
      const childWorkItemsArray = Array.isArray(childWorkItems) ? childWorkItems : [];
      const childDirectCounts = {
        deliverables: childWorkItemsArray.filter(item => item.workItemType === WorkItemType.Deliverable).length,
        issues: childWorkItemsArray.filter(item => item.workItemType === WorkItemType.Issue).length,
        tasks: childWorkItemsArray.filter(item => item.workItemType === WorkItemType.Task).length,
        total: childWorkItemsArray.length,
      };

      // Recursively get children's children counts
      const grandChildrenCounts = child.children ? calculateChildrenCounts(child.children) : { deliverables: 0, issues: 0, tasks: 0, total: 0 };

      return {
        deliverables: acc.deliverables + childDirectCounts.deliverables + grandChildrenCounts.deliverables,
        issues: acc.issues + childDirectCounts.issues + grandChildrenCounts.issues,
        tasks: acc.tasks + childDirectCounts.tasks + grandChildrenCounts.tasks,
        total: acc.total + childDirectCounts.total + grandChildrenCounts.total,
      };
    }, { deliverables: 0, issues: 0, tasks: 0, total: 0 });
  };

  const childrenCounts = useMemo((): WorkItemCounts => {
    if (!children || children.length === 0) {
      return { deliverables: 0, issues: 0, tasks: 0, total: 0 };
    }
    return calculateChildrenCounts(children);
  }, [children, workItemData]);

  // Determine which counts to display based on expansion state
  const displayCounts = useMemo(() => {
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
        total: directCounts.total + childrenCounts.total,
      };
    }
  }, [isExpanded, directCounts, childrenCounts, children]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
        <FileText className="h-3 w-3" />
        Deliverables: {displayCounts.deliverables}
      </span>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 dark:text-orange-400">
        <AlertTriangle className="h-3 w-3" />
        Issues: {displayCounts.issues}
      </span>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
        <CheckSquare className="h-3 w-3" />
        Tasks: {displayCounts.tasks}
      </span>
      <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        Total: {displayCounts.total}
        {isExpanded || !children || children.length === 0 ? " (direct)" : " (including children)"}
      </span>
    </div>
  );
};

const PartHierarchyPage = () => {
  const router = useRouter();
  const { data: allParts = [], isLoading, error } = useGetPartsQuery();
  const { data: programs = [] } = useGetProgramsQuery();
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPartForEdit, setSelectedPartForEdit] = useState<Part | null>(null);
  const [isNewPartModalOpen, setIsNewPartModalOpen] = useState(false);

  // Auto-select the first program when programs are loaded
  useEffect(() => {
    if (programs.length > 0 && selectedProgramId === null) {
      setSelectedProgramId(programs[0].id);
    }
  }, [programs, selectedProgramId]);

  // Filter parts by selected program
  const filteredParts = useMemo(() => {
    if (!selectedProgramId) return [];
    return allParts.filter(part => part.programId === selectedProgramId);
  }, [allParts, selectedProgramId]);

  // Build hierarchical tree structure
  const hierarchyTree = useMemo(() => {
    if (!filteredParts.length) return [];

    // Create a map for quick lookup
    const partMap = new Map<number, PartHierarchyNode>();
    filteredParts.forEach(part => {
      partMap.set(part.id, { ...part, children: [] });
    });

    // Build the tree
    const rootNodes: PartHierarchyNode[] = [];
    filteredParts.forEach(part => {
      const node = partMap.get(part.id)!;
      if (part.parentId && partMap.has(part.parentId)) {
        const parent = partMap.get(part.parentId)!;
        parent.children!.push(node);
      } else {
        rootNodes.push(node);
      }
    });

    // Sort children by part code
    const sortChildren = (nodes: PartHierarchyNode[]) => {
      nodes.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: "base" }));
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          sortChildren(node.children);
        }
      });
    };

    sortChildren(rootNodes);
    return rootNodes;
  }, [filteredParts]);

  // Use the work item data hook with the hierarchy tree and programId
  const { workItemData } = useWorkItemData(hierarchyTree, selectedProgramId);

  const toggleNode = (nodeId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleEditPart = (part: Part, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click
    setSelectedPartForEdit(part);
    setIsEditModalOpen(true);
  };

  const renderNode = (node: PartHierarchyNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const indentClass = `ml-${depth * 4}`;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex flex-wrap items-center gap-x-4 gap-y-2 py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-l-2 border-transparent hover:border-blue-200 transition-colors ${indentClass}`}
          style={{ marginLeft: `${depth * 20}px` }}
          onClick={() => router.push(`/parts/${node.id}`)}
        >
          {/* Expand/Collapse Button */}
          <div className="w-6 flex justify-center">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.id);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}
          </div>

          {/* Part Icon */}
          <Bolt className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />

          {/* Part Information */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-gray-900 dark:text-white">
                {node.partName}
              </span>
              <span className="text-gray-700 dark:text-gray-300 truncate">
                ({node.code})
              </span>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {node.assignedUser?.name || 'Unassigned'}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                Level {node.level}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  node.state === 'Released'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : node.state === 'UnderReview'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : node.state === 'InWork'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                }`}
              >
                {node.state}
              </span>
            </div>

            {/* Work Item Counts */}
            <PartWorkItemCounts
              partId={node.id}
              children={node.children}
              isExpanded={isExpanded}
              workItemData={workItemData}
            />
          </div>

          {/* Edit Icon */}
          <div className="flex-shrink-0">
            <button
              onClick={(e) => handleEditPart(node, e)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Edit Part"
            >
              <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading part hierarchy...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading part hierarchy. Please try again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <Header 
            name="Part Hierarchy"
            buttonComponent={
              <button
                className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600 transition-colors"
                onClick={() => setIsNewPartModalOpen(true)}
              >
                <PlusSquare className="mr-2 h-5 w-5" />
                New Part
              </button>
            }
          />
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and navigate the hierarchical structure of all parts in the system
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4">
          {/* Program Filter */}
          <div className="flex items-center gap-4">
            <label htmlFor="program-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select a Program:
            </label>
            <select
              id="program-select"
              value={selectedProgramId || ''}
              onChange={(e) => {
                const programId = Number(e.target.value);
                setSelectedProgramId(programId);
                // Clear expanded nodes when changing program filter
                setExpandedNodes(new Set());
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
            >
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tree Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  // Expand all nodes
                  const allNodeIds = new Set<number>();
                  const collectIds = (nodes: PartHierarchyNode[]) => {
                    nodes.forEach(node => {
                      if (node.children && node.children.length > 0) {
                        allNodeIds.add(node.id);
                        collectIds(node.children);
                      }
                    });
                  };
                  collectIds(hierarchyTree);
                  setExpandedNodes(allNodeIds);
                }}
                className="px-4 py-2 bg-blue-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Expand All
              </button>
              <button
                onClick={() => setExpandedNodes(new Set())}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Collapse All
              </button>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedProgramId ? (
                <>
                  {filteredParts.length} parts in {programs.find(p => p.id === selectedProgramId)?.name}
                </>
              ) : (
                'Select a program to view parts'
              )}
            </div>
          </div>
        </div>

        {/* Hierarchy Tree */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          {hierarchyTree.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No parts found for the selected program.
              <br />
              <span className="text-sm">Try selecting a different program from the dropdown above.</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {hierarchyTree.map(node => renderNode(node))}
            </div>
          )}
        </div>

        {/* Edit Part Modal */}
        <ModalEditPart
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPartForEdit(null);
          }}
          part={selectedPartForEdit}
        />

        {/* New Part Modal */}
        <ModalNewPart
          isOpen={isNewPartModalOpen}
          onClose={() => setIsNewPartModalOpen(false)}
        />
    </div>
  );
};

export default PartHierarchyPage;
