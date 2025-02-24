import React from "react";
import Card from "../ui/Card";
import Calendar from "../ui/Calendar";
import Button from "../ui/Button";

interface SyllabusUploadFormProps {
  formData: {
    file: File | null;
    courseName: string;
    startDate: string;
    endDate: string;
  };
  message: string | null;
  isUploading: boolean;
  isDisabled: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
}

const SyllabusUploadForm: React.FC<SyllabusUploadFormProps> = ({
  formData,
  message,
  isUploading,
  isDisabled,
  fileInputRef,
  handleFileSelect,
  handleInputChange,
  handleUpload,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Upload Your Syllabus</h1>
        <p className="text-blue-100">Get personalized learning recommendations based on your syllabus</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Syllabus</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
              <div className="space-y-1 text-center">
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
                <div className="flex text-sm text-gray-600">
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
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF upto 10MB</p>
                {formData.file && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {formData.file.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Course Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              placeholder="Enter course name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Date Range Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <Calendar
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <Calendar
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={handleUpload}
              disabled={isDisabled}
              className={`w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                isDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                'Upload Syllabus'
              )}
            </Button>
            {message && (
              <p className={`text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusUploadForm;
