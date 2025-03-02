import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_COURSE_NAME, DELETE_COURSE, GET_COURSES_WITH_LEARNING_PATHS } from "@/graphql/queries/courses";
import { CourseCardProps } from './types';
import { formatDate, getProgressBarWidth, validateCourseName } from './helper';

const CourseCard: React.FC<CourseCardProps> = ({ course, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(course.course_name);

  const [updateCourseName] = useMutation(UPDATE_COURSE_NAME, {
    refetchQueries: [{ query: GET_COURSES_WITH_LEARNING_PATHS, variables: { userId } }],
  });

  const [deleteCourse] = useMutation(DELETE_COURSE, {
    refetchQueries: [{ query: GET_COURSES_WITH_LEARNING_PATHS, variables: { userId } }],
  });

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCourseName(newName)) return;

    try {
      await updateCourseName({
        variables: {
          courseId: course.id,
          name: newName,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating course name:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse({
          variables: {
            courseId: course.id,
          },
        });
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const getDurationText = (duration: { value: number; unit: 'days' | 'weeks' }) => {
    return `${duration.value} ${duration.unit}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {isEditing ? (
            <form onSubmit={handleUpdateName} onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="mt-2 space-x-2">
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setNewName(course.course_name);
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {course.course_name}
              <button
                onClick={() => setIsEditing(true)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </h3>
          )}
          <p className="text-sm text-gray-500">
            Duration: {getDurationText(course.total_duration)}
          </p>
          <p className="text-sm text-gray-500">
            {course.hours_per_week} hours/week
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">
              Start: {formatDate(course.start_date)}
            </p>
            <p className="text-sm text-gray-600">
              End: {formatDate(course.end_date)}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 rounded-full h-2 transition-all duration-300"
            style={{ width: getProgressBarWidth(course.progress) }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 