import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { getAllChannels } from '../../store/channel';


function ChannelsList() {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    const channels = useSelector(state => {
        return Object.values(state.channel);
    })


    useEffect(() => {
        dispatch(getAllChannels(serverId))
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
