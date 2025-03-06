import React, { useState, useEffect, useMemo } from "react";
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
import { QuizSummaryReport } from "@/containers/SummaryReport/summaryConstants";
import {
  getStatusColor,
  getQuizStatusColor,
  getProgressBarColor,
  getProgressTextColor,
  calculateProgress,
  isModuleLocked,
  getQuizButtonText,
  formatModuleStatus,
  formatDate,
  formatHours,
} from "./helper";
import { SummaryDisplay } from "@/components/quiz/SummaryReport";
import { useSummary } from "@/hooks/useSummary";

const ModuleList: React.FC<ModuleListProps> = ({ courseId }) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [selectedModule, setSelectedModule] = useState<{id: string, title: string} | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, data, refetch } = useQuery(GET_MODULES_BY_COURSE, {
    variables: { courseId },
    fetchPolicy: "network-only",
    pollInterval: 5000,
  });

  const [updateModuleStatus] = useMutation(UPDATE_MODULE_STATUS);

  // Get all summaries for the modules
  const modulesSummaries = useSelector((state: RootState) => state.summary.analyses);

  const { isLoading, error: summaryError, analysis, generateAnalysis } = useSummary();

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

  const handleViewSummary = async (
    e: React.MouseEvent,
    moduleId: string,
    moduleTitle: string,
    moduleReports: QuizSummaryReport[] | undefined
  ) => {
    e.stopPropagation();
    if (moduleReports) {
      setSelectedModule({ id: moduleId, title: moduleTitle });
      setShowSummary(true);
      await generateAnalysis(moduleReports);
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setSelectedModule(null);
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

              // Clean up local storage for the completed module's quiz
              if (quiz.id) {
                // Remove quiz-related data
                localStorage.removeItem(`quiz_${quiz.id}_summary`);
                localStorage.removeItem(`quiz_${quiz.id}_time`);
                localStorage.removeItem(`quiz_${quiz.id}_timestamp`);
                localStorage.removeItem(`quiz_${quiz.id}_start_time`);
                localStorage.removeItem(`quiz_${quiz.id}_expired`);
                localStorage.removeItem(`quiz_${quiz.id}_answers`);
                localStorage.removeItem(`quiz_${quiz.id}_submitted`);
                localStorage.removeItem(`quiz_${quiz.id}_score`);
                localStorage.removeItem(`quiz_${quiz.id}_time_taken`);
                localStorage.removeItem(`quiz_${quiz.id}_show_results`);
                localStorage.removeItem(`quiz_${quiz.id}_attempts`);

                // Clean up module reports
                const savedReports = localStorage.getItem('all_module_quiz_reports');
                if (savedReports) {
                  try {
                    const reports = JSON.parse(savedReports);
                    if (reports[module.id]) {
                      delete reports[module.id];
                      localStorage.setItem('all_module_quiz_reports', JSON.stringify(reports));
                    }
                  } catch (e) {
                    console.error('Error parsing module reports:', e);
                  }
                }
              }
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

      {showSummary && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={handleCloseSummary}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SummaryDisplay
              analysis={analysis}
              isLoading={isLoading}
              error={summaryError}
              moduleName={selectedModule.title}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {modules.map((module: Module, index: number) => {
          const isLocked = isModuleLocked(index, modules);
          const isExpanded = expandedModules.has(module.id);
          const quiz = module.quizzes[0];
          const isPassed = quiz?.status === 'passed';
          const hasSummary = Boolean(modulesSummaries[module.id]);
          const showSummaryButton = quiz?.score < quiz?.cutoff_score && !hasSummary;

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
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Start: {formatDate(module.start_date)}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>End: {formatDate(module.end_date)}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatHours(module.hours_allocated)}</span>
                          </div>
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
                      <div className="flex items-center justify-center space-x-3">
                        <div className="flex items-center space-x-3">
                          {quiz.status === 'passed' && (
                            <span className="text-green-600 font-medium">
                              Well done! You've completed this quiz
                            </span>
                          )}
                          {quiz.status === 'failed' && (
                            <span className="text-red-600 font-medium">
                              Keep trying! You can do it
                            </span>
                          )}
                          {(quiz.status === 'not_attempted' || !quiz.status) && !isLocked && (
                            <>
                              {localStorage.getItem(`quiz_${quiz.id}_answers`) ? (
                                <span className="text-orange-600 font-medium">
                                  You have an unfinished quiz. Continue where you left off!
                                </span>
                              ) : (
                                <span className="text-blue-600 font-medium">
                                  Ready to test your knowledge?
                                </span>
                              )}
                            </>
                          )}
                          {isLocked && (
                            <span className="text-gray-600 font-medium">
                              Complete previous module to unlock
                            </span>
                          )}
                          <button
                            onClick={(e) => handleQuizClick(e, quiz.id, isLocked, quiz.status)}
                            className={`px-5 py-2 rounded-md text-white font-medium transition-all duration-200 transform hover:scale-105 ${getQuizStatusColor(
                              quiz.status
                            )}`}
                            disabled={isLocked}
                          >
                            {getQuizButtonText(quiz, isLocked)}
                          </button>
                        </div>
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