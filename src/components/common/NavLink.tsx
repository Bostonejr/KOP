/**
 * NavLink Component - Styled Navigation Link
 */

import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, isActive = false }) => {
  return (
    <Link
      to={to}
      style={{
        color: isActive ? '#C9A96E' : '#FFFFFF',
        fontFamily: "'Caudex', Georgia, serif",
        fontWeight: 700,
        fontSize: '16px',
        letterSpacing: '0.025em',
        textDecoration: 'none',
        position: 'relative',
        paddingBottom: '4px',
        borderBottom: isActive ? '1px solid #C9A96E' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#C9A96E';
        e.currentTarget.style.borderBottomColor = '#C9A96E';
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = '#FFFFFF';
          e.currentTarget.style.borderBottomColor = 'transparent';
        }
      }}
    >
      {children}
    </Link>
  );
};

export default NavLink;
