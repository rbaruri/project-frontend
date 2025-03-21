import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SyllabusUploadForm from '@/components/syllabus';
import { uploadSyllabusRequest } from '@/containers/SyllabusUpload/syllabusActions';
import { 
  selectSyllabusLoading, 
  selectSyllabusError,
  selectSyllabusData
} from '@/containers/SyllabusUpload/syllabusSelectors';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/common/AuthModal';

interface FormData {
  courseName: string;
  startDate: string;
  endDate: string;
}

const SyllabusUploadPage: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const loading = useSelector(selectSyllabusLoading);
  const error = useSelector(selectSyllabusError) || undefined;
  const uploadedData = useSelector(selectSyllabusData);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<{formData: FormData, file: File} | null>(null);

  const handleSubmit = (formData: FormData, file: File) => {
    if (!isAuthenticated) {
      setPendingUpload({ formData, file });
      setShowAuthModal(true);
      return;
    }

    processUpload(formData, file);
  };

  const processUpload = (formData: FormData, file: File) => {
    const form = new FormData();
    form.append('file', file);
    form.append('courseName', formData.courseName);
    form.append('startDate', formData.startDate);
    form.append('endDate', formData.endDate);
    
    dispatch(uploadSyllabusRequest({ 
      formData: form,
      courseId: formData.courseName,
      userId: user?.userId || ''
    }));
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setPendingUpload(null);
  };

  const handleAuthSuccess = () => {
    if (pendingUpload && user?.userId) {
      processUpload(pendingUpload.formData, pendingUpload.file);
    }
    setShowAuthModal(false);
    setPendingUpload(null);
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

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default SyllabusUploadPage;
