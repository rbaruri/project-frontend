export interface FormData {
  courseName: string;
  startDate: string;
  endDate: string;
}

export interface SyllabusUploadFormProps {
  loading?: boolean;
  error?: string;
  uploadedData?: any;
  onSubmit: (formData: FormData, file: File) => void;
  onReset: () => void;
} 