// Action types
const GET_CHANNELS = 'channels/GET_CHANNELS'
const ADD_CHANNEL = 'channels/ADD_CHANNEL'
const DELETE_CHANNEL = 'channels/DELETE_CHANNEL'
const EDIT_CHANNEL = 'channels/EDIT_CHANNEL'



// Actions
const loadChannels = (channels) => {
    return {
        type: GET_CHANNELS,
        channels
    }
}

const addChannel = (newChannel) => {
    return {
        type: ADD_CHANNEL,
        newChannel
    }
}

const deleteChannel = (channelId) => {
    return {
        type: DELETE_CHANNEL,
        channelId
    }
}

const editChannel = (editedChannel) => {
    return {
        type: EDIT_CHANNEL,
        editedChannel
    }
}


// Thunk action creators
// Retrieve information from the database
export const getAllChannels = serverId => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels`);
    if (response.ok) {
        const allChannels = await response.json();
        dispatch(loadChannels(allChannels.channels));
    }
}

export const addNewChannel = channelInfo => async (dispatch) => {
    const { serverId, channel_name } = channelInfo
    const response = await fetch(`/api/servers/${serverId}/channels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({channel_name})
    });
    if (response.ok) {
        const channel = await response.json();
        dispatch(addChannel(channel));
        return channel;
    }
}

export const deleteThisChannel = channelId => async (dispatch) => {
    const response = await fetch(`/api/channels/${channelId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        dispatch(deleteChannel(channelId));
    }
}

export const editThisChannel = channelInfo => async (dispatch) => {
    const { channelId, channel_name } = channelInfo
    const response = await fetch(`/api/channels/${channelId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({channel_name})
    });
    if (response.ok) {
        const updatedChannel = await response.json();
        dispatch(editChannel(updatedChannel));
        return updatedChannel;
    }
}



// Reducer
// Replace state with database information from thunk
const channelReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_CHANNELS:
            // normalize data
            const allChannels = {};
            action.channels.forEach(channel => {
                allChannels[channel.id] = channel;
            });
            return {
                ...allChannels,
                ...state,
            };
        case ADD_CHANNEL:
            const addState = {...state};
            addState[action.newChannel.id]=action.newChannel;
            return addState;
        case DELETE_CHANNEL:
            const deleteState = { ...state };
            delete deleteState[action.channelId];
            return deleteState;
        case EDIT_CHANNEL:
            const editState = {...state};
            editState[action.editedChannel.id] = action.editedChannel;
            return editState;
        default:
            return state;
    }
}


export default channelReducer;
