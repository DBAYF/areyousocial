// Firebase Storage helpers for file uploads and downloads

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot,
  StorageReference,
} from 'firebase/storage'
import { storage, STORAGE_PATHS } from './config'
import { isValidImageFile, isValidPostImageFile } from '@/lib/utils/validators'

// Upload file with validation
export async function uploadFile(
  file: File,
  path: string,
  options: {
    validate?: (file: File) => boolean
    metadata?: { [key: string]: string }
  } = {}
): Promise<{ url: string; ref: StorageReference }> {
  // Validate file if validator provided
  if (options.validate && !options.validate(file)) {
    throw new Error('File validation failed')
  }

  const storageRef = ref(storage, path)

  const metadata = {
    contentType: file.type,
    customMetadata: options.metadata || {},
  }

  const snapshot = await uploadBytes(storageRef, file, metadata)
  const url = await getDownloadURL(snapshot.ref)

  return { url, ref: snapshot.ref }
}

// Upload with progress tracking
export function uploadFileWithProgress(
  file: File,
  path: string,
  onProgress?: (progress: number) => void,
  options: {
    validate?: (file: File) => boolean
    metadata?: { [key: string]: string }
  } = {}
): Promise<{ url: string; ref: StorageReference }> {
  return new Promise((resolve, reject) => {
    // Validate file if validator provided
    if (options.validate && !options.validate(file)) {
      reject(new Error('File validation failed'))
      return
    }

    const storageRef = ref(storage, path)

    const metadata = {
      contentType: file.type,
      customMetadata: options.metadata || {},
    }

    const uploadTask = uploadBytesResumable(storageRef, file, metadata)

    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(progress)
      },
      (error) => {
        reject(error)
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          resolve({ url, ref: uploadTask.snapshot.ref })
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

// Delete file
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

// Get download URL
export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path)
  return getDownloadURL(storageRef)
}

// Avatar upload helper
export async function uploadAvatar(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; ref: StorageReference }> {
  const path = `${STORAGE_PATHS.AVATARS}/${userId}/${Date.now()}_${file.name}`

  return uploadFileWithProgress(file, path, onProgress, {
    validate: isValidImageFile,
    metadata: {
      userId,
      type: 'avatar',
    },
  })
}

// Post image upload helper
export async function uploadPostImage(
  postId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; ref: StorageReference }> {
  const path = `${STORAGE_PATHS.POST_IMAGES}/${postId}/${Date.now()}_${file.name}`

  return uploadFileWithProgress(file, path, onProgress, {
    validate: isValidPostImageFile,
    metadata: {
      postId,
      type: 'post-image',
    },
  })
}

// Multiple post images upload helper
export async function uploadPostImages(
  postId: string,
  files: File[],
  onProgress?: (progress: number, current: number, total: number) => void
): Promise<Array<{ url: string; ref: StorageReference }>> {
  const results: Array<{ url: string; ref: StorageReference }> = []
  const totalFiles = files.length

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const progressCallback = onProgress
      ? (progress: number) => onProgress(progress, i + 1, totalFiles)
      : undefined

    const result = await uploadPostImage(postId, file, progressCallback)
    results.push(result)
  }

  return results
}

// Message attachment upload helper
export async function uploadMessageAttachment(
  threadId: string,
  messageId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; ref: StorageReference }> {
  const path = `${STORAGE_PATHS.MESSAGE_ATTACHMENTS}/${threadId}/${messageId}/${Date.now()}_${file.name}`

  return uploadFileWithProgress(file, path, onProgress, {
    metadata: {
      threadId,
      messageId,
      type: 'message-attachment',
      filename: file.name,
      size: file.size.toString(),
    },
  })
}

// Opportunity attachment upload helper
export async function uploadOpportunityAttachment(
  opportunityId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; ref: StorageReference }> {
  const path = `${STORAGE_PATHS.OPPORTUNITY_ATTACHMENTS}/${opportunityId}/${Date.now()}_${file.name}`

  return uploadFileWithProgress(file, path, onProgress, {
    metadata: {
      opportunityId,
      type: 'opportunity-attachment',
      filename: file.name,
      size: file.size.toString(),
    },
  })
}

// Batch delete files
export async function deleteFiles(paths: string[]): Promise<void[]> {
  const deletePromises = paths.map(path => deleteFile(path))
  return Promise.all(deletePromises)
}

// Generate optimized image URLs (if using Firebase Extensions)
export function getOptimizedImageUrl(url: string, options: {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
} = {}): string {
  // This would work with Firebase Extensions for image optimization
  // For now, just return the original URL
  return url
}

// File metadata interface
export interface FileMetadata {
  name: string
  size: number
  type: string
  lastModified: number
  url?: string
}

// Extract file metadata
export function getFileMetadata(file: File, url?: string): FileMetadata {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    url,
  }
}

// Storage error handling
export class StorageError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: any
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

// Storage error messages
export const STORAGE_ERROR_MESSAGES: Record<string, string> = {
  'storage/unauthorized': 'You do not have permission to access this file.',
  'storage/canceled': 'File upload was canceled.',
  'storage/quota-exceeded': 'Storage quota exceeded.',
  'storage/invalid-format': 'Invalid file format.',
  'storage/invalid-checksum': 'File checksum mismatch.',
  'storage/retry-limit-exceeded': 'Too many retry attempts.',
  'storage/invalid-event-name': 'Invalid event name.',
  'storage/invalid-url': 'Invalid URL.',
  'storage/invalid-argument': 'Invalid argument.',
  'storage/no-default-bucket': 'No default bucket configured.',
  'storage/cannot-slice-blob': 'Cannot slice blob.',
  'storage/server-file-wrong-size': 'Server file wrong size.',
}

// Get user-friendly storage error message
export function getStorageErrorMessage(error: any): string {
  if (error.code && STORAGE_ERROR_MESSAGES[error.code]) {
    return STORAGE_ERROR_MESSAGES[error.code]
  }
  return 'An error occurred while uploading the file. Please try again.'
}