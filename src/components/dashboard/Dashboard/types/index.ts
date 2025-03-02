import { Course } from '@/types/courseTypes';

export interface DashboardProps {
  firstName: string;
  email: string;
  onLogout: () => void;
  userId: string;
}

export interface DashboardStats {
  coursesInProgress: number;
  completedCourses: number;
  overallProgress: number;
} 