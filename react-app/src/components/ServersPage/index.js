import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as serverActions from '../../store/server'
import { Link } from 'react-router-dom'

function ServerPage() {
  const dispatch = useDispatch()
  const server = useSelector(state => state.server)
  const session = useSelector(state => state.session);
  const serversArr = Object.values(server)
  const user = session.user

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
    <div id='servers_container'>
      <h1>Servers:</h1>
      {serversArr?.map(server =>
        <>
          <h2 key={server.id}><Link to={`/servers/${server.id}/channels`}>{server.server_name}</Link></h2>
          <Link to={`/servers/edit/${server.id}`}><button onClick={() => refresh()}>Edit Server</button></Link>
          <button onClick={() => sendId(server)}>Delete Server</button>
        </>
        )}
        <br/>
        {session.user &&
          <Link to={`/servers/new`}><button>Create a Server</button></Link>
        }

    </div>
  )
}

export default ServerPage;
