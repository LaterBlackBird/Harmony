import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as serverActions from '../../store/server'
import { Link, useParams, NavLink } from 'react-router-dom'

function ServerPage() {
  const dispatch = useDispatch()
  const server = useSelector(state => state.server)
  const { serverId } = useParams();
  const [serversArr, setServersArr] = useState(Object.values(server))
  const session = useSelector(state => state.session);
  const user = session.user
  const server_members = server.users
  useEffect(() => {
    dispatch(serverActions.setServers())

  }, [dispatch])
  useEffect(() => {
    setServersArr(Object.values(server))
    console.log(Object.values(server))
    console.log(server)
  }, [dispatch, server])

  return (
    <div id='servers_container'>
      <div className="server_info_block" id='convo_block'>
        <NavLink to={`/servers/0/conversations/${user.id}`} exact={true} activeClassName='active' className='server_image server_icon'>
          <i className="far fa-comments"></i>
        </NavLink>
        <div id="guild_seperator"></div>
      </div>
      {serversArr?.map(server =>
        <div key={server.id} className="server_info_block">
          <Link to={`/servers/${server.id}/channels`} className='server_link'><img className={`server_image ${server.id === parseInt(serverId) ? 'selected' : ''}`} src={server.server_image} alt={server.server_name} /></Link>
          <p className='hide'>{`${server.server_name}`}</p>
        </div>
      )}
      <div className='server_info_block'>
        <Link to={`/servers/new`} className='server_image server_icon'><i className="fas fa-plus"></i></Link>
        <p className='hide'>Add A Server</p>
      </div>
    </div>
  )
}

export default ServerPage;
