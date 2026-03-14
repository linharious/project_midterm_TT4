export type JobStatus = 'open' | 'in_progress' | 'completed';

export interface UserSummary {
  id: string;
  name: string;
  username: string;
  rating_avg: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: JobStatus;
  user_id: string;
  created_at: string;
  owner?: UserSummary;
  assigned_freelancer?: UserSummary;
}

export interface JobSearchFilters {
  category?: string;
  status?: JobStatus | '';
  min_budget?: number;
}

export interface CreateJobDto {
  title: string;
  description: string;
  budget: number;
  category: string;
}

export interface UpdateJobDto {
  title?: string;
  description?: string;
  budget?: number;
  category?: string;
  status?: JobStatus;
}
