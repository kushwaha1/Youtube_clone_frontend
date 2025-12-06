import axios from 'axios';
import toast from 'react-hot-toast';

// ================================
// BASE CONFIG
// ================================

// Backend base URL - change if your backend is on a different port
const BASE_URL = 'http://localhost:5000/api';

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60 seconds
});

// Logout callback to handle token expiration
let logoutCallback = null;
export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

// ================================
// INTERCEPTORS
// ================================

// Request interceptor - add Authorization token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle token expiry and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Token expired or unauthorized
      if (status === 401) {
        const message = data?.message?.toLowerCase() || '';
        if (
          message.includes('token') ||
          message.includes('expired') ||
          message.includes('invalid') ||
          message.includes('unauthorized') ||
          message.includes('jwt')
        ) {
          // Clear auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Call logout callback
          if (logoutCallback) logoutCallback();

          toast.error('Session expired. Please login again.');

          // Redirect to home after short delay
          setTimeout(() => (window.location.href = '/'), 1000);
        }
      }

      // Server errors
      if (status === 500) toast.error('Server error. Please try again later.');
      if (status === 503) toast.error('Service unavailable. Please try again.');
    } else if (error.request) {
      // No response from server
      toast.error('Cannot connect to server. Check your internet.');
    } else {
      // Other errors
      toast.error('Request error: ' + error.message);
    }

    return Promise.reject(error);
  }
);

// ================================
// AUTH APIs
// ================================

// Update user avatar
export const updateAvatar = async (formData) => {
  const response = await api.put('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ================================
// VIDEO APIs
// ================================

// Get all videos
export const getAllVideos = async () => {
  const response = await api.get('/videos');
  return response.data.videos;
};

// Get video by ID
export const getVideoById = async (videoId) => {
  const response = await api.get(`/videos/${videoId}`);
  return response.data.video;
};

// Get videos by category
export const getVideosByCategory = async (category) => {
  const encodedCategory = encodeURIComponent(category);
  const response = await api.get(`/videos/category/${encodedCategory}`);
  return response.data.videos;
};

// Search videos
export const searchVideos = async (query) => {
  const encodedQuery = encodeURIComponent(query);
  const response = await api.get(`/videos/search?query=${encodedQuery}`);
  return response.data.videos;
};

// Upload video
export const uploadVideo = async (formData, onUploadProgress) => {
  const response = await api.post('/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0, // Important for large uploads
    onUploadProgress,
  });
  return response.data;
};

// Update video
export const updateVideo = async (videoId, formData) => {
  const response = await api.put(`/videos/${videoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Delete video
export const deleteVideo = async (videoId) => {
  const response = await api.delete(`/videos/${videoId}`);
  return response.data;
};

// Increment video views
export const incrementVideoViews = async (videoId) => {
  const response = await api.post(`/videos/${videoId}/view`);
  return response.data;
};

// Toggle video like
export const toggleVideoLike = async (videoId) => {
  const response = await api.post(`/videos/${videoId}/like`);
  return response.data;
};

// Toggle video dislike
export const toggleVideoDislike = async (videoId) => {
  const response = await api.post(`/videos/${videoId}/dislike`);
  return response.data;
};

// Get like status
export const getLikeStatus = async (videoId) => {
  const response = await api.get(`/videos/${videoId}/like-status`);
  return response.data;
};

// ================================
// COMMENT APIs
// ================================

// Get comments for a video
export const getCommentsByVideo = async (videoId) => {
  const response = await api.get(`/comment/video/${videoId}`);
  return response.data.comments;
};

// Add comment
export const addComment = async (videoId, text) => {
  const response = await api.post(`/comment/video/${videoId}`, { text });
  return response.data.comment;
};

// Update comment
export const updateComment = async (commentId, text) => {
  const response = await api.put(`/comment/${commentId}`, { text });
  return response.data.comment;
};

// Delete comment
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comment/${commentId}`);
  return response.data;
};

// ================================
// CHANNEL APIs
// ================================

// Create channel
export const createChannel = async (formData) => {
  const response = await api.post('/channel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return { channel: response.data.data, message: response.data.message };
};

// Get all channels
export const getAllChannels = async () => {
  const response = await api.get('/channel');
  return response.data.channels;
};

// Get single channel by ID
export const getChannelById = async (channelId) => {
  const response = await api.get(`/channel/${channelId}`);
  return response.data;
};

// Get current user's channel
export const getMyChannel = async () => {
  try {
    const response = await api.get('/channel/me');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) return null; // User has no channel
    throw error;
  }
};

// Get videos of a channel
export const getChannelVideos = async (channelId, sortBy = 'latest') => {
  const response = await api.get(`/channel/${channelId}/videos?sort=${sortBy}`);
  return response.data;
};

// Update channel
export const updateChannel = async (channelId, formData) => {
  const response = await api.put(`/channel/${channelId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Delete channel
export const deleteChannel = async (channelId) => {
  const response = await api.delete(`/channel/${channelId}`);
  return response.data;
};

// Subscribe to channel
export const subscribeChannel = async (channelId) => {
  const response = await api.post(`/channel/${channelId}/subscribe`);
  return response.data;
};

// Unsubscribe from channel
export const unsubscribeChannel = async (channelId) => {
  const response = await api.post(`/channel/${channelId}/unsubscribe`);
  return response.data;
};

// Check subscription status
export const checkSubscription = async (channelId) => {
  const response = await api.get(`/channel/${channelId}/subscription-status`);  
  return response.data;
};

// ================================
// HELPER FUNCTIONS
// ================================

// Check if user has a channel
export const checkUserChannel = async () => {
  try {
    return await getMyChannel();
  } catch (error) {
    return null;
  }
};

export default api;