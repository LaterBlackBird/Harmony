//actions
const GET_MESSAGES = 'messages/GET_MESSAGES';
const ADD_MESSAGE = 'messages/ADD_MESSAGE';
const DELETE_MESSAGE = 'messages/DELETE_MESSAGE'

//action creators
const getMessages = (messages) => ({
    type: GET_MESSAGES,
    messages,
});
const addMessage = (message) => ({
    type: ADD_MESSAGE,
    message
});
const deleteMessage = (messageId) => ({
    type: DELETE_MESSAGE,
    messageId
});

//thunks
export const getAllMessages = channelId => async dispatch => {
    const response = await fetch(`/api/channels/${channelId}/messages`);
    const responseData = await response.json();
    dispatch(getMessages(responseData.messages))
}

// export const getAllDirectMessages = conversationId => async dispatch => {
//     const response = await fetch(`/api/conversations/${conversationId}/messages`);
//     const responseData = await response.json();
//     dispatch(getMessages(responseData.messages))
// }

export const addToMessages = (data) => async dispatch => {
    const [ channelId, message, username, image ] = data
    const res = await fetch(`/api/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: message
        }),
    })
    if(res.ok){
        let response = await res.json()
        const messageAndUserInfo = [response, username, image]
        dispatch(addMessage(messageAndUserInfo))

        return response;
    }
}

export const editAMessage = (data) => async dispatch => {
    const [messageId, content] = data;
    const res = await fetch(`/api/messages/${messageId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content
        }),
    })
    if(res.ok){
        let response = await res.json()
        // dispatch(addMessage(response))
        return response;
    }
}

export const updateMessages = (message) => async dispatch => {
    dispatch(addMessage(message))
}

export const removeAMessage = id => async dispatch => {
    const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
    })
    if(res.ok){
        dispatch(deleteMessage(id))
    }
}

export const removeTheMessage = (id) => async dispatch => {
    dispatch(deleteMessage(id.id))
}


//reducer
const messageReducer = (state = null, action) => {
    let newState = {};
    switch (action.type) {
        case GET_MESSAGES:
            action.messages.forEach(message => {
                const key = message[0].id;
                newState[key] = message;
            })
            if(action.messages[0][0].id == 0) {
                return newState = {}
            }
            return newState;
        case ADD_MESSAGE:
            newState = {...state};
            newState[action.message[0].id] = action.message;
            return newState
        case DELETE_MESSAGE:
            newState = {...state};
            delete newState[action.messageId];
            return newState;
        default:
            return state;
    }
}

export default messageReducer;
