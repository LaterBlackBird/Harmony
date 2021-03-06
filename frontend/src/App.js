import React, { useState, useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import ServerPage from './components/ServersPage';
import ServerByIdPage from './components/ServerByIdPage';
import CreateServerPage from './components/CreateServerPage';
import EditServerPage from './components/EditServerPage';
import User from './components/User';
import Messages from './components/MessagesPage';
import DirectMessages from './components/DirectMessagesPage';
import DirectMessage from './components/DirectMessagesEditForm';
import Message from './components/MessagesEditForm';
import ChannelsList from './components/ChannelsPage';
import CreateChannel from './components/CreateChannelForm';
import EditChannel from './components/EditChannelForm';
import ConversationsList from './components/ConversationPage';
import { authenticate } from './store/session';
import SplashPage from './components/SplashPage';



function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <NavBar />
          <SplashPage />
        </Route>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/servers/new' exact={true}>
          <CreateServerPage />
        </ProtectedRoute>
        <ProtectedRoute path='/servers/edit/:id' exact={true}>
          <EditServerPage />
        </ProtectedRoute>
        <ProtectedRoute path='/servers/:id' exact={true}>
          <ServerByIdPage />
        </ProtectedRoute>
        <ProtectedRoute path='/servers/:serverId/channels/:channelId/edit'>
          <EditChannel />
        </ProtectedRoute>
        <ProtectedRoute path='/servers/:serverId/channels/new'>
          <CreateChannel />
        </ProtectedRoute>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute>


        <ProtectedRoute path='/servers' exact={true}>
          <div id='main_page'>
            <NavBar />
            <ServerPage />
            <ChannelsList />
          </div>
        </ProtectedRoute>
        <ProtectedRoute exact path='/servers/:serverId/channels'>
          <div id='main_page'>
            <NavBar />
            <ServerPage />
            <ChannelsList />
          </div>
        </ProtectedRoute>
        <ProtectedRoute path='/servers/:serverId/channels/:channelName/:channelId/messages' exact={true} >
          <div id='main_page'>
            <NavBar />
            <ServerPage />
            <ChannelsList />
            <Messages />
          </div>
        </ProtectedRoute>
        <ProtectedRoute path='/messages/:messageId' exact={true} >
          <Message />
        </ProtectedRoute>
        <ProtectedRoute path='/servers/:serverId/conversations/:userId' exact={true} >
          <div id='main_page'>
            <NavBar />
            <ServerPage />
            <ConversationsList/>
          </div>
        </ProtectedRoute>
        <ProtectedRoute path='/servers/:serverId/conversations/:userId/:conversationId/messages' exact={true} >
          <div id='main_page'>
            <NavBar />
            <ServerPage />
            <ConversationsList/>
            <DirectMessages />
          </div>
        </ProtectedRoute>
        <ProtectedRoute path='/direct_messages/:directMessageId' exact={true} >
          <DirectMessage />
        </ProtectedRoute>
        <ProtectedRoute path='/' >
          <Redirect to='/servers' />
        </ProtectedRoute>

      </Switch>
    </BrowserRouter >
  );
}

export default App;
