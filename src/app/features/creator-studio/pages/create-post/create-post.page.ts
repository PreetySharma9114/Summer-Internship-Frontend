import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  IonContent,
  IonButton,
  IonTextarea,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-post',
  standalone: true,
  templateUrl: './create-post.page.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    IonTextarea,
    IonCard,
    IonCardContent,
    IonSpinner,
    IonIcon,
  ],
})
export class CreatePostPage {
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
    this.loadingCaption = true;

    setTimeout(() => {
      this.generatedCaptions = [
        'Weekend vibes 🌴✨ Living my best life.',
        'Creating memories one post at a time ❤️',
        'New day. New content. New energy 🚀',
      ];

      this.loadingCaption = false;
    }, 1500);
  }

  selectCaption(caption: string) {
    this.form.patchValue({
      caption,
    });
  }

  publish() {
    console.log({
      file: this.selectedFile,
      caption: this.form.value.caption,
    });

    alert('Dummy Publish Successful');
  }
}