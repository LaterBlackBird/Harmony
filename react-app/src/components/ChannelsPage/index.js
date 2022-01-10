import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { getAllChannels } from '../../store/channel';


function ChannelsList() {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    const channelArray = useSelector(state => {
        return state.channel.channelsArray;
    })

    useEffect(() => {
        dispatch(getAllChannels(serverId))
    }, [dispatch])


    return (
        <div>
            <h1>Servers:</h1>
            {channelArray?.map(channel =>
                <h2 key={channel.id}><Link to={`/servers/${serverId}/channels/${channel.id}`}>{channel.channel_name}</Link></h2>
            )}
        </div>
    )
}

export default ChannelsList;
