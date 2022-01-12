import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { login } from '../../store/session';

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const demoLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login('demo@aa.io', 'password'));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/servers' />;
  }

  return (
    <div id='login_page'>
      <form id='login_form' onSubmit={onLogin}>
        <div id="login_main_section">
          <h2 id='login_welcome'>Welcome back!</h2>
          <h5 id='login_exited'>We're so excited to see you again!</h5>
          <div>
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div className='login_input'>
            <label htmlFor='email'>Email</label>
            <input
              name='email'
              type='text'
              placeholder='Email'
              value={email}
              onChange={updateEmail}
            />
          </div>
          <div className='login_input'>
            <label htmlFor='password'>Password</label>
            <input
              name='password'
              type='password'
              placeholder='Password'
              value={password}
              onChange={updatePassword}
            />
          </div>
          <button type='submit'>Login</button>
          <button onClick={demoLogin}>Login with Demo</button>


          <p className='login_signup_switch_text'>Need an account? <Link to='/sign-up'>Register</Link></p>
        </div>
        <img id='login_logo' src="https://media.discordapp.net/attachments/927725788231520256/928025179735613511/logo.png" alt="harmony logo" />
      </form>
    </div>
  );
};

export default LoginForm;
