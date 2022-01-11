import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as messageActions from '../../store/message'

function Message() {
    const [content, setMessage] = useState([]);
    const { messageId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/messages/${messageId}`);
            const responseData = await response.json();
            setMessage(responseData.content.content)
        }
        fetchData()
    }, [messageId])

    const editMessage = async () => {
        let data = [messageId, content]
        await dispatch(messageActions.editAMessage(data))
    }
    return (
        <>
            <form onSubmit={editMessage}>
                <input type='text' name='content' onChange={e => setMessage(e.target.value)} value={content}></input>
                <button>Submit</button>
            </form>
        </>
    )
}

export default Message;