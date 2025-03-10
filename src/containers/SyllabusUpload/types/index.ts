export interface UploadSyllabusPayload {
  formData: FormData;
  courseId: string;
  userId: string;
}

export interface SyllabusModule {
  title: string;
  description: string;
  duration: string;
  startDate: string;
  endDate: string;
  hoursRequired: string;
  resources?: {
    sources: Array<{ name: string; url: string }>;
    similarQuestions: string[];
  };
}

export interface SyllabusResponse {
  courseId: string;
  userId: string;
  modules: SyllabusModule[];
  status: 'success' | 'error';
  message?: string;
}

export interface SyllabusState {
  data: SyllabusResponse | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
} 