import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as messageActions from '../../store/message';
import Message from '../MessagesEditForm';
import { io } from 'socket.io-client';

let socket;

function Messages() {
    const [messages, setMessages] = useState([]);
    const [content, setMessage] = useState([]);
    const [editMessageForm, setEditMessageForm] = useState(false);
    const [editId, setEditId] = useState(null)
    const dispatch = useDispatch();
    const { serverId, channelName, channelId } = useParams();
    const session = useSelector(state => state.session);
    const messageState = useSelector(state => state.message)
    // const [messageToEdit, setMessageToEdit] = useState({'content': 'empty'})
    const currentUser = session.user;
    const [editMessage, setEditMessage] = useState(false);
    const history = useHistory();

     
    
    // useEffect(() => {
    //     const { serverId, channelName, channelId } = useParams();
    // })

    useEffect(() => {
        async function fetchData() {
            await dispatch(messageActions.getAllMessages(channelId));
        }
        fetchData();
    }, [dispatch, channelId]);

    useEffect(() => {
        if (messageState) {
            setMessages(Object.values(messageState))
        }
    }, [messageState])

    useEffect(() => {
        if(socket) {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {

        socket = io();


        socket.on('message', async (message) => {
            if (currentUser.id !== message.user_id) {
                if(!message[0].conversation_id && message[0].channel_id == channelId) {
                    await dispatch(messageActions.updateMessages(message));
                }
            }
        })

        socket.on('message_delete', async (messageId) => {
            await dispatch(messageActions.removeTheMessage(messageId));
        })

        socket.on('message_edit', async (message) => {
            if (currentUser.id !== message.user_id) {
                if(!message[0].conversation_id && message[0].channel_id == channelId) {
                    await dispatch(messageActions.updateMessages(message));
                }
            }
        })

        return (() => {
            socket.disconnect()
        })

    }, [channelId])

    // useEffect(() => {
    //     socket.disconnect()
    // }, [channelId])

    const addMessage = async (e) => {
        e.preventDefault()
        let message = content;
        let data = [channelId, message, currentUser.username, currentUser.profile_image]
        let res = await dispatch(messageActions.addToMessages(data))
        let messageRes = res;
        setMessage([])
        socket.emit('message', { ...messageRes })
    }

    const deleteMessage = async (id) => {
        await dispatch(messageActions.removeAMessage(id))
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
        return (
            <>
                {editId == message.id && <button className='delete_button' onClick={e => deleteMessage(message.id)}>Remove</button>}
                {editId == message.id && <Message socket={socket} message={message} />}
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
        <>
            <div id='message_container'>
                <h1>{channelName}: </h1>
                <ul>{messageComponents}</ul>
                <form className='new_content' onSubmit={addMessage}>
                    <input type='text' name='content' onChange={e => setMessage(e.target.value)} value={content}></input>
                    {/* <button>Submit</button> */}
                </form>
            </div>
            
        </>
    )
};

export default Messages;
