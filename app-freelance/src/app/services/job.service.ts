import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Job, JobSearchFilters, CreateJobDto, UpdateJobDto } from '../models/job.model';
import { environment } from '../../environments/environment';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor() {}

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.name === 'TimeoutError') {
      errorMessage = 'The server took too long to respond (5 seconds). Please try again later.';
    } else if (error.error && error.error.error) {
      errorMessage = error.error.error;
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized: Please log in again.';
    } else if (error.status === 403) {
      errorMessage = 'Forbidden: You do not have permission to perform this action.';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.';
    }
    
    return throwError(() => new Error(errorMessage));
  }

  searchJobs(filters: JobSearchFilters): Observable<Job[]> {
    return this.http.post<Job[]>(`${this.apiUrl}/search`, filters).pipe(
      timeout(5000),
      catchError((err) => this.handleError(err))
    );
  }

  createJob(jobData: CreateJobDto): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, jobData).pipe(
      catchError(this.handleError)
    );
  }

  getJobDetails(jobId: string): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${jobId}`).pipe(
      catchError(this.handleError)
    );
  }

  updateJob(jobId: string, updates: UpdateJobDto): Observable<Job> {
    return this.http.patch<Job>(`${this.apiUrl}/${jobId}`, updates).pipe(
      catchError(this.handleError)
    );
  }

  getMyPostings(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/my-postings`).pipe(
      catchError(this.handleError)
    );
  }

  completeJob(jobId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${jobId}/complete`, {}).pipe(
      catchError(this.handleError)
    );
  }
}
