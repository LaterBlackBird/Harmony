import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { getAllConversations, deleteThisConversation } from '../../store/conversation';
import { useHistory, Redirect } from 'react-router';


function ConversationsList() {
    const { serverId, userId } = useParams();
    const dispatch = useDispatch();
    let history = useHistory()
    const user = useSelector(state => state.session.user);
    const conversations = useSelector(state => state.conversation);
    // const otherUsers = useSelector(state => Object.values(state.conversation)
    const servers = useSelector(state => Object.values(state.server));
    const [convoUsers, setConvoUsers] =  useState([])
    const [convos, setConvos] =  useState([])



    useEffect(() => {
        async function fetchData() {
            await dispatch(getAllConversations(userId))
        }
        fetchData();
        //if server state is empty, return them to the servers page
        // if (Object.keys(servers).length < 1) {
        //     history.push(`/servers`)
        // }
    }, [])
    
    useEffect(() => {
        if(conversations['users']) {
            setConvoUsers([...conversations['users']])
            delete conversations['users']
            setConvos(Object.values(conversations))
            // conversations = null
        }
    }, [conversations])

    //if user is not logged in and reaches this page, return them to the login page
    if (!user) {
        return <Redirect to='/login' />;
    }

    // const getOtherUser = async (convo) => {
    //     console.log(userId === convo.to_user)
    //     if(userId === convo.to_user) { 
    //         const response = await fetch(`/api/users/${convo.from_user}`);
    //         const from_user = await response.json();
    //         setOtherUser(from_user);
    //     } else {
    //         const response = await fetch(`/api/users/${convo.to_user}`);
    //         const to_user = await response.json();
    //         setOtherUser(to_user);
    //     }
    //     // console.log(otherUser)
    // }

    const deleteConversation = async (conversationId) => {
        const userId = user.id
        await dispatch(deleteThisConversation({conversationId, userId}))
        history.push(`/servers/${serverId}/conversations/${user.id}`)
        await dispatch(getAllConversations(userId))
    }
    return (
        <div id='conversations_container'>
            <h1>Conversations:</h1>
            {convos?.map((conversation) => {
                let otherUser = convoUsers.filter(user => user.id === conversation.to_user || user.id === conversation.from_user)
                if(otherUser[0]) {
                    return (
                        <>
                            <h2 key={conversation.id}><Link to={`/servers/${serverId}/conversations/${user.id}/${conversation.id}/messages`}>{otherUser[0].username}</Link></h2>
                            <button onClick={() => deleteConversation(conversation.id)}>Delete</button>
                            {/* <Link to={`/servers/${serverId}/conversations/${conversation.id}/edit`}>Edit</Link> */}
                        </>
                    )  
                }
            }
            )}
            {/* <Link to={`/servers/${serverId}/conversations/new`}>Add A Conversation</Link> */}
        </div>
    )
}

export default ConversationsList;