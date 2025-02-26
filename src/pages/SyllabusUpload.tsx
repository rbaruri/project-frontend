import React from 'react';
import SyllabusUploadForm from '../components/syllabus/SyllabusUploadForm';

const SyllabusUploadPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <SyllabusUploadForm />
        </div>
      </div>
    </div>
  );
};

export default SyllabusUploadPage;
