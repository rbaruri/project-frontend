import React, { useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadSyllabusRequest, uploadSyllabusFailure, SyllabusActionTypes } from "./syllabusActions";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import SyllabusUploadForm from "../../components/ui/SyllabusUploadForm";
import { Dispatch } from "redux";

const isValidFile = (file: File, dispatch: Dispatch<SyllabusActionTypes>): boolean => {
  const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    dispatch(uploadSyllabusFailure("Please upload a PDF or image file"));
    return false;
  }
  if (file.size > 10 * 1024 * 1024) {
    dispatch(uploadSyllabusFailure("File size should be less than 10MB"));
    return false;
  }
  return true;
};

const SyllabusUpload = () => {
  const [formData, setFormData] = useState<{ file: File | null; startDate: string; endDate: string }>({
    file: null,
    startDate: "",
    endDate: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const dispatch = useDispatch<Dispatch<SyllabusActionTypes>>();
  const { status, message } = useSelector((state: RootState) => state.syllabus);
  const navigate = useNavigate();

  const isUploading = useMemo(() => status === "uploading", [status]);
  const isDisabled = useMemo(() => !formData.file || !formData.startDate || !formData.endDate || isUploading, [formData, isUploading]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile, dispatch)) {
      setFormData((prev) => ({ ...prev, file: selectedFile }));
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
