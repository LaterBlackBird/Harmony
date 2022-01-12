
import React from 'react';
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';

const NavBar = () => {
  let userLinks;
  const user = useSelector(state => state.session.user);

  if (!user) {
    userLinks = (
      <>
        <NavLink to='/login' exact={true} activeClassName='active'>Login</NavLink>
        <NavLink to='/sign-up' exact={true} activeClassName='active'>Sign Up</NavLink>
      </>
    )
  } else {
    userLinks = (
      <>
        <NavLink to='/users' exact={true} activeClassName='active'>Users</NavLink>
        <LogoutButton />
      </>
    )
  }

  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/servers' exact={true} activeClassName='active'>Home</NavLink>
          <NavLink to='/channels/1/messages' exact={true} activeClassName='active'>Messages</NavLink>
          {userLinks}
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
