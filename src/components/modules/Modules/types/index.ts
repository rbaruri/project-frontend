export interface Module {
  id: string;
  title: string;
  description: string;
  quiz?: {
    id: string;
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswer: string;
    }>;
  };
}

export interface ModuleState {
  data: Module[];
  loading: boolean;
  error: string | null;
} 