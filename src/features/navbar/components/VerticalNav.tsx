import { CustomSelect } from 'common/components/CustomSelect';
import { BitwiseNavbar } from 'common/styles/page';
import { useAuth } from 'features/auth/hooks';
import { NotificationContext } from 'features/notifications/context';
import { FC, useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import { useTranslation } from 'react-i18next';
import { languages } from '../../../i18n/config';
import { ThemeToggle } from '../../themes/ToggleSwitch';
import { useLogoutModal } from '../hooks/useLogoutModal';
import { useNavLinks } from '../hooks/useNavLinks';
import { CustomNavAction, CustomNavLink } from './CustomNavLink';
import { Logo } from './Logo';
import { NavUserDetails } from './NavUserDetails';

type Props = {
  closeVerticalNav?: () => void;
};

type LanguageOption = {
  label: string;
  value: string;
};

export const VerticalNav: FC<Props> = ({ closeVerticalNav }) => {
  const { user } = useAuth();
  const navLinks = useNavLinks();
  const { openLogoutModal } = useLogoutModal();
  const { i18n } = useTranslation();
  const { count } = useContext(NotificationContext);

  const changeLanguage = (ln: string) => {
    localStorage.setItem('language', ln);
    i18n.changeLanguage(ln);
  };

  const __languageOptions = languages.map(language => {
    return { label: language.label, value: language.shortcode };
  });

  const defaultLanguageOption = __languageOptions.find(language => language.value === i18n.languages[0]);

  return (
    <BitwiseNavbar className='flex-column py-0'>
      <div className='position-relative w-100'>
        <Logo />
        <ThemeToggle />
      </div>
      {user ? (
        <div className='nav-wrap w-100'>
          <Nav className='flex-column'>
            {navLinks.map(link => (
              <CustomNavLink handleSamePathNavigate={closeVerticalNav} key={link.id} link={link} />
            ))}
          </Nav>
          <Nav className='flex-column'>
            <div className='w-100 py-3 justify-content-md-start'>
              <CustomSelect<LanguageOption>
                placeholder='Choose Language'
                options={__languageOptions}
                defaultValue={defaultLanguageOption}
                onChange={option => changeLanguage(option.value)}
              />
            </div>

            <div className='mb-3'>
              <NavUserDetails user={user} />
            </div>
            <CustomNavLink
              handleSamePathNavigate={closeVerticalNav}
              key='notifications'
              link={{ id: 99, icon: 'bell', label: 'Notifications', path: '/notifications' }}
              badge={count > 0 ? count.toString() : undefined}
            />
            <CustomNavAction onClick={openLogoutModal} label='Sign Out' icon='sign-out-alt' />
          </Nav>
        </div>
      ) : (
        <></>
      )}
    </BitwiseNavbar>
  );
};
