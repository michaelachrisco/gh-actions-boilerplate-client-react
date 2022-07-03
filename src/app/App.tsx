import { ErrorBoundary } from '@sentry/react';
import { Layout } from 'common/components/Layout';
import { NotFoundView } from 'common/components/NotFoundView';
import { Role } from 'common/models';
import { BannerContentWrapper } from 'common/styles/utilities';
import { environment } from 'environment';
import { AgentRoutes } from 'features/agent-dashboard';
import { AuthRoutes, RequireAuth } from 'features/auth';
import { useAuth } from 'features/auth/hooks';
import { ConfirmationModal } from 'features/confirmation-modal';
import { UserRoutes } from 'features/user-dashboard';
import { UpdateUserProfilePage } from 'features/user-profile/pages/UpdateUserProfilePage';
import { FC, useEffect, useState } from 'react';
import { Navigate, Route, Routes, Link } from 'react-router-dom';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import AppTheme from 'utils/styleValues';
import { GlobalStyle } from '../GlobalStyle';
import * as notificationService from 'common/services/notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Stuff = () => {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return () => null;

    const src = new EventSource(`http://localhost:8000/events/${user.id}/`, { withCredentials: true });

    src.onmessage = msg => {
      const data = JSON.parse(msg.data);

      switch (data.type) {
        case 'AgentCreatedNotification':
          toast(
            <div className='d-flex justify-content-end align-items-center'>
              <FontAwesomeIcon className='mr-3' icon='circle-plus' />
              <div>
                New agent <Link to={`/agents/update-agent/${data.data.agent_id}`}>{data.data.agent_name}</Link> created
                by <Link to={`/users/update-user/${data.data.user_id}`}>{data.data.user_name}</Link>
              </div>
            </div>,
            {
              autoClose: false,
              closeOnClick: false,
              draggable: false,
              progress: undefined,
            },
          );
          break;
        default:
          break;
      }
    };

    return () => {
      src.close();
    };
  }, [user]);
  return <div></div>;
};

export const App: FC = () => (
  <ErrorBoundary>
    <ThemeProvider theme={AppTheme}>
      <ConfirmationModal />

      <Stuff />
      <ToastContainer
        autoClose={5000}
        closeButton
        closeOnClick
        newestOnTop
        hideProgressBar={false}
        position={toast.POSITION.TOP_RIGHT}
        role='alert'
        theme='light'
        limit={3}
        transition={Slide}
      />

      <BannerContentWrapper bannerShowing={environment.environment === 'staging'}>
        <Routes>
          <Route path='/auth/*' element={<AuthRoutes />} />
          <Route
            path='/user/profile/:id'
            element={
              <RequireAuth>
                <Layout>
                  <UpdateUserProfilePage />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path='/agents/*'
            element={
              <RequireAuth>
                <AgentRoutes />
              </RequireAuth>
            }
          />
          <Route
            path='/users/*'
            element={
              <RequireAuth allowedRoles={[Role.ADMIN]}>
                <UserRoutes />
              </RequireAuth>
            }
          />
          <Route path='/' element={<Navigate to='/agents' />} />
          <Route path='*' element={<NotFoundView />} />
        </Routes>
      </BannerContentWrapper>
    </ThemeProvider>
    <GlobalStyle />
  </ErrorBoundary>
);
