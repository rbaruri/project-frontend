export interface SyllabusState {
  data: any | null;
  loading: boolean;
  error: string | null;
  uploadedData: any | null;
}

export interface UploadSyllabusPayload {
  file: File;
  formData: FormData;
  courseName: string;
  startDate: string;
  endDate: string;
}

export interface SyllabusResponse {
  id: string;
  courseName: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
  learningPath?: any;
} 