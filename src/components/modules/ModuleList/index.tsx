import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
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
  formatModuleStatus,
} from "./helper";
import { generateSummary } from "@/containers/SummaryReport/summaryIndex";
import { selectSummaryAnalysis } from "@/containers/SummaryReport/summaryIndex";

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
      const userId = localStorage.getItem('userId');
      if (userId) {
        console.log('Dispatching generateSummary action with userId:', userId);
        dispatch(generateSummary(moduleId, moduleReports, userId));
      } else {
        console.error('User ID not found');
      }
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
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Courses
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-700">Course Progress</h2>
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${getProgressTextColor(progress.progressPercentage)}`}>
              {progress.completedCount}/{progress.totalCount} Modules
            </span>
            <span className="text-gray-500">•</span>
            <span className={`font-medium ${getProgressTextColor(progress.progressPercentage)}`}>
              {progress.progressPercentage}% Complete
            </span>
          </div>
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
                <div className="flex flex-col space-y-4">
                  {/* Module Header with Gradient */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                              module.status
                            )}`}
                          >
                            {formatModuleStatus(module.status)}
                          </span>
                          <h3 className="text-lg font-medium text-gray-800">
                            {module.title}
                          </h3>
                        </div>
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <span>Start: {new Date(module.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>End: {new Date(module.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 border-t border-gray-100">
                  <div className="grid gap-6">
                    {module.resources.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">
                          Resources
                        </h4>
                        <ul className="space-y-2">
                          {module.resources.map((resource) => (
                            <li key={resource.id} className="flex items-center">
                              <svg 
                                className="w-4 h-4 text-blue-500 mr-2" 
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
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                {resource.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {module.similar_questions.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">
                          Practice Questions
                        </h4>
                        <ul className="space-y-3">
                          {module.similar_questions.map((question) => (
                            <li key={question.id} className="flex items-start">
                              <svg 
                                className="w-4 h-4 text-gray-400 mr-2 mt-1" 
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
                              <span className="text-gray-600 leading-relaxed">
                                {question.question}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {quiz && (
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={(e) => handleQuizClick(e, quiz.id, isLocked, quiz.status)}
                          className={`px-5 py-2 rounded-md text-white font-medium transition-all duration-200 transform hover:scale-105 ${getQuizStatusColor(
                            quiz.status
                          )}`}
                          disabled={isLocked}
                        >
                          {getQuizButtonText(quiz, isLocked)}
                        </button>
                        {isPassed && !useSelector((state: RootState) => selectSummaryAnalysis(state, module.id)) && (
                          <button
                            onClick={(e) => handleViewSummary(e, module.id, module.quiz_reports)}
                            className="px-5 py-2 rounded-md text-white font-medium bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            View Summary
                          </button>
                        )}
                      </div>
                    )}
                  </div>
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