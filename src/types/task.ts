export interface UserMinimal {
  UserId: number;
  Username: string;
}

export interface Task {
  TaskId: number;
  Title: string;
  Description?: string | null;
  Status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  Priority?: string;
  DueDate?: string;
  AssignedTo?: number;
  AssignedUserName?: string;
  ProjectId: number;
  CreatedAt?: string;
}