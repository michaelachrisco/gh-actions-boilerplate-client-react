import { FC, useState } from 'react';
import { NavLinkConfig } from 'features/navbar';
import { CustomNavLink } from 'features/navbar/components/CustomNavLink';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavCategory = styled.div`
  display: block;
  &:not(:last-of-type) {
    border-bottom: 1px solid ${props => props.theme.buttons.defaultBackgroundColor};
  }

  & > .category {
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${props => props.theme.pages.p};
    transition: all 0.15s ease;

    &:hover {
      color: ${props => props.theme.textColor};
    }

    span {
      flex: 1;

      &.active {
        color: ${props => props.theme.textColor};
        font-weight: 600;
      }
    }

    svg {
      transition: all 0.15s ease;
    }
  }

  & > .content {
    visibility: hidden;
    max-height: 0;
    padding: 0 1rem;
    transition: all 0.15s ease;
    overflow: hidden;
    background: ${props => props.theme.backgroundColor};

    label {
      color: ${props => props.theme.textColor};
      font-weight: normal;
      font-size: 0.9rem;
    }
  }

  &.open {
    & > .category {
      color: ${props => props.theme.textColor};

      svg {
        transform: rotateZ(180deg);
      }
    }

    & > .content {
      visibility: visible;
      max-height: 250px;
      padding: 0 1rem 1rem;
    }
  }
`;

type Props = {
  navCategoryMap: { [key: string]: NavLinkConfig[] };
  initiallyOpenedCategory: string | null;
  closeVerticalNav?: () => void;
};

export const NavDropdown: FC<Props> = ({ navCategoryMap, initiallyOpenedCategory, closeVerticalNav }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(initiallyOpenedCategory);
  const categories = Object.keys(navCategoryMap);

  const toggleCategory = (categoryName: string) => {
    if (openCategory === categoryName) {
      setOpenCategory(null);
    } else setOpenCategory(categoryName);
  };

  return (
    <>
      {categories.map(category => (
        <NavCategory key={category} className={openCategory === category ? 'open' : ''}>
          <div role='button' tabIndex={-1} className='category' onClick={() => toggleCategory(category)}>
            <span className={category === openCategory ? 'active' : ''}>{category}</span>
            <FontAwesomeIcon icon='chevron-down' />
          </div>

          <div className='content'>
            {navCategoryMap[category].map(link => (
              <CustomNavLink handleSamePathNavigate={closeVerticalNav} key={link.id} link={link} />
            ))}
          </div>
        </NavCategory>
      ))}
    </>
  );
};
