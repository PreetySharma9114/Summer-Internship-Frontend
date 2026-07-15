import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject, OnInit } from '@angular/core';
import { CreatorStudioService } from '../../services/creator-studio.service';
import { ModalController } from '@ionic/angular';
import { CreatePostPage } from '../create-post/create-post.page';
import {
  IonContent,
  IonButton,
  IonTextarea,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';

import { InstagramPost } from '../../interfaces/instagram-post.interface';

@Component({
  selector: 'app-creator-studio',
  standalone: true,
  templateUrl: './creator-studio.page.html',
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonTextarea, IonCard, IonCardContent],
  providers:[ModalController]
})
export class CreatorStudioPage implements OnInit {
  caption = '';

  selectedFile?: File;

  previewUrl?: string;

  isVideo = false;

  private creatorStudioService = inject(CreatorStudioService);
  private modalController = inject(ModalController);

  posts: InstagramPost[] = [];
  totalPosts = 0;

  totalReels = 0;

  totalReach = 0;

  totalLikes = 0;
  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];

    this.previewUrl = URL.createObjectURL(this.selectedFile);

    this.isVideo = this.selectedFile.type.startsWith('video');
  }

  generateCaption(): void {
    console.log('Generate Caption');
  }

  publish(): void {
    console.log('Publish');
  }
  ngOnInit(): void {
    this.creatorStudioService.getPosts().subscribe((posts) => {
      this.posts = posts;

      this.totalPosts = posts.filter((x) => !x.isReel).length;

      this.totalReels = posts.filter((x) => x.isReel).length;

      this.totalReach = posts.reduce((sum, post) => sum + post.reach, 0);

      this.totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    });
  }
  async openCreatePost(): Promise<void> {
    const modal = await this.modalController.create({
      component: CreatePostPage,
      breakpoints: [0, 0.9],
      initialBreakpoint: 0.9,
    });

    await modal.present();

    const { role } = await modal.onDidDismiss();

    if (role === 'refresh') {
      this.ngOnInit();
    }
  }
}
