import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import Calendar from '../ui/Calendar';
import { useApolloClient } from '@apollo/client';
import { GET_COURSES_WITH_LEARNING_PATHS } from '../../graphql/queries/courses';
import AuthModal from '../ui/AuthModal';
import {
  uploadSyllabusRequest,
  resetSyllabusState,
  selectSyllabusLoading,
  selectSyllabusError,
  selectSyllabusData,
  validateSyllabusFile,
  createSyllabusFormData,
  type SyllabusFormData
} from '../../containers/SyllabusUpload';

const SyllabusUploadForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const client = useApolloClient();

  const loading = useSelector(selectSyllabusLoading);
  const error = useSelector(selectSyllabusError);
  const uploadedData = useSelector(selectSyllabusData);

  const [formData, setFormData] = useState<SyllabusFormData>({
    courseName: '',
    startDate: '',
    endDate: '',
    file: null,
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Reset syllabus state when component unmounts
    return () => {
      dispatch(resetSyllabusState());
    };
  }, [dispatch]);

  useEffect(() => {
    // Navigate to courses page on successful upload
    if (uploadedData) {
      navigate('/courses');
    }
  }, [uploadedData, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateSyllabusFile(file);
      setValidationError(error);
      if (!error) {
        setFormData(prev => ({
          ...prev,
          file
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // If user is not authenticated, show auth modal
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (!formData.file) {
        setValidationError('Please select a syllabus file');
        return;
      }

      const error = validateSyllabusFile(formData.file);
      if (error) {
        setValidationError(error);
        return;
      }

      const formDataToSend = createSyllabusFormData(formData);
      dispatch(uploadSyllabusRequest(formDataToSend));

      // Refetch courses data after successful upload
      await client.refetchQueries({
        include: [GET_COURSES_WITH_LEARNING_PATHS]
      });
    } catch (error: any) {
      setValidationError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Upload Course Syllabus
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create a new course by uploading your syllabus
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <input
                id="courseName"
                name="courseName"
                type="text"
                required
                disabled={loading}
                className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  loading ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                value={formData.courseName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Calendar
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                disabled={loading}
                className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  loading ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <Calendar
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={loading}
                minDate={formData.startDate}
                className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  loading ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700">
                Syllabus File
              </label>
              <input
                id="syllabus"
                name="syllabus"
                type="file"
                required
                disabled={loading}
                accept=".pdf"
                onChange={handleFileChange}
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  loading ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
              <p className="mt-1 text-xs text-gray-500">
                Accepted formats: PDF
              </p>
              {formData.file && (
                <p className={`mt-2 text-sm ${loading ? 'text-gray-500' : 'text-green-600'}`}>
                  Selected file: {formData.file.name}
                </p>
              )}
            </div>
          </div>

          {(error || validationError) && (
            <div className="text-red-500 text-sm text-center">
              {error || validationError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload Syllabus'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default SyllabusUploadForm; 