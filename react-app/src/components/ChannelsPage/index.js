import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { getAllChannels } from '../../store/channel';
import { useHistory } from 'react-router';


function ChannelsList() {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    let history = useHistory()
    const channels = useSelector(state => {
        return Object.values(state.channel);
    })

    const servers = useSelector(state => {
        return Object.values(state.server);
    })


    useEffect(() => {
        dispatch(getAllChannels(serverId))
        //if user has entered a url without clicking through the site, return them to the servers page
        if (Object.keys(servers).length < 1) {
            history.push(`/servers`)
        }
    }, [dispatch])


    return (
        <div>
            <h1>Channels:</h1>
            {channels?.map(channel =>
                <h2 key={channel.id}><Link to={`/servers/${serverId}/channels/${channel.id}/edit`}>{channel.channel_name}</Link></h2>
            )}
            <Link to={`/servers/${serverId}/channels/new`}>Add A Channel</Link>
        </div>
    )
}

export default ChannelsList;
