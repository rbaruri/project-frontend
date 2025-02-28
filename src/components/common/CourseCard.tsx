import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_COURSE_NAME, DELETE_COURSE, GET_COURSES_WITH_LEARNING_PATHS } from "@/graphql/queries/courses";

interface Course {
  id: string;
  course_name: string;
  total_duration: number;
  total_hours: number;
  hours_per_week: number;
  start_date: string;
  end_date: string;
  progress: number;
  onClick: () => void;
}

interface CourseCardProps {
  course: Course;
  userId: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(course.course_name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const startDate = new Date(course.start_date);
  const endDate = new Date(course.end_date);

  const [updateCourseName] = useMutation(UPDATE_COURSE_NAME, {
    refetchQueries: [
      {
        query: GET_COURSES_WITH_LEARNING_PATHS,
        variables: { userId }
      }
    ]
  });

  const [deleteCourse] = useMutation(DELETE_COURSE, {
    refetchQueries: [
      {
        query: GET_COURSES_WITH_LEARNING_PATHS,
        variables: { userId }
      }
    ]
  });

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === "") return;
    
    try {
      await updateCourseName({
        variables: {
          id: course.id,
          name: newName.trim()
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating course name:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCourse({
        variables: {
          id: course.id
        }
      });
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
      onClick={course.onClick}
    >
      <div className="p-6">
        {/* Course Name - Editable */}
        <div className="flex justify-between items-start mb-3">
          {isEditing ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleUpdateName(e);
            }} className="flex-1 mr-2" onClick={e => e.stopPropagation()}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onClick={e => e.stopPropagation()}
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={e => e.stopPropagation()}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewName(course.course_name);
                    setIsEditing(false);
                  }}
                  className="text-sm px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-800">{course.course_name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="text-gray-600 hover:text-blue-600"
                  title="Edit course name"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                  className="text-gray-600 hover:text-red-600"
                  title="Delete course"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
              <h4 className="text-lg font-semibold mb-4">Delete Course</h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{course.course_name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Course Progress</span>
            <span>{Math.round(course.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Course Details */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{course.total_duration} weeks • {course.hours_per_week} hours/week</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Total: {course.total_hours} hours</span>
          </div>
        </div>

        {/* View Details Button */}
        <button 
          className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={(e) => {
            e.stopPropagation();
            course.onClick();
          }}
        >
          View Learning Path
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
