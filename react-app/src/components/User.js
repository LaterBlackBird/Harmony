import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as conversationActions from '../store/conversation'

function User() {
  const [user, setUser] = useState({});
  const { userId }  = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!userId) {
      return;
    }
    (async () => {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      setUser(user);
    })();
  }, [userId]);
  if (!user) {
    return null;
  }

  const startConversation = async () => {
    let res = await dispatch(conversationActions.addNewConversation({from_user:sessionUser.id, to_user:userId}))
    console.log(res)
    history.push(`/conversations/${res.id}/messages`)
  }

  const button = (
    <li>
      <button onClick={startConversation}>Start Conversation</button>
    </li>
  )

  return (
    <ul>
      <li>
        <strong>User Id</strong> {userId}
      </li>
      <li>
        <strong>Username</strong> {user.username}
      </li>
      <li>
        <strong>Email</strong> {user.email}
      </li>
      {sessionUser.id !== userId && button}
      
    </ul>
  );
}
export default User;
