export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  imageUrl?: string;
}

export interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
} 