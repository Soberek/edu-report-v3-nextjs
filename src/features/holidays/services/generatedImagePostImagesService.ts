import { postImagesUploadService, type PostImagesUploadResult } from "./postImagesUploadService";

export interface GeneratedImagePostImagesResult<T = unknown> {
  originalPost: T;
  postImagesResult: PostImagesUploadResult | null;
  error?: string;
}

export class GeneratedImagePostImagesService {
  private static instance: GeneratedImagePostImagesService;

  private constructor() {}

  public static getInstance(): GeneratedImagePostImagesService {
    if (!GeneratedImagePostImagesService.instance) {
      GeneratedImagePostImagesService.instance = new GeneratedImagePostImagesService();
    }
    return GeneratedImagePostImagesService.instance;
  }

  /**
   * Upload a single generated image to PostImages
   */
  public async uploadGeneratedImageToPostImages(
    generatedImageUrl: string,
    postTitle: string,
    description?: string
  ): Promise<PostImagesUploadResult | null> {
    try {
      // Fetch the generated image
      const response = await fetch(generatedImageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch generated image: ${response.statusText}`);
      }

      const blob = await response.blob();

      // Upload to PostImages
      const postImagesResult = await postImagesUploadService.uploadImage(
        blob,
        postTitle,
        description || `Generated post template for: ${postTitle}`
      );

      return postImagesResult;
    } catch (error) {
      console.error("Error uploading generated image to PostImages:", error);
      throw new Error(`Failed to upload generated image to PostImages: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Upload multiple generated images to PostImages
   */
  public async uploadMultipleGeneratedImagesToPostImages<T extends { generatedImageUrl: string; title: string; description?: string }>(
    posts: T[]
  ): Promise<GeneratedImagePostImagesResult<T>[]> {
    const results: GeneratedImagePostImagesResult<T>[] = [];

    for (const post of posts) {
      try {
        const postImagesResult = await this.uploadGeneratedImageToPostImages(post.generatedImageUrl, post.title, post.description);

        results.push({
          originalPost: post,
          postImagesResult,
        });
      } catch (error) {
        results.push({
          originalPost: post,
          postImagesResult: null,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return results;
  }

  /**
   * Delete an image from PostImages
   */
  public async deleteImageFromPostImages(deleteUrl: string): Promise<boolean> {
    try {
      return await postImagesUploadService.deleteImage(deleteUrl);
    } catch (error) {
      console.error("Error deleting image from PostImages:", error);
      return false;
    }
  }

  /**
   * Get image information from PostImages
   */
  public async getImageInfoFromPostImages(imageId: string): Promise<PostImagesUploadResult> {
    try {
      return await postImagesUploadService.getImageInfo(imageId);
    } catch (error) {
      console.error("Error getting image info from PostImages:", error);
      throw new Error(`Failed to get image info from PostImages: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

// Export singleton instance
export const generatedImagePostImagesService = GeneratedImagePostImagesService.getInstance();

