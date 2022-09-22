import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMarkAllReadMutation } from 'common/api/notificationApi';
import { LoadingButton } from 'common/components/LoadingButton';
import { LoadingSpinner } from 'common/components/LoadingSpinner';
import { AppNotification } from 'common/models/notifications';
import { PageHeader, SmallContainer } from 'common/styles/page';
import { NoContent } from 'common/styles/utilities';
import { FC, useContext, useEffect, useRef } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import * as NotificationComponents from '../components';
import { NotificationContext, NotificationContextType } from '../context';

interface Props {
    notificationContext: NotificationContextType;
}

export const NotificationListViewNew: FC<Props> = ({ notificationContext: { notifications, hasMore, isFetching, isLoading, getMore } }) => {
  const scrollElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading)
      return () => {
        console.log('not loaded yet');
      };

    const element = scrollElement.current;

    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) getMore();
    }, {});
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [scrollElement, getMore, hasMore, isLoading, isFetching, notifications]);

  const renderNotification = (notification: AppNotification) => {
    // Dynamic dispatch.
    const Component = (NotificationComponents as any)[notification.type];
    console.assert(
      Component,
      `Could not find notification display component ${notification.type} in notifications/components.tsx\nMake sure to define a handler in that file`,
    );
    if (!Component) {
      // No component for type found.
      return <></>;
    }
    return <Component notification={notification} />;
  };

  return (
    <>
      {!isLoading && notifications.length === 0 ? (
        <Card>
          <NoContent>
            <FontAwesomeIcon className='text-muted' size='2x' icon={['fas', 'bell']} />
            <p className='lead mb-0'>No Notifications</p>
          </NoContent>
        </Card>
      ) : null}

      {notifications.map(notification => (
        <Card key={notification.id} className='mb-3'>
          <Card.Body>{renderNotification(notification)}</Card.Body>
        </Card>
      ))}

      <div hidden={!hasMore} ref={scrollElement}>
        <LoadingSpinner />
      </div>
    </>
  );
};
