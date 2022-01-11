import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as serverActions from '../../store/server'
import { useHistory } from 'react-router';


function CreateServerPage(){
  const dispatch = useDispatch();
  const [server_name, setServer_name] = useState("")
  const [server_image, setServer_image] = useState("")
  const [errors, setErrors] = useState([]);

  let history = useHistory()
  const handleSubmit = (e) => {
    e.preventDefault();
    if(server_name.length < 5 || server_name.length > 100){
      setErrors(['Server name must be between 5 and 100 characters'])
    }
    else if(server_image.length < 5 || server_image.length > 100)
    {
      setErrors(['The server image url must be between 5 and 100 characters'])
    }
    else{
      setErrors([])
      history.push('/servers')
      return dispatch(serverActions.createAServer({ server_name, server_image }))
        .catch(async (res) => {
          const data = await res.json();
          if(data && data.errors.length > 0) setErrors(data.errors)
        })

    }
  }

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <h1>Create a Server!</h1>
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
        <label>
          Server Image
          <input
            type="text"
            name='server_image'
            value={server_image}
            onChange={(e) => setServer_image(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create Event</button>
      </form>
    </div>
  )
}

export default CreateServerPage;
