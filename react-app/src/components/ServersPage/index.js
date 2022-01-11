import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as serverActions from '../../store/server'
import { Link } from 'react-router-dom'

function ServerPage() {
  const dispatch = useDispatch()
  const server = useSelector(state => state.server)
  const serversArr = Object.values(server)

  useEffect(() => {
    dispatch(serverActions.setServers())
  },[dispatch])

  const sendId = async (server) => {
    await dispatch(serverActions.deleteAServer(server.id))
    dispatch(serverActions.setServers())
  }

  const refresh = () => {
    dispatch(serverActions.setServers())
  }

  return (
    <div>
      <h1>Servers:</h1>
      {serversArr?.map(server =>
        <>
          <h2 key={server.id}><Link to={`/servers/${server.id}`}>{server.server_name}</Link></h2>
          <Link to={`/servers/edit/${server.id}`}><button onClick={() => refresh()}>Edit Server</button></Link>
          <button onClick={() => sendId(server)}>Delete Server</button>
        </>
        )}
    </div>
  )
}

export default ServerPage;
