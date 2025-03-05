export interface Module {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface Course {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  learning_paths: Array<{
    id: string;
    generated_path: any;
    created_at: string;
  }>;
  modules: Module[];
}

export interface GetCoursesData {
  courses: Course[];
} 