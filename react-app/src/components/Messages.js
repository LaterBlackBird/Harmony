import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function Messages() {
    const [messages, setMessages] = useState([]);
    const [content, setMessage] = useState([]);
    const [displayEdit, setDisplayEdit] = useState(false);
    const { channelId } = useParams();
    const session = useSelector(state => state.session);
    const currentUser = session.user;
    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`/api/channels/${channelId}/messages`);
            const responseData = await response.json();
            setMessages(responseData.messages)
        }
        fetchData();
    }, [channelId]);

    const addMessage = async () => {
        console.log(JSON.stringify({ content }))
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

    // const submitEditMessage = async () => {
        
    // }

    // const build = async () => {
    //     return (
    //         // <>
    //         //     <input type='text'></input>
    //         //     <button>Submit</button>
    //         // </>
    //         <p>Hello</p>
    //     )
    // }
    const deleteMessage = async (id) => {
        fetch(`/api/messages/${id}`, {
            method: 'DELETE'
        })
    }

    const buttons = (message) => {
        return (
            <>
                <NavLink to={`/messages/${message.id}`} exact={true} activeClassName='active'>
                    Edit
                </NavLink>
                <button onClick={e => deleteMessage(message.id)}>Delete</button>
            </>
        )
    }

    const messageComponents = messages.map((message) => {
        return (
            <li key={message.id}>
                <p>{message.content}</p>
                {currentUser.id == message.user_id && buttons(message)}
            </li>
        )
    });

    return (
        <>
            <h1>Messages: </h1>
            <ul>{messageComponents}</ul>
            <form onSubmit={addMessage}>
                <input type='text' name='content' onChange={e => setMessage(e.target.value)} value={content}></input>
                <button>Submit</button>
            </form>
        </>
    )
};

export default Messages;