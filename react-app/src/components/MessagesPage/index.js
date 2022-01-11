import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as messageActions from '../../store/message'

function Messages() {
    const [messages, setMessages] = useState([]);
    const [content, setMessage] = useState([]);
    const dispatch = useDispatch();
    const { channelId } = useParams();
    const session = useSelector(state => state.session);
    const messageState = useSelector(state => state.message)
    const currentUser = session.user;
    useEffect(() => {
        async function fetchData() {
            await dispatch(messageActions.getAllMessages(channelId));
        }
        fetchData();
        
        
    }, [dispatch, channelId]);
    
    useEffect(() => {
        if(messageState){
            setMessages(Object.values(messageState))
        }
    }, [messageState])

    const addMessage = async (e) => {
        e.preventDefault()
        console.log('hello')
        let message = content;
        let data = [channelId, message]
        await dispatch(messageActions.addToMessages(data))
    }

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