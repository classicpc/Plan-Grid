export type Priority = 'low' | 'medium' | 'high';
export type Column = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Column;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
}