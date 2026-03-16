import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Input, Output, EventEmitter, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { ReviewService, CreateReviewDto } from '../../services/review.service';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews implements OnInit {
  @Input() jobId!: string;
  @Input() targetId!: string;
  @Input() targetName!: string;
  @Output() reviewSubmitted = new EventEmitter<void>();

  private reviewService = inject(ReviewService);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(Auth);

  rating: number | null = null;

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    const currentUserId = this.auth.getCurrentUser()?.id;
    if (currentUserId && this.targetId) {
      this.reviewService.getUserReviews(this.targetId).subscribe({
        next: (reviews) => {
          const hasReviewed = reviews.some(r => r.job_id === this.jobId && r.reviewer_id === currentUserId);
          if (hasReviewed) {
            this.successMessage = 'Review posted!';
            this.cdr.detectChanges();
          }
        }
      });
    }
  }

  submitReview(): void {
    if (!this.rating) {
      this.errorMessage = 'Please select a rating.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const data: CreateReviewDto = {
      target_id: this.targetId,
      rating: this.rating,
    };

    this.reviewService.submitReview(this.jobId, data).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Review posted!';
        this.reviewSubmitted.emit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.message.includes('already reviewed')) {
          this.successMessage = 'Review posted!';
          this.errorMessage = '';
        } else {
          this.errorMessage = err.message;
        }
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}
