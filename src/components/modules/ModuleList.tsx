import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  GET_MODULES_BY_COURSE,
  UPDATE_MODULE_STATUS,
  ModuleStatus,
} from "@/graphql/queries/modules";


// Define quiz status values to match database constraints
const QuizStatus = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;


interface Resource {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

interface Quiz {
  id: string;
  cutoff_score: number;
  status: string;
  created_at: string;
}

interface SimilarQuestion {
  id: string;
  module_id: string;
  question: string;
  created_at: string;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  status: string;
  created_at: string;
  resources: Resource[];
  quizzes: Quiz[];
  similar_questions: SimilarQuestion[];
}

interface ModuleListProps {
  courseId: string;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "not_started":
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getQuizStatusColor = (status: string): string => {
  switch (status) {
    case "passed":
      return "bg-green-500 hover:bg-green-600";
    case "failed":
      return "bg-red-500 hover:bg-red-600";
    case "in_progress":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "not_attempted":
    default:
      return "bg-green-500 hover:bg-green-600";
  }
};

// Add this function to determine progress bar color
const getProgressBarColor = (percentage: number): string => {
  if (percentage <= 30) {
    return "bg-red-500"; // Red for initial progress
  } else if (percentage <= 50) {
    return "bg-yellow-500"; // Yellow for quarter way
  } else if (percentage <= 75) {
    return "bg-blue-500"; // Blue for halfway
  } else if (percentage < 100) {
    return "bg-indigo-500"; // Indigo for almost there
  } else {
    return "bg-green-500"; // Green for completion
  }
};

// Add this function to determine text color
const getProgressTextColor = (percentage: number): string => {
  if (percentage <= 30) {
    return "text-red-600";
  } else if (percentage <= 50) {
    return "text-yellow-600";
  } else if (percentage <= 75) {
    return "text-blue-600";
  } else if (percentage < 100) {
    return "text-indigo-600";
  } else {
    return "text-green-600";
  }
};

const ModuleList: React.FC<ModuleListProps> = ({ courseId }) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(GET_MODULES_BY_COURSE, {
    variables: { courseId },
    fetchPolicy: "network-only", // Always fetch fresh data
    pollInterval: 5000, // Poll every 5 seconds
  });

  const [updateModuleStatus] = useMutation(UPDATE_MODULE_STATUS);

  // Calculate overall progress
  const calculateProgress = (
    modules: Module[]
  ): {
    completedCount: number;
    totalCount: number;
    progressPercentage: number;
  } => {
    if (!modules?.length)
      return {
        completedCount: 0,
        totalCount: 0,
        progressPercentage: 0,
      };

    const totalModules = modules.length;
    const completedModules = modules.filter(
      (m) => m.status === "completed"
    ).length;

    return {
      completedCount: completedModules,
      totalCount: totalModules,
      progressPercentage: Math.round((completedModules / totalModules) * 100),
    };
  };

  const isModuleLocked = (moduleIndex: number, modules: Module[]): boolean => {
    if (moduleIndex === 0) return false; // First module is always unlocked

    // Check if previous module's quiz is passed
    const previousModule = modules[moduleIndex - 1];
    const previousQuiz = previousModule?.quizzes?.[0];

    // Module is locked if previous module's quiz doesn't exist or isn't passed
    return !previousQuiz || previousQuiz.status !== "passed";
  };

  const handleModuleExpand = async (
    moduleId: string,
    currentStatus: string,
    isLocked: boolean
  ) => {
    if (isLocked) return;

    if (currentStatus === ModuleStatus.NOT_STARTED) {
      try {
        await updateModuleStatus({
          variables: {
            moduleId,
            status: ModuleStatus.IN_PROGRESS,
          },
        });
        await refetch();
      } catch (error) {
        console.error("Error updating module status:", error);
      }
    }

    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  // Effect to update module status when quiz is completed
  useEffect(() => {
    const updateModuleStatuses = async () => {
      if (data?.modules) {
        for (const module of data.modules) {
          const quiz = module.quizzes?.[0];
          if (
            quiz?.status === QuizStatus.COMPLETED &&
            module.status !== ModuleStatus.COMPLETED
          ) {
            try {
              await updateModuleStatus({
                variables: {
                  moduleId: module.id,
                  status: ModuleStatus.COMPLETED,
                },
              });
            } catch (error) {
              console.error(
                "Error updating module status after quiz completion:",
                error
              );
            }
          }
        }
      }
    };

    updateModuleStatuses();
  }, [data?.modules, updateModuleStatus]);

  const handleQuizClick = (
    e: React.MouseEvent,
    quizId: string,
    isLocked: boolean
  ) => {
    e.stopPropagation();
    if (isLocked) return;
    navigate(`/quiz/${quizId}`);
  };

  const getQuizButtonText = (quiz: Quiz, isLocked: boolean) => {
    if (isLocked) return "Locked";

    switch (quiz.status) {
      case "passed":
        return "Review Quiz";
      case "failed":
        return "Retry Quiz";
      case "not_attempted":
      default:
        return "Take Quiz";
    }
  };

  if (loading) return <div className="p-4">Loading modules...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">
        Error loading modules: {error.message}
      </div>
    );
  if (!data?.modules || data.modules.length === 0) {
    return <div className="p-4">No modules found for this course.</div>;
  }

