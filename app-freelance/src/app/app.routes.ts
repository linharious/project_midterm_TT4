import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Jobs } from './components/jobs/jobs';

import { JobSearch } from './features/jobs/job-search/job-search';
import { CreateJob } from './features/jobs/create-job/create-job';
import { MyPostings } from './features/jobs/my-postings/my-postings';
import { JobDetails } from './features/jobs/job-details/job-details';
import { MyBidsComponent } from './features/proposals/my-bids/my-bids';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { 
    path: 'jobs', 
    component: Jobs,
    children: [
      { path: '', redirectTo: 'search', pathMatch: 'full' },
      { path: 'search', component: JobSearch },
      { path: 'create', component: CreateJob, canActivate: [authGuard] },
      { path: 'my-postings', component: MyPostings, canActivate: [authGuard] },
      { path: ':id', component: JobDetails }
    ]
  },
  { path: 'proposals/my-bids', component: MyBidsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
