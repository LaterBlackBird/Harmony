import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as serverActions from '../../store/server'
import { Link, useParams } from 'react-router-dom'

function ServerByIdPage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const server = useSelector(state => state.server)
  const session = useSelector(state => state.session);
  const currentUser = session?.user.id

  const joinServerButton = () => {
    const serverId = server[0]?.id
    const userId = currentUser
    return dispatch(serverActions.joinAServer({ userId, serverId }))
  }


  useEffect(() => {
    dispatch(serverActions.getOneServer(id))
  },[dispatch])

  return(
    <div>
      <img src={server[0]?.server_image}></img>
      <h1>{server[0]?.server_name}</h1>
      <h2>This is my server</h2>
      <h2>I am just typing to see if this works!</h2>
      <button onClick={joinServerButton}>Join this Server!</button>
    </div>
  )
}

export default ServerByIdPage;
