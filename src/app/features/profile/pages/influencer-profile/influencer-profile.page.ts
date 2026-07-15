import { Component, DestroyRef, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { finalize, take } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonTextarea,
  IonSpinner,
  IonCheckbox,
} from '@ionic/angular/standalone';

import { AuthService } from '../../../../core/services/auth.service';

import { ProfileService } from '../../../../core/services/profile.service';

import { ToastService } from '../../../../core/services/toast.service';

import { ProfileStatus } from '../../enums/profile-status.enum';

import { InfluencerNiche } from '../../enums/influencer-niche.enum';

import {
  CreateInfluencerProfile,
  InfluencerProfile,
} from '../../interfaces/influencer-profile.interface';

import { ProfileValidators } from '../../../../shared/validators/profile.validators';

import { getValidationMessage } from '../../../../shared/helpers/validation-message.helper';

import { getErrorMessage } from '../../../../shared/helpers/error-message.helper';

import { generatePreview } from '../../../../shared/helpers/file-upload.helper';

import { validateImageFile } from '../../../../shared/helpers/file-validation.helper';
import { SocialMediaService } from 'src/app/core/services/social-media.service';

@Component({
  selector: 'app-influencer-profile',

  standalone: true,

  templateUrl: './influencer-profile.page.html',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonCheckbox,
    IonSpinner,
  ],
})
export class InfluencerProfilePage implements OnInit {
  private fb = inject(FormBuilder);

  private profileService = inject(ProfileService);

  private toastService = inject(ToastService);

  private router = inject(Router);

  private authService = inject(AuthService);

  private destroyRef = inject(DestroyRef);

  private socialMediaService = inject(SocialMediaService);

  private route = inject(ActivatedRoute);

  protected readonly getValidationMessage = getValidationMessage;

  influencerProfileForm!: FormGroup;

  instagramConnected = false;

  loading = false;

  selectedImage: File | null = null;

  imagePreview: string | null = null;

  readonly niches = Object.values(InfluencerNiche);

  ngOnInit(): void {
    this.initializeForm();

    this.handleInstagramCallback();
  }

  private initializeForm(): void {
    this.influencerProfileForm = this.fb.group({
      fullName: ['', ProfileValidators.fullName],

      username: ['', ProfileValidators.username],

      bio: ['', ProfileValidators.bio],

      niches: [[], Validators.required],

      instagramToken: [{ value: '', disabled: true }, Validators.required],

      instagramUserId: [{ value: '', disabled: true }, Validators.required],

      instagramUsername: [{ value: '', disabled: true }, Validators.required],

      instagramFollowers: [{ value: 0, disabled: true }, ProfileValidators.instagramFollowers],

      youtubeUsername: [''],
    });
  }

  onFileChange(event: Event): void {
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

    this.selectedImage = file;

    generatePreview(file, (preview: string) => {
      this.imagePreview = preview;
    });
  }

  submitProfile(): void {
    if (this.influencerProfileForm.invalid) {
      this.influencerProfileForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const profile: CreateInfluencerProfile = this.influencerProfileForm.getRawValue();

    this.profileService
      .createInfluencerProfile(profile, this.selectedImage ?? undefined)
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

  isNicheSelected(niche: InfluencerNiche): boolean {
    const selectedNiches = this.influencerProfileForm.get('niches')?.value ?? [];

    return selectedNiches.includes(niche);
  }

  toggleNiche(niche: InfluencerNiche, checked: boolean): void {
    const control = this.influencerProfileForm.get('niches');

    const selectedNiches: InfluencerNiche[] = [...(control?.value ?? [])];

    if (checked) {
      selectedNiches.push(niche);
    } else {
      const index = selectedNiches.indexOf(niche);

      if (index > -1) {
        selectedNiches.splice(index, 1);
      }
    }

    control?.setValue(selectedNiches);

    control?.markAsTouched();
  }

  connectInstagram() {
    localStorage.setItem(
      'profileFormDraft',
      JSON.stringify(this.influencerProfileForm.getRawValue()),
    );

    this.socialMediaService.getInstagramAccessToken();
  }

  private handleInstagramCallback() {
    this.route.queryParamMap.pipe(take(1)).subscribe((params) => {
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');

      if (error || !code) {
        console.error('Instagram auth failed', error);
        this.clearQueryParams();
        return;
      }

      if (state !== sessionStorage.getItem('ig_oauth_state')) {
        console.error('State mismatch');
        this.clearQueryParams();
        return;
      }

      this.socialMediaService
        .exchangeCode(code)
        .pipe(finalize(() => this.clearQueryParams()))
        .subscribe({
          next: ({ data }) => {
            const draft = localStorage.getItem('profileFormDraft');

            if (draft) {
              this.influencerProfileForm.patchValue(JSON.parse(draft));
              localStorage.removeItem('profileFormDraft');
            }

            this.instagramConnected = true;

            this.influencerProfileForm.patchValue({
              instagramFollowers: data.profile.followers,
              instagramToken: data.token,
              instagramUserId: data.profile.id,
              instagramUsername: data.profile.username,
            });

            sessionStorage.removeItem('ig_oauth_state');
          },
          error: (err) => console.error(err),
        });
    });
  }

  private clearQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true,
    });
  }
}
