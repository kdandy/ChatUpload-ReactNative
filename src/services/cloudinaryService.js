import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { CLOUDINARY_CONFIG, API_CONFIG } from '../constants/theme';

class CloudinaryService {
  constructor() {
    this.cloudName = CLOUDINARY_CONFIG.cloudName;
    this.apiKey = CLOUDINARY_CONFIG.apiKey;
    this.uploadPreset = 'ml_default'; // Cloudinary default unsigned preset
  }

  // Request camera permission
  async requestCameraPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  }

  // Request media library permission
  async requestMediaLibraryPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  // Pick image from gallery
  async pickImage() {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      
      if (!hasPermission) {
        throw new Error('Permission to access media library denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0];
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  }

  // Take photo with camera
  async takePhoto() {
    try {
      const hasPermission = await this.requestCameraPermission();
      
      if (!hasPermission) {
        throw new Error('Permission to access camera denied');
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0];
      }

      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  // Upload image to Cloudinary
  async uploadImage(imageUri, retryCount = 0) {
    try {
      if (!this.cloudName) {
        throw new Error('Cloudinary cloud name is missing. Check your .env file: CLOUDINARY_NAME');
      }

      console.log('Starting upload:', { cloudName: this.cloudName, preset: this.uploadPreset });

      // Create form data
      const formData = new FormData();
      
      // Get file info
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('file', {
        uri: imageUri,
        type: type,
        name: filename || `chat_${Date.now()}.jpg`,
      });
      
      // Use default unsigned preset
      formData.append('upload_preset', this.uploadPreset);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
      console.log('Upload URL:', uploadUrl);

      // Upload to Cloudinary
      const uploadResponse = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      if (uploadResponse.data && uploadResponse.data.secure_url) {
        console.log('✅ Upload successful:', uploadResponse.data.secure_url);
        return {
          url: uploadResponse.data.secure_url,
          publicId: uploadResponse.data.public_id,
          thumbnail: uploadResponse.data.thumbnail_url || uploadResponse.data.secure_url,
        };
      }

      throw new Error('Upload failed: No URL returned');
    } catch (error) {
      console.error('❌ Upload error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Retry mechanism
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        console.log(`🔄 Retrying upload... Attempt ${retryCount + 1}/${API_CONFIG.MAX_RETRIES}`);
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.RETRY_DELAY * (retryCount + 1))
        );
        return this.uploadImage(imageUri, retryCount + 1);
      }

      // Provide helpful error message
      if (error.response?.status === 400) {
        throw new Error('Upload preset "ml_default" not found. Please enable it in Cloudinary Settings > Upload > Enable unsigned uploading');
      }

      throw error;
    }
  }

  // Delete image from Cloudinary
  async deleteImage(publicId) {
    try {
      if (!this.cloudName || !this.apiKey) {
        throw new Error('Cloudinary configuration is missing');
      }

      const timestamp = Math.round(new Date().getTime() / 1000);
      
      // Note: Deletion requires signature, which should be done server-side
      // This is a simplified version
      console.log('Image deletion requested for:', publicId);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Get optimized image URL
  getOptimizedImageUrl(url, width = 400, height = 300, quality = 'auto') {
    if (!url || !url.includes('cloudinary.com')) {
      return url;
    }

    // Insert transformation parameters into URL
    const urlParts = url.split('/upload/');
    if (urlParts.length === 2) {
      return `${urlParts[0]}/upload/w_${width},h_${height},c_fill,q_${quality}/${urlParts[1]}`;
    }

    return url;
  }
}

export default new CloudinaryService();
