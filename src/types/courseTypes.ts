export type ModuleStatus = 'not_started' | 'in_progress' | 'completed';

export interface Module {
  id: string;
  title: string;
  status: ModuleStatus;
}

export interface Course {
  id: string;
  name: string;
  modules: Module[];
  created_at: string;
} 