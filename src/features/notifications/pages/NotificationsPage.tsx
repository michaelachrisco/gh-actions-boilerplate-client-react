import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMarkAllReadMutation } from 'common/api/notificationApi';
import { LoadingButton } from 'common/components/LoadingButton';
import { LoadingSpinner } from 'common/components/LoadingSpinner';
import { AppNotification } from 'common/models/notifications';
import { PageHeader, PageNav, SmallContainer } from 'common/styles/page';
import { NoContent } from 'common/styles/utilities';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import * as NotificationComponents from '../components';
import { NotificationContext } from '../context';
import { NotificationListViewNew } from './NotificationListViewNew';

export const NotificationsPage: FC = () => {
  
  const { unreadNotificationsContext, readNotificationsContext } = useContext(NotificationContext);

  const [tab, setTab] = useState('unread');
  const [markAllRead, { isLoading }] = useMarkAllReadMutation();

  const handleMarkAllRead = async () => {
    await markAllRead();
    unreadNotificationsContext.clear();
    readNotificationsContext.clear();
  };

  return (
    <SmallContainer>
      <PageHeader>
        <div>
          <h1>
            <Trans i18nKey='notifications.title'>My Notifications</Trans>
          </h1>
          <p>
            <Trans i18nKey='notification.subheading'>Notifications that have been sent to me.</Trans>
          </p>
        </div>
        <div>
          <LoadingButton onClick={() => handleMarkAllRead()} loading={isLoading}>
            Mark all Read
          </LoadingButton>
        </div>
      </PageHeader>
      
      <Row>
        <Col md={3}>
          <PageNav defaultActiveKey='/home'>
            <PageNav.Link onClick={() => setTab('unread')} className={tab === 'unread' ? 'active' : ''}>
              Unread{' '}
              <Badge className='ms-1 me-2' pill bg='secondary'>
                { unreadNotificationsContext.count }
              </Badge>
            </PageNav.Link>
            <PageNav.Link onClick={() => setTab('read')} className={tab === 'read' ? 'active' : ''}>
              Read{' '}
              <Badge className='ms-1 me-2' pill bg='secondary'>
                { readNotificationsContext.count }
              </Badge>
            </PageNav.Link>
          </PageNav>
        </Col>

        <Col>
          <>
            {tab === 'unread' ? (
              // unread listview
              <NotificationListViewNew notificationContext={unreadNotificationsContext} />
            ) : (
              ''
            )}

            {tab === 'read' ? (
              // read listview
              <NotificationListViewNew notificationContext={readNotificationsContext} />
            ) : (
              ''
            )}
          </>
        </Col>
      </Row>
    </SmallContainer>
  );
};
