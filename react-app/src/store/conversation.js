// Action types
const GET_CONVERSATIONS = 'conversations/GET_CONVERSATIONS'
const ADD_CONVERSATION = 'conversations/ADD_CONVERSATION'
const DELETE_CONVERSATION = 'conversations/DELETE_CONVERSATION'
const EDIT_CONVERSATION = 'conversations/EDIT_CONVERSATION'



// Actions
const loadConversations = (conversations) => {
    return {
        type: GET_CONVERSATIONS,
        conversations
    }
}

const addConversation = (newConversation) => {
    return {
        type: ADD_CONVERSATION,
        newConversation
    }
}

const deleteConversation = (conversationId) => {
    return {
        type: DELETE_CONVERSATION,
        conversationId
    }
}

const editConversation = (editedConversation) => {
    return {
        type: EDIT_CONVERSATION,
        editedConversation
    }
}


// Thunk action creators
// Retrieve information from the database
export const getAllConversations = userId => async (dispatch) => {
    const response = await fetch(`/api/conversations/${userId}`);
    if (response.ok) {
        const allConversations = await response.json();
        dispatch(loadConversations(allConversations.conversations));
    }
}

export const addNewConversation = conversationInfo => async (dispatch) => {
    const { from_user, to_user } = conversationInfo
    const response = await fetch(`/api/conversations/${from_user}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({to_user})
    });
    if (response.ok) {
        const conversation = await response.json();
        dispatch(addConversation(conversation));
        return conversation;
    }
}

export const deleteThisConversation = conversationId => async (dispatch) => {
    const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        dispatch(deleteConversation(conversationId));
    }
}

export const editThisConversation = conversationInfo => async (dispatch) => {
    const { conversationId, conversation_name } = conversationInfo
    const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({conversation_name})
    });
    if (response.ok) {
        const updatedConversation = await response.json();
        dispatch(editConversation(updatedConversation));
        return updatedConversation;
    }
}



// Reducer
// Replace state with database information from thunk
const conversationReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_CONVERSATIONS:
            // normalize data
            const allConversations = {};
            action.conversations.forEach(conversation => {
                allConversations[conversation.id] = conversation;
            });
            return {
                ...allConversations,
                ...state,
            };
        case ADD_CONVERSATION:
            const addState = {...state};
            addState[action.newConversation.id]=action.newConversation;
            return addState;
        case DELETE_CONVERSATION:
            const deleteState = { ...state };
            delete deleteState[action.conversationId];
            return deleteState;
        case EDIT_CONVERSATION:
            const editState = {...state};
            editState[action.editedConversation.id] = action.editedConversation;
            return editState;
        default:
            return state;
    }
}


export default conversationReducer;