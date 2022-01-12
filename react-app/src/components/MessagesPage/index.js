import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as messageActions from '../../store/message';
// import { io } from 'socket.io-client';

// let socket;

function Messages({socket}) {
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

    useEffect(() => {
        // socket = io();

        socket.on('message', async (message) => {
            await dispatch(messageActions.updateMessages(message));
        })

        socket.on('message_delete', async (messageId) => {
            await dispatch(messageActions.removeTheMessage(messageId));
        })

        socket.on('message_edit', async (message) => {
            console.log(message)
            await dispatch(messageActions.updateMessages(message));
        })

        // return (() => {
        //     socket.disconnect();
        // });
    }, [])

    const addMessage = async (e) => {
        e.preventDefault()
        let message = content;
        let data = [channelId, message]
        let res = await dispatch(messageActions.addToMessages(data))
        let messageRes = res;
        console.log(res)
        console.log(socket)
        socket.emit('message', { ...messageRes })
    }

    const deleteMessage = async (id) => {
        console.log('hello')
        await dispatch(messageActions.removeAMessage(id))
        socket.emit('message_delete', { id })
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
        <div id='message_container'>
            <h1>Messages: </h1>
            <ul>{messageComponents}</ul>
            <form onSubmit={addMessage}>
                <input type='text' name='content' onChange={e => setMessage(e.target.value)} value={content}></input>
                <button>Submit</button>
            </form>
        </div>
    )
};

export default Messages;