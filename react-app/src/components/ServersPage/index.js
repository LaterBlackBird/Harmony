import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as serverActions from '../../store/server'
import { Link, useParams } from 'react-router-dom'

function ServerPage() {
  const dispatch = useDispatch()
  const server = useSelector(state => state.server)
  const { serverId } = useParams();
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
    <div id='servers_container'>
      {/* <h1>Servers:</h1> */}
      {serversArr?.map(server =>
        <>
          <Link to={`/servers/${server.id}/channels`}><img className={`server_image ${server.id === serverId ? 'selected' : ''}`} src={server.server_image} alt={server.server_name} /></Link>
          {/* <h2 key={server.id}><Link to={`/servers/${server.id}/channels`}>{server.server_name}</Link></h2>
          <Link to={`/servers/edit/${server.id}`}><button onClick={() => refresh()}>Edit Server</button></Link>
          <button onClick={() => sendId(server)}>Delete Server</button> */}
        </>
        )}
      <Link to={`/servers/new`}>Add a Server</Link>
    </div>
  )
}

export default ServerPage;
