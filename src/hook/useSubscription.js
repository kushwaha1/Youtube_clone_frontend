import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { subscribeChannel, unsubscribeChannel, checkSubscription } from '../services/api';
import { useSelector } from 'react-redux';

export const useSubscription = (channelId, initialCount = 0) => {
  // Check if user is logged in
  const { isAuthenticated } = useSelector(state => state.auth);

  // Track whether current user is subscribed
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Store total subscribers count
  const [subscriberCount, setSubscriberCount] = useState(initialCount);

  // Prevent API call from running multiple times
  const hasFetched = useRef(false);

  // Fetch subscription status when channelId & auth are available
  useEffect(() => {
    if (!channelId || !isAuthenticated || hasFetched.current) return;

    hasFetched.current = true;

    const fetchSubscription = async () => {
      try {
        // API call to check user subscription status
        const data = await checkSubscription(channelId);

        if (data.success) {
          setIsSubscribed(data.isSubscribed);   // update subscribe state
          setSubscriberCount(data.subscribers); // update subscriber count
        }
      } catch (err) {
        toast.error('Failed to fetch subscription status');
      }
    };

    fetchSubscription();
  }, [channelId, isAuthenticated]);

  // Subscribe / Unsubscribe logic
  const toggleSubscription = async () => {
    try {
      // If already subscribed → unsubscribe
      if (isSubscribed) {
        const data = await unsubscribeChannel(channelId);

        if (data.success) {
          setIsSubscribed(false);
          setSubscriberCount(prev => prev - 1);
          toast.success('Unsubscribed successfully');
        } else {
          toast.error(data.message);
        }
      }
      // If not subscribed → subscribe
      else {
        const data = await subscribeChannel(channelId);

        if (data.success) {
          setIsSubscribed(true);
          setSubscriberCount(prev => prev + 1);
          toast.success('Subscribed successfully');
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  // Expose values to component
  return { isSubscribed, subscriberCount, toggleSubscription };
};