import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  IonContent,
  IonButton,
  IonTextarea,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { PostService } from 'src/app/core/services/post.service';
import { finalize, switchMap } from 'rxjs';
import { UploadService } from 'src/app/core/services/upload.service';
import { SubmitCampaignPost } from 'src/app/shared/interfaces/post.interface';

@Component({
  selector: 'app-create-post',
  standalone: true,
  templateUrl: './create-post.page.html',
  imports: [
    CommonModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonSpinner,
    IonTextarea,
    ReactiveFormsModule,
  ],
})
export class CreatePostPage {
  private postService = inject(PostService);
  private uploadService = inject(UploadService);

  loadingCaption = false;

  selectedFile?: File;

  previewUrl = '';

  generatedCaptions: string[] = [];

  form = this.fb.group({
    caption: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.selectedFile = input.files[0];

    this.previewUrl = URL.createObjectURL(this.selectedFile);
  }

  get isVideo(): boolean {
    return this.selectedFile?.type?.startsWith('video') ?? false;
  }

  generateCaption() {
    if (!this.selectedFile) return;

    this.loadingCaption = true;

    this.postService
      .generateCaption(this.selectedFile, this.form.value.caption ?? '')
      .pipe(finalize(() => (this.loadingCaption = false)))
      .subscribe({
        next: ({ data }) => {
          this.generatedCaptions = data.captions.map((c) => c.caption);
        },
      });
  }

  selectCaption(caption: string) {
    this.form.patchValue({
      caption,
    });

    this.generatedCaptions = [];
  }

  publish() {
    if (!this.selectedFile) return;

    this.uploadService
      .uploadPost(this.selectedFile)
      .pipe(
        switchMap(({ data }) => {
          const mediaPayload = this.isVideo ? { videoUrl: data.url } : { imageUrl: data.url };

          const payload = {
            ...this.form.getRawValue(),
            ...mediaPayload,
          } as SubmitCampaignPost;

          return this.postService.submitPost(payload);
        }),
      )
      .subscribe({
        next: () => {
          console.log('Successfully Uploaded!');
        },
      });
  }
}
