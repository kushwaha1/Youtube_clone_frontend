import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "./App";
import NotFound from "./pages/NotFound/NotFound";

/**
 * Lazy-loaded pages for code-splitting
 * Loaded only when the route is accessed
 */
const Home = lazy(() => import("./pages/Home/Home"));
const VideoPlayer = lazy(() => import("./pages/VideoPlayer/VideoPlayer"));
const Channel = lazy(() => import("./pages/Channel/Channel"));
const UploadVideo = lazy(() => import("./pages/UploadVideo/UploadVideo"));
const EditVideo = lazy(() => import("./pages/EditVideo/EditVideo"));

/**
 * PageLoader Component
 * Common spinner shown while lazy-loaded components are loading
 */
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

/**
 * Helper function to wrap lazy-loaded components in Suspense
 * @param {React.LazyExoticComponent} Component - lazy-loaded component
 * @returns JSX element wrapped in Suspense
 */
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

/**
 * Application routes
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(App), // Wrap App with Suspense
    children: [
      { path: "/", element: withSuspense(Home) },
      { path: "/video/:videoId", element: withSuspense(VideoPlayer) },
      { path: "/channel/:channelId", element: withSuspense(Channel) },
      { path: "/upload", element: withSuspense(UploadVideo) },
      { path: "/video/:videoId/edit", element: withSuspense(EditVideo) },
    ],
    errorElement: <NotFound />
  },
]);

export default router;