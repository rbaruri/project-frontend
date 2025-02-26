import React from 'react';
import SyllabusUploadForm from '../components/syllabus/SyllabusUploadForm';

const SyllabusUploadPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <SyllabusUploadForm />
      </div>
    </div>
  );
};

export default SyllabusUploadPage;
