# YouTube Clone - Frontend

## Project Overview

This project is the **Frontend of a YouTube Clone** built using **React.js**.  
It consumes REST APIs from the backend to provide a complete video streaming experience including authentication, video playback, channels, subscriptions, likes and comments.

The UI is designed to closely resemble YouTube with a clean, responsive, and user-friendly interface.


---

## Tech Stack

- **React.js** – UI library
- **Redux Toolkit** – Global state management
- **React Router DOM** – Client-side routing
- **Axios** – API communication
- **JWT** – Authentication handling
- **React Hot Toast** – Notifications
- **Lucide React** – Icons library
- **CSS / Tailwind CSS** – Styling
- **Cloudinary URLs** – Media rendering

---

## Features

### Authentication
- User registration & login with validation
- JWT-based authentication
- Protected routes (auth guard)
- Persistent login (token-based)
- Auto-logout on token expiry
- User profile dropdown menu

### Home & Video Feed
- Display all videos in responsive grid
- Video cards with thumbnail, title, channel & views
- Video category filtering (All, Javascript, CSS, etc.)
- Search videos by title
- Lazy loading for images
- Empty state for unauthenticated users

---

### Video Player Page
- Watch video with details
- Auto view-count increment
- Like / Dislike functionality
- Real-time like status (filled/outline icons)
- Subscribe button (hidden for own videos)
- Video description & metadata
- Related videos sidebar
- Owner controls (Edit/Delete for own videos)

---

### Channel Pages
- View channel profile with banner
- Channel owner info with avatar
- Channel videos grid with sorting
- Subscribe / Unsubscribe button
- Real-time subscriber count update
- Check subscription status
- My Channel dashboard
- Create channel modal with image upload
- Edit channel functionality
- Delete channel option

---

### Comments System
- View all comments on a video
- Add new comments
- Edit your own comments
- Delete your own comments
- Comment count display
- User avatar & name with each comment
- Report for other comments

---

### User Profile
- Upload / update avatar
- View owned channel
- Manage uploaded videos

---

### UI / UX
- YouTube-like modern interface
- Toast notifications for all actions
- Loading states with skeletons
- Error handling with user-friendly messages
- Mobile responsive design (mobile-first approach)
- Smooth animations and transitions
- Hover effects on interactive elements
- Sticky header with search bar
- Collapsible sidebar (hamburger menu)

### Setup Instructions
```bash
1. Clone or download this repository 
    (`git clone https://github.com/kushwaha1/Youtube_clone_frontend.git`).
2. Run command in vscode terminal `npm i` for installing packages.
3. Open vscode terminal and run `npm run dev`.
4. The app will now be running at `http://localhost:5173/`.

`**Note:**` - Make sure backend server is running on `http://localhost:5000`.

```

### API Integration

- Axios is used with a centralized API service
- JWT is automatically attached in headers
- Toast notifications show success/error states

**Key Features:**
- JWT token auto-attachment
- Request/Response interceptors
- Global error handling
- Toast notifications for errors
- Auto-redirect on 401 (Unauthorized)

**Available API Functions:**

**Auth:**
- `login(credentials)`
- `register(userData)`
- `getCurrentUser()`

**Videos:**
- `getAllVideos(params)`
- `getVideoById(id)`
- `uploadVideo(formData)`
- `updateVideo(id, data)`
- `deleteVideo(id)`
- `likeVideo(id)`
- `dislikeVideo(id)`
- `getLikeStatus(id)`
- `incrementViews(id)`

**Channels:**
- `getAllChannels()`
- `getChannelById(id)`
- `getMyChannel()`
- `createChannel(formData)`
- `updateChannel(id, formData)`
- `deleteChannel(id)`
- `subscribeToChannel(id)`
- `unsubscribeFromChannel(id)`
- `getSubscriptionStatus(id)`
- `getChannelVideos(userName, params)`

**Comments:**
- `getComments(videoId)`
- `addComment(data)`
- `updateComment(id, data)`
- `deleteComment(id)`

---

### Redux State Overview
```bash
authSlice.js
- User login/logout
- Store token & user data
- Auth status

```


### Protected Routes
- Create Channel (requires authentication)
- Upload Video (requires authentication)
- Like/Dislike (requires authentication)
- Subscribe (requires authentication)
- Comments (requires authentication)

### Styling
```bash
- Fully styled using Tailwind CSS.
- Responsive layouts for mobile, tablet, and desktop.
- Includes utility classes for buttons, inputs, etc.
```

## Custom Hooks

### `useSubscription(channelId)`
- Manages subscription state for channels

## Error Handling

- Global error boundary
- API error interceptors
- Toast notifications for errors
- Fallback UI for failed states
- 404 page for invalid routes

---