import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job.model';
import { Auth } from '../../../services/auth';
import { ProposalService } from '../../../services/proposal.service';
import { SubmitProposalComponent } from '../../proposals/submit-proposal/submit-proposal';
import { ProposalListComponent } from '../../proposals/proposal-list/proposal-list';
import { Reviews } from '../../reviews/reviews';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, FormsModule, SubmitProposalComponent, ProposalListComponent, Reviews],
  templateUrl: './job-details.html',
  styleUrl: './job-details.scss',
})
export class JobDetails implements OnInit {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private proposalService = inject(ProposalService);
  auth = inject(Auth);

  job: Job | null = null;
  isLoading = true;
  errorMessage = '';
  acceptedFreelancerId: string | null = null;
  acceptedFreelancerName: string | null = null;

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
        
        // Failsafe: if the job misses 'assigned_freelancer' but is in-progress/completed, 
        // the owner can find the freelancer simply by looking at the accepted proposal!
        if (this.currentUserId === this.job.owner?.id && (this.job.status === 'in_progress' || this.job.status === 'completed')) {
          this.proposalService.getJobProposals(this.job.id).subscribe({
            next: (proposals) => {
              const accepted = proposals.find(p => p.status === 'accepted');
              if (accepted) {
                this.acceptedFreelancerId = accepted.freelancer_id || (accepted as any).user_id || null;
                this.acceptedFreelancerName = accepted.freelancer?.name || 'Assigned Freelancer';
                this.cdr.detectChanges();
              }
            }
          });
        } else if (this.currentUserId && this.currentUserId !== this.job.owner?.id && (this.job.status === 'in_progress' || this.job.status === 'completed')) {
          // Freelancer failsafe: Check if they have an accepted bid for this job
          this.proposalService.getMyBids().subscribe({
            next: (bids) => {
              const acceptedBid = bids.find(b => b.job_id === this.job!.id && b.status === 'accepted');
              if (acceptedBid) {
                this.acceptedFreelancerId = this.currentUserId!;
                this.cdr.detectChanges();
              }
            }
          });
        }

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

  getReviewTarget(): { id: string; name: string } | null {
    if (!this.job || !this.currentUserId || this.job.status !== 'completed') return null;

    // Check if the current user is the owner
    if (this.currentUserId === this.job.owner?.id) {
      if (this.acceptedFreelancerId) {
        return { id: this.acceptedFreelancerId, name: this.acceptedFreelancerName || 'Freelancer' };
      }
      if (typeof this.job.assigned_freelancer === 'string') {
        return { id: this.job.assigned_freelancer, name: 'Freelancer' };
      } else if (this.job.assigned_freelancer) {
        return { id: this.job.assigned_freelancer.id, name: this.job.assigned_freelancer.name };
      }
    }
    
    // Check if the current user is the assigned freelancer
    const isFreelancer = this.currentUserId === this.acceptedFreelancerId ||
      (typeof this.job.assigned_freelancer === 'string' 
        ? this.currentUserId === this.job.assigned_freelancer 
        : this.currentUserId === this.job.assigned_freelancer?.id);

    if (isFreelancer && this.job.owner) {
      return { id: this.job.owner.id, name: this.job.owner.name };
    }

    return null;
  }
}

