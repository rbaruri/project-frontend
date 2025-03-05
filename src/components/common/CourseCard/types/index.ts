export interface Module {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface Course {
  id: string;
  course_name: string;
  total_duration: {
    value: number;
    unit: 'days' | 'weeks';
  };
  total_hours: number;
  hours_per_week: number;
  start_date: string;
  end_date: string;
  progress: number;
  modules: Module[];
}

export interface CourseCardProps {
  course: Course;
  userId: number;
  onClick: () => void;
  onViewModules: () => void;
} 