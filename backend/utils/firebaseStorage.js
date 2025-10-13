const { initializeFirebase, admin } = require('../config/firebase');
const config = require('../config/config');

class FirebaseStorageService {
  constructor() {
    this.bucket = null;
    this.initializeStorage();
  }

  initializeStorage() {
    try {
      const firebaseApp = initializeFirebase();
      if (firebaseApp && config.firebase.storageBucket) {
        this.bucket = admin.storage().bucket(config.firebase.storageBucket);
        console.log('✅ Firebase Storage initialized successfully');
      } else {
        console.warn('⚠️  Firebase Storage not configured');
      }
    } catch (error) {
      console.error('❌ Firebase Storage initialization error:', error.message);
    }
  }

  async uploadFile(fileBuffer, fileName, contentType, folder = 'pets') {
    if (!this.bucket) {
      throw new Error('Firebase Storage not initialized');
    }

    try {
      // Create unique filename with timestamp
      const timestamp = Date.now();
      const fileExtension = fileName.split('.').pop();
      const uniqueFileName = `${folder}/${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;

      const file = this.bucket.file(uniqueFileName);

      // Upload file
      await file.save(fileBuffer, {
        metadata: {
          contentType: contentType,
          metadata: {
            uploadedAt: new Date().toISOString(),
            originalName: fileName
          }
        },
        public: true, // Make file publicly accessible
        validation: 'md5'
      });

      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${config.firebase.storageBucket}/${uniqueFileName}`;

      console.log(`✅ File uploaded successfully: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error('❌ File upload error:', error.message);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileUrl) {
    if (!this.bucket) {
      throw new Error('Firebase Storage not initialized');
    }

    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/');
      const fileName = urlParts.slice(-2).join('/'); // Get folder/filename part

      const file = this.bucket.file(fileName);
      await file.delete();

      console.log(`✅ File deleted successfully: ${fileName}`);
      return true;
    } catch (error) {
      console.error('❌ File deletion error:', error.message);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Validate file type and size
  validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    return true;
  }
}

module.exports = new FirebaseStorageService();