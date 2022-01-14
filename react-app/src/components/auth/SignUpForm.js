import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, Link } from 'react-router-dom';
import { signUp } from '../../store/session';

const SignUpForm = () => {
  const history = useHistory(); // so that we can redirect after the image upload is successful
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false)
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    let imageUrl = '';

    setImageLoading(true);
    if(image) {
      const res = await fetch('/api/images', {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        imageUrl = await res.json();
        setImageLoading(false);
        history.push("/images");
        if (password === repeatPassword) {
          const data = await dispatch(signUp(username, email, password, imageUrl));
          if (data) {
            setErrors(data)
          }
        }
      }
      else {
        setImageLoading(false);
        // a real app would probably use more advanced
        // error handling
        console.log("error");
      }
    }
    else {
      imageUrl = {'url': 'https://humbleimages.s3.amazonaws.com/68f2472108db4b15a928a7ca82035a9d.png'};
      setImageLoading(false);
      history.push("/images");
      if (password === repeatPassword) {
        const data = await dispatch(signUp(username, email, password, imageUrl));
        if (data) {
          setErrors(data)
        }
      }
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  const updateImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  }

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='user_auth_page'>
      <form className='user_auth_form' id='signup_form' onSubmit={onSignUp}>
        <div className='user_auth_main_section' id='signup_form_layout'>
          <h2 className='user_auth_welcome'>Create An Account</h2>
          <div>
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div className='user_auth_input'>
            <label>User Name</label>
            <input
              type='text'
              name='username'
              onChange={updateUsername}
              value={username}
            ></input>
          </div>
          <div className='user_auth_input'>
            <label>Email</label>
            <input
              type='text'
              name='email'
              onChange={updateEmail}
              value={email}
            ></input>
          </div>
          <div className='user_auth_input'>
            <label>Password</label>
            <input
              type='password'
              name='password'
              onChange={updatePassword}
              value={password}
            ></input>
          </div>
          <div className='user_auth_input'>
            <label>Repeat Password</label>
            <input
              type='password'
              name='repeat_password'
              onChange={updateRepeatPassword}
              value={repeatPassword}
              required={true}
            ></input>
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={updateImage}
              id='profile_pic_picker'
            />
          </div>
          <button type='submit'>Sign Up</button>
          {(imageLoading) && <p>Loading...</p>}
          <p className='login_signup_switch_text'><Link to='/login'>Already have an account?</Link></p>

        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
