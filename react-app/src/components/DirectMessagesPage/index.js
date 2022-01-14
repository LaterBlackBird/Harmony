import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as directMessageActions from '../../store/direct_message';
import * as messageActions from '../../store/message';
import DirectMessage from '../DirectMessagesEditForm';
// import { io } from 'socket.io-client';

// let socket;

function Messages({socket}) {
    const [messages, setMessages] = useState([]);
    const [content, setMessage] = useState([]);
    const [editMessageForm, setEditMessageForm] = useState(false);
    const [editId, setEditId] = useState(null)
    const dispatch = useDispatch();
    const { serverId, conversationId } = useParams();
    const session = useSelector(state => state.session);
    const messageState = useSelector(state => state.message)
    const currentUser = session.user;

    useEffect(() => {
        async function fetchData() {
            await dispatch(directMessageActions.getAllMessages(conversationId));
        }
        fetchData();


    }, [dispatch, conversationId]);

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
            await dispatch(messageActions.updateMessages(message));
        })

        // return (() => {
        //     socket.disconnect();
        // });
    }, [])

    const addMessage = async (e) => {
        e.preventDefault()
        let message = content;
        let data = [conversationId, message]
        let res = await dispatch(directMessageActions.addToMessages(data))
        let messageRes = res;
        socket.emit('message', { ...messageRes })
    }

    const deleteMessage = async (id) => {
        await dispatch(directMessageActions.removeAMessage(id))
        socket.emit('message_delete', { id })
    }

    const buttons = (message) => {
        return (
            <>
                <button id={message.id} onClick={e => {
                    setEditMessageForm(true)
                    setEditId(message.id)
                }}>Edit</button>
                <button onClick={e => deleteMessage(message.id)}>Delete</button>
            </>
        )
    }

    const showForm = (message) => {
        return (
            <>
                {editMessageForm && <DirectMessage socket={socket} directMessageId={message.id} />}
            </>
        )
    }

    const messageComponents = messages.map((message) => {
        return (
            <li key={message.id}>
                <p>{message.content}</p>
                {message.id == editId && showForm(message)}
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
