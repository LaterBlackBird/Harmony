import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { getAllChannels } from '../../store/channel';
import { useHistory, Redirect } from 'react-router';
import * as serverActions from '../../store/server';
import * as conversationActions from '../../store/conversation';




function ChannelsList() {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    let history = useHistory()
    const user = useSelector(state => state.session.user);
    const channels = useSelector(state => Object.values(state.channel));
    const servers = useSelector(state => Object.values(state.server))
    const server = servers.filter(server => server.id === parseInt(serverId))
    const session = useSelector(state => state.session);
    const [searchValue, setSearchValue] = useState('')
    let [users, setUsers] = useState(null)
    let [displayUsers, setDisplayUsers] = useState(false)
    const currentUser = session?.user.id
    let [members, setMembers] = useState(null)
    const [addAdmin, setAddAdmin] = useState(false)
    const [editButtons, setEditButtons] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    async function fetchData() {
        const res = await fetch(`/api/users/members/${serverId}`)
        const responseData = await res.json()
        console.log(responseData)
        setMembers(responseData.users)
    }

    const joinServerButton = async ({ userId }) => {
        setUsers(null)
        setEditButtons(false)
        setDisplayUsers(false)
        await dispatch(serverActions.joinAServer({ userId, serverId }))
        fetchData()
        return
    }

    const joinServerAdminButton = async ({ userId }) => {
        // const userId = currentUser
        await dispatch(serverActions.joinAsAdmin({ userId, serverId }))
        fetchData()
    }

    const sendId = async (serverId) => {
        await dispatch(serverActions.deleteAServer(serverId))
        dispatch(serverActions.setServers())
        history.push('/servers')
    }

    useEffect(() => {
        if (serverId) {
            dispatch(getAllChannels(serverId))
            fetchData()
        }

<<<<<<< HEAD
=======
        history.listen((location) => {
            setEditButtons(false)
         })

>>>>>>> main


        //if server state is empty, return them to the servers page
        if (Object.keys(servers).length < 1) {
            history.push(`/servers`)
        }

        document.title = `Harmony / ${server[0]?.server_name}`

    }, [dispatch, serverId, history])

    useEffect(() => {
        console.log(members, currentUser)
        if (serverId) {
            async function fetchData() {
                let res = await fetch(`/api/users/${currentUser}/${serverId}/validate_admin`)
                let responseData = await res.json();
                if (responseData.admin) {
                    console.log('hello')
                    setIsAdmin(responseData.admin)
                } else setIsAdmin(false)
                console.log(isAdmin)
            }
            fetchData()
        }

    }, [members])

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

    let serverSelected;
    if (window.location.href.endsWith('/servers')) {
        serverSelected = false;
    } else serverSelected = true;

    const hideButton = () => {
        if (server[0]?.users.length > 0) {
            return false
        }
        else {
            return true
        }
    }

    const isMember = () => {
        const server = servers.filter(server => server.id === parseInt(serverId))
        const member = server[0]?.users.filter((user) => user.id === currentUser)
        // console.log(member.length > 0 === true)
        if(member?.length > 0 === true){
            return true
        }
        else{
            return false
        }

    }

        const startConversation = async ({ userId }) => {
        let res = await dispatch(conversationActions.addNewConversation({ from_user: currentUser, to_user: userId }))
        history.push(`/servers/0/conversations/${res.id}/messages`)
    }

    return (

        <>
            <div id='channels_container'>
                <div id='server_title_block' onClick={isAdmin ? () => setEditButtons(!editButtons) : null}>
                    {serverSelected && <h4>{server[0]?.server_name}</h4>}
                    {serverSelected && isAdmin && <i class="fas fa-sort-down"></i>}
                    {!serverSelected && <h4>Select A Server</h4>}
                </div>
                {serverSelected &&
                    channels.map(channel =>
                        <div key={channel.id} className='channel_name_block'>
                            <Link to={`/servers/${serverId}/channels/${channel.id}/messages`} ><span className='channel_link'><i className="fas fa-hashtag"></i> {channel.channel_name.toLowerCase()}</span></Link>
                            {isAdmin && (
                                <Link to={`/servers/${serverId}/channels/${channel.id}/edit`}><button>Edit</button></Link>
                            )}
                        </div>
                    )}
                {serverSelected && isAdmin && <Link to={`/servers/${serverId}/channels/new`}><button>Add A Channel</button></Link>}
                {!serverSelected && <h3>Select A Server</h3>}


                <div className="serverOptions">
                    {serverSelected && editButtons &&
                        <>
                            <button onClick={(e) => {
                                e.stopPropagation()
                                history.push(`/servers/${serverId}/channels/new`)
                            }}>Add A Channel</button>

                            {displayUsers && (
                                <input type='text' onChange={e => setSearchValue(e.target.value)} value={searchValue}></input>
                            )}
                            {users && users.map((user) =>
                                <div key={user.id} className="users_info_block">
                                    <div onClick={() => joinServerButton({ userId: user.id })} className='member_result'>
                                        <img className='member_search_image' src={user.profile_image} alt={user.username} />
                                        <p>{`${user.username}`}</p>
                                    </div>
                                </div>
                            )}
                            <button onClick={() => {
                                setDisplayUsers(!displayUsers)
                                setSearchValue('')
                            }}>Add Server Member</button>

                            {hideButton() === true &&
                                <div>
                                    <button onClick={joinServerAdminButton}>Join as Admin!</button>
                                </div>
                            }
                            <button><Link to={`/servers/edit/${serverId}`}>Edit Server</Link></button>
                            <button onClick={() => sendId(serverId)}>Delete Server</button>
                            <button onClick={() => setAddAdmin(!addAdmin)}>Add Admin</button>
                            {addAdmin && members && serverSelected && members.map((user) =>
                                <div key={user.id} className="user_info_block">
                                    <div onClick={() => joinServerAdminButton({ userId: user.id })} className='member_result'>
                                        <img className={`member_search_image`} src={user.profile_image} alt={user.username} />
                                        <p>{`${user.username}`}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    }
                </div>


                <div id="channel_list">
                    {serverSelected &&
                        channels.map(channel =>
                            <div key={channel.id} className='channel_name_block'>
                                <Link
                                    to={`/servers/${serverId}/channels/${channel.id}/messages`} >
                                    <div className="channel_link">
                                        <span>
                                            <i className="fas fa-hashtag"></i>
                                            {channel.channel_name.toLowerCase()}
                                        </span>
                                        {isAdmin && (
                                            <Link to={`/servers/${serverId}/channels/${channel.id}/edit`} className='hide'><i className="fas fa-cog hide"></i></Link>
                                        )}
                                    </div>
                                </Link>

                            </div>
                        )}
                </div>
            </div>


            <div id='members_container'>
                {members && serverSelected && members.map((user) =>
                    <div>
                        <div key={user.id} className="member_info_block">
                            <a onClick={() => startConversation({ userId: user.id })} className='server_a'>
                                <img className={`server_image`} src={user.profile_image} alt={user.username} /></a>
                            <p>{`${user.username}`}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ChannelsList;
