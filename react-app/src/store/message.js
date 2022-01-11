//actions
const GET_MESSAGE = 'messages/GET_MESSAGE';
const GET_MESSAGES = 'messages/GET_MESSAGES';
const ADD_MESSAGE = 'messages/ADD_MESSAGE';
const EDIT_MESSAGE = 'messages/EDIT_MESSAGE';
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
const editMessage = (message) => ({
    type: EDIT_MESSAGE,
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

export const addToMessages = (data) => async dispatch => {
    const [ channelId, message ] = data
    console.log('hello again')
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

        dispatch(addMessage(response))
    }
}

//reducer
const messageReducer = (state = null, action) => {
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
        case EDIT_MESSAGE:

        case DELETE_MESSAGE:
        
        default:
            return state;
    }
}

export default messageReducer;