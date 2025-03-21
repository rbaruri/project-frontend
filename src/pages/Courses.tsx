import React from 'react';
import CoursesContainer from '@/components/courses/Courses';

const CoursesPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-purple-100">Explore your courses and track your progress</p>
        </div>

        {/* Courses Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <CoursesContainer />
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;