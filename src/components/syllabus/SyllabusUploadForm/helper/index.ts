export const validateFile = (file: File): { isValid: boolean; error: string | null } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["application/pdf"];

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size too large. Maximum size is 10MB."
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Only PDF documents are allowed."
    };
  }

  return {
    isValid: true,
    error: null
  };
};

export const validateFormData = (formData: { courseName: string; startDate: string; endDate: string }): { isValid: boolean; error: string | null } => {
  if (!formData.courseName || !formData.startDate || !formData.endDate) {
    return {
      isValid: false,
      error: "Please fill in all required fields"
    };
  }

  const start = new Date(formData.startDate);
  const end = new Date(formData.endDate);

  if (end <= start) {
    return {
      isValid: false,
      error: "End date must be after start date"
    };
  }

  return {
    isValid: true,
    error: null
  };
};

export const downloadSampleSyllabus = (): void => {
  const link = document.createElement('a');
  link.href = '/assets/sample-syllabus.pdf';
  link.download = 'sample-syllabus.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 