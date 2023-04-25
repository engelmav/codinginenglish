import styled from "@emotion/styled";
export const Nav = styled.nav`
  display: none;

  @media (min-width: 768px) {
    display: flex;
  }
`;

export const NavLink = styled.a`
  margin-left: 1rem;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  color: #fff;
  transition: color 0.3s;

  &:hover,
  &:focus {
    color: #777;
  }
`;

export const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%; // Adjust the width of the mobile nav drawer as desired
  max-width: 200px; // Optional: Set a maximum width for the mobile nav drawer
  background-color: rgba(
    17,
    17,
    17,
    0.95
  ); // Dark background with more transparency
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
  transform: translateX(${({ isOpen }) => (isOpen ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const MobileNavLink = styled(NavLink)`
  padding-top: 2rem;
  padding-left: 2rem;
`;

export const HamburgerButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
`;
export const MobileHamburgerButton = styled(HamburgerButton)`
  display: flex;
  background: none;
  border: none;
  cursor: pointer;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
`;

export const CloseIcon = styled.svg`
  width: 24px;
  height: 24px;
  stroke: #333;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;