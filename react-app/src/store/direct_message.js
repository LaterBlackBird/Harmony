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
export const getAllMessages = conversationId => async dispatch => {
    const response = await fetch(`/api/conversations/${conversationId}/messages`);
    const responseData = await response.json();
    dispatch(getMessages(responseData.messages))
}

export const getAllDirectMessages = conversationId => async dispatch => {
    const response = await fetch(`/api/conversations/${conversationId}/messages`);
    const responseData = await response.json();
    dispatch(getMessages(responseData.messages))
}

export const addToMessages = (data) => async dispatch => {
    const [ conversationId, message, username, image ] = data
    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
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
    const res = await fetch(`/api/direct_messages/${messageId}`, {
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
        console.log(response)
        return response;
    }
}

export const updateMessages = (message) => async dispatch => {
    dispatch(addMessage(message))
}

export const removeAMessage = id => async dispatch => {
    const res = await fetch(`/api/direct_messages/${id}`, {
        method: 'DELETE'
    })
    console.log(res.ok)
    if(res.ok){
        dispatch(deleteMessage(id))
    }
}

export const removeTheMessage = (id) => async dispatch => {
    console.log(id)
    dispatch(deleteMessage(id.id))
}


//reducer
const directMessageReducer = (state = null, action) => {
    let newState = {};
    switch (action.type) {
        case GET_MESSAGES:
            action.messages.forEach(message => {
                const key = message.id;
                newState[key] = message;
            })
            return newState;
        case ADD_MESSAGE:
            console.log(action)
            newState = {...state};
            newState[action.message.id] = action.message;
            return newState
        case DELETE_MESSAGE:
            newState = {...state};
            delete newState[action.messageId];
            return newState;
        default:
            return state;
    }
}

export default directMessageReducer;