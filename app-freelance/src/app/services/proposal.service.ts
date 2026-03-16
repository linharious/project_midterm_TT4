import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Proposal, CreateProposalDto } from '../models/proposal.model';
import { environment } from '../../environments/environment';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiUrl = `${environment.apiUrl}/proposals`;

  constructor() {}

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error && error.error.error) {
      errorMessage = error.error.error;
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized: Please log in again.';
    } else if (error.status === 403) {
      errorMessage = 'Forbidden: You do not have permission.';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.';
    }
    return throwError(() => new Error(errorMessage));
  }

  // Freelancer: Submit a proposal
  submitProposal(jobId: string, data: CreateProposalDto): Observable<Proposal> {
    return this.http.post<Proposal>(`${environment.apiUrl}/jobs/${jobId}/proposals`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Job Owner: Get all proposals for their specific job
  getJobProposals(jobId: string): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${environment.apiUrl}/jobs/${jobId}/proposals`).pipe(
      catchError(this.handleError)
    );
  }

  // Job Owner: Accept a proposal
  acceptProposal(proposalId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${proposalId}/accept`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Freelancer: Get all their submitted bids
  getMyBids(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${this.apiUrl}/my-bids`).pipe(
      catchError(this.handleError)
    );
  }

  // Freelancer: Delete/Retract a proposal
  deleteProposal(proposalId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${proposalId}`).pipe(
      catchError(this.handleError)
    );
  }
}
