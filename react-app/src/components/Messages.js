import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'

function Messages() {
    const [messages, setMessages] = useState([]);
    const [content, setMessage] = useState([]);
    const { channelId } = useParams();

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`/api/channels/${channelId}/messages`);
            const responseData = await response.json();
            setMessages(responseData.messages)
        }
        fetchData();
    }, [channelId]);

    const addMessage = async () => {
        const res = await fetch(`/api/channels/${channelId}/messages`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content
            }),
        })
    }

    const messageComponents = messages.map((message) => {
        return (
            <li key={message.id}>
                <p>{message.content}</p>
            </li>
        )
    });

    return (
        <>
            <h1>Messages: </h1>
            <ul>{messageComponents}</ul>
            <form onSubmit={addMessage}>
                <input type='text' name='content' onChange={e => setMessage(e.value)} value={content}></input>
                <button>Submit</button>
            </form>
        </>
    )
};

export default Messages;