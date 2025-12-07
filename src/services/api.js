import axios from 'axios';
import toast from 'react-hot-toast';

// ================================
// BASE CONFIG
// ================================

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// Logout callback
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
    if (!error.response) {
      toast.error('Cannot connect to server. Check your internet.');
      return Promise.reject(error);
    }

    const { status, data, config } = error.response;
    const message = data?.message?.toLowerCase() || '';
    const isAuthApi = config?.url?.includes('/auth/login') || 
                      config?.url?.includes('/auth/register');

    // ONLY token related 401 (NOT login)
    if (status === 401 && !isAuthApi) {
      if (
        message.includes('token') ||
        message.includes('expired') ||
        message.includes('jwt') ||
        message.includes('unauthorized')
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

    // LOGIN ERROR → let component handle it
    return Promise.reject(error);
  }
);

// ================================
// AUTH APIs
// ================================

// Regsister new user
export const register = async (formData) => {
  try {
    const res = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (formData) => {
  try {
    const response = await api.post('/auth/login', formData);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || 'Login failed. Try again.';
    throw new Error(message);
  }
};


// Update user avatar
export const updateAvatar = async (formData) => {
  try {
    const res = await api.put('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ================================
// VIDEO APIs
// ================================

// Get all videos
export const getAllVideos = async () => {
  try {
    const res = await api.get('/videos');
    return res.data.videos;
  } catch (error) {
    throw error;
  }
};

// Get video by ID
export const getVideoById = async (videoId) => {
  try {
    const res = await api.get(`/videos/${videoId}`);
    return res.data.video;
  } catch (error) {
    throw error;
  }
};

// Get videos by category
export const getVideosByCategory = async (category) => {
  try {
    const res = await api.get(`/videos/category/${encodeURIComponent(category)}`);
    return res.data.videos;
  } catch (error) {
    throw error;
  }
};

// Search videos
export const searchVideos = async (query) => {
  try {
    const res = await api.get(`/videos/search?query=${encodeURIComponent(query)}`);
    return res.data.videos;
  } catch (error) {
    throw error;
  }
};

// Upload video
export const uploadVideo = async (formData, onUploadProgress) => {
  try {
    const res = await api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 0,
      onUploadProgress,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Update video
export const updateVideo = async (videoId, formData) => {
  try {
    const res = await api.put(`/videos/${videoId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Delete video
export const deleteVideo = async (videoId) => {
  try {
    const res = await api.delete(`/videos/${videoId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Increment video views
export const incrementVideoViews = async (videoId) => {
  try {
    const res = await api.post(`/videos/${videoId}/view`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Toggle video like
export const toggleVideoLike = async (videoId) => {
  try {
    const res = await api.post(`/videos/${videoId}/like`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Toggle video dislike
export const toggleVideoDislike = async (videoId) => {
  try {
    const res = await api.post(`/videos/${videoId}/dislike`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get like status
export const getLikeStatus = async (videoId) => {
  try {
    const res = await api.get(`/videos/${videoId}/like-status`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ================================
// COMMENT APIs
// ================================

// Get comments for a video
export const getCommentsByVideo = async (videoId) => {
  try {
    const res = await api.get(`/comment/video/${videoId}`);
    return res.data.comments;
  } catch (error) {
    throw error;
  }
};

// Add comment
export const addComment = async (videoId, text) => {
  try {
    const res = await api.post(`/comment/video/${videoId}`, { text });
    return res.data.comment;
  } catch (error) {
    throw error;
  }
};

// Update comment
export const updateComment = async (commentId, text) => {
  try {
    const res = await api.put(`/comment/${commentId}`, { text });
    return res.data.comment;
  } catch (error) {
    throw error;
  }
};

// Delete comment
export const deleteComment = async (commentId) => {
  try {
    const res = await api.delete(`/comment/${commentId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ================================
// CHANNEL APIs
// ================================

// Create channel
export const createChannel = async (formData) => {
  try {
    const res = await api.post('/channel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { channel: res.data.data, message: res.data.message };
  } catch (error) {
    throw error;
  }
};

// Get all channels
export const getAllChannels = async () => {
  try {
    const res = await api.get('/channel');
    return res.data.channels;
  } catch (error) {
    throw error;
  }
};

// get channel by Id
export const getChannelById = async (channelId) => {
  try {
    const res = await api.get(`/channel/${channelId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// get my channel
export const getMyChannel = async () => {
  try {
    const res = await api.get('/channel/me');
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

// Get videos of a channel
export const getChannelVideos = async (channelId, sortBy = 'latest') => {
  try {
    const res = await api.get(`/channel/${channelId}/videos?sort=${sortBy}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Update channel
export const updateChannel = async (channelId, formData) => {
  try {
    const res = await api.put(`/channel/${channelId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Delete channel
export const deleteChannel = async (channelId) => {
  try {
    const res = await api.delete(`/channel/${channelId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Subscribe to channel
export const subscribeChannel = async (channelId) => {
  try {
    const res = await api.post(`/channel/${channelId}/subscribe`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Unsubscribe from channel
export const unsubscribeChannel = async (channelId) => {
  try {
    const res = await api.post(`/channel/${channelId}/unsubscribe`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Check subscription status
export const checkSubscription = async (channelId) => {
  try {
    const res = await api.get(`/channel/${channelId}/subscription-status`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ================================
// HELPER FUNCTIONS
// ================================

// Check if user has a channel
export const checkUserChannel = async () => {
  try {
    return await getMyChannel();
  } catch {
    return null;
  }
};

export default api;