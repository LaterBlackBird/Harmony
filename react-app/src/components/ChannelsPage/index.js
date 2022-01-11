import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { getAllChannels } from '../../store/channel';
import { useHistory, Redirect } from 'react-router';


function ChannelsList() {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    let history = useHistory()
    const user = useSelector(state => state.session.user);
    const channels = useSelector(state => Object.values(state.channel));
    const servers = useSelector(state => Object.values(state.server));



    useEffect(() => {
        dispatch(getAllChannels(serverId))
        //if server state is empty, return them to the servers page
        if (Object.keys(servers).length < 1) {
            history.push(`/servers`)
        }
    }, [dispatch])

    //if user is not logged in and reaches this page, return them to the login page
    if (!user) {
        return <Redirect to='/login' />;
      }


    return (
        <div id='channels_container'>
            <h1>Channels:</h1>
            {channels?.map(channel =>
                <h2 key={channel.id}><Link to={`/servers/${serverId}/channels/${channel.id}/edit`}>{channel.channel_name}</Link></h2>
            )}
            <Link to={`/servers/${serverId}/channels/new`}>Add A Channel</Link>
        </div>
    )
}

export default ChannelsList;
