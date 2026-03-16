import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProposalService } from '../../../services/proposal.service';

@Component({
  selector: 'app-submit-proposal',
  imports: [CommonModule, FormsModule],
  templateUrl: './submit-proposal.html',
  styleUrl: './submit-proposal.scss'
})
export class SubmitProposalComponent {
  @Input() jobId!: string;
  @Output() proposalSubmitted = new EventEmitter<void>();

  private proposalService = inject(ProposalService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  coverLetter = '';
  price: number | null = null;
  isSubmitting = false;
  errorMessage = '';

  submitProposal(): void {
    if (!this.coverLetter || !this.price || this.price <= 0) {
      this.errorMessage = 'Please provide a valid cover letter and bid amount greater than 0.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      cover_letter: this.coverLetter,
      price: this.price
    };

    this.proposalService.submitProposal(this.jobId, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.coverLetter = '';
        this.price = null;
        this.proposalSubmitted.emit();
        this.cdr.detectChanges();
        this.router.navigate(['/proposals/my-bids']);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
