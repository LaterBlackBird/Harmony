import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as directMessageActions from '../../store/direct_message'
import { useHistory, Redirect } from 'react-router-dom';

function DirectMessage({socket, directMessage}) {
    const [content, setContent] = useState([]);
    const [messageData, setMessageData] = useState([]);
    // const { directMessage.id } = useParams();
    const dispatch = useDispatch();
    const messages = useSelector(state => state.message)
    const history = useHistory()
    useEffect(() => {
        if(directMessage) {
            console.log('hey')
            setContent(directMessage.content)
            setMessageData(directMessage)
        }
    }, [directMessage])


    return (
        <>
            <form>
                <textarea name='content' onChange={async e => {
                    setContent(e.target.value)
                    
                }}
                onMouseOut={async e => {
                    let content = e.target.value
                    const messageId = directMessage.id
                    let data = [messageId, content]
                    let res = await dispatch(directMessageActions.editAMessage(data))
                    let messageRes = res;
                    socket.emit('message_edit', { ...messageRes })
                }} value={content}></textarea>
            </form>
        </>
    )
}

export default DirectMessage;