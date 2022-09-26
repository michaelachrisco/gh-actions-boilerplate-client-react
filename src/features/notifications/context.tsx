import { AppNotification } from 'common/models/notifications';
import { createContext, FC, PropsWithChildren, useMemo } from 'react';
import { useLiveNotifications } from './hooks/useLiveNotifications';
import { useNotifications } from './hooks/useNotifications';

export interface NotificationContextType {
  notifications: AppNotification[];
  count: number;
  hasMore: boolean;
  isFetching: boolean;
  isLoading: boolean;
  getMore: () => void;
  clear: () => void;
};

const initialNotificationContextState = {
  notifications: [],
  count: 0,
  hasMore: false,
  isFetching: false,
  isLoading: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getMore: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  clear: () => {},
}

// export const NotificationContext = createContext<NotificationContextType>({
//   notifications: [],
//   count: 0,
//   hasMore: false,
//   isFetching: false,
//   isLoading: true,
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   getMore: () => {},
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   clear: () => {},
// });

export const NotificationContext = createContext<{
  unreadNotificationsContext: NotificationContextType,
  readNotificationsContext: NotificationContextType
 }>({ 
  unreadNotificationsContext: initialNotificationContextState, 
  readNotificationsContext: initialNotificationContextState 
});

export const NotificationsProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  // const notificationProviderValue = useLiveNotifications();

  const unreadNotificationsContext = useNotifications('unread');
  const readNotificationsContext = useNotifications('read');

  const notificationProviderValue = useMemo(() => ({
    unreadNotificationsContext,
    readNotificationsContext
  }), [unreadNotificationsContext, readNotificationsContext]);

  return <NotificationContext.Provider value={notificationProviderValue}>{children}</NotificationContext.Provider>;
};
