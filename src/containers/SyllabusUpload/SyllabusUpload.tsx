import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadSyllabusRequest, uploadSyllabusFailure } from "./syllabusActions";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import SyllabusUploadForm from "../../components/ui/SyllabusUploadForm";
import { selectSyllabusStatus, selectSyllabusMessage } from "./syllabusSelectors";

const isValidFile = (file: File): boolean => {
  const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
};

const SyllabusUpload = () => {
  const [formData, setFormData] = useState<{ 
    file: File | null; 
    courseName: string;
    startDate: string; 
    endDate: string;
  }>({
    file: null,
    courseName: "",
    startDate: "",
    endDate: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigationAttempted = useRef(false);
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectSyllabusStatus);
  const message = useSelector(selectSyllabusMessage);
  const navigate = useNavigate();

  const isUploading = useMemo(() => status === "uploading", [status]);
  const isDisabled = useMemo(
    () => !formData.file || !formData.courseName || !formData.startDate || !formData.endDate || isUploading,
    [formData, isUploading]
  );

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFormData((prev) => ({ ...prev, file: selectedFile }));
    } else {
      dispatch(uploadSyllabusFailure("Please upload a valid PDF or image file (max 10MB)"));
    }
  }, [dispatch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleUpload = useCallback(() => {
    if (!formData.file || !formData.courseName || !formData.startDate || !formData.endDate) {
      dispatch(uploadSyllabusFailure("Please fill in all required fields"));
      return;
    }

    const data = new FormData();
    data.append("file", formData.file);
    data.append("courseName", formData.courseName);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);

    navigationAttempted.current = false;
    dispatch(uploadSyllabusRequest(data));
  }, [dispatch, formData]);

  // Single effect for handling navigation
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const handleNavigation = () => {
      if (status === "success" && !navigationAttempted.current && mounted) {
        navigationAttempted.current = true;
        timeoutId = setTimeout(() => {
          if (mounted) {
            navigate("/courses");
          }
        }, 100); // Small delay to prevent rapid navigation
      }
    };

    handleNavigation();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [status, navigate]);

  return (
    <SyllabusUploadForm
      formData={formData}
      message={message}
      isUploading={isUploading}
      isDisabled={isDisabled}
      fileInputRef={fileInputRef}
      handleFileSelect={handleFileSelect}
      handleInputChange={handleInputChange}
      handleUpload={handleUpload}
    />
  );
};

export default SyllabusUpload;
