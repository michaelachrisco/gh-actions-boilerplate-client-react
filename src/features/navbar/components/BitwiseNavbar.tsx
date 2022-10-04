import { faAtlas, faHomeAlt, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingButton } from 'common/components/LoadingButton';
import { environment } from 'environment';
import { EnvironmentConfiguration } from 'environment/types';
import { useAuth, useLogout } from 'features/auth/hooks';
import { useRbac } from 'features/rbac';
import { MoonIcon } from 'features/themes/MoonIcon';
import { SunIcon } from 'features/themes/SunIcon';
import { useTheme } from 'features/themes/useTheme';
import { FC } from 'react';
import { Badge, Button, Container, Modal, Nav, Navbar, NavDropdown, NavLink, Offcanvas } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useModal } from 'react-modal-hook';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { languages } from '../../../i18n/config';
import { Logo } from './Logo';
import { UserProfilePicture } from './UserProfilePicture';

const StyledNavbar = styled(Navbar)`
  position: fixed;
  margin-bottom: 1rem;
  width: 100%;
  background-color: ${props => props.theme.nav.horizontal.backgroundColor};
  backdrop-filter: blur(10px);
  z-index: 1030;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  margin-top: ${environment.environment === EnvironmentConfiguration.Staging ? '56px' : '0px'};
  padding: 0.8rem 0;

  .dropdown-item > svg {
    margin-inline-end: 0.5rem;
  }

  .nav-link.active,
  .dropdown-item.active {
    background: ${props => props.theme.nav.link.activeBackground};
    color: ${props => props.theme.nav.link.activeText};
  }

  .navbar-toggler {
    border: none;
  }

  .navbar-brand {
    color: ${props => props.theme.textColor};
  }

  .dropdown-toggle::after {
    margin-left: 0.25rem;
    color: ${props => props.theme.textColor};
  }

  .nav-link {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${props => props.theme.textColor};
    border-radius: ${props => props.theme.borderRadius};
    font-weight: 500;
    padding: 0.4rem;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;

    margin-right: 1rem;
    &:last-of-type {
      margin-right: 0;
    }

    &:hover {
      background: ${props => props.theme.nav.link.activeBackground};
      color: ${props => props.theme.nav.link.activeText};

      &:after {
        color: ${props => props.theme.nav.link.activeText};
      }
    }
  }
  .dropdown {
    display: flex;
  }

  .dropdown-menu {
    padding-top: 0;
    padding-bottom: 0;
    overflow: hidden;
  }

  .dropdown-header {
    border-bottom: 1px solid ${props => props.theme.nav.borderColor};
  }

  .navbar-brand {
    padding: 0;
    display: flex;
    align-items: center;
  }
  .navbar-brand img {
    width: 40px;
  }
`;

const StyledNavbarOffcanvas = styled(Navbar.Offcanvas)`
  background-color: ${props => props.theme.nav.vertical.backgroundColor};

  .offcanvas-header {
    background: ${props => props.theme.nav.horizontal.backgroundColor};
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .offcanvas-only {
    display: none;
  }

  &.show,
  &.offcanvas-toggling {
    .offcanvas-only {
      display: inline-block;
    }

    .offcanvas-body {
      display: flex;
      flex-direction: column;

      .major-dropdowns {
        display: flex;
        flex-direction: column;
        justify-content: start;
        flex-grow: 1;
      }

      .dropdown-item {
        padding: 1rem 0rem 1rem 1rem;
      }

      .dropdown-item > svg {
        margin-inline-end: 0.5rem;
      }

      .dropdown-item.active {
        background: ${props => props.theme.nav.link.activeBackground};
        color: ${props => props.theme.nav.link.activeText};
        border-radius: ${props => props.theme.borderRadius};
      }

      a.nav-link {
        padding: 1rem 0rem 1rem 0rem;
      }
    }

    .navbar-nav {
      flex: 1 !important;
    }

    .dropdown-menu {
      position: relative;
      top: 0;
      width: 100%;
      padding-top: 0;
      padding-bottom: 0;
    }

    .dropdown-toggle {
      display: flex;
      align-items: center;
      flex-direction: row;
    }

    .theme-toggle {
      padding: 1rem 0;
      position: absolute;
      right: 2rem;
      top: 3px;
    }
  }
`;

