import { notificationApi, useGetUnreadNotificationsQuery } from 'common/api/notificationApi';
import { AppNotification } from 'common/models/notifications';
import { environment } from 'environment';
import { useAuth } from 'features/auth/hooks';
import * as NotificationComponents from 'features/notifications/components';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

export const useLiveNotifications = () => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [oldNotifications, setOldNotifications] = useState<AppNotification[]>([]);
  const [nextNotificationUrl, setNextNotificationUrl] = useState<string | null>(null);

  const {
    data: unreadNotifications,
    isFetching,
    isLoading,
  } = useGetUnreadNotificationsQuery(nextNotificationUrl, {
    skip: !user,
  });

  // Append new notifications that we got from the API to
  // oldNotifications list
  useEffect(() => {
    setOldNotifications(o => [...o, ...(unreadNotifications?.results || [])]);
  }, [unreadNotifications, setOldNotifications]);

  // Set up receiving SSE events from the server.
  useEffect(() => {
    let eventSource: EventSource | null = null;
    if (user) {
      eventSource = new EventSource(`${environment.apiRoute}/events/${user!.id}/`, { withCredentials: true });
      eventSource.onmessage = message => {
        const payload = JSON.parse(message.data);
        setNotifications(n => [payload, ...n]);

        // Grab the component for the notification type
        const Component = (NotificationComponents as any)[payload.type];
        if (Component) {
          toast(<Component key={payload.id} notification={payload} />, { className: 'in-app-notification' });
        }
      };
    } else {
      // user no longer logged in.
      setNotifications([]);
      if (eventSource) {
        (eventSource as EventSource).close();
        eventSource = null;
      }
    }

    return () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    };
  }, [user, setNotifications]);

  const notificationProviderValue = useMemo(() => {
    console.log('RE-EVALUATE');
    const result = {
      notifications: [...notifications, ...oldNotifications],
      count: notifications.length + (unreadNotifications?.meta.count || 0), // I'm not so sure this is right.
      hasMore: !!unreadNotifications?.links.next,
      isFetching,
      isLoading,
      clear: () => {
        setNotifications([]);
        setNextNotificationUrl(null);
        setOldNotifications([]);
        notificationApi.util.resetApiState();
        console.log('SETTING EVERYTHING TO NOTHING');
      },
      getMore: () => {
        if (unreadNotifications?.links.next && !isFetching) {
          setNextNotificationUrl(unreadNotifications.links.next);
        }
      },
    };
    console.log(result);
    return result;
  }, [notifications, unreadNotifications, oldNotifications, isFetching, isLoading]);

  return notificationProviderValue;
};
