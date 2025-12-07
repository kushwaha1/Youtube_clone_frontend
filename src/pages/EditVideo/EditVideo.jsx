import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Save, Image } from 'lucide-react';

// Components
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

// API
import { getVideoById, updateVideo } from '../../services/api';

/**
 * EditVideo Component
 * 
 * Allows authenticated users to edit video details:
 * - Title
 * - Description
 * - Category
 * - Thumbnail
 */
function EditVideo() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.auth);

    // Sidebar toggle
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Loading and saving states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'JavaScript'
    });

    // Thumbnail state
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [currentThumbnail, setCurrentThumbnail] = useState(null);

    // Video categories
    const categories = [
        "JavaScript", "React", "CSS", "Node.js", "TypeScript", 
        "Web Development", "Tutorial", "Live", "Music", "Gaming", "News"
    ];

    /**
     * Redirect unauthenticated users and fetch video details
     */
    useEffect(() => {
        if (!isAuthenticated) {
            toast.error('Please login to edit videos');
            navigate('/');
            return;
        }
        fetchVideo();
    }, [videoId, isAuthenticated, navigate]);

    /**
     * Fetch video details by ID
     */
    const fetchVideo = async () => {
        try {
            setLoading(true);
            const video = await getVideoById(videoId);

            // Populate form with video data
            setFormData({
                title: video.title || '',
                description: video.description || '',
                category: video.category || 'JavaScript'
            });

            // Set current thumbnail URL
            if (video.thumbnailUrl) {
                const thumbUrl = typeof video.thumbnailUrl === 'object'
                    ? video.thumbnailUrl.url
                    : video.thumbnailUrl;
                setCurrentThumbnail(thumbUrl);
            }

            setLoading(false);
        } catch (error) {
            toast.error('Failed to load video details');
            navigate('/');
        }
    };

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
     * Handle form submission to update video
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        try {
            setSaving(true);

            // Prepare FormData
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('description', formData.description.trim());
            formDataToSend.append('category', formData.category);

            // Include thumbnail if selected
            if (thumbnailFile) {
                formDataToSend.append('thumbnail', thumbnailFile);
            }

            // Update video via API
            await updateVideo(videoId, formDataToSend);

            toast.success('Video updated successfully!');
            navigate(`/video/${videoId}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update video');
        } finally {
            setSaving(false);
        }
    };

    /**
     * Loading spinner while fetching video data
     */
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex pt-14">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <main className="flex-1 lg:ml-20 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading video...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex pt-14">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 lg:ml-20 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Page header */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h1 className="text-2xl font-bold mb-2">Edit Video</h1>
                            <p className="text-gray-600">Update your video details</p>
                        </div>

                        {/* Edit form */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                            {/* Thumbnail */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Thumbnail</label>
                                <div className="space-y-3">
                                    {/* Show current or new thumbnail */}
                                    <img
                                        src={thumbnailPreview || currentThumbnail || 'https://via.placeholder.com/640x360'}
                                        alt="Thumbnail"
                                        loading="lazy"
                                        className="w-full aspect-video object-cover rounded-lg"
                                    />
                                    {/* Upload button */}
                                    <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <Image className="w-4 h-4" />
                                        Change Thumbnail
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailSelect}
                                            className="hidden"
                                            disabled={saving}
                                        />
                                    </label>
                                    {thumbnailFile && (
                                        <p className="text-sm text-green-600">New thumbnail selected</p>
                                    )}
                                </div>
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
                                    disabled={saving}
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
                                    disabled={saving}
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
                                    disabled={saving}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit buttons */}
                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/video/${videoId}`)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default EditVideo;