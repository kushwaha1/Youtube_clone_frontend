import React, { useState } from 'react';
import { X, Upload, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import "../AuthModal/AuthModal.css"
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../../utils/AuthSlice';

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const dispatch = useDispatch();
    const [mode, setMode] = useState(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        userName: '',
        email: '',
        password: '',
        avatar: null
    });
    const [avatarPreview, setAvatarPreview] = useState(null);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // File size check (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Avatar size should be less than 2MB');
                return;
            }

            // File type check
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            setFormData({ ...formData, avatar: file });
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        if (mode === 'register') {

            // Name validation
            if (!formData.name) {
                toast.error('Name is required');
                return false;
            }

            if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
                toast.error('Name can only contain letters and spaces');
                return false;
            }

            if (formData.name.trim().length < 2 || formData.name.trim().length > 50) {
                toast.error('Name must be between 2 and 50 characters');
                return false;
            }

            // Username validation
            if (!formData.userName) {
                toast.error('Username is required');
                return false;
            }

            // Email validation
            if (!formData.email) {
                toast.error('Email is required');
                return false;
            }
            if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
                toast.error('Invalid email format');
                return false;
            }

            // Password validation
            if (!formData.password) {
                toast.error('Password is required');
                return false;
            }
            if (formData.password.length < 8) {
                toast.error('Password must be at least 8 characters');
                return false;
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/;
            if (!passwordRegex.test(formData.password)) {
                toast.error('Password must contain uppercase, lowercase, number, and special character');
                return false;
            }

        } else {
            // Login validation
            if (!formData.email || !formData.password) {
                toast.error('Email and password are required');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

            if (mode === 'register') {
                // Register API call
                const formDataToSend = new FormData();
                formDataToSend.append('name', formData.name);
                formDataToSend.append('userName', formData.userName);
                formDataToSend.append('email', formData.email);
                formDataToSend.append('password', formData.password);
                if (formData.avatar) {
                    formDataToSend.append('avatar', formData.avatar);
                }
                console.log("body", formData);


                const { data } = await axios.post(`${API_URL}/auth/register`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                toast.success('Registration successful! Please login.');
                setMode('login');
                setFormData({ name:'', userName: '', email: '', password: '', avatar: null });
                setAvatarPreview(null);

            } else {
                // Login API call
                const { data } = await axios.post(`${API_URL}/auth/login`, {
                        email: formData.email,
                        password: formData.password
                    
                });

                // Dispatch Redux action
                dispatch(loginSuccess({
                    token: data.data.token,
                    user: {
                        id: data.data.id,
                        name: data.data.name,
                        userName: data.data.userName,
                        email: data.data.email,
                        avatar: data.data.avatar
                    }
                }));

                toast.success('Login successful!');
                onClose();

                // Reload page to update UI
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        } catch (err) {
            // Axios error handling
            const errorMessage = err.response?.data?.message || err.message || 'Something went wrong!';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-fadeIn p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative animate-slideUp custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative gradient header */}
                <div className="h-32 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 rounded-t-2xl relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    {/* YouTube logo in header */}
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center">
                            <svg className="w-12 h-12 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="pt-14 px-6 pb-6">
                    {/* Header Text */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {mode === 'login' ? 'Welcome Back!' : 'Join YouTube'}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {mode === 'login' ? 'Sign in to continue your journey' : 'Create your account to get started'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <>
                                {/* Avatar Upload */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload className="w-8 h-8 text-red-400" />
                                            )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors shadow-lg">
                                            <Upload className="w-4 h-4 text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                                    />
                                </div>


                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleInputChange}
                                        placeholder="Choose a unique username"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your.email@example.com"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                                    />
                                </div>
                            </>
                        )}

                        {mode === 'login' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-sm text-gray-500">or</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Toggle Mode */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                type="button"
                                onClick={() => {
                                    setMode(mode === 'login' ? 'register' : 'login');
                                    setFormData({ name: '', userName: '', email: '', password: '', avatar: null });
                                    setAvatarPreview(null);
                                }}
                                className="text-red-600 font-semibold hover:underline"
                            >
                                {mode === 'login' ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthModal;