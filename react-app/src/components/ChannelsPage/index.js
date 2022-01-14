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
    const session = useSelector(state => state.session);
    const [searchValue, setSearchValue] = useState('')
    let [users, setUsers] = useState(null)
    let [displayUsers, setDisplayUsers] = useState(false)
    const currentUser = session?.user.id
    let [members, setMembers] = useState(null)
    const [addAdmin, setAddAdmin] = useState(false)

    async function fetchData() {
        const res = await fetch(`/api/users/members/${serverId}`)
        const responseData = await res.json()
        console.log(responseData)
        setMembers(responseData.users)
    }

    const joinServerButton = async ({userId}) => {
        setUsers(null)
        setDisplayUsers(false)
        await dispatch(serverActions.joinAServer({ userId, serverId }))
        fetchData()
        return
    }

    const joinServerAdminButton = async ({userId}) => {
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

        //if server state is empty, return them to the servers page
        if (Object.keys(servers).length < 1) {
            history.push(`/servers`)
        }
    }, [dispatch, serverId, history])

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`/api/users/${searchValue}`);
            const responseData = await response.json();
            setUsers(responseData.users)
        }
        if(!(/^\s+$/.test(searchValue)) && searchValue !== ''){
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
        const server = servers.filter(server => server.id === parseInt(serverId))

        if(server[0]?.users.length > 0){
            return false
        }
        else{
            return true
        }
    }

    const startConversation = async ({userId}) => {
        let res = await dispatch(conversationActions.addNewConversation({from_user:currentUser, to_user:userId}))
        history.push(`/servers/0/conversations/${res.id}/messages`)
    }

    return (
        <>
            <div id='channels_container'>
                <h1>Channels:</h1>
                {serverSelected &&
                    channels.map(channel =>
                        <div key={channel.id}>
                            <h2><Link to={`/servers/${serverId}/channels/${channel.id}/messages`}>{channel.channel_name}</Link></h2>
                            <Link to={`/servers/${serverId}/channels/${channel.id}/edit`}>Edit</Link>
                        </div>
                    )}
                {serverSelected && <Link to={`/servers/${serverId}/channels/new`}>Add A Channel</Link>}
                {!serverSelected && <h3>Select A Server</h3>}


                <div className="serverOptions">
                    {serverSelected &&
                        <>  
                            {users && users.map((user) => 
                                <div>
                                    <div key={user.id} className="users_info_block">
                                        <a onClick={() => joinServerButton({userId: user.id})} className='server_a'>
                                            <img className={`server_image ${user.id === parseInt(serverId) ? 'selected' : ''}`} src={user.profile_image} alt={user.username} /></a>
                                        <p>{`${user.username}`}</p>
                                    </div>
                                </div>
                            )}
                            { displayUsers && (
                                <input type='text' onChange={e => setSearchValue(e.target.value)} value={searchValue}></input>
                            )}
                            <button onClick={() => {
                                setDisplayUsers(!displayUsers)
                                setSearchValue('')
                            }}>Add Server Member</button>
                            {hideButton() === true &&
                                <button onClick={joinServerAdminButton}>Join as Admin!</button>
                            }
                            <button><Link to={`/servers/edit/${serverId}`} style={{color:'black'}}>Edit Server</Link></button>
                            <button onClick={() => sendId(serverId)}>Delete Server</button>
                            <div>
                                <button onClick={() => setAddAdmin(!addAdmin)}>Add Admin</button>
                            </div>
                            {addAdmin && members && serverSelected && members.map((user) => 
                                <div>
                                    <div key={user.id} className="member_info_block">
                                        <a onClick={() => joinServerAdminButton({userId: user.id})} className='server_a'>
                                            <img className={`server_image`} src={user.profile_image} alt={user.username} /></a>
                                        <p>{`${user.username}`}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    }
                </div>

            </div>
            <div id='members_container'>
                {members && serverSelected && members.map((user) => 
                    <div>
                        <div key={user.id} className="member_info_block">
                            <a onClick={() => startConversation({userId: user.id})} className='server_a'>
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
