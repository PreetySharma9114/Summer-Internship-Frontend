import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

import { Component, DestroyRef, OnInit, inject } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActivatedRoute } from '@angular/router';

import { IonContent, IonButton, IonChip, IonProgressBar } from '@ionic/angular/standalone';

import { AuthService } from '../../../../core/services/auth.service';
import { CampaignService } from '../../../../core/services/campaign.service';
import { ApplicationService } from '../../../../core/services/application.service';
import { ToastService } from '../../../../core/services/toast.service';

import { Campaign } from '../../../../shared/interfaces/campaign.interface';
import { Application } from '../../../../shared/interfaces/application.interface';

import { ApplicationStatus } from '../../../../shared/enums/application-status.enum';

import { getErrorMessage } from '../../../../shared/helpers/error-message.helper';

@Component({
  selector: 'app-campaign-details',

  standalone: true,

  templateUrl: './campaign-details.page.html',

  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonChip,
    IonProgressBar,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
  ],
})
export class CampaignDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);

  private authService = inject(AuthService);

  private campaignService = inject(CampaignService);

  private applicationService = inject(ApplicationService);

  private toastService = inject(ToastService);

  private destroyRef = inject(DestroyRef);

  user = this.authService.getCurrentUser();

  campaign?: Campaign;

  applications: Application[] = [];

  loading = true;

  isBrandOwner = false;

  applied = false;

  protected readonly applicationStatus = ApplicationStatus;

  ngOnInit(): void {
    this.listenToCampaignState();

    this.listenToApplicationsState();

    this.loadCampaign();
  }

  private listenToCampaignState(): void {
    this.campaignService.selectedCampaign$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((campaign) => {
        this.campaign = campaign ?? undefined;

        if (campaign && this.user) {
          this.isBrandOwner = this.user.role === 'BRAND';

          this.loading = false;
        }
      });
  }

  private listenToApplicationsState(): void {
    this.applicationService.campaignApplications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((applications) => {
        this.applications = applications;
      });
  }

  private loadCampaign(): void {
    const campaignId = this.route.snapshot.paramMap.get('id');

    if (!campaignId) {
      this.loading = false;

      return;
    }

    this.loading = true;

    this.campaignService
      .getCampaignById(campaignId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.loading = false;
        },
      });
  }

  applyToCampaign(): void {
    if (!this.campaign) {
      return;
    }

    this.applicationService
      .applyToCampaign(this.campaign._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async (response) => {
          this.applied = true;

          await this.toastService.showSuccessToast(response.message);
        },

        error: async (error) => {
          await this.toastService.showErrorToast(getErrorMessage(error, 'Failed to apply'));
        },
      });
  }

  viewApplications(): void {
    if (!this.campaign) {
      return;
    }

    this.applicationService
      .getCampaignApplications(this.campaign._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: async (error) => {
          await this.toastService.showErrorToast(
            getErrorMessage(error, 'Failed to load applications'),
          );
        },
      });
  }
  getApplicantName(application: Application): string {
  if (typeof application.influencerId === 'object') {
    return (
      application.influencerId.fullName ||
      'Unknown Influencer'
    );
  }

  return application.influencerId;
}

  updateApplicationStatus(applicationId: string, status: ApplicationStatus): void {
    this.applicationService
      .updateApplicationStatus(applicationId, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async (response) => {
          await this.toastService.showSuccessToast(response.message);

          this.viewApplications();

          this.loadCampaign();
        },

        error: async (error) => {
          await this.toastService.showErrorToast(
            getErrorMessage(error, 'Failed to update application'),
          );
        },
      });
  }
}
