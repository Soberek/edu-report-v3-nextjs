export interface PostImagesUploadResult {
  id: string;
  title: string;
  url_viewer: string;
  url: string;
  display_url: string;
  width: string;
  height: string;
  size: string;
  time: string;
  expiration: string;
  image: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  thumb: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  medium: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  delete_url: string;
}

export interface PostImagesUploadResponse {
  status_code: number;
  success: {
    message: string;
    code: number;
  };
  image: PostImagesUploadResult;
}

export class PostImagesUploadService {
  private static instance: PostImagesUploadService;
  private readonly baseUrl = 'https://postimages.org/api';
  private readonly apiKey: string;

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_POSTIMAGES_API_KEY || '';
    if (!this.apiKey) {
      console.warn('POSTIMAGES_API_KEY not found in environment variables');
    }
  }

  public static getInstance(): PostImagesUploadService {
    if (!PostImagesUploadService.instance) {
      PostImagesUploadService.instance = new PostImagesUploadService();
    }
    return PostImagesUploadService.instance;
  }

  /**
   * Convert a canvas data URL to a Blob
   */
  private dataURLToBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Upload a single image to PostImages via our API route
   */
  public async uploadImage(
    imageData: string | File | Blob,
    title?: string,
    description?: string
  ): Promise<PostImagesUploadResult> {
    let blob: Blob;

    if (typeof imageData === 'string') {
      // Data URL
      blob = this.dataURLToBlob(imageData);
    } else if (imageData instanceof File) {
      blob = imageData;
    } else {
      blob = imageData;
    }

    const formData = new FormData();
    formData.append('image', blob);
    if (title) formData.append('filename', title);
    if (description) formData.append('description', description);

    try {
      const response = await fetch('/api/upload-to-postimages', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `PostImages upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error uploading to PostImages:', error);
      throw new Error(`Failed to upload to PostImages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload multiple images to PostImages
   */
  public async uploadMultipleImages(
    images: Array<{ data: string | File | Blob; title?: string; description?: string }>
  ): Promise<PostImagesUploadResult[]> {
    const uploadPromises = images.map(({ data, title, description }) =>
      this.uploadImage(data, title, description)
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images to PostImages:', error);
      throw new Error(`Failed to upload images to PostImages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an image from PostImages (requires delete_url)
   */
  public async deleteImage(deleteUrl: string): Promise<boolean> {
    try {
      const response = await fetch(deleteUrl, {
        method: 'GET',
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting image from PostImages:', error);
      return false;
    }
  }

  /**
   * Get image information from PostImages
   */
  public async getImageInfo(imageId: string): Promise<PostImagesUploadResult> {
    if (!this.apiKey) {
      throw new Error('PostImages API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/image/${imageId}?key=${this.apiKey}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to get image info: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting image info from PostImages:', error);
      throw new Error(`Failed to get image info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const postImagesUploadService = PostImagesUploadService.getInstance();

