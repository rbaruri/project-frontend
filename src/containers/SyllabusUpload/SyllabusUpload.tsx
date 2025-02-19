import React, { useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadSyllabusRequest, uploadSyllabusFailure } from "./syllabusActions";
import { RootState, AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import SyllabusUploadForm from "../../components/ui/SyllabusUploadForm";

const isValidFile = (file: File): boolean => {
  const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
};

const SyllabusUpload = () => {
  const [formData, setFormData] = useState<{ file: File | null; startDate: string; endDate: string }>({
    file: null,
    startDate: "",
    endDate: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { status, message } = useSelector((state: RootState) => state.syllabus);
  const navigate = useNavigate();

  const isUploading = useMemo(() => status === "uploading", [status]);
  const isDisabled = useMemo(() => !formData.file || !formData.startDate || !formData.endDate || isUploading, [formData, isUploading]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFormData((prev) => ({ ...prev, file: selectedFile }));
    } else {
      dispatch(uploadSyllabusFailure("Please upload a valid PDF or image file (max 10MB)"));
    }
  }, [dispatch]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleUpload = useCallback(() => {
    if (!formData.file || !formData.startDate || !formData.endDate) {
      dispatch(uploadSyllabusFailure("Please select a file and specify the date range"));
      return;
    }

    const data = new FormData();
    data.append("file", formData.file);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);

    dispatch(uploadSyllabusRequest(data));
  }, [dispatch, formData]);

  // Navigate when upload is successful
  React.useEffect(() => {
    if (status === "success") {
      navigate("/learning-path");
    }
  }, [status, navigate]);

  return (
    <SyllabusUploadForm
      formData={formData}
      message={message}
      isUploading={isUploading}
      isDisabled={isDisabled}
      fileInputRef={fileInputRef}
      handleFileSelect={handleFileSelect}
      handleDateChange={handleDateChange}
      handleUpload={handleUpload}
    />
  );
};

export default SyllabusUpload;
