import { UserSummary } from './job.model';

export type ProposalStatus = 'pending' | 'accepted' | 'rejected';

export interface Proposal {
  id: string;
  job_id: string;
  freelancer_id: string;
  cover_letter: string;
  price: number;
  status: ProposalStatus;
  created_at: string;
  freelancer?: UserSummary; // Populated by GET requests where applicable
}

export interface CreateProposalDto {
  cover_letter: string;
  price: number;
}
