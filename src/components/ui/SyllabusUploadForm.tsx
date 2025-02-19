import React from "react";
import Card from "../ui/Card";
import Calendar from "../ui/Calendar";
import Button from "../ui/Button";

interface SyllabusUploadFormProps {
  formData: { file: File | null; startDate: string; endDate: string };
  message: string | null;
  isUploading: boolean;
  isDisabled: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
}

const SyllabusUploadForm: React.FC<SyllabusUploadFormProps> = ({
  formData,
  message,
  isUploading,
  isDisabled,
  fileInputRef,
  handleFileSelect,
  handleDateChange,
  handleUpload,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-6 lg:px-0">
      <Card>
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} />
        <Calendar 
          label="Start Date"
          name="startDate" 
          value={formData.startDate} 
          onChange={handleDateChange} 
        />
        <Calendar 
          label="End Date"
          name="endDate" 
          value={formData.endDate} 
          onChange={handleDateChange} 
        />
        <Button onClick={handleUpload} disabled={isDisabled}>
          {isUploading ? "Uploading..." : "Upload Syllabus"}
        </Button>
        {message && <p className="mt-2 text-red-500 text-center">{message}</p>}
      </Card>
    </div>
  );
};

export default SyllabusUploadForm;
