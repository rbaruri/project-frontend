import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  GET_MODULES_BY_COURSE,
  UPDATE_MODULE_STATUS,
  ModuleStatus,
} from "@/graphql/queries/modules";
import { ModuleListProps, Module, QuizStatus } from "./types";
import { QuizSummaryReport } from "@/summary/types";
import {
  getStatusColor,
  getQuizStatusColor,
  getProgressBarColor,
  getProgressTextColor,
  calculateProgress,
  isModuleLocked,
  getQuizButtonText,
} from "./helper";
import { generateModuleSummary } from "@/redux/actions/summary";

const ModuleList: React.FC<ModuleListProps> = ({ courseId }) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, data, refetch } = useQuery(GET_MODULES_BY_COURSE, {
    variables: { courseId },
    fetchPolicy: "network-only",
    pollInterval: 5000,
  });

  const [updateModuleStatus] = useMutation(UPDATE_MODULE_STATUS);

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

  const handleQuizClick = (
    e: React.MouseEvent,
    quizId: string,
    isLocked: boolean,
    quizStatus: string
  ) => {
    e.stopPropagation();
    if (isLocked) return;
    
    const isReview = quizStatus === 'passed';
    navigate(`/quiz/${quizId}${isReview ? '?mode=review&showResults=true' : ''}`);
  };

  const handleViewSummary = (
    e: React.MouseEvent,
    moduleId: string,
    moduleReports: QuizSummaryReport[] | undefined
  ) => {
    e.stopPropagation();
    console.log('View Summary clicked:', { moduleId, moduleReports });
    if (moduleReports) {
      console.log('Dispatching generateModuleSummary action');
      dispatch(generateModuleSummary(moduleId, moduleReports));
    } else {
      console.log('No module reports available');
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        Error loading modules: {error.message}
      </div>
    );
  }

  const modules = data?.modules || [];
  const progress = calculateProgress(modules);

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Course Progress</h2>
          <span className={`font-medium ${getProgressTextColor(progress.progressPercentage)}`}>
            {progress.completedCount}/{progress.totalCount} Modules
          </span>
        </div>
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-500 ${getProgressBarColor(
              progress.progressPercentage
            )}`}
            style={{ width: `${progress.progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((module: Module, index: number) => {
          const isLocked = isModuleLocked(index, modules);
          const isExpanded = expandedModules.has(module.id);
          const quiz = module.quizzes[0];
          const isPassed = quiz?.status === 'passed';

          return (
            <div
              key={module.id}
              className={`bg-white rounded-lg shadow transition-all duration-300 ${
                isLocked ? "opacity-50" : "hover:shadow-lg"
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => handleModuleExpand(module.id, module.status, isLocked)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                        module.status
                      )}`}
                    >
                      {module.status}
                    </span>
                    <h3 className="text-lg font-medium text-gray-800">
                      {module.title}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    {isPassed && (
                      <button
                        onClick={(e) => handleViewSummary(e, module.id, module.quiz_reports)}
                        className="px-4 py-2 rounded-md text-white font-medium bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        View Summary
                      </button>
                    )}
                    {quiz && (
                      <button
                        onClick={(e) => handleQuizClick(e, quiz.id, isLocked, quiz.status)}
                        className={`px-4 py-2 rounded-md text-white font-medium ${getQuizStatusColor(
                          quiz.status
                        )}`}
                        disabled={isLocked}
                      >
                        {getQuizButtonText(quiz, isLocked)}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-t">
                  {module.resources.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Resources</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {module.resources.map((resource) => (
                          <li key={resource.id}>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {resource.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {module.similar_questions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Practice Questions
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {module.similar_questions.map((question) => (
                          <li key={question.id} className="text-gray-600">
                            {question.question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleList; 