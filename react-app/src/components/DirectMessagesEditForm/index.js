import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import * as messageActions from '../../store/message'
import * as directMessageActions from '../../store/direct_message'
import { useHistory, Redirect } from 'react-router-dom';

function DirectMessage({socket, directMessageId}) {
    const [content, setContent] = useState([]);
    const [messageData, setMessageData] = useState([]);
    
    // const { directMessageId } = useParams();
    const dispatch = useDispatch();
    const messages = useSelector(state => state.message)
    const history = useHistory()
    useEffect(() => {
        if(messages) {
            setContent(messages[directMessageId].content)
            setMessageData(messages[directMessageId])
        }
    }, [directMessageId])
    
    useEffect(() => {
        

    }, [])

    const editMessage = async (e) => {
        e.preventDefault()
        let data = [directMessageId, content]
        let res = await dispatch(directMessageActions.editAMessage(data))
        let messageRes = res;
        socket.emit('message_edit', { ...messageRes })
        history.push(`/servers/0/conversations/${messageData.conversation_id}/messages`)
        
    }
    return (
        <>
            <form onSubmit={editMessage}>
                <input type='text' name='content' onChange={e => setContent(e.target.value)} value={content}></input>
                <button>Submit</button>
            </form>
        </>
    )
}

export default DirectMessage;