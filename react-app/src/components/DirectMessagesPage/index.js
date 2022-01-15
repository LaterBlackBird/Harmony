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
    const messageState = useSelector(state => state.direct_message)
    const currentUser = session.user;

    useEffect(() => {
        async function fetchData() {
            const userId = currentUser.id
            // await dispatch(directMessageActions.resetAllMessages())
            await dispatch(directMessageActions.getAllDirectMessages({conversationId, userId}));
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
            await dispatch(directMessageActions.updateMessages(message));
        })

        socket.on('message_delete', async (messageId) => {
            await dispatch(directMessageActions.removeTheMessage(messageId));
        })

        socket.on('message_edit', async (message) => {
            await dispatch(directMessageActions.updateMessages(message));
        })

        // return (() => {
        //     socket.disconnect();
        // });
    }, [])

    const addMessage = async (e) => {
        e.preventDefault()
        let message = content;
        let data = [conversationId, message, currentUser.username, currentUser.profile_image]
        let res = await dispatch(directMessageActions.addToMessages(data))
        let messageRes = res;
        setMessage([])
        socket.emit('message', { ...messageRes })
    }

    const deleteMessage = async (id) => {
        await dispatch(directMessageActions.removeAMessage(id))
        socket.emit('message_delete', { id })
    }

    const buttons = (message) => {
        return (
            <>
                {!editMessageForm && (
                    <>
                        <button id={message.id} onClick={e => {
                            setEditMessageForm(true)
                            setEditId(message.id)
                        }}>Edit</button>
                        <button onClick={e => deleteMessage(message.id)}>Delete</button>
                    </>
                )}
                {editMessageForm && editId == message.id && (
                    <button id={message.id} onClick={e => {
                        setEditMessageForm(false)
                        setEditId(null)
                    }}>Close Edit</button>
                )}
            </>
        )
    }

    const showForm = (message) => {
        const directMessage = message;
        return (
            <>
                {editId == message.id && <DirectMessage socket={socket} directMessage={directMessage} />}
                {editId == message.id && <button onClick={e => deleteMessage(message.id)}>Delete</button>}
            </>
        )
    }

    const messageComponents = messages.map((message) => {
        return (
            <li key={message[0].id} className='message_content' 
                onMouseEnter={() => {
                    setEditMessageForm(true)
                    setEditId(message[0].id) 
                }} 
                onMouseLeave={() => {
                    setEditMessageForm(false)
                    setEditId(null)
                }}>
                <div>
                    <img src={message[2]} alt="" />
                </div>
                <div>
                <p>{message[1]}</p>
                    { message[0].id != editId && <p>{message[0].content}</p>}
                    {editMessageForm && currentUser.id != message[0].user_id && message[0].id == editId && <p>{message[0].content}</p>}
                    {editMessageForm && currentUser.id === message[0].user_id && showForm(message[0])}
                    {/* {currentUser.id === message[0].user_id && buttons(message[0])} */}
                </div>
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
