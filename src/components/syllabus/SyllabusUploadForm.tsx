import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/axios';

const SyllabusUploadForm: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    courseName: '',
    startDate: '',
    endDate: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, hasToken: !!token });
    if (!isAuthenticated || !token) {
      console.log('Not authenticated or no token, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [isAuthenticated, token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!file) {
        throw new Error('Please select a syllabus file');
      }

      if (!token) {
        console.error('No auth token found');
        setError('Authentication required. Please log in again.');
        navigate('/login');
        return;
      }

      // Validate file size before uploading (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setError('File size too large. Maximum size is 10MB.');
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only PDF and Word documents are allowed.');
        return;
      }

      console.log('Preparing to upload syllabus:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        courseName: formData.courseName,
        startDate: formData.startDate,
        endDate: formData.endDate
      });

      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('courseName', formData.courseName);
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);

      console.log('Sending request to:', '/api/syllabus/process');
      const response = await api.post('/api/syllabus/process', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Syllabus uploaded successfully:', response.data);
      navigate('/courses');
    } catch (error: any) {
      console.error('Syllabus upload error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Authentication error - clearing token and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      // Handle specific error codes
      const errorCode = error.response?.data?.code;
      const errorField = error.response?.data?.field;
      const errorDetails = error.response?.data?.details;
      const hasuraError = error.response?.data?.hasuraError;

      console.log('Full error response:', {
        code: errorCode,
        field: errorField,
        details: errorDetails,
        hasuraError
      });

      let errorMessage = 'Failed to upload syllabus';

      switch (errorCode) {
        case 'auth-required':
          errorMessage = 'Authentication required. Please log in again.';
          navigate('/login');
          break;
        case 'file-required':
          errorMessage = 'Please select a file to upload.';
          break;
        case 'invalid-file-type':
          errorMessage = 'Invalid file type. Only PDF and Word documents are allowed.';
          break;
        case 'file-too-large':
          errorMessage = 'File size too large. Maximum size is 10MB.';
          break;
        case 'validation-failed':
          if (errorField === 'courseName') {
            errorMessage = 'Please enter a course name.';
          } else if (errorField === 'startDate') {
            errorMessage = errorDetails || 'Please enter a valid start date.';
          } else if (errorField === 'endDate') {
            errorMessage = errorDetails || 'Please enter a valid end date.';
          } else {
            errorMessage = errorDetails || 'Please check all required fields.';
          }
          break;
        case 'ocr-failed':
          errorMessage = 'Failed to process the syllabus file. Please ensure it is a valid document.';
          break;
        case 'ai-generation-failed':
          errorMessage = 'Failed to generate the learning path. Please try again.';
          break;
        case 'course-creation-failed':
          if (hasuraError?.extensions?.code === 'constraint-violation') {
            errorMessage = 'A course with this name already exists. Please choose a different name.';
          } else if (hasuraError?.extensions?.code === 'permission-denied') {
            errorMessage = 'You do not have permission to create courses. Please contact support.';
          } else if (hasuraError?.extensions?.code === 'not-null-violation') {
            errorMessage = `Missing required field: ${hasuraError.extensions.column}`;
          } else {
            errorMessage = errorDetails || 'Failed to create the course. Please try again.';
          }
          break;
        case 'learning-path-creation-failed':
          errorMessage = errorDetails || 'Failed to create the learning path. Please try again.';
          break;
        default:
          errorMessage = errorDetails || error.response?.data?.error || error.message || 'Failed to upload syllabus';
      }
      
      setError(`Error: ${errorMessage}`);
      
      if (errorCode) {
        console.error('Error details:', {
          code: errorCode,
          message: errorMessage,
          details: errorDetails,
          hasuraError
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !token) {
    return null;
  }

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
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.courseName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.endDate}
                onChange={handleChange}
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
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Accepted formats: PDF, DOC, DOCX
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Upload and Process'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SyllabusUploadForm; 