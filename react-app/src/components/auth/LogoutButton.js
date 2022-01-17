import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import { useHistory } from 'react-router-dom';

const LogoutButton = ({socket}) => {
  const dispatch = useDispatch()
  const history = useHistory();
  const onLogout = async (e) => {
    await dispatch(logout());
    socket.disconnect();
    history.push('/login');

  };

  return <button onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
