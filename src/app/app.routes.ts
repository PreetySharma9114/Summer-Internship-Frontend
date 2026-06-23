import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { profileGuard } from './core/guards/profile.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.page').then(
        (m) => m.RegisterPage,
      ),
  },

  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./features/auth/pages/verify-otp/verify-otp.page').then(
        (m) => m.VerifyOtpPage,
      ),
  },

  {
    path: 'create-password',
    loadComponent: () =>
      import(
        './features/auth/pages/create-password/create-password.page'
      ).then((m) => m.CreatePasswordPage),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.page').then(
        (m) => m.LoginPage,
      ),
  },
  {
    path: 'influencer-profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/profile/pages/influencer-profile/influencer-profile.page'
      ).then((m) => m.InfluencerProfilePage),
  },

  {
    path: 'brand-profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/profile/pages/brand-profile/brand-profile.page'
      ).then((m) => m.BrandProfilePage),
  },
  {
    path: '',
    canActivate: [authGuard, profileGuard],

    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/pages/home/home.page').then(
            (m) => m.HomePage,
          ),
      },

      {
        path: 'campaign-list',
        loadComponent: () =>
          import(
            './features/campaign/pages/campaign-list/campaign-list.page'
          ).then((m) => m.CampaignListPage),
      },

      {
        path: 'campaign-details/:id',
        loadComponent: () =>
          import(
            './features/campaign/pages/campaign-details/campaign-details.page'
          ).then((m) => m.CampaignDetailsPage),
      },

      {
        path: 'create-campaign',
        loadComponent: () =>
          import(
            './features/campaign/pages/create-campaign/create-campaign.page'
          ).then((m) => m.CreateCampaignPage),
      },

      {
        path: 'my-campaigns',
        loadComponent: () =>
          import(
            './features/campaign/pages/my-campaigns/my-campaigns.page'
          ).then((m) => m.MyCampaignsPage),
      },

      {
        path: 'my-applications',
        loadComponent: () =>
          import(
            './features/campaign/pages/my-applications/my-applications.page'
          ).then((m) => m.MyApplicationsPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];