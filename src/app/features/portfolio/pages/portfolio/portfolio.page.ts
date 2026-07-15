import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  IonContent,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';

import { PortfolioService } from '../../../../core/services/portfolio.service';
import { Portfolio } from '../../../../shared/interfaces/portfolio.interface';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
  ],
})
export class PortfolioPage implements OnInit {
  private fb = inject(FormBuilder);

  private portfolioService = inject(PortfolioService);

  portfolios: Portfolio[] = [];

  selectedFile?: File;

  uploading = false;

  form = this.fb.group({
    title: ['', Validators.required],

    description: ['', Validators.required],

    platform: ['INSTAGRAM', Validators.required],

    hashtags: [''],
  });

  ngOnInit() {
    this.loadPortfolio();
  }

  loadPortfolio() {
    this.portfolioService.getMyPortfolio().subscribe((response) => {
      this.portfolios = response.data;
    });
  }

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.selectedFile = input.files[0];
  }

  savePortfolio() {
    if (!this.selectedFile) return;

    this.uploading = true;

    this.portfolioService
      .uploadPortfolio(this.selectedFile)
      .subscribe((uploadResponse) => {
        const mediaType = this.selectedFile!.type.startsWith('video')
          ? 'VIDEO'
          : 'IMAGE';

        this.portfolioService
          .createPortfolio({
            title: this.form.value.title,

            description: this.form.value.description,

            platform: this.form.value.platform,

            hashtags:
              this.form.value.hashtags
                ?.split(',')
                .map((x) => x.trim()) ?? [],

            mediaType,

            mediaUrl: uploadResponse.data.mediaUrl,

            thumbnailUrl:
              uploadResponse.data.thumbnailUrl,
          })
          .subscribe(() => {
            this.form.reset();

            this.selectedFile = undefined;

            this.uploading = false;

            this.loadPortfolio();
          });
      });
  }

  deletePortfolio(id: string) {
    this.portfolioService.deletePortfolio(id).subscribe(() => {
      this.loadPortfolio();
    });
  }
}