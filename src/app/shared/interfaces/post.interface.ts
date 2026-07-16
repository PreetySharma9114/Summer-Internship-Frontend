export interface Caption {
  tone: string;
  caption: string;
}

export interface CaptionResult {
  captions: Caption[];
  hashtags: string[];
}

export interface SubmitCampaignPost {
  caption: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface RefineCaption {
  caption: string;
  instruction: string;
}
