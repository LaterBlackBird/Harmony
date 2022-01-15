import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { getAllConversations, deleteThisConversation } from '../../store/conversation';
import { useHistory, Redirect } from 'react-router';
import * as conversationActions from '../../store/conversation';



function ConversationsList() {
    const { serverId, userId } = useParams();
    const dispatch = useDispatch();
    let history = useHistory()
    const user = useSelector(state => state.session.user);
    const conversations = useSelector(state => state.conversation);
    // const otherUsers = useSelector(state => Object.values(state.conversation)
    const servers = useSelector(state => Object.values(state.server));
    const [convoUsers, setConvoUsers] = useState([])
    const [convos, setConvos] = useState([])
    const [editButtons, setEditButtons] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    let [users, setUsers] = useState(null)
    let [displayUsers, setDisplayUsers] = useState(false)
    const session = useSelector(state => state.session);
    const currentUser = session?.user.id




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
        if (conversations['users']) {
            setConvoUsers([...conversations['users']])
            delete conversations['users']
            setConvos(Object.values(conversations))
            // conversations = null
        }
    }, [conversations])

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`/api/users/${searchValue}`);
            const responseData = await response.json();
            setUsers(responseData.users)
        }
        if (!(/^\s+$/.test(searchValue)) && searchValue !== '') {
            fetchData();
        } else setUsers(null)
    }, [searchValue])

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

    const startConversation = async ({ userId }) => {
        let res = await dispatch(conversationActions.addNewConversation({ from_user: currentUser, to_user: userId }))
        await dispatch(getAllConversations(currentUser))
        history.push(`/servers/0/conversations/${currentUser}/${res.id}/messages`)
    }

    const deleteConversation = async (conversationId) => {
        const userId = user.id
        await dispatch(deleteThisConversation({ conversationId, userId }))
        history.push(`/servers/${serverId}/conversations/${user.id}`)
        await dispatch(getAllConversations(userId))
    }
    return (
        <div id='conversations_container'>
            <div id="server_title_block" onClick={() => setEditButtons(!editButtons)}>
                <h4>Conversations</h4>
                <i className="fas fa-sort-down"></i>
            </div>

            <div className="serverOptions">
                {editButtons &&
                    <>
                        {displayUsers && (
                            <input type='text' onChange={e => setSearchValue(e.target.value)} value={searchValue} placeholder='username'></input>
                        )}
                        {users && users.map((user) =>
                            <div key={user.id} className="users_info_block">
                                <div onClick={() => startConversation({ userId: user.id })} className='member_result'>
                                    <img className='member_search_image' src={user.profile_image} alt={user.username} />
                                    <p>{`${user.username}`}</p>
                                </div>
                            </div>
                        )}
                        <button onClick={() => {
                            setDisplayUsers(!displayUsers)
                            setSearchValue('')
                        }}>Search for User</button>


                    </>
                }
            </div>


            {convos?.map(conversation => {
                let otherUser = convoUsers.filter(user => user.id === conversation.to_user || user.id === conversation.from_user)
                if (otherUser[0]) {
                    return (
                        <div key={conversation.id} className='channel_name_block'>

                            <Link
                                to={`/servers/${serverId}/conversations/${user.id}/${conversation.id}/messages`} >
                                <div className="channel_link">
                                    <span>
                                        {otherUser[0].username}
                                    </span>
                                    <button onClick={() => deleteConversation(conversation.id)} className='hide'><i className="fas fa-trash-alt hide"></i></button>
                                </div>
                            </Link>


                            {/* <h2 key={conversation.id}><Link to={`/servers/${serverId}/conversations/${user.id}/${conversation.id}/messages`}>{otherUser[0].username}</Link></h2>
                            <button onClick={() => deleteConversation(conversation.id)}>Delete</button> */}
                            {/* <Link to={`/servers/${serverId}/conversations/${conversation.id}/edit`}>Edit</Link> */}


                        </div>
                    )
                } else return null;
            }
            )}
            {/* <Link to={`/servers/${serverId}/conversations/new`}>Add A Conversation</Link> */}
        </div>
    )
}

export default ConversationsList;
