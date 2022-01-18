import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as serverActions from '../../store/server'
import { useHistory } from 'react-router';

function EditServerPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [server_name, setServer_name] = useState("")
  // const [server_image, setServer_image] = useState("")
  const [errors, setErrors] = useState([]);
  const [serverId, setServerId] = useState(0)
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [server_image, setImageUrl] = useState('')
  const [allowSubmit, setAllowSubmit] = useState(false)

  const { id } = useParams()
  useEffect(() => {
    setServerId(id)
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(server_name.length < 5 || server_name.length > 100){
      setErrors(['Server name must be between 5 and 100 characters'])
    }
    else{
      // const formData = new FormData();
      // formData.append("image", image);
      // setImageLoading(true);
      // const res = await fetch('/api/images', {
      //   method: "POST",
      //   body: formData,
      // });

      // if (res.ok) {
      //   let response = await res.json();
      //   server_image = response.url
      //   setImageLoading(false);
      // }
      // else {
      //   setImageLoading(false);
      //   // a real app would probably use more advanced
      //   // error handling
      // }
      setErrors([])
      await dispatch(serverActions.editOneServer({ serverId, server_name, server_image }))
        .catch(async (res) => {
          const data = await res.json();
          if(data && data.errors.length > 0) setErrors(data.errors)
        })
      history.push(`/servers/${serverId}/channels`)
      return

    }
  }

  function getSignedRequest(file){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/images?file_name="+file.name+"&file_type="+file.type);
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          var response = JSON.parse(xhr.responseText);
          uploadFile(file, response.data, response.url);
        }
        else{
          alert("Could not get signed URL.");
        }
      }
    };
    xhr.send();
  }

  function uploadFile(file, s3Data, url){
    var xhr = new XMLHttpRequest();
     
     
    xhr.open("POST", s3Data.url, {
      headers:{
        'Content-Type': file.type
      }
    });
    var postData = new FormData();
    for(let key in s3Data.fields){
      postData.append(key, s3Data.fields[key]);
    }
    postData.append('file', file);
  
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4){
        if(xhr.status === 200 || xhr.status === 204){
          setImageUrl(url)
          setAllowSubmit(true);
          setImageLoading(false);
        }
        else{
          alert("Could not upload file.");
        }
     }
    };
    xhr.send(postData);
  }

  const updateImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  }

  const dropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let data = e.dataTransfer.files;
     
    setImage(data['0']);
    setImageLoading(true);
    getSignedRequest(data['0']);
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


  return(
    <div className='edit_server_page'>
      <form className='edit_server_form' onSubmit={handleSubmit}>
        <div className='main_section'>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <h1 className='user_auth_welcome'>Edit a Server!</h1>
        <input
          type='hidden'
          value={serverId}
        />
        <div className='edit_server_input'>
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
        <div className='edit_server_input'>
        
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
        {allowSubmit && <button type="submit">Edit Server</button>}
        <button onClick={ () => history.push(`/servers/${serverId}/channels`)}>Cancel</button>
        {(imageLoading) && <p>Loading...</p>}
        </div>
      </form>
    </div>
  )
}

export default EditServerPage
