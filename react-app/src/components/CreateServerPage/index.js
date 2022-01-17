import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as serverActions from '../../store/server'
import { useHistory } from 'react-router';


function CreateServerPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [server_name, setServer_name] = useState("")
  const [errors, setErrors] = useState([]);
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const session = useSelector(state => state.session);
  // const [server_image, setServer_image] = useState("")
  const currentUser = session.user.id


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (server_name.length < 5 || server_name.length > 100) {
      setErrors(['Server name must be between 5 and 100 characters'])
    }
    else {
      const formData = new FormData();
      formData.append("image", image);

      let imageUrl = '';

      setImageLoading(true);
      const res = await fetch('/api/images', {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const response = await res.json();
        imageUrl = response.url
        setImageLoading(false);
      }
      else {
        setImageLoading(false);
        // a real app would probably use more advanced
        // error handling
      }
      setErrors([])
      history.push('/servers')
      return dispatch(serverActions.createAServer( server_name, imageUrl, currentUser ))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors.length > 0) setErrors(data.errors)
        })

    }
  }

  const updateImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  }

  const dropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.dataTransfer)
    let data = e.dataTransfer.files;
    console.log(data['0'])
    setImage(data['0']);
    e.target.style.backgroundColor = 'green'
    e.target.innerHTML = 'Image Selected'
  }

  function allowDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.style.backgroundColor = 'blue';

  }
  
  function revertDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.style.backgroundColor = '#202225';
  }


  return (
    <div className='create_server_page'>
      <form className= 'create_server_form' onSubmit={handleSubmit}>
        <div className='main_section'>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <h1 className='user_auth_welcome'>Create a Server!</h1>
        <div className='create_server_input'>
        <label>
          Server name
          <input
            type="text"
            name='server_name'
            value={server_name}
            onChange={(e) => setServer_name(e.target.value)}
            required
          />
        </label>
        </div>
        <div className='create_server_input'>
        
        <div className='drop_zone'
            className='drop_zone' 
            // type='file' 
            accept="image/*" 
            onDrop={dropHandler} 
            onDragOver={allowDrop}
            onDragLeave={revertDrop}
            >
            Drag and Drop Profile Image Here
        </div>
        </div>
        <button type="submit">Create Server</button>
        {(imageLoading) && <p>Loading...</p>}
        </div>
      </form>
    </div>
  )
}

export default CreateServerPage;
