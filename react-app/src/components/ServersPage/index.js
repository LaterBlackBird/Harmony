import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as serverActions from '../../store/server'
import { Link } from 'react-router-dom'

function ServerPage() {
  const dispatch = useDispatch()
  const servers = useSelector(state => state.server)
  const serversArr = Object.values(servers)

  useEffect(() => {
    dispatch(serverActions.setServers())
  },[dispatch])


  return (
    <div>
      <h1>Servers:</h1>
      {serversArr?.map(server =>
        <h2 key={server.id}><Link to={`/servers/${server.id}/channels`}>{server.server_name}</Link></h2>
        )}
    </div>
  )
}

export default ServerPage;
