import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { getAllConversations } from '../../store/conversation';
import { useHistory, Redirect } from 'react-router';


function ConversationsList() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    let history = useHistory()
    const user = useSelector(state => state.session.user);
    const conversations = useSelector(state => Object.values(state.conversation));
    const servers = useSelector(state => Object.values(state.server));



    useEffect(() => {
        dispatch(getAllConversations(userId))
        //if server state is empty, return them to the servers page
        // if (Object.keys(servers).length < 1) {
        //     history.push(`/servers`)
        // }
    }, [dispatch])

    //if user is not logged in and reaches this page, return them to the login page
    if (!user) {
        return <Redirect to='/login' />;
      }


    return (
        <div id='conversations_container'>
            <h1>Conversations:</h1>
            {conversations?.map(conversation =>
            <>
                <h2 key={conversation.id}><Link to={`/conversations/${conversation.id}/messages`}>{`Conversation ${conversation.id}`}</Link></h2>
                {/* <Link to={`/servers/${serverId}/conversations/${conversation.id}/edit`}>Edit</Link> */}
            </>
            )}
            {/* <Link to={`/servers/${serverId}/conversations/new`}>Add A Conversation</Link> */}
        </div>
    )
}

export default ConversationsList;