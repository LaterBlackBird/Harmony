import { csrfFetch } from './csrf';

// Action types
const GET_CHANNELS = 'channels/GET_CHANNELS'
// const ADD_CHANNEL = 'channels/ADD_CHANNEL'
// const DELETE_CHANNEL = 'channels/DELETE_CHANNEL'
// const EDIT_CHANNEL = 'channels/EDIT_CHANNEL'



// Actions
const loadChannels = (allChannels) => {
    return {
        type: GET_CHANNELS,
        allChannels
    }
}

// const addChannel = (newChannel) => {
//     return {
//         type: ADD_CHANNEL,
//         newChannel
//     }
// }

// const deleteChannel = (channelId) => {
//     return {
//         type: DELETE_CHANNEL,
//         channelId
//     }
// }

// const editChannel = (editedChannel) => {
//     return {
//         type: EDIT_CHANNEL,
//         editedChannel
//     }
// }


// Thunk action creators
// Retrieve information from the database
export const getAllChannels = serverId => async (dispatch) => {
    const response = await csrfFetch(`/api/servers/${serverId}/channels`);
    if (response.ok) {
        const allChannels = await response.json();
        dispatch(loadChannels(allChannels));
    }
}

// export const addNewComment = newComment => async (dispatch) => {
//     const response = await csrfFetch('/api/comments', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newComment)
//     });
//     if (response.ok) {
//         const comment = await response.json();
//         dispatch(addComment(comment));
//         return comment;
//     }
// }

// export const deleteThisComment = commentId => async (dispatch) => {
//     const response = await csrfFetch(`/api/comments/${commentId}`, {
//         method: 'DELETE',
//     });
//     if (response.ok) {
//         dispatch(deleteComment(commentId));
//     }
// }

// export const editThisComment = editedComment => async (dispatch) => {
//     const response = await csrfFetch(`/api/comments/${editedComment.commentId}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(editedComment)
//     });
//     if (response.ok) {
//         const updatedComment = await response.json();
//         dispatch(editComment(updatedComment));
//         return updatedComment;
//     }
// }



const sortList = (list) => {
    return list.sort((commentA, commentB) => {
      return commentA.id - commentB.id;
    });
  };

// Reducer
// Replace state with database information from thunk
const channelReducer = (state = { channelsArray: [] }, action) => {
    switch (action.type) {
        case GET_CHANNELS:
            const allChannels = {};
            action.channelsArray.allChannels.forEach(channel => {
                allChannels[channel.id] = channel;
            });
            return {
                ...allChannels,
                ...state,
                channelsArray: sortList(action.channels)
            };
        // case ADD_COMMENT:
        //     const prevState = {...state};
        //     prevState[action.newComment.id]=action.newComment;
        //     prevState.commentArray.push(action.newComment);
        //     prevState.commentArray = sortList(prevState.commentArray)
        //     return prevState;
        // case DELETE_COMMENT:
        //     const newState = { ...state };
        //     delete newState[action.commentId];
        //     newState.commentArray = newState.commentArray.filter(
        //         comment => comment.id !== action.commentId
        //         )
        //     return newState;
        // case EDIT_COMMENT:
        //     const editState = {...state};
        //     editState[action.editedComment.id] = action.editedComment;
        //     editState.commentArray = editState.commentArray.filter(
        //         comment => comment.id !== action.editedComment.id
        //     );
        //     editState.commentArray.push(action.editedComment);
        //     editState.commentArray = sortList(editState.commentArray)
        //     return editState;
        default:
            return state;
    }
}


export default channelReducer;
