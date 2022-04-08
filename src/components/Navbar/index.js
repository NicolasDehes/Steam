import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './NavbarElements';
  
const Navbar = () => {
  return (
    <>
      <Nav>
        <Bars />
  
        <NavMenu>
          <NavLink to='/about' activeStyle>
            A propos
          </NavLink>
          <NavLink to='/jeux' activeStyle>
            Jeux
          </NavLink>
          <NavLink to='/sign-up' activeStyle>
            Enregistrement
          </NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/sign-in'>Connexion</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};
  
export default Navbar;