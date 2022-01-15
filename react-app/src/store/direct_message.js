//actions
const GET_MESSAGES = 'direct_messages/GET_MESSAGES';
// const RESET_MESSAGES = 'messages/RESET_MESSAGES';
const ADD_MESSAGE = 'direct_messages/ADD_MESSAGE';
const DELETE_MESSAGE = 'direct_messages/DELETE_MESSAGE'

//action creators
const getMessages = (messages) => ({
    type: GET_MESSAGES,
    messages,
});
// const resetMessages = () => ({
//     type: GET_MESSAGES,
// });
const addMessage = (message) => ({
    type: ADD_MESSAGE,
    message
});
const deleteMessage = (messageId) => ({
    type: DELETE_MESSAGE,
    messageId
});

//thunks
// export const getAllMessages = (data) => async dispatch => {
//     const {conversationId, userId} = data;
//     const response = await fetch(`/api/conversations/${conversationId}/messages/${userId}`);
//     const responseData = await response.json();
//     dispatch(getMessages(responseData.messages))
//     // else {
//     //     dispatch(resetMessages())
//     // }
// }

export const getAllDirectMessages = data => async dispatch => {
    console.log('.........................hey')
    const {conversationId, userId} = data;
    console.log(conversationId, userId)
    const response = await fetch(`/api/conversations/${conversationId}/messages/${userId}`);
    const responseData = await response.json();
    console.log(responseData)
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

// export const resetAllMessages = () => async dispatch => {
//     dispatch(resetMessages())
// }

export const editAMessage = (data) => async dispatch => {
    console.log(data)
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
        console.log(response)
        // dispatch(addMessage(response))
        return response;
    }
}

export const updateMessages = (message) => async dispatch => {
    console.log('sup')
    dispatch(addMessage(message))
}

export const removeAMessage = id => async dispatch => {
    const res = await fetch(`/api/direct_messages/${id}`, {
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
const directMessageReducer = (state = null, action) => {
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
        // case RESET_MESSAGES:
        //     newState = {}
        //     return newState
        default:
            return state;
    }
}

export default directMessageReducer;
