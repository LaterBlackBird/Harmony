import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { getAllChannels } from '../../store/channel';
import { useHistory, Redirect } from 'react-router';
import * as serverActions from '../../store/server'



function ChannelsList() {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    let history = useHistory()
    const user = useSelector(state => state.session.user);
    const channels = useSelector(state => Object.values(state.channel));
    const servers = useSelector(state => Object.values(state.server));
    const session = useSelector(state => state.session);
    const currentUser = session?.user.id


    const joinServerButton = () => {
        const userId = currentUser
        return dispatch(serverActions.joinAServer({ userId, serverId }))
    }

    const joinServerAdminButton = () => {
        const userId = currentUser
        return dispatch(serverActions.joinAsAdmin({ userId, serverId }))
    }

    const sendId = async (serverId) => {
        await dispatch(serverActions.deleteAServer(serverId))
        dispatch(serverActions.setServers())
        history.push('/servers')
    }

    useEffect(() => {
        if (serverId) {
            dispatch(getAllChannels(serverId))
        }

        //if server state is empty, return them to the servers page
        if (Object.keys(servers).length < 1) {
            history.push(`/servers`)
        }
    }, [dispatch, serverId, history])

    //if user is not logged in and reaches this page, return them to the login page
    if (!user) {
        return <Redirect to='/login' />;
    }

    let serverSelected;
    if (window.location.href.endsWith('/servers')) {
        serverSelected = false;
    } else serverSelected = true;

    return (
        <div id='channels_container'>
            <h1>Channels:</h1>
            {serverSelected &&
                channels.map(channel =>
                    <div key={channel.id}>
                        <h2><Link to={`/servers/${serverId}/channels/${channel.id}/messages`}>{channel.channel_name}</Link></h2>
                        <Link to={`/servers/${serverId}/channels/${channel.id}/edit`}>Edit</Link>
                    </div>
                )}
            {serverSelected && <Link to={`/servers/${serverId}/channels/new`}>Add A Channel</Link>}
            {!serverSelected && <h3>Select A Server</h3>}


            <div className="serverOptions">
                {serverSelected &&
                    <>
                        <button onClick={joinServerButton}>Join this Server!</button>
                        <button onClick={joinServerAdminButton}>Join as Admin!</button>
                        <button><Link to={`/servers/edit/${serverId}`} style={{color:'black'}}>Edit Server</Link></button>
                        <button onClick={() => sendId(serverId)}>Delete Server</button>
                    </>
                }
            </div>

        </div>
    )
}

export default ChannelsList;
