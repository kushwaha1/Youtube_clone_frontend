import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Upload, X, Video, Image } from 'lucide-react';

// Components
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

// API
import { uploadVideo } from '../../services/api';

/**
 * UploadVideo Component
 * 
 * Allows authenticated users to upload videos with:
 * - Title
 * - Description
 * - Category
 * - Video file
 * - Thumbnail
 */
function UploadVideo() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);

    // Sidebar toggle
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Loading state and progress tracking
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Form data state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'JavaScript'
    });

    // Video and thumbnail files + preview URLs
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    // Video categories
    const categories = [
        "JavaScript", "React", "CSS", "Node.js", "TypeScript", 
        "Web Development", "Tutorial", "Live", "Music", "Gaming", "News"
    ];

    /**
     * Redirect unauthenticated users
     */
    useEffect(() => {
        if (!isAuthenticated) {
            toast.error('Please login to upload videos');
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    /**
     * Handle text inputs for title, description, and category
     */
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    /**
     * Handle video file selection
     */
    const handleVideoSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('video/')) {
            toast.error('Please select a valid video file');
            return;
        }

        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            toast.error('Video size should be less than 100MB');
            return;
        }

        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    };

    /**
     * Handle thumbnail image selection
     */
    const handleThumbnailSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Thumbnail size should be less than 5MB');
            return;
        }

        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    /**
     * Handle form submission to upload video
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }
        if (!videoFile) {
            toast.error('Please select a video file');
            return;
        }
        if (!thumbnailFile) {
            toast.error('Please select a thumbnail');
            return;
        }

        try {
            setLoading(true);
            setUploadProgress(0); // Reset progress

            // Prepare FormData
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('description', formData.description.trim());
            formDataToSend.append('category', formData.category);
            formDataToSend.append('video', videoFile);
            formDataToSend.append('thumbnail', thumbnailFile);

            // Upload video with progress tracking
            const response = await uploadVideo(formDataToSend, (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentCompleted);
            });

            toast.success('Video uploaded successfully!');

            // Navigate to uploaded video page or fallback to home
            if (response.video?._id) {
                navigate(`/video/${response.video._id}`);
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload video');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with sidebar toggle */}
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex pt-14">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main content */}
                <main className="flex-1 lg:ml-20 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Page header */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h1 className="text-2xl font-bold mb-2">Upload Video</h1>
                            <p className="text-gray-600">Share your content with the world</p>
                        </div>

                        {/* Upload form */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">

                            {/* Video Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Video File <span className="text-red-500">*</span>
                                </label>
                                {!videoPreview ? (
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Video className="w-12 h-12 text-gray-400 mb-3" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">MP4, AVI, MOV (MAX. 100MB)</p>
                                        </div>
                                        <input type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" disabled={loading} />
                                    </label>
                                ) : (
                                    <div className="relative">
                                        <video src={videoPreview} controls className="w-full rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            disabled={loading}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {videoFile?.name} ({(videoFile?.size / (1024 * 1024)).toFixed(2)} MB)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Thumbnail <span className="text-red-500">*</span>
                                </label>
                                {!thumbnailPreview ? (
                                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Image className="w-12 h-12 text-gray-400 mb-3" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> thumbnail
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleThumbnailSelect} className="hidden" disabled={loading} />
                                    </label>
                                ) : (
                                    <div className="relative">
                                        <img src={thumbnailPreview} alt="Thumbnail" loading="lazy" className="w-full aspect-video object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            disabled={loading}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter video title"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Tell viewers about your video"
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    disabled={loading}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 min-w-[200px] justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Uploading... {uploadProgress}%</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Upload Video
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Upload Progress Bar */}
                            {loading && uploadProgress > 0 && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Uploading your video...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default UploadVideo;