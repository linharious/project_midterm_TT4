import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CreateReviewDto {
  rating: number;
  target_id: string;
}

export interface ReviewResponse {
  id: string;
  job_id: string;
  reviewer_id: string;
  target_id: string;
  rating: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  
  submitReview(jobId: string, data: CreateReviewDto): Observable<any> {
    return this.http.post(`${environment.apiUrl}/jobs/${jobId}/reviews`, data).pipe(
      catchError(error => {
        let errorMessage = 'An unknown error occurred!';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.status === 400) {
          errorMessage = 'Bad Request';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized: Please log in again.';
        } else if (error.status === 403) {
          errorMessage = 'Forbidden: You do not have permission.';
        } else if (error.status === 404) {
          errorMessage = 'Resource not found.';
        } else if (error.status === 409) {
          errorMessage = 'Conflict: You may have already reviewed this user.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getUserReviews(userId: string): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${environment.apiUrl}/reviews/user/${userId}`).pipe(
      catchError(error => {
        return throwError(() => new Error(error?.error?.error || 'Failed to fetch user reviews.'));
      })
    );
  }
}
