import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as serverActions from '../../store/server'
import { Link, useParams, NavLink } from 'react-router-dom'

function ServerPage() {
  const dispatch = useDispatch()
  const server = useSelector(state => state.server)
  const { serverId } = useParams();
  const serversArr = Object.values(server)
  const session = useSelector(state => state.session);
  const user = session.user
  const server_members = server.users

  useEffect(() => {
    dispatch(serverActions.setServers())
  }, [dispatch, server_members])

  return (
    <div id='servers_container'>
      {serversArr?.map(server =>
        <div key={server.id} className="server_info_block">
          <Link to={`/servers/${server.id}/channels`} className='server_link'><img className={`server_image ${server.id === parseInt(serverId) ? 'selected' : ''}`} src={server.server_image} alt={server.server_name} /></Link>
          <p className='hide'>{`${server.server_name}`}</p>
        </div>
      )}
      <div>
        <Link to={`/servers/new`} id='server_add_icon'><i className="fas fa-plus"></i></Link>
        <p className='hide'>Add A Server</p>
      </div>
      <div>
        <NavLink to={`/servers/0/conversations/${user.id}`} exact={true} activeClassName='active'>
          <i className="far fa-comments"></i>
        </NavLink>
      </div>
    </div>
  )
}

export default ServerPage;
