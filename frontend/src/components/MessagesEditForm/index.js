import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as messageActions from '../../store/message'
import { useHistory, Redirect } from 'react-router-dom';

function Message({socket, message}) {
    const [content, setContent] = useState([]);
    const [messageData, setMessageData] = useState([]);
    // const { message.id } = useParams();
    const dispatch = useDispatch();
    const messages = useSelector(state => state.message)
    const history = useHistory()
    useEffect(() => {
        if(message) {
            setContent(message.content)
            setMessageData(message)
        }
    }, [message])

    return (
        <>
            <form>
                <textarea name='content' onChange={async e => {
                    setContent(e.target.value)
                    
                }}
                onMouseOut={async e => {
                    let content = e.target.value
                    const messageId = message.id
                    let data = [messageId, content]
                    let res = await dispatch(messageActions.editAMessage(data))
                    let messageRes = res;
                    socket.emit('message_edit', { ...messageRes })
                }} value={content}></textarea>
            </form>
        </>
    )
}

export default Message;