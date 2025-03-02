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
  onClick: () => void;
}

export interface CourseCardProps {
  course: Course;
  userId: number;
} 