  const progress = calculateProgress(data.modules);

  return (
    <div className="space-y-6">
      {/* Overall Progress Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Course Progress
          </h2>
          <div className="text-sm text-gray-600">
            {progress.completedCount} of {progress.totalCount} modules completed
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span
                className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getProgressTextColor(
                  progress.progressPercentage
                )} ${getProgressBarColor(progress.progressPercentage).replace(
                  "bg-",
                  "bg-opacity-20 bg-"
                )}`}
              >
                Progress
              </span>
            </div>
            <div className="text-right">
              <span
                className={`text-xs font-semibold inline-block ${getProgressTextColor(
                  progress.progressPercentage
                )}`}
              >
                {progress.progressPercentage}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
            <div
              style={{ width: `${progress.progressPercentage}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressBarColor(
                progress.progressPercentage
              )} transition-all duration-500`}
            />
          </div>
        </div>
      </div>

      {data.modules.map((module: Module, index: number) => {
        const isExpanded = expandedModules.has(module.id);
        const quiz = module.quizzes?.[0];
        const isLocked = isModuleLocked(index, data.modules);

        return (
          <div
            key={module.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              isLocked ? "opacity-75" : "hover:shadow-lg"
            } transition-shadow duration-200`}
          >
            <div
              className={`flex items-center justify-between ${
                !isLocked && "cursor-pointer"
              }`}
              onClick={() =>
                handleModuleExpand(module.id, module.status, isLocked)
              }
            >
              <div className="flex items-center">
                {isLocked ? (
                  <svg
                    className="w-5 h-5 mr-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 mr-3 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Module {index + 1}: {module.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {new Date(module.created_at).toLocaleDateString()}
                  </p>
                  {isLocked && index > 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      Complete previous module to unlock
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    isLocked
                      ? "bg-gray-100 text-gray-800"
                      : getStatusColor(module.status)
                  }`}
                >
                  {isLocked ? "Locked" : module.status.replace(/_/g, " ")}
                </span>
                {!isLocked && (
                  <svg
                    className={`w-6 h-6 transform transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>
            </div>

            {isExpanded && !isLocked && (
              <div className="mt-6 border-t pt-4 space-y-6">
                {/* Resources Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Resources
                  </h4>
                  {module.resources && module.resources.length > 0 ? (
                    <div className="space-y-2">
                      {module.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center group"
                        >
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center group-hover:translate-x-1 transition-transform"
                          >
                            <svg
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            {resource.title}
                          </a>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(resource.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No resources available for this module.
                    </p>
                  )}
                </div>

                {/* Similar Questions Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Practice Questions
                  </h4>
                  {module.similar_questions &&
                  module.similar_questions.length > 0 ? (
                    <div className="space-y-4">
                      {module.similar_questions.map((question) => (
                        <div
                          key={question.id}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0 mt-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <div className="flex-grow">
                              <p className="text-gray-700">
                                {question.question}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No practice questions available for this module.
                    </p>
                  )}
                </div>

                {/* Quiz Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Quiz
                  </h4>
                  {quiz ? (
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">
                          Cutoff Score: {quiz.cutoff_score}%
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {quiz.status.replace(/_/g, " ")}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleQuizClick(e, quiz.id, isLocked)}
                        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                          isLocked
                            ? "bg-gray-400 cursor-not-allowed"
                            : getQuizStatusColor(quiz.status)
                        }`}
                        disabled={isLocked}
                      >
                        {getQuizButtonText(quiz, isLocked)}
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No quiz available for this module.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ModuleList;