export const BitwiseNavbar: FC = () => {
  const { user } = useAuth();
  const { userHasPermission } = useRbac();
  const location = useLocation();
  const navigate = useNavigate();
  const { toggle, theme } = useTheme();
  const { logout, isLoading } = useLogout();
  const { i18n } = useTranslation();
  const [showModal, hideModal] = useModal(
    ({ in: open, onExited }) => {
      return (
        <Modal show={open} onHide={hideModal} onExited={onExited}>
          <Modal.Header closeButton>
            <Modal.Title>Sign Out</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to sign out?</Modal.Body>
          <Modal.Footer>
            <Button variant='link' onClick={hideModal}>
              Cancel
            </Button>
            <LoadingButton className='action-shadow' loading={isLoading} variant='primary' onClick={() => logout()}>
              <FontAwesomeIcon icon='sign-out-alt' /> Sign Out
            </LoadingButton>
          </Modal.Footer>
        </Modal>
      );
    },
    [isLoading],
  );

  const changeLanguage = (ln: string) => {
    localStorage.setItem('language', ln);
    i18n.changeLanguage(ln);
  };

  const __languageOptions = languages.map(language => {
    return { label: language.label, value: language.shortcode };
  });

  const defaultLanguageOption = __languageOptions.find(language => language.value === i18n.languages[0]);

  return (
    <StyledNavbar expand='md'>
      <Container>
        <Navbar.Brand onClick={() => navigate('/agents')}>
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='offcanvasNavbar-expand-md' />
        <StyledNavbarOffcanvas
          id='offcanvasNavbar-expand-md'
          aria-labelledby='offcanvasNavbarLabel-expand-md'
          placement='end'
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id='offcanvasNavbarLabel-expand-md'>Starter Project</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className='justify-content-start flex-grow-1 pe-3'>
              {userHasPermission('agent:read') ? (
                <NavLink
                  onClick={() => navigate('/agents')}
                  className={location.pathname === '/agents' ? 'active me-3' : 'me-3'}
                >
                  <FontAwesomeIcon className='me-2' icon={faHomeAlt} />
                  Directory
                </NavLink>
              ) : null}
              {userHasPermission('user:read') ? (
                <NavDropdown
                  title={
                    <div>
                      <FontAwesomeIcon className='me-2' icon={faAtlas} />
                      Administration
                    </div>
                  }
                >
                  <NavDropdown.Item onClick={() => navigate('/users')} active={location.pathname === '/users'}>
                    <FontAwesomeIcon icon='user' />
                    Users
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}
            </Nav>

            <Nav className='justify-content-end'>
              <NavLink onClick={() => toggle()} className='theme-toggle me-3 d-flex align-items-center'>
                <>{theme === 'light' ? <MoonIcon /> : <SunIcon />}</>
              </NavLink>

              <NavDropdown
                align='end'
                title={
                  <>
                    <FontAwesomeIcon className='me-2' size='lg' icon={faLanguage} />
                    {defaultLanguageOption?.label}
                  </>
                }
                className='me-3'
              >
                {__languageOptions.map(option => (
                  <NavDropdown.Item onClick={() => changeLanguage(option.value)}>{option.label}</NavDropdown.Item>
                ))}
              </NavDropdown>

              {user ? (
                <NavDropdown
                  align='end'
                  title={
                    <>
                      <UserProfilePicture user={user} size='xs' radius={24} />
                      <span className='offcanvas-only'>
                        {user.firstName} {user.lastName.charAt(0)}.
                      </span>
                    </>
                  }
                >
                  <NavDropdown.Header className='d-flex align-items-center'>
                    <UserProfilePicture user={user} size='xs' radius={32} />
                    <div>
                      <div>
                        {user.firstName} {user.lastName.charAt(0)}.
                      </div>
                      <Badge pill>{user.role}</Badge>
                    </div>
                  </NavDropdown.Header>
                  <NavDropdown.Item onClick={() => navigate(`/user/profile/${user.id}`)}>
                    <FontAwesomeIcon icon='user' />
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => showModal()}>
                    <FontAwesomeIcon icon='sign-out-alt' />
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}
            </Nav>
          </Offcanvas.Body>
        </StyledNavbarOffcanvas>
      </Container>
    </StyledNavbar>
  );
};
