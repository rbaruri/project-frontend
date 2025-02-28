import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../common/Calendar";

// Temporary type definitions until we create the proper types file
interface FormData {
  courseName: string;
  startDate: string;
  endDate: string;
}

interface SyllabusUploadFormProps {
  loading?: boolean;
  error?: string;
  uploadedData?: any;
  onSubmit: (formData: FormData, file: File) => void;
  onReset: () => void;
}

const SyllabusUploadForm: React.FC<SyllabusUploadFormProps> = ({
  loading,
  error: serverError,
  uploadedData,
  onSubmit,
  onReset
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    courseName: "",
    startDate: "",
    endDate: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset form state when component unmounts
    return () => {
      onReset();
    };
  }, [onReset]);

  useEffect(() => {
    // Navigate to courses page on successful upload
    if (uploadedData) {
      navigate('/courses');
    }
  }, [uploadedData, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Validate file size and type
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setError("");
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["application/pdf"];

    if (file.size > maxSize) {
      setError("File size too large. Maximum size is 10MB.");
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only PDF documents are allowed.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!file || !formData.courseName || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      onSubmit(formData, file);
    } catch (error) {
      console.error("Form submission error:", error);
      setError("An error occurred while uploading the syllabus");
    }
  };

  const displayError = error || serverError;

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">Upload Your Syllabus</h1>
        <p className="text-blue-100 text-lg">
          Get personalized learning recommendations based on your syllabus
        </p>
      </div>

      {/* Sample PDF Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-xs space-y-1">
            <h3 className="text-sm font-medium text-blue-800 mb-1">
              Not sure about the format?
            </h3>
            <p className="text-s text-blue-600">
              Check out our{" "}
              <a
                href="/sample-syllabus.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline hover:text-blue-800 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    "https://drive.google.com/file/d/1QgtxhzR_Kk1B6Qf9x4PL4xh5RqfOGHEw/view?usp=sharing",
                    "_blank"
                  );
                }}
              >
                sample syllabus
              </a>{" "}
              to understand the expected format. Your syllabus should include
              course details, learning objectives, and weekly topics.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Syllabus
            </label>
            <div
              className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-2 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf"
                      disabled={loading}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
                {file && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Course Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="courseName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Course Name
            </label>
            <input
              id="courseName"
              name="courseName"
              type="text"
              required
              disabled={loading}
              value={formData.courseName}
              onChange={handleChange}
              placeholder="Enter course name"
              className={`w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                loading ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Date Range Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Calendar
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  loading ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div className="space-y-2">
              <Calendar
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={loading}
                minDate={formData.startDate}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  loading ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>

          {displayError && (
            <div className="text-red-500 text-sm text-center p-4 bg-red-50 rounded-md">
              {displayError}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col items-center pt-4">
            <button
              type="submit"
              disabled={loading || !file || !formData.courseName || !formData.startDate || !formData.endDate}
              className={`w-full md:w-auto px-8 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-sm ${
                loading || !file || !formData.courseName || !formData.startDate || !formData.endDate
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                "Upload Syllabus"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SyllabusUploadForm;
