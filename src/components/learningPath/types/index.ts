export interface Module {
  id: string;
  title: string;
  description: string;
}

export interface LearningPath {
  modules: Module[];
  progress: number;
  courseName?: string;
}

export interface LearningPathState {
  data: LearningPath | null;
  loading: boolean;
  error: string | null;
} 