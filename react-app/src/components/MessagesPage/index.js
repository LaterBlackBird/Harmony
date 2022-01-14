import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as messageActions from '../../store/message';
import * as conversationActions from '../../store/conversation'
import Message from '../MessagesEditForm';

function Messages({ socket }) {
    const [messages, setMessages] = useState([]);
    const [content, setMessage] = useState([]);
    const [editMessageForm, setEditMessageForm] = useState(false);
    const [editId, setEditId] = useState(null)
    const dispatch = useDispatch();
    const { serverId, channelId } = useParams();
    const session = useSelector(state => state.session);
    const messageState = useSelector(state => state.message)
    // const [messageToEdit, setMessageToEdit] = useState({'content': 'empty'})
    const currentUser = session.user;
    const [users, setUsers] = useState(null);
    const history = useHistory();
    

    useEffect(() => {
        async function fetchData() {
            await dispatch(messageActions.getAllMessages(channelId));
            const res = await fetch(`/api/users/members/${serverId}`)
            const responseData = await res.json()
            console.log(responseData)
            setUsers(responseData.users)
        }
        fetchData();
    }, [dispatch, channelId]);

    useEffect(() => {
        if (messageState) {
            setMessages(Object.values(messageState))
        }
    }, [messageState])

    useEffect(() => {

        socket.on('message', async (message) => {
            if (currentUser.id !== message.user_id) {
                await dispatch(messageActions.updateMessages(message));
            }
        })

        socket.on('message_delete', async (messageId) => {
            await dispatch(messageActions.removeTheMessage(messageId));
        })

        socket.on('message_edit', async (message) => {
            if (currentUser.id !== message.user_id) {
                await dispatch(messageActions.updateMessages(message));
            }
        })

    }, [])

    const addMessage = async (e) => {
        e.preventDefault()
        let message = content;
        let data = [channelId, message, currentUser.username, currentUser.profile_image]
        let res = await dispatch(messageActions.addToMessages(data))
        let messageRes = res;
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
                {editId == message.id && <Message socket={socket} messageId={message.id} />}
            </>
        )
    } 

    const messageComponents = messages.map((message) => {
        return (
            <li key={message[0].id}>
                <div>
                    <img src={message[2]} alt="" />
                </div>
                <div>
                    <p>{message[1]}</p>
                    <p>{message[0].content}</p>
                    {editMessageForm && showForm(message[0])}
                    {currentUser.id === message[0].user_id && buttons(message[0])}
                </div>
            </li>
        )
    });

    const startConversation = async ({userId}) => {
        let res = await dispatch(conversationActions.addNewConversation({from_user:currentUser.id, to_user:userId}))
        console.log(res)
        history.push(`/servers/0/conversations/${res.id}/messages`)
    }

    return (
        <>
            <div id='message_container'>
                <h1>Messages: </h1>
                <ul>{messageComponents}</ul>
                <form onSubmit={addMessage}>
                    <input type='text' name='content' onChange={e => setMessage(e.target.value)} value={content}></input>
                    <button>Submit</button>
                </form>
            </div>
            <div id='members_container'>
                {users && users.map((user) => 
                    <div>
                        <div key={user.id} className="server_info_block">
                            <a onClick={() => startConversation({userId: user.id})} className='server_a'>
                                <img className={`server_image`} src={user.profile_image} alt={user.username} /></a>
                            <p>{`${user.username}`}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
};

export default Messages;
