import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ToastService } from '../../../../core/services/toast.service';

import { getErrorMessage } from '../../../../shared/helpers/error-message.helper';

import { IonSpinner } from '@ionic/angular/standalone';
import {
  IonContent,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonButton,
} from '@ionic/angular/standalone';

import { CampaignService } from '../../../../core/services/campaign.service';
import { Industry } from '../../../../shared/enums/industry.enum';
import { Platform } from '../../../../shared/enums/platform.enum';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-campaign',
  standalone: true,
  templateUrl: './create-campaign.page.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleCasePipe,
    IonContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonSpinner,
  ],
})
export class CreateCampaignPage {
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  private campaignService = inject(CampaignService);

  private router = inject(Router);
  private toastService = inject(ToastService);

  industries = Object.values(Industry);

  platforms = Object.values(Platform);
  loading = false;
  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    platforms: this.fb.control<Platform[]>([], Validators.required),
    budgetPerInfluencer: [0, [Validators.required, Validators.min(1)]],
    totalSlots: [1, [Validators.required, Validators.min(1)]],
    startDate: [new Date().toISOString(), Validators.required],
    endDate: [new Date().toISOString(), Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload = this.form.getRawValue() as CreateCampaignDto;

    this.campaignService
      .createCampaign(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),

        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: async () => {
          await this.toastService.showSuccessToast('Campaign created successfully');

          this.router.navigate(['/my-campaigns']);
        },

        error: async (error) => {
          await this.toastService.showErrorToast(
            getErrorMessage(error, 'Failed to create campaign'),
          );
        },
      });
  }
}
