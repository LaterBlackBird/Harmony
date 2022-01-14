import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as messageActions from '../../store/message'
import { useHistory, Redirect } from 'react-router-dom';

function Message({socket, messageId}) {
    const [content, setContent] = useState([]);
    const [messageData, setMessageData] = useState([]);
    // const { messageId } = useParams();
    const dispatch = useDispatch();
    const messages = useSelector(state => state.message)
    const history = useHistory()
    useEffect(() => {
        if(messages) {
            setContent(messages[messageId].content)
            setMessageData(messages[messageId])
        }
    }, [messageId])
    
    useEffect(() => {
        

    }, [])

    const editMessage = async (e) => {
        e.preventDefault()
        let data = [messageId, content]
        let res = await dispatch(messageActions.editAMessage(data))
        let messageRes = res;
        socket.emit('message_edit', { ...messageRes })
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

export default Message;