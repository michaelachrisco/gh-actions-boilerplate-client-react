import { notificationApi, useGetReadNotificationsQuery, useGetUnreadNotificationsQuery } from 'common/api/notificationApi';
import { AppNotification } from 'common/models/notifications';
import { environment } from 'environment';
import { useAuth } from 'features/auth/hooks';
import * as NotificationComponents from 'features/notifications/components';
import { useEffect, useMemo, useReducer } from 'react';
import { toast } from 'react-toastify';

const initialNotificationState: NotificationStateType = {
  notifications: [] as AppNotification[],
  oldNotifications: [] as AppNotification[],
  nextNotificationUrl: null
}

interface NotificationStateType {
  notifications: AppNotification[];
  oldNotifications: AppNotification[];
  nextNotificationUrl: string | null;
}

interface NotificationAction {
  type: string;
  notification?: AppNotification;
  nextNotificationUrl?: string;
  fetchedNotifications?: AppNotification[];
}

const notificationReducer = (state: NotificationStateType, action: NotificationAction): NotificationStateType => {
  switch (action.type) {
    case 'clear':
      return initialNotificationState;
    case 'logged out':
      return { ...state, notifications: [] };
    case 'getMore':
      return { ...state, nextNotificationUrl: action.nextNotificationUrl ?? null };
    case 'received notification SSE':
      return { ...state, notifications: action.notification ? [ action.notification, ...state.notifications ] : state.notifications };
    case 'received new notifications':
      return { ...state, oldNotifications: action.fetchedNotifications ? [ ...state.oldNotifications, ...action.fetchedNotifications ] : state.oldNotifications };
    default:
      throw new Error();
  }
}

export const useNotifications = (type: string) => {
  const { user } = useAuth();

  const [notificationState, notificationDispatch] = useReducer(notificationReducer, initialNotificationState);

  const {
    data: unreadNotifications,
    isFetching: isFetchingUnreadNotifications,
    isLoading: isLoadingUnreadNotifications,
  } = useGetUnreadNotificationsQuery(notificationState.nextNotificationUrl, {
    skip: type === 'read' || !user,
  });

  const {
    data: readNotifications,
    isFetching: isFetchingReadNotifications,
    isLoading: isLoadingReadNotifications,
  } = useGetReadNotificationsQuery(notificationState.nextNotificationUrl, {
    skip: type === 'unread' || !user
  });

  const getNotificationValuesBasedOnType = (type: string) => {
    if (type === 'unread') {
        return { notifications: unreadNotifications, isFetching: isFetchingUnreadNotifications, isLoading: isLoadingUnreadNotifications };
    }

    return { notifications: readNotifications, isFetching: isFetchingReadNotifications, isLoading: isLoadingReadNotifications };
  }

  // Append new notifications that we got from the API to
  // oldNotifications list
  useEffect(() => {
    notificationDispatch({ type: 'received new notifications', fetchedNotifications: getNotificationValuesBasedOnType(type).notifications?.results || [] });
  }, [unreadNotifications, readNotifications]);

  // Set up receiving SSE events from the server.
  useEffect(() => {
    let eventSource: EventSource | null = null;
    if (user && type === 'unread') {
      eventSource = new EventSource(`${environment.apiRoute}/events/${user!.id}/`, { withCredentials: true });
      eventSource.onmessage = message => {
        console.log('message received');
        console.log('data:', message.data);
        const payload = JSON.parse(message.data);
        notificationDispatch({ type: 'received notification SSE', notification: payload });

        // Grab the component for the notification type
        const Component = (NotificationComponents as any)[payload.type];
        if (Component) {
          toast(<Component key={payload.id} notification={payload} />, { className: 'in-app-notification' });
        }
      };
    } else {
      // user no longer logged in.
      notificationDispatch({ type: 'logged out' });
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
  }, [user]);

  const notifications = getNotificationValuesBasedOnType(type).notifications;
  const isFetching = getNotificationValuesBasedOnType(type).isFetching;
  const isLoading = getNotificationValuesBasedOnType(type).isLoading;

  const notificationProviderValue = useMemo(() => {
    console.log('RE-EVALUATE');

    const result = {
      notifications: [...notificationState.notifications, ...notificationState.oldNotifications],
      count: notificationState.notifications.length + (notifications?.meta.count || 0),
      hasMore: !!notifications?.links.next,
      isFetching: isFetching,
      isLoading: isLoading,
      clear: () => {
        notificationDispatch({ type: 'clear' });
        notificationApi.util.resetApiState();
        console.log('SETTING EVERYTHING TO NOTHING');
      },
      getMore: () => {
        if (notifications?.links.next && !getNotificationValuesBasedOnType(type).isFetching) {
          notificationDispatch({ type: 'getMore', nextNotificationUrl: notifications.links.next });
        }
      },
    };
    console.log(result);
    return result;
  }, [notifications, isFetching, isLoading, notificationState.notifications, notificationState.oldNotifications]);

  return notificationProviderValue;
};
