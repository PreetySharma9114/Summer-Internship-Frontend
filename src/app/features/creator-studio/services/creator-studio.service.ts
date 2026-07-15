import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { InstagramPost } from '../interfaces/instagram-post.interface';

@Injectable({
  providedIn: 'root',
})
export class CreatorStudioService {
  getPosts(): Observable<InstagramPost[]> {
    return of([
      {
        id: '1',
        image: 'https://picsum.photos/600/600?1',
        caption: 'Weekend vibes 🌴',
        likes: 2543,
        comments: 143,
        reach: 18234,
        createdAt: '2 hours ago',
        isReel: false,
      },
      {
        id: '2',
        image: 'https://picsum.photos/600/600?2',
        caption: 'Morning Coffee ☕',
        likes: 8211,
        comments: 391,
        reach: 45122,
        createdAt: 'Yesterday',
        isReel: false,
      },
      {
        id: '3',
        image: 'https://picsum.photos/600/600?3',
        caption: 'Travel Reel ✈️',
        likes: 13242,
        comments: 672,
        reach: 124532,
        createdAt: '3 days ago',
        isReel: true,
      },
      {
        id: '4',
        image: 'https://picsum.photos/600/600?4',
        caption: 'Fitness Journey 💪',
        likes: 6211,
        comments: 182,
        reach: 50213,
        createdAt: '5 days ago',
        isReel: false,
      },
    ]);
  }
}
