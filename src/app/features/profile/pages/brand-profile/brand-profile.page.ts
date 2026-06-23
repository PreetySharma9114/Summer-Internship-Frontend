import { Component, DestroyRef, OnInit, inject } from '@angular/core';

import { CommonModule, TitleCasePipe } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { finalize } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonSpinner,
} from '@ionic/angular/standalone';

import { AuthService } from '../../../../core/services/auth.service';

import { ProfileService } from '../../../../core/services/profile.service';

import { ToastService } from '../../../../core/services/toast.service';

import { ProfileStatus } from '../../enums/profile-status.enum';

import { BrandIndustry } from '../../enums/brand-industry.enum';

import { BrandProfile } from '../../interfaces/brand-profile.interface';

import { ProfileValidators } from '../../../../shared/validators/profile.validators';

import { getValidationMessage } from '../../../../shared/helpers/validation-message.helper';

import { getErrorMessage } from '../../../../shared/helpers/error-message.helper';

import { generatePreview } from '../../../../shared/helpers/file-upload.helper';

import { validateImageFile } from '../../../../shared/helpers/file-validation.helper';

@Component({
  selector: 'app-brand-profile',

  standalone: true,

  templateUrl: './brand-profile.page.html',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleCasePipe,

    IonContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonSpinner,
  ],
})
export class BrandProfilePage implements OnInit {
  private fb = inject(FormBuilder);

  private profileService = inject(ProfileService);

  private toastService = inject(ToastService);

  private authService = inject(AuthService);

  private router = inject(Router);

  private destroyRef = inject(DestroyRef);

  protected readonly getValidationMessage = getValidationMessage;

  brandProfileForm!: FormGroup;

  loading = false;

  selectedLogo: File | null = null;

  logoPreview: string | null = null;

  readonly industries = Object.values(BrandIndustry);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.brandProfileForm = this.fb.group({
      brandName: ['', ProfileValidators.brandName],

      website: ['', ProfileValidators.website],

      description: ['', ProfileValidators.description],

      industry: ['', Validators.required],

      instagramUsername: ['', ProfileValidators.instagramUsername],
    });
  }

  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const error = validateImageFile(file);

    if (error) {
      void this.toastService.showErrorToast(error);

      input.value = '';

      return;
    }

    this.selectedLogo = file;

    generatePreview(file, (preview: string) => {
      this.logoPreview = preview;
    });
  }

  submitProfile(): void {
    if (this.brandProfileForm.invalid) {
      this.brandProfileForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const profile: BrandProfile = this.brandProfileForm.getRawValue();

    this.profileService
      .createBrandProfile(profile, this.selectedLogo ?? undefined)
      .pipe(
        takeUntilDestroyed(this.destroyRef),

        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: async () => {
          const user = this.authService.getCurrentUser();

          if (user) {
            this.authService.setCurrentUser({
              ...user,
              profileStatus: ProfileStatus.COMPLETE,
            });
          }

          await this.toastService.showSuccessToast('Profile completed successfully');

          this.router.navigate(['/home']);
        },

        error: async (error) => {
          await this.toastService.showErrorToast(
            getErrorMessage(error, 'Failed to complete profile'),
          );
        },
      });
  }
}
