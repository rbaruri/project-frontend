import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SyllabusUploadForm from '../components/syllabus/SyllabusUploadForm';
import { uploadSyllabusRequest } from '../containers/SyllabusUpload/syllabusActions';
import { 
  selectSyllabusLoading, 
  selectSyllabusError,
  selectSyllabusData
} from '../containers/SyllabusUpload/syllabusSelectors';

interface FormData {
  courseName: string;
  startDate: string;
  endDate: string;
}

const SyllabusUploadPage: React.FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectSyllabusLoading);
  const error = useSelector(selectSyllabusError) || undefined;
  const uploadedData = useSelector(selectSyllabusData);

  const handleSubmit = (formData: FormData, file: File) => {
    const form = new FormData();
    
    // Append all form data to FormData object
    form.append('file', file);
    form.append('courseName', formData.courseName);
    form.append('startDate', formData.startDate);
    form.append('endDate', formData.endDate);
    
    dispatch(uploadSyllabusRequest({ 
      formData: form,
      courseId: formData.courseName // Using courseName as courseId since we don't have a separate courseId
    }));
  };

  const handleReset = () => {
    // Empty function for now, can be implemented if needed
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <SyllabusUploadForm
            loading={loading}
            error={error}
            uploadedData={uploadedData}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default SyllabusUploadPage;
