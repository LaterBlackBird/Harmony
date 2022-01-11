import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Message() {
    const [content, setMessage] = useState([]);
    const { messageId } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/messages/${messageId}`);
            const responseData = await response.json();
            setMessage(responseData.content)
        }
    }, [messageId])

    const editMessage = async () => {
        console.log(JSON.stringify({ content }))
        const res = await fetch(`/messages/${messageId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content
            }),
        })
    }
    return (
        <form onSubmit={editMessage}>
            <input type='text' name='content' onChange={e => setMessage(e.target.value)} value={content}></input>
            <button>Submit</button>
        </form>
    )
}

export default Message;