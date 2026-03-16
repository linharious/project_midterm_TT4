import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job.model';
import { Auth } from '../../../services/auth';
import { SubmitProposalComponent } from '../../proposals/submit-proposal/submit-proposal';
import { ProposalListComponent } from '../../proposals/proposal-list/proposal-list';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, FormsModule, SubmitProposalComponent, ProposalListComponent],
  templateUrl: './job-details.html',
  styleUrl: './job-details.scss',
})
export class JobDetails implements OnInit {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(Auth);

  job: Job | null = null;
  isLoading = true;
  errorMessage = '';

  get currentUserId(): string | undefined {
    return this.auth.getCurrentUser()?.id;
  }

  isEditing = false;
  isSaving = false;
  editFormData = { title: '', description: '', budget: 0, category: '', status: 'open' as any };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadJobDetails(idParam);
    } else {
      this.errorMessage = 'Invalid Job ID provided.';
      this.isLoading = false;
    }
  }

  loadJobDetails(id: string): void {
    this.isLoading = true;
    this.jobService.getJobDetails(id).subscribe({
      next: (data) => {
        this.job = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleEditMode(): void {
    if (!this.job) return;
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editFormData = {
        title: this.job.title,
        description: this.job.description,
        budget: this.job.budget,
        category: this.job.category,
        status: this.job.status
      };
    }
  }

  saveChanges(): void {
    if (!this.job) return;
    this.isSaving = true;
    this.jobService.updateJob(this.job.id, this.editFormData).subscribe({
      next: () => {
        this.isEditing = false;
        this.isSaving = false;
        this.cdr.detectChanges();
        this.router.navigate(['/jobs/my-postings']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  markAsCompleted(): void {
    if (!this.job) return;
    if (confirm('Are you sure you want to mark this project as completed?')) {
      this.jobService.completeJob(this.job.id).subscribe({
        next: () => {
          this.loadJobDetails(this.job!.id);
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.cdr.detectChanges();
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/jobs/search']);
  }
}

