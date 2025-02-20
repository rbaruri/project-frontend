import React from 'react';
import CoursesContainer from '../containers/Courses/Courses';

const CoursesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-l font-bold text-gray-800 mb-8 px-6">My Courses</h1>
      <CoursesContainer />
    </div>
  );
};

export default CoursesPage;