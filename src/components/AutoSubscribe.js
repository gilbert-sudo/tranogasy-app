// AutoSubscribe.js
import { useEffect } from 'react';
import { withWonderPush } from 'react-wonderpush';

function AutoSubscribe({ wonderPush }) {
  useEffect(() => {
    const handleUserInteraction = () => {
      // Prevent multiple triggers
      if (window._wonderPushSubscribed) return;
      window._wonderPushSubscribed = true;

      setTimeout(() => {
        if (wonderPush && wonderPush.subscribeToNotifications) {
          wonderPush.subscribeToNotifications();
        }
      }, 1000);

      // Clean up listeners
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('scroll', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
    };
  }, [wonderPush]);

  return null;
}

export default withWonderPush(AutoSubscribe, { waitWonderPushReady: true });
