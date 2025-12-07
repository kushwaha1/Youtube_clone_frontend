import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { subscribeChannel, unsubscribeChannel, checkSubscription } from '../services/api';
import { useSelector } from 'react-redux';

export const useSubscription = (channelId, initialCount = 0) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(initialCount);

  const hasFetched = useRef(false);

  // Fetch subscription status from backend
  useEffect(() => {
    if (!channelId || !isAuthenticated || hasFetched.current) return;
    hasFetched.current = true;
    const fetchSubscription = async () => {
      try {
        const data = await checkSubscription(channelId);
        if (data.success) {
          setIsSubscribed(data.isSubscribed);
          setSubscriberCount(data.subscribers);
        }
      } catch (err) {
        toast.error('Failed to fetch subscription status');
      }
    };
    fetchSubscription();
  }, [channelId, isAuthenticated]);

  // Toggle subscribe/unsubscribe
  const toggleSubscription = async () => {
    try {
      if (isSubscribed) {
        const data = await unsubscribeChannel(channelId);
        if (data.success) {
          setIsSubscribed(false);
          setSubscriberCount(prev => prev - 1);
          toast.success('Unsubscribed successfully');
        } else {
          toast.error(data.message);
        }
      } else {
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

  return { isSubscribed, subscriberCount, toggleSubscription };
};