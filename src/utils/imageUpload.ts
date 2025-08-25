/**
 * Utility functions for handling image uploads
 */

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload an image file to storage
 * @param file - The image file to upload
 * @returns Promise with upload result
 */
export async function uploadImageToStorage(file: File): Promise<ImageUploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Please select a valid image file',
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must not exceed 5MB',
      };
    }

    // Upload to storage API
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/storage', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || `Error ${response.status}`;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }

    const uploadData = await response.json();
    
    if (!uploadData.success || !uploadData.file?.id) {
      return {
        success: false,
        error: 'Invalid response from server',
      };
    }

    const imageUrl = `/api/storage?id=${uploadData.file.id}`;
    
    return {
      success: true,
      url: imageUrl,
    };
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete an image from storage
 * @param imageUrl - The image URL (e.g., "/api/storage?id=123")
 * @returns Promise with deletion result
 */
export async function deleteImageFromStorage(imageUrl: string): Promise<boolean> {
  try {
    if (!imageUrl || !imageUrl.includes('/api/storage?id=')) {
      return false;
    }

    const imageId = imageUrl.split('/api/storage?id=')[1];
    if (!imageId) {
      return false;
    }

    const response = await fetch(`/api/storage?id=${imageId}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Create a preview URL for a file
 * @param file - The file to create preview for
 * @returns Preview URL that should be revoked with URL.revokeObjectURL()
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Validate image file before upload
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'Please select a valid image file',
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      valid: false,
      error: 'File size must not exceed 5MB',
    };
  }

  return { valid: true };
}