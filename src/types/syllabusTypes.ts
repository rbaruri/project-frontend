export interface SyllabusFile {
  file: File;
  preview: string;
}

export interface SyllabusFormData {
  title: string;
  description: string;
  courseId: string;
  file: File | null;
}

export interface SyllabusResponse {
  id: string;
  title: string;
  description: string;
  file_url: string;
  course_id: string;
  created_at: string;
}

export interface SyllabusState {
  loading: boolean;
  error: string | null;
  success: boolean;
  data: SyllabusResponse | null;
  uploadProgress: number;
}

export interface UploadSyllabusPayload {
  formData: FormData;
  courseId: string;
}
